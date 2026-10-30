import React, { useState } from 'react';
import { 
  ShieldAlert, 
  TrendingDown, 
  Activity, 
  AlertOctagon, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight,
  Flame,
  FileSpreadsheet
} from 'lucide-react';
import { RISK_SCENARIOS } from '../data/scenarios';
import { RiskScenario } from '../types';

export const RiskWarRoom: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<RiskScenario>(RISK_SCENARIOS[0]);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [stageHistory, setStageHistory] = useState<Record<number, string>>({});
  const [telemetry, setTelemetry] = useState(RISK_SCENARIOS[0].initialTelemetry);

  const handleSelectScenario = (scen: RiskScenario) => {
    setSelectedScenario(scen);
    setCurrentStageIdx(0);
    setSelectedOptionId(null);
    setStageHistory({});
    setTelemetry(scen.initialTelemetry);
  };

  const currentStage = selectedScenario.stages[currentStageIdx];
  const chosenOption = currentStage?.options.find(o => o.id === selectedOptionId);

  const handleConfirmDecision = () => {
    if (!chosenOption) return;
    setStageHistory(prev => ({ ...prev, [currentStageIdx]: chosenOption.id }));
  };

  const handleNextStage = () => {
    if (currentStageIdx < selectedScenario.stages.length - 1) {
      setCurrentStageIdx(prev => prev + 1);
      setSelectedOptionId(null);
    }
  };

  const handleRestartScenario = () => {
    setCurrentStageIdx(0);
    setSelectedOptionId(null);
    setStageHistory({});
    setTelemetry(selectedScenario.initialTelemetry);
  };

  const isStageResolved = stageHistory[currentStageIdx] !== undefined;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* War Room Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 text-white shadow-xl">
        <div className="absolute inset-0">
          <img 
            src="/src/assets/images/bcc_data_analytics_surveillance_1793346414186.jpg" 
            alt="Salle de surveillance des risques BCC"
            className="w-full h-full object-cover opacity-25"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>War Room BCC · Salle de Crise & Reporting CPM</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
            Stress Tests Macroéconomiques & Surveillance Systémique
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Plongez dans les arbitrages réels traités par la cellule d'analyse de risques de la Banque Centrale du Congo. 
            Vos calculs et recommandations data influenceront directement les décisions du Comité de Politique Monétaire (CPM).
          </p>

          {/* Scenario Selector */}
          <div className="flex flex-wrap items-center gap-2 mt-5">
            {RISK_SCENARIOS.map((scen, idx) => (
              <button
                key={scen.id}
                onClick={() => handleSelectScenario(scen)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                  selectedScenario.id === scen.id
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                    : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Scénario #{idx + 1} : {scen.crisisType}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Financial Telemetry Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Cours CDF / USD</span>
          <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
            {telemetry.tauxChangeCDF_USD} CDF
          </div>
          <span className="text-[10px] text-rose-500 font-semibold flex items-center gap-0.5">
            <TrendingDown className="w-3 h-3" /> Pression forte
          </span>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Réserves de Change</span>
          <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
            {telemetry.reservesChangeSemaines} sem.
          </div>
          <span className="text-[10px] text-amber-500 font-semibold">
            Seuil FMI : 6.0 sem.
          </span>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Inflation Kinshasa</span>
          <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
            {telemetry.inflationGlissement}%
          </div>
          <span className="text-[10px] text-rose-500 font-semibold">
            Glissement annuel
          </span>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Taux Directeur BCC</span>
          <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
            {telemetry.tauxDirecteurBCC}%
          </div>
          <span className="text-[10px] text-emerald-500 font-semibold">
            Resserrement en cours
          </span>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Ratio LCR Moyen</span>
          <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
            {telemetry.ratioLCRSystemique}%
          </div>
          <span className="text-[10px] text-teal-500 font-semibold">
            Norme légale ≥ 100%
          </span>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Taux NPL Système</span>
          <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
            {telemetry.tauxNPL}%
          </div>
          <span className="text-[10px] text-amber-500 font-semibold">
            Créances douteuses
          </span>
        </div>
      </div>

      {/* Main Crisis Briefing and Stage Resolver */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        
        {/* Scenario Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4" />
            <span>{selectedScenario.departmentTarget}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {selectedScenario.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            {selectedScenario.briefing}
          </p>
        </div>

        {/* Current Stage */}
        {currentStage && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Étape {currentStage.stageNumber} sur {selectedScenario.stages.length}
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {currentStage.stageTitle}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {currentStage.situationReport}
            </div>

            {/* Context Data Table if present */}
            {currentStage.dataTable && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Données de Trésorerie Déclarées</span>
                </div>
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold">
                      <tr>
                        {currentStage.dataTable.headers.map((h, i) => (
                          <th key={i} className="p-2.5">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-slate-700 dark:text-slate-300">
                      {currentStage.dataTable.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-2.5">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Decision Question */}
            <div className="pt-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                {currentStage.decisionQuestion}
              </h3>

              <div className="space-y-3">
                {currentStage.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isSubmittedChoice = stageHistory[currentStageIdx] === opt.id;

                  let cardStyle = 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900';
                  if (isStageResolved) {
                    if (isSubmittedChoice) {
                      cardStyle = opt.impact.score >= 80 
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100'
                        : 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100';
                    } else {
                      cardStyle = 'border-slate-200 dark:border-slate-800 opacity-50';
                    }
                  } else if (isSelected) {
                    cardStyle = 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/30 ring-1 ring-amber-500';
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => !isStageResolved && setSelectedOptionId(opt.id)}
                      className={`p-4 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer space-y-2 ${cardStyle}`}
                    >
                      <div className="font-semibold leading-relaxed">
                        {opt.label}
                      </div>

                      {/* If stage is already resolved, show the deep consequences and feedback */}
                      {isStageResolved && isSubmittedChoice && (
                        <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2 text-xs">
                          <div className="flex items-center gap-2 font-bold">
                            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                              Score d'Admissibilité : {opt.impact.score} / 100
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1 text-slate-600 dark:text-slate-300">
                            <div><strong>Impact Réserves :</strong> {opt.impact.reservesImpact}</div>
                            <div><strong>Impact Inflation :</strong> {opt.impact.inflationImpact}</div>
                            <div><strong>Risque Bancaire :</strong> {opt.impact.bankingRiskImpact}</div>
                          </div>

                          <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                            <strong className="text-amber-700 dark:text-amber-400">Débriefing CPM BCC :</strong>{' '}
                            {opt.cpmFeedback}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleRestartScenario}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Recommencer le Scénario</span>
              </button>

              {!isStageResolved ? (
                <button
                  onClick={handleConfirmDecision}
                  disabled={!selectedOptionId}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  <span>Valider la Décision Stratégique</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : currentStageIdx < selectedScenario.stages.length - 1 ? (
                <button
                  onClick={handleNextStage}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
                >
                  <span>Passer à l'Étape Suivante</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Scénario de Crise Complété !</span>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
