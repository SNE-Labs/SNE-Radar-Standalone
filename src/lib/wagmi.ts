import { http, createConfig } from 'wagmi'
import { scroll, scrollSepolia } from 'wagmi/chains'
import { walletConnect, injected } from 'wagmi/connectors'

// Get project ID from env - required for WalletConnect
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  console.warn('VITE_WALLETCONNECT_PROJECT_ID is required for WalletConnect to work')
}

// Configuração Wagmi para Scroll
export const config = createConfig({
  chains: [scroll, scrollSepolia],
  connectors: [
    injected(), // MetaMask, Brave, etc.
    walletConnect({ projectId }),
  ],
  transports: {
    [scroll.id]: http(),
    [scrollSepolia.id]: http(),
  },
})

// Export projectId for use in components
export { projectId }
