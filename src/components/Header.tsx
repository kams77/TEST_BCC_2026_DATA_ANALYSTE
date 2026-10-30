import React from 'react';
import { Sun, Moon, Sparkles, BookOpen } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

interface HeaderProps {
  activeTab: 'dashboard' | 'exam' | 'sql' | 'scenarios' | 'sprint' | 'telecom';
  setActiveTab: (tab: 'dashboard' | 'exam' | 'sql' | 'scenarios' | 'sprint' | 'telecom') => void;
  openCheatSheet: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, openCheatSheet }) => {
  const { theme, toggleTheme, globalReadinessScore } = useProgress();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 text-left focus:outline-none group shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm group-hover:scale-105 transition-transform">
            BCC
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            Banque Centrale du Congo
          </span>
        </button>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`whitespace-nowrap transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 ${
              activeTab === 'dashboard' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            Tableau de Bord
          </button>
          <button
            onClick={() => setActiveTab('telecom')}
            className={`whitespace-nowrap transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
              activeTab === 'telecom' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''
            }`}
          >
            Passerelle Télécom → BCC
          </button>
          <button
            onClick={() => setActiveTab('exam')}
            className={`whitespace-nowrap transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 ${
              activeTab === 'exam' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            Simulateur Concours
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`whitespace-nowrap transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 ${
              activeTab === 'sql' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            Laboratoire SQL
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`whitespace-nowrap transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 ${
              activeTab === 'scenarios' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            War Room Risques
          </button>
          <button
            onClick={() => setActiveTab('sprint')}
            className={`whitespace-nowrap transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 ${
              activeTab === 'sprint' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            Sprint Éclair
          </button>
        </nav>

        {/* Zone 3: 1 primary action + theme toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={openCheatSheet}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
            title="Consulter les formules indispensables pour le test de dimanche"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Mémento Dimanche</span>
          </button>

          <button
            onClick={() => setActiveTab('exam')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-lg shadow-sm transition-all whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simuler le Test ({globalReadinessScore}%)</span>
          </button>

          <button
            onClick={toggleTheme}
            aria-label="Changer de thème"
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
