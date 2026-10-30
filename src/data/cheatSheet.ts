export interface FormulaCard {
  id: string;
  category: string;
  title: string;
  formula: string;
  meaning: string;
  bccUsage: string;
  example: string;
}

export const CHEAT_SHEETS: FormulaCard[] = [
  {
    id: 'f_01',
    category: 'Réglementation Prudentielle & Bâle',
    title: 'Ratio de Solvabilité (Cooke / Bâle II-III)',
    formula: 'Ratio = (Fonds Propres Réglementaires / Total RWA) ≥ 10.0%',
    meaning: 'Capacité des capitaux propres de la banque à absorber les pertes inattendues.',
    bccUsage: 'Norme minimale fixée par la DSIF de la BCC à 10% pour les banques en RDC (avec un sous-ratio Tier 1 ≥ 7.5%).',
    example: 'Si RWA = 500M USD, Fonds Propres minimaux exigés = 50M USD.'
  },
  {
    id: 'f_02',
    category: 'Réglementation Prudentielle & Bâle',
    title: 'Ratio de Liquidité à Court Terme (LCR)',
    formula: 'LCR = (Actifs Liquides de Haute Qualité - HQLA / Sorties Nettes de Trésorerie à 30 jours) ≥ 100%',
    meaning: 'Garantit que la banque dispose d\'assez de cash et titres d\'État pour survivre 30 jours de panique bancaire.',
    bccUsage: 'Suivi hebdomadaire par la BCC. Entrées de trésorerie plafonnées à 75% des sorties.',
    example: 'HQLA = 120M$, Sorties nettes = 100M$ => LCR = 120% (Conforme).'
  },
  {
    id: 'f_03',
    category: 'Monnaie & Macroéconomie RDC',
    title: 'Dépréciation du Franc Congolais (CDF vs USD)',
    formula: 'Δ_CDF = - ((E_t - E_0) / E_t)  ou  ((1/E_t - 1/E_0) / (1/E_0))',
    meaning: 'Mesure la perte de valeur exacte de la monnaie nationale face au dollar américain.',
    bccUsage: 'Publié dans la note hebdomadaire de conjoncture économique de la BCC pour le CPM.',
    example: 'Si 1 USD passe de 2500 à 2800 CDF, dépréciation = (2500 - 2800) / 2800 = -10.71%.'
  },
  {
    id: 'f_04',
    category: 'Monnaie & Macroéconomie RDC',
    title: 'Réserves de Change en Semaines d\'Importations',
    formula: 'Couverture = (Réserves Brutes en Devises / Importations Annuelles de Biens & Services) * 52 semaines',
    meaning: 'Capacité du pays à régler ses achats extérieurs de carburant, nourriture et pièces de rechange.',
    bccUsage: 'Seuil critique international = 12 semaines (3 mois). En RDC, la cible minimale de sécurité de la BCC est de 6 à 8 semaines.',
    example: 'Réserves = 4.2 Mds USD, Importations annuelles = 28 Mds USD => (4.2 / 28) * 52 = 7.8 semaines.'
  },
  {
    id: 'f_05',
    category: 'SQL Avancé pour Data Analyst BCC',
    title: 'Fonction Analytique de Solde Glissant (Running Balance)',
    formula: 'SUM(montant) OVER (PARTITION BY compte ORDER BY horodatage ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)',
    meaning: 'Calcule instantanément le solde d\'un compte après chaque virement sans jointure récursive.',
    bccUsage: 'Moteur de calcul de position intrajournalière dans le système de gros montants RTGS.',
    example: 'Utilisé pour vérifier qu\'aucune banque commerciale ne passe en découvert non garanti.'
  },
  {
    id: 'f_06',
    category: 'SQL Avancé pour Data Analyst BCC',
    title: 'Classement Sans Trous d\'Égalité (DENSE_RANK)',
    formula: 'DENSE_RANK() OVER (PARTITION BY province ORDER BY volume_credit DESC)',
    meaning: 'Attribue des rangs sans discontinuité même en cas d\'égalités (1, 2, 2, 3 et non 1, 2, 2, 4).',
    bccUsage: 'Extraction des Top N banques et des plus gros emprunteurs du système bancaire congolais.',
    example: 'Parfait pour requêter dans une CTE : WHERE rang <= 3.'
  },
  {
    id: 'f_07',
    category: 'Économétrie & Séries Temporelles',
    title: 'Test de Racine Unitaire ADF (Augmented Dickey-Fuller)',
    formula: 'Δy_t = α + β*t + γ*y_{t-1} + Σ δ_i*Δy_{t-i} + ε_t  |  H0 : γ = 0 (Non-stationnaire)',
    meaning: 'Détermine si une série temporelle (ex: IPC Kinshasa ou Cours CDF/USD) doit être différenciée.',
    bccUsage: 'Étape obligatoire avant toute modélisation ARIMA / VAR par la Direction de la Recherche.',
    example: 'Si p-value > 0.05 => Ne pas rejeter H0 => La série n\'est pas stationnaire => Différencier d >= 1.'
  },
  {
    id: 'f_08',
    category: 'Économétrie & Gestion des Risques',
    title: 'Value at Risk (VaR) Paramétrique Normale',
    formula: 'VaR_α = z_α * σ * √t - μ',
    meaning: 'Perte potentielle maximale sur un portefeuille de réserves pour un niveau de confiance α sur l\'horizon t.',
    bccUsage: 'Surveillance des réserves internationales investies en obligations souveraines étrangères.',
    example: 'À 95% (z = 1.645) avec σ = 0.8% et μ = 0.02% => VaR = 1.645 * 0.8% - 0.02% = 1.30%.'
  }
];
