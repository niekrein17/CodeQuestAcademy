import React, { useEffect } from 'react';
import { Play, BookOpen, Brain, Terminal, Cpu, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Track, AppView } from '../types/game';
import { sound } from '../utils/audio';

interface TitleScreenProps {
  onSelectTrack: (track: Track) => void;
  onNavigate: (view: AppView, track?: Track) => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onSelectTrack, onNavigate }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '1') {
        sound.playClick();
        onSelectTrack('smp');
      } else if (e.key === '2') {
        sound.playClick();
        onSelectTrack('smk');
      } else if (e.key.toLowerCase() === 'k') {
        sound.playClick();
        onNavigate('quiz');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectTrack, onNavigate]);

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] overflow-y-auto flex flex-col items-center justify-between p-6 md:p-10 bg-slate-950 text-slate-100">
      {/* Background Matrix Circuit Vector Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#38bdf8" strokeWidth="0.7" opacity="0.3" />
              <circle cx="30" cy="30" r="1.5" fill="#38bdf8" opacity="0.4" />
              <path d="M 30 0 L 30 15 M 60 30 L 45 30 M 30 60 L 30 45 M 0 30 L 15 30" stroke="#38bdf8" strokeWidth="0.5" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-grid)" />
        </svg>
      </div>

      {/* Hero Header Area */}
      <div className="relative z-10 max-w-4xl w-full text-center mt-2 md:mt-4 space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 tracking-wider">
          <span>PLATFORM EDUKASI INTERAKTIF</span>
          <span aria-hidden="true">·</span>
          <span>LANGSUNG DARI BROWSER TANPA INSTALL</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Petualangan Belajar <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
            Dasar Pemrograman Komputer
          </span>
        </h1>

        <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Dirancang khusus untuk menyesuaikan kurikulum dan pola pikir murid 
          <strong className="text-slate-200 font-semibold"> SMP</strong> (Logika Blok &amp; Algoritma Robot) dan 
          <strong className="text-slate-200 font-semibold"> SMK</strong> (Coding Nyata JavaScript/Python &amp; Problem Solving Industri).
        </p>
      </div>

      {/* Main Track Selection Cards (SMP vs SMK) */}
      <div className="relative z-10 max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        {/* Track SMP Card */}
        <div 
          onClick={() => {
            sound.playClick();
            onSelectTrack('smp');
          }}
          className="group relative rounded-xl border border-cyan-800/40 bg-slate-900/80 hover:bg-slate-900 hover:border-cyan-500/80 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:shadow-cyan-950/50 cursor-pointer"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-lg bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-cyan-400 tracking-wide">JENJANG SMP</div>
                <div className="text-xs text-slate-500">Usia 12 – 15 Tahun</div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                CyberRover: Algoritma &amp; Blok Logika
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Kendalikan robot antariksa menjelajahi grid. Susun perintah visual (Maju, Belok, Loop, Sensor If/Else) dengan tinjauan kode Python langsung di sampingnya.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-xs text-slate-300 font-medium flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                Materi yang Dipelajari:
              </div>
              <ul className="text-xs text-slate-400 space-y-1 pl-5 list-disc">
                <li>Urutan Sekuensial &amp; Algoritma Dasar</li>
                <li>Perulangan Efisien (Loop / Repeat)</li>
                <li>Percabangan Logika (Sensor If / Else)</li>
                <li>Menghindari Jebakan &amp; Mengumpulkan Baterai</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Tekan [1] pada keyboard</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
              Mulai Petualangan SMP
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Track SMK Card */}
        <div 
          onClick={() => {
            sound.playClick();
            onSelectTrack('smk');
          }}
          className="group relative rounded-xl border border-amber-800/40 bg-slate-900/80 hover:bg-slate-900 hover:border-amber-500/80 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:shadow-amber-950/50 cursor-pointer"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-lg bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <Terminal className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-amber-400 tracking-wide">JENJANG SMK</div>
                <div className="text-xs text-slate-500">Usia 15 – 18 Tahun</div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                CodeMaster: Terminal &amp; Rekayasa Nyata
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Editor kode profesional dengan studi kasus industri nyata. Tulis fungsi, manipulasi array IoT pabrik, perbaiki bug runtime, dan loloskan unit test otomatis.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-xs text-slate-300 font-medium flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Materi yang Dipelajari:
              </div>
              <ul className="text-xs text-slate-400 space-y-1 pl-5 list-disc">
                <li>Variabel, Tipe Data &amp; Aritmatika Kasir POS</li>
                <li>Fungsi Akses Server &amp; Boolean (AND, OR, NOT)</li>
                <li>Pengolahan Array &amp; Telemetri Sensor Suhu</li>
                <li>Seni Debugging Error &amp; Algoritma Pencarian</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Tekan [2] pada keyboard</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
              Buka Terminal SMK
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>

      {/* Auxiliary Modes (Quiz, Glossary, Sandbox) & Control Hint Footer */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('quiz');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <Brain className="w-3.5 h-3.5 text-indigo-400" />
            Kuis Tantangan Kilat [K]
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onNavigate('glossary');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            Kamus Pemrograman
          </button>
        </div>

        <div className="text-center sm:text-right text-slate-500 font-mono">
          <span>KodingArena · Kurikulum Dasar Pemrograman Indonesia</span>
        </div>
      </div>
    </div>
  );
};
