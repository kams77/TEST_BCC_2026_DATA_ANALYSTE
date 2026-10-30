import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Flag, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  ArrowLeft, 
  ArrowRight, 
  Send,
  HelpCircle,
  Bookmark,
  Award,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUESTION_BANK } from '../data/questions';
import { useProgress } from '../context/ProgressContext';
import { Question } from '../types';

export const ExamSimulator: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {
  const { recordAnswer, recordExamSession, bookmarkedQuestionIds, toggleBookmark } = useProgress();

  // Test setup
  const [questions, setQuestions] = useState<Question[]>(() => {
    // Shuffled pool of questions
    return [...QUESTION_BANK].sort(() => Math.random() - 0.5);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  // Pressure modes: 25 min (Standard), 15 min (Intense), 8 min (Sprint Extrême)
  const [examDuration, setExamDuration] = useState<number>(25 * 60);
  const [timeRemaining, setTimeRemaining] = useState<number>(25 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [questionStartTimes, setQuestionStartTimes] = useState<Record<string, number>>({});
  const [soundTensionEnabled, setSoundTensionEnabled] = useState(false);
  const [instantFeedbackMode, setInstantFeedbackMode] = useState(true);
  const [timeAlertDismissed, setTimeAlertDismissed] = useState<string | null>(null);

  const currentQ = questions[currentIndex];

  // Synthesize pressure tick sound for final 60 seconds
  const playPressureTick = (urgency: 'normal' | 'panic') => {
    if (!soundTensionEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = urgency === 'panic' ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(urgency === 'panic' ? 880 : 440, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      // Ignored
    }
  };

  // Track time spent on current question
  useEffect(() => {
    if (!isSubmitted && currentQ) {
      if (!questionStartTimes[currentQ.id]) {
        setQuestionStartTimes(prev => ({ ...prev, [currentQ.id]: Date.now() }));
      }
    }
  }, [currentIndex, isSubmitted, currentQ]);

  // Exam timer
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }

        // Tension sound during final 60 seconds
        if (prev <= 60 && prev > 0) {
          playPressureTick(prev <= 15 ? 'panic' : 'normal');
        }

        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, soundTensionEnabled]);

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [currentQ.id]: index }));
  };

  const handleToggleFlag = () => {
    setFlaggedQuestions(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
  };

  const handleSubmitExam = () => {
    setIsSubmitted(true);
    const totalTime = Math.round((Date.now() - startTime) / 1000);

    let correctCount = 0;
    const catBreakdown: any = {};

    questions.forEach(q => {
      const selected = userAnswers[q.id];
      const isCorrect = selected === q.correctIndex;
      if (isCorrect) correctCount++;

      // Record answer
      recordAnswer(
        q.id,
        selected ?? -1,
        isCorrect,
        Math.round((Date.now() - (questionStartTimes[q.id] || Date.now())) / 1000),
        q.category
      );

      if (!catBreakdown[q.category]) {
        catBreakdown[q.category] = { total: 0, correct: 0 };
      }
      catBreakdown[q.category].total += 1;
      if (isCorrect) catBreakdown[q.category].correct += 1;
    });

    const accuracy = Math.round((correctCount / questions.length) * 100);

    recordExamSession({
      totalQuestions: questions.length,
      score: correctCount,
      accuracy,
      totalTimeSeconds: totalTime,
      categoryBreakdown: catBreakdown,
      completed: true
    });

    if (accuracy >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestart = (newDuration?: number) => {
    const dur = newDuration ?? examDuration;
    setExamDuration(dur);
    setQuestions([...QUESTION_BANK].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setTimeRemaining(dur);
    setIsSubmitted(false);
    setStartTime(Date.now());
    setTimeAlertDismissed(null);
  };

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = questions.length - answeredCount;

  // Visual countdown progress metrics
  const progressRatio = Math.max(0, Math.min(1, timeRemaining / examDuration));
  const isPanicZone = timeRemaining <= 180; // < 3 minutes
  const isUrgentZone = timeRemaining > 180 && timeRemaining <= 600; // 3 to 10 minutes
  const isHalfTime = timeRemaining <= examDuration / 2 && timeRemaining > (examDuration / 2 - 30);

  // Time remaining per unanswered question
  const timePerQuestionRemaining = unansweredCount > 0 
    ? Math.round(timeRemaining / unansweredCount)
    : 0;
  const paceMinutes = Math.floor(timePerQuestionRemaining / 60);
  const paceSeconds = timePerQuestionRemaining % 60;

  // SVG Radial Dial Math
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressRatio * circumference);

  const getDialColor = () => {
    if (isPanicZone) return 'text-rose-500';
    if (isUrgentZone) return 'text-amber-500';
    return 'text-emerald-500';
  };

  // Calculate score if submitted
  const score = isSubmitted
    ? questions.reduce((acc, q) => acc + (userAnswers[q.id] === q.correctIndex ? 1 : 0), 0)
    : 0;
  const scorePercent = isSubmitted ? Math.round((score / questions.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Top Test Control Bar with Visual Radial & Linear Countdown */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-500 shadow-sm ${
        isPanicZone && !isSubmitted
          ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 shadow-rose-500/10'
          : isUrgentZone && !isSubmitted
          ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      }`}>
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Quitter vers le tableau de bord"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Simulation Concours BCC
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {questions.length} questions
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Épreuve Informaticien Data Analyste
              </h2>
            </div>
          </div>

          {/* Visual Circular Dial + Countdown Metrics */}
          <div className="flex items-center gap-5">
            
            {/* Visual Circular Countdown Gauge */}
            {!isSubmitted && (
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 70 70">
                    <circle
                      cx="35"
                      cy="35"
                      r={radius}
                      className="stroke-slate-200 dark:stroke-slate-800"
                      strokeWidth="5"
                      fill="transparent"
                    />
                    <circle
                      cx="35"
                      cy="35"
                      r={radius}
                      className={`${getDialColor()} transition-all duration-1000 ease-linear`}
                      strokeWidth="5"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <Clock className={`w-4 h-4 absolute ${getDialColor()} ${isPanicZone ? 'animate-bounce' : ''}`} />
                </div>

                <div>
                  <div className={`font-mono text-lg font-black tracking-tight tabular-nums flex items-baseline gap-1 ${
                    isPanicZone ? 'text-rose-600 dark:text-rose-400 animate-pulse' :
                    isUrgentZone ? 'text-amber-600 dark:text-amber-400' :
                    'text-slate-900 dark:text-white'
                  }`}>
                    <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
                    <span className="text-[10px] font-sans font-medium text-slate-400">restantes</span>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                      {paceMinutes > 0 ? `${paceMinutes}m ` : ''}{paceSeconds}s
                    </span>
                    <span>/ question non répondue</span>
                  </div>
                </div>
              </div>
            )}

            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block border-l border-slate-200 dark:border-slate-800 pl-4">
              <span className="font-bold text-slate-900 dark:text-white tabular-nums">{answeredCount}</span>/{questions.length} traitées
            </div>

            {!isSubmitted ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInstantFeedbackMode(!instantFeedbackMode)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    instantFeedbackMode
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                  title="Activer/désactiver l'explication instantanée des erreurs"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">
                    {instantFeedbackMode ? 'Corrigé Direct Activé' : 'Mode Examen Pur'}
                  </span>
                </button>

                <button
                  onClick={() => setSoundTensionEnabled(!soundTensionEnabled)}
                  aria-label="Tension sonore"
                  className={`p-2 rounded-lg border text-xs transition-colors ${
                    soundTensionEnabled
                      ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
                  }`}
                  title="Activer le son de stress (ticking dans la dernière minute)"
                >
                  <Clock className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleSubmitExam}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Terminer l'Épreuve</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRestart(25 * 60)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-semibold text-xs transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Recommencer (25 min)</span>
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Dynamic Linear Depletion Bar & Pacing Strip */}
        {!isSubmitted && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
            <div className="relative w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 rounded-full ${
                  isPanicZone ? 'bg-rose-500 animate-pulse' :
                  isUrgentZone ? 'bg-amber-500' :
                  'bg-emerald-500'
                }`}
                style={{ width: `${progressRatio * 100}%` }}
              />
              {/* Midpoint Marker */}
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-300 dark:bg-slate-600 opacity-60" title="Mi-temps" />
              {/* Critical Marker (20%) */}
              <div className="absolute top-0 bottom-0 left-[20%] w-0.5 bg-rose-400 opacity-60" title="Zone critique" />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isPanicZone ? 'bg-rose-500 animate-ping' : isUrgentZone ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {isPanicZone ? 'Zone de Pression Maximale · Finalisez vos choix' :
                   isUrgentZone ? 'Phase Accélérée · Plus que quelques minutes' :
                   'Gestion du Temps Nominale · Gardez le rythme'}
                </span>
              </div>

              {/* Quick Duration Preset Selector during exam */}
              <div className="hidden md:flex items-center gap-1 text-[10px]">
                <span className="text-slate-400 mr-1">Changer de mode :</span>
                <button
                  onClick={() => handleRestart(25 * 60)}
                  className={`px-2 py-0.5 rounded transition-colors ${examDuration === 25 * 60 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  Standard (25m)
                </button>
                <button
                  onClick={() => handleRestart(15 * 60)}
                  className={`px-2 py-0.5 rounded transition-colors ${examDuration === 15 * 60 ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  Intense (15m)
                </button>
                <button
                  onClick={() => handleRestart(8 * 60)}
                  className={`px-2 py-0.5 rounded transition-colors ${examDuration === 8 * 60 ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  Extrême (8m)
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Critical Pressure Alert Notification Banner */}
      {!isSubmitted && isPanicZone && timeAlertDismissed !== 'panic' && (
        <div className="p-3.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-100 flex items-center justify-between text-xs animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 animate-bounce" />
            <span>
              <strong>Alerte Chronomètre BCC :</strong> Il vous reste moins de 3 minutes ({String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}). Remplissez toutes les questions en attente pour ne perdre aucun point d'omission.
            </span>
          </div>
          <button
            onClick={() => setTimeAlertDismissed('panic')}
            className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 hover:underline shrink-0 ml-3"
          >
            Compris
          </button>
        </div>
      )}

      {/* Post-Exam Score Summary Card */}
      {isSubmitted && (
        <div className="p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-white dark:bg-slate-900 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Résultats Officiels Calibrés Concours BCC</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                Score : {score} / {questions.length} ({scorePercent}%)
              </h3>
            </div>
            
            <div className="text-right">
              <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                scorePercent >= 80 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                scorePercent >= 65 ? 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300' :
                'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
              }`}>
                {scorePercent >= 80 ? 'Rang 1 / Sélectionné(e)' : scorePercent >= 65 ? 'Admissible' : 'À Intensifier'}
              </span>
              <p className="text-xs text-slate-500 mt-1">
                Seuil habituel de sélection BCC : ≥ 75%
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Consultez ci-dessous le corrigé détaillé question par question avec les explications méthodologiques, 
            les formules clés et l'application concrète dans le travail d'un Data Analyst à la Banque Centrale du Congo.
          </p>
        </div>
      )}

      {/* Question Review Grid / Navigator */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2.5">
          <span className="font-semibold">Grille de Navigation de l'Épreuve</span>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" /> Répondu</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Marqué</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" /> En attente</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const isAnswered = userAnswers[q.id] !== undefined;
            const isFlagged = flaggedQuestions[q.id];
            const isCurrent = idx === currentIndex;
            const isCorrect = isSubmitted && userAnswers[q.id] === q.correctIndex;
            const isWrong = isSubmitted && isAnswered && !isCorrect;

            let buttonClass = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
            if (isSubmitted) {
              if (isCorrect) buttonClass = 'bg-emerald-600 text-white border-emerald-600';
              else if (isWrong) buttonClass = 'bg-rose-600 text-white border-rose-600';
              else buttonClass = 'bg-slate-200 dark:bg-slate-700 text-slate-500';
            } else {
              if (isCurrent) buttonClass = 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 font-bold text-emerald-900 dark:text-emerald-200 border-emerald-400';
              else if (isFlagged) buttonClass = 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200';
              else if (isAnswered) buttonClass = 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900';
            }

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-mono font-medium border flex items-center justify-center transition-all ${buttonClass}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Card */}
      {currentQ && (
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          
          {/* Question Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                Question {currentIndex + 1} / {questions.length}
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                {currentQ.categoryLabel}
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-slate-400 capitalize">
                Niveau : {currentQ.difficulty}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleFlag}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                  flaggedQuestions[currentQ.id]
                    ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flaggedQuestions[currentQ.id] ? 'Marquée' : 'Marquer'}</span>
              </button>

              <button
                onClick={() => toggleBookmark(currentQ.id)}
                className={`p-1.5 rounded-lg border text-xs transition-colors ${
                  bookmarkedQuestionIds.includes(currentQ.id)
                    ? 'border-emerald-300 dark:border-emerald-700 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50'
                    : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="Sauvegarder pour réviser avant dimanche"
              >
                <Bookmark className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>

          {/* Question Title & Prompt */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              {currentQ.title}
            </h3>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {currentQ.prompt}
            </p>
          </div>

          {/* Context Data Display (Table, Code snippet, Matrix) */}
          {currentQ.contextData && (
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-4">
              {currentQ.contextData.type === 'matrix' && currentQ.contextData.matrixGrid && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <tbody>
                      {currentQ.contextData.matrixGrid.map((row, rIdx) => (
                        <tr 
                          key={rIdx} 
                          className={rIdx === 0 ? 'bg-slate-200/70 dark:bg-slate-800 font-bold' : 'border-t border-slate-200 dark:border-slate-800'}
                        >
                          {row.map((cell, cIdx) => (
                            <td 
                              key={cIdx} 
                              className={`p-2.5 font-mono ${cell.includes('[ ? ]') ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {currentQ.contextData.type === 'code' && currentQ.contextData.codeSnippet && (
                <pre className="p-3 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-slate-950 rounded-lg overflow-x-auto">
                  <code>{currentQ.contextData.codeSnippet}</code>
                </pre>
              )}
            </div>
          )}

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = userAnswers[currentQ.id] === oIdx;
              const isCorrectOption = currentQ.correctIndex === oIdx;
              const showImmediateFeedback = instantFeedbackMode && !isSubmitted && userAnswers[currentQ.id] !== undefined;

              let optionStyle = 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900';
              
              if (isSubmitted || showImmediateFeedback) {
                if (isCorrectOption) {
                  optionStyle = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-medium';
                } else if (isSelected && !isCorrectOption) {
                  optionStyle = 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100';
                } else {
                  optionStyle = 'border-slate-200 dark:border-slate-800 opacity-60';
                }
              } else if (isSelected) {
                optionStyle = 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 text-slate-900 dark:text-white font-medium ring-1 ring-emerald-600 dark:ring-emerald-500';
              }

              return (
                <div
                  key={oIdx}
                  onClick={() => handleSelectOption(oIdx)}
                  className={`p-4 rounded-xl border text-sm transition-all cursor-pointer flex items-start gap-3.5 ${optionStyle}`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono ${
                    isSelected 
                      ? 'border-emerald-600 bg-emerald-600 text-white' 
                      : 'border-slate-300 dark:border-slate-600 text-slate-500'
                  }`}>
                    {String.fromCharCode(65 + oIdx)}
                  </div>
                  <div className="flex-1 leading-relaxed">
                    {opt}
                  </div>
                  {(isSubmitted || showImmediateFeedback) && isCorrectOption && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  {(isSubmitted || showImmediateFeedback) && isSelected && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Immediate In-Flight Feedback Box for Learning Mode */}
          {instantFeedbackMode && !isSubmitted && userAnswers[currentQ.id] !== undefined && (
            <div className={`p-5 rounded-xl border space-y-3.5 transition-all animate-in fade-in slide-in-from-top-1 ${
              userAnswers[currentQ.id] === currentQ.correctIndex
                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                : 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 text-rose-950 dark:text-rose-100'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                  {userAnswers[currentQ.id] === currentQ.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-800 dark:text-emerald-300">Bonne Réponse Validée · Notions Maîtrisées</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      <span className="text-rose-800 dark:text-rose-400 font-bold">Analyse de l'Erreur : Mauvaise Réponse Détectée</span>
                    </>
                  )}
                </div>

                {userAnswers[currentQ.id] !== currentQ.correctIndex && (
                  <button
                    onClick={() => {
                      const nextAnswers = { ...userAnswers };
                      delete nextAnswers[currentQ.id];
                      setUserAnswers(nextAnswers);
                    }}
                    className="text-xs font-semibold text-rose-700 dark:text-rose-300 hover:underline flex items-center gap-1 bg-white/70 dark:bg-slate-900/70 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-800"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Réessayer cette question</span>
                  </button>
                )}
              </div>

              {/* Explicit mistake comparison */}
              {userAnswers[currentQ.id] !== currentQ.correctIndex && (
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 text-xs space-y-1.5 shadow-xs">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-rose-700 dark:text-rose-400">Votre choix (Incorrect) :</span>
                    <span className="line-through text-slate-600 dark:text-slate-400">
                      {currentQ.options[userAnswers[currentQ.id]]}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">Réponse exacte attendue :</span>
                    <span className="font-semibold text-emerald-900 dark:text-emerald-200">
                      {currentQ.options[currentQ.correctIndex]}
                    </span>
                  </div>
                </div>
              )}

              <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                {currentQ.explanation.summary}
              </p>

              <div className="space-y-1.5 text-xs pl-3 border-l-2 border-emerald-500 text-slate-700 dark:text-slate-300">
                {currentQ.explanation.steps.map((step, sIdx) => (
                  <p key={sIdx}>{step}</p>
                ))}
              </div>

              <div className="pt-2 text-xs space-y-1 text-slate-600 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800/80">
                <p>
                  <strong className="text-emerald-700 dark:text-emerald-400">Application Réelle BCC :</strong>{' '}
                  {currentQ.explanation.bccRelevance}
                </p>
                <p>
                  <strong className="text-amber-700 dark:text-amber-400">Conseil Spécial Dimanche :</strong>{' '}
                  {currentQ.explanation.proTip}
                </p>
              </div>
            </div>
          )}

          {/* Detailed Step-by-Step Explanation when Exam is Submitted */}
          {isSubmitted && (
            <div className="p-5 rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>Corrigé Détaillé & Rigueur Méthodologique BCC</span>
              </div>

              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {currentQ.explanation.summary}
              </p>

              <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pl-4 border-l-2 border-emerald-500">
                {currentQ.explanation.steps.map((step, sIdx) => (
                  <p key={sIdx}>{step}</p>
                ))}
              </div>

              <div className="pt-2 text-xs space-y-1 text-slate-600 dark:text-slate-400">
                <p>
                  <strong className="text-emerald-700 dark:text-emerald-400">Impact Quotidien BCC :</strong>{' '}
                  {currentQ.explanation.bccRelevance}
                </p>
                <p>
                  <strong className="text-amber-700 dark:text-amber-400">Conseil pour Dimanche :</strong>{' '}
                  {currentQ.explanation.proTip}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Question Précédente</span>
            </button>

            <button
              onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={currentIndex === questions.length - 1}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span>Question Suivante</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
