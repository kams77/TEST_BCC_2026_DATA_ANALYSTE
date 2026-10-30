import React, { useState } from 'react';
import { X, RotateCcw, CheckCircle2, HelpCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { QUESTION_BANK } from '../data/questions';
import { useProgress } from '../context/ProgressContext';

export const MistakesReviewModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { incorrectQuestions, recordAnswer } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  if (!isOpen) return null;

  const questionsToReview = QUESTION_BANK.filter(q => incorrectQuestions.includes(q.id));
  const currentQ = questionsToReview[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (revealed) return;
    setSelectedOption(idx);
    setRevealed(true);
    const isCorrect = idx === currentQ.correctIndex;
    recordAnswer(currentQ.id, idx, isCorrect, 30, currentQ.category);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setRevealed(false);
    setCurrentIndex(prev => Math.min(questionsToReview.length - 1, prev + 1));
  };

  const handlePrev = () => {
    setSelectedOption(null);
    setRevealed(false);
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Révision Ciblée des Erreurs
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {questionsToReview.length > 0 
                  ? `${questionsToReview.length} questions à retravailler pour sécuriser des points ce dimanche`
                  : 'Aucune erreur enregistrée pour l\'instant !'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {questionsToReview.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Toutes vos erreurs ont été corrigées !
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Lancez un nouveau simulateur d'examen officiel pour tester votre endurance sur de nouvelles questions.
              </p>
            </div>
          ) : currentQ && (
            <div className="space-y-5">
              
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Question {currentIndex + 1} sur {questionsToReview.length}</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{currentQ.categoryLabel}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {currentQ.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {currentQ.prompt}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = currentQ.correctIndex === idx;

                  let style = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300';
                  if (revealed) {
                    if (isCorrect) style = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-semibold';
                    else if (isSelected && !isCorrect) style = 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100';
                    else style = 'border-slate-200 dark:border-slate-800 opacity-50';
                  }

                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-3.5 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${style}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-mono text-xs">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Corrigé immédiat si révélé */}
              {revealed && (
                <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                    <HelpCircle className="w-4 h-4" />
                    <span>Rappel Méthodologique</span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">
                    {currentQ.explanation.summary}
                  </p>
                  <div className="text-slate-600 dark:text-slate-400 space-y-1 pl-3 border-l border-emerald-400">
                    {currentQ.explanation.steps.map((st, i) => (
                      <p key={i}>{st}</p>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {questionsToReview.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Précédente</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === questionsToReview.length - 1}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 disabled:opacity-40"
            >
              <span>Suivante</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
