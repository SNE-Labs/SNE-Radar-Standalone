// Hook para autenticação SIWE real
// Mantém a UI igual, mas conecta com backend

import { useState, useEffect } from 'react';
import { useAccount, useSignMessage, useConnect } from 'wagmi';
import { getAuthNonce, verifyAuthSignature, getUserLicenses, type LicenseInfo } from '../services/api';

type AuthState = 'disconnected' | 'connecting' | 'connected' | 'wrong-network';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>('disconnected');
  const [userLicenses, setUserLicenses] = useState<LicenseInfo[]>([]);
  const [isLoadingLicenses, setIsLoadingLicenses] = useState(false);

  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { connect, connectors, isPending } = useConnect();

  // Effect to handle wallet connection and proceed with SIWE
  useEffect(() => {
    const proceedWithAuth = async () => {
      if (isConnected && address && authState === 'connecting') {
        console.log('Wallet connected, proceeding with SIWE...');
        try {
          await performSIWE();
        } catch (error) {
          console.error('Auto SIWE failed:', error);
          setAuthState('disconnected');
        }
      }
    };

    proceedWithAuth();
  }, [isConnected, address, authState]);

  const performSIWE = async () => {
    if (!address) return;

    try {
      // 1. Get nonce from backend
      console.log('Getting nonce for address:', address);
      const nonce = await getAuthNonce(address);

      // 2. Create SIWE message
      const message = `snelabs.space wants you to sign in with your Ethereum account:\n${address}\n\nSign in to SNE Radar\n\nURI: https://snelabs.space\nVersion: 1\nChain ID: 1\nNonce: ${nonce}\nIssued At: ${new Date().toISOString()}`;

      console.log('Requesting signature for message:', message);

      // 3. Sign message
      const signature = await signMessageAsync({ message });

      console.log('Verifying signature with backend...');

      // 4. Verify with backend (creates session)
      const result = await verifyAuthSignature(message, signature);

      if (result.success) {
        setAuthState('connected');
        // Load user licenses
        await loadUserLicenses();
        console.log('Authentication successful!');
      } else {
        throw new Error(result.error || 'Authentication failed');
      }

    } catch (error) {
      console.error('SIWE error:', error);
      setAuthState('disconnected');
      throw error;
    }
  };

  const connectWallet = async () => {
    try {
      setAuthState('connecting');

      // If already connected, proceed directly with SIWE
      if (isConnected && address) {
        console.log('Wallet already connected, proceeding with SIWE...');
        await performSIWE();
        return;
      }

      // Connect wallet - useEffect will handle the rest
      console.log('Connecting wallet...');
      const connector = connectors.find(c => c.name === 'MetaMask') || connectors[0];
      console.log('Using connector:', connector?.name);

      connect({ connector });

    } catch (error) {
      console.error('Auth error:', error);
      setAuthState('disconnected');
      throw error;
    }
  };

  const loadUserLicenses = async () => {
    if (authState !== 'connected') return;

    try {
      setIsLoadingLicenses(true);
      const licenses = await getUserLicenses();
      setUserLicenses(licenses);
    } catch (error) {
      console.error('Failed to load licenses:', error);
    } finally {
      setIsLoadingLicenses(false);
    }
  };

  const hasValidLicense = () => {
    const now = Date.now() / 1000; // timestamp in seconds
    return userLicenses.some(license =>
      license.isLifetime || license.expiryTimestamp > now
    );
  };

  const logout = () => {
    setAuthState('disconnected');
    setUserLicenses([]);
    // Backend handles logout via API, but for now just reset state
  };

  return {
    authState,
    userLicenses,
    isLoadingLicenses,
    connectWallet,
    loadUserLicenses,
    hasValidLicense,
    logout
  };
};
