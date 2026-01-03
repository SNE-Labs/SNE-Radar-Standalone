export const VideoDemoPlayer = () => {
  return (
    <div className="relative rounded-lg overflow-hidden bg-black/50">
      <video
        className="w-full h-auto max-h-64 object-contain"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
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
