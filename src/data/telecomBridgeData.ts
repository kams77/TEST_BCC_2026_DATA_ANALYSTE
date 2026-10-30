export interface ConceptBridge {
  id: string;
  telecomConcept: string;
  telecomDescription: string;
  bccConcept: string;
  bccDescription: string;
  realWorldAnalogy: string;
  sqlPatternComparison: {
    telecomQuery: string;
    bccQuery: string;
  };
  interviewKeyPhrase: string;
}

export interface TelecomBccFaq {
  question: string;
  answer: string;
  bccInstructionRef: string;
}

export const TELECOM_BRIDGES: ConceptBridge[] = [
  {
    id: 'b_01',
    telecomConcept: 'Call Detail Record (CDR) & Logs Réseau',
    telecomDescription: 'Enregistrement horodaté de chaque appel, SMS ou session data (IMSI, MSISDN, cellule, durée, volume).',
    bccConcept: 'Transactions RTGS / ATS & Messages ISO 20022',
    bccDescription: 'Flux horodaté de chaque virement interbancaire de gros montant (BIC donneur, BIC bénéficiaire, montant, devise CDF/USD, statut).',
    realWorldAnalogy: 'Un message RTGS (ex: pacs.008 en norme ISO 20022) n\'est rien d\'autre qu\'un CDR financier standardisé avec contrôle strict de syntaxe et intégrité de solde.',
    sqlPatternComparison: {
      telecomQuery: `SELECT msisdn, DATE_TRUNC('hour', call_time), COUNT(*), SUM(duration_sec)
FROM cdr_voice 
GROUP BY 1, 2;`,
      bccQuery: `SELECT sender_bic, DATE_TRUNC('hour', tx_timestamp), COUNT(*), SUM(amount_cdf)
FROM rtgs_transfers 
GROUP BY 1, 2;`
    },
    interviewKeyPhrase: "Dans mon expérience télécom, j'ai l'habitude de traiter des dizaines de millions de CDR par jour. Les messages RTGS de la BCC obéissent aux mêmes impératifs d'indexation temporelle, d'intégrité et de latence sub-seconde."
  },
  {
    id: 'b_02',
    telecomConcept: 'Mobile Money Float (M-Pesa / Airtel Money / Orange Money)',
    telecomDescription: 'Total de la monnaie électronique en circulation dans les wallets clients et agents (UV/e-money).',
    bccConcept: 'Compte de Cantonnement Prudentiel (Trust Account)',
    bccDescription: 'Fonds réels en cash équivalents à 100% du Float, obligatoirement bloqués dans une banque commerciale agréée sous la supervision de la BCC.',
    realWorldAnalogy: 'L\'Instruction n°24 de la BCC interdit formellement à un opérateur de créer de la monnaie sans équivalent cash : Float virtuel = Dépôt bancaire cantonné.',
    sqlPatternComparison: {
      telecomQuery: `SELECT SUM(wallet_balance) AS total_float_circulant 
FROM mobile_money_wallets;`,
      bccQuery: `SELECT e.eme_name, 
       SUM(w.wallet_balance) AS float_virtuel,
       b.solde_compte_cantonnement,
       (b.solde_compte_cantonnement - SUM(w.wallet_balance)) AS ecart_couverture
FROM eme_wallets w
JOIN comptes_cantonnement_banques b ON w.eme_id = b.eme_id
GROUP BY e.eme_name, b.solde_compte_cantonnement;`
    },
    interviewKeyPhrase: "Venant du secteur télécom, je comprends intimement l'architecture du Float et de la réconciliation bilatérale avec le compte de cantonnement bancaire surveillé par la DSIF de la BCC."
  },
  {
    id: 'b_03',
    telecomConcept: 'Fraude SIM Box & Churn Télécoms',
    telecomDescription: 'Détournement d\'appels internationaux via cartes SIM locales et départs massifs d\'abonnés.',
    bccConcept: 'Smurfing / Blanchiment CENAREF & Bank Run (Ratio LCR)',
    bccDescription: 'Fractionnement de virements pour contourner le seuil de 10 000 USD et retraits paniques des dépôts.',
    realWorldAnalogy: 'Détecter un réseau de SIM Box ou détecter un réseau de mules financières (smurfing) utilise exactement les mêmes algorithmes de détection d\'anomalies et d\'analyse de graphes.',
    sqlPatternComparison: {
      telecomQuery: `SELECT sim_card_id, COUNT(DISTINCT called_number) 
FROM cdr_calls 
WHERE call_duration < 10 
GROUP BY 1 
HAVING COUNT(*) > 500;`,
      bccQuery: `SELECT sender_id, COUNT(DISTINCT receiver_id), SUM(amount_usd)
FROM interbank_transfers
WHERE amount_usd < 10000 
GROUP BY 1 
HAVING SUM(amount_usd) > 50000;`
    },
    interviewKeyPhrase: "La détection de fraude télécom m'a doté de réflexes analytiques pointus en détection d'outliers et de patterns suspects, directement transférables à la lutte anti-blanchiment à la BCC."
  },
  {
    id: 'b_04',
    telecomConcept: 'Congestion Réseau & Latence de Paquets',
    telecomDescription: 'Saturation de la bande passante entraînant des pertes de paquets et retards de commutation.',
    bccConcept: 'Gridlock de Liquidité ATS / RTGS',
    bccDescription: 'Blocage en cascade des virements interbancaires quand une banque manque de liquidité intrajournalière.',
    realWorldAnalogy: 'Comme un routeur qui empile les paquets en file d\'attente FIFO, le RTGS empile les ordres de paiement en attente d\'un collatéral de refinancement BCC.',
    sqlPatternComparison: {
      telecomQuery: `SELECT cell_tower_id, AVG(packet_drop_rate), AVG(latency_ms) 
FROM network_qos_hourly 
WHERE packet_drop_rate > 0.05;`,
      bccQuery: `SELECT debtor_bic, COUNT(*), SUM(instructed_amount) 
FROM rtgs_queue 
WHERE queue_status = 'BLOCKED_INSUFFICIENT_FUNDS';`
    },
    interviewKeyPhrase: "Gérer la congestion de bande passante prépare idéalement à surveiller la fluidité du système de paiement en temps réel et à prévenir le risque de blocage systémique."
  }
];

