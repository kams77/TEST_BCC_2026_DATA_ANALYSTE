import React, { useState } from 'react';
import { 
  Database, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Code, 
  Table, 
  Copy, 
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SQL_CHALLENGES } from '../data/sqlChallenges';
import { SQLChallenge } from '../types';

export const SqlLab: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<SQLChallenge>(SQL_CHALLENGES[0]);
  const [userQuery, setUserQuery] = useState<string>(SQL_CHALLENGES[0].initialCode);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    ran: boolean;
    passed: boolean;
    message: string;
    rows?: any[];
  } | null>(null);

  const handleSelectChallenge = (chal: SQLChallenge) => {
    setSelectedChallenge(chal);
    setUserQuery(chal.initialCode);
    setShowSolution(false);
    setShowHint(false);
    setExecutionResult(null);
  };

  const handleRunQuery = () => {
    const res = selectedChallenge.validator(userQuery);
    setExecutionResult({
      ran: true,
      passed: res.passed,
      message: res.message,
      rows: res.rows
    });
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
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* Header */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">
            <Database className="w-4 h-4" />
            <span>Laboratoire Pratique SQL & Ingestion Bancaire BCC</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Requêtes sur Flux Réels ATS / RTGS & Surveillance Prudentielle
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Testez vos compétences sur les cas concrets traités par l'équipe Data de la Banque Centrale du Congo.
          </p>
        </div>

        {/* Challenge Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {SQL_CHALLENGES.map((chal, idx) => (
            <button
              key={chal.id}
              onClick={() => handleSelectChallenge(chal)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border whitespace-nowrap transition-colors ${
                selectedChallenge.id === chal.id
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              Défi #{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge Description & Context */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Challenge brief and Schema Inspector */}
        <div className="lg:col-span-1 space-y-4">
          
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              {selectedChallenge.department}
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {selectedChallenge.title}
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
                          <td className="p-2 font-bold text-slate-900 dark:text-slate-200">{col.name}</td>
                          <td className="p-2 text-teal-600 dark:text-teal-400">{col.type}</td>
                          <td className="p-2 font-sans text-slate-500">{col.comment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-xs text-slate-400 italic">
                  {tbl.sampleData.length} lignes d'exemple simulées en mémoire.
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right: Interactive SQL Editor and Runner */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Code className="w-4 h-4 text-teal-600" />
                <span>Console SQL PostgreSQL (Standard BCC DIT)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 flex items-center gap-1 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Masquer Indice' : 'Indice'}</span>
                </button>

                <button
                  onClick={handleLoadSolution}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Voir Solution Modèle
                </button>

                <button
                  onClick={handleResetCode}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  title="Réinitialiser le code"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Hint Callout */}
            {showHint && (
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                <strong>Conseil d'optimisation :</strong> {selectedChallenge.hint}
              </div>
            )}

            {/* Code Input Area */}
            <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
              <textarea
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                rows={10}
                className="w-full p-4 font-mono text-xs sm:text-sm text-emerald-400 bg-transparent focus:outline-none resize-y leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Run Action */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Syntaxe attendue : ANSI SQL / PostgreSQL 15+
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
                    <span>Succès de Validation</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>Résultat Incomplet ou Erreur de Syntaxe</span>
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
                      Cliquez pour insérer la requête modèle et comprendre le raisonnement.
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
