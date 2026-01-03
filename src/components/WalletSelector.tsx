import React, { useState } from 'react';
import { Button } from '../app/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../app/components/ui/dialog';
import { motion } from 'motion/react';

interface WalletSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (connectorName: string) => void;
  availableConnectors: Array<{
    id: string;
    name: string;
    ready: boolean;
  }>;
  isConnecting: boolean;
}

export const WalletSelector: React.FC<WalletSelectorProps> = ({
  isOpen,
  onClose,
  onSelectWallet,
  availableConnectors,
  isConnecting,
}) => {
  const handleWalletSelect = async (connectorName: string) => {
    try {
      await onSelectWallet(connectorName);
      onClose();
    } catch (error) {
      console.error('Wallet selection error:', error);
    }
  };

  const getConnectorDisplayName = (name: string) => {
    switch (name) {
      case 'MetaMask':
        return 'MetaMask';
      case 'WalletConnect':
        return 'WalletConnect';
      case 'Injected':
        return 'Browser Wallet';
      default:
        return name;
    }
  };

  const getConnectorIcon = (name: string) => {
    switch (name) {
      case 'MetaMask':
        return '🦊';
      case 'WalletConnect':
        return '🔗';
      case 'Injected':
        return '🌐';
      default:
        return '👛';
    }
  };

  // Filtrar conectores duplicados e mostrar apenas os relevantes
  const relevantConnectors = availableConnectors.filter(connector =>
    connector.name === 'MetaMask' ||
    connector.name === 'WalletConnect' ||
    (connector.name === 'Injected' && !availableConnectors.some(c => c.name === 'MetaMask'))
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-center">Conectar Wallet</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {relevantConnectors.map((connector) => (
            <motion.div
              key={connector.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => handleWalletSelect(connector.name)}
                disabled={!connector.ready || isConnecting}
                className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white h-14 text-lg font-medium"
                variant="outline"
              >
                <span className="text-2xl mr-3">{getConnectorIcon(connector.name)}</span>
                <span className="flex-1 text-left">
                  {getConnectorDisplayName(connector.name)}
                </span>
                {!connector.ready && (
                  <span className="text-xs text-gray-400 ml-2">Não instalado</span>
                )}
                {isConnecting && (
                  <motion.div
                    className="ml-2 w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-3 bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-400 text-center">
            Recomendamos MetaMask para desktop e WalletConnect para mobile
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
