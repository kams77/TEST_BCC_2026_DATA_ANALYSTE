import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Flame, 
  RotateCcw, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Trophy,
  Volume2,
  VolumeX
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUESTION_BANK } from '../data/questions';
import { useProgress } from '../context/ProgressContext';
import { Question } from '../types';

export const SprintTrainer: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {
  const { recordAnswer } = useProgress();

  // Filter primarily for psychotechnical and quick-decision questions
  const sprintPool = useRef<Question[]>(
    [...QUESTION_BANK]
      .filter(q => q.category === 'psychotech_entry_level' || q.category === 'psychotech_logic' || q.category === 'psychotech_numerical' || q.timeEstimateSeconds <= 45)
      .sort(() => Math.random() - 0.5)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const currentQ = sprintPool.current[currentIndex];

  // Synthesize audio feedback via Web Audio API
  const playSound = (type: 'correct' | 'wrong' | 'tick') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.08); // A5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        osc.frequency.setValueAtTime(164.81, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.04);
      }
    } catch (e) {
      // AudioContext may be restricted before gesture
    }
  };

  // Timer countdown
  useEffect(() => {
    if (isAnswered || isFinished) return;

    if (secondsLeft <= 0) {
      handleTimeout();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 5 && prev > 1) {
          playSound('tick');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, isAnswered, isFinished]);

  const handleTimeout = () => {
    setIsAnswered(true);
    setSelectedOption(-1);
    setStreak(0);
    playSound('wrong');
    recordAnswer(currentQ.id, -1, false, 30, currentQ.category);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered || isFinished) return;
    setIsAnswered(true);
    setSelectedOption(idx);

    const isCorrect = idx === currentQ.correctIndex;
    recordAnswer(currentQ.id, idx, isCorrect, 30 - secondsLeft, currentQ.category);

    if (isCorrect) {
      playSound('correct');
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      const points = 100 + (secondsLeft * 10) + (streak * 25);
      setTotalScore(prev => prev + points);

      if (newStreak % 5 === 0) {
        confetti({ particleCount: 50, spread: 60 });
      }
    } else {
      playSound('wrong');
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex >= sprintPool.current.length - 1) {
      setIsFinished(true);
      return;
    }
    setCurrentIndex(prev => prev + 1);
    setIsAnswered(false);
    setSelectedOption(null);
    setSecondsLeft(30);
  };

  const handleRestart = () => {
    sprintPool.current = [...QUESTION_BANK]
      .filter(q => q.category === 'psychotech_entry_level' || q.category === 'psychotech_logic' || q.category === 'psychotech_numerical' || q.timeEstimateSeconds <= 45)
      .sort(() => Math.random() - 0.5);
    setCurrentIndex(0);
    setSecondsLeft(30);
    setStreak(0);
    setTotalScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsFinished(false);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      
      {/* Control Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Sprint Éclair Psychotechnique (30s)</span>
            </div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white">
              Automatisation des Réflexes Éclair
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {streak >= 2 && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>x{streak} Série !</span>
            </div>
          )}

          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium">Points</span>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {totalScore}
            </div>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Activer/désactiver les sons"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Finished Summary */}
      {isFinished ? (
        <div className="p-8 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Session Sprint Éclair Terminée !
          </h2>

          <div className="flex justify-center gap-8 py-3">
            <div>
              <span className="text-xs text-slate-400">Score Total</span>
              <div className="text-2xl font-black text-emerald-600 font-mono tabular-nums">{totalScore} pts</div>
            </div>
            <div>
              <span className="text-xs text-slate-400">Série Maximale</span>
              <div className="text-2xl font-black text-amber-500 font-mono tabular-nums">{maxStreak} d'affilée</div>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-3">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Relancer un Sprint</span>
            </button>

            <button
              onClick={onBackToDashboard}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
            >
              <span>Retour Tableau de Bord</span>
            </button>
          </div>
        </div>
      ) : currentQ && (
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          
          {/* Timer Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono font-bold mb-1.5">
              <span className="text-slate-500">
                Question {currentIndex + 1} / {sprintPool.current.length}
              </span>
              <span className={`tabular-nums ${secondsLeft <= 7 ? 'text-rose-500 animate-pulse' : 'text-slate-700 dark:text-slate-300'}`}>
                {secondsLeft}s
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${
                  secondsLeft <= 7 ? 'bg-rose-500' : 'bg-sky-500'
                }`}
                style={{ width: `${(secondsLeft / 30) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
              {currentQ.categoryLabel}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {currentQ.prompt}
            </h3>
          </div>

          {/* Context data if matrix */}
          {currentQ.contextData?.type === 'matrix' && currentQ.contextData.matrixGrid && (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
              <table className="w-full text-xs text-left">
                <tbody>
                  {currentQ.contextData.matrixGrid.map((row, rIdx) => (
                    <tr key={rIdx} className={rIdx === 0 ? 'font-bold bg-slate-200/50 dark:bg-slate-800' : 'border-t border-slate-200 dark:border-slate-800'}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className={`p-2 font-mono ${cell.includes('[ ? ]') ? 'text-amber-500 font-bold' : ''}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = currentQ.correctIndex === idx;

              let style = 'border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 bg-white dark:bg-slate-900';
              if (isAnswered) {
                if (isCorrect) {
                  style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-medium';
                } else if (isSelected && !isCorrect) {
                  style = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100';
                } else {
                  style = 'border-slate-200 dark:border-slate-800 opacity-50';
                }
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-mono text-xs">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-500" />}
                </div>
              );
            })}
          </div>

          {/* Next Button and Quick Hint */}
          {isAnswered && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                {selectedOption === currentQ.correctIndex ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Excellent réflexe ! +points</span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">
                    Réponse correcte : {currentQ.options[currentQ.correctIndex]}
                  </span>
                )}
              </div>

              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs uppercase tracking-wider"
              >
                <span>Suivant</span>
                <Zap className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
