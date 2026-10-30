import React from 'react';
import { 
  Clock, 
  Award, 
  TrendingUp, 
  AlertCircle, 
  Database, 
  ShieldAlert, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  RotateCcw,
  BarChart3,
  Cpu
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

import { Radio, ArrowUpRight, GraduationCap } from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: 'dashboard' | 'exam' | 'sql' | 'scenarios' | 'sprint' | 'telecom') => void;
  onOpenCheatSheet: () => void;
  onOpenMistakes: () => void;
  onOpenOddsModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  onNavigate, 
  onOpenCheatSheet, 
  onOpenMistakes,
  onOpenOddsModal
}) => {
  const { 
    globalReadinessScore, 
    competencyScores, 
    totalAnsweredCount, 
    totalCorrectCount, 
    overallAccuracy, 
    examSessions, 
    incorrectQuestions,
    daysUntilTest,
    hoursUntilTest,
    minutesUntilTest,
    secondsUntilTest
  } = useProgress();

  const getAdmissibilityLevel = (score: number) => {
    if (score >= 85) return { label: 'Rang 1 / Major de Promotion Visé', color: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800' };
    if (score >= 70) return { label: 'Admissible au Recrutement BCC', color: 'text-teal-600 dark:text-teal-400', badge: 'bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800' };
    if (score >= 50) return { label: 'Zone de Progression Rapide', color: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800' };
    return { label: 'Niveau Préparatoire - Intensifier', color: 'text-rose-600 dark:text-rose-400', badge: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800' };
  };

  const statusInfo = getAdmissibilityLevel(globalReadinessScore);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero Section with Official BCC Visual and Countdown */}
      <section className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 text-white shadow-xl">
        <div className="absolute inset-0">
          <img 
            src="/src/assets/images/bcc_central_bank_headquarters_1793346413890.jpg" 
            alt="Siège de la Banque Centrale du Congo à Kinshasa"
            className="w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">
            <span>Concours National de Recrutement</span>
            <span>·</span>
            <span>Informaticien Data Analyste</span>
            <span>·</span>
            <span>Direction de l'Informatique & DSIF</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-4 text-balance">
            Préparez-vous à être le candidat sélectionné à la Banque Centrale du Congo.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            Environnement d'entraînement intensif calibré sur les épreuves réelles de ce dimanche : 
            tests psychotechniques, requêtes SQL sur flux RTGS/ATS, modélisation économétrique de l'inflation à Kinshasa et stress tests prudentiels pour le CPM.
          </p>

          {/* Countdown & Quick Action Strip */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs font-medium text-slate-200">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Test officiel :</span>
              <span className="font-mono font-bold text-amber-300 tabular-nums">
                {daysUntilTest}j {hoursUntilTest}h {minutesUntilTest}m {secondsUntilTest}s
              </span>
            </div>

            <button
              onClick={() => onNavigate('exam')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-transform hover:scale-[1.02] shadow-md"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Lancer Simulation Complète</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenOddsModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-transform hover:scale-[1.02]"
              title="Calculer mes chances réelles d'être retenu"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Calculer Mes Chances</span>
            </button>

            <button
              onClick={() => onNavigate('telecom')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Radio className="w-4 h-4" />
              <span>Passerelle Télécom → BCC</span>
            </button>

            <button
              onClick={onOpenCheatSheet}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Fiches Express Dimanche</span>
            </button>
          </div>
        </div>
      </section>

      {/* Tailored Telecom Candidate Callout Banner */}
      <section className="p-4 sm:p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/90 via-slate-50 to-white dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <Radio className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                Profil Adapté Spécifique
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Informaticien IT & Assistant Data Analyst (Secteur Télécoms)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              Vous n'avez jamais travaillé en banque ? C'est votre plus grande force ! Vos compétences en <strong>flux de CDR, Mobile Money (M-Pesa / Airtel Money / Orange Money)</strong> et détection de fraudes s'appliquent directement à la surveillance des systèmes de paiement de la BCC.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('telecom')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider whitespace-nowrap shrink-0 shadow-sm transition-transform hover:scale-105"
        >
          <span>Ouvrir l'Accélérateur Passerelle</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* Primary KPI Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Readiness Score */}
        <div 
          onClick={onOpenOddsModal}
          className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between cursor-pointer hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-medium group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Score d'Admissibilité BCC
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
              <span>Chances ↗</span>
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {globalReadinessScore}%
              </span>
              <span className="text-xs font-medium text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-emerald-600 dark:bg-emerald-500 h-full transition-all duration-700 rounded-full"
                style={{ width: `${globalReadinessScore}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className={`text-xs font-semibold ${statusInfo.color}`}>
              {statusInfo.label}
            </p>
            <span className="text-[10px] text-slate-400 group-hover:text-amber-500 font-medium transition-colors">
              Calculer rang & odds
            </span>
          </div>
        </div>

        {/* Card 2: Accuracy */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-medium">Taux de Réussite Global</span>
            <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {overallAccuracy}%
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">{totalCorrectCount}</span> bonnes réponses sur{' '}
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">{totalAnsweredCount}</span> traitées
            </div>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Objectif concours : ≥ 80%</span>
          </div>
        </div>

        {/* Card 3: Erreurs à Réviser */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-medium">Questions à Perfectionner</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {incorrectQuestions.length}
              </span>
              <span className="text-xs text-slate-500">en réserve</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Les erreurs constituent votre plus grand levier de points pour dimanche.
            </p>
          </div>
          <button
            onClick={onOpenMistakes}
            disabled={incorrectQuestions.length === 0}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 mt-3 disabled:opacity-50 disabled:no-underline"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Refaire mes erreurs ciblées</span>
          </button>
        </div>

        {/* Card 4: Simulations Officielles Complétées */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-medium">Examens Blancs Effectués</span>
            <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {examSessions.length}
              </span>
              <span className="text-xs text-slate-500">sessions</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Chaque session simule le stress, le barème et le temps réel du test BCC.
            </p>
          </div>
          <button
            onClick={() => onNavigate('exam')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 mt-3"
          >
            <span>Démarrer un nouvel examen</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </section>

      {/* 4 Interactive Modes Selection Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Modules d'Entraînement Haute Intensité
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sélectionnez votre atelier de travail pour aujourd'hui
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
          
          {/* Mode 1 */}
          <div 
            onClick={() => onNavigate('exam')}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Simulateur Concours
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Épreuve chronométrée avec corrigé direct ou examen officiel pur.
              </p>
            </div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Conditions réelles</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Mode Débutant / Premier Emploi */}
          <div 
            onClick={() => onNavigate('exam')}
            className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/70 bg-gradient-to-b from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Psychotech Débutant
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Sans expérience requise : dominos, syllogismes, partages et éthique BCC.
              </p>
            </div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Premier Emploi</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Mode 2 */}
          <div 
            onClick={() => onNavigate('sql')}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-500 dark:hover:border-teal-500 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Laboratoire SQL (6 défis)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Fractionnement RTGS, cantonnement EME, LAG() et NPL sectoriels.
              </p>
            </div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-teal-600 dark:text-teal-400 pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Éditeur interactif</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Mode 3 */}
          <div 
            onClick={() => onNavigate('scenarios')}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-500 dark:hover:border-amber-500 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                War Room : Risques CPM
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Choc cours du cuivre, dépréciation CDF, panique LCR et doctrine Bagehot.
              </p>
            </div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-amber-600 dark:text-amber-400 pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Études de cas réelles</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Mode 4 */}
          <div 
            onClick={() => onNavigate('sprint')}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-500 dark:hover:border-sky-500 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                Sprint Éclair (30s)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Drill ultra-rapide de 30s : réflexes de calcul mental et logique pure.
              </p>
            </div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-sky-600 dark:text-sky-400 pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Réflexes d'élite</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* Detailed Competency Radar Breakdown */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Diagnostic Détaillé des 6 Piliers Métier BCC
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Surveillance continue de votre niveau d'admissibilité par domaine technique
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
            Mise à jour en temps réel
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {competencyScores.map(comp => (
            <div 
              key={comp.category}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate pr-2">
                  {comp.categoryLabel}
                </span>
                <span className={`text-xs font-bold tabular-nums ${
                  comp.scorePercent >= 75 ? 'text-emerald-600 dark:text-emerald-400' :
                  comp.scorePercent >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {comp.scorePercent}%
                </span>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    comp.scorePercent >= 75 ? 'bg-emerald-500' :
                    comp.scorePercent >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.max(5, comp.scorePercent)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{comp.correctCount} / {comp.totalAttempted} réussies</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">Statut : {comp.status}</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 italic pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                {comp.recommendation}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Action Plan for Sunday 01 */}
      <section className="p-6 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-4">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
          <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Feuille de Route Stratégique pour Dépasser les Autres Candidats Dimanche</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700 dark:text-slate-300">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white">1. Psychotechnique & Vitesse</span>
            <p>
              Pratiquez les suites de matrices de Raven et le calcul mental de change (formule (E0 - Et)/Et) sans calculatrice. Visez moins de 35s par item.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white">2. SQL Analytique Bancaire</span>
            <p>
              Maîtrisez impérativement <code className="font-mono text-emerald-700 dark:text-emerald-400">SUM() OVER(PARTITION BY...)</code>, <code className="font-mono text-emerald-700 dark:text-emerald-400">DENSE_RANK()</code> et les clauses HAVING pour les alertes AML/CENAREF.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white">3. Risques & Politiques BCC</span>
            <p>
              Retenez les seuils Bâle III : LCR ≥ 100%, Solvabilité ≥ 10%, réserves de change ≥ 6 semaines et doctrine de Bagehot en cas de crise de liquidité.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