export const TELECOM_BCC_FAQ: TelecomBccFaq[] = [
  {
    question: "Comment justifier mon profil Télécom face à des candidats issus de la banque ?",
    answer: "Mettez en avant le VOLUME et la VÉLOCITÉ : Le secteur bancaire congolais traite des milliers d'opérations par jour, alors que les télécoms et le Mobile Money en traitent des MILLIONS par heure. Vous maîtrisez le Big Data en conditions réelles, le streaming et les requêtes SQL à haute performance là où un profil purement comptable sera limité.",
    bccInstructionRef: "Instruction Administrative n°24 & Modernisation DIT/BCC"
  },
  {
    question: "Quel est le cadre réglementaire BCC reliant Télécoms et Banques en RDC ?",
    answer: "L'Instruction Administrative n°24 de la BCC régit les Émetteurs de Monnaie Électronique (EME). Les filiales de monnaie électronique des opérateurs (M-Pesa RDC, Airtel Money, Orange Money) ont un statut d'EME agréé par la BCC, supervisé par la Direction de la Surveillance des Intermédiaires Financiers (DSIF).",
    bccInstructionRef: "Instruction BCC n°24, Titre II, Art. 12"
  },
  {
    question: "Qu'est-ce que le Switch National de Paiement (SNP) en RDC ?",
    answer: "C'est l'infrastructure nationale portée par la BCC pour interconnecter toutes les banques commerciales, les microfinances et les opérateurs de Mobile Money. Un Data Analyst maîtrisant les protocoles télécoms (APIs REST, ISO 8583/20022, JSON/XML) est précisément le profil recherché pour auditer les flux du Switch.",
    bccInstructionRef: "Plan Stratégique de Modernisation du Système National de Paiement"
  }
];
