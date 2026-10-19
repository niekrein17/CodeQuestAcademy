import React, { useState } from 'react';
import { Play, RotateCcw, Terminal, Layers, Sparkles, Code2 } from 'lucide-react';
import { sound } from '../utils/audio';

export const SandboxView: React.FC = () => {
  const [sandboxTab, setSandboxTab] = useState<'smk_code' | 'smp_grid'>('smk_code');

  // SMK Sandbox State
  const defaultJsCode = `// 🚀 KodingArena Sandbox Playground
// Bebas bereksperimen dengan variabel, loop, fungsi, dan array!

function jalankanEksperimen() {
  console.log("=== Memulai Simulasi Sandbox ===");
  
  let namaSiswa = "Pelajar Juara";
  let nilai = [85, 92, 78, 96, 88];
  
  console.log("Halo, " + namaSiswa + "!");
  console.log("Daftar nilai:", nilai);
  
  // Menghitung rata-rata:
  let total = 0;
  for (let i = 0; i < nilai.length; i++) {
    total += nilai[i];
  }
  let rataRata = total / nilai.length;
  console.log("Rata-rata:", rataRata);
  
  // Mencari nilai di atas 90:
  let istimewa = nilai.filter(n => n >= 90);
  console.log("Nilai istimewa (>= 90):", istimewa);
  
  return "Simulasi berhasil selesai!";
}

jalankanEksperimen();`;

  const [jsCode, setJsCode] = useState(defaultJsCode);
  const [outputLogs, setOutputLogs] = useState<string[]>([]);
  const [sandboxError, setSandboxError] = useState<string | null>(null);

  // Run freeform JavaScript
  const handleRunJs = () => {
    sound.playRun();
    setOutputLogs([]);
    setSandboxError(null);

    const logs: string[] = [];
    const customConsole = {
      log: (...args: unknown[]) => {
        logs.push(
          args
            .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
            .join(' ')
        );
      },
    };

    try {
      const runner = new Function('console', jsCode);
      const res = runner(customConsole);
      if (res !== undefined) {
        logs.push(`[Nilai Return]: ${typeof res === 'object' ? JSON.stringify(res) : String(res)}`);
      }
      setOutputLogs(logs);
      sound.playClick();
    } catch (err: unknown) {
      sound.playError();
      setSandboxError(err instanceof Error ? err.message : String(err));
      setOutputLogs(logs);
    }
  };

  const handleLoadSample = (sampleType: 'fibonacci' | 'array_filter' | 'percabangan') => {
    sound.playClick();
    if (sampleType === 'fibonacci') {
      setJsCode(`// Contoh: Menghasilkan 10 Deret Angka Fibonacci
function fibonacci(n) {
  let deret = [0, 1];
  for (let i = 2; i < n; i++) {
    deret.push(deret[i - 1] + deret[i - 2]);
  }
  return deret;
}

console.log("Deret 10 Fibonacci:", fibonacci(10));`);
    } else if (sampleType === 'array_filter') {
      setJsCode(`// Contoh: Filter Produk Diskon & Pencarian
let produk = [
  { nama: "Mouse Wireless", harga: 150000, diskon: true },
  { nama: "Keyboard Mechanical", harga: 450000, diskon: false },
  { nama: "USB Flashdisk 64GB", harga: 850000, diskon: true },
];

let produkDiskon = produk.filter(p => p.diskon);
console.log("Barang yang sedang diskon:", produkDiskon);`);
    } else if (sampleType === 'percabangan') {
      setJsCode(`// Contoh: Penentuan Grade Nilai
function tentukanGrade(skor) {
  if (skor >= 90) return "A (Sangat Baik)";
  if (skor >= 80) return "B (Baik)";
  if (skor >= 70) return "C (Cukup)";
  return "D (Perlu Bimbingan)";
}

console.log("Skor 95 ->", tentukanGrade(95));
console.log("Skor 82 ->", tentukanGrade(82));
console.log("Skor 65 ->", tentukanGrade(65));`);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-3.5rem)] flex flex-col bg-slate-950 overflow-hidden">
      {/* Subheader Toolbar */}
      <div className="h-12 px-6 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-white">
            Mode Sandbox (Laboratorium Bebas Eksperimen)
          </span>
        </div>

        {/* Sample Templates */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-500 hidden sm:inline mr-1">Muat Contoh:</span>
          <button
            onClick={() => handleLoadSample('fibonacci')}
            className="px-2 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
          >
            Fibonacci
          </button>
          <button
            onClick={() => handleLoadSample('array_filter')}
            className="px-2 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
          >
            Filter Produk
          </button>
          <button
            onClick={() => handleLoadSample('percabangan')}
            className="px-2 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
          >
            Grade Nilai
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setJsCode(defaultJsCode);
            }}
            title="Reset ke Default"
            className="p-1 text-slate-400 hover:text-white ml-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleRunJs}
            className="px-3.5 py-1 text-xs font-bold text-slate-950 bg-purple-400 hover:bg-purple-300 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 ml-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Jalankan Kode
          </button>
        </div>
      </div>

      {/* Main Two-Zone Split: Code Editor Left + Console Output Right */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Left: Code Editor Textarea */}
        <div className="h-full flex flex-col bg-slate-950 border-r border-slate-800 font-mono text-xs">
          <div className="h-8 px-4 bg-slate-900/40 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
            <span>Editor Kode JavaScript Bebas</span>
            <span>Gunakan console.log() untuk menampilkan teks</span>
          </div>

          <textarea
            value={jsCode}
            onChange={(e) => setJsCode(e.target.value)}
            spellCheck={false}
            className="flex-1 w-full bg-slate-950 text-slate-200 p-4 outline-none resize-none font-mono text-xs leading-5 selection:bg-purple-500/30 selection:text-white caret-purple-400"
            placeholder="// Tulis kode apa saja yang ingin kamu coba di sini..."
          />
        </div>

        {/* Right: Live Interactive Terminal Console */}
        <div className="h-full flex flex-col bg-slate-950 font-mono text-xs">
          <div className="h-8 px-4 bg-slate-900/40 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-purple-400" />
              Terminal Output
            </span>
            <span>{outputLogs.length} Baris Output</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-1.5 text-slate-300">
            {sandboxError && (
              <div className="p-2.5 rounded bg-rose-950/60 border border-rose-800 text-rose-300 text-xs mb-3 font-mono">
                [Error]: {sandboxError}
              </div>
            )}

            {outputLogs.length === 0 && !sandboxError ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center">
                <Terminal className="w-8 h-8 text-slate-700 mb-2 stroke-[1.5]" />
                <p>Belum ada eksekusi.</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Tekan tombol "Jalankan Kode" di atas untuk melihat hasilnya di sini.
                </p>
              </div>
            ) : (
              outputLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-purple-500 select-none">&gt;</span>
                  <span className="whitespace-pre-wrap">{log}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
