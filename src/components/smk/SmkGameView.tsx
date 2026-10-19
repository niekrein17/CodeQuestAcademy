import React, { useState, useEffect, useCallback } from 'react';
import { 
  Terminal, 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  Lightbulb, 
  CheckCircle2, 
  Play, 
  RotateCcw,
  Building2,
  Code
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SmkLevel } from '../../types/game';
import { SMK_LEVELS } from '../../data/smkLevels';
import { SmkCodeEditor } from './SmkCodeEditor';
import { SmkTestRunner, TestResult } from './SmkTestRunner';
import { sound } from '../../utils/audio';

interface SmkGameViewProps {
  onLevelComplete?: (levelId: number) => void;
}

export const SmkGameView: React.FC<SmkGameViewProps> = ({ onLevelComplete }) => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const level = SMK_LEVELS[currentLevelIndex];

  // User code
  const [userCode, setUserCode] = useState(level.initialCode);

  // Execution state
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [syntaxError, setSyntaxError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Modals & Panels
  const [showTheory, setShowTheory] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showVictory, setShowVictory] = useState(false);

  // When level changes, reset state
  useEffect(() => {
    setUserCode(level.initialCode);
    setTestResults([]);
    setLogs([]);
    setSyntaxError(null);
    setShowVictory(false);
    setShowHints(false);
  }, [level]);

  // Deep equality helper for comparing outputs (numbers, strings, arrays, objects)
  const isDeepEqual = (a: unknown, b: unknown): boolean => {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (typeof a === 'number' && typeof b === 'number') {
      return Math.abs(a - b) < 0.0001; // float precision tolerance
    }
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((val, idx) => isDeepEqual(val, b[idx]));
    }
    if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
      const keysA = Object.keys(a as Record<string, unknown>);
      const keysB = Object.keys(b as Record<string, unknown>);
      if (keysA.length !== keysB.length) return false;
      return keysA.every((k) =>
        isDeepEqual(
          (a as Record<string, unknown>)[k],
          (b as Record<string, unknown>)[k]
        )
      );
    }
    return false;
  };

  // Run Test Cases safely in browser
  const handleRunTests = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    setSyntaxError(null);
    sound.playRun();

    const capturedLogs: string[] = [];
    const results: TestResult[] = [];

    try {
      // Mock console.log inside user code sandbox
      const customConsole = {
        log: (...args: unknown[]) => {
          capturedLogs.push(
            args
              .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
              .join(' ')
          );
        },
      };

      // Wrap user code in a function factory
      // Returns the user's defined function
      const wrapper = new Function(
        'console',
        `
        ${userCode}
        if (typeof ${level.functionName} !== 'function') {
          throw new Error('Fungsi "${level.functionName}" tidak ditemukan dalam kode.');
        }
        return ${level.functionName};
      `
      );

      const targetFunc = wrapper(customConsole);

      // Execute each test case
      let allPassed = true;

      for (const tc of level.testCases) {
        try {
          // Deep clone inputs to prevent mutation
          const inputCopies = JSON.parse(JSON.stringify(tc.inputs));
          const actualOutput = targetFunc(...inputCopies);
          const passed = isDeepEqual(actualOutput, tc.expectedOutput);

          if (!passed) allPassed = false;

          results.push({
            testId: tc.id,
            passed,
            actualOutput,
            expectedOutput: tc.expectedOutput,
          });
        } catch (err: unknown) {
          allPassed = false;
          results.push({
            testId: tc.id,
            passed: false,
            actualOutput: undefined,
            expectedOutput: tc.expectedOutput,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }

      setLogs(capturedLogs);
      setTestResults(results);

      if (allPassed) {
        sound.playVictory();
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
        setShowVictory(true);
        if (onLevelComplete) {
          onLevelComplete(level.id);
        }
      } else {
        sound.playError();
      }
    } catch (err: unknown) {
      sound.playError();
      setSyntaxError(err instanceof Error ? err.message : String(err));
      setLogs(capturedLogs);
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, userCode, level, onLevelComplete]);

  const handleNextLevel = () => {
    if (currentLevelIndex < SMK_LEVELS.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
    }
  };

  const handlePrevLevel = () => {
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex(currentLevelIndex - 1);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] flex flex-col bg-slate-950 overflow-hidden">
      {/* Subheader / Level Navigation & Actions */}
      <div className="h-14 px-4 md:px-6 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevLevel}
              disabled={currentLevelIndex === 0 || isRunning}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
              SMK · Misi {level.id} / {SMK_LEVELS.length}
            </span>
            <button
              onClick={handleNextLevel}
              disabled={currentLevelIndex === SMK_LEVELS.length - 1 || isRunning}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden sm:block">
            <h2 className="text-sm font-bold text-white leading-tight">{level.title}</h2>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>{level.subtitle}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 font-mono text-[11px]">{level.concept}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Teori Singkat Modal Button */}
          <button
            onClick={() => {
              sound.playClick();
              setShowTheory(true);
            }}
            className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Teori &amp; Sintaks</span>
          </button>

          {/* Hints Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setShowHints(!showHints);
            }}
            className={`px-2.5 py-1 text-xs rounded-md border transition-colors flex items-center gap-1.5 ${
              showHints
                ? 'bg-amber-950/60 text-amber-300 border-amber-600/50'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900 border-slate-800'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Petunjuk</span>
          </button>

          {/* Run Tests CTA */}
          <button
            onClick={handleRunTests}
            disabled={isRunning}
            className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isRunning ? 'Menguji...' : 'Uji Solusi'}
          </button>
        </div>
      </div>

      {/* Industrial Scenario Banner */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-6 py-2.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-semibold text-amber-300">Konteks Industri:</span>
          <span>{level.industryContext}</span>
        </div>
        <div className="text-slate-400 text-[11px] font-mono">
          Target: {level.taskGoal}
        </div>
      </div>

      {/* Hints Dropdown Drawer */}
      {showHints && (
        <div className="bg-amber-950/30 border-b border-amber-600/40 px-6 py-3 space-y-1.5 text-xs text-amber-200">
          <div className="font-semibold text-amber-300 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Petunjuk Pengerjaan:
          </div>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            {level.hints.map((hint, idx) => (
              <li key={idx}>{hint}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Two-Column View: Left Code Editor (50%) + Right Unit Test Runner (50%) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Left Column: Code Editor */}
        <div className="h-full overflow-hidden">
          <SmkCodeEditor
            code={userCode}
            onChangeCode={setUserCode}
            onResetCode={() => setUserCode(level.initialCode)}
            onRunTests={handleRunTests}
            isRunning={isRunning}
          />
        </div>

        {/* Right Column: Unit Test Runner & Terminal Output */}
        <div className="h-full overflow-hidden">
          <SmkTestRunner
            testCases={level.testCases}
            testResults={testResults}
            logs={logs}
            syntaxError={syntaxError}
            isRunning={isRunning}
            onRunTests={handleRunTests}
          />
        </div>
      </div>

      {/* Theory & Syntax Guide Modal */}
      {showTheory && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>{level.theory.title}</span>
              </div>
              <button
                onClick={() => setShowTheory(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-slate-800"
              >
                Tutup [ESC]
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>{level.theory.explanation}</p>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Contoh Penulisan Sintaks:
                </span>
                <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-cyan-300 overflow-x-auto">
                  {level.theory.exampleCode}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowTheory(false)}
                className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors"
              >
                Saya Paham, Mulai Koding
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Victory Celebration Modal */}
      {showVictory && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-950 border border-amber-400/60 flex items-center justify-center mx-auto text-amber-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <div className="text-xs font-mono text-amber-400 uppercase tracking-widest">
                Misi {level.id} Sukses Terverifikasi!
              </div>
              <h3 className="text-2xl font-bold text-white">Semua Unit Test Lolos!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Kodemu berhasil menyelesaikan skenario industri dengan output yang tepat 100%.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-left text-xs text-slate-300 space-y-1">
              <span className="font-semibold text-amber-400">Pencapaian Kompetensi:</span>
              <p className="text-slate-400 text-[11px]">
                Menguasai konsep {level.concept} dengan implementasi kode modular dan penanganan berbagai test cases.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowVictory(false);
                }}
                className="flex-1 py-2 px-3 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Tinjau Solusi
              </button>

              {currentLevelIndex < SMK_LEVELS.length - 1 ? (
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowVictory(false);
                    handleNextLevel();
                  }}
                  className="flex-1 py-2 px-4 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors"
                >
                  Lanjut Misi {currentLevelIndex + 2} →
                </button>
              ) : (
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowVictory(false);
                    setCurrentLevelIndex(0);
                  }}
                  className="flex-1 py-2 px-4 rounded-lg text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors"
                >
                  Tamat! Ulangi Misi →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
