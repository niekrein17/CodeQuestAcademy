import React, { useRef } from 'react';
import { RotateCcw, Copy, Check, Terminal as TermIcon, Sparkles } from 'lucide-react';
import { sound } from '../../utils/audio';

interface SmkCodeEditorProps {
  code: string;
  onChangeCode: (code: string) => void;
  onResetCode: () => void;
  onRunTests: () => void;
  isRunning: boolean;
}

export const SmkCodeEditor: React.FC<SmkCodeEditorProps> = ({
  code,
  onChangeCode,
  onResetCode,
  onRunTests,
  isRunning,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = React.useState(false);

  // Line numbers calculation
  const lines = code.split('\n');
  const lineCount = lines.length;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Support Tab key indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      onChangeCode(newCode);

      // Restore cursor position after state update
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
      return;
    }

    // Ctrl+Enter or Cmd+Enter to execute tests immediately
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRunTests();
      return;
    }
  };

  const handleInsertSnippet = (snippet: string) => {
    sound.playClick();
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newCode = code.substring(0, start) + snippet + code.substring(end);
    onChangeCode(newCode);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + snippet.length;
      }
    }, 0);
  };

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 border-r border-slate-800">
      {/* Editor Toolbar */}
      <div className="h-11 px-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <span className="text-xs font-mono font-semibold text-slate-300">
            solution.js (JavaScript / ECMAScript 2024)
          </span>
        </div>

        {/* Quick Snippets & Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleInsertSnippet('console.log();')}
            title="Sisipkan console.log"
            className="px-2 py-0.5 text-[10px] font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700"
          >
            +log
          </button>
          <button
            onClick={() => handleInsertSnippet('if () {\n  \n}')}
            title="Sisipkan struktur IF"
            className="px-2 py-0.5 text-[10px] font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700"
          >
            +if
          </button>
          <button
            onClick={() => handleInsertSnippet('for (let i = 0; i < ; i++) {\n  \n}')}
            title="Sisipkan For Loop"
            className="px-2 py-0.5 text-[10px] font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700"
          >
            +for
          </button>

          <button
            onClick={handleCopy}
            title="Salin Kode"
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 ml-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onResetCode();
            }}
            title="Reset Kode ke Template Awal"
            className="p-1.5 text-slate-400 hover:text-amber-400 rounded hover:bg-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="flex-1 relative flex overflow-hidden font-mono text-xs leading-relaxed">
        {/* Line Numbers Column */}
        <div className="w-10 bg-slate-950 py-3 text-right pr-3 select-none text-slate-600 border-r border-slate-900 shrink-0">
          {Array.from({ length: Math.max(lineCount, 15) }, (_, i) => (
            <div key={i + 1} className="h-5">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea Area */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChangeCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="flex-1 h-full bg-slate-950 text-slate-200 p-3 outline-none resize-none overflow-auto font-mono text-xs leading-5 selection:bg-amber-500/30 selection:text-white caret-amber-400"
          placeholder="// Tulis solusi programmu di sini..."
        />
      </div>

      {/* Footer Status Line */}
      <div className="h-7 px-4 bg-slate-950 border-t border-slate-900 flex items-center justify-between text-[11px] font-mono text-slate-500 shrink-0">
        <span>Tekan [Ctrl + Enter] untuk menjalankan tes</span>
        <span>{lineCount} baris</span>
      </div>
    </div>
  );
};
