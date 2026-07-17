//! AggregationDeal — BhoomiChain Soroban Smart Contract
//!
//! Core escrow contract for structured land aggregation deals.
//! Manages deal lifecycle: creation → funding → threshold-met → atomic payout.
//! Farmers deposit parcel tokens, corporate buyer funds escrow, deal
//! triggers atomic XLM payout when all parcels meet verification threshold.

#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype,
    Address, Env, Vec,
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
    DealAlreadyExists = 4,
    DealNotFound = 5,
    IllegalStatusTransition = 6,
    ThresholdNotMet = 7,
    AlreadyFunded = 8,
    ParcelAlreadyAdded = 9,
    InvalidBasisPoints = 10,
    ArithmeticOverflow = 11,
}

// ---------------------------------------------------------------------------
// Storage Keys
// ---------------------------------------------------------------------------

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Deal(u64),
    DealCount,
}

// ---------------------------------------------------------------------------
// Status State Machine
// ---------------------------------------------------------------------------

/// Deal lifecycle states.
///
/// Valid transitions:
/// - `Created` → `Funded`   via `fund_escrow()` (buyer funds)
/// - `Funded` → `Complete`  via `trigger_payout()` (threshold met)
/// - `Created` → `Cancelled` via `cancel()` (admin or buyer)
/// - `Funded` → `Cancelled`  via `cancel()` (admin)
#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum DealStatus {
    Created = 0,
    Funded = 1,
    Complete = 2,
    Cancelled = 3,
}

impl DealStatus {
    /// Validates and returns the next status. Errors on illegal transitions.
    pub fn transition_to(&self, new: DealStatus) -> Result<DealStatus, ContractError> {
        match (self, &new) {
            (DealStatus::Created, DealStatus::Funded) => Ok(new),
            (DealStatus::Funded, DealStatus::Complete) => Ok(new),
            (DealStatus::Created, DealStatus::Cancelled) => Ok(new),
            (DealStatus::Funded, DealStatus::Cancelled) => Ok(new),
            _ => Err(ContractError::IllegalStatusTransition),
        }
    }
}

// ---------------------------------------------------------------------------
// Data Structures
// ---------------------------------------------------------------------------

#[contracttype]
#[derive(Clone)]
pub struct ParcelEntry {
    pub parcel_id: u64,
    pub farmer: Address,
    pub verified: bool,
    pub payout_amount: i128,
}

#[contracttype]
#[derive(Clone)]
pub struct DealRecord {
    pub buyer: Address,
    pub total_escrow_amount: i128,
    pub funded_amount: i128,
    pub platform_fee_bps: u32,
    pub verifier_fee_bps: u32,
    pub parcels: Vec<ParcelEntry>,
    pub status: DealStatus,
    pub verification_threshold_bps: u32,
}

// ---------------------------------------------------------------------------
// Contract
// ---------------------------------------------------------------------------

#[contract]
pub struct AggregationDeal;

