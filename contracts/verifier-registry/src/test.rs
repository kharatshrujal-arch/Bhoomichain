#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env, String};

fn setup() -> (Env, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let contract_id = env.register_contract(None, VerifierRegistry);
    let client = VerifierRegistryClient::new(&env, &contract_id);
    client.initialize(&admin, &(1000_i128 * 10_000_000)); // 1000 XLM min stake
    (env, contract_id, admin)
}

#[test]
fn test_register_and_stake_happy_path() {
    let (env, contract_id, _admin) = setup();
    let client = VerifierRegistryClient::new(&env, &contract_id);

    let verifier = Address::generate(&env);
    client.register_verifier(
        &verifier,
        &String::from_str(&env, "Ramesh Kumar"),
        &String::from_str(&env, "LIC-2024-KA-8821"),
    );

    let record = client.get_verifier(&verifier);
    assert_eq!(record.status, ValidatorStatus::Pending);
    assert_eq!(record.titles_cleared, 0);

    // Stake exactly the minimum
    client.stake(&verifier, &(1000_i128 * 10_000_000));

    let record = client.get_verifier(&verifier);
    assert_eq!(record.status, ValidatorStatus::Active);
    assert!(client.is_active(&verifier));
}

#[test]
#[should_panic]
fn test_double_registration_panics() {
    let (env, contract_id, _admin) = setup();
    let client = VerifierRegistryClient::new(&env, &contract_id);

    let verifier = Address::generate(&env);
    client.register_verifier(
        &verifier,
        &String::from_str(&env, "Sita Devi"),
        &String::from_str(&env, "LIC-2024-MH-1011"),
    );
    // Second registration should panic
    client.register_verifier(
        &verifier,
        &String::from_str(&env, "Sita Devi"),
        &String::from_str(&env, "LIC-2024-MH-1011"),
    );
}

#[test]
#[should_panic]
fn test_attest_from_non_active_verifier_panics() {
    let (env, contract_id, _admin) = setup();
    let client = VerifierRegistryClient::new(&env, &contract_id);

    let verifier = Address::generate(&env);
    client.register_verifier(
        &verifier,
        &String::from_str(&env, "Arun Mehta"),
        &String::from_str(&env, "LIC-2024-GJ-5544"),
    );
    // Verifier is Pending, not Active — should panic
    client.attest_parcel(&verifier, &42_u64);
}

#[test]
fn test_slash_transfers_stake_and_transitions_status() {
    let (env, contract_id, admin) = setup();
    let client = VerifierRegistryClient::new(&env, &contract_id);

    let verifier = Address::generate(&env);
    client.register_verifier(
        &verifier,
        &String::from_str(&env, "Priya Nair"),
        &String::from_str(&env, "LIC-2024-KL-7720"),
    );
    client.stake(&verifier, &(1000_i128 * 10_000_000));

    assert_eq!(client.get_verifier(&verifier).status, ValidatorStatus::Active);

    client.slash(
        &verifier,
        &String::from_str(&env, "Falsified survey boundaries"),
    );

    let record = client.get_verifier(&verifier);
    assert_eq!(record.status, ValidatorStatus::Slashed);
    assert_eq!(record.stake_amount, 0); // Stake confiscated
}

#[test]
#[should_panic(expected = "already_slashed")]
fn test_double_slash_panics() {
    let (env, contract_id, admin) = setup();
    let client = VerifierRegistryClient::new(&env, &contract_id);

    let verifier = Address::generate(&env);
    client.register_verifier(
        &verifier,
        &String::from_str(&env, "Deepak Rao"),
        &String::from_str(&env, "LIC-2024-TN-3310"),
    );
    client.stake(&verifier, &(1000_i128 * 10_000_000));
    client.slash(&verifier, &String::from_str(&env, "Fraud"));
    client.slash(&verifier, &String::from_str(&env, "Fraud again")); // Should panic
}

#[test]
fn test_suspend_and_reinstate_cycle() {
    let (env, contract_id, admin) = setup();
    let client = VerifierRegistryClient::new(&env, &contract_id);

    let verifier = Address::generate(&env);
    client.register_verifier(
        &verifier,
        &String::from_str(&env, "Vijay Singh"),
        &String::from_str(&env, "LIC-2024-UP-9901"),
    );
    client.stake(&verifier, &(1000_i128 * 10_000_000));

    client.suspend(&verifier);
    assert_eq!(client.get_verifier(&verifier).status, ValidatorStatus::Suspended);
    assert!(!client.is_active(&verifier));

    client.reinstate(&verifier);
    assert_eq!(client.get_verifier(&verifier).status, ValidatorStatus::Active);
    assert!(client.is_active(&verifier));
}

#[test]
fn test_reputation_updates() {
    let (env, contract_id, _admin) = setup();
    let client = VerifierRegistryClient::new(&env, &contract_id);

    let verifier = Address::generate(&env);
    client.register_verifier(
        &verifier,
        &String::from_str(&env, "Anita Shah"),
        &String::from_str(&env, "LIC-2024-GJ-1234"),
    );

    // 3 correct votes, 1 wrong vote
    client.update_reputation(&verifier, &true);
    client.update_reputation(&verifier, &true);
    client.update_reputation(&verifier, &true);
    client.update_reputation(&verifier, &false);

    let record = client.get_verifier(&verifier);
    // reputation = (3 * 1000) / 4 = 750
    assert_eq!(record.reputation_score, 750);
    assert_eq!(record.correct_votes, 3);
    assert_eq!(record.total_votes, 4);
}

#[test]
#[should_panic]
fn test_illegal_status_transition_panics() {
    let (env, contract_id, _admin) = setup();
    let client = VerifierRegistryClient::new(&env, &contract_id);

    let verifier = Address::generate(&env);
    client.register_verifier(
        &verifier,
        &String::from_str(&env, "Test User"),
        &String::from_str(&env, "LIC-TEST-0000"),
    );
    // Try suspending a Pending verifier (illegal transition)
    client.suspend(&verifier);
}
