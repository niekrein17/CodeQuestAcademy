import React from 'react';
import { CheckCircle2, XCircle, Terminal as TermIcon, Play, AlertCircle } from 'lucide-react';
import { SmkTestCase } from '../../types/game';

export interface TestResult {
  testId: number;
  passed: boolean;
  actualOutput: unknown;
  expectedOutput: unknown;
  error?: string;
}

interface SmkTestRunnerProps {
  testCases: SmkTestCase[];
  testResults: TestResult[];
  logs: string[];
  syntaxError: string | null;
  isRunning: boolean;
  onRunTests: () => void;
}

export const SmkTestRunner: React.FC<SmkTestRunnerProps> = ({
  testCases,
  testResults,
  logs,
  syntaxError,
  isRunning,
  onRunTests,
}) => {
  const passedCount = testResults.filter((r) => r.passed).length;
  const allPassed = testResults.length > 0 && passedCount === testCases.length;

  const formatValue = (val: unknown): string => {
    if (val === undefined) return 'undefined';
    if (val === null) return 'null';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden">
      {/* Test Header */}
      <div className="h-11 px-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <TermIcon className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-white">
            Unit Test &amp; Evaluator Logika
          </span>
        </div>

        <div className="flex items-center gap-3">
          {testResults.length > 0 && (
            <span className={`text-xs font-mono font-bold ${allPassed ? 'text-emerald-400' : 'text-amber-400'}`}>
              {passedCount} / {testCases.length} Kasus Lolos
            </span>
          )}

          <button
            onClick={onRunTests}
            disabled={isRunning}
            className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isRunning ? 'Menguji...' : 'Jalankan Unit Test'}
          </button>
        </div>
      </div>

      {/* Main Body: Test Cases Cards & Console Logs */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Syntax Error Box if any */}
        {syntaxError && (
          <div className="bg-rose-950/40 border border-rose-600/50 rounded-lg p-3 text-xs text-rose-300 space-y-1">
            <div className="flex items-center gap-2 font-bold text-rose-400">
              <AlertCircle className="w-4 h-4" />
              <span>Sintaks Error Terdeteksi:</span>
            </div>
            <pre className="font-mono text-[11px] whitespace-pre-wrap text-rose-200">
              {syntaxError}
            </pre>
          </div>
        )}

        {/* Test Cases List */}
        <div className="space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Skenario Pengujian (Test Cases):
          </div>

          {testCases.map((tc, idx) => {
            const res = testResults.find((r) => r.testId === tc.id);
            const isPassed = res?.passed;
            const hasRun = !!res;

            return (
              <div
                key={tc.id}
                className={`rounded-lg border p-3 text-xs transition-all ${
                  !hasRun
                    ? 'border-slate-800 bg-slate-900/40'
                    : isPassed
                    ? 'border-emerald-800/60 bg-emerald-950/20'
                    : 'border-rose-800/60 bg-rose-950/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-400">
                        #{idx + 1}
                      </span>
                      <span className="font-medium text-slate-200">
                        {tc.inputDescription}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {tc.explanation}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0">
                    {!hasRun ? (
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded">
                        MENUNGGU
                      </span>
                    ) : isPassed ? (
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/80 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        LOLOS
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800/80 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        GAGAL
                      </span>
                    )}
                  </div>
                </div>

                {/* Test details on failure */}
                {hasRun && !isPassed && (
                  <div className="mt-2.5 pt-2 border-t border-rose-900/40 grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block">Output Diharapkan:</span>
                      <span className="text-emerald-400 whitespace-pre-wrap">
                        {formatValue(tc.expectedOutput)}
                      </span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block">Output Kodemu:</span>
                      <span className="text-rose-400 whitespace-pre-wrap">
                        {res?.error ? `Error: ${res.error}` : formatValue(res?.actualOutput)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Terminal Console Logs */}
        <div className="pt-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <TermIcon className="w-3.5 h-3.5 text-slate-400" />
            Output Konsol (console.log):
          </div>
          <div className="bg-slate-950 rounded-lg border border-slate-800/80 p-2.5 font-mono text-xs text-slate-300 min-h-24 max-h-40 overflow-y-auto space-y-1">
            {logs.length === 0 ? (
              <span className="text-slate-600 italic">
                (Belum ada output konsol. Gunakan console.log(...) dalam kode untuk memeriksa nilai variabel)
              </span>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="text-slate-300 leading-snug flex items-start gap-1">
                  <span className="text-amber-500/70 select-none">&gt;</span>
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
