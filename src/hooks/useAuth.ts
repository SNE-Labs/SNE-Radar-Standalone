// Hook para autenticação SIWE real
// Mantém a UI igual, mas conecta com backend

import { useState, useEffect } from 'react';
import { useAccount, useSignMessage, useConnect, useDisconnect } from 'wagmi';
import { toast } from 'sonner';
import { getUserLicenses, type LicenseInfo } from '../services/api';

type AuthState = 'disconnected' | 'connecting' | 'connected' | 'wrong-network';

// Configurações SIWE - devem corresponder exatamente ao backend
const SIWE_DOMAIN = 'radar.snelabs.space';
const SIWE_ORIGIN = 'https://radar.snelabs.space';
const CHAIN_ID = 534351; // Scroll Sepolia - deve corresponder ao backend

console.log('SIWE Config:', { SIWE_DOMAIN, SIWE_ORIGIN, CHAIN_ID });

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>('disconnected');
  const [userLicenses, setUserLicenses] = useState<LicenseInfo[]>([]);
  const [isLoadingLicenses, setIsLoadingLicenses] = useState(false);

  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  // Verificar se MetaMask está disponível
  const isMetaMaskAvailable = typeof window !== 'undefined' &&
    window.ethereum &&
    window.ethereum.isMetaMask;

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
      // 1. Obter nonce do backend
      console.log('Getting nonce for address:', address);
      const response = await fetch('https://api.snelabs.space/api/auth/nonce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get nonce: ${response.status}`);
      }

      const data = await response.json();
      const nonce = data.nonce;

      // 2. Criar mensagem SIWE manualmente (compatível com backend)
      // IMPORTANTE: Deve corresponder exatamente ao formato esperado pelo backend
      const issuedAt = new Date().toISOString();
      const expirationTime = new Date(Date.now() + 5 * 60 * 1000).toISOString();

      const messageToSign = `${SIWE_DOMAIN} wants you to sign in with your Ethereum account:\n${address}\n\nSign in to SNE Radar\n\nURI: ${SIWE_ORIGIN}\nVersion: 1\nChain ID: ${CHAIN_ID}\nNonce: ${nonce}\nIssued At: ${issuedAt}\nExpiration Time: ${expirationTime}`;

      console.log('SIWE Message components:', {
        domain: SIWE_DOMAIN,
        address,
        origin: SIWE_ORIGIN,
        chainId: CHAIN_ID,
        nonce,
        issuedAt,
        expirationTime
      });
      console.log('Requesting signature for message:', messageToSign);

      // 3. Solicitar assinatura
      const signature = await signMessageAsync({ message: messageToSign });

      console.log('Verifying signature with backend...');

      // 4. Autenticar via backend
      console.log('Sending to backend:', {
        message: messageToSign,
        signature: signature.substring(0, 50) + '...', // Truncate for logging
        endpoint: 'https://api.snelabs.space/api/auth/siwe'
      });

      const authResponse = await fetch('https://api.snelabs.space/api/auth/siwe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSign,
          signature,
        }),
      });

      console.log('Backend response status:', authResponse.status);

      if (!authResponse.ok) {
        const errorText = await authResponse.text();
        console.error('Backend error response:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        throw new Error(errorData.error || `Authentication failed: ${authResponse.status}`);
      }

      const result = await authResponse.json();
      console.log('Backend success response:', result);

      // Backend retorna sucesso se tem token (não necessariamente campo 'success')
      if (result.token && result.address) {
        setAuthState('connected');
        // Load user licenses
        await loadUserLicenses();
        console.log('Authentication successful!');
        toast.success('Autenticado com sucesso!');
      } else {
        throw new Error(result.error || 'Authentication failed - missing token or address');
      }

    } catch (error) {
      console.error('SIWE error:', error);
      setAuthState('disconnected');
      toast.error(error instanceof Error ? error.message : 'Erro na autenticação');
      throw error;
    }
  };

  const connectWallet = async (connectorId?: string) => {
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

      const connector = connectorId
        ? connectors.find((c) => c.id === connectorId)
        : connectors[0] // WalletConnect por padrão

      if (!connector) {
        throw new Error('Connector not found')
      }

      // Capturar erros de WebSocket/WalletConnect
      try {
        connect({ connector })
        toast.success('Wallet conectada!')
      } catch (connectError: any) {
        console.error('WalletConnect connection error:', connectError)

        // Tratar erros específicos do WalletConnect
        if (connectError.message?.includes('socket error') ||
            connectError.message?.includes('Connection interrupted') ||
            connectError.message?.includes('relayer')) {
          throw new Error('Problema de conexão com WalletConnect. Verifique sua internet e tente novamente.')
        }

        throw connectError
      }

    } catch (error: any) {
      console.error('Auth error:', error);
      setAuthState('disconnected');

      // Mensagens de erro mais amigáveis
      let errorMessage = 'Erro ao conectar wallet'

      if (error.message?.includes('User rejected')) {
        errorMessage = 'Conexão rejeitada pelo usuário'
      } else if (error.message?.includes('MetaMask extension not found')) {
        errorMessage = 'MetaMask não encontrada. Instale a extensão MetaMask.'
      } else if (error.message?.includes('socket error') || error.message?.includes('relayer')) {
        errorMessage = 'Problema de conexão. Verifique sua internet e tente novamente.'
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error(errorMessage)
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

  const getAvailableConnectors = () => {
    return connectors.map(connector => ({
      id: connector.id,
      name: connector.name,
      ready: connector.ready,
    }));
  };

  return {
    authState,
    userLicenses,
    isLoadingLicenses,
    connectWallet,
    loadUserLicenses,
    hasValidLicense,
    logout,
    getAvailableConnectors,
    isMetaMaskAvailable,
    connectors,
  };
};
