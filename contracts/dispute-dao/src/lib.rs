//! DisputeDAO — BhoomiChain Soroban Smart Contract
//!
//! DAO-based dispute resolution for contested land attestations.
//! Verifiers vote to uphold or overturn challenged parcel attestations.
//! Majority vote wins; losing minority verifiers have reputation penalized.

#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype,
    Address, Env, String,
    panic_with_error,
    symbol_short,
};

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum ContractError {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    Unauthorized = 3,
    DisputeAlreadyExists = 4,
    DisputeNotFound = 5,
    IllegalStatusTransition = 6,
    AlreadyVoted = 7,
    VotingClosed = 8,
    QuorumNotMet = 9,
}

// ---------------------------------------------------------------------------
// Storage Keys
// ---------------------------------------------------------------------------

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Dispute(u64),
    DisputeCount,
    Voted(u64, Address), // (dispute_id, voter_address)
}

// ---------------------------------------------------------------------------
// Status State Machine
// ---------------------------------------------------------------------------

/// Dispute lifecycle states.
///
/// Valid transitions:
/// - `Open` → `Resolved`    via `resolve()` after quorum reached
/// - `Open` → `Dismissed`   via `dismiss()` (admin, if fraudulent challenge)
#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum DisputeStatus {
    Open = 0,
    Resolved = 1,
    Dismissed = 2,
}

impl DisputeStatus {
    /// Validates and returns the next status. Errors on illegal transitions.
    pub fn transition_to(&self, new: DisputeStatus) -> Result<DisputeStatus, ContractError> {
        match (self, &new) {
            (DisputeStatus::Open, DisputeStatus::Resolved) => Ok(new),
            (DisputeStatus::Open, DisputeStatus::Dismissed) => Ok(new),
            _ => Err(ContractError::IllegalStatusTransition),
        }
    }
}

// ---------------------------------------------------------------------------
// Data Structures
// ---------------------------------------------------------------------------

#[contracttype]
#[derive(Clone)]
pub struct DisputeRecord {
    pub parcel_id: u64,
    pub challenger: Address,
    pub reason: String,
    pub uphold_votes: u32,
    pub overturn_votes: u32,
    pub quorum_required: u32,
    pub status: DisputeStatus,
    pub outcome_upheld: bool,
}

// ---------------------------------------------------------------------------
// Contract
// ---------------------------------------------------------------------------

#[contract]
pub struct DisputeDAO;

