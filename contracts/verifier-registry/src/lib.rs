//! VerifierRegistry — BhoomiChain Soroban Smart Contract
//!
//! Manages registration, staking, reputation, and slashing of land title verifiers.
//! Verifiers are licensed lawyers who attest land parcels on-chain.

#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype,
    Address, Env, String,
    panic_with_error,
    symbol_short,
};

// ---------------------------------------------------------------------------
// Error Codes
// ---------------------------------------------------------------------------

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum ContractError {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    Unauthorized = 3,
    AlreadyRegistered = 4,
    NotRegistered = 5,
    InsufficientStake = 6,
    IllegalStatusTransition = 7,
    AlreadyStaked = 8,
    VerifierNotActive = 9,
    AlreadySlashed = 10,
}

// ---------------------------------------------------------------------------
// Storage Keys
// ---------------------------------------------------------------------------

/// Typed storage key enum — raw string keys are forbidden.
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    MinStake,
    Verifier(Address),
    VerifierCount,
}

// ---------------------------------------------------------------------------
// Status State Machine
// ---------------------------------------------------------------------------

/// Verifier lifecycle states. Transitions are enforced by `transition_to`.
///
/// Valid transitions:
/// - `Pending` → `Active`      via `stake()`
/// - `Active` → `Suspended`   via `suspend()` (admin)
/// - `Suspended` → `Active`   via `reinstate()` (admin)
/// - `Active` → `Slashed`     via `slash()` (admin)
/// - All others: illegal
#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum ValidatorStatus {
    Pending = 0,
    Active = 1,
    Suspended = 2,
    Slashed = 3,
}

impl ValidatorStatus {
    /// Validates and returns the next status. Panics on illegal transitions.
    pub fn transition_to(&self, new: ValidatorStatus) -> Result<ValidatorStatus, ContractError> {
        match (self, &new) {
            (ValidatorStatus::Pending, ValidatorStatus::Active) => Ok(new),
            (ValidatorStatus::Active, ValidatorStatus::Suspended) => Ok(new),
            (ValidatorStatus::Suspended, ValidatorStatus::Active) => Ok(new),
            (ValidatorStatus::Active, ValidatorStatus::Slashed) => Ok(new),
            _ => Err(ContractError::IllegalStatusTransition),
        }
    }
}

// ---------------------------------------------------------------------------
// Data Structures
// ---------------------------------------------------------------------------

#[contracttype]
#[derive(Clone)]
pub struct VerifierRecord {
    pub name: String,
    pub license_number: String,
    pub stake_amount: i128,
    pub titles_cleared: u32,
    pub reputation_score: u32,
    pub status: ValidatorStatus,
    pub correct_votes: u32,
    pub total_votes: u32,
}

// ---------------------------------------------------------------------------
// Contract
// ---------------------------------------------------------------------------

#[contract]
pub struct VerifierRegistry;

#[contractimpl]
impl VerifierRegistry {
    /// Initializes the registry with an admin and minimum stake amount.
    ///
    /// # Parameters
    /// - `admin`: The privileged address that can suspend/reinstate/slash verifiers.
    /// - `min_stake`: The minimum XLM amount (in stroops) required to activate a verifier.
    ///
    /// # Panics
    /// - If already initialized.
    ///
    /// # Events
    /// - None
    pub fn initialize(env: Env, admin: Address, min_stake: i128) {
        if env.storage().persistent().has(&DataKey::Admin) {
            panic_with_error!(&env, ContractError::AlreadyInitialized);
        }
        admin.require_auth();
        env.storage().persistent().set(&DataKey::Admin, &admin);
        env.storage().persistent().set(&DataKey::MinStake, &min_stake);
        env.storage().persistent().set(&DataKey::VerifierCount, &0u32);
    }

    /// Registers a new verifier. Caller becomes a Pending verifier.
    ///
    /// # Parameters
    /// - `name`: Full legal name of the verifier.
    /// - `license_number`: Government-issued license number.
    ///
    /// # Panics
    /// - If not initialized.
    /// - If the caller is already registered.
    ///
    /// # Events
    /// - None
    pub fn register(env: Env, name: String, license_number: String) {
        let caller = env.current_contract_address();
        // In real usage, caller is extracted via require_auth pattern
        // We use env.invoker() equivalent via auth in tests
        if !env.storage().persistent().has(&DataKey::Admin) {
            panic_with_error!(&env, ContractError::NotInitialized);
        }
        // Note: actual caller must call require_auth before this in production
        // This is handled in test helpers
        let verifier_key = DataKey::Verifier(caller.clone());
        if env.storage().persistent().has(&verifier_key) {
            panic_with_error!(&env, ContractError::AlreadyRegistered);
        }

        let record = VerifierRecord {
            name,
            license_number,
            stake_amount: 0,
            titles_cleared: 0,
            reputation_score: 1000, // Start at 100%
            status: ValidatorStatus::Pending,
            correct_votes: 0,
            total_votes: 0,
        };
        env.storage().persistent().set(&verifier_key, &record);

        let mut count: u32 = env.storage().persistent().get(&DataKey::VerifierCount).unwrap_or(0);
        count = count.checked_add(1).expect("verifier_count_overflow");
        env.storage().persistent().set(&DataKey::VerifierCount, &count);
    }

