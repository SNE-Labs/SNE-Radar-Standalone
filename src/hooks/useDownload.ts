// Hook para download seguro do executável
// Sistema de token one-time para evitar burlar

import { useState } from 'react';

type DownloadState = 'idle' | 'requesting' | 'downloading' | 'error';

export const useDownload = () => {
  const [downloadState, setDownloadState] = useState<DownloadState>('idle');
  const [error, setError] = useState<string>('');

  const downloadExecutable = async (platform: 'win' | 'mac' = 'win') => {
    try {
      setDownloadState('requesting');
      setError('');

      // 1. Solicitar token de download (com autenticação)
      const tokenResponse = await fetch('https://api.snelabs.space/api/download-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Importante: envia cookies HttpOnly
        body: JSON.stringify({ platform }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(errorData.error || `Failed to get download token: ${tokenResponse.status}`);
      }

      const { token } = await tokenResponse.json();

      // 2. Usar token para fazer download (one-time use)
      setDownloadState('downloading');
      window.location.href = `https://api.snelabs.space/api/download/${token}`;

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
