import { http, createConfig } from 'wagmi'
import { scroll, scrollSepolia } from 'wagmi/chains'
import { walletConnect, injected, metaMask } from 'wagmi/connectors'

// Get project ID from env or use demo
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

// Configuração Wagmi para Scroll
export const config = createConfig({
  chains: [scroll, scrollSepolia],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    metaMask(),
  ],
  transports: {
    [scroll.id]: http(),
    [scrollSepolia.id]: http(),
  },
})

// Export projectId for use in components
export { projectId }
