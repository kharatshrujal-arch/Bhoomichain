#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env, String};

fn setup() -> (Env, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let contract_id = env.register_contract(None, ParcelToken);
    let client = ParcelTokenClient::new(&env, &contract_id);
    client.initialize(&admin);
    (env, contract_id, admin)
}

fn register_test_parcel(env: &Env, client: &ParcelTokenClient, owner: &Address) -> u64 {
    client.register_parcel(
        owner,
        &String::from_str(env, "SY-2024-KA-001"),
        &5000_u64,
        &String::from_str(env, "Mysuru"),
        &String::from_str(env, "KA"),
        &String::from_str(env, "QmTestHashCIDGoesHere"),
    )
}

#[test]
fn test_register_parcel_creates_pending_record() {
    let (env, contract_id, _admin) = setup();
    let client = ParcelTokenClient::new(&env, &contract_id);
    let owner = Address::generate(&env);

    let parcel_id = register_test_parcel(&env, &client, &owner);
    assert_eq!(parcel_id, 1);

    let record = client.get_parcel(&parcel_id);
    assert_eq!(record.status, ParcelStatus::Pending);
    assert_eq!(record.area_sqft, 5000);
}

#[test]
fn test_activate_transitions_to_active() {
    let (env, contract_id, admin) = setup();
    let client = ParcelTokenClient::new(&env, &contract_id);
    let owner = Address::generate(&env);
    let verifier = Address::generate(&env);

    let parcel_id = register_test_parcel(&env, &client, &owner);
    client.activate(&parcel_id, &verifier);

    let record = client.get_parcel(&parcel_id);
    assert_eq!(record.status, ParcelStatus::Active);
    assert_eq!(record.verified_by, Some(verifier));
}

#[test]
fn test_transfer_changes_owner() {
    let (env, contract_id, admin) = setup();
    let client = ParcelTokenClient::new(&env, &contract_id);
    let owner = Address::generate(&env);
    let verifier = Address::generate(&env);
    let new_owner = Address::generate(&env);

    let parcel_id = register_test_parcel(&env, &client, &owner);
    client.activate(&parcel_id, &verifier);
    client.transfer(&parcel_id, &new_owner);

    let record = client.get_parcel(&parcel_id);
    assert_eq!(record.owner, new_owner);
}

#[test]
#[should_panic]
fn test_transfer_frozen_parcel_panics() {
    let (env, contract_id, _admin) = setup();
    let client = ParcelTokenClient::new(&env, &contract_id);
    let owner = Address::generate(&env);
    let verifier = Address::generate(&env);
    let new_owner = Address::generate(&env);

    let parcel_id = register_test_parcel(&env, &client, &owner);
    client.activate(&parcel_id, &verifier);
    client.freeze(&parcel_id);
    client.transfer(&parcel_id, &new_owner); // Should panic
}

#[test]
fn test_freeze_unfreeze_cycle() {
    let (env, contract_id, _admin) = setup();
    let client = ParcelTokenClient::new(&env, &contract_id);
    let owner = Address::generate(&env);
    let verifier = Address::generate(&env);

    let parcel_id = register_test_parcel(&env, &client, &owner);
    client.activate(&parcel_id, &verifier);
    client.freeze(&parcel_id);
    assert_eq!(client.get_parcel(&parcel_id).status, ParcelStatus::Frozen);

    client.unfreeze(&parcel_id);
    assert_eq!(client.get_parcel(&parcel_id).status, ParcelStatus::Active);
}

#[test]
fn test_clawback_transitions_to_clawed() {
    let (env, contract_id, _admin) = setup();
    let client = ParcelTokenClient::new(&env, &contract_id);
    let owner = Address::generate(&env);
    let verifier = Address::generate(&env);

    let parcel_id = register_test_parcel(&env, &client, &owner);
    client.activate(&parcel_id, &verifier);
    client.clawback(&parcel_id);

    let record = client.get_parcel(&parcel_id);
    assert_eq!(record.status, ParcelStatus::Clawed);
}

#[test]
#[should_panic]
fn test_illegal_transition_pending_to_frozen_panics() {
    let (env, contract_id, _admin) = setup();
    let client = ParcelTokenClient::new(&env, &contract_id);
    let owner = Address::generate(&env);

    let parcel_id = register_test_parcel(&env, &client, &owner);
    client.freeze(&parcel_id); // Pending -> Frozen is illegal
}
