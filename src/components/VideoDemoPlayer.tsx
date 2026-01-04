export const VideoDemoPlayer = () => {
  return (
    <div className="relative">
      {/* App Window Frame */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-white/10 backdrop-blur-sm"></div>

      {/* Window Controls */}
      <div className="absolute top-3 left-4 flex items-center gap-2 z-10">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-black/80 shadow-2xl border border-white/10 backdrop-blur-sm p-2">
        <video
          className="w-full h-auto max-h-64 object-contain rounded-lg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={`${import.meta.env.BASE_URL}demo.mp4`} type="video/mp4" />
          Seu navegador não suporta vídeos.
        </video>

        {/* Overlay informativo */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <span className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-md border border-white/10">SNE Radar Interface</span>
          <span className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-md border border-white/10">90s demo</span>
        </div>

      </div>
    </div>
  );
};
