export interface LandParcel {
  id: string;
  name: string;
  location: string;
  area: string;
  value: string;
  status: 'verified' | 'pending' | 'action_required' | 'not_started';
  holder: string;
  surveyNumber: string;
  escrowStatus: string;
  submittedAt: string;
  hash?: string;
}

const DEFAULT_PARCELS: LandParcel[] = [
  {
    id: 'STLR-BHO-7721-X',
    name: 'Kurnool Parcel #452',
    location: 'Kurnool, Andhra Pradesh',
    area: '2.4 Hectares',
    value: '₹82.5 Lakhs',
    status: 'verified',
    holder: 'Rajesh Kumar',
    surveyNumber: '7729/B-4',
    escrowStatus: 'LOCKED IN SOROBAN',
    submittedAt: 'Oct 12, 2024',
    hash: '0x7e8b9f1a2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r',
  },
  {
    id: 'STLR-BHO-9012-Y',
    name: 'Nandyal West #109',
    location: 'Nandyal, Andhra Pradesh',
    area: '1.8 Hectares',
    value: '₹62.0 Lakhs',
    status: 'pending',
    holder: 'Rajesh Kumar',
    surveyNumber: '9012/A-1',
    escrowStatus: 'PENDING ESCROW DEPOSIT',
    submittedAt: 'Oct 14, 2024',
  },
  {
    id: 'STLR-BHO-8891-Z',
    name: 'Anantapur Zone C',
    location: 'Anantapur, Andhra Pradesh',
    area: '3.2 Hectares',
    value: '₹1.1 Crores',
    status: 'action_required',
    holder: 'Rajesh Kumar',
    surveyNumber: '8891/C-2',
    escrowStatus: 'NOT LOCKED',
    submittedAt: 'Oct 15, 2024',
  }
];

export const getParcels = (): LandParcel[] => {
  const data = localStorage.getItem('bhoomichain_parcels');
  if (!data) {
    localStorage.setItem('bhoomichain_parcels', JSON.stringify(DEFAULT_PARCELS));
    return DEFAULT_PARCELS;
  }
  return JSON.parse(data) as LandParcel[];
};

export const saveParcels = (parcels: LandParcel[]): void => {
  localStorage.setItem('bhoomichain_parcels', JSON.stringify(parcels));
};

export const addParcel = (parcel: Omit<LandParcel, 'id' | 'submittedAt'>): LandParcel => {
  const parcels = getParcels();
  const id = `STLR-BHO-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
  const submittedAt = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const newParcel: LandParcel = {
    ...parcel,
    id,
    submittedAt,
  };
  parcels.push(newParcel);
  saveParcels(parcels);
  return newParcel;
};

export const updateParcelStatus = (id: string, status: LandParcel['status'], hash?: string): void => {
  const parcels = getParcels();
  const updated = parcels.map((p) => {
    if (p.id === id) {
      return {
        ...p,
        status,
        hash: hash || p.hash,
        escrowStatus: status === 'verified' ? 'LOCKED IN SOROBAN' : p.escrowStatus,
      };
    }
    return p;
  });
  saveParcels(updated);
};
