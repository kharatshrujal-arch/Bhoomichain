import React from 'react';

export type StatusType =
  | 'verified'
  | 'attested'
  | 'pending'
  | 'action_required'
  | 'disputed'
  | 'not_started'
  | 'settled'
  | 'complete';

export interface StatusBadgeProps {
  status: StatusType;
}

export function StatusBadge({ status }: StatusBadgeProps): React.JSX.Element {
  let colorClasses = '';
  let label = '';

  switch (status) {
    case 'verified':
    case 'attested':
      colorClasses = 'bg-primary-fixed text-primary';
      label = status === 'attested' ? 'Attested' : 'Verified';
      break;
    case 'pending':
      colorClasses = 'bg-tertiary-fixed text-tertiary';
      label = 'Pending';
      break;
    case 'action_required':
    case 'disputed':
      colorClasses = 'bg-error-container text-on-error-container';
      label = status === 'action_required' ? 'Action Required' : 'Disputed';
      break;
    case 'not_started':
      colorClasses = 'bg-surface-high text-on-surface-variant';
      label = 'Not Started';
      break;
    case 'settled':
    case 'complete':
      colorClasses = 'bg-primary-fixed-dim text-primary-container';
      label = status === 'complete' ? 'Complete' : 'Settled';
      break;
    default:
      colorClasses = 'bg-surface-high text-on-surface';
      label = String(status);
  }

  return (
    <span className={`inline-block rounded-xl px-3 py-1 font-label-sm uppercase tracking-wider text-center ${colorClasses}`}>
      {label}
    </span>
  );
}
