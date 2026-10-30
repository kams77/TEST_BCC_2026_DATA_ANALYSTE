/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProgressProvider } from './context/ProgressContext';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ExamSimulator } from './components/ExamSimulator';
import { SqlLab } from './components/SqlLab';
import { RiskWarRoom } from './components/RiskWarRoom';
import { SprintTrainer } from './components/SprintTrainer';
import { CheatSheetModal } from './components/CheatSheetModal';
import { MistakesReviewModal } from './components/MistakesReviewModal';

import { TelecomBridge } from './components/TelecomBridge';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'exam' | 'sql' | 'scenarios' | 'sprint' | 'telecom'>('dashboard');
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [isMistakesOpen, setIsMistakesOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openCheatSheet={() => setIsCheatSheetOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
            onOpenMistakes={() => setIsMistakesOpen(true)}
          />
        )}

        {activeTab === 'telecom' && (
          <TelecomBridge />
        )}

        {activeTab === 'exam' && (
          <ExamSimulator onBackToDashboard={() => setActiveTab('dashboard')} />
        )}

        {activeTab === 'sql' && (
          <SqlLab />
        )}

        {activeTab === 'scenarios' && (
          <RiskWarRoom />
        )}

        {activeTab === 'sprint' && (
          <SprintTrainer onBackToDashboard={() => setActiveTab('dashboard')} />
        )}
      </main>

      {/* Global Modals */}
      <CheatSheetModal
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
      />

      <MistakesReviewModal
        isOpen={isMistakesOpen}
        onClose={() => setIsMistakesOpen(false)}
      />

      {/* Quiet Institutional Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">BCC Data Analyst Prep</span>
            <span>·</span>
            <span>Plateforme Spéciale Concours Dimanche 01</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsCheatSheetOpen(true)}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Mémento Formules
            </button>
            <button
              onClick={() => setIsMistakesOpen(true)}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Révision Erreurs
            </button>
            <span>Kinshasa, République Démocratique du Congo</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <MainApp />
    </ProgressProvider>
  );
}
