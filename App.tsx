
import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  ChevronRight, 
  Zap, 
  Map as MapIcon, 
  Info, 
  Play, 
  History, 
  ArrowLeft,
  Trophy,
  Dna,
  Layers,
  Search,
  Settings,
  Bell
} from 'lucide-react';
import CameraView from './components/CameraView';
import RouteVisualizer from './components/RouteVisualizer';
import { analyzeWall } from './services/climbingAnalyzer';
import { RouteAnalysis, AppStatus } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>('idle');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<RouteAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async (base64: string) => {
    setCapturedImage(base64);
    setStatus('analyzing');
    try {
      const result = await analyzeWall(base64);
      setAnalysis(result);
      setStatus('results');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Échec de l'analyse du mur. Réessayez.");
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setCapturedImage(null);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 font-sans">
      
      {/* Desktop Navigation Header */}
      <nav className="hidden md:flex sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-black tracking-tighter cursor-pointer" onClick={reset}>
            CLIMB<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">CORE</span>
          </h1>
          <div className="flex gap-6 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <button className="hover:text-indigo-400 transition-colors">Explorer</button>
            <button className="hover:text-indigo-400 transition-colors">Entrainement</button>
            <button className="hover:text-indigo-400 transition-colors">Communauté</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Rechercher un bloc..." 
              className="bg-slate-900 border border-white/5 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500/50 w-64"
            />
          </div>
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors"><Bell className="w-5 h-5 text-slate-400" /></button>
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors"><Settings className="w-5 h-5 text-slate-400" /></button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 border border-white/10 shadow-lg"></div>
        </div>
      </nav>

      {/* Mobile Header (Hidden on Desktop) */}
      <header className="md:hidden p-6 pt-12 flex justify-between items-center bg-slate-950/50">
        <h1 className="text-3xl font-black tracking-tighter" onClick={reset}>
          CLIMB<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">CORE</span>
        </h1>
        <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center">
           <Zap className="w-4 h-4 text-indigo-400" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto pb-24 md:pb-12">
        {status === 'idle' && (
          <div className="p-6 md:p-12 space-y-12">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-bold tracking-widest uppercase animate-pulse">
                  <Zap className="w-3 h-3" /> AI Perception System Active
                </div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none italic">
                  VOTRE COACH<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-200 to-cyan-400">AUGMENTÉ</span>
                </h2>
                <p className="text-slate-400 text-lg max-w-xl mx-auto md:mx-0 font-medium leading-relaxed">
                  Utilisez la vision spatiale pour identifier instantanément les voies, calculer les séquences de mouvements optimales et suivre votre progression biomécanique.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                  <button 
                    onClick={() => setStatus('camera')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 active:scale-95 transition-all shadow-2xl shadow-indigo-500/30 uppercase tracking-widest text-sm"
                  >
                    <Camera className="w-6 h-6" /> Scanner le mur
                  </button>
                  <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-5 rounded-[2rem] font-black border border-white/10 transition-all uppercase tracking-widest text-sm">
                    Mes projets
                  </button>
                </div>
              </div>
              <div className="flex-1 w-full max-w-lg">
                <div className="relative aspect-square md:aspect-[4/3] bg-indigo-500/10 rounded-[3rem] border border-white/5 overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-transparent to-transparent z-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=800" 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 grayscale hover:grayscale-0"
                    alt="Climbing Gym"
                  />
                  <div className="absolute bottom-8 left-8 z-20 space-y-2">
                    <div className="flex gap-2">
                      <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-bold">ARC-V4</div>
                      <div className="px-3 py-1 bg-indigo-500/50 backdrop-blur-md rounded-lg text-[10px] font-bold">TOP_LOCK</div>
                    </div>
                    <div className="text-white font-black text-xl italic tracking-tighter">GYM_ANALYSIS.EXE</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Dna />, label: "Neural Mapping", desc: "Scan 3D des prises", color: "indigo" },
                { icon: <Layers />, label: "Flow Engine", desc: "Algorithme de beta", color: "cyan" },
                { icon: <Trophy />, label: "Power Stats", desc: "Force de préhension", color: "emerald" },
                { icon: <History />, label: "Smart Log", desc: "Historique visuel", color: "rose" }
              ].map((f, i) => (
                <div key={i} className="bg-white/[0.03] backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/30 transition-all group hover:-translate-y-1">
                  <div className={`w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform`}>
                    {/* Fixed TypeScript error by casting to ReactElement<any> */}
                    {React.cloneElement(f.icon as React.ReactElement<any>, { className: `w-7 h-7 text-indigo-400` })}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{f.label}</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* History Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-black text-slate-600 uppercase text-xs tracking-[0.3em]">Sessions Récentes</h3>
                <div className="h-px flex-1 bg-slate-900 mx-8"></div>
                <button className="text-indigo-400 font-bold text-xs uppercase hover:underline">Voir tout</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-6 bg-white/[0.02] hover:bg-white/[0.05] p-5 rounded-[2rem] border border-white/5 transition-all group cursor-pointer">
                    <div className="w-20 h-20 bg-slate-900 rounded-3xl overflow-hidden shrink-0 border border-white/5">
                      <img src={`https://picsum.photos/seed/${i + 120}/200/200`} className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-slate-200 group-hover:text-white transition-colors text-lg italic">Arkose Bloc {i}</h4>
                      <p className="text-xs text-slate-500 font-bold tracking-[0.1em] uppercase">V{i+2} • 14:30 • Paris Sud</p>
                    </div>
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {status === 'analyzing' && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-10 px-6">
            <div className="relative">
              <div className="w-40 h-40 border-4 border-indigo-500/10 border-t-indigo-400 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-full blur-2xl animate-pulse opacity-50"></div>
                <Zap className="relative w-12 h-12 text-white animate-bounce" />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tighter italic uppercase">Analyse Spatiale</h2>
              <div className="flex gap-2 justify-center">
                 <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                 <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                 <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
              </div>
              <p className="text-slate-400 text-lg max-w-md mx-auto font-medium">
                Détection des points de contact, calcul du centre de gravité et génération du graphe de transition...
              </p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8">
            <div className="w-24 h-24 bg-rose-500/10 rounded-[2rem] flex items-center justify-center mb-8 border border-rose-500/20 shadow-2xl shadow-rose-500/10">
              <Info className="text-rose-400 w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black tracking-tight mb-4 uppercase italic">Error_Code: 502</h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-sm">{error}</p>
            <button 
              onClick={reset}
              className="bg-slate-900 hover:bg-slate-800 text-white px-12 py-5 rounded-3xl font-black border border-white/10 transition-all uppercase tracking-widest text-sm shadow-xl"
            >
              Initialiser un nouveau scan
            </button>
          </div>
        )}

        {status === 'results' && capturedImage && analysis && (
          <div className="p-6 md:p-12 animate-in fade-in zoom-in-95 duration-700">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Visualizer Column */}
              <div className="flex-[1.2] space-y-6">
                 <RouteVisualizer image={capturedImage} analysis={analysis} />
                 <div className="hidden lg:flex gap-4 p-4 bg-white/[0.03] rounded-3xl border border-white/5">
                    <div className="flex-1 text-center">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Difficulté</p>
                      <p className="text-2xl font-black text-indigo-400 italic">{analysis.grade}</p>
                    </div>
                    <div className="w-px h-12 bg-white/5"></div>
                    <div className="flex-1 text-center">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Mouvements</p>
                      <p className="text-2xl font-black text-white italic">{analysis.beta.length}</p>
                    </div>
                    <div className="w-px h-12 bg-white/5"></div>
                    <div className="flex-1 text-center">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Confiance IA</p>
                      <p className="text-2xl font-black text-cyan-400 italic">94%</p>
                    </div>
                 </div>
              </div>
              
              {/* Info Column */}
              <div className="flex-1 space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <h2 className="text-5xl font-black tracking-tighter italic uppercase">{analysis.name}</h2>
                    <span className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-xs pb-1">{analysis.style}</span>
                  </div>
                  <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"></div>
                  <p className="text-slate-300 text-lg leading-relaxed bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 italic relative overflow-hidden">
                    <span className="absolute -top-4 -left-2 text-8xl text-white/5 font-serif select-none pointer-events-none">"</span>
                    {analysis.description}
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Séquence Alpha-Beta</h3>
                  <div className="space-y-4">
                    {analysis.beta.map((b) => (
                      <div key={b.step} className="flex gap-6 group">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-xl group-hover:border-indigo-500/50 transition-all group-hover:scale-110">
                            {b.step}
                          </div>
                          <div className="w-px flex-1 bg-gradient-to-b from-slate-800 to-transparent my-3 group-last:hidden"></div>
                        </div>
                        <div className="pb-8 pt-2">
                          <h4 className="font-black text-indigo-300 mb-2 uppercase text-sm tracking-[0.1em]">{b.action}</h4>
                          <p className="text-slate-400 leading-relaxed font-medium">{b.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sticky bottom-24 lg:static lg:bottom-0 pt-4 flex gap-4">
                  <button className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white py-6 rounded-[2rem] font-black flex items-center justify-center gap-3 active:scale-95 transition-all shadow-2xl shadow-indigo-500/40 uppercase tracking-widest text-sm">
                    <Play className="w-5 h-5 fill-current" /> Initialiser Session
                  </button>
                  <button className="hidden sm:flex aspect-square w-20 bg-slate-900 border border-white/10 rounded-[2rem] items-center justify-center text-slate-400 hover:text-white transition-all hover:bg-white/5">
                    <History className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile-Only Bottom Navigation Bar (Glassmorphism) */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 h-20 bg-slate-950/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] flex justify-around items-center z-[60] shadow-2xl">
        <button className={`flex flex-col items-center gap-1 transition-all ${status === 'idle' ? 'text-indigo-400' : 'text-slate-600'}`}>
          <MapIcon className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-widest">Feed</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-600">
          <Trophy className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-widest">Rank</span>
        </button>
        
        <div className="relative -top-10">
           <button 
            onClick={() => setStatus('camera')}
            className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-500/50 border-4 border-slate-950 active:scale-90 transition-all hover:rotate-3"
           >
            <Camera className="w-10 h-10 text-white" />
           </button>
        </div>

        <button className="flex flex-col items-center gap-1 text-slate-600">
          <History className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-widest">Log</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-600">
          <Info className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-widest">Sys</span>
        </button>
      </nav>

      {/* Camera Fullscreen Overlay */}
      {status === 'camera' && (
        <CameraView 
          onCapture={handleCapture} 
          onClose={() => setStatus('idle')} 
        />
      )}
    </div>
  );
};

export default App;
