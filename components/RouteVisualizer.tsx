
import React from 'react';
import { RouteAnalysis, Hold } from '../types';

interface RouteVisualizerProps {
  image: string;
  analysis: RouteAnalysis;
}

const RouteVisualizer: React.FC<RouteVisualizerProps> = ({ image, analysis }) => {
  const getHoldColor = (type: Hold['type']) => {
    switch (type) {
      case 'start': return 'border-emerald-400 bg-emerald-400/30 shadow-[0_0_15px_rgba(52,211,153,0.4)]';
      case 'top': return 'border-rose-400 bg-rose-400/30 shadow-[0_0_20px_rgba(251,113,133,0.6)]';
      case 'hand': return 'border-indigo-400 bg-indigo-400/30 shadow-[0_0_15px_rgba(129,140,248,0.4)]';
      case 'foot': return 'border-cyan-400 bg-cyan-400/20';
      default: return 'border-white/50 bg-white/10';
    }
  };

  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] lg:aspect-square bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl group border border-white/10">
      <img 
        src={`data:image/jpeg;base64,${image}`} 
        className="w-full h-full object-cover brightness-[0.7] contrast-[1.1] transition-transform duration-700 group-hover:scale-[1.02]" 
        alt="Climbing Wall" 
      />
      
      {/* Scanline HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] opacity-20 z-10"></div>

      {/* Route Pathing SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20">
        <defs>
          <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        
        <path
          d={analysis.holds.reduce((acc, h, i) => 
            i === 0 ? `M ${h.x}% ${h.y}%` : `${acc} L ${h.x}% ${h.y}%`, 
          '')}
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#neonGlow)"
          className="opacity-70 animate-[dash_2s_linear_infinite]"
          strokeDasharray="12,12"
        />
      </svg>

      {/* Nodes / Holds */}
      {analysis.holds.map((hold, idx) => (
        <div 
          key={idx}
          className={`absolute w-8 h-8 sm:w-10 sm:h-10 -ml-4 -mt-4 sm:-ml-5 sm:-mt-5 border-2 transition-all duration-500 flex items-center justify-center cursor-help group/hold z-30 ${getHoldColor(hold.type)}`}
          style={{ 
            left: `${hold.x}%`, 
            top: `${hold.y}%`, 
            borderRadius: hold.type === 'start' || hold.type === 'top' ? '50%' : '14px',
            animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite ${idx * 0.1}s`
          }}
        >
          <div className="absolute inset-0 rounded-inherit bg-inherit blur-md opacity-50"></div>
          <span className="text-[10px] font-black text-white opacity-0 group-hover/hold:opacity-100 bg-slate-950/90 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/10 absolute -top-10 whitespace-nowrap transition-all z-40 uppercase tracking-widest scale-90 group-hover/hold:scale-100">
            {hold.type === 'top' ? 'FINAL_OBJ' : hold.type === 'start' ? 'ROOT_INIT' : `M${idx}_NODE`}
          </span>
          <div className="w-2 h-2 bg-white rounded-full relative z-0 shadow-lg"></div>
        </div>
      ))}

      {/* Top HUD Interface */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-start pointer-events-none z-40">
        <div className="bg-slate-950/60 backdrop-blur-2xl px-6 py-4 rounded-[2rem] border border-white/10 shadow-2xl flex items-center gap-4">
          <div className="space-y-1">
             <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{analysis.name}</h2>
             <div className="flex items-center gap-2">
               <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
               <p className="text-indigo-400 font-bold text-[10px] tracking-[0.2em] uppercase">{analysis.style}</p>
             </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white px-6 py-4 rounded-3xl font-black text-3xl shadow-2xl border border-white/20 transform rotate-2">
          {analysis.grade}
        </div>
      </div>
      
      {/* Bottom HUD Metadata */}
      <div className="absolute bottom-8 left-8 font-mono text-[9px] text-indigo-400/40 uppercase tracking-[0.3em] pointer-events-none z-40 space-y-1 hidden sm:block">
        <div className="flex gap-2"><span>ID:</span> <span className="text-white/60">#RT-{Math.floor(Math.random()*9000)+1000}</span></div>
        <div className="flex gap-2"><span>NODES:</span> <span className="text-white/60">{analysis.holds.length} points detected</span></div>
        <div className="flex gap-2"><span>SURFACE:</span> <span className="text-white/60">SCAN_COMPLETE_100%</span></div>
      </div>

      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -24; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default RouteVisualizer;
