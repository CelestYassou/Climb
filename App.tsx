
import React, { useState, useCallback } from 'react';
import { 
  Camera, 
  ChevronRight, 
  Zap, 
  Map as MapIcon, 
  Play, 
  History, 
  ArrowLeft,
  Trophy,
  Dna,
  Layers,
  Search,
  Settings,
  Bell,
  Activity
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
      setError(err.message || "Erreur lors de l'analyse. Vérifiez votre connexion.");
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
    <div className="min-h-screen flex flex-col bg-slate-950">
      
      {/* Navigation Desktop */}
      <nav className="hidden lg:flex sticky top-0 z-50 bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 px-12 py-4 items-center justify-between">
        <div className="flex items-center gap-10">
          <h1 className="text-2xl font-black tracking-tighter cursor-pointer group" onClick={reset}>
            CLIMB<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 group-hover:from-cyan-400 group-hover:to-indigo-400 transition-all duration-500">SCAN</span>
          </h1>
          <div className="flex gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            <button className="hover:text-indigo-400 transition-colors">Explorer</button>
            <button className="hover:text-indigo-400 transition-colors">Entrainement</button>
            <button className="hover:text-indigo-400 transition-colors">Réseau</button>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Chercher un bloc..." 
              className="bg-slate-900/50 border border-white/10 rounded-2xl pl-12 pr-6 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 w-72 transition-all"
            />
          </div>
          <button className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"><Bell className="w-5 h-5" /></button>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1px]">
            <div className="w-full h-full bg-slate-950 rounded-[inherit] flex items-center justify-center">
              <Activity className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
        </div>
      </nav>

      {/* Header Mobile */}
      <header className="lg:hidden p-6 pt-10 flex justify-between items-center bg-slate-950">
        <h1 className="text-2xl font-black tracking-tighter" onClick={reset}>
          CLIMB<span className="text-indigo-500">SCAN</span>
        </h1>
        <button className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/5">
           <Settings className="w-5 h-5 text-slate-400" />
        </button>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full pb-32 lg:pb-12">
        {status === 'idle' && (
          <div className="p-6 lg:p-12 space-y-12 animate-in fade-in duration-700">
            {/* Hero Section */}
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="flex-1 space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-bold tracking-[0.2em] uppercase animate-pulse-soft">
                  <Zap className="w-3 h-3" /> Vision Artificielle Active
                </div>
                <h2 className="text-5xl lg:text-8xl font-black tracking-tighter leading-[0.9] italic">
                  DOMINEZ<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-200 to-cyan-400">LA PAROI</span>
                </h2>
                <p className="text-slate-400 text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                  L'IA embarquée qui analyse vos blocs en temps réel. Scannez, déchiffrez la beta et grimpez plus intelligemment.
                </p>
                <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4">
                  <button 
                    onClick={() => setStatus('camera')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 active:scale-95 transition-all shadow-2xl shadow-indigo-600/30 uppercase tracking-widest text-sm"
                  >
                    <Camera className="w-6 h-6" /> Scanner maintenant
                  </button>
                  <button className="bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-[2rem] font-black border border-white/10 transition-all uppercase tracking-widest text-sm">
                    Mes Stats
                  </button>
                </div>
              </div>

              {/* Preview Card Desktop */}
              <div className="hidden lg:block flex-1 w-full max-w-xl">
                <div className="relative aspect-[4/3] bg-slate-900 rounded-[3.5rem] border border-white/5 overflow-hidden group shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-700">
                  <img 
                    src="https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&q=80&w=800" 
                    className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-1000"
                    alt="Climbing"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                  <div className="absolute bottom-10 left-10 space-y-3">
                    <div className="flex gap-2">
                      <div className="px-4 py-1.5 bg-indigo-500/30 backdrop-blur-xl rounded-xl text-[10px] font-bold border border-white/10 uppercase tracking-widest">Target_Locked</div>
                      <div className="px-4 py-1.5 bg-cyan-500/30 backdrop-blur-xl rounded-xl text-[10px] font-bold border border-white/10 uppercase tracking-widest">Beta_Gen</div>
                    </div>
                    <div className="text-white font-black text-2xl italic tracking-tighter uppercase">Analyse de Session_01</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Dna />, label: "Neural Scan", desc: "Détection 3D des prises", color: "indigo" },
                { icon: <Layers />, label: "Beta Path", desc: "Séquençage IA optimal", color: "cyan" },
                { icon: <Trophy />, label: "Performance", desc: "Suivi des cotations", color: "emerald" },
                { icon: <History />, label: "Logbook", desc: "Archive visuelle", color: "rose" }
              ].map((f, i) => (
                <div key={i} className="bg-white/[0.03] backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/40 transition-all group hover:-translate-y-2 cursor-default">
                  <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                    {React.cloneElement(f.icon as React.ReactElement<any>, { className: `w-7 h-7 text-indigo-400` })}
                  </div>
                  <h3 className="font-bold text-xl mb-1 tracking-tight">{f.label}</h3>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* History Section */}
            <section className="space-y-8">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-black text-slate-600 uppercase text-xs tracking-[0.4em]">Récemment grimpé</h3>
                <div className="h-px flex-1 bg-slate-900 mx-8"></div>
                <button className="text-indigo-400 font-bold text-xs uppercase hover:underline tracking-widest">Archives</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-6 bg-white/[0.02] hover:bg-white/[0.05] p-5 rounded-[2.5rem] border border-white/5 transition-all group cursor-pointer shadow-xl">
                    <div className="w-24 h-24 bg-slate-900 rounded-[1.5rem] overflow-hidden shrink-0 border border-white/5">
                      <img src={`https://picsum.photos/seed/${i + 200}/200/200`} className="w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-slate-200 group-hover:text-white transition-colors text-lg italic uppercase">Projet_{i * 102}</h4>
                      <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase mt-1">Niveau V{i+3} • Arkose Nation</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-indigo-400 transition-colors" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {status === 'analyzing' && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-12 px-6">
            <div className="relative">
              <div className="w-48 h-48 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
                <Zap className="relative w-14 h-14 text-white animate-bounce" />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter italic uppercase animate-pulse">Calcul de trajectoire</h2>
              <p className="text-slate-500 text-lg max-w-md mx-auto font-medium">
                Notre IA identifie les prises et génère le séquençage biomécanique le plus efficace...
              </p>
            </div>
          </div>
        )}

        {status === 'results' && capturedImage && analysis && (
          <div className="p-6 lg:p-12 animate-in slide-in-from-bottom-12 fade-in duration-1000">
            <div className="flex flex-col lg:flex-row gap-16">
              {/* Colonne Visuelle */}
              <div className="flex-[1.3] space-y-8">
                 <RouteVisualizer image={capturedImage} analysis={analysis} />
                 
                 <div className="grid grid-cols-3 gap-6 p-6 bg-white/[0.02] rounded-[2.5rem] border border-white/5">
                    <div className="text-center space-y-1">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Niveau</p>
                      <p className="text-3xl font-black text-indigo-400 italic leading-none">{analysis.grade}</p>
                    </div>
                    <div className="text-center space-y-1 border-x border-white/5">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Prises</p>
                      <p className="text-3xl font-black text-white italic leading-none">{analysis.holds.length}</p>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Style</p>
                      <p className="text-sm font-black text-cyan-400 uppercase tracking-tight leading-none pt-2">{analysis.style}</p>
                    </div>
                 </div>
              </div>
              
              {/* Colonne Beta */}
              <div className="flex-1 space-y-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <button onClick={reset} className="p-3 bg-slate-900 rounded-2xl hover:bg-slate-800 transition-colors">
                      <ArrowLeft className="w-5 h-5 text-indigo-400" />
                    </button>
                    <div>
                      <h2 className="text-4xl font-black tracking-tighter italic uppercase leading-none">{analysis.name}</h2>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-2">Analysis_Report_Ready</p>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 text-lg leading-relaxed bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/5 italic">
                    {analysis.description}
                  </p>
                </div>

                <div className="space-y-8">
                  <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.4em] px-2">Séquence de mouvement (Beta)</h3>
                  <div className="space-y-6">
                    {analysis.beta.map((b) => (
                      <div key={b.step} className="flex gap-8 group">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/5 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-lg group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition-all group-hover:scale-110">
                            {b.step}
                          </div>
                          <div className="w-px flex-1 bg-slate-800 my-3 group-last:hidden"></div>
                        </div>
                        <div className="pb-4 pt-2">
                          <h4 className="font-black text-indigo-400 mb-2 uppercase text-xs tracking-[0.2em]">{b.action}</h4>
                          <p className="text-slate-400 font-medium leading-relaxed">{b.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sticky bottom-24 lg:static lg:bottom-0 pt-6">
                  <button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:brightness-110 text-white py-6 rounded-[2.5rem] font-black flex items-center justify-center gap-4 active:scale-95 transition-all shadow-2xl shadow-indigo-600/40 uppercase tracking-widest text-sm">
                    <Play className="w-5 h-5 fill-current" /> Lancer le chrono
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Nav Mobile Flottante */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 h-20 bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex justify-around items-center z-[60] shadow-2xl">
        <button className={`flex flex-col items-center gap-1 transition-all ${status === 'idle' ? 'text-indigo-400' : 'text-slate-600'}`}>
          <MapIcon className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-widest">Feed</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-600">
          <Trophy className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-widest">Stats</span>
        </button>
        
        <div className="relative -top-8">
           <button 
            onClick={() => setStatus('camera')}
            className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-600/50 border-[6px] border-slate-950 active:scale-90 transition-all"
           >
            <Camera className="w-10 h-10 text-white" />
           </button>
        </div>

        <button className="flex flex-col items-center gap-1 text-slate-600">
          <History className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-widest">Logs</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-600">
          <Activity className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-widest">Moi</span>
        </button>
      </nav>

      {/* Camera Overlay */}
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
