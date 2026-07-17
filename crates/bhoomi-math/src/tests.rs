use super::*;

#[test]
fn test_split_amount_happy_path() {
    let total = Amount(10_000);
    // 80% (8000 bps) to seller, 15% (1500 bps) to platform, remaining 5% (500 bps) to logistics
    let seller_bps = BasisPoints(8000);
    let platform_bps = BasisPoints(1500);

    let result = split_amount(total, seller_bps, platform_bps);

    assert_eq!(result.seller, 8000);
    assert_eq!(result.platform, 1500);
    assert_eq!(result.logistics, 500);
    assert_eq!(result.remainder, 0);
}

#[test]
fn test_split_amount_with_remainder() {
    let total = Amount(10_003);
    // 33.33% (3333 bps) to seller, 33.33% (3333 bps) to platform, 33.34% (3334 bps) to logistics
    let seller_bps = BasisPoints(3333);
    let platform_bps = BasisPoints(3333);

    let result = split_amount(total, seller_bps, platform_bps);

    // seller: 10003 * 3333 / 10000 = 3333.9999 -> 3333
    // platform: 10003 * 3333 / 10000 = 3333
    // logistics: 10003 * 3334 / 10000 = 3335.0002 -> 3335
    // total allocated: 3333 + 3333 + 3335 = 10001
    // remainder: 10003 - 10001 = 2
    assert_eq!(result.seller, 3333);
    assert_eq!(result.platform, 3333);
    assert_eq!(result.logistics, 3335);
    assert_eq!(result.remainder, 2);
}

#[test]
#[should_panic(expected = "bps sum exceeds 10000")]
fn test_split_amount_panic_on_too_high_bps() {
    let total = Amount(10_000);
    let seller_bps = BasisPoints(9000);
    let platform_bps = BasisPoints(1500); // sum = 10500 > 10000

    let _result = split_amount(total, seller_bps, platform_bps);
}

#[test]
fn test_haversine_same_point() {
    let lat = 12_971_598; // Bangalore
    let lon = 77_594_562;
    let dist = haversine_distance_meters(lat, lon, lat, lon);
    assert_eq!(dist, 0);
}

#[test]
fn test_haversine_short_distance() {
    // Bangalore center coordinates
    let lat1 = 12_971_598;
    let lon1 = 77_594_562;

    // A point ~100 meters East
    // Bangalore is around 12.97 N. cos(12.97) = 0.9745.
    // 1 deg longitude = 111132 * 0.9745 = 108300 meters.
    // 100 meters / 108300 meters/deg = 0.00092336 degrees = 923 millionths of a degree.
    let lat2 = 12_971_598;
    let lon2 = 77_594_562 + 923;

    let dist = haversine_distance_meters(lat1, lon1, lat2, lon2);

    // The calculated distance should be very close to 100 meters
    assert!(
        (95..=105).contains(&dist),
        "Expected around 100m, got {}m",
        dist
    );
}

#[test]
fn test_is_within_radius() {
    let lat1 = 12_971_598;
    let lon1 = 77_594_562;
    let lat2 = 12_971_598;
    let lon2 = 77_594_562 + 923; // ~100m away

    assert!(is_within_radius(lat1, lon1, lat2, lon2, 110));
    assert!(!is_within_radius(lat1, lon1, lat2, lon2, 90));
}
