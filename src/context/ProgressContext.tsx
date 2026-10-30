import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Category, UserAnswerRecord, ExamSession, CompetencyScore } from '../types';
import { QUESTION_BANK } from '../data/questions';

interface ProgressContextType {
  answers: UserAnswerRecord[];
  examSessions: ExamSession[];
  bookmarkedQuestionIds: string[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  recordAnswer: (questionId: string, selectedIndex: number, isCorrect: boolean, timeSpent: number, category: Category) => void;
  recordExamSession: (session: Omit<ExamSession, 'id' | 'timestamp'>) => void;
  toggleBookmark: (questionId: string) => void;
  resetProgress: () => void;
  competencyScores: CompetencyScore[];
  globalReadinessScore: number;
  totalAnsweredCount: number;
  totalCorrectCount: number;
  overallAccuracy: number;
  incorrectQuestions: string[];
  daysUntilTest: number;
  hoursUntilTest: number;
  minutesUntilTest: number;
  secondsUntilTest: number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const STORAGE_KEY_ANSWERS = 'bcc_data_analyst_answers_v1';
const STORAGE_KEY_SESSIONS = 'bcc_data_analyst_sessions_v1';
const STORAGE_KEY_BOOKMARKS = 'bcc_data_analyst_bookmarks_v1';
const STORAGE_KEY_THEME = 'bcc_data_analyst_theme_v1';

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [answers, setAnswers] = useState<UserAnswerRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ANSWERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Seed initial demo data showing some prior practice
    return [
      { questionId: 'psy_log_01', selectedOptionIndex: 0, isCorrect: true, timeSpentSeconds: 38, timestamp: Date.now() - 3600000, category: 'psychotech_logic' },
      { questionId: 'psy_num_01', selectedOptionIndex: 1, isCorrect: true, timeSpentSeconds: 42, timestamp: Date.now() - 3200000, category: 'psychotech_numerical' },
      { questionId: 'sql_data_01', selectedOptionIndex: 0, isCorrect: true, timeSpentSeconds: 55, timestamp: Date.now() - 2800000, category: 'sql_data_analysis' },
      { questionId: 'risk_prud_01', selectedOptionIndex: 0, isCorrect: true, timeSpentSeconds: 49, timestamp: Date.now() - 2400000, category: 'bank_risk_prudential' },
      { questionId: 'cpm_rep_01', selectedOptionIndex: 0, isCorrect: true, timeSpentSeconds: 41, timestamp: Date.now() - 1800000, category: 'monetary_reporting_cpm' }
    ];
  });

  const [examSessions, setExamSessions] = useState<ExamSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'session_init',
        timestamp: Date.now() - 86400000,
        totalQuestions: 10,
        score: 8,
        accuracy: 80,
        totalTimeSeconds: 480,
        completed: true,
        categoryBreakdown: {
          psychotech_logic: { total: 2, correct: 2 },
          psychotech_numerical: { total: 2, correct: 1 },
          sql_data_analysis: { total: 2, correct: 2 },
          python_econometrics: { total: 1, correct: 1 },
          bank_risk_prudential: { total: 2, correct: 1 },
          monetary_reporting_cpm: { total: 1, correct: 1 }
        }
      }
    ];
  });

  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return ['psy_num_01', 'sql_data_02'];
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {
      console.error(e);
    }
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(examSessions));
  }, [examSessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarkedQuestionIds));
  }, [bookmarkedQuestionIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const recordAnswer = (questionId: string, selectedIndex: number, isCorrect: boolean, timeSpent: number, category: Category) => {
    const record: UserAnswerRecord = {
      questionId,
      selectedOptionIndex: selectedIndex,
      isCorrect,
      timeSpentSeconds: timeSpent,
      timestamp: Date.now(),
      category
    };
    setAnswers(prev => [record, ...prev]);
  };

  const recordExamSession = (sessionData: Omit<ExamSession, 'id' | 'timestamp'>) => {
    const newSession: ExamSession = {
      ...sessionData,
      id: `session_${Date.now()}`,
      timestamp: Date.now()
    };
    setExamSessions(prev => [newSession, ...prev]);
  };

  const toggleBookmark = (questionId: string) => {
    setBookmarkedQuestionIds(prev =>
      prev.includes(questionId) ? prev.filter(id => id !== questionId) : [...prev, questionId]
    );
  };

  const resetProgress = () => {
    setAnswers([]);
    setExamSessions([]);
    setBookmarkedQuestionIds([]);
    localStorage.removeItem(STORAGE_KEY_ANSWERS);
    localStorage.removeItem(STORAGE_KEY_SESSIONS);
    localStorage.removeItem(STORAGE_KEY_BOOKMARKS);
  };

  // Competency breakdown
  const competencyScores = useMemo<CompetencyScore[]>(() => {
    const categoryLabels: Record<Category, string> = {
      psychotech_entry_level: 'Psychotechnique Débutant (Premier Emploi)',
      psychotech_logic: 'Logique & Matrices Abstraites',
      psychotech_numerical: 'Calcul Numérique & Taux de Change',
      sql_data_analysis: 'SQL & Manipulation Données Bancaires',
      python_econometrics: 'Python & Modélisation Économétrique',
      bank_risk_prudential: 'Risques Prudentiels & Normes Bâle (BCC)',
      monetary_reporting_cpm: 'Reporting Décisionnel & Politique Monétaire'
    };

    const categories: Category[] = [
      'psychotech_entry_level',
      'psychotech_logic',
      'psychotech_numerical',
      'sql_data_analysis',
      'python_econometrics',
      'bank_risk_prudential',
      'monetary_reporting_cpm'
    ];

    return categories.map(cat => {
      const catAnswers = answers.filter(a => a.category === cat);
      const totalAttempted = catAnswers.length;
      const correctCount = catAnswers.filter(a => a.isCorrect).length;
      const scorePercent = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;

      let status: 'Faible' | 'Moyen' | 'Solide' | 'Maître' = 'Faible';
      let recommendation = 'Faire au moins 5 questions ciblées.';
      if (totalAttempted >= 3) {
        if (scorePercent >= 85) {
          status = 'Maître';
          recommendation = 'Excellente maîtrise. Conservez vos réflexes de rapidité.';
        } else if (scorePercent >= 70) {
          status = 'Solide';
          recommendation = 'Bon niveau. Revoir les cas particuliers et pièges fréquents.';
        } else if (scorePercent >= 50) {
          status = 'Moyen';
          recommendation = 'Attention : Consolider les formules clés avant dimanche.';
        } else {
          status = 'Faible';
          recommendation = 'Priorité absolue : Réviser le mémento et s\'entraîner en mode Sprint.';
        }
      }

      return {
        category: cat,
        categoryLabel: categoryLabels[cat],
        scorePercent,
        totalAttempted,
        correctCount,
        status,
        recommendation
      };
    });
  }, [answers]);

  // Overall Stats
  const totalAnsweredCount = answers.length;
  const totalCorrectCount = answers.filter(a => a.isCorrect).length;
  const overallAccuracy = totalAnsweredCount > 0 ? Math.round((totalCorrectCount / totalAnsweredCount) * 100) : 0;

  // Question IDs with errors for targeted review
  const incorrectQuestions = useMemo(() => {
    const errorMap = new Map<string, number>();
    answers.forEach(a => {
      if (!a.isCorrect) {
        errorMap.set(a.questionId, (errorMap.get(a.questionId) || 0) + 1);
      }
    });
    return Array.from(errorMap.keys());
  }, [answers]);

  // Global Readiness Index (0 to 100)
  const globalReadinessScore = useMemo(() => {
    if (totalAnsweredCount === 0) return 30;
    // Base on accuracy (50%), coverage (30%), and volume (20%)
    const accWeight = (overallAccuracy / 100) * 50;
    const distinctAnswered = new Set(answers.map(a => a.questionId)).size;
    const totalInBank = QUESTION_BANK.length;
    const coverageWeight = Math.min(1, distinctAnswered / totalInBank) * 30;
    const volumeBonus = Math.min(20, (totalAnsweredCount / 20) * 20);
    return Math.min(100, Math.round(accWeight + coverageWeight + volumeBonus));
  }, [answers, totalAnsweredCount, overallAccuracy]);

  // Countdown to Test (Dimanche 01)
  const [countdown, setCountdown] = useState({ days: 1, hours: 21, minutes: 14, seconds: 20 });

  useEffect(() => {
    // Current date is end of October, test is Sunday Nov 01 2026 08:00 AM Kinshasa time
    const targetDate = new Date('2026-11-01T08:00:00+01:00').getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, targetDate - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ProgressContext.Provider
      value={{
        answers,
        examSessions,
        bookmarkedQuestionIds,
        theme,
        toggleTheme,
        recordAnswer,
        recordExamSession,
        toggleBookmark,
        resetProgress,
        competencyScores,
        globalReadinessScore,
        totalAnsweredCount,
        totalCorrectCount,
        overallAccuracy,
        incorrectQuestions,
        daysUntilTest: countdown.days,
        hoursUntilTest: countdown.hours,
        minutesUntilTest: countdown.minutes,
        secondsUntilTest: countdown.seconds
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
