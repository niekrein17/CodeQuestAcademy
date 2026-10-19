/**
 * Core type definitions for KodingArena
 */

export type Track = 'smp' | 'smk';

export type AppView = 'title' | 'level_select' | 'smp_game' | 'smk_game' | 'quiz' | 'glossary' | 'sandbox';

// ==================== SMP TRACK TYPES ====================

export type Direction = 'up' | 'down' | 'left' | 'right';

export type TileType = 
  | 'empty' 
  | 'wall' 
  | 'start' 
  | 'goal' 
  | 'battery' 
  | 'key' 
  | 'door' 
  | 'hazard';

export type SmpCommandType = 
  | 'maju' 
  | 'belok_kiri' 
  | 'belok_kanan' 
  | 'ambil' 
  | 'buka_pintu' 
  | 'lompat'
  | 'ulang'
  | 'jika';

export type SmpConditionType = 
  | 'ada_rintangan_depan' 
  | 'ada_kristal' 
  | 'pintu_terkunci';

export interface SmpCommand {
  id: string;
  type: SmpCommandType;
  repeatCount?: number; // for 'ulang'
  subCommands?: SmpCommand[]; // for inside loop or if-then
  elseCommands?: SmpCommand[]; // for if-else
  condition?: SmpConditionType; // for 'jika'
}

export interface SmpRobotState {
  x: number;
  y: number;
  direction: Direction;
  batteriesCollected: number;
  hasKey: boolean;
  doorsUnlocked: string[]; // "x,y" keys
  isAlive: boolean;
  reachedGoal: boolean;
  statusMessage?: string;
}

export interface SmpLevel {
  id: number;
  title: string;
  subtitle: string;
  concept: string;
  difficulty: 'Mudah' | 'Menengah' | 'Tantangan';
  description: string;
  hint: string;
  gridWidth: number;
  gridHeight: number;
  startX: number;
  startY: number;
  startDir: Direction;
  tiles: TileType[][]; // [y][x]
  availableBlocks: SmpCommandType[];
  maxBlocks?: number;
  parScore: number;
  learningPoints: string[];
}

// ==================== SMK TRACK TYPES ====================

export interface SmkTestCase {
  id: number;
  inputDescription: string;
  inputs: unknown[];
  expectedOutput: unknown;
  explanation: string;
}

export interface SmkLevel {
  id: number;
  title: string;
  subtitle: string;
  concept: string;
  difficulty: 'Dasar' | 'Menengah' | 'Lanjut' | 'Debugging';
  industryContext: string;
  description: string;
  taskGoal: string;
  hints: string[];
  initialCode: string;
  solutionTemplate: string;
  functionName: string;
  testCases: SmkTestCase[];
  theory: {
    title: string;
    explanation: string;
    exampleCode: string;
  };
}

// ==================== QUIZ & GLOSSARY TYPES ====================

export interface QuizQuestion {
  id: number;
  track: 'smp' | 'smk' | 'all';
  category: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GlossaryItem {
  id: string;
  term: string;
  englishTerm?: string;
  category: 'Dasar' | 'Struktur Kontrol' | 'Struktur Data' | 'Paradigma & Tool';
  targetAudience: 'smp' | 'smk' | 'both';
  definition: string;
  analogy: string;
  codeExample?: string;
}
