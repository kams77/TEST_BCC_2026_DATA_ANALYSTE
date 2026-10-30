import React, { useState } from 'react';
import { 
  Radio, 
  Landmark, 
  ArrowRight, 
  Code, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  FileCheck2, 
  HelpCircle,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { TELECOM_BRIDGES, TELECOM_BCC_FAQ } from '../data/telecomBridgeData';

export const TelecomBridge: React.FC = () => {
  const [selectedBridgeId, setSelectedBridgeId] = useState<string>(TELECOM_BRIDGES[0].id);
  const activeBridge = TELECOM_BRIDGES.find(b => b.id === selectedBridgeId) || TELECOM_BRIDGES[0];

  // Interactive Live EME Audit Simulator (Real Congolese Telecom & Banking data)
  const [emeData, setEmeData] = useState([
    {
      operator: 'Vodacom M-Pesa RDC',
      banquePartenaire: 'Rawbank Congo',
      floatTotalCDF: 450000000000, // 450 Milliards CDF
      depotCantonnementCDF: 452000000000,
      statut: 'Conforme (+2 Mrds CDF de marge)'
    },
    {
      operator: 'Airtel Money RDC',
      banquePartenaire: 'Equity BCDC',
      floatTotalCDF: 320000000000,
      depotCantonnementCDF: 310000000000,
      statut: 'Infraction : Déficit de 10 Mrds CDF non couvert'
    },
    {
      operator: 'Orange Money RDC',
      banquePartenaire: 'Trust Merchant Bank (TMB)',
      floatTotalCDF: 210000000000,
      depotCantonnementCDF: 210500000000,
      statut: 'Conforme (+500 M CDF de marge)'
    }
  ]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      
      {/* Personalized Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 shadow-sm space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <Radio className="w-4 h-4" />
            <span>Votre Profil Candidat Identifié</span>
            <span>·</span>
            <span>Informaticien IT & Assistant Data Analyst Télécoms</span>
          </div>

          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Profil Très Prisé par la DIT & DSIF de la BCC</span>
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Accélérateur Passerelle : Comment vos compétences Télécoms vous feront réussir à la Banque Centrale
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
          N'ayez aucun complexe à ne pas venir d'une banque commerciale. En République Démocratique du Congo, 
          plus de <strong>75% de la masse monétaire des ménages circule via le Mobile Money (M-Pesa, Airtel Money, Orange Money)</strong>. 
          La Banque Centrale du Congo recherche activement des profils capables de manipuler de très volumineux flux de logs en temps réel, 
          d'auditer les plateformes de Switch et de faire parler la donnée brute.
        </p>

        {/* 3 Winning Competitive Arguments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-1">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>1. La Culture du Volume Massif</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              Vous traitez des millions d'enregistrements (CDR) par heure, alors qu'une banque classique traite quelques milliers d'écritures comptables.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-1">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-500" />
              <span>2. La Maîtrise des Architectures Temps Réel</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              Les flux du système de paiement en temps réel (RTGS) de la BCC reposent sur les mêmes patterns d'événements et de files d'attente que les réseaux GSM.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-1">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>3. Détection d'Anomalies & Fraudes</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              Traquer les SIM Box et les comportements atypiques d'abonnés équivaut exactement à la traque du blanchiment (AML/CENAREF) pour la BCC.
            </p>
          </div>
        </div>

      </div>

      {/* Interactive Concept Translation Deck */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Dictionnaire Vivant : Équivalences Métier Télécom ⇄ Banque Centrale
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cliquez sur un concept pour comparer vos acquis télécoms avec la terminologie officielle de la BCC et le code SQL associé.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          {TELECOM_BRIDGES.map(bridge => (
            <button
              key={bridge.id}
              onClick={() => setSelectedBridgeId(bridge.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-2 ${
                selectedBridgeId === bridge.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span>{bridge.telecomConcept}</span>
              <ArrowRight className="w-3 h-3 opacity-60" />
              <span>{bridge.bccConcept}</span>
            </button>
          ))}
        </div>

        {/* Selected Bridge Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
          
          {/* Left: Concept Analogy & Rationale */}
          <div className="space-y-4">
            
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Dans votre univers Télécom
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {activeBridge.telecomConcept}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeBridge.telecomDescription}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                Ce que cela devient à la Banque Centrale du Congo (BCC)
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {activeBridge.bccConcept}
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeBridge.bccDescription}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs space-y-1">
              <strong className="text-emerald-800 dark:text-emerald-300">Passerelle Pratique :</strong>{' '}
              <span className="text-slate-700 dark:text-slate-300">{activeBridge.realWorldAnalogy}</span>
            </div>

            {/* Phrase pour l'entretien oral */}
            <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs space-y-1">
              <strong className="text-amber-800 dark:text-amber-300">Votre Phrase Choc pour le Grand Oral / Test :</strong>
              <p className="text-slate-800 dark:text-slate-200 italic font-medium">
                « {activeBridge.interviewKeyPhrase} »
              </p>
            </div>

          </div>

          {/* Right: Side-by-Side SQL Comparison */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Code className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Comparaison du Code SQL : Du Télécom au Bancaire</span>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                <div className="bg-slate-900 px-3.5 py-1.5 text-[11px] font-mono text-slate-400 border-b border-slate-800 flex items-center justify-between">
                  <span>Requête Télécom (CDR & Trafic)</span>
                  <span className="text-indigo-400">Ce que vous faisiez déjà</span>
                </div>
                <pre className="p-3 text-xs font-mono text-indigo-300 overflow-x-auto leading-relaxed">
                  <code>{activeBridge.sqlPatternComparison.telecomQuery}</code>
                </pre>
              </div>

              <div className="rounded-xl overflow-hidden border border-emerald-800 bg-slate-950">
                <div className="bg-emerald-950/70 px-3.5 py-1.5 text-[11px] font-mono text-emerald-300 border-b border-emerald-900/60 flex items-center justify-between">
                  <span>Requête BCC (Virements RTGS & DSIF)</span>
                  <span className="text-emerald-400 font-bold">Ce qui vous sera demandé ce dimanche</span>
                </div>
                <pre className="p-3 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                  <code>{activeBridge.sqlPatternComparison.bccQuery}</code>
                </pre>
              </div>
            </div>

            <p className="text-xs text-slate-500 italic">
              Remarquez la stricte symétrie des structures SQL : les clauses <code className="font-mono text-slate-700 dark:text-slate-300">GROUP BY</code>, <code className="font-mono text-slate-700 dark:text-slate-300">DATE_TRUNC</code> et les fonctions de fenêtrage sont strictement identiques. Vous êtes déjà prêt(e) sur le plan technique.
            </p>
          </div>

        </div>

      </div>

      {/* Real-World EME Audit Simulator: Monitoring M-Pesa, Airtel Money, Orange Money */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <Landmark className="w-4 h-4" />
              <span>Cas Réel BCC : Supervision des Émetteurs de Monnaie Électronique (EME)</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Contrôle Prudentiel du Compte de Cantonnement (Instruction Administrative n°24)
            </h2>
          </div>

          <span className="text-xs text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
            Données du marché congolais
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          À la Banque Centrale du Congo, un Data Analyst de la DSIF contrôle quotidiennement que les fonds virtuels émis par les opérateurs télécoms (Float) sont gagés à 100% par des dépôts réels en Francs Congolais ou Dollars dans une banque de la place.
        </p>

        {/* Live EME Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
              <tr>
                <th className="p-3">Opérateur EME</th>
                <th className="p-3">Banque Partenaire (Compte Cantonnement)</th>
                <th className="p-3">Float Émis (Base Télécom)</th>
                <th className="p-3">Solde Dépôt Cantonné (BCC)</th>
                <th className="p-3">Audit Réglementaire</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-slate-700 dark:text-slate-300">
              {emeData.map((row, idx) => {
                const isCompliant = row.depotCantonnementCDF >= row.floatTotalCDF;
                return (
                  <tr key={idx} className={!isCompliant ? 'bg-rose-50/50 dark:bg-rose-950/20' : ''}>
                    <td className="p-3 font-bold text-slate-900 dark:text-white font-sans">{row.operator}</td>
                    <td className="p-3 font-sans text-slate-600 dark:text-slate-300">{row.banquePartenaire}</td>
                    <td className="p-3">{row.floatTotalCDF.toLocaleString('fr-FR')} CDF</td>
                    <td className="p-3 font-bold">{row.depotCantonnementCDF.toLocaleString('fr-FR')} CDF</td>
                    <td className="p-3 font-sans">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                        isCompliant 
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' 
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                      }`}>
                        {isCompliant ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                        <span>{row.statut}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
          <span>
            <strong>Règle d'Or BCC :</strong> Si Solde_Cantonné &lt; Float_Virtuel, l'opérateur est en infraction de création monétaire artificielle non gagée.
          </span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            Ratio = Dépôt / Float ≥ 1.000
          </span>
        </div>

      </div>

      {/* Strategic FAQ: Telecommunication to Central Bank */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Foire Aux Questions Spéciale Concours pour Candidat Issu des Télécoms</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {TELECOM_BCC_FAQ.map((faq, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2 text-xs"
            >
              <h3 className="font-bold text-slate-900 dark:text-white leading-snug">
                {faq.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {faq.answer}
              </p>
              <div className="pt-2 text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold border-t border-slate-200/60 dark:border-slate-700/60">
                Réf : {faq.bccInstructionRef}
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
