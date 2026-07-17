export type Role = 'corporate' | 'farmer' | 'verifier' | 'admin';

export type VerifierStatus = 'pending' | 'active' | 'suspended' | 'slashed';

export interface VerifierRecord {
  address: string;
  name: string;
  licenseNumber: string;
  stakeAmount: bigint;
  titlesCleared: number;
  reputationScore: number;
  status: VerifierStatus;
}

export type ParcelStatus = 'unverified' | 'verified' | 'in_escrow' | 'transferred' | 'frozen';

export interface ParcelRecord {
  id: bigint;
  owner: string;
  surveyNumber: string;
  district: string;
  state: string;
  areaSqm: bigint;
  priceXlm: bigint;
  lat: number; // coordinates in millionths of a degree (lat_deg = lat / 1,000,000)
  lon: number;
  status: ParcelStatus;
  verifier?: string;
}

export type DealStatus = 'created' | 'funded' | 'threshold_met' | 'executed' | 'refunded' | 'disputed';

export interface DealRecord {
  id: bigint;
  buyer: string;
  targetParcelIds: bigint[];
  pricePerSqm: bigint;
  totalDeposited: bigint;
  sellerBps: number;
  platformBps: number;
  thresholdPct: number;
  deadlineLedger: bigint;
  signedParcels: bigint[];
  status: DealStatus;
}

export type DisputeStatus = 'open' | 'voting_closed' | 'resolved';
export type DisputeOutcome = 'release_to_buyer' | 'refund_farmers' | 'inconclusive';

export interface DisputeCase {
  id: bigint;
  parcelId: bigint;
  dealId: bigint;
  challenger: string;
  reason: string;
  evidenceHashes: string[];
  votesRelease: number;
  votesRefund: number;
  eligibleVoters: number;
  deadlineLedger: bigint;
  status: DisputeStatus;
  outcome?: DisputeOutcome;
}

export interface Step {
  label: string;
  description: string;
  status: 'completed' | 'active' | 'pending' | 'error';
}
