import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Code, 
  Table, 
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Filter,
  Check,
  ChevronDown
} from 'lucide-react';
import { SQL_CHALLENGES } from '../data/sqlChallenges';
import { SQLChallenge } from '../types';

type CategoryFilter = 'all' | 'dsp' | 'dsif' | 'drs' | 'marches' | 'dsi';

export const SqlLab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedChallenge, setSelectedChallenge] = useState<SQLChallenge>(SQL_CHALLENGES[0]);
  const [userQuery, setUserQuery] = useState<string>(SQL_CHALLENGES[0].initialCode);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [solvedChallenges, setSolvedChallenges] = useState<Set<string>>(new Set());
  const [executionResult, setExecutionResult] = useState<{
    ran: boolean;
    passed: boolean;
    message: string;
    rows?: any[];
  } | null>(null);

  // Filter challenges based on department category
  const filteredChallenges = useMemo(() => {
    if (selectedCategory === 'all') return SQL_CHALLENGES;
    if (selectedCategory === 'dsp') {
      return SQL_CHALLENGES.filter(c => 
        c.department.toLowerCase().includes('systèmes de paiement') || 
        c.department.toLowerCase().includes('switch') ||
        c.department.toLowerCase().includes('monétique') ||
        c.department.toLowerCase().includes('cenaref')
      );
    }
    if (selectedCategory === 'dsif') {
      return SQL_CHALLENGES.filter(c => 
        c.department.toLowerCase().includes('surveillance des intermédiaires financiers') || 
        c.department.toLowerCase().includes('dsif')
      );
    }
    if (selectedCategory === 'drs') {
      return SQL_CHALLENGES.filter(c => 
        c.department.toLowerCase().includes('recherche') || 
        c.department.toLowerCase().includes('statistiques') ||
        c.department.toLowerCase().includes('drs')
      );
    }
    if (selectedCategory === 'marches') {
      return SQL_CHALLENGES.filter(c => 
        c.department.toLowerCase().includes('marchés') || 
        c.department.toLowerCase().includes('trésorerie') ||
        c.department.toLowerCase().includes('cpm')
      );
    }
    if (selectedCategory === 'dsi') {
      return SQL_CHALLENGES.filter(c => 
        c.department.toLowerCase().includes('systèmes d\'information') || 
        c.department.toLowerCase().includes('dsi') ||
        c.department.toLowerCase().includes('sécurité')
      );
    }
    return SQL_CHALLENGES;
  }, [selectedCategory]);

  const currentIndex = SQL_CHALLENGES.findIndex(c => c.id === selectedChallenge.id);

  const handleSelectChallenge = (chal: SQLChallenge) => {
    setSelectedChallenge(chal);
    setUserQuery(chal.initialCode);
    setShowSolution(false);
    setShowHint(false);
    setExecutionResult(null);
  };

  const handleNextChallenge = () => {
    if (currentIndex < SQL_CHALLENGES.length - 1) {
      handleSelectChallenge(SQL_CHALLENGES[currentIndex + 1]);
    }
  };

  const handlePrevChallenge = () => {
    if (currentIndex > 0) {
      handleSelectChallenge(SQL_CHALLENGES[currentIndex - 1]);
    }
  };

  const handleRunQuery = () => {
    const res = selectedChallenge.validator(userQuery);
    setExecutionResult({
      ran: true,
      passed: res.passed,
      message: res.message,
      rows: res.rows
    });

    if (res.passed) {
      setSolvedChallenges(prev => new Set([...prev, selectedChallenge.id]));
    }
  };

  const handleResetCode = () => {
    setUserQuery(selectedChallenge.initialCode);
    setExecutionResult(null);
    setShowSolution(false);
  };

  const handleLoadSolution = () => {
    setUserQuery(selectedChallenge.solutionQuery);
    setShowSolution(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">
            <Database className="w-4 h-4" />
            <span>Laboratoire SQL Haute Rigueur BCC · 26 Exercices Réels</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Surveillance RTGS / ATS, Ratios Bâle II & Modélisation Monétaire
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pratiquez sur les tables relationnelles exactes utilisées par la DSIF, la DSP, la DRS et la Direction Informatique de la BCC.
          </p>
        </div>

        {/* Global Progress Badge */}
        <div className="flex items-center gap-3 self-start md:self-center shrink-0">
          <div className="px-4 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Résolus : {solvedChallenges.size} / {SQL_CHALLENGES.length}</span>
          </div>
        </div>
      </div>

      {/* Department Filter Bar & Quick Navigation */}
      <div className="space-y-3">
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Tous les Exercices ({SQL_CHALLENGES.length})
          </button>
          <button
            onClick={() => setSelectedCategory('dsp')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'dsp'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Paiements & Switch ATS (DSP / CENAREF)
          </button>
          <button
            onClick={() => setSelectedCategory('dsif')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'dsif'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Surveillance Prudentielle (DSIF / Bâle)
          </button>
          <button
            onClick={() => setSelectedCategory('drs')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'drs'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Études & Économétrie (DRS)
          </button>
          <button
            onClick={() => setSelectedCategory('marches')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'marches'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Marchés & Trésorerie
          </button>
          <button
            onClick={() => setSelectedCategory('dsi')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'dsi'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Sécurité & Audit SI (DSI)
          </button>
        </div>

        {/* Dropdown & Pager Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
              Choisir un Défi :
            </span>
            <div className="relative flex-1 min-w-0 max-w-xl">
              <select
                value={selectedChallenge.id}
                onChange={(e) => {
                  const found = SQL_CHALLENGES.find(c => c.id === e.target.value);
                  if (found) handleSelectChallenge(found);
                }}
                className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white truncate focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {filteredChallenges.map((c) => {
                  const globalIdx = SQL_CHALLENGES.findIndex(item => item.id === c.id) + 1;
                  const isDone = solvedChallenges.has(c.id);
                  return (
                    <option key={c.id} value={c.id}>
                      {isDone ? '✓ ' : ''}Défi #{globalIdx} : {c.title} ({c.department})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={handlePrevChallenge}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Précédent</span>
            </button>

            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 px-2">
              #{currentIndex + 1} / {SQL_CHALLENGES.length}
            </span>

            <button
              onClick={handleNextChallenge}
              disabled={currentIndex === SQL_CHALLENGES.length - 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <span>Suivant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Click Badges Grid (Scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {filteredChallenges.map((chal) => {
            const num = SQL_CHALLENGES.findIndex(item => item.id === chal.id) + 1;
            const isSelected = selectedChallenge.id === chal.id;
            const isSolved = solvedChallenges.has(chal.id);
            return (
              <button
                key={chal.id}
                onClick={() => handleSelectChallenge(chal)}
                className={`relative px-2.5 py-1 text-xs font-mono font-bold rounded-md border shrink-0 transition-all ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                    : isSolved
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                }`}
                title={`Défi #${num} : ${chal.title}`}
              >
                #{num}
                {isSolved && <span className="ml-1 text-[10px]">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Challenge Description & Execution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Challenge brief and Schema Inspector */}
        <div className="lg:col-span-1 space-y-4">
          
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                {selectedChallenge.department}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                {selectedChallenge.difficulty}
              </span>
            </div>

            <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
              Défi #{currentIndex + 1} : {selectedChallenge.title}
            </h2>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedChallenge.description}
            </p>

            <div className="p-3 rounded-lg bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40 text-xs text-slate-700 dark:text-slate-300">
              <strong className="text-teal-800 dark:text-teal-300">Enjeu Métier BCC :</strong>{' '}
              {selectedChallenge.businessContext}
            </div>
          </div>

          {/* Table Schema Viewer */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              <Table className="w-4 h-4 text-teal-600" />
              <span>Schéma Relationnel & Échantillon</span>
            </div>

            {selectedChallenge.schemaTables.map(tbl => (
              <div key={tbl.name} className="space-y-2">
                <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400">
                  TABLE {tbl.name}
                </span>

                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                      <tr>
                        <th className="p-2">Champ</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                      {tbl.columns.map(col => (
                        <tr key={col.name}>
                          <td className="p-2 text-teal-600 dark:text-teal-400 font-semibold">{col.name}</td>
                          <td className="p-2 text-slate-400 text-[11px]">{col.type}</td>
                          <td className="p-2 text-slate-500 dark:text-slate-400 font-sans">{col.comment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Sample Rows Preview */}
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[11px] font-mono overflow-x-auto space-y-1">
                  <span className="text-slate-400 block font-sans text-[10px] font-bold">Échantillon de données :</span>
                  {tbl.sampleData.slice(0, 3).map((row, rIdx) => (
                    <div key={rIdx} className="text-slate-600 dark:text-slate-300 truncate">
                      {JSON.stringify(row)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right: SQL Editor & Execution Console */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
            
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Éditeur de Requête SQL
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Masquer l\'Indice' : 'Indice'}</span>
                </button>

                <button
                  onClick={handleResetCode}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
                  title="Réinitialiser le code de départ"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={handleLoadSolution}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Solution BCC</span>
                </button>
              </div>
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                <strong>Conseil d'optimisation :</strong> {selectedChallenge.hint}
              </div>
            )}

            {/* Code Input Area */}
            <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
              <textarea
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                rows={11}
                className="w-full p-4 font-mono text-xs sm:text-sm text-emerald-400 bg-transparent focus:outline-none resize-y leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Run Action */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Syntaxe attendue : ANSI SQL / PostgreSQL 15+ (Finacle & ATS Engine)
              </span>

              <button
                onClick={handleRunQuery}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-transform hover:scale-[1.02]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Exécuter la Requête</span>
              </button>
            </div>

          </div>

          {/* Query Output Result Panel */}
          {executionResult && (
            <div className={`p-5 rounded-xl border ${
              executionResult.passed 
                ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'
            } space-y-3`}>
              
              <div className="flex items-center gap-2 font-bold text-sm">
                {executionResult.passed ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Succès de Validation · Données Conformes</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>Résultat Incomplet ou Erreur de Requête</span>
                  </>
                )}
              </div>

              <p className="text-xs leading-relaxed">
                {executionResult.message}
              </p>

              {/* Result Table Preview */}
              {executionResult.rows && executionResult.rows.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 mt-2">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-emerald-100/60 dark:bg-emerald-950 text-slate-800 dark:text-slate-200 font-bold">
                      <tr>
                        {Object.keys(executionResult.rows[0]).map(key => (
                          <th key={key} className="p-2 font-mono">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-slate-700 dark:text-slate-300">
                      {executionResult.rows.map((r, rIdx) => (
                        <tr key={rIdx}>
                          {Object.values(r).map((val: any, cIdx) => (
                            <td key={cIdx} className="p-2">{String(val)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* In-depth error diagnosis when failed */}
              {!executionResult.passed && (
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 space-y-2 text-xs text-rose-950 dark:text-rose-200">
                  <div className="font-bold flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
                    <Lightbulb className="w-4 h-4" />
                    <span>Analyse de l'Erreur & Conseil Pédagogique :</span>
                  </div>
                  <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                    {selectedChallenge.hint}
                  </p>
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={handleLoadSolution}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                    >
                      Afficher la Solution Corrigée
                    </button>
                    <span className="text-[11px] text-slate-500">
                      Cliquez pour charger la requête de référence et comparer avec votre essai.
                    </span>
                  </div>
                </div>
              )}

              {/* Solution breakdown if passed */}
              {executionResult.passed && (
                <div className="pt-2 text-xs text-slate-600 dark:text-slate-300 border-t border-emerald-200 dark:border-emerald-800/60">
                  <strong className="text-emerald-700 dark:text-emerald-400">Explication Technique BCC :</strong>{' '}
                  {selectedChallenge.explanation}
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
