import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Download, Copy, Check, ExternalLink, Menu, X } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/accordion';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { Toaster, toast } from 'sonner';
import { useAccount } from 'wagmi';
import { useAuth } from '../hooks/useAuth';
import { useDownload } from '../hooks/useDownload';
import { VideoDemoPlayer } from '../components/VideoDemoPlayer';
import { WalletSelector } from '../components/WalletSelector';

// Mock transaction state (UI intact)
type TxState = 'idle' | 'pending' | 'confirmed' | 'failed';

interface MintedLicense {
  tokenId: string;
  plan: '30D' | '365D';
  activationCode: string;
}

export default function App() {
  // UI state (mantém intacto)
  const [txState, setTxState] = useState<TxState>('idle');
  const [txHash, setTxHash] = useState<string>('');
  const [mintedLicense, setMintedLicense] = useState<MintedLicense | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [walletSelectorOpen, setWalletSelectorOpen] = useState(false);

  // Real auth integration (UI intact)
  const { authState, userLicenses, connectWallet: realConnectWallet, hasValidLicense, getAvailableConnectors, isMetaMaskAvailable, connectors } = useAuth();
  const { downloadState, downloadExecutable } = useDownload();
  const { address } = useAccount(); // Get real address from wagmi

  // UI adaptation: map auth state to wallet state for existing UI
  const walletState = authState === 'connected' ? 'connected' :
                     authState === 'connecting' ? 'connecting' :
                     authState === 'wrong-network' ? 'wrong-network' : 'disconnected';

  // Adapted connect function (UI intact, backend real)
  const connectWallet = () => {
    setWalletSelectorOpen(true);
  };

  const handleWalletSelect = async (connectorId: string) => {
    try {
      await realConnectWallet(connectorId);
      // Toast já é mostrado no hook
    } catch (error) {
      console.error('Wallet connection error:', error);
      // Toast já é mostrado no hook
      throw error; // Re-throw to let WalletSelector handle UI
    }
  };

  const switchToScroll = async () => {
    toast.info('Trocando para Scroll...');
    setTimeout(() => {
      toast.success('Conectado à Scroll');
    }, 1000);
  };

  // Mint license (UI intact, mas agora pode ser real via wagmi)
  const mintLicense = async (plan: '30D' | '365D') => {
    // Check if wallet is connected
    if (walletState !== 'connected') {
      toast.error('Conecte sua wallet primeiro!');
      return;
    }

    setTxState('pending');
    setTxHash('0x' + Math.random().toString(16).substr(2, 64));

    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));

      setTxState('confirmed');
      const tokenId = Math.floor(Math.random() * 10000).toString();
      const activationCode = generateActivationCode();
      setMintedLicense({ tokenId, plan, activationCode });
      toast.success('Licença mintada com sucesso!');

      setTimeout(() => setTxState('idle'), 3000);
    } catch (error) {
      console.error('Mint error:', error);
      setTxState('failed');
      toast.error('Erro ao mintar licença');
      setTimeout(() => setTxState('idle'), 3000);
    }
  };

  const generateActivationCode = () => {
    return 'SNE-' + Array.from({length: 4}, () =>
      Math.random().toString(36).substring(2, 6).toUpperCase()
    ).join('-');
  };

  const copyActivationCode = () => {
    if (mintedLicense) {
      navigator.clipboard.writeText(mintedLicense.activationCode);
      setCopiedCode(true);
      toast.success('Código copiado!');
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-sm" />
                <span className="font-medium tracking-tight">SNE Radar</span>
              </div>
              
              <div className="hidden md:flex items-center gap-6 text-sm">
                <a href="#features" className="text-gray-400 hover:text-gray-100 transition-colors duration-200">Features</a>
                <a href="#pricing" className="text-gray-400 hover:text-gray-100 transition-colors duration-200">Pricing</a>
                <a href="#faq" className="text-gray-400 hover:text-gray-100 transition-colors duration-200">FAQ</a>
                <a href="#" className="text-gray-400 hover:text-gray-100 transition-colors duration-200">Docs</a>
                <a href="#" className="text-gray-400 hover:text-gray-100 transition-colors duration-200">Status</a>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              {walletState === 'disconnected' && (
                <Button 
                  onClick={connectWallet}
                  variant="outline"
                  className="border-gray-700 hover:border-orange-500/50 transition-all duration-200"
                >
                  Connect Wallet
                </Button>
              )}
              
              {walletState === 'connecting' && (
                <Button variant="outline" disabled className="border-gray-700">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-gray-400 border-t-orange-500 rounded-full"
                  />
                  <span className="ml-2">Connecting...</span>
                </Button>
              )}
              
              {walletState === 'connected' && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-md">
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                    Scroll
                  </Badge>
                  <span className="text-sm font-mono text-gray-400">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                </div>
              )}
              
              {walletState === 'wrong-network' && (
                <Button 
                  onClick={switchToScroll}
                  variant="outline"
                  className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                >
                  Switch to Scroll
                </Button>
              )}
              
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/20"
              >
                Mint
              </Button>
            </div>

            <button 
              className="md:hidden p-2 text-gray-400 hover:text-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-800/50"
            >
              <div className="px-4 py-4 space-y-3">
                <a href="#features" className="block text-gray-400 hover:text-gray-100 py-2">Features</a>
                <a href="#security" className="block text-gray-400 hover:text-gray-100 py-2">Security</a>
                <a href="#how-it-works" className="block text-gray-400 hover:text-gray-100 py-2">How it works</a>
                <a href="#pricing" className="block text-gray-400 hover:text-gray-100 py-2">Pricing</a>
                <a href="#faq" className="block text-gray-400 hover:text-gray-100 py-2">FAQ</a>

                <div className="pt-3 border-t border-gray-800/50">
                  <a href="#post-mint" className="block bg-orange-500 text-white text-center py-2 px-4 rounded hover:bg-orange-600">
                    Download Instructions
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(234, 88, 12, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(234, 88, 12, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full mb-6">
                <span className="text-sm text-orange-500 font-mono">STANDALONE • DESKTOP</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight mb-6 leading-tight">
                Radar Standalone.<br />
                <span className="text-orange-500">Plug & play.</span>
              </h1>
              
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Market intelligence e sinais em tempo real — execução local no Windows e macOS. 
                Licença on-chain (NFT) na Scroll.
              </p>

              <div className="space-y-3 mb-10">
                {[
                  'Execução local, baixa latência',
                  'Licença transferível com expiração automática',
                  'Ativação por dispositivo para manter controle e updates'
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2" />
                    <span className="text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <Button
                  size="lg"
                  onClick={() => mintLicense('30D')}
                  className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/20"
                >
                  Mint license (30D)
                </Button>
                <Button
                  size="lg"
                  onClick={() => mintLicense('365D')}
                  variant="outline"
                  className="border-gray-700 hover:border-orange-500/50 transition-all duration-200"
                >
                  Mint license (365D)
                </Button>
              </div>

              <p className="text-xs text-gray-300 mb-6 border-l-2 border-gray-800 pl-3">
                Mint = emitir sua licença NFT na Scroll • Transferível • 1 dispositivo
              </p>

              <a href="#" className="text-sm text-gray-400 hover:text-orange-500 transition-colors inline-flex items-center gap-2 group">
                Ver demo (90s)
                <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <p className="text-xs text-gray-500 mt-8 border-l-2 border-gray-800 pl-4">
                Ferramenta de análise e monitoramento. Não é aconselhamento financeiro.
              </p>
            </motion.div>

            {/* Video Demo Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-gray-800/50 rounded-lg p-6 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm font-mono text-gray-400 mb-1">SNE RADAR DEMO</div>
                  <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                    Live Preview
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-gray-400">DEMO</span>
                </div>
              </div>

              {/* Video Player - Autoplay com Fallback React */}
              <VideoDemoPlayer />

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">
                  Preview da interface completa • Veja como funciona em ação
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              'Desktop-first execution',
              'On-chain licensing (Scroll)',
              'SIWE authentication',
              'Windows + macOS'
            ].map((label, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-4 border border-gray-800/30 rounded-md bg-gray-900/20"
              >
                <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                  {label}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-900/30 border border-gray-800/30 rounded-md">
              <div className="text-xs font-mono text-orange-500 mb-1">LICENSE</div>
              <div className="text-sm text-gray-300">License validity: on-chain</div>
            </div>
            <div className="p-4 bg-gray-900/30 border border-gray-800/30 rounded-md">
              <div className="text-xs font-mono text-orange-500 mb-1">EXECUTION</div>
              <div className="text-sm text-gray-300">Activation: device-bound session</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">
              Features
            </h2>
            <p className="text-gray-400 text-lg">Construído para decisões rápidas e informadas</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Multi-timeframe intelligence', desc: 'Confluência de sinais em múltiplos períodos' },
              { title: 'Levels & zones', desc: 'Níveis operacionais e zonas de interesse' },
              { title: 'Signal scoring', desc: 'Pontuação clara de força dos sinais' },
              { title: 'Watchlists', desc: 'Monitore seus ativos favoritos' },
              { title: 'Context panels', desc: 'Contexto de mercado em tempo real' },
              { title: 'Updates contínuos', desc: 'Melhorias e novos recursos regulares' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-gray-900/30 border border-gray-800/30 rounded-lg hover:border-orange-500/30 transition-all duration-200 group"
              >
                <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-4" />
                <h3 className="font-medium mb-2 group-hover:text-orange-500 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Licensing */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">
              Security & Licensing
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { title: 'Execução Local', desc: 'Roda no seu PC. Sem terminal na nuvem.' },
              { title: 'Validade On-Chain', desc: 'Licença verificável na blockchain Scroll.' },
              { title: 'Login Sem Senha', desc: 'Autenticação por assinatura SIWE.' },
              { title: '1 Dispositivo', desc: 'Ativação vinculada ao dispositivo.' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg"
              >
                <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-md flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-orange-500/20 rounded-sm" />
                </div>
                <h3 className="font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center text-sm text-gray-400 border border-gray-800 rounded-lg p-6 bg-gray-900/30">
            <p>
              Licença é transferível (NFT). O acesso do app acompanha o owner e a validade on-chain.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">
              How It Works
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Connect wallet (SIWE)', desc: 'Secure authentication by signature' },
              { step: '02', title: 'Mint your license (30D/365D) on Scroll', desc: 'Transferable NFT license' },
              { step: '03', title: 'Download + Activate', desc: 'Token ID + Activation code' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-gray-800 mb-4">{item.step}</div>
                <h3 className="font-medium mb-2 text-lg">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
                
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-px bg-gradient-to-r from-gray-700 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center text-sm text-gray-400 border-l-2 border-orange-500/30 pl-4 py-2 bg-gray-900/20 rounded-r">
            <p>Transfer: previous owner loses access on next refresh</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900/20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">
              Pricing
            </h2>
            <p className="text-gray-400">Licenças on-chain. Pagamento em crypto na Scroll.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 30D Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-orange-500/30 transition-all duration-200"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-medium mb-2">Pro 30D</h3>
                <div className="text-sm text-gray-400 space-y-1">
                  <div>Validade: 30 dias</div>
                  <div>1 dispositivo</div>
                  <div>Updates incluídos</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm text-gray-400 mb-2">Preço</div>
                <div className="text-lg font-mono text-white mb-1">49 USDC</div>
                <div className="text-xs text-gray-400">+ ~0.001 ETH gas ≈ $0.10</div>
                <div className="text-xs text-gray-500 mt-1">Gas na Scroll costuma ser baixo</div>
              </div>

              <Button 
                onClick={() => {
                  if (walletState === 'disconnected') {
                    connectWallet();
                  } else if (walletState === 'connected') {
                    mintLicense('30D');
                  }
                }}
                disabled={txState === 'pending'}
                className="w-full bg-orange-500 hover:bg-orange-600 transition-all duration-200"
              >
                {txState === 'pending' ? 'Minting...' : 'Mint license (30D)'}
              </Button>
            </motion.div>

            {/* 365D Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 bg-gradient-to-br from-orange-500/5 to-gray-900/50 border border-orange-500/30 rounded-lg relative overflow-hidden"
            >
              <Badge className="absolute top-4 right-4 bg-orange-500 text-white border-0">
                Melhor valor
              </Badge>

              <div className="mb-6">
                <h3 className="text-2xl font-medium mb-2">Pro 365D</h3>
                <div className="text-sm text-gray-400 space-y-1">
                  <div>Validade: 365 dias</div>
                  <div>1 dispositivo</div>
                  <div>Updates incluídos</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm text-gray-400 mb-2">Preço com desconto</div>
                <div className="text-lg font-mono text-white mb-1">399 USDC</div>
                <div className="text-xs text-gray-400">+ ~0.001 ETH gas ≈ $0.10</div>
                <div className="text-xs text-gray-500 mt-1">≈ $1.09/dia • Melhor valor</div>
              </div>

              <Button 
                onClick={() => {
                  if (walletState === 'disconnected') {
                    connectWallet();
                  } else if (walletState === 'connected') {
                    mintLicense('365D');
                  }
                }}
                disabled={txState === 'pending'}
                className="w-full bg-orange-500 hover:bg-orange-600 transition-all duration-200"
              >
                {txState === 'pending' ? 'Minting...' : 'Mint license (365D)'}
              </Button>
            </motion.div>
          </div>

          {/* Transaction States */}
          <AnimatePresence>
            {txState === 'pending' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 p-4 bg-gray-900 border border-orange-500/30 rounded-lg flex items-center gap-3"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-gray-400 border-t-orange-500 rounded-full"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">Transaction pending...</div>
                  <div className="text-xs text-gray-400 font-mono">
                    {txHash.slice(0, 10)}...{txHash.slice(-8)}
                  </div>
                </div>
                <a href="#" className="text-orange-500 hover:text-orange-400 text-sm">
                  View
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Post-Purchase Success */}
      <AnimatePresence>
        {mintedLicense && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setMintedLicense(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-green-500" />
                </div>
                <h2 className="text-3xl font-medium mb-2">License minted successfully!</h2>
                <p className="text-gray-400">Token ID: #{mintedLicense.tokenId}</p>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-sm font-mono text-orange-500 mb-3 uppercase tracking-wider">
                    Download
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="w-full border-gray-700"
                      onClick={() => downloadExecutable('win')}
                      disabled={downloadState !== 'idle'}
                    >
                      <Download size={16} className="mr-2" />
                      {downloadState === 'idle' ? 'Windows (.exe)' :
                       downloadState === 'requesting' ? 'Autorizando...' :
                       'Baixando...'}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-gray-700"
                      onClick={() => downloadExecutable('mac')}
                      disabled={downloadState !== 'idle'}
                    >
                      <Download size={16} className="mr-2" />
                      macOS (.dmg)
                    </Button>
                  </div>
                </div>

                <Separator className="bg-gray-800" />

                <div>
                  <h3 className="text-sm font-mono text-orange-500 mb-3 uppercase tracking-wider">
                    Activation Code
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={mintedLicense.activationCode}
                      readOnly
                      className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-md font-mono text-sm"
                    />
                    <Button 
                      onClick={copyActivationCode}
                      variant="outline"
                      className="border-gray-700"
                    >
                      {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Como ativar</h4>
                  <ol className="space-y-2 text-sm text-gray-400">
                    <li>1. Abra o software baixado</li>
                    <li>2. Clique em "Activate"</li>
                    <li>3. Digite Token ID + Activation Code</li>
                  </ol>
                  <p className="text-xs text-gray-500 mt-2">
                    Activation: device-bound session
                  </p>
                </div>

                <div className="text-xs text-gray-500 border-l-2 border-gray-800 pl-4">
                  Sessões são renovadas periodicamente para validar owner e validade.
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 border-gray-700"
                  onClick={() => setMintedLicense(null)}
                >
                  Fechar
                </Button>
                <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
                  Gerenciar licenças
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">
              FAQ
            </h2>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                q: 'A licença é transferível?',
                a: 'Sim. É um NFT. O acesso do app acompanha o owner atual.'
              },
              {
                q: 'O que acontece se eu transferir a licença?',
                a: 'O acesso do owner anterior expira no próximo refresh de ativação.'
              },
              {
                q: 'Quantos dispositivos posso ativar?',
                a: '1 por licença. Assentos adicionais podem ser adquiridos.'
              },
              {
                q: 'Funciona offline?',
                a: 'O app roda localmente, mas pode exigir validação periódica para manter ativação e updates.'
              },
              {
                q: 'Como funciona renovação?',
                a: 'Basta mintar uma renovação/estender a validade on-chain.'
              },
              {
                q: 'Preciso ter crypto para usar?',
                a: 'Sim, aceitamos USDC ou ETH na rede Scroll. Se você não tem crypto, pode fazer bridge de exchanges como Binance ou usar serviços de compra.'
              },
              {
                q: 'E se eu trocar de computador?',
                a: 'A licença é device-bound. Para transferir: 1) Instale no novo PC, 2) Use mesmo Token ID + novo Activation Code, 3) Contate suporte se houver problemas.'
              },
              {
                q: 'Isso é conselho financeiro?',
                a: 'Não. É uma ferramenta de análise e monitoramento.'
              }
            ].map((item, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${i}`}
                className="bg-gray-900/30 border border-gray-800 rounded-lg px-6 data-[state=open]:border-orange-500/30"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left">{item.q}</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 pb-4">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 text-center">
            <p className="text-gray-400 mb-2">Precisa de ajuda?</p>
            <a href="https://t.me/sne_support" className="text-orange-500 hover:text-orange-400 transition-colors">
              Suporte via Telegram
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-sm" />
              <span className="font-medium tracking-tight">SNE Radar Standalone</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-gray-100 transition-colors">Docs</a>
              <a href="#" className="hover:text-gray-100 transition-colors">Status</a>
              <a href="#" className="hover:text-gray-100 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-100 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-100 transition-colors">Support</a>
            </div>
          </div>

          <Separator className="bg-gray-800 mb-6" />

          <div className="text-xs text-gray-500 text-center">
            <p className="mb-2">
              SNE Radar Standalone é uma ferramenta de análise técnica e monitoramento de mercado. 
              Não oferece nem substitui aconselhamento financeiro, jurídico ou fiscal.
            </p>
            <p>
              © 2026 SNE. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 z-40">
        <div className="flex gap-2">
          <Button 
            onClick={() => mintLicense('30D')}
            className="flex-1 bg-orange-500 hover:bg-orange-600"
          >
            Mint license (30D)
          </Button>
          <Button 
            onClick={() => mintLicense('365D')}
            variant="outline"
            className="flex-1 border-gray-700"
          >
            Mint license (365D)
          </Button>
        </div>
      </div>

      {/* Wallet Selector Modal */}
      <WalletSelector
        isOpen={walletSelectorOpen}
        onClose={() => setWalletSelectorOpen(false)}
        onSelectWallet={handleWalletSelect}
        availableConnectors={getAvailableConnectors()}
        isConnecting={authState === 'connecting'}
      />

      {/* Toaster */}
      <Toaster />
    </div>
  );
}