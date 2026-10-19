import React, { useState } from 'react';
import { Cpu, Terminal, ArrowRight, CheckCircle2, Lock, Star, ChevronLeft } from 'lucide-react';
import { Track, AppView } from '../types/game';
import { SMP_LEVELS } from '../data/smpLevels';
import { SMK_LEVELS } from '../data/smkLevels';
import { sound } from '../utils/audio';

interface LevelSelectViewProps {
  initialTrack?: Track;
  completedLevels: {
    smp: number[];
    smk: number[];
  };
  onSelectLevel: (track: Track, levelId: number) => void;
  onBackToTitle: () => void;
}

export const LevelSelectView: React.FC<LevelSelectViewProps> = ({
  initialTrack = 'smp',
  completedLevels,
  onSelectLevel,
  onBackToTitle,
}) => {
  const [activeTrack, setActiveTrack] = useState<Track>(initialTrack);

  return (
    <div className="w-full h-[calc(100vh-3.5rem)] overflow-y-auto bg-slate-950 p-6 md:p-10 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-6">
        {/* Navigation & Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onBackToTitle();
              }}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Pilih Misi Pembelajaran
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Pilih jenjang dan materi yang ingin kamu kuasai hari ini.
              </p>
            </div>
          </div>

          {/* Track Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTrack('smp');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTrack === 'smp'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4" />
              Jalur SMP (Robot Blok)
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTrack('smk');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTrack === 'smk'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4" />
              Jalur SMK (Coding Nyata)
            </button>
          </div>
        </div>

        {/* Level Cards Grid */}
        {activeTrack === 'smp' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SMP_LEVELS.map((lvl) => {
              const isCompleted = completedLevels.smp.includes(lvl.id);
              return (
                <div
                  key={lvl.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectLevel('smp', lvl.id);
                  }}
                  className={`rounded-xl border p-5 flex flex-col justify-between transition-all duration-150 cursor-pointer hover:scale-[1.02] ${
                    isCompleted
                      ? 'border-cyan-500/50 bg-slate-900/90 shadow-md'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/80">
                        Level {lvl.id}
                      </span>
                      {isCompleted ? (
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Tuntas
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">
                          {lvl.difficulty}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300">
                        {lvl.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {lvl.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-slate-500">
                      Konsep: {lvl.concept}
                    </span>
                    <span className="text-cyan-400 font-semibold flex items-center gap-1">
                      Mulai <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SMK_LEVELS.map((lvl) => {
              const isCompleted = completedLevels.smk.includes(lvl.id);
              return (
                <div
                  key={lvl.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectLevel('smk', lvl.id);
                  }}
                  className={`rounded-xl border p-5 flex flex-col justify-between transition-all duration-150 cursor-pointer hover:scale-[1.02] ${
                    isCompleted
                      ? 'border-amber-500/50 bg-slate-900/90 shadow-md'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800/80">
                        Misi {lvl.id}
                      </span>
                      {isCompleted ? (
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Lolos Test
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">
                          {lvl.difficulty}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-300">
                        {lvl.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {lvl.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-slate-500">
                      Topik: {lvl.concept}
                    </span>
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      Koding <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
