import React, { useState } from 'react';
import { 
  Play, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw, 
  Repeat, 
  Code2, 
  Layers, 
  Plus, 
  Zap,
  CornerDownRight
} from 'lucide-react';
import { SmpCommand, SmpCommandType, SmpConditionType } from '../../types/game';
import { sound } from '../../utils/audio';

interface SmpBlockEditorProps {
  commands: SmpCommand[];
  onChangeCommands: (commands: SmpCommand[]) => void;
  availableBlocks: SmpCommandType[];
  maxBlocks?: number;
  activeCommandId?: string | null;
  isRunning: boolean;
}

export const SmpBlockEditor: React.FC<SmpBlockEditorProps> = ({
  commands,
  onChangeCommands,
  availableBlocks,
  maxBlocks = 20,
  activeCommandId,
  isRunning,
}) => {
  const [viewTab, setViewTab] = useState<'blocks' | 'code'>('blocks');
  const [codeLang, setCodeLang] = useState<'python' | 'javascript'>('python');

  // Command Definitions & Labels
  const commandMeta: Record<SmpCommandType, { label: string; color: string; desc: string }> = {
    maju: { label: 'Maju 1 Langkah', color: 'bg-sky-600 hover:bg-sky-500 text-white', desc: 'rover.maju()' },
    belok_kiri: { label: 'Belok Kiri 90°', color: 'bg-indigo-600 hover:bg-indigo-500 text-white', desc: 'rover.belokKiri()' },
    belok_kanan: { label: 'Belok Kanan 90°', color: 'bg-indigo-600 hover:bg-indigo-500 text-white', desc: 'rover.belokKanan()' },
    ambil: { label: 'Ambil Kristal', color: 'bg-cyan-600 hover:bg-cyan-500 text-white', desc: 'rover.ambilKristal()' },
    buka_pintu: { label: 'Buka Pintu', color: 'bg-amber-600 hover:bg-amber-500 text-white', desc: 'rover.bukaPintu()' },
    lompat: { label: 'Lompat Rintangan', color: 'bg-emerald-600 hover:bg-emerald-500 text-white', desc: 'rover.lompat()' },
    ulang: { label: 'Ulangi (Loop)', color: 'bg-purple-600 hover:bg-purple-500 text-white', desc: 'for i in range(n):' },
    jika: { label: 'Jika (If)', color: 'bg-rose-600 hover:bg-rose-500 text-white', desc: 'if kondisi:' },
  };

  const handleAddCommand = (type: SmpCommandType, parentId?: string) => {
    if (isRunning) return;
    sound.playClick();

    const newCmd: SmpCommand = {
      id: 'cmd_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type,
      repeatCount: type === 'ulang' ? 3 : undefined,
      condition: type === 'jika' ? 'ada_rintangan_depan' : undefined,
      subCommands: type === 'ulang' || type === 'jika' ? [] : undefined,
    };

    if (!parentId) {
      if (commands.length >= maxBlocks) return;
      onChangeCommands([...commands, newCmd]);
    } else {
      // Add inside loop or if
      const updateSub = (list: SmpCommand[]): SmpCommand[] => {
        return list.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              subCommands: [...(item.subCommands || []), newCmd],
            };
          }
          if (item.subCommands) {
            return { ...item, subCommands: updateSub(item.subCommands) };
          }
          return item;
        });
      };
      onChangeCommands(updateSub(commands));
    }
  };

  const handleDeleteCommand = (id: string) => {
    if (isRunning) return;
    sound.playClick();
    const filterOut = (list: SmpCommand[]): SmpCommand[] => {
      return list
        .filter((c) => c.id !== id)
        .map((c) => (c.subCommands ? { ...c, subCommands: filterOut(c.subCommands) } : c));
    };
    onChangeCommands(filterOut(commands));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (isRunning) return;
    sound.playClick();
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= commands.length) return;
    const updated = [...commands];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    onChangeCommands(updated);
  };

  const handleChangeRepeat = (id: string, count: number) => {
    if (isRunning) return;
    sound.playClick();
    const updateCount = (list: SmpCommand[]): SmpCommand[] => {
      return list.map((c) => {
        if (c.id === id) return { ...c, repeatCount: count };
        if (c.subCommands) return { ...c, subCommands: updateCount(c.subCommands) };
        return c;
      });
    };
    onChangeCommands(updateCount(commands));
  };

  const handleChangeCondition = (id: string, condition: SmpConditionType) => {
    if (isRunning) return;
    sound.playClick();
    const updateCond = (list: SmpCommand[]): SmpCommand[] => {
      return list.map((c) => {
        if (c.id === id) return { ...c, condition };
        if (c.subCommands) return { ...c, subCommands: updateCond(c.subCommands) };
        return c;
      });
    };
    onChangeCommands(updateCond(commands));
  };

  // Generate real Python / JavaScript code from current blocks
  const generateCode = (lang: 'python' | 'javascript'): string => {
    const renderBlock = (cmd: SmpCommand, indent: string): string => {
      if (cmd.type === 'ulang') {
        const count = cmd.repeatCount || 3;
        const head = lang === 'python' ? `${indent}for langkah in range(${count}):\n` : `${indent}for (let i = 0; i < ${count}; i++) {\n`;
        const body = (cmd.subCommands || [])
          .map((sub) => renderBlock(sub, indent + (lang === 'python' ? '    ' : '  ')))
          .join('\n') || `${indent}    # masukkan perintah di dalam loop`;
        const foot = lang === 'javascript' ? `\n${indent}}` : '';
        return head + body + foot;
      }

      if (cmd.type === 'jika') {
        const condName = cmd.condition === 'ada_kristal' ? 'rover.ada_kristal()' : 'rover.ada_rintangan_depan()';
        const head = lang === 'python' ? `${indent}if ${condName}:\n` : `${indent}if (${condName}) {\n`;
        const body = (cmd.subCommands || [])
          .map((sub) => renderBlock(sub, indent + (lang === 'python' ? '    ' : '  ')))
          .join('\n') || `${indent}    rover.lompat()`;
        const foot = lang === 'javascript' ? `\n${indent}}` : '';
        return head + body + foot;
      }

      const funcCall = {
        maju: 'rover.maju()',
        belok_kiri: 'rover.belok_kiri()',
        belok_kanan: 'rover.belok_kanan()',
        ambil: 'rover.ambil_kristal()',
        buka_pintu: 'rover.buka_pintu()',
        lompat: 'rover.lompat()',
      }[cmd.type as string] || 'rover.aksi()';

      return `${indent}${funcCall}${lang === 'javascript' ? ';' : ''}`;
    };

    if (commands.length === 0) {
      return lang === 'python' 
        ? '# Belum ada blok perintah.\n# Klik tombol blok di atas untuk menambahkan instruksi.'
        : '// Belum ada blok perintah.\n// Klik tombol blok di atas untuk menambahkan instruksi.';
    }

    const header = lang === 'python' 
      ? '# Program Kendali CyberRover (Python 3)\n\n'
      : '// Program Kendali CyberRover (JavaScript)\n\n';

    return header + commands.map((c) => renderBlock(c, '')).join('\n');
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 border-l border-slate-800">
      {/* Header Tabs: Blok Visual vs Kode Teks Preview */}
      <div className="h-11 px-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewTab('blocks')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              viewTab === 'blocks'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Blok Visual
          </button>
          <button
            onClick={() => setViewTab('code')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              viewTab === 'code'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Kode Teks Preview
          </button>
        </div>

        <div className="text-xs font-mono text-slate-400">
          <span>{commands.length}</span> / <span>{maxBlocks}</span> Blok
        </div>
      </div>

      {/* Available Blocks Palette (Only shown in blocks mode) */}
      {viewTab === 'blocks' && (
        <div className="p-3 border-b border-slate-800 bg-slate-900/30">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Pustaka Blok Perintah (Klik untuk menambah):
          </div>
          <div className="flex flex-wrap gap-1.5">
            {availableBlocks.map((type) => {
              const meta = commandMeta[type];
              if (!meta) return null;
              return (
                <button
                  key={type}
                  onClick={() => handleAddCommand(type)}
                  disabled={isRunning || commands.length >= maxBlocks}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all shadow-sm flex items-center gap-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${meta.color}`}
                >
                  <Plus className="w-3 h-3 stroke-[3]" />
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3">
        {viewTab === 'blocks' ? (
          <div className="space-y-2">
            {commands.length === 0 ? (
              <div className="h-48 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-6 text-center text-slate-500">
                <Layers className="w-8 h-8 text-slate-600 mb-2 stroke-[1.5]" />
                <p className="text-xs font-medium text-slate-400">Susunan instruksi masih kosong.</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Pilih blok perintah di atas untuk menyusun algoritma jalan Rover!
                </p>
              </div>
            ) : (
              commands.map((cmd, idx) => {
                const meta = commandMeta[cmd.type];
                const isActive = activeCommandId === cmd.id;

                return (
                  <div
                    key={cmd.id}
                    className={`rounded-lg border p-2.5 transition-all ${
                      isActive
                        ? 'border-cyan-400 bg-cyan-950/40 shadow-lg ring-1 ring-cyan-400'
                        : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-500 w-4">
                          {idx + 1}.
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${meta.color}`}>
                          {meta.label}
                        </span>

                        {/* Loop Repetition Selector */}
                        {cmd.type === 'ulang' && (
                          <div className="flex items-center gap-1 text-xs text-purple-300">
                            <span>sebanyak</span>
                            <select
                              value={cmd.repeatCount || 3}
                              onChange={(e) => handleChangeRepeat(cmd.id, Number(e.target.value))}
                              disabled={isRunning}
                              className="bg-purple-950 border border-purple-700/60 rounded px-1.5 py-0.5 text-xs font-mono font-bold text-white focus:outline-none"
                            >
                              <option value="2">2 kali</option>
                              <option value="3">3 kali</option>
                              <option value="4">4 kali</option>
                              <option value="5">5 kali</option>
                              <option value="6">6 kali</option>
                            </select>
                          </div>
                        )}

                        {/* Condition Selector */}
                        {cmd.type === 'jika' && (
                          <div className="flex items-center gap-1 text-xs text-rose-300">
                            <select
                              value={cmd.condition || 'ada_rintangan_depan'}
                              onChange={(e) => handleChangeCondition(cmd.id, e.target.value as SmpConditionType)}
                              disabled={isRunning}
                              className="bg-rose-950 border border-rose-700/60 rounded px-1.5 py-0.5 text-xs font-mono font-bold text-white focus:outline-none"
                            >
                              <option value="ada_rintangan_depan">ada rintangan di depan</option>
                              <option value="ada_kristal">ada kristal di ubin ini</option>
                            </select>
                          </div>
                        )}
                      </div>

                      {/* Item Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMove(idx, 'up')}
                          disabled={isRunning || idx === 0}
                          title="Geser Naik"
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMove(idx, 'down')}
                          disabled={isRunning || idx === commands.length - 1}
                          title="Geser Turun"
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCommand(cmd.id)}
                          disabled={isRunning}
                          title="Hapus Blok"
                          className="p-1 text-slate-400 hover:text-rose-400 disabled:opacity-30 rounded hover:bg-slate-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Sub Commands Area for Loop or If Container */}
                    {(cmd.type === 'ulang' || cmd.type === 'jika') && (
                      <div className="mt-2.5 pl-4 border-l-2 border-purple-800/60 space-y-1.5">
                        <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                          <span>Instruksi di dalam {cmd.type === 'ulang' ? 'Loop' : 'If'}:</span>
                          <div className="flex items-center gap-1">
                            {['maju', 'belok_kiri', 'belok_kanan', 'ambil', 'lompat'].map((st) => (
                              <button
                                key={st}
                                onClick={() => handleAddCommand(st as SmpCommandType, cmd.id)}
                                disabled={isRunning}
                                className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
                              >
                                + {commandMeta[st as SmpCommandType].label.split(' ')[0]}
                              </button>
                            ))}
                          </div>
                        </div>

                        {cmd.subCommands && cmd.subCommands.length > 0 ? (
                          cmd.subCommands.map((sub, sIdx) => {
                            const subMeta = commandMeta[sub.type];
                            const isSubActive = activeCommandId === sub.id;
                            return (
                              <div
                                key={sub.id}
                                className={`flex items-center justify-between px-2 py-1 rounded text-xs ${
                                  isSubActive ? 'bg-cyan-900/60 border border-cyan-400 text-cyan-200' : 'bg-slate-800/80 text-slate-200'
                                }`}
                              >
                                <span className="flex items-center gap-1.5">
                                  <CornerDownRight className="w-3 h-3 text-slate-400" />
                                  <span className="font-mono text-[10px] text-slate-400">{sIdx + 1}.</span>
                                  {subMeta.label}
                                </span>
                                <button
                                  onClick={() => handleDeleteCommand(sub.id)}
                                  disabled={isRunning}
                                  className="text-slate-400 hover:text-rose-400"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-[11px] text-slate-500 italic py-1">
                            (Belum ada perintah di dalam wadah ini. Klik tombol + di samping)
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Real Code Preview Screen (Python / JavaScript) */
          <div className="h-full flex flex-col space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs text-slate-400">Bahasa Pemrograman:</span>
              <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setCodeLang('python')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                    codeLang === 'python' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Python
                </button>
                <button
                  onClick={() => setCodeLang('javascript')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                    codeLang === 'javascript' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  JavaScript
                </button>
              </div>
            </div>

            <pre className="flex-1 bg-slate-950 p-3 rounded-lg border border-slate-800/80 font-mono text-xs text-cyan-300 overflow-x-auto whitespace-pre leading-relaxed">
              {generateCode(codeLang)}
            </pre>
            <p className="text-[11px] text-slate-500">
              Setiap blok yang kamu susun secara otomatis diubah menjadi baris kode komputer yang valid!
            </p>
          </div>
        )}
      </div>

      {/* Footer Clear All */}
      {commands.length > 0 && viewTab === 'blocks' && (
        <div className="p-3 border-t border-slate-800 bg-slate-900/40 flex justify-end">
          <button
            onClick={() => {
              if (isRunning) return;
              sound.playClick();
              onChangeCommands([]);
            }}
            disabled={isRunning}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Hapus Semua Blok
          </button>
        </div>
      )}
    </div>
  );
};
