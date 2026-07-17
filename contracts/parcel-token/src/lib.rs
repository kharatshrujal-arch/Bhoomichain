//! ParcelToken — BhoomiChain Soroban Smart Contract
//!
//! Manages the on-chain tokenization of land parcels in India.
//! Supports registration, ownership transfer, and freeze/clawback for regulatory compliance.

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
    ParcelAlreadyExists = 4,
    ParcelNotFound = 5,
    ParcelFrozen = 6,
    NotOwner = 7,
    IllegalStatusTransition = 8,
}

// ---------------------------------------------------------------------------
// Storage Keys
// ---------------------------------------------------------------------------

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Parcel(u64),
    ParcelCount,
}

// ---------------------------------------------------------------------------
// Status State Machine
// ---------------------------------------------------------------------------

/// Land parcel lifecycle states.
///
/// Valid transitions:
/// - `Pending` → `Active`    via `activate()`
/// - `Active` → `Frozen`    via `freeze()`  (admin/clawback authority)
/// - `Frozen` → `Active`    via `unfreeze()` (admin)
/// - `Active` → `Clawed`    via `clawback()` (admin — regulatory action)
#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum ParcelStatus {
    Pending = 0,
    Active = 1,
    Frozen = 2,
    Clawed = 3,
}

impl ParcelStatus {
    /// Validates and returns the next status. Errors on illegal transitions.
    pub fn transition_to(&self, new: ParcelStatus) -> Result<ParcelStatus, ContractError> {
        match (self, &new) {
            (ParcelStatus::Pending, ParcelStatus::Active) => Ok(new),
            (ParcelStatus::Active, ParcelStatus::Frozen) => Ok(new),
            (ParcelStatus::Frozen, ParcelStatus::Active) => Ok(new),
            (ParcelStatus::Active, ParcelStatus::Clawed) => Ok(new),
            _ => Err(ContractError::IllegalStatusTransition),
        }
    }
}

// ---------------------------------------------------------------------------
// Data Structures
// ---------------------------------------------------------------------------

#[contracttype]
#[derive(Clone)]
pub struct ParcelRecord {
    pub owner: Address,
    pub survey_number: String,
    pub area_sqft: u64,
    pub district: String,
    pub state_code: String,
    pub status: ParcelStatus,
    pub verified_by: Option<Address>,
    pub title_deed_hash: String,
}

// ---------------------------------------------------------------------------
// Contract
// ---------------------------------------------------------------------------

#[contract]
pub struct ParcelToken;

