
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, RefreshCw, X, Crosshair } from 'lucide-react';

interface CameraViewProps {
  onCapture: (base64: string) => void;
  onClose: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
      }
    } catch (err) {
      console.error(err);
      setError("Impossible d'accéder à la caméra. Vérifiez les permissions.");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    
    const base64 = canvasRef.current.toDataURL('image/jpeg', 0.9).split(',')[1];
    onCapture(base64);
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col">
      <div className="relative flex-1 bg-slate-900 overflow-hidden flex items-center justify-center">
        {error ? (
          <div className="p-8 text-center bg-slate-950 rounded-3xl border border-white/5 mx-6">
            <p className="text-rose-400 mb-6 font-bold">{error}</p>
            <button 
              onClick={startCamera}
              className="px-6 py-3 bg-indigo-600 rounded-2xl flex items-center gap-2 mx-auto font-bold shadow-xl shadow-indigo-500/20"
            >
              <RefreshCw className="w-4 h-4" /> Réessayer
            </button>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover brightness-[0.8] contrast-[1.1]"
          />
        )}
        
        {/* Top HUD */}
        <div className="absolute top-6 inset-x-6 flex justify-between items-center pointer-events-none">
          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
             <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black tracking-widest text-white uppercase">Live_Feed 1080p</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-black/40 backdrop-blur-md hover:bg-black/60 rounded-2xl text-white transition-all pointer-events-auto border border-white/10 active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Framing Guide - More Modern */}
        {!error && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            <div className="relative w-72 h-[450px]">
              {/* Corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-indigo-400 rounded-tl-2xl"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-indigo-400 rounded-tr-2xl"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-indigo-400 rounded-bl-2xl"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-indigo-400 rounded-br-2xl"></div>
              
              {/* Center Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <Crosshair className="w-12 h-12 text-white" />
              </div>
              
              {/* Scanline line */}
              <div className="absolute top-0 inset-x-0 h-px bg-indigo-400/50 shadow-[0_0_10px_rgba(129,140,248,0.5)] animate-[scan_3s_ease-in-out_infinite]"></div>
            </div>
            
            <p className="mt-8 text-white/60 text-[10px] font-black uppercase tracking-[0.4em] bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm">
              Alignement mural requis
            </p>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* Control Bar */}
      <div className="p-10 bg-slate-950 flex justify-center items-center border-t border-white/5">
        <button 
          onClick={capture}
          disabled={!isActive}
          className="group relative p-1 rounded-full bg-gradient-to-tr from-indigo-500 via-indigo-400 to-cyan-400 disabled:opacity-30 disabled:grayscale transition-all active:scale-90 shadow-2xl shadow-indigo-500/40"
        >
          <div className="bg-slate-950 p-2 rounded-full">
            <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center group-hover:brightness-110 transition-all">
              <Camera className="w-10 h-10 text-white" />
            </div>
          </div>
        </button>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
        @keyframes dash {
          to { stroke-dashoffset: -20; }
        }
      `}</style>
    </div>
  );
};

export default CameraView;
