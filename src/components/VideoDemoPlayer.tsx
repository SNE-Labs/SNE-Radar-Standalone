import { useState } from 'react';

export const VideoDemoPlayer = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative rounded-lg overflow-hidden bg-black/50">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 z-10">
          <div className="text-center text-white">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm">Loading demo...</p>
          </div>
        </div>
      )}

      <video
        className="w-full h-auto max-h-64 object-contain"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={handleVideoLoad}
        onCanPlay={() => setIsLoading(false)}
      >
        <source src="/SNERADARDEMO.mp4" type="video/mp4" />
        Seu navegador não suporta vídeos.
      </video>

      {/* Overlay informativo */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-white text-xs">
        <span className="bg-black/50 px-2 py-1 rounded">SNE Radar Interface</span>
        <span className="bg-black/50 px-2 py-1 rounded">Demo Loop</span>
      </div>
    </div>
  );
};
