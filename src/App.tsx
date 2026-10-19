import React, { useState, useEffect } from 'react';
import { AppView, Track } from './types/game';
import { HeaderNav } from './components/HeaderNav';
import { TitleScreen } from './components/TitleScreen';
import { LevelSelectView } from './components/LevelSelectView';
import { SmpGameView } from './components/smp/SmpGameView';
import { SmkGameView } from './components/smk/SmkGameView';
import { QuizArena } from './components/QuizArena';
import { GlossaryView } from './components/GlossaryView';
import { SandboxView } from './components/SandboxView';
import { sound } from './utils/audio';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('title');
  const [currentTrack, setCurrentTrack] = useState<Track>('smp');
  const [isMuted, setIsMuted] = useState<boolean>(sound.isMuted);

  // Completed levels tracking persisted in localStorage
  const [completedLevels, setCompletedLevels] = useState<{ smp: number[]; smk: number[] }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kodingarena_progress');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load progress', e);
      }
    }
    return { smp: [], smk: [] };
  });

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleNavigate = (view: AppView, track?: Track) => {
    sound.playClick();
    if (track) {
      setCurrentTrack(track);
    }
    setCurrentView(view);
  };

  const handleSelectTrack = (track: Track) => {
    setCurrentTrack(track);
    if (track === 'smp') {
      setCurrentView('smp_game');
    } else {
      setCurrentView('smk_game');
    }
  };

  const handleSelectLevel = (track: Track, levelId: number) => {
    setCurrentTrack(track);
    if (track === 'smp') {
      setCurrentView('smp_game');
    } else {
      setCurrentView('smk_game');
    }
  };

  const handleLevelComplete = (track: Track, levelId: number) => {
    setCompletedLevels((prev) => {
      const currentList = prev[track];
      if (currentList.includes(levelId)) return prev;
      const updated = {
        ...prev,
        [track]: [...currentList, levelId],
      };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('kodingarena_progress', JSON.stringify(updated));
        } catch (e) {
          console.error('Failed to save progress', e);
        }
      }
      return updated;
    });
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Bar Contract (Wordmark, Nav links, Action) */}
      <HeaderNav
        currentView={currentView}
        currentTrack={currentTrack}
        onNavigate={handleNavigate}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full h-[calc(100vh-3.5rem)] overflow-hidden relative">
        {currentView === 'title' && (
          <TitleScreen
            onSelectTrack={handleSelectTrack}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'level_select' && (
          <LevelSelectView
            initialTrack={currentTrack}
            completedLevels={completedLevels}
            onSelectLevel={handleSelectLevel}
            onBackToTitle={() => setCurrentView('title')}
          />
        )}

        {currentView === 'smp_game' && (
          <SmpGameView
            onLevelComplete={(id) => handleLevelComplete('smp', id)}
            onGoToSmk={() => {
              setCurrentTrack('smk');
              setCurrentView('smk_game');
            }}
          />
        )}

        {currentView === 'smk_game' && (
          <SmkGameView
            onLevelComplete={(id) => handleLevelComplete('smk', id)}
          />
        )}

        {currentView === 'quiz' && (
          <QuizArena onBackToTitle={() => setCurrentView('title')} />
        )}

        {currentView === 'glossary' && <GlossaryView />}

        {currentView === 'sandbox' && <SandboxView />}
      </main>
    </div>
  );
}
