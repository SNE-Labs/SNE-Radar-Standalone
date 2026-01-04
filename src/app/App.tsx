import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Download, Copy, Check, ExternalLink, Menu, X, ShieldCheck, Blocks, Laptop, KeyRound, Layers, Map, BarChart3, Star, PanelRight, RefreshCw, Monitor, Cpu, Shield, Computer, Wallet, CreditCard, Smartphone } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/accordion';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { Toaster, toast } from 'sonner';
import { VideoDemoPlayer } from '../components/VideoDemoPlayer';
import { useAuth } from '../hooks/useAuth';
import { useDownload } from '../hooks/useDownload';

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

  // Real auth integration (UI intact)
  const { authState, userLicenses, connectWallet: realConnectWallet, hasValidLicense } = useAuth();
  const { downloadState, downloadExecutable } = useDownload();

  // UI adaptation: map auth state to wallet state for existing UI
  const walletState = authState === 'connected' ? 'connected' :
                     authState === 'connecting' ? 'connecting' :
                     authState === 'wrong-network' ? 'wrong-network' : 'disconnected';

  // Mock wallet address for UI (real address comes from wagmi)
  const [address] = useState<string>('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb9');

  // Adapted connect function (UI intact, backend real)
  const connectWallet = async () => {
    try {
      await realConnectWallet();
      toast.success('Wallet conectada com sucesso');
    } catch (error) {
      toast.error('Falha na conexão');
      console.error(error);
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
    setTxState('pending');
    setTxHash('0x' + Math.random().toString(16).substr(2, 64));

    setTimeout(() => {
      setTxState('confirmed');
      const tokenId = Math.floor(Math.random() * 10000).toString();
      const activationCode = generateActivationCode();
      setMintedLicense({ tokenId, plan, activationCode });
      toast.success('Licença mintada com sucesso!');

      setTimeout(() => setTxState('idle'), 3000);
    }, 2000);
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleChoosePlan = () => {
    scrollToSection('pricing');
  };

  const handleWatchDemo = () => {
    // Scroll para o vídeo demo na hero section
    const heroSection = document.querySelector('.min-h-screen');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
      // Adicionar um destaque temporário ao vídeo
      const videoElement = heroSection.querySelector('video');
      if (videoElement) {
        videoElement.style.boxShadow = '0 0 30px rgba(234, 88, 12, 0.5)';
        setTimeout(() => {
          videoElement.style.boxShadow = '';
        }, 3000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 overflow-x-hidden pb-28 md:pb-0">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <img src="/favicon-96x96.png" alt="SNE Radar" className="w-8 h-8" />
                <span className="font-medium tracking-tight">SNE Radar</span>
              </div>
              
              <div className="hidden md:flex items-center gap-6 text-sm">
                <a href="#features" className="text-gray-400 hover:text-gray-100 transition-colors duration-200">Features</a>
                <a href="#pricing" className="text-gray-400 hover:text-gray-100 transition-colors duration-200">Pricing</a>
                <a href="#faq" className="text-gray-400 hover:text-gray-100 transition-colors duration-200">FAQ</a>
                <a href="https://snelabs.space/docs#overview" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-100 transition-colors duration-200">SNE OS (Docs)</a>
                <a href="https://snelabs.space/home" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-100 transition-colors duration-200">Status</a>
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
                <a href="#pricing" className="block text-gray-400 hover:text-gray-100 py-2">Pricing</a>
                <a href="#faq" className="block text-gray-400 hover:text-gray-100 py-2">FAQ</a>
                <div className="pt-3 space-y-2">
                  {walletState === 'disconnected' && (
                    <Button onClick={connectWallet} className="w-full" variant="outline">
                      Connect Wallet
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(234, 88, 12, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(234, 88, 12, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7"
            >
              <div className="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full mb-6">
                <span className="text-sm text-orange-500 font-mono">STANDALONE • DESKTOP</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight mb-6 leading-tight">
                Radar Standalone<br />
                <span className="text-orange-500">NTE no desktop. Zero latência.</span>
              </h1>

              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Inteligência de mercado e sinais em tempo real com execução local no Windows e macOS. Licença on-chain (NFT) na Scroll — transferível e com expiração automática.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  'Execução local',
                  '1 dispositivo ativo',
                  'NFT on-chain (Scroll)'
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="px-4 py-2 bg-white/5 rounded-full border border-white/10"
                  >
                    <span className="text-sm text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Button
                  size="lg"
                  onClick={handleChoosePlan}
                  className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/20"
                >
                  Choose plan
                </Button>
              </div>

              <div className="text-xs text-gray-500 mt-4">
                Scroll • USDC • NFT transferível • 1 dispositivo ativo
              </div>

              <p className="text-xs text-gray-500 mt-8 border-l-2 border-gray-800 pl-4">
                Ferramenta de análise e monitoramento. Não constitui recomendação de investimento.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <VideoDemoPlayer />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-2">Arquitetura de execução e licenciamento</h3>
            <p className="text-sm text-gray-400">Controle local + validade on-chain. Sem login e senha.</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { icon: Monitor, label: 'Desktop-first' },
              { icon: Blocks, label: 'Licença on-chain (Scroll)' },
              { icon: ShieldCheck, label: 'SIWE' },
              { icon: Computer, label: 'Windows + macOS' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-full cursor-default"
              >
                <item.icon className="h-4 w-4 text-orange-400" />
                <span className="text-xs font-medium text-gray-300">{item.label}</span>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative p-6 bg-gradient-to-b from-white/6 to-transparent border border-white/10 rounded-2xl hover:-translate-y-0.5 hover:border-white/20 transition"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-2xl"></div>
              <div className="text-xs font-mono text-orange-500 mb-2">LICENÇA</div>
              <h4 className="text-lg font-semibold text-white mb-2">Validade verificada on-chain</h4>
              <p className="text-sm text-white/70 mb-3">Acesso acompanha o NFT e expira automaticamente (30D/365D).</p>
              <div className="text-xs text-orange-400/80 font-medium">Outcome: licença transferível</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative p-6 bg-gradient-to-b from-white/6 to-transparent border border-white/10 rounded-2xl hover:-translate-y-0.5 hover:border-white/20 transition"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-2xl"></div>
              <div className="text-xs font-mono text-orange-500 mb-2">EXECUÇÃO</div>
              <h4 className="text-lg font-semibold text-white mb-2">Ativação vinculada ao dispositivo</h4>
              <p className="text-sm text-white/70 mb-3">Sessão por dispositivo para manter controle, revogar e atualizar.</p>
              <div className="text-xs text-orange-400/80 font-medium">Outcome: distribuição controlada</div>
            </motion.div>
          </div>

          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-white/5 to-transparent border border-white/10 rounded-xl">
              <KeyRound className="h-4 w-4 text-orange-400" />
              <span className="text-sm text-white/80">
                ↔ Transferível por NFT: ao transferir, o owner anterior perde acesso no próximo refresh.
              </span>
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
              Funcionalidades
            </h2>
            <p className="text-gray-400 text-lg">Sinais com contexto — do macro ao micro, em segundos.</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Featured Card - Multi-timeframe */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1 p-8 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-2xl hover:-translate-y-0.5 hover:border-white/20 transition group"
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 ring-1 ring-orange-500/20">
                <Layers className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-orange-400 transition-colors">
                Inteligência Multi-timeframe
              </h3>
              <p className="text-sm text-white/70 mb-3">
                Confluência automática entre períodos (1m → 1D) com leitura de regime de mercado.
              </p>
              <div className="text-xs text-orange-400/80 font-medium">
                Outcome: entries com mais confluência
              </div>
            </motion.div>

            {/* Regular Cards */}
            {[
              {
                icon: Map,
                title: 'Níveis & Zonas',
                desc: 'Suportes, resistências e áreas de interesse com contexto de liquidez.',
                outcome: 'níveis mais claros'
              },
              {
                icon: BarChart3,
                title: 'Scoring de Sinal',
                desc: 'Força do setup em score + confiança. Menos ruído, mais decisão.',
                outcome: 'priorização rápida'
              },
              {
                icon: Star,
                title: 'Watchlists',
                desc: 'Monitore ativos, gatilhos e mudanças de regime em tempo real.',
                outcome: 'monitoramento inteligente'
              },
              {
                icon: PanelRight,
                title: 'Painéis de Contexto',
                desc: 'Contexto de mercado ao lado do gráfico — sem trocar de tela.',
                outcome: 'análise integrada'
              },
              {
                icon: RefreshCw,
                title: 'Updates Contínuos',
                desc: 'Novos módulos e melhorias frequentes — sem reinstalar o app.',
                outcome: 'produto sempre atual'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i + 1) * 0.1 }}
                className="p-6 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-2xl hover:-translate-y-0.5 hover:border-white/20 transition group"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 ring-1 ring-orange-500/20">
                  <feature.icon className="h-5 w-5 text-orange-400" />
                </div>
                <h3 className="font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/70 mb-3">{feature.desc}</p>
                <div className="text-xs text-orange-400/80 font-medium">
                  Outcome: {feature.outcome}
                </div>
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
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              Segurança e Licenciamento
            </h2>
            <p className="text-gray-400">Execução desktop. Propriedade on-chain. Ativação vinculada ao dispositivo.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: ShieldCheck,
                title: 'Autenticação SIWE',
                desc: 'Login por assinatura. Sem senhas. Sem segredos armazenados.'
              },
              {
                icon: Blocks,
                title: 'Validade On-chain (Scroll)',
                desc: 'Propriedade e expiração da licença verificadas na blockchain.'
              },
              {
                icon: Laptop,
                title: 'Ativação por Dispositivo',
                desc: 'Um dispositivo ativo por licença. Chaves de sessão vinculadas.'
              },
              {
                icon: KeyRound,
                title: 'Transferência e Revogação',
                desc: 'Transfira o NFT → acesso passa para o novo proprietário.'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6
                           hover:-translate-y-0.5 hover:border-white/20 transition"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl
                                bg-orange-500/10 ring-1 ring-orange-500/20">
                  <item.icon className="h-5 w-5 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/70">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-gradient-to-r from-white/5 to-transparent px-6 py-4">
              <KeyRound className="h-5 w-5 text-orange-400" />
              <div className="text-left">
                <div className="text-sm font-medium text-white">Licença NFT transferível</div>
                <div className="text-xs text-white/60">Acesso segue o proprietário e validade on-chain. Proprietário anterior perde acesso após atualização.</div>
              </div>
            </div>
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
              Acesse em 3 passos
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                step: '01',
                icon: Wallet,
                title: 'Conecte sua wallet (SIWE)',
                desc: 'Autenticação por assinatura. Sem senha.',
                outcome: 'sessão autenticada'
              },
              {
                step: '02',
                icon: CreditCard,
                title: 'Escolha um plano e emita a licença na Scroll',
                desc: 'NFT (ERC-721) transferível • validade 30D/365D',
                outcome: 'licença NFT ativa'
              },
              {
                step: '03',
                icon: Download,
                title: 'Baixe e ative no seu PC',
                desc: 'Token ID + código de ativação • 1 dispositivo ativo',
                outcome: 'app liberado no desktop'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-6 bg-gradient-to-b from-white/3 to-transparent border border-white/10 rounded-2xl hover:-translate-y-0.5 hover:border-white/20 transition group"
              >
                <div className="absolute -top-4 left-6 flex items-center justify-center w-8 h-8 bg-orange-500 rounded-full">
                  <item.icon className="h-4 w-4 text-white" />
                </div>
                <div className="text-5xl font-bold text-gray-700 mb-4 opacity-20">{item.step}</div>
                <h3 className="font-semibold mb-3 text-lg text-white group-hover:text-orange-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-white/70 mb-3">{item.desc}</p>
                <div className="text-xs text-orange-400/80 font-medium">
                  Outcome: {item.outcome}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mb-8">
            <Button
              onClick={() => document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth", block: "start" })}
              variant="outline"
              className="border-white/20 hover:border-orange-400/50 transition-colors"
            >
              Choose plan
            </Button>
            <p className="text-xs text-gray-400 mt-2">Leva 2 min • USDC na Scroll</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-white/5 to-transparent border border-white/10 rounded-xl">
              <KeyRound className="h-5 w-5 text-orange-400 flex-shrink-0" />
              <p className="text-sm text-white/80 text-center">
                ↔ Licença transferível: ao transferir, o acesso migra para o novo owner na próxima verificação do app.
              </p>
            </div>
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
              className="p-8 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-2xl hover:-translate-y-0.5 hover:border-white/20 transition"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-white mb-4">Pro 30D</h3>
                <div className="mb-2">
                  <div className="text-4xl font-bold text-white">49</div>
                  <div className="text-lg text-orange-400 font-semibold">USDC</div>
                </div>
                <div className="text-sm text-gray-400 mb-1">+ gas na Scroll (baixo)</div>
                <div className="text-xs text-gray-500">Cobrança em USDC • Scroll</div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <Monitor className="h-4 w-4 text-orange-400 flex-shrink-0" />
                  <span>1 dispositivo ativo</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <RefreshCw className="h-4 w-4 text-orange-400 flex-shrink-0" />
                  <span>Updates incluídos</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <KeyRound className="h-4 w-4 text-orange-400 flex-shrink-0" />
                  <span>Transferível (NFT)</span>
                </div>
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
                variant="outline"
                className="w-full border-white/20 hover:border-orange-400/50 transition-colors mb-2"
              >
                {txState === 'pending' ? 'Processando...' : 'Get license'}
              </Button>
              <div className="text-center text-xs text-gray-500">
                Mint on Scroll • USDC • ERC-721
              </div>
            </motion.div>

            {/* 365D Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative p-8 bg-gradient-to-b from-orange-500/10 to-white/5 border border-orange-500/30 rounded-2xl hover:-translate-y-1 hover:border-orange-400/50 transition overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-500/10 rounded-2xl"></div>
              <Badge className="absolute top-4 right-4 bg-orange-500 text-white border-0 z-10">
                Melhor valor
              </Badge>

              <div className="relative text-center mb-8">
                <h3 className="text-2xl font-semibold text-white mb-4">Pro 365D</h3>
                <div className="mb-2">
                  <div className="text-4xl font-bold text-white">399</div>
                  <div className="text-lg text-orange-400 font-semibold">USDC</div>
                </div>
                <div className="text-sm text-gray-400 mb-1">≈ 1.09 USDC/dia</div>
                <div className="text-xs text-green-400 font-medium">Economize ~32% vs mensal</div>
              </div>

              <div className="relative space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <Monitor className="h-4 w-4 text-orange-400 flex-shrink-0" />
                  <span>1 dispositivo ativo</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <RefreshCw className="h-4 w-4 text-orange-400 flex-shrink-0" />
                  <span>Updates incluídos</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <KeyRound className="h-4 w-4 text-orange-400 flex-shrink-0" />
                  <span>Transferível (NFT)</span>
                </div>
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
                className="relative w-full bg-orange-500 hover:bg-orange-600 transition-all duration-200 mb-2"
              >
                {txState === 'pending' ? 'Processando...' : 'Get license'}
              </Button>
              <div className="relative text-center text-xs text-gray-500">
                Mint on Scroll • USDC • ERC-721
              </div>
            </motion.div>
          </div>

          {/* Watch Demo Button */}
          <div className="text-center mt-12 mb-6">
            <Button
              onClick={handleWatchDemo}
              variant="outline"
              size="lg"
              className="border-gray-700 hover:border-orange-500/50 transition-all duration-200 px-8 py-3"
            >
              Watch demo (90s)
            </Button>
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
                <h2 className="text-3xl font-medium mb-2">Licença confirmada on-chain</h2>
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
                  <h4 className="font-medium mb-3">Ativação no app</h4>
                  <ol className="space-y-2 text-sm text-gray-400">
                    <li>1. Abra o Radar Standalone</li>
                    <li>2. Clique em Activate</li>
                    <li>3. Insira Token ID + Activation Code</li>
                  </ol>
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
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">
              FAQ
            </h2>
            <p className="text-gray-400">Licença, ativação, transferência e uso do Radar Standalone.</p>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                q: 'Como funciona ativação (1 dispositivo)?',
                a: 'Ative 1 dispositivo por vez para garantir controle, updates e revogação.\n\n• Ao ativar, o app cria uma sessão vinculada ao dispositivo.\n• Você pode reativar quando necessário (ex.: troca de máquina), respeitando as regras de segurança.'
              },
              {
                q: 'E se eu trocar de computador?',
                a: 'Você faz re-ativação com sua wallet + token/ID.\n\n• O dispositivo anterior perde acesso na próxima verificação.\n• Se precisar, o suporte pode ajudar em casos de troca/format.'
              },
              {
                q: 'A licença é transferível?',
                a: 'Sim. A licença é um NFT — quem possui a NFT possui o acesso enquanto válida.\n\n• Transferência acontece on-chain (Scroll).\n• Validade e owner são verificados pelo app.'
              },
              {
                q: 'O que acontece se eu transferir a licença?',
                a: 'O acesso acompanha o novo owner.\n\n• O owner anterior perde acesso na próxima atualização/verificação.\n• Não há "duas ativações" simultâneas.'
              },
              {
                q: 'Funciona offline?',
                a: 'Parcialmente.\n\n• A interface abre e você pode navegar.\n• Para validar licença/owner e puxar dados em tempo real, precisa conexão.'
              },
              {
                q: 'Como funciona renovação?',
                a: 'Renovação = mint de uma nova validade (ou extensão).\n\n• Sem cartão/fiat: pagamento em crypto na Scroll.\n• A licença expira automaticamente on-chain.'
              },
              {
                q: 'Preciso ter crypto para usar?',
                a: 'Sim — para mint/renovar você precisa de USDC na Scroll e um pouco de ETH para gas.\n\n• Gas é baixo.\n• Se você já tem wallet, é bem direto.'
              },
              {
                q: 'Isso é conselho financeiro?',
                a: 'Não. O Radar é uma ferramenta de análise e monitoramento.\n\n• Você toma as decisões.\n• Nada aqui garante retornos.'
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

          <div className="text-center mt-12">
            <div className="text-sm text-gray-400 mb-4">
              Precisa de ajuda? <a href="#" className="text-orange-400 hover:text-orange-300">Suporte via Telegram →</a>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Choose plan
              </Button>
              <a href="#pricing" className="text-orange-400 hover:text-orange-300 text-sm font-medium inline-flex items-center gap-2">
                Go to pricing →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Terms & Privacy Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Terms of Service */}
            <div id="terms">
              <h3 className="text-xl font-semibold text-white mb-4">Terms of Service</h3>
              <div className="text-sm text-gray-300 space-y-3">
                <p>
                  <strong>SNE Radar Standalone</strong> é uma ferramenta de análise técnica e monitoramento de mercado.
                  Não constitui recomendação de investimento, aconselhamento financeiro, jurídico ou fiscal.
                </p>
                <p>
                  Ao adquirir uma licença, você concorda com os seguintes termos:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li>Licença é válida por 30 ou 365 dias a partir da ativação</li>
                  <li>Acesso limitado a 1 dispositivo ativo por licença</li>
                  <li>Licença é transferível via NFT na blockchain Scroll</li>
                  <li>Responsabilidade limitada ao valor pago pela licença</li>
                  <li>Uso permitido apenas para análise pessoal</li>
                </ul>
                <p className="text-xs text-gray-500 mt-4">
                  Para termos completos, consulte documentação técnica.
                </p>
              </div>
            </div>

            {/* Privacy Policy */}
            <div id="privacy">
              <h3 className="text-xl font-semibold text-white mb-4">Privacy Policy</h3>
              <div className="text-sm text-gray-300 space-y-3">
                <p>
                  Respeitamos sua privacidade e não coletamos dados pessoais desnecessários.
                </p>
                <p>
                  <strong>Dados coletados:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li>Endereço da wallet (para verificação de propriedade NFT)</li>
                  <li>Dados de uso anônimos (para melhorias do produto)</li>
                  <li>Informações de contato voluntárias (suporte)</li>
                </ul>
                <p>
                  <strong>Não coletamos:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li>Dados financeiros ou de transações</li>
                  <li>Histórico de navegação ou preferências pessoais</li>
                  <li>Informações sensíveis ou identificáveis</li>
                </ul>
                <p className="text-xs text-gray-500 mt-4">
                  Seus dados são criptografados e armazenados com segurança.
                  Para dúvidas sobre privacidade, contate nosso suporte.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <img src="/favicon-96x96.png" alt="SNE Radar" className="w-8 h-8" />
              <span className="font-medium tracking-tight">SNE Radar Standalone</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="https://snelabs.space/docs#overview" target="_blank" rel="noopener noreferrer" className="hover:text-gray-100 transition-colors">SNE OS (Docs)</a>
              <a href="https://snelabs.space/home" target="_blank" rel="noopener noreferrer" className="hover:text-gray-100 transition-colors">Status</a>
              <a href="#terms" className="hover:text-gray-100 transition-colors">Terms</a>
              <a href="#privacy" className="hover:text-gray-100 transition-colors">Privacy</a>
              <a href="https://t.me/snelabs" target="_blank" rel="noopener noreferrer" className="hover:text-gray-100 transition-colors">Support</a>
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
      <div
        className="
          md:hidden fixed bottom-0 left-0 right-0 z-40
          border-t border-gray-800 bg-gray-900/95 backdrop-blur-lg
          p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]
        "
      >
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-100">Unlock NTE on desktop</div>
            <div className="text-xs text-gray-400">From 49 USDC • Scroll • 1 active device</div>
          </div>

          <Button
            onClick={() =>
              document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="shrink-0 bg-orange-500 hover:bg-orange-600"
          >
            Choose plan
          </Button>
        </div>
      </div>

      {/* Toaster */}
      <Toaster />
    </div>
  );
}