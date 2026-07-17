import React from 'react';
import { StatusBadge, StatusType } from './StatusBadge';

export interface ParcelCardProps {
  parcelId: bigint;
  name: string;
  area: bigint | number;
  status: StatusType;
  onViewDeeds?: () => void;
}

export function ParcelCard({
  parcelId,
  name,
  area,
  status,
  onViewDeeds,
}: ParcelCardProps): React.JSX.Element {
  return (
    <div className="bg-surface-lowest border border-outline-variant rounded-lg p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-card snap-start min-w-[280px]">
      <div>
        <div className="w-full h-32 bg-primary-fixed-dim/20 rounded mb-4 flex items-center justify-center relative overflow-hidden">
          <span className="material-symbols-outlined text-[48px] text-primary-container/20">
            map
          </span>
          <div className="absolute top-2 right-2">
            <StatusBadge status={status} />
          </div>
        </div>
        <h4 className="font-sans font-bold text-title text-on-surface mb-1">
          {name}
        </h4>
        <div className="flex flex-col gap-1 text-label text-on-surface-variant mb-4">
          <div>
            <span className="font-semibold">Parcel ID:</span> #{parcelId.toString()}
          </div>
          <div>
            <span className="font-semibold">Area:</span> {area.toString()} sqm
          </div>
        </div>
      </div>
      {onViewDeeds && (
        <button
          onClick={onViewDeeds}
          className="w-full border border-primary-container text-primary-container bg-transparent rounded font-sans font-semibold px-4 h-10 hover:bg-primary-fixed/20 transition-colors duration-150 cursor-pointer flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
          <span>View Deeds</span>
        </button>
      )}
    </div>
  );
}
