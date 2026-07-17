import { useState, useEffect } from 'react';
import { walletKit } from '../lib/walletKit';
import { getRoleForAddress } from '../config/stellar';
import type { Role } from '../types';

export interface UseWalletResult {
  publicKey: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  network: string;
  walletProvider: string | null;
  role: Role | null;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  setRole: (role: Role) => void;
}

export function useWallet(): UseWalletResult {
  const [publicKey, setPublicKey] = useState<string | null>(
    sessionStorage.getItem('publicKey')
  );
  const [walletProvider, setWalletProvider] = useState<string | null>(
    sessionStorage.getItem('walletProvider')
  );
  const [role, setRoleState] = useState<Role | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync role whenever publicKey changes
  useEffect(() => {
    if (publicKey) {
      const activeRole = getRoleForAddress(publicKey);
      setRoleState(activeRole);
    } else {
      setRoleState(null);
    }
  }, [publicKey]);

  const connect = async (): Promise<void> => {
    setIsConnecting(true);
    setError(null);
    try {
      // v1.9.5 API: openModal with onWalletSelected callback
      await walletKit.openModal({
        onWalletSelected: async (option) => {
          try {
            walletKit.setWallet(option.id);
            const { address } = await walletKit.getAddress();
            setPublicKey(address);
            setWalletProvider(option.name);
            sessionStorage.setItem('publicKey', address);
            sessionStorage.setItem('walletProvider', option.name);
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to get address from wallet';
            setError(msg);
          }
        },
        onClosed: () => {
          // User closed modal without selecting
          setIsConnecting(false);
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to open wallet modal';
      setError(msg);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = (): void => {
    setPublicKey(null);
    setWalletProvider(null);
    setRoleState(null);
    sessionStorage.removeItem('publicKey');
    sessionStorage.removeItem('walletProvider');
  };

  const setRole = (newRole: Role): void => {
    if (publicKey) {
      sessionStorage.setItem(`role_${publicKey}`, newRole);
      setRoleState(newRole);
    }
  };

  return {
    publicKey,
    isConnected: !!publicKey,
    isConnecting,
    network: 'TESTNET',
    walletProvider,
    role,
    error,
    connect,
    disconnect,
    setRole,
  };
}
