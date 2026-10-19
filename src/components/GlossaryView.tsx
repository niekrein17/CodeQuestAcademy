import React, { useState } from 'react';
import { BookOpen, Search, Lightbulb, Code2, Copy, Check } from 'lucide-react';
import { GLOSSARY_ITEMS } from '../data/glossaryData';
import { sound } from '../utils/audio';

export const GlossaryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['Semua', 'Dasar', 'Struktur Kontrol', 'Struktur Data', 'Paradigma & Tool'];

  const filteredItems = GLOSSARY_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'Semua' || item.category === activeCategory;
    const matchesSearch =
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.englishTerm && item.englishTerm.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (id: string, code?: string) => {
    if (!code) return;
    sound.playClick();
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full h-[calc(100vh-3.5rem)] overflow-y-auto bg-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Kamus &amp; Ensiklopedia Mini</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Glosarium Istilah Pemrograman
          </h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Daftar istilah penting dasar informatika dan rekayasa perangkat lunak dengan analogi kehidupan nyata dalam bahasa Indonesia.
          </p>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari istilah (contoh: Algoritma, Array, Loop, Bug)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sound.playClick();
                  setActiveCategory(cat);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-emerald-950 border border-emerald-600/60 text-emerald-300 font-semibold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      {item.term}
                      {item.englishTerm && (
                        <span className="text-xs font-normal text-slate-500 font-mono">
                          ({item.englishTerm})
                        </span>
                      )}
                    </h3>
                    <span className="text-[11px] font-mono text-emerald-400/90">
                      {item.category}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {item.targetAudience === 'both' ? 'SMP & SMK' : item.targetAudience.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.definition}
                </p>

                {/* Everyday Analogy */}
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Analogi Dunia Nyata:</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {item.analogy}
                  </p>
                </div>
              </div>

              {/* Code Example if present */}
              {item.codeExample && (
                <div className="pt-2 border-t border-slate-800/60 relative">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
                    <span className="flex items-center gap-1">
                      <Code2 className="w-3 h-3 text-cyan-400" />
                      Contoh Kode:
                    </span>
                    <button
                      onClick={() => handleCopy(item.id, item.codeExample)}
                      className="text-slate-400 hover:text-white"
                      title="Salin contoh"
                    >
                      {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <pre className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto whitespace-pre">
                    {item.codeExample}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-xs">
            Tidak ada istilah yang cocok dengan pencarian "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
};
