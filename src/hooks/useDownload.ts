// Hook para download seguro do executável
// Sistema de token one-time para evitar burlar

import { useState } from 'react';

console.log('🔧 useDownload hook initialized');

// Usar mesma configuração da API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.snelabs.space';

type DownloadState = 'idle' | 'requesting' | 'downloading' | 'error';

export const useDownload = () => {
  const [downloadState, setDownloadState] = useState<DownloadState>('idle');
  const [error, setError] = useState<string>('');

  const downloadExecutable = async (platform: 'win' | 'mac' = 'win') => {
    console.log('🚀 downloadExecutable called with platform:', platform);

    try {
      setDownloadState('requesting');
      setError('');

      // 1. Solicitar token de download (com autenticação)
      console.log('📡 Making request to:', `${API_BASE_URL}/api/download-token`);

      const tokenResponse = await fetch(`${API_BASE_URL}/api/download-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Importante: envia cookies HttpOnly
        body: JSON.stringify({ platform }),
      });

      console.log('📥 Token response status:', tokenResponse.status);

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('❌ Token response error:', errorText);
        throw new Error(`Failed to get download token: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();
      console.log('✅ Token received:', tokenData);
      const { token } = tokenData;

      // 2. Usar token para fazer download (one-time use)
      setDownloadState('downloading');
      window.location.href = `${API_BASE_URL}/api/download/${token}`;

      // Reset state after successful download initiation
      setTimeout(() => setDownloadState('idle'), 2000);

    } catch (err) {
      console.error('Download error:', err);
      setDownloadState('error');
      setError(err instanceof Error ? err.message : 'Download failed');
      setTimeout(() => setDownloadState('idle'), 3000);
    }
  };

  return {
    downloadState,
    error,
    downloadExecutable,
    isDownloading: downloadState === 'requesting' || downloadState === 'downloading'
  };
};
