# Testnet Data Export

This directory contains exported testnet traction data for BhoomiChain.

## Files

### contract-interactions.csv
Complete log of all smart contract interactions on Stellar Testnet, including:
- Timestamp of each transaction
- Contract name and method invoked
- Caller type (farmer, verifier, corporate, admin)
- Transaction status and hash

**Total Records**: 847 transactions

### user-activity.csv
Aggregated user engagement metrics, including:
- User ID and role
- Wallet type used for connection
- Preferred language setting
- Number of parcels registered
- Number of deals participated in
- Total transaction count
- Join date

**Total Users**: 52 unique addresses

## Data Collection Period

- **Start Date**: January 10, 2025
- **End Date**: January 20, 2025
- **Duration**: 10 days of active testnet operation

## Privacy & Compliance

All user addresses have been anonymized for privacy. Transaction hashes are truncated for readability. Full data available upon request for auditing purposes.

## Usage

Import these CSV files into any data analysis tool (Excel, Google Sheets, Python pandas, R) for further analysis and visualization.

```python
import pandas as pd

# Load contract interactions
df_contracts = pd.read_csv('contract-interactions.csv')

# Load user activity
df_users = pd.read_csv('user-activity.csv')

# Analyze transaction distribution
print(df_contracts['contract'].value_counts())
```

## Contact

For data inquiries or raw blockchain data access:
- Email: data@bhoomichain.org
- Stellar Expert: stellar.expert/explorer/testnet
