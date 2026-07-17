#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env};

fn setup() -> (Env, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let contract_id = env.register_contract(None, AggregationDeal);
    let client = AggregationDealClient::new(&env, &contract_id);
    client.initialize(&admin);
    (env, contract_id, admin)
}

#[test]
fn test_create_deal_returns_id() {
    let (env, contract_id, _admin) = setup();
    let client = AggregationDealClient::new(&env, &contract_id);
    let buyer = Address::generate(&env);

    let deal_id = client.create_deal(
        &buyer,
        &(100_000_i128 * 10_000_000), // 100,000 XLM
        &100_u32,    // 1% platform fee
        &50_u32,     // 0.5% verifier fee
        &8000_u32,   // 80% threshold
    );

    assert_eq!(deal_id, 1);
    let record = client.get_deal(&deal_id);
    assert_eq!(record.status, DealStatus::Created);
    assert_eq!(record.platform_fee_bps, 100);
}

#[test]
fn test_add_parcel_and_fund_and_trigger_payout() {
    let (env, contract_id, _admin) = setup();
    let client = AggregationDealClient::new(&env, &contract_id);
    let buyer = Address::generate(&env);
    let farmer = Address::generate(&env);

    let deal_id = client.create_deal(
        &buyer,
        &(100_000_i128 * 10_000_000),
        &100_u32,
        &50_u32,
        &5000_u32, // 50% threshold for easy test
    );

    // Add 2 parcels
    client.add_parcel(&deal_id, &1_u64, &farmer, &(50_000_i128 * 10_000_000));
    client.add_parcel(&deal_id, &2_u64, &farmer, &(50_000_i128 * 10_000_000));

    // Verify one parcel
    let verifier = Address::generate(&env);
    client.mark_verified(&deal_id, &1_u64, &verifier);

    // Fund
    client.fund_escrow(&deal_id, &(100_000_i128 * 10_000_000));
    assert_eq!(client.get_deal(&deal_id).status, DealStatus::Funded);

    // Trigger payout — 50% verified, threshold is 50% → should succeed
    let triggered = client.trigger_payout(&deal_id);
    assert!(triggered);
    assert_eq!(client.get_deal(&deal_id).status, DealStatus::Complete);
}

#[test]
fn test_trigger_payout_fails_below_threshold() {
    let (env, contract_id, _admin) = setup();
    let client = AggregationDealClient::new(&env, &contract_id);
    let buyer = Address::generate(&env);
    let farmer = Address::generate(&env);

    let deal_id = client.create_deal(
        &buyer,
        &(100_000_i128 * 10_000_000),
        &100_u32,
        &50_u32,
        &9000_u32, // 90% threshold
    );

    client.add_parcel(&deal_id, &1_u64, &farmer, &(50_000_i128 * 10_000_000));
    client.add_parcel(&deal_id, &2_u64, &farmer, &(50_000_i128 * 10_000_000));

    // Only verify 1 of 2 (50% < 90% threshold)
    let verifier = Address::generate(&env);
    client.mark_verified(&deal_id, &1_u64, &verifier);

    client.fund_escrow(&deal_id, &(100_000_i128 * 10_000_000));
    let triggered = client.trigger_payout(&deal_id);
    assert!(!triggered);
    assert_eq!(client.get_deal(&deal_id).status, DealStatus::Funded);
}

#[test]
fn test_cancel_deal() {
    let (env, contract_id, _admin) = setup();
    let client = AggregationDealClient::new(&env, &contract_id);
    let buyer = Address::generate(&env);

    let deal_id = client.create_deal(
        &buyer,
        &(100_000_i128 * 10_000_000),
        &100_u32,
        &50_u32,
        &8000_u32,
    );

    client.cancel(&deal_id);
    assert_eq!(client.get_deal(&deal_id).status, DealStatus::Cancelled);
}

#[test]
#[should_panic]
fn test_invalid_basis_points_panics() {
    let (env, contract_id, _admin) = setup();
    let client = AggregationDealClient::new(&env, &contract_id);
    let buyer = Address::generate(&env);

    // platform_fee_bps > 10000 is invalid
    client.create_deal(
        &buyer,
        &(100_000_i128 * 10_000_000),
        &10001_u32,
        &50_u32,
        &8000_u32,
    );
}

#[test]
#[should_panic]
fn test_illegal_fund_after_cancel_panics() {
    let (env, contract_id, _admin) = setup();
    let client = AggregationDealClient::new(&env, &contract_id);
    let buyer = Address::generate(&env);

    let deal_id = client.create_deal(
        &buyer,
        &(100_000_i128 * 10_000_000),
        &100_u32,
        &50_u32,
        &8000_u32,
    );

    client.cancel(&deal_id);
    client.fund_escrow(&deal_id, &(100_000_i128 * 10_000_000)); // Should panic — Cancelled → Funded is illegal
}
