import { http, createConfig } from 'wagmi'
import { scroll, scrollSepolia } from 'wagmi/chains'
import { walletConnect, injected } from 'wagmi/connectors'

// Project ID é obrigatório para WalletConnect funcionar
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  console.error('❌ VITE_WALLETCONNECT_PROJECT_ID não está definido! WalletConnect não funcionará.')
  console.error('Configure no arquivo .env.local: VITE_WALLETCONNECT_PROJECT_ID=your_project_id')
}

console.log('WalletConnect Project ID:', projectId)

export const config = createConfig({
  chains: [scroll, scrollSepolia],
  connectors: [
    walletConnect({
      projectId,
      showQrModal: true,
    }),
    injected(), // Detecta MetaMask automaticamente
  ],
  transports: {
    [scroll.id]: http(),
    [scrollSepolia.id]: http(),
  },
})

// Export projectId for use in components
export { projectId }