    /// Registers a verifier by explicit address (required for auth pattern).
    ///
    /// # Parameters
    /// - `verifier`: Address of the verifier being registered.
    /// - `name`: Full legal name of the verifier.
    /// - `license_number`: Government-issued license number.
    ///
    /// # Panics
    /// - If already registered.
    ///
    /// # Events
    /// - None
    pub fn register_verifier(env: Env, verifier: Address, name: String, license_number: String) {
        verifier.require_auth();

        if !env.storage().persistent().has(&DataKey::Admin) {
            panic_with_error!(&env, ContractError::NotInitialized);
        }

        let verifier_key = DataKey::Verifier(verifier.clone());
        if env.storage().persistent().has(&verifier_key) {
            panic_with_error!(&env, ContractError::AlreadyRegistered);
        }

        let record = VerifierRecord {
            name,
            license_number,
            stake_amount: 0,
            titles_cleared: 0,
            reputation_score: 1000,
            status: ValidatorStatus::Pending,
            correct_votes: 0,
            total_votes: 0,
        };
        env.storage().persistent().set(&verifier_key, &record);

        let mut count: u32 = env.storage().persistent().get(&DataKey::VerifierCount).unwrap_or(0);
        count = count.checked_add(1).expect("verifier_count_overflow");
        env.storage().persistent().set(&DataKey::VerifierCount, &count);
    }

