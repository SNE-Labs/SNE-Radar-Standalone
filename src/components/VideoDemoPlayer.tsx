import { useState, useRef } from 'react';

export const VideoDemoPlayer = () => {
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoError = () => {
    console.log('Video failed to load, showing fallback');
    setVideoError(true);
  };

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  if (videoError) {
    return (
      <div className="relative rounded-lg overflow-hidden bg-black/50">
        <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <p className="text-sm font-medium">SNE Radar Interface Demo</p>
            <p className="text-xs text-gray-400 mt-1">Interactive trading dashboard preview</p>
            <div className="mt-4 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
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
        {/* Fallback se vídeo não carregar */}
        <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <p className="text-sm">Video preview not available</p>
          </div>
        </div>
      </video>

      {/* Loading state */}
      {!videoLoaded && !videoError && (
        <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm">Loading demo...</p>
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
