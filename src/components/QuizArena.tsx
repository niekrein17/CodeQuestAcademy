import React, { useState } from 'react';
import { CheckCircle2, XCircle, Award, RotateCcw, Brain, ChevronRight, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { QuizQuestion, Track } from '../types/game';
import { sound } from '../utils/audio';

interface QuizArenaProps {
  onBackToTitle: () => void;
}

export const QuizArena: React.FC<QuizArenaProps> = ({ onBackToTitle }) => {
  const [filterTrack, setFilterTrack] = useState<'all' | 'smp' | 'smk'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Filtered questions
  const filteredQuestions = QUIZ_QUESTIONS.filter(
    (q) => filterTrack === 'all' || q.track === filterTrack || q.track === 'all'
  );

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    sound.playClick();
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOption === currentQ.correctIndex;
    if (isCorrect) {
      sound.playCollect();
      setScore((prev) => prev + 10);
    } else {
      sound.playError();
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
      sound.playVictory();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="w-full h-[calc(100vh-3.5rem)] overflow-y-auto bg-slate-950 p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
        {/* Header & Category Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Kuis Tantangan Logika</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Uji pemahaman konsep dasar pemrograman dengan penjelasan interaktif.
            </p>
          </div>

          {/* Track Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => {
                setFilterTrack('all');
                handleRestart();
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                filterTrack === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => {
                setFilterTrack('smp');
                handleRestart();
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                filterTrack === 'smp' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              SMP
            </button>
            <button
              onClick={() => {
                setFilterTrack('smk');
                handleRestart();
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                filterTrack === 'smk' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              SMK
            </button>
          </div>
        </div>

        {/* Finished Screen */}
        {isFinished ? (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-indigo-950 border border-indigo-400/60 flex items-center justify-center mx-auto text-indigo-400">
              <Award className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-white">Kuis Selesai!</h3>
              <p className="text-xs text-slate-400">
                Total skor yang kamu kumpulkan:
              </p>
              <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 font-mono pt-2">
                {score} Poin
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
              {score >= filteredQuestions.length * 8 ? (
                <span className="text-emerald-400 font-semibold">
                  Luar biasa! Pemahaman logika dan sintaks pemrogramanmu sangat matang!
                </span>
              ) : (
                <span className="text-amber-400">
                  Kerja bagus! Pelajari kembali glosarium istilah dan tantangan level untuk memperkuat dasarmu.
                </span>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRestart}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Ulangi Kuis
              </button>
              <button
                onClick={onBackToTitle}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
              >
                Kembali ke Menu
              </button>
            </div>
          </div>
        ) : (
          /* Active Question */
          <div className="space-y-5">
            {/* Progress line */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Pertanyaan {currentIndex + 1} dari {filteredQuestions.length}</span>
              <span className="text-indigo-400 font-bold">Skor: {score}</span>
            </div>

            {/* Question Box */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-cyan-400">
                Kategori: {currentQ.category} ({currentQ.track.toUpperCase()})
              </div>
              <h3 className="text-base font-semibold text-white leading-relaxed">
                {currentQ.question}
              </h3>

              {currentQ.codeSnippet && (
                <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto whitespace-pre">
                  {currentQ.codeSnippet}
                </pre>
              )}
            </div>

            {/* Options List */}
            <div className="space-y-2">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = selectedOption === oIdx;
                const isCorrect = oIdx === currentQ.correctIndex;
                let optStyle = 'border-slate-800 bg-slate-950/60 text-slate-200 hover:border-slate-700';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-medium';
                  } else if (isSelected && !isCorrect) {
                    optStyle = 'border-rose-500 bg-rose-950/40 text-rose-200';
                  } else {
                    optStyle = 'border-slate-800/40 opacity-40 text-slate-400';
                  }
                } else if (isSelected) {
                  optStyle = 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500';
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(oIdx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-start gap-3 ${optStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation card after submit */}
            {isAnswerSubmitted && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  <span>Penjelasan Edukatif:</span>
                </div>
                <p className="text-slate-400 leading-relaxed pl-5">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Pilih jawaban lalu tekan tombol di samping
              </span>

              {!isAnswerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Kunci Jawaban
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-1"
                >
                  {currentIndex < filteredQuestions.length - 1 ? 'Pertanyaan Berikutnya' : 'Lihat Hasil Akhir'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
