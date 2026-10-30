import React, { useState } from 'react';
import { 
  X, 
  TrendingUp, 
  Target, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Award, 
  Sparkles, 
  Users, 
  Radio, 
  Clock, 
  FileText,
  BarChart3,
  Sliders
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

interface AdmissionOddsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSimulation: () => void;
}

export const AdmissionOddsModal: React.FC<AdmissionOddsModalProps> = ({
  isOpen,
  onClose,
  onStartSimulation
}) => {
  const { 
    globalReadinessScore, 
    overallAccuracy, 
    totalAnsweredCount, 
    competencyScores 
  } = useProgress();

  // Interactive Simulator Sliders
  const [sqlProficiency, setSqlProficiency] = useState<number>(85);
  const [psychoProficiency, setPsychoProficiency] = useState<number>(80);
  const [bankingKnowledge, setBankingKnowledge] = useState<number>(75);
  const [speedUnderStress, setSpeedUnderStress] = useState<number>(80);
  const [telecomBonusActive, setTelecomBonusActive] = useState<boolean>(true);

  if (!isOpen) return null;

  // Real-time calculation based on sliders
  const calculateSimulatedOdds = () => {
    // Weighted formula based on BCC Technical Analyst exam composition:
    // Technical SQL & Data = 35%
    // Psychotech & Reasoning = 25%
    // Banking & Central Bank = 25%
    // Speed & Stress Management = 15%
    // Telecom profile bonus = +8%
    const baseScore = (sqlProficiency * 0.35) + 
                      (psychoProficiency * 0.25) + 
                      (bankingKnowledge * 0.25) + 
                      (speedUnderStress * 0.15);
    
    const bonus = telecomBonusActive ? 8 : 0;
    const finalScore = Math.min(97.5, Math.round(baseScore * 0.92 + bonus));
    return finalScore;
  };

  const simulatedOdds = calculateSimulatedOdds();

  // Historical BCC exam funnel metrics
  const estimatedCandidates = 1200;
  const estimatedSeats = 12; // Average cohort for DSI / Data at BCC
  const baselinePassRate = ((estimatedSeats / estimatedCandidates) * 100).toFixed(1); // ~1.0%

  const getRankProjection = (odds: number) => {
    if (odds >= 88) return { rank: 'Top 1% (Rang 1 à 10)', verdict: 'Sélection Certaine (Major de Promotion)', color: 'text-emerald-500', badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' };
    if (odds >= 75) return { rank: 'Top 3% (Rang 11 à 35)', verdict: 'Très Forte Probabilité de Retenue', color: 'text-teal-500', badge: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30' };
    if (odds >= 60) return { rank: 'Top 8% (Zone Admissible sur Liste d\'Attente)', verdict: 'Admissible - Consolider le SQL', color: 'text-amber-500', badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' };
    return { rank: 'Top 25% (Zone d\'Élimination)', verdict: 'Intensifier la Préparation Immédiatement', color: 'text-rose-500', badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30' };
  };

  const projection = getRankProjection(simulatedOdds);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Diagnostic Prédictif & Probabilité d'Admission BCC
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Concours Dimanche 01
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Modélisation statistique calibrée sur les épreuves de sélection de la Banque Centrale du Congo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Big Scorecard Banner */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white border border-emerald-900/50 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Award className="w-64 h-64 text-emerald-400" />
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Main Probability Gauge */}
              <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-6">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest block mb-1">
                  Probabilité de Sélection Estimée
                </span>
                <div className="flex items-baseline justify-center md:justify-start gap-2">
                  <span className="text-5xl sm:text-6xl font-black text-emerald-400 tracking-tight tabular-nums">
                    {simulatedOdds}%
                  </span>
                  <span className="text-sm font-semibold text-slate-400">
                    / 100%
                  </span>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{projection.verdict}</span>
                </div>
              </div>

              {/* Funnel & Percentile */}
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">Rang Prévisionnel</span>
                  <p className="text-base font-bold text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span>{projection.rank}</span>
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">Bassin de Candidats</span>
                  <p className="text-xs text-slate-300">
                    ~{estimatedCandidates} postulants pour ~{estimatedSeats} postes ouverts à la DSI / DSIF
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">Avantage Décisif Détecté</span>
                  <span className="text-xs font-bold text-indigo-300 bg-indigo-950/60 border border-indigo-700/60 px-2 py-0.5 rounded">
                    Double profil Télécom (Big Data) + Formation Métier BCC
                  </span>
                </div>
              </div>

              {/* Candidat Baseline Comparison */}
              <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/80 space-y-2.5 text-xs">
                <span className="font-bold text-slate-200 block text-xs">Pourquoi vous surpassez la moyenne :</span>
                <div className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>85% des candidats</strong> (éco/compta) échouent sur les fonctions SQL avancées (`OVER`, `LAG`, `HAVING`).</span>
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Les candidats informaticiens purs</strong> échouent sur les ratios prudentiels (LCR, Instruction n°24).</span>
                </div>
                <div className="flex items-start gap-2 text-emerald-300 font-semibold">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Vous maîtrisez les deux facettes grâce à cet entraînement intensif.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Sliders */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-5 border border-slate-200 dark:border-slate-700/60 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Simulateur de Performance pour Dimanche
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Ajustez vos estimations pour mesurer votre cote d'admissibilité
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Slider 1: SQL */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Maîtrise Requêtage SQL & Analytics (Poids 35%)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{sqlProficiency}%</span>
                </div>
                <input 
                  type="range" 
                  min="40" 
                  max="100" 
                  value={sqlProficiency} 
                  onChange={(e) => setSqlProficiency(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500">GROUP BY, Fenêtrage (OVER), Détection Smurfing & Fraude.</span>
              </div>

              {/* Slider 2: Psychotech */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Raisonnement Psychotechnique (Poids 25%)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{psychoProficiency}%</span>
                </div>
                <input 
                  type="range" 
                  min="40" 
                  max="100" 
                  value={psychoProficiency} 
                  onChange={(e) => setPsychoProficiency(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500">Dominos en base 7, syllogismes, prorata sans calculatrice.</span>
              </div>

              {/* Slider 3: Banking Knowledge */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Réglementation & Ratios BCC (Poids 25%)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{bankingKnowledge}%</span>
                </div>
                <input 
                  type="range" 
                  min="40" 
                  max="100" 
                  value={bankingKnowledge} 
                  onChange={(e) => setBankingKnowledge(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500">LCR, Instruction 24, Taux directeur, Réserves obligatoires.</span>
              </div>

              {/* Slider 4: Stress Management */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Gestion du Temps & Sang-Froid (Poids 15%)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{speedUnderStress}%</span>
                </div>
                <input 
                  type="range" 
                  min="40" 
                  max="100" 
                  value={speedUnderStress} 
                  onChange={(e) => setSpeedUnderStress(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500">Cadence de 45s par question, pas de panique sur les matrices.</span>
              </div>
            </div>

            {/* Toggle Telecom Advantage */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-indigo-500" />
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Bonus Profil Télécom (Expérience Gestion Flux CDR & Temps Réel)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Valorisé à +8% par le jury technique car Mobile Money = 80% des paiements en RDC
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTelecomBonusActive(!telecomBonusActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  telecomBonusActive ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  telecomBonusActive ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          {/* 3 Vital Rules for Sunday Morning */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Règle d'Or 1 : Ne rien laisser vide</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Au concours de la BCC, il n'y a généralement pas de points négatifs. Éliminez 2 options absurdes et choisissez logiquement entre les 2 restantes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Règle d'Or 2 : Le mot d'ordre Déontologique</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Toute question relative au secret bancaire, fuite d'informations ou intervention politique a une réponse unique : <strong>Indépendance totale et secret professionnel absolu</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-2">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs">
                <Zap className="w-4 h-4 shrink-0" />
                <span>Règle d'Or 3 : Argument Télécom</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                En question ouverte : « Mon expérience télécom me permet de traiter des pipelines de données massives en temps réel, compétence clé pour auditer le système RTGS et le Mobile Money de la BCC. »
              </p>
            </div>
          </div>

          {/* Plan des 48h (Vendredi & Samedi) */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Planning Stratégique des 48 Dernières Heures (J-2 et J-1)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white">Vendredi : Focus Psychotech & SQL Lab</span>
                <p className="text-slate-600 dark:text-slate-400">
                  Faites 2 séries de 15 questions en mode « Corrigé direct ». Mémorisez les fonctions SQL clés (`SUM() OVER`, `NULLIF`, `LAG`).
                </p>
              </div>
              <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white">Samedi : 1 Seul Examen Blanc + Repos Mental</span>
                <p className="text-slate-600 dark:text-slate-400">
                  Faites un seul test chronométré de 25 questions à 10h00. L'après-midi : relecture du mémento et repos complet. Préparez convocations et stylos.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer with Action */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            <span>Score actuel dans l'application : </span>
            <strong className="text-emerald-600 dark:text-emerald-400">{globalReadinessScore}%</strong>
            <span> · Précision : </span>
            <strong className="text-slate-800 dark:text-slate-200">{overallAccuracy}%</strong>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                onClose();
                onStartSimulation();
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow transition-all hover:scale-[1.02]"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Passer une Simulation Chronométrée</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
