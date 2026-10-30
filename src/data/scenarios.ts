import { RiskScenario } from '../types';

export const RISK_SCENARIOS: RiskScenario[] = [
  {
    id: 'scen_01',
    title: 'Crise des Matières Premières & Choc de Liquidité en Devises à Kinshasa',
    crisisType: 'Choc Exogène Macroéconomique & Taux de Change',
    departmentTarget: 'Comité de Politique Monétaire (CPM) & Direction de la Recherche',
    briefing: `Vous êtes Informaticien Data Analyst rattaché à la cellule d'appui technique du CPM.
Lundi matin, une dépêche Bloomberg annonce un effondrement de -32% des cours du cuivre au London Metal Exchange (LME) suite à une récession mondiale inattendue.
En RDC, les exportations minières représentent 94% des entrées officielles de devises et 45% des recettes fiscales du Trésor. 
Sur le marché interbancaire de Kinshasa, les banques commerciales cessent de se prêter des dollars. Le cours parallèle du Franc Congolais dérape brutalement de 2 800 à 3 200 CDF/USD en 48 heures.
Madame la Gouverneure convoque une session d'urgence du CPM dans 2 heures. Vous devez analyser les données télémétriques et recommander la riposte quantitative.`,
    initialTelemetry: {
      tauxChangeCDF_USD: 2850,
      reservesChangeSemaines: 7.4,
      inflationGlissement: 18.2,
      tauxDirecteurBCC: 25.0,
      ratioLCRSystemique: 112.0,
      tauxNPL: 7.8
    },
    stages: [
      {
        stageNumber: 1,
        stageTitle: 'Étape 1 : Diagnostic d\'Urgence des Réserves Internationales de Change',
        situationReport: `Votre script d'extraction SQL sur le grand livre des devises de la BCC révèle que les réserves brutes sont de 4,2 milliards USD.
Cependant, 1,1 milliard USD constitue le collatéral bloqué des dépôts obligatoires des banques en devises, et 800 millions USD sont déjà engagés pour le service de la dette extérieure des 90 prochains jours.
Le Trésor sollicite une injection de 400 millions USD pour stabiliser le taux de change.`,
        dataTable: {
          headers: ['Poste de Réserves', 'Montant (M USD)', 'Disponibilité Immédiate', 'Impact Réglementaire'],
          rows: [
            ['Réserves Brutes Officielles', '4 200', '100%', 'Seuil critique FMI = 6 semaines'],
            ['Réserves Obligatoires des Banques', '1 100', '0% (Non fongible)', 'Protection dépôts épargnants'],
            ['Service Dette Extérieure (90j)', '800', 'Réservé', 'Défaut souverain si entamé'],
            ['Marge Nette de Manœuvre (Tirage Libre)', '2 300', 'Immédiate', 'Seuil de sécurité CPM']
          ]
        },
        decisionQuestion: 'Quelle note de cadrage quantitatif transmettez-vous immédiatement au Gouverneur ?',
        options: [
          {
            id: 'opt_1a',
            label: 'Recommander une vente massive de 500 millions USD sur le marché pour forcer le cours à revenir à 2 800 CDF/USD.',
            technicalRationale: 'Tenter de maintenir un taux artificiel face à un choc réel de termes de l\'échange épuise les réserves sans corriger le déséquilibre fondamental.',
            impact: {
              reservesImpact: '-500 M USD (Réserves tombent sous 5.0 semaines d\'importations)',
              inflationImpact: 'Accalmie éphémère de 10 jours, suivie d\'une reprise violente de la dépréciation',
              bankingRiskImpact: 'Spéculation accrue des banques qui stockent les dollars vendus à bas prix',
              score: 25
            },
            cpmFeedback: 'Erreur stratégique majeure. L\'histoire monétaire congolaise démontre qu\'injecter des réserves face à une baisse structurelle des cours du cuivre vide les coffres de la Banque Centrale au profit des spéculateurs.'
          },
          {
            id: 'opt_1b',
            label: 'Autoriser une intervention ciblée limitée (adjudication de 50M$ réservée aux importations de denrées de première nécessité) combinée à un resserrement de la liquidité en CDF.',
            technicalRationale: 'Lisser la volatilité sans contrarier la tendance de fond, préserver les réserves critiques et assécher la liquidité spéculative en Francs Congolais.',
            impact: {
              reservesImpact: '-50 M USD (Réserves préservées à 7.1 semaines)',
              inflationImpact: 'Contenue grâce à l\'approvisionnement ciblé en produits de base',
              bankingRiskImpact: 'Marché stabilisé sans risque de panique systémique',
              score: 95
            },
            cpmFeedback: 'Décision d\'excellence saluée par le CPM. L\'adjudication ciblée protège le pouvoir d\'achat de la population kinoise tout en préservant le matelas de devises de la République.'
          },
          {
            id: 'opt_1c',
            label: 'Geler totalement toutes les opérations de change et fermer le guichet interbancaire.',
            technicalRationale: 'Provoque l\'explosion instantanée du marché noir parallèle.',
            impact: {
              reservesImpact: '0 M USD',
              inflationImpact: 'Hyperinflation sur le marché parallèle (> 45%)',
              bankingRiskImpact: 'Effondrement de la confiance dans le système bancaire',
              score: 10
            },
            cpmFeedback: 'Inadmissible. La fermeture du marché régulé alimente immédiatement le marché informel de la Place Victoire et de l\'Hôtel des Postes.'
          }
        ]
      },
      {
        stageNumber: 2,
        stageTitle: 'Étape 2 : Réaction de Politique Monétaire (Arbitrage Taux Directeur & Bons BCC)',
        situationReport: `Votre modèle économétrique sous Python (VAR / VECM) simule la transmission de la dépréciation du CDF vers l'inflation sous-jacente à Kinshasa.
Le coefficient de répercussion (« pass-through ») est de 0.65 : chaque hausse de 10% du taux de change CDF/USD génère 6.5% d'inflation supplémentaire dans les 6 mois.
Le taux directeur actuel est à 25.0%. Le taux d'inflation annualisé menace de grimper à 28.5%. Le taux d'intérêt réel devient négatif (-3.5%), incitant les détenteurs de capitaux à fuir le Franc Congolais vers le Dollar.`,
        decisionQuestion: 'Quel ensemble de mesures monétaires intégrez-vous dans votre reporting pour le CPM ?',
        options: [
          {
            id: 'opt_2a',
            label: 'Hausse du taux directeur de 250 points de base (25.0% -> 27.5%) et relèvement du taux des Bons BCC pour offrir un rendement réel positif aux investisseurs institutionnels.',
            technicalRationale: 'Rétablir un taux d\'intérêt réel positif pour inciter les banques et entreprises à placer leurs excédents en Francs Congolais plutôt que d\'acheter des dollars.',
            impact: {
              reservesImpact: 'Freine la sortie de capitaux',
              inflationImpact: 'Inflexion de la trajectoire d\'inflation sous 4 mois',
              bankingRiskImpact: 'Légère hausse du coût du crédit compensée par la stabilité monétaire',
              score: 95
            },
            cpmFeedback: 'Recommandation conforme aux meilleures pratiques des Banques Centrales. Cela ancre les anticipations d\'inflation et protège la monnaie nationale.'
          },
          {
            id: 'opt_2b',
            label: 'Abaisser le taux directeur à 15% pour stimuler les entreprises locales en difficulté.',
            technicalRationale: 'Une baisse de taux en pleine crise de change injecte massivement des liquidités qui se transforment aussitôt en achats spéculatifs de devises.',
            impact: {
              reservesImpact: 'Fuite massive de capitaux',
              inflationImpact: 'Flambée incontrôlée de l\'inflation au-delà de 35%',
              bankingRiskImpact: 'Crise de confiance monétaire généralisée',
              score: 5
            },
            cpmFeedback: 'Erreur fatale. Abaisser les taux d\'intérêt face à un choc d\'offre et une dépréciation monétaire détruit la crédibilité de la Banque Centrale.'
          }
        ]
      }
    ]
  },
  {
    id: 'scen_02',
    title: 'Surveillance Systémique : Alerte de Liquidité & Stress Test Prudentiel',
    crisisType: 'Risque Bancaire & Liquidité (LCR)',
    departmentTarget: 'Direction de la Surveillance des Intermédiaires Financiers (DSIF)',
    briefing: `Vendredi après-midi, les données transmises via le portail prudentiel automatisé de la BCC déclenchent une alerte rouge :
La "Banque Kimbangu", 4ème établissement bancaire de la RDC en taille de dépôts (850 millions USD de bilan), subit des retraits massifs de la part de trois compagnies minières de Kolwezi qui rapatrièrent leurs fonds vers l\'étranger.
Son ratio LCR est tombé en 72 heures de 118% à 61% (seuil légal BCC : 100%).
La banque sollicite en urgence le guichet de prêt marginal de la BCC pour 60 millions USD. En tant que Data Analyst à la DSIF, vous devez vérifier la qualité de ses actifs et proposer une recommandation avant la réouverture lundi matin.`,
    initialTelemetry: {
      tauxChangeCDF_USD: 2820,
      reservesChangeSemaines: 7.2,
      inflationGlissement: 17.5,
      tauxDirecteurBCC: 25.0,
      ratioLCRSystemique: 94.0,
      tauxNPL: 11.2
    },
    stages: [
      {
        stageNumber: 1,
        stageTitle: 'Étape 1 : Évaluation de Solvabilité vs Illiquidité Passagère (Règle de Bagehot)',
        situationReport: `L'analyse du bilan consolidé montre que la banque détient 140 millions USD de Bons du Trésor congolais et des créances saines non gagées. 
Son ratio de solvabilité globale (Fonds Propres / RWA) est de 12.8% (au-dessus du minimum légal de 10.0%).
La banque n'est donc pas insolvable, mais fait face à une crise d'illiquidité temporaire due à la concentration excessive de ses déposants miniers.`,
        decisionQuestion: 'Sur quelle base technique recommandez-vous à la DSIF d\'octroyer l\'aide d\'urgence en liquidité (ELA) ?',
        options: [
          {
            id: 'opt_s2_1',
            label: 'Appliquer la doctrine classique de Walter Bagehot : Prêter librement à un taux pénalisateur supérieur au taux directeur, contre un collatéral irréprochable (Bons du Trésor avec décote prudentielle "haircut" de 15%).',
            technicalRationale: 'Protège la Banque Centrale contre le risque de crédit tout en stoppant la contagion bancaire.',
            impact: {
              reservesImpact: 'Risque nul pour la BCC grâce au collatéral',
              inflationImpact: 'Neutre (remplacement de liquidités détruites par les retraits)',
              bankingRiskImpact: 'Arrêt immédiat de la panique bancaire sans aléa moral',
              score: 100
            },
            cpmFeedback: 'Remarquable maîtrise des principes fondamentaux de banque centrale (Lender of Last Resort). C\'est la décision historique standard validée par le Conseil d\'Administration.'
          },
          {
            id: 'opt_s2_2',
            label: 'Refuser toute aide et laisser la banque fermer ses guichets lundi matin pour servir d\'exemple aux autres établissements.',
            technicalRationale: 'Déclenche un effet domino de panique sur les 14 autres banques de la place.',
            impact: {
              reservesImpact: 'Neutre à court terme',
              inflationImpact: 'Impact indirect lourd',
              bankingRiskImpact: 'Panique bancaire nationale et ruée aux guichets (Bank Run généralisé)',
              score: 15
            },
            cpmFeedback: 'Catastrophique. En tant que prêteur en dernier ressort, le mandat premier de la Banque Centrale est d\'empêcher le risque systémique.'
          }
        ]
      }
    ]
  }
];