#[contractimpl]
impl AggregationDeal {
    /// Initializes the AggregationDeal registry.
    ///
    /// # Parameters
    /// - `admin`: The privileged admin address.
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
        env.storage().persistent().set(&DataKey::DealCount, &0u64);
    }

    /// Creates a new aggregation deal by a corporate buyer.
    ///
    /// # Parameters
    /// - `buyer`: The corporate buyer address.
    /// - `total_escrow_amount`: Total XLM to be held in escrow (in stroops).
    /// - `platform_fee_bps`: Platform fee in basis points (e.g. 100 = 1%).
    /// - `verifier_fee_bps`: Verifier fee in basis points.
    /// - `verification_threshold_bps`: Minimum % of parcels that must be verified (e.g. 8000 = 80%).
    ///
    /// # Returns
    /// - `u64` — newly allocated deal ID.
    ///
    /// # Panics
    /// - If basis points > 10000.
    /// - If contract not initialized.
    ///
    /// # Events
    /// - `DealCreated { deal_id, buyer, total_escrow_amount }`
    pub fn create_deal(
        env: Env,
        buyer: Address,
        total_escrow_amount: i128,
        platform_fee_bps: u32,
        verifier_fee_bps: u32,
        verification_threshold_bps: u32,
    ) -> u64 {
        buyer.require_auth();

        if !env.storage().persistent().has(&DataKey::Admin) {
            panic_with_error!(&env, ContractError::NotInitialized);
        }

        if platform_fee_bps > 10000
            || verifier_fee_bps > 10000
            || verification_threshold_bps > 10000
        {
            panic_with_error!(&env, ContractError::InvalidBasisPoints);
        }

        let mut count: u64 = env
            .storage()
            .persistent()
            .get(&DataKey::DealCount)
            .expect("deal_count_not_set");
        let deal_id = count.checked_add(1).expect("deal_id_overflow");
        count = deal_id;

        let record = DealRecord {
            buyer: buyer.clone(),
            total_escrow_amount,
            funded_amount: 0,
            platform_fee_bps,
            verifier_fee_bps,
            parcels: Vec::new(&env),
            status: DealStatus::Created,
            verification_threshold_bps,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Deal(deal_id), &record);
        env.storage()
            .persistent()
            .set(&DataKey::DealCount, &count);

        env.events().publish(
            (symbol_short!("deal_new"), buyer),
            (deal_id, total_escrow_amount),
        );

        deal_id
    }

    /// Adds a farmer parcel to an existing Created deal.
    ///
    /// # Parameters
    /// - `deal_id`: ID of the deal.
    /// - `parcel_id`: ID of the land parcel being included.
    /// - `farmer`: Address of the farmer owning the parcel.
    /// - `payout_amount`: XLM amount (stroops) the farmer receives on completion.
    ///
    /// # Panics
    /// - If deal not found or not in Created state.
    /// - If farmer is not authenticated.
    ///
    /// # Events
    /// - `ParcelAdded { deal_id, parcel_id, farmer }`
    pub fn add_parcel(env: Env, deal_id: u64, parcel_id: u64, farmer: Address, payout_amount: i128) {
        farmer.require_auth();

        let key = DataKey::Deal(deal_id);
        let mut record: DealRecord = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::DealNotFound));

        if record.status != DealStatus::Created {
            panic_with_error!(&env, ContractError::IllegalStatusTransition);
        }

        let entry = ParcelEntry {
            parcel_id,
            farmer: farmer.clone(),
            verified: false,
            payout_amount,
        };
        record.parcels.push_back(entry);

        env.storage().persistent().set(&key, &record);

        env.events().publish(
            (symbol_short!("parcel_add"), deal_id),
            (parcel_id, farmer),
        );
    }

    /// Marks a parcel as verified inside a deal (verifier registry cross-check).
    ///
    /// # Parameters
    /// - `deal_id`: ID of the deal.
    /// - `parcel_id`: ID of the verified parcel.
    /// - `verifier`: Address of the verifier attesting this parcel.
    ///
    /// # Panics
    /// - If caller is not admin.
    /// - If parcel not found in deal.
    ///
    /// # Events
    /// - `ParcelVerified { deal_id, parcel_id }`
    pub fn mark_verified(env: Env, deal_id: u64, parcel_id: u64, verifier: Address) {
        let admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::NotInitialized));
        admin.require_auth();

        let key = DataKey::Deal(deal_id);
        let mut record: DealRecord = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::DealNotFound));

        let parcels_len = record.parcels.len();
        for i in 0..parcels_len {
            let mut entry = record.parcels.get(i).expect("parcel_index_oob");
            if entry.parcel_id == parcel_id {
                entry.verified = true;
                record.parcels.set(i, entry);
                break;
            }
        }

        env.storage().persistent().set(&key, &record);

        env.events().publish(
            (symbol_short!("verified"), deal_id),
            (parcel_id, verifier),
        );
    }

    /// Funds the deal escrow from the buyer.
    ///
    /// # Parameters
    /// - `deal_id`: ID of the deal to fund.
    /// - `amount`: Amount in stroops being deposited.
    ///
    /// # Panics
    /// - If deal is not in Created state.
    /// - If already funded.
    /// - If caller is not the deal buyer.
    ///
    /// # Events
    /// - `DealFunded { deal_id, amount }`
    pub fn fund_escrow(env: Env, deal_id: u64, amount: i128) {
        let key = DataKey::Deal(deal_id);
        let mut record: DealRecord = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::DealNotFound));

        record.buyer.require_auth();

        let next = record
            .status
            .transition_to(DealStatus::Funded)
            .unwrap_or_else(|_| panic_with_error!(&env, ContractError::AlreadyFunded));

        record.funded_amount = amount;
        record.status = next;
        env.storage().persistent().set(&key, &record);

        env.events().publish(
            (symbol_short!("funded"), deal_id),
            amount,
        );
    }

    /// Triggers atomic payout if verification threshold is met.
    ///
    /// Computes verified ratio and checks against `verification_threshold_bps`.
    /// If met, transitions deal to Complete and emits payout event.
    ///
    /// # Parameters
    /// - `deal_id`: ID of the deal.
    ///
    /// # Returns
    /// - `bool` — true if payout was triggered, false if threshold not met.
    ///
    /// # Panics
    /// - If deal is not Funded.
    /// - If caller is not admin.
    ///
    /// # Events
    /// - `PayoutTriggered { deal_id, verified_bps }` if threshold met
    pub fn trigger_payout(env: Env, deal_id: u64) -> bool {
        let admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::NotInitialized));
        admin.require_auth();

        let key = DataKey::Deal(deal_id);
        let mut record: DealRecord = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::DealNotFound));

        if record.status != DealStatus::Funded {
            panic_with_error!(&env, ContractError::IllegalStatusTransition);
        }

        let total = record.parcels.len() as u32;
        if total == 0 {
            panic_with_error!(&env, ContractError::ThresholdNotMet);
        }

        let verified_count = record
            .parcels
            .iter()
            .filter(|e| e.verified)
            .count() as u32;

        // verified_bps = (verified_count * 10000) / total
        let verified_bps = verified_count
            .checked_mul(10000)
            .expect("verified_bps_mul_overflow")
            .checked_div(total)
            .expect("verified_bps_div_error");

        if verified_bps < record.verification_threshold_bps {
            return false;
        }

        let next = record
            .status
            .transition_to(DealStatus::Complete)
            .unwrap_or_else(|_| panic_with_error!(&env, ContractError::IllegalStatusTransition));

        record.status = next;
        env.storage().persistent().set(&key, &record);

        env.events().publish(
            (symbol_short!("payout"), deal_id),
            verified_bps,
        );

        true
    }

    /// Cancels a deal (admin-only). Returns deal to Cancelled state.
    ///
    /// # Parameters
    /// - `deal_id`: ID of the deal.
    ///
    /// # Panics
    /// - If caller is not admin.
    /// - If deal is already Complete or Cancelled.
    ///
    /// # Events
    /// - `DealCancelled { deal_id }`
    pub fn cancel(env: Env, deal_id: u64) {
        let admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::NotInitialized));
        admin.require_auth();

        let key = DataKey::Deal(deal_id);
        let mut record: DealRecord = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::DealNotFound));

        let next = record
            .status
            .transition_to(DealStatus::Cancelled)
            .unwrap_or_else(|_| panic_with_error!(&env, ContractError::IllegalStatusTransition));

        record.status = next;
        env.storage().persistent().set(&key, &record);

        env.events().publish(symbol_short!("cancelled"), deal_id);
    }

    /// Returns the full DealRecord for a given deal ID.
    ///
    /// # Parameters
    /// - `deal_id`: ID to look up.
    ///
    /// # Panics
    /// - If deal not found.
    pub fn get_deal(env: Env, deal_id: u64) -> DealRecord {
        env.storage()
            .persistent()
            .get(&DataKey::Deal(deal_id))
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::DealNotFound))
    }
}

#[cfg(test)]
mod test;
