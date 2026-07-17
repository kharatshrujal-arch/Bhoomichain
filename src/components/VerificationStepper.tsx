import React from 'react';
import { Step } from '../types';

export interface VerificationStepperProps {
  steps: Step[];
}

export function VerificationStepper({ steps }: VerificationStepperProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2.5">
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        
        let markerStyles = '';
        let markerContent: React.ReactNode = null;
        let connectorStyles = 'w-0.5 self-center my-1 bg-surface-container';

        if (step.status === 'completed') {
          markerStyles = 'bg-primary-container text-on-primary';
          markerContent = (
            <span className="material-symbols-outlined text-[18px]">
              check
            </span>
          );
          connectorStyles = 'w-0.5 self-center my-1 bg-primary-container';
        } else if (step.status === 'active') {
          markerStyles = 'border-2 border-tertiary-container bg-surface-lowest text-tertiary';
          markerContent = (
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container" />
          );
          connectorStyles = 'w-0.5 border-l-2 border-dashed border-outline-variant self-center my-1';
        } else if (step.status === 'error') {
          markerStyles = 'bg-error text-on-error';
          markerContent = (
            <span className="material-symbols-outlined text-[18px]">
              error
            </span>
          );
          connectorStyles = 'w-0.5 border-l-2 border-dashed border-error self-center my-1';
        } else {
          // pending
          markerStyles = 'bg-surface-high text-on-surface-variant';
          markerContent = (
            <span className="text-label-sm font-semibold">{idx + 1}</span>
          );
        }

        return (
          <div key={idx} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${markerStyles}`}>
                {markerContent}
              </div>
              {!isLast && <div className={`flex-grow h-10 ${connectorStyles}`} />}
            </div>
            
            <div className="flex flex-col pb-6 text-left">
              <span className="font-sans font-semibold text-body text-on-surface">
                {step.label}
              </span>
              <span className="font-sans text-label text-on-surface-variant mt-0.5">
                {step.description}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
