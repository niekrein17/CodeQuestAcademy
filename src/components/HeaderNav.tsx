import React from 'react';
import { Volume2, VolumeX, Play, Sparkles } from 'lucide-react';
import { AppView, Track } from '../types/game';
import { sound } from '../utils/audio';

interface HeaderNavProps {
  currentView: AppView;
  currentTrack: Track;
  onNavigate: (view: AppView, track?: Track) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentView,
  currentTrack,
  onNavigate,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 md:px-6 flex items-center justify-between gap-8 z-40 select-none shrink-0">
      {/* Zone 1: Brand Wordmark */}
      <div 
        onClick={() => onNavigate('title')} 
        className="flex items-center gap-2 cursor-pointer group shrink-0"
      >
        <span className="w-7 h-7 rounded-md bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-mono font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
          &lt;/&gt;
        </span>
        <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
          KodingArena
        </span>
        <span className="hidden sm:inline text-xs text-slate-500 font-normal">
          · SMP &amp; SMK
        </span>
      </div>

      {/* Zone 2: 4-5 Clean single-line text links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => onNavigate('smp_game', 'smp')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentView === 'smp_game' && currentTrack === 'smp' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          Rover SMP (Blok)
        </button>
        <button
          onClick={() => onNavigate('smk_game', 'smk')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentView === 'smk_game' && currentTrack === 'smk' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Terminal SMK (Kode)
        </button>
        <button
          onClick={() => onNavigate('quiz')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentView === 'quiz' ? 'text-indigo-400 font-semibold' : ''
          }`}
        >
          Kuis Kilat
        </button>
        <button
          onClick={() => onNavigate('glossary')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentView === 'glossary' ? 'text-emerald-400 font-semibold' : ''
          }`}
        >
          Glosarium
        </button>
        <button
          onClick={() => onNavigate('sandbox')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentView === 'sandbox' ? 'text-purple-400 font-semibold' : ''
          }`}
        >
          Sandbox
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action & Audio Control */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {currentView === 'title' ? (
          <button
            onClick={() => onNavigate('level_select')}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Mulai Belajar
          </button>
        ) : (
          <button
            onClick={() => onNavigate('title')}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Menu Utama
          </button>
        )}
      </div>
    </header>
  );
};
