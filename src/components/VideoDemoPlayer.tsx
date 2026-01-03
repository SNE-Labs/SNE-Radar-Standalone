import { useState, useRef } from 'react';

export const VideoDemoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = async () => {
    setIsLoading(true);
    try {
      if (videoRef.current) {
        await videoRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Video play failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative rounded-lg overflow-hidden bg-black/50">
      <video
        ref={videoRef}
        className="w-full h-auto max-h-64 object-contain"
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        style={{ display: isPlaying ? 'block' : 'none' }}
      >
        <source src="/SNERADARDEMO.mp4" type="video/mp4" />
        Seu navegador não suporta vídeos.
      </video>

      {/* Preview/Poster quando vídeo não está tocando */}
      {!isPlaying && (
        <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            {/* Simulação visual da interface */}
            <div className="bg-gray-900/50 rounded-lg p-4 mb-4 max-w-xs mx-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400">BTC/USDT</span>
                <span className="text-xs text-green-400">$43,250</span>
              </div>
              <div className="h-12 bg-gradient-to-t from-green-500/20 to-blue-500/20 rounded mb-2 flex items-end justify-center">
                <div className="w-1 bg-orange-500/60 rounded-t animate-pulse"></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Support: $42,850</span>
                <span className="text-gray-400">Resistance: $44,120</span>
              </div>
            </div>

            {/* Botão Play */}
            <button
              onClick={handlePlay}
              disabled={isLoading}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span>Watch Demo</span>
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 mt-2">SNE Radar trading interface</p>
          </div>
        </div>
      )}

      {/* Overlay informativo */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-white text-xs">
        <span className="bg-black/50 px-2 py-1 rounded">SNE Radar Interface</span>
        <span className="bg-black/50 px-2 py-1 rounded">Interactive Demo</span>
      </div>
    </div>
  );
};