#[contractimpl]
impl DisputeDAO {
    /// Initializes the DisputeDAO contract.
    ///
    /// # Parameters
    /// - `admin`: The privileged admin address (BhoomiChain multisig).
    ///
    /// # Panics
    /// - If already initialized.
    ///
    /// # Events
    /// - None
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().persistent().has(&DataKey::Admin) {
            panic_with_error!(&env, ContractError::AlreadyInitialized);
        }
        admin.require_auth();
        env.storage().persistent().set(&DataKey::Admin, &admin);
        env.storage().persistent().set(&DataKey::DisputeCount, &0u64);
    }

    /// Raises a dispute against an attested parcel.
    ///
    /// # Parameters
    /// - `parcel_id`: The ID of the contested parcel.
    /// - `challenger`: Address of the entity challenging the attestation.
    /// - `reason`: Human-readable reason for the challenge.
    /// - `quorum_required`: Minimum total votes required to resolve (e.g. 5).
    ///
    /// # Returns
    /// - `u64` — newly allocated dispute ID.
    ///
    /// # Panics
    /// - If contract not initialized.
    ///
    /// # Events
    /// - `DisputeRaised { dispute_id, parcel_id, challenger }`
    pub fn raise_dispute(
        env: Env,
        parcel_id: u64,
        challenger: Address,
        reason: String,
        quorum_required: u32,
    ) -> u64 {
        challenger.require_auth();

        if !env.storage().persistent().has(&DataKey::Admin) {
            panic_with_error!(&env, ContractError::NotInitialized);
        }

        let mut count: u64 = env
            .storage()
            .persistent()
            .get(&DataKey::DisputeCount)
            .expect("dispute_count_not_set");
        let dispute_id = count.checked_add(1).expect("dispute_id_overflow");
        count = dispute_id;

        let record = DisputeRecord {
            parcel_id,
            challenger: challenger.clone(),
            reason,
            uphold_votes: 0,
            overturn_votes: 0,
            quorum_required,
            status: DisputeStatus::Open,
            outcome_upheld: false,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Dispute(dispute_id), &record);
        env.storage()
            .persistent()
            .set(&DataKey::DisputeCount, &count);

        env.events().publish(
            (symbol_short!("disputed"), challenger),
            (dispute_id, parcel_id),
        );

        dispute_id
    }

    /// Casts a vote on an open dispute.
    ///
    /// # Parameters
    /// - `dispute_id`: ID of the dispute.
    /// - `voter`: Address of the voting verifier.
    /// - `uphold`: True to uphold the original attestation, false to overturn.
    ///
    /// # Panics
    /// - If dispute not Open.
    /// - If voter has already voted on this dispute.
    ///
    /// # Events
    /// - `VoteCast { dispute_id, voter, uphold }`
    pub fn vote(env: Env, dispute_id: u64, voter: Address, uphold: bool) {
        voter.require_auth();

        // Prevent double-voting
        let voted_key = DataKey::Voted(dispute_id, voter.clone());
        if env.storage().temporary().has(&voted_key) {
            panic_with_error!(&env, ContractError::AlreadyVoted);
        }

        let key = DataKey::Dispute(dispute_id);
        let mut record: DisputeRecord = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::DisputeNotFound));

        if record.status != DisputeStatus::Open {
            panic_with_error!(&env, ContractError::VotingClosed);
        }

        if uphold {
            record.uphold_votes = record
                .uphold_votes
                .checked_add(1)
                .expect("uphold_votes_overflow");
        } else {
            record.overturn_votes = record
                .overturn_votes
                .checked_add(1)
                .expect("overturn_votes_overflow");
        }

        env.storage().persistent().set(&key, &record);
        env.storage().temporary().set(&voted_key, &true);

        env.events().publish(
            (symbol_short!("vote"), dispute_id),
            (voter, uphold),
        );
    }

    /// Resolves an Open dispute after quorum is reached.
    ///
    /// Majority vote decides outcome. If tied, attestation is upheld.
    ///
    /// # Parameters
    /// - `dispute_id`: ID of the dispute.
    ///
    /// # Returns
    /// - `bool` — true if attestation upheld, false if overturned.
    ///
    /// # Panics
    /// - If caller is not admin.
    /// - If dispute is not Open.
    /// - If quorum is not met.
    ///
    /// # Events
    /// - `DisputeResolved { dispute_id, upheld, uphold_votes, overturn_votes }`
    pub fn resolve(env: Env, dispute_id: u64) -> bool {
        let admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::NotInitialized));
        admin.require_auth();

        let key = DataKey::Dispute(dispute_id);
        let mut record: DisputeRecord = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::DisputeNotFound));

        if record.status != DisputeStatus::Open {
            panic_with_error!(&env, ContractError::VotingClosed);
        }

        let total_votes = record
            .uphold_votes
            .checked_add(record.overturn_votes)
            .expect("total_votes_overflow");

        if total_votes < record.quorum_required {
            panic_with_error!(&env, ContractError::QuorumNotMet);
        }

        let next = record
            .status
            .transition_to(DisputeStatus::Resolved)
            .unwrap_or_else(|_| panic_with_error!(&env, ContractError::IllegalStatusTransition));

        // Tie goes to uphold
        record.outcome_upheld = record.uphold_votes >= record.overturn_votes;
        record.status = next;
        env.storage().persistent().set(&key, &record);

        env.events().publish(
            (symbol_short!("resolved"), dispute_id),
            (record.outcome_upheld, record.uphold_votes, record.overturn_votes),
        );

        record.outcome_upheld
    }

    /// Dismisses a fraudulent or baseless dispute (admin-only).
    ///
    /// # Parameters
    /// - `dispute_id`: ID of the dispute.
    ///
    /// # Panics
    /// - If caller is not admin.
    /// - If dispute is not Open.
    ///
    /// # Events
    /// - `DisputeDismissed { dispute_id }`
    pub fn dismiss(env: Env, dispute_id: u64) {
        let admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::NotInitialized));
        admin.require_auth();

        let key = DataKey::Dispute(dispute_id);
        let mut record: DisputeRecord = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::DisputeNotFound));

        let next = record
            .status
            .transition_to(DisputeStatus::Dismissed)
            .unwrap_or_else(|_| panic_with_error!(&env, ContractError::IllegalStatusTransition));

        record.status = next;
        env.storage().persistent().set(&key, &record);

        env.events().publish(symbol_short!("dismissed"), dispute_id);
    }

    /// Returns the full DisputeRecord for a given dispute ID.
    ///
    /// # Parameters
    /// - `dispute_id`: ID to look up.
    ///
    /// # Panics
    /// - If dispute not found.
    pub fn get_dispute(env: Env, dispute_id: u64) -> DisputeRecord {
        env.storage()
            .persistent()
            .get(&DataKey::Dispute(dispute_id))
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::DisputeNotFound))
    }
}

#[cfg(test)]
mod test;
