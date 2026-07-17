import React, { useState } from 'react';

export interface BlockchainStringProps {
  value: string;
  truncate?: boolean;
  copyable?: boolean;
}

export function BlockchainString({
  value,
  truncate = true,
  copyable = true,
}: BlockchainStringProps): React.JSX.Element {
  const [copied, setCopied] = useState(false);

  const displayValue = truncate && value.length > 10
    ? `${value.substring(0, 6)}...${value.substring(value.length - 4)}`
    : value;

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-label text-on-surface-variant group relative">
      <span title={value}>{displayValue}</span>
      {copyable && (
        <button
          onClick={handleCopy}
          className="p-1 hover:bg-surface-high rounded transition-colors duration-150 inline-flex items-center justify-center cursor-pointer"
          aria-label="Copy address"
        >
          <span className="material-symbols-outlined text-[16px] text-outline">
            {copied ? 'check' : 'content_copy'}
          </span>
          {copied && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-label-sm px-2 py-1 rounded shadow-card z-10 whitespace-nowrap">
              Copied!
            </span>
          )}
        </button>
      )}
    </span>
  );
}
