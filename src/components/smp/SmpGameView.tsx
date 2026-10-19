import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  RotateCcw, 
  FastForward, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Footprints
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SmpLevel, SmpCommand, SmpRobotState, Direction, TileType } from '../../types/game';
import { SMP_LEVELS } from '../../data/smpLevels';
import { SmpGridCanvas } from './SmpGridCanvas';
import { SmpBlockEditor } from './SmpBlockEditor';
import { sound } from '../../utils/audio';

interface SmpGameViewProps {
  onLevelComplete?: (levelId: number) => void;
  onGoToSmk?: () => void;
}

export const SmpGameView: React.FC<SmpGameViewProps> = ({ onLevelComplete, onGoToSmk }) => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const level = SMP_LEVELS[currentLevelIndex];

  // Commands state
  const [commands, setCommands] = useState<SmpCommand[]>([]);
  const [activeCommandId, setActiveCommandId] = useState<string | null>(null);

  // Runtime robot state
  const [robot, setRobot] = useState<SmpRobotState>({
    x: level.startX,
    y: level.startY,
    direction: level.startDir,
    batteriesCollected: 0,
    hasKey: false,
    doorsUnlocked: [],
    isAlive: true,
    reachedGoal: false,
  });

  const [collectedBatteries, setCollectedBatteries] = useState<string[]>([]);
  const [unlockedDoors, setUnlockedDoors] = useState<string[]>([]);

  // Execution controls
  const [isRunning, setIsRunning] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<1 | 2>(1);
  const [showHint, setShowHint] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);

  const isStopRequestedRef = useRef(false);

  // Reset robot position to level initial
  const resetRobot = useCallback(() => {
    isStopRequestedRef.current = true;
    setIsRunning(false);
    setActiveCommandId(null);
    setCollectedBatteries([]);
    setUnlockedDoors([]);
    setExecutionMessage(null);
    setRobot({
      x: level.startX,
      y: level.startY,
      direction: level.startDir,
      batteriesCollected: 0,
      hasKey: false,
      doorsUnlocked: [],
      isAlive: true,
      reachedGoal: false,
    });
  }, [level]);

  // When level changes, reset robot and load sample blocks or empty
  useEffect(() => {
    resetRobot();
    setShowVictory(false);
    setShowHint(false);
    // Provide a friendly starting block on level 1
    if (level.id === 1) {
      setCommands([
        { id: 'c1', type: 'maju' },
        { id: 'c2', type: 'belok_kanan' },
        { id: 'c3', type: 'maju' },
      ]);
    } else {
      setCommands([]);
    }
  }, [level, resetRobot]);

  // Turn direction helper
  const getNewDirection = (current: Direction, turn: 'left' | 'right'): Direction => {
    const clockwise: Direction[] = ['up', 'right', 'down', 'left'];
    const idx = clockwise.indexOf(current);
    if (turn === 'right') {
      return clockwise[(idx + 1) % 4];
    } else {
      return clockwise[(idx + 3) % 4];
    }
  };

  // Get next coordinate based on direction
  const getForwardCoord = (x: number, y: number, dir: Direction): { x: number; y: number } => {
    switch (dir) {
      case 'up': return { x, y: y - 1 };
      case 'down': return { x, y: y + 1 };
      case 'left': return { x: x - 1, y };
      case 'right': return { x: x + 1, y };
    }
  };

  // Flatten nested commands (loops and ifs) for execution sequence
  const flattenExecutionList = (
    list: SmpCommand[],
    currentRState: { x: number; y: number; dir: Direction; collBatteries: string[] }
  ): SmpCommand[] => {
    const flat: SmpCommand[] = [];

    for (const cmd of list) {
      if (cmd.type === 'ulang') {
        const count = cmd.repeatCount || 3;
        for (let i = 0; i < count; i++) {
          if (cmd.subCommands) {
            flat.push(...cmd.subCommands);
          }
        }
      } else if (cmd.type === 'jika') {
        // Condition check logic
        let conditionMet = false;
        const forward = getForwardCoord(currentRState.x, currentRState.y, currentRState.dir);

        if (cmd.condition === 'ada_rintangan_depan') {
          if (
            forward.x < 0 || forward.x >= level.gridWidth ||
            forward.y < 0 || forward.y >= level.gridHeight ||
            level.tiles[forward.y][forward.x] === 'hazard' ||
            level.tiles[forward.y][forward.x] === 'wall'
          ) {
            conditionMet = true;
          }
        } else if (cmd.condition === 'ada_kristal') {
          const hereKey = `${currentRState.x},${currentRState.y}`;
          if (level.tiles[currentRState.y][currentRState.x] === 'battery' && !currentRState.collBatteries.includes(hereKey)) {
            conditionMet = true;
          }
        }

        if (conditionMet && cmd.subCommands) {
          flat.push(...cmd.subCommands);
        }
      } else {
        flat.push(cmd);
      }
    }
    return flat;
  };

  // Step-by-step runner
  const runSimulation = async () => {
    if (isRunning) return;
    if (commands.length === 0) {
      sound.playError();
      setExecutionMessage('Tambahkan setidaknya 1 blok perintah terlebih dahulu!');
      return;
    }

    resetRobot();
    isStopRequestedRef.current = false;
    setIsRunning(true);
    sound.playRun();
    setExecutionMessage('Robot sedang menjalankan instruksi...');

    // Short pause before starting
    await new Promise((r) => setTimeout(r, 200));

    // Current working mutable state
    let curX = level.startX;
    let curY = level.startY;
    let curDir = level.startDir;
    let curBatteries = 0;
    let curHasKey = false;
    const curCollBatteries: string[] = [];
    const curUnlockedDoors: string[] = [];
    let isAlive = true;

    // Get flat commands
    const sequence = flattenExecutionList(commands, {
      x: curX,
      y: curY,
      dir: curDir,
      collBatteries: curCollBatteries,
    });

    const stepDelay = speedMultiplier === 2 ? 220 : 450;

    for (let i = 0; i < sequence.length; i++) {
      if (isStopRequestedRef.current) break;

      const cmd = sequence[i];
      setActiveCommandId(cmd.id);

      // Execute single command
      if (cmd.type === 'maju') {
        const next = getForwardCoord(curX, curY, curDir);

        // Boundary check
        if (next.x < 0 || next.x >= level.gridWidth || next.y < 0 || next.y >= level.gridHeight) {
          isAlive = false;
          sound.playError();
          setExecutionMessage('Rover menabrak batas stasiun antariksa!');
          break;
        }

        const targetTile = level.tiles[next.y][next.x];

        // Wall check
        if (targetTile === 'wall') {
          isAlive = false;
          sound.playError();
          setExecutionMessage('Rover menabrak dinding batu!');
          break;
        }

        // Locked door check
        if (targetTile === 'door' && !curUnlockedDoors.includes(`${next.x},${next.y}`)) {
          isAlive = false;
          sound.playError();
          setExecutionMessage('Pintu terkunci! Gunakan kunci dan perintah "Buka Pintu" terlebih dahulu.');
          break;
        }

        // Hazard check
        if (targetTile === 'hazard') {
          isAlive = false;
          sound.playError();
          setExecutionMessage('Rover jatuh ke dalam jurang! Gunakan perintah "Lompat".');
          break;
        }

        curX = next.x;
        curY = next.y;
        sound.playStep();
      } else if (cmd.type === 'belok_kiri') {
        curDir = getNewDirection(curDir, 'left');
        sound.playTurn();
      } else if (cmd.type === 'belok_kanan') {
        curDir = getNewDirection(curDir, 'right');
        sound.playTurn();
      } else if (cmd.type === 'ambil') {
        const key = `${curX},${curY}`;
        if (level.tiles[curY][curX] === 'battery' && !curCollBatteries.includes(key)) {
          curCollBatteries.push(key);
          curBatteries += 1;
          sound.playCollect();
          setCollectedBatteries([...curCollBatteries]);
        } else if (level.tiles[curY][curX] === 'key' && !curHasKey) {
          curHasKey = true;
          sound.playCollect();
        } else {
          sound.playClick();
        }
      } else if (cmd.type === 'buka_pintu') {
        const next = getForwardCoord(curX, curY, curDir);
        const doorKey = `${next.x},${next.y}`;
        if (next.y >= 0 && next.y < level.gridHeight && next.x >= 0 && next.x < level.gridWidth && level.tiles[next.y][next.x] === 'door') {
          if (curHasKey) {
            curUnlockedDoors.push(doorKey);
            setUnlockedDoors([...curUnlockedDoors]);
            sound.playUnlock();
          } else {
            sound.playError();
            setExecutionMessage('Kamu belum memiliki kunci pintu!');
            break;
          }
        }
      } else if (cmd.type === 'lompat') {
        const next1 = getForwardCoord(curX, curY, curDir);
        const next2 = getForwardCoord(next1.x, next1.y, curDir);
        if (next2.x >= 0 && next2.x < level.gridWidth && next2.y >= 0 && next2.y < level.gridHeight && level.tiles[next2.y][next2.x] !== 'wall') {
          curX = next2.x;
          curY = next2.y;
          sound.playStep();
        } else {
          isAlive = false;
          sound.playError();
          break;
        }
      }

      // Update state
      setRobot({
        x: curX,
        y: curY,
        direction: curDir,
        batteriesCollected: curBatteries,
        hasKey: curHasKey,
        doorsUnlocked: curUnlockedDoors,
        isAlive,
        reachedGoal: level.tiles[curY][curX] === 'goal',
      });

      await new Promise((r) => setTimeout(r, stepDelay));
    }

    setActiveCommandId(null);
    setIsRunning(false);

    // Final Level Goal Check
    const isAtGoal = level.tiles[curY][curX] === 'goal';
    
    // Check required batteries
    let totalBatteriesOnLevel = 0;
    level.tiles.forEach((row) =>
      row.forEach((t) => {
        if (t === 'battery') totalBatteriesOnLevel++;
      })
    );

    const hasCollectedAllBatteries = curBatteries >= totalBatteriesOnLevel;

    if (isAlive && isAtGoal) {
      if (hasCollectedAllBatteries) {
        sound.playVictory();
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
        setExecutionMessage('Hebat! Misi Berhasil Dituntaskan!');
        setShowVictory(true);
        if (onLevelComplete) {
          onLevelComplete(level.id);
        }
      } else {
        sound.playError();
        setExecutionMessage(`Rover tiba di terminal, namun belum mengumpulkan semua kristal baterai (${curBatteries}/${totalBatteriesOnLevel})!`);
      }
    } else if (isAlive && !isAtGoal) {
      setExecutionMessage('Instruksi selesai, namun Rover belum tiba di Terminal Tujuan.');
    }
  };

  const handleNextLevel = () => {
    if (currentLevelIndex < SMP_LEVELS.length - 1) {
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
      {/* Level Subheader / Progress Bar */}
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
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
              SMP · Level {level.id} / {SMP_LEVELS.length}
            </span>
            <button
              onClick={handleNextLevel}
              disabled={currentLevelIndex === SMP_LEVELS.length - 1 || isRunning}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden sm:block">
            <h2 className="text-sm font-bold text-white leading-tight">{level.title}</h2>
            <div className="text-xs text-slate-400">{level.subtitle}</div>
          </div>
        </div>

        {/* Level Controls & Action Deck */}
        <div className="flex items-center gap-2">
          {/* Speed Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setSpeedMultiplier(speedMultiplier === 1 ? 2 : 1);
            }}
            disabled={isRunning}
            className="px-2.5 py-1 text-xs font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 flex items-center gap-1"
          >
            <FastForward className="w-3 h-3" />
            Kecepatan: {speedMultiplier}x
          </button>

          {/* Hint Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setShowHint(!showHint);
            }}
            className={`px-2.5 py-1 text-xs rounded-md border transition-colors flex items-center gap-1 ${
              showHint
                ? 'bg-amber-950/60 text-amber-300 border-amber-600/50'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900 border-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            Petunjuk
          </button>

          {/* Reset Position Button */}
          <button
            onClick={() => {
              sound.playClick();
              resetRobot();
            }}
            className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          {/* Run / Stop Button */}
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isRunning ? 'Berjalan...' : 'Jalankan Program'}
          </button>
        </div>
      </div>

      {/* Collapsible Pedagogical Hint Box */}
      {showHint && (
        <div className="bg-amber-950/40 border-b border-amber-600/40 px-6 py-2.5 flex items-start gap-3 text-xs text-amber-200">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-amber-300">Tips Misi: </span>
            {level.hint}
          </div>
        </div>
      )}

      {/* Live Feedback Notification Banner */}
      {executionMessage && (
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-2 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-300">
            <Footprints className="w-4 h-4 text-cyan-400" />
            <span>{executionMessage}</span>
          </div>
        </div>
      )}

      {/* Main Two-Column Interactive Stage */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column (55% on desktop): 2D Grid Canvas & Environmental Stage */}
        <div className="lg:col-span-7 h-full flex flex-col bg-slate-950/60 border-r border-slate-800 overflow-hidden">
          <div className="flex-1 flex items-center justify-center overflow-auto p-4">
            <SmpGridCanvas
              level={level}
              robot={robot}
              activeCommandId={activeCommandId}
              collectedBatteries={collectedBatteries}
              unlockedDoors={unlockedDoors}
            />
          </div>

          {/* Brief Mission Rules & Learning Points */}
          <div className="p-3 bg-slate-900/50 border-t border-slate-800/80 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">Tujuan:</span>
              <span>{level.description}</span>
            </div>
            <div className="text-[11px] font-mono text-cyan-400/90 whitespace-nowrap">
              Konsep: {level.concept}
            </div>
          </div>
        </div>

        {/* Right Column (45% on desktop): Visual Block Builder & Real Code Preview */}
        <div className="lg:col-span-5 h-full overflow-hidden flex flex-col">
          <SmpBlockEditor
            commands={commands}
            onChangeCommands={setCommands}
            availableBlocks={level.availableBlocks}
            maxBlocks={level.maxBlocks}
            activeCommandId={activeCommandId}
            isRunning={isRunning}
          />
        </div>
      </div>

      {/* Victory Celebration Modal */}
      {showVictory && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-950 border border-cyan-400/60 flex items-center justify-center mx-auto text-cyan-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                Level {level.id} Tuntas!
              </div>
              <h3 className="text-2xl font-bold text-white">Selamat, Misi Sukses!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Kamu telah berhasil memprogram Rover dengan algoritma yang tepat dan efisien.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-left space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-300 uppercase">Poin Pembelajaran:</div>
              {level.learningPoints.map((point, idx) => (
                <div key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowVictory(false);
                  resetRobot();
                }}
                className="flex-1 py-2 px-3 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Coba Lagi
              </button>

              {currentLevelIndex < SMP_LEVELS.length - 1 ? (
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowVictory(false);
                    handleNextLevel();
                  }}
                  className="flex-1 py-2 px-4 rounded-lg text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors"
                >
                  Lanjut Level {currentLevelIndex + 2} →
                </button>
              ) : (
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowVictory(false);
                    if (onGoToSmk) onGoToSmk();
                  }}
                  className="flex-1 py-2 px-4 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors"
                >
                  Beralih ke Jalur SMK →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
