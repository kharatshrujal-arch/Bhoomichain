import React from 'react';
import { StatusBadge, StatusType } from './StatusBadge';

export interface DocumentCardProps {
  title: string;
  description: string;
  status: StatusType;
  errorMessage?: string;
  actions?: React.ReactNode;
}

export function DocumentCard({
  title,
  description,
  status,
  errorMessage,
  actions,
}: DocumentCardProps): React.JSX.Element {
  return (
    <div className="bg-surface-lowest border border-outline-variant rounded-lg p-6 flex flex-col justify-between h-full transition-all duration-200 hover:shadow-card">
      <div>
        <div className="flex justify-between items-start gap-4 mb-3">
          <h4 className="font-sans font-bold text-title text-on-surface">{title}</h4>
          <StatusBadge status={status} />
        </div>
        <p className="font-sans text-label text-on-surface-variant mb-4">{description}</p>
        {errorMessage && (
          <div className="bg-error-container text-on-error-container p-3 rounded text-label-sm font-semibold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
      {actions && <div className="mt-auto pt-2">{actions}</div>}
    </div>
  );
}
