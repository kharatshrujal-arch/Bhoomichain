#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env, String};

fn setup() -> (Env, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let contract_id = env.register_contract(None, DisputeDAO);
    let client = DisputeDAOClient::new(&env, &contract_id);
    client.initialize(&admin);
    (env, contract_id, admin)
}

fn raise_test_dispute(env: &Env, client: &DisputeDAOClient, challenger: &Address) -> u64 {
    client.raise_dispute(
        &1_u64,
        challenger,
        &String::from_str(env, "Survey boundary misrepresented"),
        &3_u32, // quorum of 3 votes
    )
}

#[test]
fn test_raise_dispute_returns_id() {
    let (env, contract_id, _admin) = setup();
    let client = DisputeDAOClient::new(&env, &contract_id);
    let challenger = Address::generate(&env);

    let dispute_id = raise_test_dispute(&env, &client, &challenger);
    assert_eq!(dispute_id, 1);

    let record = client.get_dispute(&dispute_id);
    assert_eq!(record.status, DisputeStatus::Open);
    assert_eq!(record.parcel_id, 1);
}

#[test]
fn test_vote_and_resolve_upheld() {
    let (env, contract_id, _admin) = setup();
    let client = DisputeDAOClient::new(&env, &contract_id);
    let challenger = Address::generate(&env);
    let v1 = Address::generate(&env);
    let v2 = Address::generate(&env);
    let v3 = Address::generate(&env);

    let dispute_id = raise_test_dispute(&env, &client, &challenger);

    // 2 uphold, 1 overturn → upheld wins
    client.vote(&dispute_id, &v1, &true);
    client.vote(&dispute_id, &v2, &true);
    client.vote(&dispute_id, &v3, &false);

    let upheld = client.resolve(&dispute_id);
    assert!(upheld);
    assert_eq!(client.get_dispute(&dispute_id).status, DisputeStatus::Resolved);
    assert!(client.get_dispute(&dispute_id).outcome_upheld);
}

#[test]
fn test_vote_and_resolve_overturned() {
    let (env, contract_id, _admin) = setup();
    let client = DisputeDAOClient::new(&env, &contract_id);
    let challenger = Address::generate(&env);
    let v1 = Address::generate(&env);
    let v2 = Address::generate(&env);
    let v3 = Address::generate(&env);

    let dispute_id = raise_test_dispute(&env, &client, &challenger);

    // 1 uphold, 2 overturn → overturned
    client.vote(&dispute_id, &v1, &false);
    client.vote(&dispute_id, &v2, &false);
    client.vote(&dispute_id, &v3, &true);

    let upheld = client.resolve(&dispute_id);
    assert!(!upheld);
    assert!(!client.get_dispute(&dispute_id).outcome_upheld);
}

#[test]
fn test_tie_resolves_as_upheld() {
    let (env, contract_id, _admin) = setup();
    let client = DisputeDAOClient::new(&env, &contract_id);
    let challenger = Address::generate(&env);
    let v1 = Address::generate(&env);
    let v2 = Address::generate(&env);
    let v3 = Address::generate(&env);
    let v4 = Address::generate(&env);

    // Raise dispute with quorum=4
    let dispute_id = client.raise_dispute(
        &1_u64,
        &challenger,
        &String::from_str(&env, "Boundary conflict"),
        &4_u32,
    );

    // 2 uphold, 2 overturn = tie → upheld
    client.vote(&dispute_id, &v1, &true);
    client.vote(&dispute_id, &v2, &true);
    client.vote(&dispute_id, &v3, &false);
    client.vote(&dispute_id, &v4, &false);

    let upheld = client.resolve(&dispute_id);
    assert!(upheld, "tie should resolve as upheld");
}

#[test]
#[should_panic]
fn test_quorum_not_met_panics() {
    let (env, contract_id, _admin) = setup();
    let client = DisputeDAOClient::new(&env, &contract_id);
    let challenger = Address::generate(&env);
    let v1 = Address::generate(&env);

    let dispute_id = raise_test_dispute(&env, &client, &challenger);
    client.vote(&dispute_id, &v1, &true); // Only 1 vote, quorum is 3
    client.resolve(&dispute_id); // Should panic
}

#[test]
#[should_panic]
fn test_double_vote_panics() {
    let (env, contract_id, _admin) = setup();
    let client = DisputeDAOClient::new(&env, &contract_id);
    let challenger = Address::generate(&env);
    let v1 = Address::generate(&env);

    let dispute_id = raise_test_dispute(&env, &client, &challenger);
    client.vote(&dispute_id, &v1, &true);
    client.vote(&dispute_id, &v1, &false); // Second vote should panic
}

#[test]
fn test_dismiss_dispute() {
    let (env, contract_id, _admin) = setup();
    let client = DisputeDAOClient::new(&env, &contract_id);
    let challenger = Address::generate(&env);

    let dispute_id = raise_test_dispute(&env, &client, &challenger);
    client.dismiss(&dispute_id);
    assert_eq!(client.get_dispute(&dispute_id).status, DisputeStatus::Dismissed);
}