#[contractimpl]
impl ParcelToken {
    /// Initializes the ParcelToken registry.
    ///
    /// # Parameters
    /// - `admin`: The privileged address (government body or BhoomiChain DAO).
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
        env.storage().persistent().set(&DataKey::ParcelCount, &0u64);
    }

    /// Registers a new land parcel, owned by `owner`.
    ///
    /// # Parameters
    /// - `owner`: The address of the land owner.
    /// - `survey_number`: Government survey number string.
    /// - `area_sqft`: Area in square feet (u64).
    /// - `district`: District name.
    /// - `state_code`: Two-letter state code (e.g. "KA" for Karnataka).
    /// - `title_deed_hash`: IPFS CID or SHA-256 hash of the physical deed document.
    ///
    /// # Returns
    /// - `u64` — the newly allocated parcel ID.
    ///
    /// # Panics
    /// - If contract is not initialized.
    /// - If caller is not authenticated.
    ///
    /// # Events
    /// - `ParcelRegistered { parcel_id, owner, survey_number }`
    pub fn register_parcel(
        env: Env,
        owner: Address,
        survey_number: String,
        area_sqft: u64,
        district: String,
        state_code: String,
        title_deed_hash: String,
    ) -> u64 {
        owner.require_auth();

        if !env.storage().persistent().has(&DataKey::Admin) {
            panic_with_error!(&env, ContractError::NotInitialized);
        }

        let mut count: u64 = env
            .storage()
            .persistent()
            .get(&DataKey::ParcelCount)
            .expect("parcel_count_not_set");

        let parcel_id = count.checked_add(1).expect("parcel_id_overflow");
        count = parcel_id;

        let record = ParcelRecord {
            owner: owner.clone(),
            survey_number: survey_number.clone(),
            area_sqft,
            district,
            state_code,
            status: ParcelStatus::Pending,
            verified_by: None,
            title_deed_hash,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Parcel(parcel_id), &record);
        env.storage()
            .persistent()
            .set(&DataKey::ParcelCount, &count);

        env.events().publish(
            (symbol_short!("parcel_reg"), owner),
            (parcel_id, survey_number),
        );

        parcel_id
    }

    /// Activates a pending parcel once a verifier attests it.
    ///
    /// # Parameters
    /// - `parcel_id`: ID of the parcel to activate.
    /// - `verifier`: Address of the attesting verifier.
    ///
    /// # Panics
    /// - If parcel not found.
    /// - If parcel is not Pending.
    /// - If caller is not admin.
    ///
    /// # Events
    /// - `ParcelActivated { parcel_id, verifier }`
    pub fn activate(env: Env, parcel_id: u64, verifier: Address) {
        let admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::NotInitialized));
        admin.require_auth();

        let key = DataKey::Parcel(parcel_id);
        let mut record: ParcelRecord = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::ParcelNotFound));

        let next = record
            .status
            .transition_to(ParcelStatus::Active)
            .unwrap_or_else(|_| panic_with_error!(&env, ContractError::IllegalStatusTransition));

        record.status = next;
        record.verified_by = Some(verifier.clone());
        env.storage().persistent().set(&key, &record);

        env.events().publish(
            (symbol_short!("activated"), parcel_id),
            verifier,
        );
    }

    /// Transfers ownership of an active parcel to a new owner.
    ///
    /// # Parameters
    /// - `parcel_id`: ID of the parcel to transfer.
    /// - `new_owner`: Address of the new owner.
    ///
    /// # Panics
    /// - If parcel is not found.
    /// - If parcel is Frozen or Clawed.
    /// - If caller is not the current owner.
    ///
    /// # Events
    /// - `ParcelTransferred { parcel_id, from, to }`
    pub fn transfer(env: Env, parcel_id: u64, new_owner: Address) {
        let key = DataKey::Parcel(parcel_id);
        let mut record: ParcelRecord = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::ParcelNotFound));

        record.owner.require_auth();

        if record.status == ParcelStatus::Frozen || record.status == ParcelStatus::Clawed {
            panic_with_error!(&env, ContractError::ParcelFrozen);
        }

        let old_owner = record.owner.clone();
        record.owner = new_owner.clone();
        env.storage().persistent().set(&key, &record);

        env.events().publish(
            (symbol_short!("transfer"), parcel_id),
            (old_owner, new_owner),
        );
    }

    /// Freezes an active parcel (admin or regulatory authority).
    ///
    /// # Parameters
    /// - `parcel_id`: ID of the parcel to freeze.
    ///
    /// # Panics
    /// - If caller is not admin.
    /// - If parcel is not Active.
    ///
    /// # Events
    /// - `ParcelFrozen { parcel_id }`
    pub fn freeze(env: Env, parcel_id: u64) {
        let admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::NotInitialized));
        admin.require_auth();

        let key = DataKey::Parcel(parcel_id);
        let mut record: ParcelRecord = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::ParcelNotFound));

        let next = record
            .status
            .transition_to(ParcelStatus::Frozen)
            .unwrap_or_else(|_| panic_with_error!(&env, ContractError::IllegalStatusTransition));

        record.status = next;
        env.storage().persistent().set(&key, &record);

        env.events().publish(symbol_short!("frozen"), parcel_id);
    }

    /// Unfreezes a frozen parcel (admin-only).
    ///
    /// # Parameters
    /// - `parcel_id`: ID of the parcel to unfreeze.
    ///
    /// # Panics
    /// - If caller is not admin.
    /// - If parcel is not Frozen.
    ///
    /// # Events
    /// - `ParcelUnfrozen { parcel_id }`
    pub fn unfreeze(env: Env, parcel_id: u64) {
        let admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::NotInitialized));
        admin.require_auth();

        let key = DataKey::Parcel(parcel_id);
        let mut record: ParcelRecord = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::ParcelNotFound));

        let next = record
            .status
            .transition_to(ParcelStatus::Active)
            .unwrap_or_else(|_| panic_with_error!(&env, ContractError::IllegalStatusTransition));

        record.status = next;
        env.storage().persistent().set(&key, &record);

        env.events().publish(symbol_short!("unfrozen"), parcel_id);
    }

    /// Claws back (confiscates) an active parcel for regulatory action.
    ///
    /// # Parameters
    /// - `parcel_id`: ID of the parcel to claw back.
    ///
    /// # Panics
    /// - If caller is not admin.
    /// - If parcel is not Active.
    ///
    /// # Events
    /// - `ParcelClawback { parcel_id, former_owner }`
    pub fn clawback(env: Env, parcel_id: u64) {
        let admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::NotInitialized));
        admin.require_auth();

        let key = DataKey::Parcel(parcel_id);
        let mut record: ParcelRecord = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::ParcelNotFound));

        let next = record
            .status
            .transition_to(ParcelStatus::Clawed)
            .unwrap_or_else(|_| panic_with_error!(&env, ContractError::IllegalStatusTransition));

        let former_owner = record.owner.clone();
        record.status = next;
        env.storage().persistent().set(&key, &record);

        env.events().publish(
            (symbol_short!("clawback"), parcel_id),
            former_owner,
        );
    }

    /// Returns the full ParcelRecord for a given parcel ID.
    ///
    /// # Parameters
    /// - `parcel_id`: ID to look up.
    ///
    /// # Returns
    /// - `ParcelRecord`
    ///
    /// # Panics
    /// - If parcel is not found.
    pub fn get_parcel(env: Env, parcel_id: u64) -> ParcelRecord {
        env.storage()
            .persistent()
            .get(&DataKey::Parcel(parcel_id))
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::ParcelNotFound))
    }
}

#[cfg(test)]
mod test;
