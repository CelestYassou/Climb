
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
      setError("Caméra inaccessible. Vérifiez les réglages de votre navigateur.");
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
    <div className="fixed inset-0 bg-black z-[100] flex flex-col animate-in fade-in duration-300">
      <div className="relative flex-1 bg-slate-900 overflow-hidden flex items-center justify-center">
        {error ? (
          <div className="p-10 text-center bg-slate-950 rounded-[3rem] border border-white/5 mx-6">
            <p className="text-rose-400 mb-8 font-bold text-lg">{error}</p>
            <button 
              onClick={startCamera}
              className="px-8 py-4 bg-indigo-600 rounded-[1.5rem] flex items-center gap-3 mx-auto font-black shadow-2xl shadow-indigo-600/30 uppercase tracking-widest text-sm"
            >
              <RefreshCw className="w-5 h-5" /> Réessayer
            </button>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover brightness-[0.85] contrast-[1.1]"
          />
        )}
        
        {/* HUD Elements */}
        <div className="absolute top-10 inset-x-8 flex justify-between items-center pointer-events-none">
          <div className="bg-black/40 backdrop-blur-2xl px-5 py-2.5 rounded-2xl border border-white/10 flex items-center gap-3">
             <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black tracking-[0.3em] text-white uppercase mono">System_Live_Scan</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-4 bg-black/40 backdrop-blur-2xl hover:bg-black/60 rounded-2xl text-white transition-all pointer-events-auto border border-white/10 active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Framing Guide */}
        {!error && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center px-10">
            <div className="relative w-full max-w-sm aspect-[3/4] md:aspect-square">
              {/* Corners Néon */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-[3px] border-l-[3px] border-indigo-400 rounded-tl-[2rem] shadow-[-5px_-5px_15px_rgba(129,140,248,0.5)]"></div>
              <div className="absolute top-0 right-0 w-12 h-12 border-t-[3px] border-r-[3px] border-indigo-400 rounded-tr-[2rem] shadow-[5px_-5px_15px_rgba(129,140,248,0.5)]"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-[3px] border-l-[3px] border-indigo-400 rounded-bl-[2rem] shadow-[-5px_5px_15px_rgba(129,140,248,0.5)]"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-[3px] border-r-[3px] border-indigo-400 rounded-br-[2rem] shadow-[5px_5px_15px_rgba(129,140,248,0.5)]"></div>
              
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <Crosshair className="w-16 h-16 text-white" />
              </div>
              
              {/* Scanline animée */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_15px_rgba(129,140,248,0.8)] animate-[scan_4s_linear_infinite]"></div>
            </div>
            
            <p className="mt-12 text-white/70 text-[10px] font-black uppercase tracking-[0.5em] bg-black/30 px-6 py-2 rounded-full backdrop-blur-md border border-white/5 mono">
              Aligner avec le mur
            </p>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* Control Bar */}
      <div className="p-12 bg-slate-950 flex justify-center items-center border-t border-white/5">
        <button 
          onClick={capture}
          disabled={!isActive}
          className="group relative p-1.5 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-400 to-cyan-400 disabled:opacity-20 disabled:grayscale transition-all active:scale-90 shadow-[0_0_50px_rgba(79,70,229,0.3)]"
        >
          <div className="bg-slate-950 p-2.5 rounded-full">
            <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-full flex items-center justify-center group-hover:brightness-125 transition-all">
              <Camera className="w-10 h-10 text-white" />
            </div>
          </div>
        </button>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default CameraView;
