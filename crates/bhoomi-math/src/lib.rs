#![no_std]

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Amount(pub i128);

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct BasisPoints(pub u32);

/// Newtype wrapper for land parcel IDs to prevent mixing with other u64 values.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct ParcelId(pub u64);

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct SplitResult {
    pub seller: i128,
    pub logistics: i128,
    pub platform: i128,
    pub remainder: i128,
}

/// Splits a total amount into seller, logistics, and platform shares based on basis points.
/// seller_bps + platform_bps must be <= 10,000.
/// Remaining basis points are allocated to logistics.
/// Rounding remainders are returned in the `remainder` field.
pub fn split_amount(
    total: Amount,
    seller_bps: BasisPoints,
    platform_bps: BasisPoints,
) -> SplitResult {
    let sum_bps = seller_bps
        .0
        .checked_add(platform_bps.0)
        .expect("bps sum overflow");
    if sum_bps > 10000 {
        panic!("bps sum exceeds 10000");
    }
    let logistics_bps = 10000 - sum_bps;

    let total_val = total.0;

    let seller = total_val
        .checked_mul(seller_bps.0 as i128)
        .expect("seller multiplication overflow")
        .checked_div(10000)
        .expect("seller division error");

    let platform = total_val
        .checked_mul(platform_bps.0 as i128)
        .expect("platform multiplication overflow")
        .checked_div(10000)
        .expect("platform division error");

    let logistics = total_val
        .checked_mul(logistics_bps as i128)
        .expect("logistics multiplication overflow")
        .checked_div(10000)
        .expect("logistics division error");

    let allocated = seller
        .checked_add(platform)
        .expect("allocated addition overflow")
        .checked_add(logistics)
        .expect("allocated addition overflow");

    let remainder = total_val
        .checked_sub(allocated)
        .expect("remainder subtraction underflow");

    SplitResult {
        seller,
        logistics,
        platform,
        remainder,
    }
}

/// Helper function to calculate the integer square root of a number.
fn integer_sqrt(n: i128) -> i128 {
    if n < 0 {
        panic!("sqrt of negative number");
    }
    if n == 0 || n == 1 {
        return n;
    }
    let mut x = n / 2;
    let mut y = (x + n / x) / 2;
    while y < x {
        x = y;
        y = (x + n / x) / 2;
    }
    x
}

/// Computes the distance between two coordinates in meters.
/// Coordinates are in millionths of a degree (10^-6 deg).
/// Uses only integer arithmetic with no floating point operations.
pub fn haversine_distance_meters(lat1: i64, lon1: i64, lat2: i64, lon2: i64) -> u64 {
    let lat_diff = (lat2.checked_sub(lat1).expect("lat subtraction overflow")).abs();
    let lon_diff = (lon2.checked_sub(lon1).expect("lon subtraction overflow")).abs();

    // 1 degree latitude = 111,132 meters
    // dy = lat_diff * 111,132 / 1,000,000
    let dy = (lat_diff as i128)
        .checked_mul(111132)
        .expect("dy multiplication overflow")
        .checked_div(1000000)
        .expect("dy division error");

    // Average latitude in millionths of a degree
    let lat_avg = (lat1.checked_add(lat2).expect("lat addition overflow"))
        .checked_div(2)
        .expect("lat_avg division error");

    // Approximate cos(lat_avg) scaled by 1,000,000.
    // cos(x) = 1 - x^2/2 + x^4/24 where x is in radians.
    // Convert lat_avg to micro-radians: x_rad = lat_avg * 17,453 / 1,000,000
    let lat_avg_abs = (lat_avg as i128).abs();
    let x_rad = lat_avg_abs
        .checked_mul(17453)
        .expect("x_rad multiplication overflow")
        .checked_div(1000000)
        .expect("x_rad division error"); // in micro-radians (scaled by 10^6)

    let x_sq = x_rad
        .checked_mul(x_rad)
        .expect("x_sq multiplication overflow"); // scaled by 10^12
    let term2 = x_sq.checked_div(2_000_000).expect("term2 division error"); // scaled by 10^6

    let x_quad = x_sq
        .checked_mul(x_sq)
        .expect("x_quad multiplication overflow"); // scaled by 10^24
    let term4 = x_quad
        .checked_div(24_000_000_000_000_000_000)
        .expect("term4 division error"); // scaled by 10^6

    // cos_val is scaled by 1,000,000. For lat_avg in [0, 90] deg, cos_val <= 1,000,000
    let cos_val = 1_000_000_i128
        .checked_sub(term2)
        .expect("cos_val subtraction overflow")
        .checked_add(term4)
        .expect("cos_val addition overflow");

    // dx = lon_diff * 111,132 * cos(lat_avg) / 10^12
    let dx = (lon_diff as i128)
        .checked_mul(111132)
        .expect("dx multiplication overflow")
        .checked_mul(cos_val)
        .expect("dx multiplication overflow")
        .checked_div(1_000_000_000_000)
        .expect("dx division error");

    let dist_sq = dy
        .checked_mul(dy)
        .expect("dist_sq dy multiplication overflow")
        .checked_add(
            dx.checked_mul(dx)
                .expect("dist_sq dx multiplication overflow"),
        )
        .expect("dist_sq addition overflow");

    let dist = integer_sqrt(dist_sq);

    dist as u64
}

/// Checks if two coordinates are within a certain radius in meters.
pub fn is_within_radius(lat1: i64, lon1: i64, lat2: i64, lon2: i64, radius_meters: u64) -> bool {
    haversine_distance_meters(lat1, lon1, lat2, lon2) <= radius_meters
}

#[cfg(test)]
mod tests;
