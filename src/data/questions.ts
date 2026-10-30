import { Question } from '../types';

export const QUESTION_BANK: Question[] = [
  // ==========================================
  // 1. PSYCHOTECHNIQUE & RAISONNEMENT LOGIQUE
  // ==========================================
  {
    id: 'psy_log_01',
    category: 'psychotech_logic',
    categoryLabel: 'Logique & Matrices Abstraites',
    difficulty: 'difficile',
    title: 'Matrice de Flux de Compensation Interbancaire',
    prompt: `Dans un modèle de compensation interbancaire triangulaire entre trois banques commerciales (Banque A, Banque B, Banque C) à Kinshasa, on observe la matrice suivante des flux nets journaliers (en millions de USD). Quelle est la valeur manquante [ ? ] permettant à la position nette globale du système de rester strictement nulle (principe de conservation des liquidités ATS/RTGS) ?`,
    contextData: {
      type: 'matrix',
      matrixGrid: [
        ['Émetteur \\ Récepteur', 'Banque A', 'Banque B', 'Banque C', 'Solde Net Émetteur'],
        ['Banque A', '0', '+45', '-15', '+30'],
        ['Banque B', '-45', '0', '+22', '-23'],
        ['Banque C', '+15', '-22', '0', '[ ? ]']
      ]
    },
    options: ['-7 millions USD', '+7 millions USD', '-12 millions USD', '0 million USD'],
    correctIndex: 0,
    explanation: {
      summary: 'Dans un système de compensation fermé, la somme des positions nettes bilatérales est toujours nulle.',
      steps: [
        'Pour la Banque C : elle reçoit -15 de A (donc verse 15 à A, solde = -15), et de B elle reçoit +22 (B lui doit 22, mais la cellule ligne C / col B vaut -22 car si B->C = +22, C->B = -22).',
        'Somme ligne C = (+15) + (-22) = -7 millions USD.',
        'Vérification globale : Solde A (+30) + Solde B (-23) + Solde C (-7) = 0. Le système est parfaitement équilibré.'
      ],
      bccRelevance: 'À la BCC, la surveillance du système RTGS (Real-Time Gross Settlement) exige de vérifier instantanément la solvabilité multilatérale et l\'absence de déséquilibre résiduel avant la clôture journalière.',
      proTip: 'Toujours faire la somme des colonnes ou lignes pour vérifier que le solde total du système compense à 0.'
    },
    timeEstimateSeconds: 45
  },
  {
    id: 'psy_log_02',
    category: 'psychotech_logic',
    categoryLabel: 'Logique & Déduction Réglementaire',
    difficulty: 'difficile',
    title: 'Déduction Conditionnelle sur l\'Instruction Prudentielle n°14',
    prompt: `La Direction de la Surveillance des Intermédiaires Financiers (DSIF) de la BCC émet trois règles logiques pour le classement des créances :
1. Si un crédit a des arriérés > 90 jours, il est classé "Douteux".
2. Si un crédit est "Douteux" ou "Compromis", la banque commerciale doit provisionner au minimum 50% de sa valeur brute.
3. Aucune banque ne peut distribuer de dividendes si ses provisions prudentielles totales n'atteignent pas 100% du montant exigé par la BCC.

La Banque Alpha présente un crédit entreprise de 10 millions USD avec 115 jours d'arriérés, provisionné seulement à 3 millions USD. Quelle déduction est LOGIQUEMENT CERTAINE ?`,
    options: [
      'La Banque Alpha sera mise sous administration provisoire dès lundi.',
      'La Banque Alpha a l\'interdiction légale de distribuer des dividendes à ses actionnaires.',
      'Le crédit entreprise doit être immédiatement reclassé en "Crédit Sains".',
      'Le ratio de liquidité LCR de la Banque Alpha est nécessairement inférieur à 100%.'
    ],
    correctIndex: 1,
    explanation: {
      summary: 'Application rigoureuse de la logique propositionnelle déductive (Modus Ponens).',
      steps: [
        'Arriérés = 115 jours > 90 jours => Selon la règle 1, le crédit est "Douteux".',
        'Le crédit est "Douteux" => Selon la règle 2, provision minimale requise = 50% de 10M$ = 5 millions USD.',
        'Or, la banque n\'a provisionné que 3 millions USD (3M$ < 5M$). Elle n\'atteint donc pas le montant exigé.',
        'Selon la règle 3 : Comme les provisions n\'atteignent pas 100% de l\'exigible, la distribution de dividendes est formellement interdite.'
      ],
      bccRelevance: 'Les data analysts de la DSIF écrivent des algorithmes de détection automatique des non-conformités prudentielles pour bloquer les remontées de dividendes non autorisées.',
      proTip: 'Ne supposez rien qui ne découle pas strictement des prémisses (l\'administration provisoire ou le ratio LCR ne sont pas mentionnés dans les règles données).'
    },
    timeEstimateSeconds: 50
  },
  {
    id: 'psy_log_03',
    category: 'psychotech_logic',
    categoryLabel: 'Logique & Matrices Abstraites',
    difficulty: 'difficile',
    title: 'Suite Matrice de Raven - Évolution des Réserves de Change',
    prompt: `Dans une matrice 3x3 de surveillance de la balance des paiements, chaque case contient 2 indicateurs : le nombre de semaines d'importation (chiffre) et la flèche de tendance de la liquidité en devises (↑, →, ↓).
Ligne 1 : [ 6.2 sem, ↑ ]  [ 7.1 sem, → ]  [ 8.0 sem, ↓ ]
Ligne 2 : [ 5.0 sem, → ]  [ 5.9 sem, ↓ ]  [ 6.8 sem, ↑ ]
Ligne 3 : [ 3.8 sem, ↓ ]  [ 4.7 sem, ↑ ]  [ ? ]

Quelle est la cellule manquante ?`,
    options: [
      '[ 5.6 sem, → ]',
      '[ 5.4 sem, ↓ ]',
      '[ 5.8 sem, → ]',
      '[ 5.6 sem, ↑ ]'
    ],
    correctIndex: 0,
    explanation: {
      summary: 'Deux règles indépendantes se superposent dans cette matrice.',
      steps: [
        'Règle numérique : Sur chaque ligne, on progresse de +0.9 sem (6.2 + 0.9 = 7.1; 7.1 + 0.9 = 8.0; ligne 3 : 3.8 + 0.9 = 4.7; 4.7 + 0.9 = 5.6 sem).',
        'Règle d\'orientation des flèches : Chaque ligne et chaque colonne contient exactement une fois chaque symbole {↑, →, ↓} (principe de permutation latine).',
        'Ligne 3 a déjà ↓ et ↑. Il manque donc obligatoirement la flèche horizontale →.',
        'Résultat final : [ 5.6 sem, → ].'
      ],
      bccRelevance: 'Ce type de test psychotechnique combinatoire mesure votre vitesse de dissociation et d\'extraction de signaux multiples sous stress.',
      proTip: 'Séparez immédiatement la composante numérique et la composante symbolique.'
    },
    timeEstimateSeconds: 40
  },

  // ==========================================
  // 2. PSYCHOTECHNIQUE & CALCUL QUANTITATIF
  // ==========================================
  {
    id: 'psy_num_01',
    category: 'psychotech_numerical',
    categoryLabel: 'Calcul Numérique & Taux de Change',
    difficulty: 'difficile',
    title: 'Calcul de Dépréciation Monétaire et Taux Croisé CDF/USD',
    prompt: `Au 1er janvier, le cours indicatif de la BCC est de 1 USD = 2 500 CDF. Au 30 juin, le cours s'établit à 1 USD = 2 800 CDF. 
Simultanément, un panier de biens importés à Kinshasa coûte 100 USD.
De quel pourcentage le Franc Congolais s'est-il déprécié par rapport au Dollar US sur le semestre ?`,
    options: ['-12.00%', '-10.71%', '+12.00%', '-14.28%'],
    correctIndex: 1,
    explanation: {
      summary: 'Attention au piège classique entre variation de la cotation de la devise étrangère et dépréciation de la monnaie nationale !',
      steps: [
        'La valeur de 1 CDF en USD au 1er janvier : 1 / 2500 = 0.000400 USD.',
        'La valeur de 1 CDF en USD au 30 juin : 1 / 2800 = 0.0003571 USD.',
        'Variation du Franc Congolais = (0.0003571 - 0.000400) / 0.000400 = (2500 - 2800) / 2800 = -300 / 2800 = -10.71%.',
        'Note : Le dollar s\'est apprécié de +12% ((2800 - 2500)/2500 = +12%), mais le CDF s\'est déprécié de -10.71% !'
      ],
      bccRelevance: 'La formule officielle de la BCC pour la note de conjoncture économique calcule toujours la dépréciation du CDF par rapport au dollar via la formule (E_0 - E_t) / E_t.',
      proTip: 'Retenez la formule concours BCC : Dépréciation monnaie domestique = -(E_t - E_0) / E_t où E est le cours de change direct (USD/CDF).'
    },
    timeEstimateSeconds: 45
  },
  {
    id: 'psy_num_02',
    category: 'psychotech_numerical',
    categoryLabel: 'Calcul Numérique & Réserves Obligatoires',
    difficulty: 'difficile',
    title: 'Calcul d\'Assiette des Réserves Obligatoires à la BCC',
    prompt: `Une banque commerciale de Kinshasa détient dans son bilan :
- Dépôts à vue en Francs Congolais (CDF) : 400 milliards CDF
- Dépôts à terme en Devises (USD) : 500 millions USD (convertis au cours de 2 800 CDF/USD)
La BCC impose un coefficient de réserves obligatoires de :
- 0% sur les dépôts en monnaie nationale
- 13% sur les dépôts à terme en devises étrangères (bloqués en devises à la BCC).
Quel montant de devises cette banque doit-elle obligatoirement geler sur son compte de réserve à la Banque Centrale ?`,
    options: [
      '65 millions USD',
      '52 millions USD',
      '182 milliards CDF',
      '78 millions USD'
    ],
    correctIndex: 0,
    explanation: {
      summary: 'Application directe des coefficients de réserves obligatoires de la BCC selon la devise d\'exigibilité.',
      steps: [
        'Dépôts en CDF : taux 0% => Réserves = 0 CDF.',
        'Dépôts à terme en USD : 500 millions USD x 13% = 65 millions USD.',
        'La réglementation de la BCC stipule que les réserves sur dépôts en devises sont constituées dans la devise d\'origine (USD) auprès de la BCC pour protéger la liquidité extérieure.'
      ],
      bccRelevance: 'La Direction des Opérations Bancaires et des Marchés (DOBM) audite quotidiennement les assiettes de réserves obligatoires déclarées par les banques.',
      proTip: 'Vérifiez toujours si l\'obligation est libellée en monnaie nationale ou en devise étrangère.'
    },
    timeEstimateSeconds: 40
  },
  {
    id: 'psy_num_03',
    category: 'psychotech_numerical',
    categoryLabel: 'Calcul Numérique & Séries Financières',
    difficulty: 'moyen',
    title: 'Suite Temporelle du Taux Directeur de la BCC',
    prompt: `Dans le cadre d'un resserrement monétaire pour contrer l'inflation importée, le Comité de Politique Monétaire (CPM) de la BCC ajuste son taux directeur selon la suite numérique suivante :
Réunion 1 : 11.0%
Réunion 2 : 14.5%  (+3.5%)
Réunion 3 : 19.0%  (+4.5%)
Réunion 4 : 24.5%  (+5.5%)
Réunion 5 : [ ? ]
Si la fonction de réaction de politique monétaire conserve cette accélération arithmétique de second ordre, quel sera le taux directeur à la réunion 5 ?`,
    options: ['31.0%', '29.5%', '30.0%', '32.5%'],
    correctIndex: 0,
    explanation: {
      summary: 'Suite arithmétique à écarts croissants de +1.0% par palier.',
      steps: [
        'Écart 1 -> 2 : +3.5%',
        'Écart 2 -> 3 : +4.5%',
        'Écart 3 -> 4 : +5.5%',
        'Écart 4 -> 5 : doit être +6.5% (progression linéaire du pas de +1.0%).',
        'Taux Réunion 5 = 24.5% + 6.5% = 31.0%.'
      ],
      bccRelevance: 'Les modèles de Taylor et les règles de Taylor calibrées pour la RDC étudient la réactivité du taux directeur face à l\'écart d\'inflation.',
      proTip: 'Identifiez immédiatement la suite des différences premières (Δy_t = y_t - y_{t-1}).'
    },
    timeEstimateSeconds: 30
  },

  // ==========================================
  // 3. SQL & DATA ANALYTICS BANCAIRE BCC
  // ==========================================
  {
    id: 'sql_data_01',
    category: 'sql_data_analysis',
    categoryLabel: 'SQL Avancé & Surveillance RTGS',
    difficulty: 'difficile',
    title: 'Détection de Fractionnement Atypique (Anti-Blanchiment / AML)',
    prompt: `À la Direction des Systèmes de Paiement de la BCC, vous devez identifier les clients effectuant du fractionnement suspect ("smurfing") sur les virements RTGS : c'est-à-dire plusieurs virements d'un même donneur d'ordre le même jour, individuellement inférieurs au seuil légal de 10 000 USD, mais dont le cumul journalier dépasse 50 000 USD.
Quelle requête SQL PostgreSQL produit exactement cette liste sans faux positifs ?`,
    contextData: {
      type: 'code',
      codeLanguage: 'sql',
      codeSnippet: `-- Schéma de la table de transactions
rtgs_transactions (
  transaction_id VARCHAR(32) PRIMARY KEY,
  client_sender_id VARCHAR(20),
  bank_bic VARCHAR(11),
  amount_usd NUMERIC(15,2),
  tx_timestamp TIMESTAMP
)`
    },
    options: [
      `SELECT client_sender_id, DATE(tx_timestamp) as jour, SUM(amount_usd) as total_jour
FROM rtgs_transactions
WHERE amount_usd < 10000
GROUP BY client_sender_id, DATE(tx_timestamp)
HAVING SUM(amount_usd) > 50000 AND COUNT(*) > 1;`,

      `SELECT client_sender_id, SUM(amount_usd) as total
FROM rtgs_transactions
WHERE amount_usd > 50000
GROUP BY client_sender_id;`,

      `SELECT DISTINCT client_sender_id
FROM rtgs_transactions
WHERE amount_usd < 10000 OR amount_usd > 50000;`,

      `SELECT client_sender_id, AVG(amount_usd)
FROM rtgs_transactions
HAVING SUM(amount_usd) > 50000;`
    ],
    correctIndex: 0,
    explanation: {
      summary: 'Utilisation combinée du filtre WHERE sur le montant unitaire et du HAVING sur l\'agrégation journalière.',
      steps: [
        'Le fractionnement impose que chaque transaction individuelle soit inférieure au seuil de déclaration (< 10 000 USD). C\'est une condition au niveau ligne => clause WHERE amount_usd < 10000.',
        'L\'analyse se fait au niveau journalier par client => GROUP BY client_sender_id, DATE(tx_timestamp).',
        'Le cumul journalier de ces petites transactions doit dépasser 50 000 USD et comporter au moins 2 transactions => clause HAVING SUM(amount_usd) > 50000 AND COUNT(*) > 1.'
      ],
      bccRelevance: 'La BCC collabore étroitement avec la CENAREF (Cellule Nationale des Renseignements Financiers) pour traquer les transferts suspects contournant la réglementation des changes.',
      proTip: 'Toujours distinguer ce qui filtre la transaction brute (WHERE) de ce qui filtre l\'agrégat consolidé (HAVING).'
    },
    timeEstimateSeconds: 60
  },
  {
    id: 'sql_data_02',
    category: 'sql_data_analysis',
    categoryLabel: 'SQL Avancé & Position de Liquidité',
    difficulty: 'difficile',
    title: 'Calcul du Solde Cumulé Intrajournalier via Window Function',
    prompt: `Pour surveiller le risque de défaillance en cours de journée d'une grande banque commerciale sur le système ATS/RTGS, vous devez calculer le solde net cumulé de son compte de règlement après chaque virement entrant (+) ou sortant (-).
Quelle instruction SQL avec fonction de fenêtrage (Window Function) est syntaxiquement et logiquement exacte ?`,
    contextData: {
      type: 'code',
      codeLanguage: 'sql',
      codeSnippet: `-- Colonnes : bank_code, tx_id, tx_time, net_amount`
    },
    options: [
      `SELECT bank_code, tx_id, tx_time, net_amount,
       SUM(net_amount) OVER (
         PARTITION BY bank_code 
         ORDER BY tx_time 
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) as running_liquidity_balance
FROM rtgs_operations;`,

      `SELECT bank_code, tx_id, tx_time, net_amount,
       CUMULATIVE_SUM(net_amount) GROUP BY bank_code, tx_time
FROM rtgs_operations;`,

      `SELECT bank_code, tx_id, tx_time, net_amount,
       SUM(net_amount) OVER (
         ORDER BY bank_code 
         PARTITION BY tx_time
       ) as balance
FROM rtgs_operations;`,

      `SELECT bank_code, tx_id, tx_time, net_amount,
       ROW_NUMBER(net_amount) OVER (PARTITION BY bank_code) as running_balance
FROM rtgs_operations;`
    ],
    correctIndex: 0,
    explanation: {
      summary: 'La fenêtre glissante avec PARTITION BY et ORDER BY calcule le total cumulatif instantané.',
      steps: [
        'PARTITION BY bank_code permet d\'isoler chaque banque séparément afin que son compte ne se mélange pas avec les autres banques.',
        'ORDER BY tx_time ordonne chronologiquement les opérations.',
        'ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW (ou la valeur par défaut RANGE) somme toutes les transactions depuis le début de la journée jusqu\'à la transaction courante.'
      ],
      bccRelevance: 'Si le solde intrajournalier d\'une banque devient négatif au-delà de son collatéral admis en garantie, le système RTGS de la BCC bloque automatiquement la file d\'attente (Gridlock).',
      proTip: 'En SQL bancaire, la combinaison SUM(...) OVER (PARTITION BY ... ORDER BY ...) est la signature absolue du calcul de solde progressif.'
    },
    timeEstimateSeconds: 50
  },
  {
    id: 'sql_data_03',
    category: 'sql_data_analysis',
    categoryLabel: 'SQL & Intégrité Données Économiques',
    difficulty: 'difficile',
    title: 'Détection d\'Écarts de Déclaration entre Bilan et Hors-Bilan (Audit DSIF)',
    prompt: `Dans le cadre de l'audit réglementaire périodique transmis par les 15 banques commerciales congolaises, vous devez identifier les banques dont le total des engagements par signature (hors-bilan) dépasse 150% de leurs fonds propres nets déclarés dans le tableau B1.
Quelle structure de requête utilisant une CTE (Common Table Expression - WITH) est la plus rigoureuse et performante ?`,
    contextData: {
      type: 'code',
      codeLanguage: 'sql',
      codeSnippet: `WITH fp AS (
  SELECT code_banque, montant as fonds_propres
  FROM etats_prudentiels WHERE code_rubrique = 'FP_NETS' AND date_arrete = '2026-09-30'
),
hb AS (
  SELECT code_banque, SUM(montant) as total_hors_bilan
  FROM etats_prudentiels WHERE code_rubrique IN ('CAUTION_AVAL', 'CREDIT_DOC_OUVERT') AND date_arrete = '2026-09-30'
  GROUP BY code_banque
)
SELECT fp.code_banque, fp.fonds_propres, hb.total_hors_bilan,
       ROUND((hb.total_hors_bilan / NULLIF(fp.fonds_propres, 0)) * 100, 2) as ratio_exposition_pct
FROM fp
JOIN hb ON fp.code_banque = hb.code_banque
WHERE hb.total_hors_bilan > 1.5 * fp.fonds_propres;`
    },
    options: [
      'La requête présentée est parfaite : utilisation de CTEs, protection division par zéro (NULLIF) et filtrage exact.',
      'La requête est erronée car on ne peut jamais utiliser JOIN entre deux CTEs en PostgreSQL.',
      'La requête échouera car la clause NULLIF n\'existe pas en SQL standard.',
      'La clause WHERE n\'est pas autorisée après un JOIN.'
    ],
    correctIndex: 0,
    explanation: {
      summary: 'La requête est un modèle exemplaire de propreté et de robustesse en data engineering bancaire.',
      steps: [
        'Les CTEs `fp` et `hb` séparent clairement l\'extraction des fonds propres et des engagements hors-bilan.',
        'La fonction `NULLIF(fp.fonds_propres, 0)` évite le redouté crash de division par zéro si une banque en faillite a des fonds propres nuls.',
        'Le JOIN sur `code_banque` relie précisément les mêmes établissements.',
        'Le filtre `WHERE hb.total_hors_bilan > 1.5 * fp.fonds_propres` isole exactement le dépassement de 150%.'
      ],
      bccRelevance: 'La surveillance macroprudentielle de la BCC impose aux data analysts de concevoir des scripts d\'ingestion tolérants aux erreurs de reporting pour auditer les ratios de levier.',
      proTip: 'L\'utilisation de NULLIF(col, 0) dans tout calcul de ratio financier est un réflexe incontournable testé aux concours de data analyst.'
    },
    timeEstimateSeconds: 45
  },

  // ==========================================
  // 4. PYTHON, ECONOMÉTRIE & DATA SCIENCE
  // ==========================================
  {
    id: 'py_econ_01',
    category: 'python_econometrics',
    categoryLabel: 'Économétrie & Séries Temporelles',
    difficulty: 'difficile',
    title: 'Test de Stationnarité pour la Prévision de l\'IPC Kinshasa',
    prompt: `Pour modéliser l'Indice des Prix à la Consommation (IPC) hebdomadaire de la ville de Kinshasa avec un modèle ARIMA(p,d,q), un Data Analyst de la Direction de la Recherche applique le test ADF (Augmented Dickey-Fuller) avec Python statsmodels :

\`\`\`python
from statsmodels.tsa.stattools import adfuller
result = adfuller(df['ipc_kinshasa'])
print('ADF Statistic:', result[0])
print('p-value:', result[1])
# Output :
# ADF Statistic: -1.42
# p-value: 0.572
# Valeurs critiques : 1%: -3.45, 5%: -2.87, 10%: -2.57
\`\`\`

Quelle est l'interprétation rigoureuse et l'étape méthodologique suivante ?`,
    options: [
      'La série est non-stationnaire (présence de racine unitaire). On ne rejette pas H0. Il faut différencier la série (d >= 1) avant d\'estimer le modèle.',
      'La série est parfaitement stationnaire car la p-value est supérieure à 0.05. On peut directement estimer un ARMA(p,q).',
      'La statistique ADF étant négative, la série présente une tendance explosive. Il faut abandonner la modélisation.',
      'Le test est invalide car le nombre d\'observations hebdomadaires est insuffisant.'
    ],
    correctIndex: 0,
    explanation: {
      summary: 'Dans le test ADF, l\'hypothèse nulle H0 est la présence d\'une racine unitaire (non-stationnarité).',
      steps: [
        'H0 : La série possède une racine unitaire (non-stationnaire).',
        'H1 : La série est stationnaire.',
        'Ici, p-value = 0.572 > 0.05 et la statistique ADF (-1.42) est supérieure aux valeurs critiques (-2.87).',
        'On NE PEUT PAS rejeter H0 : la série est non-stationnaire.',
        'Conséquence obligatoire : Appliquer une différenciation première (np.diff ou df.diff()) pour rendre la série intégrée d\'ordre 1 stationnaire (I(1)).'
      ],
      bccRelevance: 'La BCC publie chaque semaine l\'indice d\'inflation hebdomadaire et annualisé. La stationnarisation des séries de prix est le préalable à tout modèle prévisionnel pour le CPM.',
      proTip: 'P-value > 0.05 dans un test ADF = Non-stationnaire => Différenciation obligatoire !'
    },
    timeEstimateSeconds: 50
  },
  {
    id: 'py_econ_02',
    category: 'python_econometrics',
    categoryLabel: 'Data Science & Risque de Marché',
    difficulty: 'difficile',
    title: 'Calcul de la Value at Risk (VaR) des Réserves de Change',
    prompt: `Le portefeuille de réserves de devises de la BCC est composé à 85% de Bons du Trésor US et 15% d'Euros. Les rendements journaliers historiques sur 500 jours présentent une distribution quasi-normale avec une moyenne journalière μ = +0.02% et un écart-type σ = 0.8%.
Au niveau de confiance de 95% (quantile z = 1.645) sur un horizon de 1 jour, quelle est la Value at Risk (VaR) paramétrique journalière maximale en pourcentage du portefeuille ?`,
    options: ['1.30%', '1.50%', '0.80%', '2.10%'],
    correctIndex: 0,
    explanation: {
      summary: 'Formule paramétrique de la VaR : VaR = -(μ - z * σ) = z * σ - μ.',
      steps: [
        'VaR(95%, 1 jour) = z_0.95 * σ - μ',
        'VaR = 1.645 * 0.8% - 0.02% = 1.316% - 0.02% = 1.296% ≈ 1.30%.',
        'Interprétation : Il y a seulement 5% de probabilité que la perte journalière sur les réserves de devises dépasse 1.30% de la valeur totale.'
      ],
      bccRelevance: 'La Direction des Opérations Bancaires et des Marchés (DOBM) de la BCC gère la réserve prudentielle de change de la République et doit respecter les mandats de risque de marché fixés par le Conseil d\'Administration.',
      proTip: 'Retenez les quantiles usuels de la loi normale : 95% => z = 1.645, 99% => z = 2.326.'
    },
    timeEstimateSeconds: 45
  },

  // ==========================================
  // 5. RISQUES BANCAIRES & RÉGLEMENTATION BCC
  // ==========================================
  {
    id: 'risk_prud_01',
    category: 'bank_risk_prudential',
    categoryLabel: 'Réglementation Prudentielle & Bâle',
    difficulty: 'difficile',
    title: 'Ratio de Liquidité à Court Terme (LCR - Liquidity Coverage Ratio)',
    prompt: `Selon les normes prudentielles de la BCC inspirées de Bâle III, le ratio LCR est défini comme le rapport entre les Actifs Liquides de Haute Qualité (HQLA) et les Sorties Nettes de Trésorerie à 30 jours dans un scénario de crise :
LCR = (Total HQLA) / (Sorties nettes à 30 jours) ≥ 100%.

Une banque commerciale congolaise dispose de 120 millions USD de HQLA. 
Ses flux prévisionnels de crise sur 30 jours sont :
- Sorties de trésorerie attendues (retraits dépôts) : 180 millions USD
- Entrées de trésorerie contractuelles : 80 millions USD
Attention : la réglementation plafonne les entrées de trésorerie prises en compte à 75% du total des sorties de trésorerie brutes.
Quel est le ratio LCR exact de cette banque et est-elle conforme ?`,
    options: [
      'LCR = 120%, Conforme (>= 100%)',
      'LCR = 85.7%, Non conforme (< 100%)',
      'LCR = 100%, Conforme',
      'LCR = 66.7%, Non conforme'
    ],
    correctIndex: 0,
    explanation: {
      summary: 'Calcul des sorties nettes avec contrôle du plafond d\'entrées réglementaires.',
      steps: [
        'Plafond des entrées : 75% de 180M$ = 135 millions USD.',
        'Entrées réelles = 80 millions USD < 135M$. Les 80 millions sont donc intégralement déductibles.',
        'Sorties nettes de trésorerie = Sorties (180) - Entrées (80) = 100 millions USD.',
        'Ratio LCR = Total HQLA / Sorties nettes = 120M$ / 100M$ = 120%.',
        '120% ≥ 100% : La banque est donc en conformité réglementaire.'
      ],
      bccRelevance: 'La DSIF de la BCC effectue ce contrôle chaque fin de mois pour éviter qu\'une crise de panique bancaire ne se propage au reste du secteur financier congolais.',
      proTip: 'Vérifiez toujours si le cap de 75% sur les entrées est activé avant de soustraire.'
    },
    timeEstimateSeconds: 50
  },
  {
    id: 'risk_prud_02',
    category: 'bank_risk_prudential',
    categoryLabel: 'Risque de Crédit & NPL',
    difficulty: 'difficile',
    title: 'Calcul du Taux de Créances en Souffrance (NPL) et Taux de Couverture',
    prompt: `Le portefeuille global de crédits d'une banque commerciale s'élève à 800 millions USD. 
Les données de surveillance de la BCC indiquent :
- Créances saines : 680 millions USD
- Créances pré-douteuses (Watchlist) : 40 millions USD
- Créances douteuses et litigieuses : 80 millions USD
- Provisions constituées par la banque pour ces créances douteuses : 56 millions USD
Quels sont respectivement le taux de NPL (créances douteuses / portefeuille brut) et le taux de couverture des NPL par les provisions ?`,
    options: [
      'Taux NPL = 10.0%, Taux de couverture = 70.0%',
      'Taux NPL = 15.0%, Taux de couverture = 50.0%',
      'Taux NPL = 10.0%, Taux de couverture = 56.0%',
      'Taux NPL = 12.5%, Taux de couverture = 80.0%'
    ],
    correctIndex: 0,
    explanation: {
      summary: 'Les ratios de qualité des actifs bancaires selon la méthodologie FMI / Banque Centrale.',
      steps: [
        'Portefeuille brut total = 800 millions USD.',
        'Créances non-performantes (NPL - douteuses et litigieuses) = 80 millions USD.',
        'Taux NPL = 80M$ / 800M$ = 10.0%.',
        'Provisions constituées = 56 millions USD.',
        'Taux de couverture = Provisions / NPL = 56M$ / 80M$ = 0.70 = 70.0%.'
      ],
      bccRelevance: 'En RDC, un taux de NPL supérieur à 8% et un taux de couverture inférieur à 60% déclenchent une inspection ciblée sur place par les inspecteurs de la BCC.',
      proTip: 'Ne confondez pas le dénominateur : le taux NPL se calcule sur le total brut des crédits, tandis que la couverture se calcule sur les NPL uniquement.'
    },
    timeEstimateSeconds: 40
  },

  // ==========================================
  // 6. REPORTING DÉCISIONNEL & POLITIQUE MONÉTAIRE (CPM)
  // ==========================================
  {
    id: 'cpm_rep_01',
    category: 'monetary_reporting_cpm',
    categoryLabel: 'Politique Monétaire & Agrégats BCC',
    difficulty: 'difficile',
    title: 'Consolidation de la Masse Monétaire (M1 vs M2 vs M3 en RDC)',
    prompt: `Dans une économie fortement dollarisée comme celle de la République Démocratique du Congo, le Comité de Politique Monétaire (CPM) étudie la dynamique de la masse monétaire.
Voici les composantes relevées en fin de mois :
- Billets et monnaies en circulation (Francs Congolais) : 3 000 milliards CDF
- Dépôts à vue transférables en Francs Congolais : 2 000 milliards CDF
- Dépôts en devises étrangères (USD) transférables et à terme : 18 000 milliards CDF (contre-valeur)
- Titres de créance et bons BCC détenus par le public : 500 milliards CDF
Quel est le montant exact de l'agrégat monétaire étroit M1 et de la masse monétaire au sens large M2 ?`,
    options: [
      'M1 = 5 000 milliards CDF ; M2 = 23 000 milliards CDF',
      'M1 = 3 000 milliards CDF ; M2 = 20 000 milliards CDF',
      'M1 = 23 000 milliards CDF ; M2 = 23 500 milliards CDF',
      'M1 = 5 000 milliards CDF ; M2 = 5 500 milliards CDF'
    ],
    correctIndex: 0,
    explanation: {
      summary: 'Structure standard des agrégats monétaires de la BCC.',
      steps: [
        'M1 (monnaie au sens étroit) = Monnaie fiduciaire en circulation (3 000) + Dépôts à vue en monnaie nationale (2 000) = 5 000 milliards CDF.',
        'M2 (monnaie au sens large) = M1 (5 000) + Quasi-monnaie (dépôts en devises + dépôts à terme) (18 000) = 23 000 milliards CDF.',
        'M3 engloberait en plus les instruments négociables du marché monétaire (Bons BCC : 500 milliards => M3 = 23 500 milliards CDF).'
      ],
      bccRelevance: 'En RDC, la quasi-monnaie en devises représente plus de 75% de M2, ce qui limite l\'efficacité de la transmission de la politique monétaire par le seul canal du taux directeur.',
      proTip: 'Rappel essentiel : M1 = Fiduciaire + Scripturale à vue en monnaie locale. M2 = M1 + Quasi-monnaie (notamment les dépôts en devises).'
    },
    timeEstimateSeconds: 45
  },
  {
    id: 'cpm_rep_02',
    category: 'monetary_reporting_cpm',
    categoryLabel: 'Reporting Stratégique Gouverneur',
    difficulty: 'difficile',
    title: 'Arbitrage Macroéconomique : Choc Exogène & Réserve de Change',
    prompt: `La note de conjoncture économique préparée pour Madame la Gouverneure de la BCC révèle une chute de 30% des cours du cuivre à la bourse des métaux de Londres (LME). 
Les exportations minières rapportant 90% des devises de la RDC, quelles sont les DEUX conséquences immédiates sur le tableau de bord de la BCC et quelle mesure de riposte est classiquement recommandée au CPM ?`,
    options: [
      'Conséquences : Pression à la dépréciation du CDF et contraction des réserves de change. Riposte recommandée : Relèvement du taux directeur et adjudication ponctuelle de devises ciblée pour lisser la volatilité sans épuiser les réserves.',
      'Conséquences : Appréciation subite du CDF et hausse des réserves de change. Riposte : Baisse immédiate du taux directeur à 0%.',
      'Conséquences : Aucun impact sur le taux de change car le cuivre est coté en Dollars. Riposte : Émission massive de monnaie fiduciaire.',
      'Conséquences : Hausse mécanique des excédents budgétaires. Riposte : Augmentation des réserves obligatoires à 100% sur le CDF.'
    ],
    correctIndex: 0,
    explanation: {
      summary: 'Mécanisme fondamental de transmission d\'un choc de termes de l\'échange en économie rentière minière.',
      steps: [
        '1. La baisse du cours du cuivre diminue drastiquement les flux d\'entrée de devises (USD) dans le système bancaire congolais.',
        '2. Moins de dollars disponibles sur le marché interbancaire => déséquilibre offre/demande de devises => pression forte à la dépréciation du CDF par rapport à l\'USD.',
        '3. Le Trésor et la BCC voient leurs rentrées fiscales en devises chuter => risque d\'érosion des réserves internationales de change.',
        '4. Décision CPM : Relever le taux directeur pour freiner la création monétaire en CDF (éviter la spéculation contre le CDF) et organiser des ventes de devises ordonnées par voie d\'adjudication.'
      ],
      bccRelevance: 'C\'est le scénario de stress test le plus fréquent simulé par les macro-économistes et data analysts de la BCC.',
      proTip: 'Dans tout oral ou écrit BCC : associez toujours Choc Matières Premières -> Dépréciation CDF -> Hausse Taux Directeur / Régulation de la Liquidité.'
    },
    timeEstimateSeconds: 50
  },

  // ==========================================
  // QUESTIONS SUPPLÉMENTAIRES HAUT IMPACT
  // ==========================================
  {
    id: 'psy_log_04',
    category: 'psychotech_logic',
    categoryLabel: 'Logique & Algèbre Booléenne',
    difficulty: 'difficile',
    title: 'Validation d\'Éligibilité au Refinancement (Guichet de la BCC)',
    prompt: `Pour qu'une banque commerciale accède au guichet de prêt marginal de refinancement de la BCC, elle doit valider l'expression logique suivante :
Condition = (Ratio_Solvabilite ≥ 10.5% OR Collatéral_Bons_Trésor > 50M$) AND NOT (En_Défaut_Compensation) AND (Ratio_Liquidite ≥ 100%).

Quatre banques soumettent leurs états :
- Banque W : Solvabilité 11%, Collatéral 20M$, En Défaut = NON, Liquidité 98%
- Banque X : Solvabilité 9%, Collatéral 60M$, En Défaut = NON, Liquidité 105%
- Banque Y : Solvabilité 12%, Collatéral 80M$, En Défaut = OUI, Liquidité 110%
- Banque Z : Solvabilité 10%, Collatéral 45M$, En Défaut = NON, Liquidité 102%

Quelle banque est ÉLIGIBLE au refinancement ?`,
    options: ['Banque X uniquement', 'Banque W uniquement', 'Banque Y et X', 'Banque Z uniquement'],
    correctIndex: 0,
    explanation: {
      summary: 'Évaluation booléenne rigoureuse des conditions de guichet.',
      steps: [
        'Banque W : Liquidité 98% < 100% => Échoue la dernière condition (AND Liquidite ≥ 100%). Non éligible.',
        'Banque X : (9% ≥ 10.5% [Faux] OR Collatéral 60M$ > 50M$ [Vrai]) => VRAI. En Défaut = NON => VRAI. Liquidité 105% ≥ 100% => VRAI. Tous les termes AND sont vrais => ÉLIGIBLE !',
        'Banque Y : En Défaut = OUI => NOT(En_Défaut) est FAUX => Non éligible.',
        'Banque Z : Solvabilité 10% < 10.5% [Faux] ET Collatéral 45M$ < 50M$ [Faux] => Premier terme faux => Non éligible.'
      ],
      bccRelevance: 'Les systèmes d\'information de la Direction des Opérations Bancaires et des Marchés exécutent ces filtres logiques en temps réel pour accorder ou refuser les lignes de refinancement.',
      proTip: 'Évaluez d\'abord les conditions bloquantes directes (NOT Défaut et Liquidité >= 100%) pour éliminer immédiatement des candidats.'
    },
    timeEstimateSeconds: 40
  },
  {
    id: 'sql_data_04',
    category: 'sql_data_analysis',
    categoryLabel: 'SQL Avancé & Classement',
    difficulty: 'difficile',
    title: 'Top 3 Banques par Volume de Crédit Octroyé par Province (DENSE_RANK)',
    prompt: `Pour un rapport annuel de bancarisation territoriale en RDC, la DSIF vous demande de lister pour chaque province congolaise (Kinshasa, Haut-Katanga, Kongo-Central, etc.) les banques classées dans le Top 3 par volume total de crédit, en gérant les ex-æquo sans sauter de rang.
Quelle fonction de fenêtrage devez-vous impérativement employer ?`,
    options: [
      'DENSE_RANK() OVER (PARTITION BY province ORDER BY total_credit DESC)',
      'RANK() OVER (ORDER BY province, total_credit DESC)',
      'ROW_NUMBER() OVER (PARTITION BY province ORDER BY total_credit DESC)',
      'NTILE(3) OVER (PARTITION BY province ORDER BY total_credit)'
    ],
    correctIndex: 0,
    explanation: {
      summary: 'DENSE_RANK attribue des rangs consécutifs même en cas d\'égalités (ex: 1, 2, 2, 3), sans sauter de numéro comme le ferait RANK (1, 2, 2, 4).',
      steps: [
        'PARTITION BY province permet de réinitialiser le classement pour chaque province de la RDC.',
        'ORDER BY total_credit DESC classe du plus gros volume au plus petit.',
        'DENSE_RANK() garantit que si deux banques sont 2e ex-æquo, la suivante sera 3e (permettant un filtre WHERE rang <= 3 fiable).'
      ],
      bccRelevance: 'Les rapports statistiques de la BCC classent régulièrement les banques par province pour mesurer l\'inclusion financière en dehors de Kinshasa et Lubumbashi.',
      proTip: 'Retenez la différence cruciale : ROW_NUMBER = numérotation brute sans égalité ; RANK = saute des rangs si égalité ; DENSE_RANK = ne saute aucun rang.'
    },
    timeEstimateSeconds: 35
  },
  {
    id: 'py_econ_03',
    category: 'python_econometrics',
    categoryLabel: 'Python & Nettoyage de Données Financières',
    difficulty: 'difficile',
    title: 'Gestion des Valeurs Manquantes et Détection d\'Outliers dans les Flux SWIFT',
    prompt: `Un script Python d'ingestion de flux interbancaires reçoit des déclarations hebdomadaires. Certaines lignes comportent des valeurs aberrantes (outliers) causées par des erreurs de saisie manuelle (ex: montant multiplié par 1 000 en tapant trois zéros superflus).
Quelle méthode statistique basée sur l'écart interquartile (IQR) élimine formellement les valeurs aberrantes selon le standard d'audit bancaire ?`,
    contextData: {
      type: 'code',
      codeLanguage: 'python',
      codeSnippet: `Q1 = df['montant'].quantile(0.25)
Q3 = df['montant'].quantile(0.75)
IQR = Q3 - Q1
borne_inf = Q1 - 1.5 * IQR
borne_sup = Q3 + 1.5 * IQR
df_clean = df[(df['montant'] >= borne_inf) & (df['montant'] <= borne_sup)]`
    },
    options: [
      'La formule de Tukey (Q1 - 1.5*IQR et Q3 + 1.5*IQR) est le standard statistique robuste non paramétrique pour le filtrage des outliers.',
      'Cette méthode est fausse : il faut toujours remplacer les montants par la moyenne de la colonne.',
      'Le coefficient standard de Tukey doit être de 10.0 et non 1.5 pour le secteur bancaire.',
      'Il est interdit de filtrer les données en Python : il faut obligatoirement le faire sous Excel.'
    ],
    correctIndex: 0,
    explanation: {
      summary: 'La règle de Tukey avec un facteur 1.5 est la méthode de référence pour détecter les valeurs atypiques sans supposer une loi normale.',
      steps: [
        'IQR (Interquartile Range) = Q3 - Q1 mesure la dispersion des 50% de données centrales.',
        'Les seuils [Q1 - 1.5*IQR ; Q3 + 1.5*IQR] délimitent les moustaches d\'une boîte à moustaches (Boxplot).',
        'Cette approche est insensible aux valeurs extrêmes (robuste), contrairement à la moyenne et l\'écart-type (règle des 3-sigma).'
      ],
      bccRelevance: 'La DIT et la DRS nettoient quotidiennement des millions d\'enregistrements de transactions déclarées par les banques avant publication officielle.',
      proTip: 'Pour des anomalies extrêmes (« far out »), on utilise parfois un facteur 3.0*IQR, mais 1.5*IQR est la référence testée.'
    },
    timeEstimateSeconds: 40
  },
  {
    id: 'risk_prud_03',
    category: 'bank_risk_prudential',
    categoryLabel: 'Solvabilité & Ratios Bâlois à la BCC',
    difficulty: 'difficile',
    title: 'Ratio de Solvabilité Globale (Fonds Propres / RWA)',
    prompt: `La réglementation de la BCC impose aux banques commerciales un ratio de solvabilité minimal de 10% (Fonds propres réglementaires / Actifs pondérés des risques - RWA).
Une banque commerciale présente les postes d'actifs suivants :
- Bons du Trésor congolais en CDF : 100 millions USD (pondération risque 0%)
- Prêts garantis par hypothèques résidentielles : 200 millions USD (pondération risque 50%)
- Crédits aux entreprises privées sans notation : 300 millions USD (pondération risque 100%)
Quel est le montant minimal de Fonds Propres Réglementaires que cette banque doit détenir pour être en règle avec la BCC ?`,
    options: ['40 millions USD', '60 millions USD', '30 millions USD', '50 millions USD'],
    correctIndex: 0,
    explanation: {
      summary: 'Calcul des Actifs Pondérés des Risques (RWA - Risk-Weighted Assets) puis application du ratio minimal de 10%.',
      steps: [
        'RWA Bons du Trésor : 100M$ x 0% = 0 million USD.',
        'RWA Prêts hypothécaires : 200M$ x 50% = 100 millions USD.',
        'RWA Crédits entreprises : 300M$ x 100% = 300 millions USD.',
        'Total RWA = 0 + 100 + 300 = 400 millions USD.',
        'Fonds Propres Minimaux requis = 10% de 400M$ = 40 millions USD.'
      ],
      bccRelevance: 'C\'est le pilier 1 de la réglementation prudentielle surveillé trimestriellement par la Banque Centrale pour prévenir le risque d\'insolvabilité bancaire.',
      proTip: 'Les titres d\'État souverains en monnaie locale bénéficient d\'une pondération de risque nulle (0%).'
    },
    timeEstimateSeconds: 45
  },
  {
    id: 'tel_bcc_01',
    category: 'bank_risk_prudential',
    categoryLabel: 'Monnaie Électronique & Régulation EME (Télécoms)',
    difficulty: 'difficile',
    title: 'Audit du Ratio de Cantonnement Obligatoire (Instruction n°24 BCC)',
    prompt: `Selon l'Instruction administrative n°24 de la BCC régissant les Émetteurs de Monnaie Électronique (EME) issus des opérateurs télécoms (M-Pesa, Airtel Money, Orange Money) :
La totalité de la valeur de la monnaie électronique en circulation (Float e-money émis) doit être couverte à 100% par des dépôts réels logés sur un compte de cantonnement (Trust Account) auprès d'une banque commerciale agréée en RDC.

L'extraction de données au 30 octobre indique :
- Encours total de monnaie électronique dans les portefeuilles clients et agents : 420 milliards CDF
- Solde certifié du compte de cantonnement chez la banque partenaire : 395 milliards CDF
- Virements interbancaires RTGS de réapprovisionnement en transit : 15 milliards CDF
En tant que Data Analyst à la DSIF supervisant les EME, quel est le diagnostic prudentiel exact ?`,
    options: [
      'Déficit de couverture de 10 milliards CDF non conforme : les fonds en transit ne sont pas admis tant qu\'ils ne sont pas crédités sur le compte de cantonnement.',
      'Conformité parfaite car 395 + 15 = 410 milliards CDF est proche de 420 milliards CDF.',
      'L\'EME a le droit d\'avoir un découvert de 50 milliards CDF selon la réglementation télécom.',
      'Les opérateurs télécoms ne sont pas soumis au contrôle de la Banque Centrale du Congo.'
    ],
    correctIndex: 0,
    explanation: {
      summary: 'L\'Instruction n°24 impose une couverture continue à 100% en fonds effectifs disponibles sans tolérance de découvert.',
      steps: [
        'Float de monnaie électronique en circulation = 420 milliards CDF.',
        'Fonds réels cantonnés disponibles = 395 milliards CDF.',
        'Les fonds en transit (15 milliards) ne sont pas encore définitivement compensés et inscrits au crédit du compte fiduciaire.',
        'Écart non couvert = 420 - 395 = 25 milliards (ou même si 410, il manque 10 milliards).',
        'Conséquence : La BCC met en demeure l\'EME de recapitaliser immédiatement son compte sous 24h sous peine de suspension de l\'émission de monnaie électronique.'
      ],
      bccRelevance: 'Les Data Analysts de la BCC vérifient chaque matin par script automatisé la stricte parité 1:1 entre le solde e-money de la base télécom et le relevé bancaire certifié.',
      proTip: 'Retenez : Float EME = 100% de dépôts cantonnés à la banque. Tolérance zéro sur le découvert.'
    },
    timeEstimateSeconds: 45
  },
  {
    id: 'tel_bcc_02',
    category: 'sql_data_analysis',
    categoryLabel: 'SQL & Réconciliation Télécom-Banque',
    difficulty: 'difficile',
    title: 'Réconciliation des Transactions du Switch National de Paiement',
    prompt: `Sur le Switch National de Paiement de la BCC qui interconnecte les opérateurs télécoms (Mobile Money) et les banques commerciales, vous devez réconcilier les flux interopérables de fin de journée pour détecter les transactions orphelines (débitées côté wallet télécom mais non créditées côté compte bancaire).
Quelle instruction SQL avec LEFT JOIN et filtre sur NULL isole exactement ces anomalies ?`,
    contextData: {
      type: 'code',
      codeLanguage: 'sql',
      codeSnippet: `SELECT t.tx_id, t.msisdn, t.montant_cdf, t.horodatage
FROM telecom_wallet_debits t
LEFT JOIN bcc_switch_credits b ON t.tx_id = b.tx_id
WHERE b.tx_id IS NULL AND t.horodatage >= CURRENT_DATE;`
    },
    options: [
      'Cette requête avec LEFT JOIN ... WHERE b.tx_id IS NULL est l\'algorithme standard d\'anti-jointure pour isoler les orphelins côté banque.',
      'Il faut obligatoirement utiliser un INNER JOIN pour trouver les transactions orphelines.',
      'La clause WHERE b.tx_id IS NULL provoque une erreur de syntaxe en SQL.',
      'Un FULL OUTER JOIN est strictement interdit dans les systèmes de paiement.'
    ],
    correctIndex: 0,
    explanation: {
      summary: 'Le pattern LEFT JOIN combiné avec WHERE right_table.key IS NULL est la technique fondamentale d\'anti-jointure pour trouver les enregistrements non réconciliés.',
      steps: [
        'Le LEFT JOIN garde toutes les transactions du système émetteur télécom.',
        'Si la transaction a bien été reçue et créditée par le switch bancaire, b.tx_id contiendra une valeur non-nulle.',
        'La condition WHERE b.tx_id IS NULL filtre pour ne garder QUE les débits télécoms qui n\'ont jamais abouti sur le switch bancaire.',
        'Ce contrôle permet d\'ordonner la rétrocession immédiate des fonds au client congolais.'
      ],
      bccRelevance: 'C\'est l\'un des scripts d\'audit les plus fréquents exécutés à la DIT de la BCC pour protéger les consommateurs et assurer la fiabilité du Switch National.',
      proTip: 'Maîtrisez le pattern "Anti-Join" (LEFT JOIN + IS NULL) : il revient systématiquement dans les tests techniques de data analyst bancaire.'
    },
    timeEstimateSeconds: 45
  },
  {
    id: 'sql_data_05',
    category: 'sql_data_analysis',
    categoryLabel: 'SQL & Traitement des Valeurs Nulles',
    difficulty: 'difficile',
    title: 'Imputation Sécurisée des Ratios Prudentiels (COALESCE vs NULLIF)',
    prompt: `Dans le système d'ingestion des déclarations bilancielles des banques à la DSIF, vous calculez le ratio de levier financier :
Ratio_Levier = Total_Exposition / Fonds_Propres_Nets.
Certaines petites banques en redressement ont des Fonds_Propres_Nets nuls (0 CDF), et d'autres ont omis de renseigner la colonne (NULL).
Quelle expression SQL prévient à la fois l'erreur de division par zéro ("division by zero") et remplace un ratio manquant par la valeur par défaut 0.00 ?`,
    options: [
      'COALESCE(ROUND(total_exposition / NULLIF(fonds_propres_nets, 0), 2), 0.00)',
      'ROUND(total_exposition / COALESCE(fonds_propres_nets, 0), 2)',
      'IFNULL(total_exposition / fonds_propres_nets, 0)',
      'NULLIF(total_exposition / COALESCE(fonds_propres_nets, 0), 0.00)'
    ],
    correctIndex: 0,
    explanation: {
      summary: 'Combinaison canonique de NULLIF pour transformer les zéros en NULL, évitant ainsi le crash SQL, et de COALESCE pour convertir le NULL final en zéro.',
      steps: [
        '1. Si fonds_propres_nets = 0, NULLIF(fonds_propres_nets, 0) retourne NULL.',
        '2. Toute division par NULL (total_exposition / NULL) retourne NULL sans déclencher d\'exception fatale (alors que diviser par 0 stoppe la requête).',
        '3. COALESCE(expression, 0.00) intercepte le NULL résultant (ou si fonds_propres_nets était déjà NULL) et renvoie proprement 0.00.'
      ],
      bccRelevance: 'En data engineering à la BCC, les pipelines ETL automatisés de nuit ne doivent jamais planter sur une division par zéro lors de l\'ingestion des 15 banques.',
      proTip: 'Retenez la formule blindée : COALESCE(x / NULLIF(y, 0), 0).'
    },
    timeEstimateSeconds: 40
  },
  {
    id: 'sql_data_06',
    category: 'sql_data_analysis',
    categoryLabel: 'SQL & Agrégation Temporelle',
    difficulty: 'difficile',
    title: 'Agrégation Mensuelle des Flux de Devises avec DATE_TRUNC',
    prompt: `Pour la Note Trimestrielle de Politique Monétaire du Gouverneur, vous devez consolider les volumes mensuels d'achats et de ventes de dollars américains réalisés par la BCC sur le marché interbancaire de change.
Quelle clause de groupement temporel standard PostgreSQL permet d'obtenir un regroupement exact par mois calendaire (ex: 2026-08-01, 2026-09-01, 2026-10-01) ?`,
    options: [
      'GROUP BY DATE_TRUNC(\'month\', date_operation)',
      'GROUP BY EXTRACT(month FROM date_operation)',
      'GROUP BY TO_CHAR(date_operation, \'MM\')',
      'GROUP BY MONTH(date_operation)'
    ],
    correctIndex: 0,
    explanation: {
      summary: 'DATE_TRUNC(\'month\', date) conserve l\'année et le mois sous forme de timestamp tronqué, évitant de fusionner les mois d\'années différentes.',
      steps: [
        'EXTRACT(month FROM date) ou TO_CHAR(\'MM\') ne renvoie que le numéro du mois (1 à 12). Si vos données couvrent 2025 et 2026, octobre 2025 sera confondu avec octobre 2026 !',
        'DATE_TRUNC(\'month\', date) renvoie \'2026-10-01 00:00:00\', ce qui préserve l\'ordre chronologique exact dans les séries temporelles de la Banque Centrale.',
        'MONTH() n\'existe pas nativement en PostgreSQL (standard MySQL/SQL Server).'
      ],
      bccRelevance: 'La Direction de la Recherche prépare les séries chronologiques de balance des paiements en agrégeant avec DATE_TRUNC pour alimenter les modèles économétriques.',
      proTip: 'Pour toute série temporelle pluriannuelle en SQL, préférez toujours DATE_TRUNC(\'month\', col) à EXTRACT.'
    },
    timeEstimateSeconds: 40
  },
  {
    id: 'sql_data_07',
    category: 'sql_data_analysis',
    categoryLabel: 'SQL & Auto-Jointures Détection Fraude',
    difficulty: 'difficile',
    title: 'Détection de Virements Circulaires Miroirs (Self-Join)',
    prompt: `Pour débusquer un réseau de fausse facturation entre deux filiales d'une même société à Kinshasa et Lubumbashi, vous cherchez les paires d'opérations où la Banque A a viré un montant X à la Banque B, et la Banque B a reversé exactement ce même montant X à la Banque A dans un délai inférieur à 2 heures.
Quelle technique SQL est spécifiquement conçue pour comparer des lignes d'une même table de transactions ?`,
    options: [
      'Une auto-jointure (Self-Join) : FROM virements t1 JOIN virements t2 ON t1.emetteur = t2.recepteur AND t1.recepteur = t2.emetteur AND t1.montant = t2.montant',
      'Une sous-requête UNION ALL',
      'Un CROSS JOIN non filtré',
      'Une fonction trigonométrique SIN / COS'
    ],
    correctIndex: 0,
    explanation: {
      summary: 'La Self-Join (auto-jointure) permet de comparer une table avec elle-même en utilisant deux alias distincts (t1 et t2).',
      steps: [
        'On instancie deux fois la table : `FROM virements t1 JOIN virements t2`.',
        'On lie l\'émetteur de l\'un au récepteur de l\'autre : `ON t1.emetteur = t2.recepteur AND t1.recepteur = t2.emetteur`.',
        'On égalise le montant : `AND t1.montant = t2.montant`.',
        'On ajoute la condition d\'intervalle temporel : `AND t2.horodatage > t1.horodatage AND t2.horodatage <= t1.horodatage + INTERVAL \'2 hours\'`.'
      ],
      bccRelevance: 'La cellule de détection d\'anomalies de la BCC applique cette requête pour repérer les opérations de gonflage artificiel de bilan en fin de trimestre.',
      proTip: 'Pour détecter les boucles financières ou opérations réciproques, pensez immédiatement à la Self-Join avec alias distincts.'
    },
    timeEstimateSeconds: 50
  },
  {
    id: 'py_econ_04',
    category: 'python_econometrics',
    categoryLabel: 'Python & Séries Temporelles Économiques',
    difficulty: 'difficile',
    title: 'Calcul de la Moyenne Mobile et Volatilité Glissante sous Pandas',
    prompt: `Un Data Analyst de la BCC analyse la trajectoire du Franc Congolais sur 365 jours. Pour lisser le bruit quotidien des spéculateurs de la Place Victoire et dégager la tendance lourde, il exécute :

\`\`\`python
df['cours_lisse'] = df['taux_indicatif'].rolling(window=7).mean()
df['volatilite_7j'] = df['taux_indicatif'].rolling(window=7).std()
\`\`\`

Combien de valeurs NaN (Not a Number) apparaîtront au tout début de la colonne \`cours_lisse\` et que représente \`volatilite_7j\` ?`,
    options: [
      'Exactement 6 valeurs NaN, et volatilite_7j mesure l\'écart-type glissant (dispersion) sur une fenêtre hebdomadaire.',
      '7 valeurs NaN, et volatilite_7j mesure la médiane des taux.',
      '0 valeur NaN car Pandas remplace automatiquement par 0.',
      '1 valeur NaN seulement.'
    ],
    correctIndex: 0,
    explanation: {
      summary: 'Par défaut, une fenêtre glissante de taille k nécessite k observations pour calculer la première valeur statistique, laissant k-1 NaN au début.',
      steps: [
        'Taille de fenêtre = 7 jours.',
        'Les lignes d\'index 0, 1, 2, 3, 4, 5 (soit 6 lignes) ont moins de 7 valeurs antérieures disponibles => elles reçoivent la valeur NaN.',
        'La première moyenne calculée se trouve à l\'index 6 (7ème jour).',
        '.std() calcule l\'écart-type de l\'échantillon (degré de volatilité et de dispersion du cours de change sur 7 jours roulants).'
      ],
      bccRelevance: 'La Note de Conjoncture Hebdomadaire de la BCC présente toujours la courbe lissée sur 7 jours et 30 jours pour isoler les chocs transitoires.',
      proTip: 'Règle générale : `rolling(window=k)` génère toujours k - 1 valeurs `NaN` initiales sauf si `min_periods=1` est spécifié.'
    },
    timeEstimateSeconds: 40
  },
  {
    id: 'py_econ_05',
    category: 'python_econometrics',
    categoryLabel: 'Data Science & Statistiques Inférentielles',
    difficulty: 'difficile',
    title: 'Asymétrie (Skewness) et Concentration des Dépôts Bancaires en RDC',
    prompt: `L'analyse statistique de la distribution des soldes de dépôts bancaires des 15 banques congolaises révèle :
- Moyenne des dépôts : 45 000 USD
- Médiane des dépôts : 280 USD
- Coefficient d'asymétrie de Fisher-Pearson (Skewness) : +4.82
Quelle est la conclusion analytique rigoureuse pour le rapport d'inclusion financière ?`,
    options: [
      'Distribution fortement asymétrique à droite (étalée vers la droite) : une immense majorité d\'épargnants ont de très petits soldes, tandis qu\'une poignée d\'entreprises minières et grands déposants tirent la moyenne vers le haut.',
      'Distribution symétrique normale (loi de Gauss) car la moyenne est positive.',
      'Distribution asymétrique à gauche (étalée vers la gauche) où la majorité détient des millions de dollars.',
      'Le calcul est faux car la moyenne doit toujours être égale à la médiane.'
    ],
    correctIndex: 0,
    explanation: {
      summary: 'Quand Moyenne >> Médiane et Skewness > 0, la distribution présente une queue droite très allongée typique des distributions de Pareto.',
      steps: [
        'Moyenne (45 000 $) >> Médiane (280 $) : Plus de 50% des comptes ont moins de 280 USD !',
        'Skewness = +4.82 > 0 : Asymétrie positive marquée (queue de distribution vers les valeurs géantes).',
        'En RDC, la bancarisation est caractérisée par une forte concentration des dépôts corporatifs miniers et télécoms face à une grande masse de comptes de particuliers peu garnis.'
      ],
      bccRelevance: 'La BCC utilise ce diagnostic pour paramétrer le Fonds de Garantie des Dépôts en RDC (FOGADEC) et déterminer le plafond d\'indemnisation par déposant.',
      proTip: 'Moyenne > Médiane => Skewness > 0 (Asymétrie positive / queue à droite).'
    },
    timeEstimateSeconds: 40
  },
  {
    id: 'entry_psy_01',
    category: 'psychotech_entry_level',
    categoryLabel: 'Psychotechnique Débutant (Premier Emploi)',
    difficulty: 'moyen',
    title: 'Suite Logique de Dominos (Arithmétique Modulaire Base 7)',
    prompt: `Dans une épreuve psychotechnique standard de recrutement pour débutants, on vous présente la suite de 4 dominos suivants :
Domino 1 : [ 2 / 5 ]
Domino 2 : [ 3 / 4 ]
Domino 3 : [ 4 / 3 ]
Domino 4 : [ 5 / 2 ]
Quel est le Domino 5 suivant la suite logique (rappel : les dominos vont de 0 à 6) ?`,
    options: ['[ 6 / 1 ]', '[ 6 / 0 ]', '[ 5 / 1 ]', '[ 0 / 2 ]'],
    correctIndex: 0,
    explanation: {
      summary: 'Les valeurs du haut augmentent de +1 tandis que les valeurs du bas diminuent de -1.',
      steps: [
        'Partie supérieure : 2 -> 3 -> 4 -> 5 -> la valeur suivante est 6 (+1 à chaque pas).',
        'Partie inférieure : 5 -> 4 -> 3 -> 2 -> la valeur suivante est 1 (-1 à chaque pas).',
        'Le domino recherché est donc obligatoirement [ 6 / 1 ].'
      ],
      bccRelevance: 'Ce test évalue votre capacité à dissocier deux flux d\'informations simultanés sans vous laisser distraire par la complexité visuelle.',
      proTip: 'Pour tout problème de dominos ou cartes, analysez toujours la moitié supérieure et la moitié inférieure de façon totalement indépendante.'
    },
    timeEstimateSeconds: 30
  },
  {
    id: 'entry_psy_02',
    category: 'psychotech_entry_level',
    categoryLabel: 'Psychotechnique Débutant (Premier Emploi)',
    difficulty: 'moyen',
    title: 'Raisonnement Logique & Syllogisme Formel',
    prompt: `Considérez comme vraies les deux prémisses suivantes :
1. « Tous les analystes de données de la BCC maîtrisent SQL. »
2. « Certains informaticiens de Kinshasa sont des analystes de données de la BCC. »

Laquelle des déductions suivantes est RIGOUREUSEMENT CERTAINE d'un point de vue logique ?`,
    options: [
      'Certains informaticiens de Kinshasa maîtrisent SQL.',
      'Tous les informaticiens de Kinshasa maîtrisent SQL.',
      'Toutes les personnes qui maîtrisent SQL travaillent à la BCC.',
      'Aucun informaticien de Kinshasa ne travaille à la BCC.'
    ],
    correctIndex: 0,
    explanation: {
      summary: 'Application classique du syllogisme d\'intersection (Mode Darii / Syllogisme aristotélicien).',
      steps: [
        'Soit A = les informaticiens de Kinshasa, B = les analystes de la BCC, C = ceux qui maîtrisent SQL.',
        'La prémisse 2 dit : il existe au moins un informaticien de Kinshasa qui est analyste BCC (A ∩ B ≠ ∅).',
        'La prémisse 1 dit : tout analyste BCC maîtrise SQL (B ⊆ C).',
        'Par transitivité, les informaticiens qui sont analystes BCC maîtrisent obligatoirement SQL. Donc : « Certains informaticiens de Kinshasa maîtrisent SQL » est mathématiquement certain.'
      ],
      bccRelevance: 'À la BCC, la rigueur de raisonnement déductif protège les rapports d\'audit contre les conclusions hâtives ou fausses.',
      proTip: 'Ne faites jamais d\'extrapolation : si la prémisse dit "certains", la conclusion ne peut jamais être "tous".'
    },
    timeEstimateSeconds: 35
  },
  {
    id: 'entry_psy_03',
    category: 'psychotech_entry_level',
    categoryLabel: 'Psychotechnique Débutant (Premier Emploi)',
    difficulty: 'moyen',
    title: 'Calcul Mental Rapide & Partage Proportionnel',
    prompt: `Une prime d'équipe de 1 200 USD doit être répartie entre trois jeunes assistants informaticiens (Christian, Sarah et Jean) proportionnellement au nombre de tickets d'assistance résolus cette semaine :
- Christian a résolu 5 tickets
- Sarah a résolu 8 tickets
- Jean a résolu 7 tickets
Quelle est la part exacte en USD revenant à Sarah ?`,
    options: ['480 USD', '420 USD', '500 USD', '300 USD'],
    correctIndex: 0,
    explanation: {
      summary: 'Partage au prorata : calcul de la valeur unitaire d\'une part puis multiplication par le coefficient individuel.',
      steps: [
        '1. Total des parts : 5 + 8 + 7 = 20 parts au total.',
        '2. Valeur financière d\'une part : 1 200 USD / 20 = 60 USD par ticket résolu.',
        '3. Part de Sarah (8 tickets) : 8 x 60 USD = 480 USD.',
        'Vérification : Christian = 5 x 60 = 300 $, Jean = 7 x 60 = 420 $. Total = 300 + 480 + 420 = 1 200 USD.'
      ],
      bccRelevance: 'Les calculs de clés de répartition et de prorata temporis sont omniprésents dans la comptabilité analytique et la gestion budgétaire de la Banque Centrale.',
      proTip: 'Additionnez toujours les parts (20), divisez le montant total par cette somme (60), puis multipliez par la part de la personne ciblée.'
    },
    timeEstimateSeconds: 35
  },
  {
    id: 'entry_psy_04',
    category: 'psychotech_entry_level',
    categoryLabel: 'Psychotechnique Débutant (Premier Emploi)',
    difficulty: 'moyen',
    title: 'Suite Numérique à Double Pas Alterné',
    prompt: `Déterminez le nombre qui complète logiquement la suite numérique suivante :
3,  7,  6,  14,  12,  28,  24,  [ ? ]`,
    options: ['56', '48', '36', '52'],
    correctIndex: 0,
    explanation: {
      summary: 'Il s\'agit d\'une suite entrelacée de deux règles arithmétiques distinctes.',
      steps: [
        'Méthode 1 (Pas à pas alterné) : ',
        '3 x 2 + 1 = 7 ; 7 - 1 = 6 ; 6 x 2 + 2 = 14 ; 14 - 2 = 12 ; 12 x 2 + 4 = 28 ; 28 - 4 = 24 ; 24 x 2 + 8 = 56.',
        'Méthode 2 (Deux sous-suites entrelacées - encore plus simple !) : ',
        'Rang impair (1er, 3e, 5e, 7e) : 3, 6, 12, 24 (on multiplie par 2 à chaque étape).',
        'Rang pair (2e, 4e, 6e, 8e) : 7, 14, 28, [ ? ] (on multiplie également par 2 à chaque étape : 28 x 2 = 56).',
        'La réponse est donc sans ambiguïté 56.'
      ],
      bccRelevance: 'La détection de sous-séries entrelacées teste votre plasticité cérébrale, indispensable pour déceler des signaux faibles dans des séries chronologiques.',
      proTip: 'Si les nombres oscillent (montent puis descendent), séparez immédiatement les positions paires et impaires en deux séries distinctes.'
    },
    timeEstimateSeconds: 35
  },
  {
    id: 'entry_psy_05',
    category: 'psychotech_entry_level',
    categoryLabel: 'Psychotechnique Débutant (Premier Emploi)',
    difficulty: 'moyen',
    title: 'Test d\'Attention aux Détails & Concordance Alphanumérique',
    prompt: `Dans le cadre de la vérification de conformité des relevés de comptes de compensation transmis à la BCC, vous devez comparer la liste de référence (Colonne A) avec la transcription saisie (Colonne B).
Combien de paires comportent EXACTEMENT UNE ERREUR de frappe ?

Paire 1 : [ CD05-BCC-9901-RAW-CDF ] vs [ CD05-BCC-9901-RAW-CDF ]
Paire 2 : [ CD14-EQB-8842-USD-001 ] vs [ CD14-EQB-8824-USD-001 ]
Paire 3 : [ CD22-TMB-1049-CDF-988 ] vs [ CD22-TMB-1049-CDF-988 ]
Paire 4 : [ CD30-FBN-7715-USD-450 ] vs [ CD30-FBN-7715-USD-45O ] (avec la lettre O au lieu du chiffre 0)`,
    options: ['Exactement 2 paires (Paire 2 et Paire 4)', '1 seule paire (Paire 2)', '3 paires', 'Aucune erreur'],
    correctIndex: 0,
    explanation: {
      summary: 'Repérage visuel minutieux des inversions de chiffres et des confusions chiffre 0 / lettre O.',
      steps: [
        'Paire 1 : strictement identique (0 erreur).',
        'Paire 2 : 8842 a été inversé en 8824 (1 erreur d\'inversion de chiffres).',
        'Paire 3 : strictement identique (0 erreur).',
        'Paire 4 : le dernier caractère est la lettre "O" dans la colonne B au lieu du chiffre "0" (1 erreur de caractère).',
        'Il y a donc exactement 2 paires erronées : la Paire 2 et la Paire 4.'
      ],
      bccRelevance: 'Les assistants informaticiens à la BCC contrôlent les fichiers d\'échange interbancaires où une seule coquille sur un RIB bloque l\'exécution du virement RTGS.',
      proTip: 'Comparez toujours les codes par blocs de 4 caractères de droite à gauche (notre cerveau est moins habitué à lire de droite à gauche, ce qui force l\'attention consciente).'
    },
    timeEstimateSeconds: 40
  },
  {
    id: 'entry_psy_06',
    category: 'psychotech_entry_level',
    categoryLabel: 'Psychotechnique Débutant (Premier Emploi)',
    difficulty: 'moyen',
    title: 'Jugement Situationnel : Éthique & Secret Bancaire BCC',
    prompt: `Vous êtes nouvellement recruté(e) comme assistant Data Analyste à la Banque Centrale du Congo. 
Vendredi soir, un proche parent commerçant au Grand Marché de Kinshasa vous demande discrètement si la BCC prévoit d'injecter des dollars américains sur le marché des changes lundi matin, affirmant que cela l'aiderait à décider s'il doit acheter des devises aujourd'hui.
Quelle est l'attitude PROFESSIONNELLE et ÉTHIQUE irréprochable imposée par le statut du personnel de la BCC ?`,
    options: [
      'Refuser poliment mais fermement de répondre, en rappelant que les données monétaires non publiées relèvent du secret professionnel absolu et que toute divulgation constitue une faute lourde passible de poursuites pénales.',
      'Lui donner un petit indice vague pour l\'aider sans lui révéler les chiffres précis.',
      'Lui vendre l\'information pour arrondir vos fins de mois.',
      'Consulter les réseaux sociaux pour voir si l\'information a déjà fuité avant de lui répondre.'
    ],
    correctIndex: 0,
    explanation: {
      summary: 'Le respect du secret professionnel et la confidentialité des décisions du CPM sont la règle numéro 1 de la Banque Centrale.',
      steps: [
        'Les interventions de la Banque Centrale sur le marché des changes ont un impact direct sur le taux de change de toute la République.',
        'Divulguer une information avant son communiqué officiel crée un délit d\'initié, fausse la concurrence et détruit la crédibilité de l\'institution.',
        'La seule réponse conforme au code d\'éthique de la BCC est le refus total et ferme de divulguer toute information interne.'
      ],
      bccRelevance: 'Ce type de question de jugement situationnel est systématiquement posé pour tester l\'intégrité morale des candidats qui n\'ont pas encore d\'antécédents en banque.',
      proTip: 'À la Banque Centrale, l\'intégrité et le secret professionnel priment sur toutes les relations amicales ou familiales.'
    },
    timeEstimateSeconds: 30
  }
];