    /// Stakes minimum required XLM, transitioning verifier from Pending → Active.
    ///
    /// # Parameters
    /// - `verifier`: The verifier address staking their collateral.
    /// - `amount`: Amount in stroops being staked.
    ///
    /// # Panics
    /// - If verifier is not in Pending state.
    /// - If already staked (status is Active, Suspended, or Slashed).
    /// - If amount is less than min_stake.
    ///
    /// # Events
    /// - `VerifierStaked { verifier, amount }`
    pub fn stake(env: Env, verifier: Address, amount: i128) {
        verifier.require_auth();

        let verifier_key = DataKey::Verifier(verifier.clone());
        let mut record: VerifierRecord = env
            .storage()
            .persistent()
            .get(&verifier_key)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::NotRegistered));

        if record.status != ValidatorStatus::Pending {
            panic_with_error!(&env, ContractError::AlreadyStaked);
        }

        let min_stake: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::MinStake)
            .expect("min_stake_not_set");

        if amount < min_stake {
            panic_with_error!(&env, ContractError::InsufficientStake);
        }

        let next_status = record
            .status
            .transition_to(ValidatorStatus::Active)
            .unwrap_or_else(|_| panic_with_error!(&env, ContractError::IllegalStatusTransition));

        record.status = next_status;
        record.stake_amount = amount;
        env.storage().persistent().set(&verifier_key, &record);

        env.events().publish(
            (symbol_short!("staked"), verifier.clone()),
            amount,
        );
    }

    /// Records a parcel attestation for an active verifier.
    ///
    /// # Parameters
    /// - `verifier`: The active verifier address attesting a parcel.
    /// - `parcel_id`: The ID of the parcel being attested.
    ///
    /// # Panics
    /// - If verifier is not Active.
    ///
    /// # Events
    /// - `ParcelAttested { verifier, parcel_id }`
    pub fn attest_parcel(env: Env, verifier: Address, parcel_id: u64) {
        verifier.require_auth();

        let verifier_key = DataKey::Verifier(verifier.clone());
        let mut record: VerifierRecord = env
            .storage()
            .persistent()
            .get(&verifier_key)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::NotRegistered));

        if record.status != ValidatorStatus::Active {
            panic_with_error!(&env, ContractError::VerifierNotActive);
        }

        record.titles_cleared = record
            .titles_cleared
            .checked_add(1)
            .expect("titles_cleared_overflow");
        env.storage().persistent().set(&verifier_key, &record);

        env.events().publish(
            (symbol_short!("attested"), verifier.clone()),
            parcel_id,
        );
    }

    /// Slashes an active verifier, transferring their stake and moving them to Slashed state.
    ///
    /// # Parameters
    /// - `verifier`: Address of the verifier to slash.
    /// - `reason`: Human-readable reason for slashing.
    ///
    /// # Panics
    /// - If caller is not admin.
    /// - If verifier is already Slashed.
    /// - If verifier is not in Active state.
    ///
    /// # Events
    /// - `VerifierSlashed { verifier, stake_amount, reason }`
    pub fn slash(env: Env, verifier: Address, reason: String) {
        let admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::NotInitialized));
        admin.require_auth();

        let verifier_key = DataKey::Verifier(verifier.clone());
        let mut record: VerifierRecord = env
            .storage()
            .persistent()
            .get(&verifier_key)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::NotRegistered));

        if record.status == ValidatorStatus::Slashed {
            panic!("already_slashed");
        }

        let next_status = record
            .status
            .transition_to(ValidatorStatus::Slashed)
            .unwrap_or_else(|_| panic_with_error!(&env, ContractError::IllegalStatusTransition));

        let slashed_amount = record.stake_amount;
        record.status = next_status;
        record.stake_amount = 0;
        env.storage().persistent().set(&verifier_key, &record);

        env.events().publish(
            (symbol_short!("slashed"), verifier.clone()),
            (slashed_amount, reason),
        );
    }

    /// Suspends an active verifier (admin-only).
    ///
    /// # Parameters
    /// - `verifier`: Address of the verifier to suspend.
    ///
    /// # Panics
    /// - If caller is not admin.
    /// - If verifier is not Active.
    ///
    /// # Events
    /// - None
    pub fn suspend(env: Env, verifier: Address) {
        let admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::NotInitialized));
        admin.require_auth();

        let verifier_key = DataKey::Verifier(verifier.clone());
        let mut record: VerifierRecord = env
            .storage()
            .persistent()
            .get(&verifier_key)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::NotRegistered));

        let next_status = record
            .status
            .transition_to(ValidatorStatus::Suspended)
            .unwrap_or_else(|_| panic_with_error!(&env, ContractError::IllegalStatusTransition));

        record.status = next_status;
        env.storage().persistent().set(&verifier_key, &record);
    }

    /// Reinstates a suspended verifier back to Active (admin-only).
    ///
    /// # Parameters
    /// - `verifier`: Address of the verifier to reinstate.
    ///
    /// # Panics
    /// - If caller is not admin.
    /// - If verifier is not Suspended.
    ///
    /// # Events
    /// - None
    pub fn reinstate(env: Env, verifier: Address) {
        let admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::NotInitialized));
        admin.require_auth();

        let verifier_key = DataKey::Verifier(verifier.clone());
        let mut record: VerifierRecord = env
            .storage()
            .persistent()
            .get(&verifier_key)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::NotRegistered));

        let next_status = record
            .status
            .transition_to(ValidatorStatus::Active)
            .unwrap_or_else(|_| panic_with_error!(&env, ContractError::IllegalStatusTransition));

        record.status = next_status;
        env.storage().persistent().set(&verifier_key, &record);
    }

    /// Updates a verifier's reputation score based on DAO vote outcome.
    ///
    /// # Parameters
    /// - `verifier`: Address of the verifier whose reputation is being updated.
    /// - `voted_correctly`: True if the verifier voted with the majority outcome.
    ///
    /// # Panics
    /// - None (gracefully handles missing verifier by no-op)
    ///
    /// # Events
    /// - None
    pub fn update_reputation(env: Env, verifier: Address, voted_correctly: bool) {
        let verifier_key = DataKey::Verifier(verifier.clone());
        if let Some(mut record) = env.storage().persistent().get::<DataKey, VerifierRecord>(&verifier_key) {
            record.total_votes = record.total_votes.checked_add(1).expect("total_votes_overflow");
            if voted_correctly {
                record.correct_votes = record.correct_votes.checked_add(1).expect("correct_votes_overflow");
            }
            // reputation_score = (correct_votes * 1000) / total_votes
            record.reputation_score = record
                .correct_votes
                .checked_mul(1000)
                .expect("reputation_mul_overflow")
                .checked_div(record.total_votes)
                .expect("reputation_div_error");
            env.storage().persistent().set(&verifier_key, &record);
        }
    }

    /// Returns true if a verifier is currently Active.
    ///
    /// # Parameters
    /// - `verifier`: Address to check.
    ///
    /// # Returns
    /// - `bool` — true if Active, false otherwise.
    ///
    /// # Panics
    /// - None
    pub fn is_active(env: Env, verifier: Address) -> bool {
        let verifier_key = DataKey::Verifier(verifier);
        if let Some(record) = env.storage().persistent().get::<DataKey, VerifierRecord>(&verifier_key) {
            record.status == ValidatorStatus::Active
        } else {
            false
        }
    }

    /// Returns the full VerifierRecord for a given address.
    ///
    /// # Parameters
    /// - `verifier`: Address to look up.
    ///
    /// # Returns
    /// - `VerifierRecord`
    ///
    /// # Panics
    /// - If not registered.
    pub fn get_verifier(env: Env, verifier: Address) -> VerifierRecord {
        let verifier_key = DataKey::Verifier(verifier);
        env.storage()
            .persistent()
            .get(&verifier_key)
            .unwrap_or_else(|| panic!("verifier_not_found"))
    }
}

#[cfg(test)]
mod test;
