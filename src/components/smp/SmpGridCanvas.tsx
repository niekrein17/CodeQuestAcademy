import React from 'react';
import { SmpLevel, SmpRobotState, Direction, TileType } from '../../types/game';

interface SmpGridCanvasProps {
  level: SmpLevel;
  robot: SmpRobotState;
  activeCommandId?: string | null;
  collectedBatteries: string[]; // set of "x,y" keys collected during current run
  unlockedDoors: string[]; // set of "x,y" keys opened
}

export const SmpGridCanvas: React.FC<SmpGridCanvasProps> = ({
  level,
  robot,
  collectedBatteries,
  unlockedDoors,
}) => {
  const { gridWidth, gridHeight, tiles } = level;

  // Rotation angles for robot SVG
  const dirAngles: Record<Direction, number> = {
    up: 0,
    right: 90,
    down: 180,
    left: 270,
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 select-none">
      {/* Grid Canvas Wrapper */}
      <div 
        className="relative bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-inner overflow-hidden max-w-full max-h-full"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridWidth}, minmax(42px, 68px))`,
          gridTemplateRows: `repeat(${gridHeight}, minmax(42px, 68px))`,
          gap: '4px',
        }}
      >
        {tiles.map((row, y) =>
          row.map((tileType, x) => {
            const coordKey = `${x},${y}`;
            const isRobotHere = robot.x === x && robot.y === y;
            const isBatteryHere = tileType === 'battery' && !collectedBatteries.includes(coordKey);
            const isKeyHere = tileType === 'key' && !robot.hasKey;
            const isDoorHere = tileType === 'door';
            const isDoorOpen = unlockedDoors.includes(coordKey);

            return (
              <div
                key={coordKey}
                className={`relative rounded-lg flex items-center justify-center transition-all duration-150 ${
                  tileType === 'wall'
                    ? 'bg-slate-950 border border-slate-800/80 shadow-inner'
                    : tileType === 'hazard'
                    ? 'bg-rose-950/40 border border-rose-900/60'
                    : tileType === 'goal'
                    ? 'bg-emerald-950/40 border border-emerald-500/50 animate-pulse'
                    : 'bg-slate-800/60 border border-slate-700/40'
                }`}
              >
                {/* Wall Texture Icon */}
                {tileType === 'wall' && (
                  <div className="w-full h-full flex items-center justify-center opacity-30">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5">
                      <line x1="0" y1="0" x2="24" y2="24" />
                      <line x1="24" y1="0" x2="0" y2="24" />
                      <rect x="2" y="2" width="20" height="20" rx="2" />
                    </svg>
                  </div>
                )}

                {/* Hazard / Lava / Gap */}
                {tileType === 'hazard' && (
                  <div className="flex flex-col items-center justify-center text-rose-400">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <span className="text-[9px] font-mono font-bold text-rose-300">JURANG</span>
                  </div>
                )}

                {/* Energy Battery / Crystal Item */}
                {isBatteryHere && (
                  <div className="relative animate-bounce">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <polygon points="12,2 20,8 16,22 8,22 4,8" fill="#38bdf8" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="2" />
                      <polygon points="12,6 16,10 14,18 10,18 8,10" fill="#38bdf8" />
                    </svg>
                  </div>
                )}

                {/* Access Key */}
                {isKeyHere && (
                  <div className="animate-pulse">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                      <circle cx="7.5" cy="15.5" r="4.5" />
                      <path d="M21 2l-9.6 9.6" />
                      <path d="M15.5 7.5l3 3" />
                    </svg>
                  </div>
                )}

                {/* Door (Locked or Unlocked) */}
                {isDoorHere && (
                  <div className="flex flex-col items-center justify-center">
                    {isDoorOpen ? (
                      <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-1 py-0.5 rounded border border-emerald-600/40">
                        TERBUKA
                      </span>
                    ) : (
                      <div className="text-amber-400 flex flex-col items-center">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span className="text-[9px] font-mono text-amber-300 font-bold">PINTU</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Terminal Goal */}
                {tileType === 'goal' && (
                  <div className="flex flex-col items-center justify-center text-emerald-400">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className="text-[9px] font-mono font-bold tracking-tight text-emerald-300">
                      TUJUAN
                    </span>
                  </div>
                )}

                {/* Start Flag indicator */}
                {tileType === 'start' && !isRobotHere && (
                  <span className="text-[9px] font-mono text-slate-400">MULAI</span>
                )}

                {/* ROBOT AVATAR */}
                {isRobotHere && (
                  <div
                    className="absolute inset-0 flex items-center justify-center z-20 transition-transform duration-200"
                    style={{
                      transform: `rotate(${dirAngles[robot.direction]}deg)`,
                    }}
                  >
                    {/* Bespoke Styled Vector CyberRover */}
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                        {/* Tank Treads */}
                        <rect x="4" y="6" width="6" height="26" rx="2" fill="#334155" stroke="#64748b" strokeWidth="1" />
                        <rect x="28" y="6" width="6" height="26" rx="2" fill="#334155" stroke="#64748b" strokeWidth="1" />
                        {/* Main Chassis */}
                        <rect x="9" y="8" width="20" height="22" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                        {/* Sensor Dome / Eye */}
                        <circle cx="19" cy="13" r="4.5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                        <circle cx="19" cy="13" r="2.5" fill={robot.isAlive ? '#38bdf8' : '#f43f5e'} className="animate-pulse" />
                        {/* Head Forward Indicator Antenna */}
                        <line x1="19" y1="8" x2="19" y2="3" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="19" cy="2" r="1.5" fill="#38bdf8" />
                        {/* Solar Core */}
                        <rect x="13" y="20" width="12" height="6" rx="1.5" fill="#0369a1" />
                        <line x1="16" y1="20" x2="16" y2="26" stroke="#38bdf8" strokeWidth="1" />
                        <line x1="22" y1="20" x2="22" y2="26" stroke="#38bdf8" strokeWidth="1" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Live Coordinate & Status Line */}
      <div className="mt-3 flex items-center gap-4 text-xs font-mono text-slate-400">
        <span>Posisi: ({robot.x}, {robot.y})</span>
        <span aria-hidden="true">·</span>
        <span>Arah: {robot.direction.toUpperCase()}</span>
        <span aria-hidden="true">·</span>
        <span className="text-cyan-400">Kristal: {robot.batteriesCollected} / {level.parScore ? level.learningPoints.length : 1}</span>
        {robot.hasKey && (
          <>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400 font-semibold">Punya Kunci</span>
          </>
        )}
      </div>
    </div>
  );
};
