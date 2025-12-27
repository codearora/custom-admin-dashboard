
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Settings, User, Mail, ShieldCheck, Database, Zap, RefreshCcw, ArrowLeft, RotateCcw, Check } from 'lucide-react';
import DurationChart from './components/Charts/DurationChart';
import SadPathChart from './components/Charts/SadPathChart';
import { INITIAL_SAD_PATH_DATA, dataService } from './services/dataService';
import { SadPathData, ModalState } from './types';

const App: React.FC = () => {
  const [sadPathData, setSadPathData] = useState<SadPathData[]>(() => structuredClone(INITIAL_SAD_PATH_DATA));
  const [modal, setModal] = useState<ModalState>(ModalState.NONE);
  const [email, setEmail] = useState('');
  const [tempData, setTempData] = useState<SadPathData[]>([]);
  const [loading, setLoading] = useState(false);
  const [previousDataFound, setPreviousDataFound] = useState(false);

  const handleUpdateClick = () => {
    // Reset state for new configuration session
    setEmail('');
    setPreviousDataFound(false);
    setModal(ModalState.EMAIL_ENTRY);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const existingData = await dataService.getUserData(email);
      if (existingData) {
        setPreviousDataFound(true);
        setTempData(structuredClone(existingData));
      } else {
        setPreviousDataFound(false);
        setTempData(structuredClone(sadPathData));
      }
      setModal(ModalState.DATA_EDITOR);
    } catch (error) {
      console.error("Failed to fetch user data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveData = async () => {
    setLoading(true);
    try {
      await dataService.saveUserData(email, tempData);
      setSadPathData(structuredClone(tempData));
      setModal(ModalState.NONE);
    } catch (error) {
      console.error("Failed to save data", error);
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    setTempData(structuredClone(INITIAL_SAD_PATH_DATA));
  };

  const updateTempValue = (index: number, val: number) => {
    setTempData(prev => {
      const next = structuredClone(prev);
      next[index].value = val;
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Navbar */}
      <nav className="border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Bryn Analytics
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleUpdateClick}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-900/20 active:scale-95"
              >
                Configure Agent
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-12 pb-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-blue-500/10 blur-[120px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Voice Agent <span className="text-blue-500">Intelligence</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Real-time conversational analytics for modern voice interfaces. Monitor duration, detect hostility, and optimize agent performance.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Duration Chart */}
          <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl border border-slate-800/50">
            <DurationChart />
          </div>

          {/* Sad Path Chart */}
          <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl border border-slate-800/50">
            <SadPathChart data={sadPathData} />
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: Zap, title: "Latency Monitoring", desc: "Under 500ms processing threshold for all webhooks." },
            { icon: ShieldCheck, title: "Idempotent Processing", desc: "Built-in duplicate prevention for reliable scaling." },
            { icon: Database, title: "Persistent Storage", desc: "All custom configurations securely synced to storage." }
          ].map((feature, i) => (
            <div key={i} className="glass-panel p-6 rounded-xl border border-slate-800/50 flex flex-col items-center text-center hover:border-blue-500/30 transition-colors cursor-default">
              <div className="bg-slate-900 p-3 rounded-full mb-4 border border-slate-800 shadow-inner">
                <feature.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Modals */}
      {modal !== ModalState.NONE && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md transition-all duration-300">
          <div className="glass-panel w-full max-w-md rounded-2xl p-8 border border-slate-700/50 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] animate-in zoom-in-95 duration-200">
            
            {modal === ModalState.EMAIL_ENTRY && (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="text-center">
                  <div className="inline-block p-4 bg-blue-600/20 rounded-2xl mb-4 shadow-xl">
                    <Mail className="w-8 h-8 text-blue-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Identify Yourself</h2>
                  <p className="text-slate-400">Enter your email to load or save configurations.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                    placeholder="name@company.com"
                  />
                </div>
                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
                >
                  {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : 'Continue'}
                </button>
                <button 
                  type="button"
                  onClick={() => setModal(ModalState.NONE)}
                  className="w-full text-slate-500 hover:text-white text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </form>
            )}

            {modal === ModalState.DATA_EDITOR && (
              <div className="space-y-6 max-h-[85vh] flex flex-col">
                <div className="flex justify-between items-center shrink-0">
                  <button 
                    onClick={() => setModal(ModalState.EMAIL_ENTRY)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                    title="Change Email"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="text-center flex-1 pr-9">
                    <h2 className="text-xl font-bold text-white">Customize Paths</h2>
                    <p className="text-xs text-blue-400 font-medium truncate max-w-[200px] mx-auto">{email}</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-6 py-2">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-slate-300">Distribution Values</span>
                    <button 
                      onClick={resetToDefaults}
                      className="text-xs flex items-center gap-1.5 text-slate-500 hover:text-blue-400 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset Defaults
                    </button>
                  </div>
                  <div className="space-y-5">
                    {tempData.map((item, i) => (
                      <div key={i} className="group">
                        <div className="flex justify-between items-center mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ backgroundColor: item.color }} />
                            <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">{item.name}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">{item.value}%</span>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={item.value}
                          onChange={(e) => updateTempValue(i, parseInt(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 shrink-0 space-y-3">
                  <button 
                    onClick={handleSaveData}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-blue-900/20 active:scale-[0.98]"
                  >
                    {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5" /> Save Configuration</>}
                  </button>
                  <button 
                    onClick={() => setModal(ModalState.NONE)}
                    className="w-full text-slate-500 hover:text-rose-400 text-sm font-medium transition-colors"
                  >
                    Discard Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-900/50 mt-12 bg-slate-950/30">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-slate-600" />
            <span className="text-slate-600 font-medium">Bryn Voice Analytics &copy; 2024</span>
          </div>
          <div className="flex gap-8 text-slate-600 text-sm">
            <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-blue-400 transition-colors">API Status</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
