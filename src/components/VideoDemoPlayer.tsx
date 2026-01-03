import { useState, useRef, useEffect } from 'react';

export const VideoDemoPlayer = () => {
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Timeout de 3 segundos para mostrar fallback se vídeo não carregar
    timeoutRef.current = setTimeout(() => {
      if (!videoLoaded) {
        console.log('Video load timeout, showing fallback');
        setShowFallback(true);
      }
    }, 3000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleVideoError = () => {
    console.log('Video failed to load, showing fallback');
    setVideoError(true);
    setShowFallback(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleVideoLoad = () => {
    console.log('Video loaded successfully');
    setVideoLoaded(true);
    setShowFallback(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Mostrar fallback se erro ou timeout
  if (showFallback || videoError) {
    return (
      <div className="relative rounded-lg overflow-hidden bg-black/50">
        <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            {/* Interface de Trading Simulada */}
            <div className="bg-gray-900/50 rounded-lg p-4 mb-4 max-w-xs mx-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400">BTC/USDT</span>
                <span className="text-xs text-green-400">$43,250</span>
              </div>
              <div className="h-16 bg-gradient-to-t from-green-500/20 to-blue-500/20 rounded mb-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                <div className="h-full w-full flex items-end">
                  {Array.from({ length: 20 }, (_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-orange-500/40 to-orange-400/20 rounded-t mx-px"
                      style={{
                        height: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Support: $42,850</span>
                <span className="text-gray-400">Resistance: $44,120</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>

            <p className="text-sm font-medium">SNE Radar Interface Demo</p>
            <p className="text-xs text-gray-400 mt-1">Real-time trading dashboard</p>
          </div>
        </div>

        {/* Overlay informativo */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-white text-xs">
          <span className="bg-black/50 px-2 py-1 rounded">SNE Radar Interface</span>
          <span className="bg-black/50 px-2 py-1 rounded">Live Preview</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden bg-black/50">
      <video
        ref={videoRef}
        className="w-full h-auto max-h-64 object-contain"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={handleVideoError}
        onLoadedData={handleVideoLoad}
        style={{ display: videoLoaded ? 'block' : 'none' }}
      >
        <source src="/SNERADARDEMO.mp4" type="video/mp4" />
      </video>

      {/* Loading state */}
      {!videoLoaded && !showFallback && (
        <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm">Loading interface demo...</p>
            <p className="text-xs text-gray-400 mt-1">SNE Radar trading dashboard</p>
          </div>
        </div>
      )}

      {/* Overlay informativo */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-white text-xs">
        <span className="bg-black/50 px-2 py-1 rounded">SNE Radar Interface</span>
        <span className="bg-black/50 px-2 py-1 rounded">Demo Loop</span>
      </div>
    </div>
  );
};
