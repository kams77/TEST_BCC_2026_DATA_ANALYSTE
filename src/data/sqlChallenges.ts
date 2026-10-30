import { SQLChallenge } from '../types';

export const SQL_CHALLENGES: SQLChallenge[] = [
  {
    id: 'sql_chal_01',
    title: 'Surveillance RTGS : Détection de Smurfing (Blanchiment & Fractionnement)',
    department: 'Direction des Systèmes de Paiement & CENAREF',
    difficulty: 'difficile',
    description: 'Identifier les donneurs d\'ordre ayant réalisé le même jour plusieurs transactions sous le seuil unitaire de déclaration de 10 000 USD, dont le total cumulé dépasse 50 000 USD.',
    businessContext: 'Le système RTGS de la Banque Centrale du Congo doit alerter immédiatement en cas de fractionnement de paiements en devises étrangères pour éviter l\'évasion de capitaux.',
    schemaTables: [
      {
        name: 'rtgs_transactions',
        columns: [
          { name: 'tx_id', type: 'VARCHAR(20)', comment: 'Identifiant unique transaction RTGS' },
          { name: 'sender_account', type: 'VARCHAR(30)', comment: 'Numéro de compte client' },
          { name: 'bank_code', type: 'VARCHAR(10)', comment: 'Code banque commerciale (RAW, EQB, TMB, etc.)' },
          { name: 'amount_usd', type: 'NUMERIC(12,2)', comment: 'Montant en USD' },
          { name: 'tx_date', type: 'DATE', comment: 'Date d\'exécution' }
        ],
        sampleData: [
          { tx_id: 'TX-1001', sender_account: 'ACC-8821', bank_code: 'RAW', amount_usd: 9500, tx_date: '2026-10-28' },
          { tx_id: 'TX-1002', sender_account: 'ACC-8821', bank_code: 'RAW', amount_usd: 9800, tx_date: '2026-10-28' },
          { tx_id: 'TX-1003', sender_account: 'ACC-8821', bank_code: 'RAW', amount_usd: 9900, tx_date: '2026-10-28' },
          { tx_id: 'TX-1004', sender_account: 'ACC-8821', bank_code: 'RAW', amount_usd: 9600, tx_date: '2026-10-28' },
          { tx_id: 'TX-1005', sender_account: 'ACC-8821', bank_code: 'RAW', amount_usd: 9700, tx_date: '2026-10-28' },
          { tx_id: 'TX-1006', sender_account: 'ACC-8821', bank_code: 'RAW', amount_usd: 9500, tx_date: '2026-10-28' },
          { tx_id: 'TX-2001', sender_account: 'ACC-3410', bank_code: 'EQB', amount_usd: 4000, tx_date: '2026-10-28' },
          { tx_id: 'TX-2002', sender_account: 'ACC-3410', bank_code: 'EQB', amount_usd: 4500, tx_date: '2026-10-28' },
          { tx_id: 'TX-3001', sender_account: 'ACC-9900', bank_code: 'TMB', amount_usd: 25000, tx_date: '2026-10-28' }
        ]
      }
    ],
    expectedTask: 'Écrivez une requête groupant par sender_account et tx_date, filtrant sur amount_usd < 10000, avec une clause HAVING où SUM(amount_usd) > 50000.',
    initialCode: `-- Écrivez votre requête pour la Direction des Systèmes de Paiement BCC
SELECT 
    sender_account,
    tx_date,
    COUNT(*) as nb_operations,
    SUM(amount_usd) as total_journalier
FROM rtgs_transactions
-- Complétez la condition WHERE et la clause HAVING...
`,
    solutionQuery: `SELECT 
    sender_account,
    tx_date,
    COUNT(*) as nb_operations,
    SUM(amount_usd) as total_journalier
FROM rtgs_transactions
WHERE amount_usd < 10000
GROUP BY sender_account, tx_date
HAVING SUM(amount_usd) > 50000;`,
    explanation: 'Le fractionnement se définit par des opérations isolées inférieures au seuil réglementaire (WHERE amount_usd < 10000) dont la somme par compte et par jour dépasse le plafond d\'alerte (HAVING SUM(amount_usd) > 50000).',
    hint: 'Pensez à filtrer d\'abord les transactions individuelles < 10000 dans le WHERE avant d\'agréger par GROUP BY.',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasWhere = q.includes('where') && q.includes('< 10000') || q.includes('<10000');
      const hasGroup = q.includes('group by') && q.includes('sender_account');
      const hasHaving = q.includes('having') && (q.includes('sum(amount_usd)') || q.includes('sum(')) && (q.includes('> 50000') || q.includes('>50000'));
      if (hasWhere && hasGroup && hasHaving) {
        return {
          passed: true,
          message: 'Requête validée avec brio ! L\'alerte CENAREF a correctement extrait le compte suspect ACC-8821 (6 transactions pour 58 000 USD).',
          rows: [
            { sender_account: 'ACC-8821', tx_date: '2026-10-28', nb_operations: 6, total_journalier: 58000 }
          ]
        };
      }
      return {
        passed: false,
        message: 'La requête ne remplit pas tous les critères requis. Vérifiez : WHERE amount_usd < 10000, GROUP BY sender_account, tx_date et HAVING SUM(amount_usd) > 50000.'
      };
    }
  },
  {
    id: 'sql_chal_02',
    title: 'Surveillance Prudentielle : Calcul du Solde Progressif Intrajournalier',
    department: 'Direction de la Surveillance des Intermédiaires Financiers (DSIF)',
    difficulty: 'difficile',
    businessContext: 'La BCC doit suivre minute par minute le compte de règlement de chaque banque commerciale pour anticiper les découverts non autorisés.',
    description: 'Calculer pour chaque banque le solde cumulatif progressif de trésorerie au fil des opérations de la journée.',
    schemaTables: [
      {
        name: 'reglement_interbancaire',
        columns: [
          { name: 'op_id', type: 'INT', comment: 'Identifiant ordre' },
          { name: 'bank_code', type: 'VARCHAR(10)', comment: 'Code banque' },
          { name: 'heure', type: 'TIME', comment: 'Horodatage' },
          { name: 'flux_net_usd', type: 'NUMERIC(15,2)', comment: 'Montant crédité (+) ou débité (-)' }
        ],
        sampleData: [
          { op_id: 1, bank_code: 'RAWBANK', heure: '08:30:00', flux_net_usd: 15000000 },
          { op_id: 2, bank_code: 'RAWBANK', heure: '09:15:00', flux_net_usd: -8000000 },
          { op_id: 3, bank_code: 'RAWBANK', heure: '11:45:00', flux_net_usd: -12000000 },
          { op_id: 4, bank_code: 'EQUITY_BCDC', heure: '08:40:00', flux_net_usd: 25000000 },
          { op_id: 5, bank_code: 'EQUITY_BCDC', heure: '10:10:00', flux_net_usd: -18000000 }
        ]
      }
    ],
    expectedTask: 'Utilisez la fonction SUM(flux_net_usd) OVER (PARTITION BY bank_code ORDER BY heure) pour obtenir le running balance.',
    initialCode: `-- Calcul du solde glissant par banque
SELECT 
    bank_code,
    heure,
    flux_net_usd,
    -- Insérez la fonction de fenêtrage ici
FROM reglement_interbancaire;
`,
    solutionQuery: `SELECT 
    bank_code,
    heure,
    flux_net_usd,
    SUM(flux_net_usd) OVER (
        PARTITION BY bank_code 
        ORDER BY heure
    ) AS solde_progressif_usd
FROM reglement_interbancaire;`,
    explanation: 'SUM(...) OVER (PARTITION BY bank_code ORDER BY heure) est la fonction analytique clé pour suivre la liquidité sans sous-requête corrélée coûteuse.',
    hint: 'La syntaxe exacte requiert SUM(flux_net_usd) OVER (PARTITION BY bank_code ORDER BY heure).',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasOver = q.includes('over') && q.includes('partition by') && q.includes('order by') && q.includes('sum(');
      if (hasOver) {
        return {
          passed: true,
          message: 'Parfait ! Vous maîtrisez les fonctions de fenêtrage (Window Functions) indispensables pour un data analyst bancaire.',
          rows: [
            { bank_code: 'EQUITY_BCDC', heure: '08:40:00', flux_net_usd: 25000000, solde_progressif_usd: 25000000 },
            { bank_code: 'EQUITY_BCDC', heure: '10:10:00', flux_net_usd: -18000000, solde_progressif_usd: 7000000 },
            { bank_code: 'RAWBANK', heure: '08:30:00', flux_net_usd: 15000000, solde_progressif_usd: 15000000 },
            { bank_code: 'RAWBANK', heure: '09:15:00', flux_net_usd: -8000000, solde_progressif_usd: 7000000 },
            { bank_code: 'RAWBANK', heure: '11:45:00', flux_net_usd: -12000000, solde_progressif_usd: -5000000 }
          ]
        };
      }
      return {
        passed: false,
        message: 'Utilisez la clause OVER (PARTITION BY bank_code ORDER BY heure) pour agréger au fil de l\'eau.'
      };
    }
  },
  {
    id: 'sql_chal_03',
    title: 'Surveillance Macroprudentielle : Détection des Banques sous le seuil LCR (100%)',
    department: 'Direction de la Recherche et des Statistiques (DRS)',
    difficulty: 'moyen',
    businessContext: 'Le Comité de Stabilité Financière de la BCC exige la liste mensuelle des banques dont le ratio LCR est inférieur au seuil réglementaire de 100%.',
    description: 'Calculer le ratio (hqla / sorties_nettes) * 100 et filtrer les banques non conformes.',
    schemaTables: [
      {
        name: 'etats_lcr',
        columns: [
          { name: 'bank_id', type: 'VARCHAR(10)', comment: 'Code établissement' },
          { name: 'nom_banque', type: 'VARCHAR(50)', comment: 'Nom de la banque' },
          { name: 'hqla_usd', type: 'NUMERIC(15,2)', comment: 'Actifs liquides de haute qualité (USD)' },
          { name: 'sorties_nettes_usd', type: 'NUMERIC(15,2)', comment: 'Sorties nettes de trésorerie 30 jours (USD)' }
        ],
        sampleData: [
          { bank_id: 'B01', nom_banque: 'Rawbank Congo', hqla_usd: 240000000, sorties_nettes_usd: 180000000 },
          { bank_id: 'B02', nom_banque: 'Equity BCDC', hqla_usd: 190000000, sorties_nettes_usd: 160000000 },
          { bank_id: 'B03', nom_banque: 'Banque Commerciale X', hqla_usd: 65000000, sorties_nettes_usd: 90000000 },
          { bank_id: 'B04', nom_banque: 'Trust Merchant Bank (TMB)', hqla_usd: 130000000, sorties_nettes_usd: 110000000 },
          { bank_id: 'B05', nom_banque: 'Banque Régionale Y', hqla_usd: 42000000, sorties_nettes_usd: 55000000 }
        ]
      }
    ],
    expectedTask: 'Écrivez une requête calculant ratio_lcr = (hqla_usd / sorties_nettes_usd) * 100 et ne retenant que les banques avec ratio_lcr < 100.',
    initialCode: `-- Banques en déficit de liquidité prudentielle
SELECT 
    bank_id,
    nom_banque,
    hqla_usd,
    sorties_nettes_usd,
    ROUND((hqla_usd / sorties_nettes_usd) * 100, 2) AS ratio_lcr_pct
FROM etats_lcr
-- Ajoutez le filtre prudentiel...
`,
    solutionQuery: `SELECT 
    bank_id,
    nom_banque,
    hqla_usd,
    sorties_nettes_usd,
    ROUND((hqla_usd / sorties_nettes_usd) * 100, 2) AS ratio_lcr_pct
FROM etats_lcr
WHERE (hqla_usd / sorties_nettes_usd) < 1.0;`,
    explanation: 'Le seuil prudentiel de Bâle III appliqué par la BCC impose LCR ≥ 100%. Tout établissement avec un LCR < 100% fait l\'objet d\'une mise en demeure par la DSIF.',
    hint: 'Dans la clause WHERE, vous pouvez utiliser (hqla_usd / sorties_nettes_usd) < 1.0 ou (hqla_usd < sorties_nettes_usd).',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasCondition = (q.includes('where') && (q.includes('< 1') || q.includes('< 100') || q.includes('hqla_usd < sorties_nettes_usd')));
      if (hasCondition) {
        return {
          passed: true,
          message: 'Excellent ! Vous avez identifié avec précision les deux établissements non conformes : Banque Commerciale X (72.22%) et Banque Régionale Y (76.36%).',
          rows: [
            { bank_id: 'B03', nom_banque: 'Banque Commerciale X', hqla_usd: 65000000, sorties_nettes_usd: 90000000, ratio_lcr_pct: 72.22 },
            { bank_id: 'B05', nom_banque: 'Banque Régionale Y', hqla_usd: 42000000, sorties_nettes_usd: 55000000, ratio_lcr_pct: 76.36 }
          ]
        };
      }
      return {
        passed: false,
        message: 'Ajoutez une condition WHERE filtrant les banques dont le ratio est strictement inférieur à 100% (ou hqla_usd < sorties_nettes_usd).'
      };
    }
  },
  {
    id: 'sql_chal_04',
    title: 'Surveillance EME : Rapprochement Float Mobile Money vs Compte de Cantonnement',
    department: 'Direction de la Surveillance des Intermédiaires Financiers (DSIF)',
    difficulty: 'difficile',
    businessContext: 'Selon l\'Instruction administrative n°24 de la BCC, tout Émetteur de Monnaie Électronique (Vodacom M-Pesa, Airtel Money, Orange Money) doit gager 100% de la monnaie électronique émise par des dépôts réels logés sur un compte de cantonnement.',
    description: 'Effectuer une jointure entre la table des portefeuilles virtuels et celle des soldes bancaires pour calculer l\'écart de couverture et qualifier le statut de conformité.',
    schemaTables: [
      {
        name: 'eme_wallets_summary',
        columns: [
          { name: 'eme_code', type: 'VARCHAR(10)', comment: 'Code opérateur (MPESA, AIRTEL_M, ORANGE_M)' },
          { name: 'nom_operateur', type: 'VARCHAR(40)', comment: 'Nom de l\'opérateur télécom' },
          { name: 'total_float_cdf', type: 'NUMERIC(18,2)', comment: 'Encours total de monnaie électronique émise (CDF)' }
        ],
        sampleData: [
          { eme_code: 'MPESA', nom_operateur: 'Vodacom M-Pesa RDC', total_float_cdf: 450000000000 },
          { eme_code: 'AIRTEL_M', nom_operateur: 'Airtel Money RDC', total_float_cdf: 320000000000 },
          { eme_code: 'ORANGE_M', nom_operateur: 'Orange Money RDC', total_float_cdf: 210000000000 }
        ]
      },
      {
        name: 'comptes_cantonnement_banques',
        columns: [
          { name: 'eme_code', type: 'VARCHAR(10)', comment: 'Code opérateur rattaché' },
          { name: 'banque_depositaire', type: 'VARCHAR(40)', comment: 'Banque commerciale agréée dépositaire' },
          { name: 'solde_cantonne_cdf', type: 'NUMERIC(18,2)', comment: 'Fonds réels bloqués sur le compte de cantonnement (CDF)' }
        ],
        sampleData: [
          { eme_code: 'MPESA', banque_depositaire: 'Rawbank Congo', solde_cantonne_cdf: 452000000000 },
          { eme_code: 'AIRTEL_M', banque_depositaire: 'Equity BCDC', solde_cantonne_cdf: 310000000000 },
          { eme_code: 'ORANGE_M', banque_depositaire: 'Trust Merchant Bank (TMB)', solde_cantonne_cdf: 210500000000 }
        ]
      }
    ],
    expectedTask: 'Faites un JOIN sur eme_code, calculez ecart = solde_cantonne_cdf - total_float_cdf, et utilisez CASE WHEN pour afficher \'CONFORME\' ou \'INFRACTION_DEFICIT\'.',
    initialCode: `-- Audit du cantonnement prudentiel Instruction n°24 BCC
SELECT 
    w.nom_operateur,
    b.banque_depositaire,
    w.total_float_cdf,
    b.solde_cantonne_cdf,
    (b.solde_cantonne_cdf - w.total_float_cdf) AS ecart_cdf,
    CASE 
        WHEN (b.solde_cantonne_cdf - w.total_float_cdf) >= 0 THEN 'CONFORME'
        ELSE 'INFRACTION_DEFICIT'
    END AS statut_reglementaire
FROM eme_wallets_summary w
-- Complétez la jointure...
`,
    solutionQuery: `SELECT 
    w.nom_operateur,
    b.banque_depositaire,
    w.total_float_cdf,
    b.solde_cantonne_cdf,
    (b.solde_cantonne_cdf - w.total_float_cdf) AS ecart_cdf,
    CASE 
        WHEN (b.solde_cantonne_cdf - w.total_float_cdf) >= 0 THEN 'CONFORME'
        ELSE 'INFRACTION_DEFICIT'
    END AS statut_reglementaire
FROM eme_wallets_summary w
JOIN comptes_cantonnement_banques b ON w.eme_code = b.eme_code;`,
    explanation: 'Le rapprochement bilatéral EME-Banque est obligatoire sous l\'Instruction n°24 : la clause CASE WHEN combinée à la jointure met instantanément en exergue les opérateurs en création monétaire non couverte.',
    hint: 'Reliez les deux tables avec JOIN comptes_cantonnement_banques b ON w.eme_code = b.eme_code.',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasJoin = q.includes('join') && q.includes('comptes_cantonnement_banques') && q.includes('eme_code');
      const hasCase = q.includes('case') && (q.includes('conforme') || q.includes('infraction'));
      if (hasJoin && hasCase) {
        return {
          passed: true,
          message: 'Excellent rapprochement ! Vous avez immédiatement identifié le déficit de 10 milliards CDF chez Airtel Money RDC (310 Mrds cantonnés vs 320 Mrds émis) qui justifie une mise en demeure de la BCC.',
          rows: [
            { nom_operateur: 'Vodacom M-Pesa RDC', banque_depositaire: 'Rawbank Congo', total_float_cdf: 450000000000, solde_cantonne_cdf: 452000000000, ecart_cdf: 2000000000, statut_reglementaire: 'CONFORME' },
            { nom_operateur: 'Airtel Money RDC', banque_depositaire: 'Equity BCDC', total_float_cdf: 320000000000, solde_cantonne_cdf: 310000000000, ecart_cdf: -10000000000, statut_reglementaire: 'INFRACTION_DEFICIT' },
            { nom_operateur: 'Orange Money RDC', banque_depositaire: 'Trust Merchant Bank (TMB)', total_float_cdf: 210000000000, solde_cantonne_cdf: 210500000000, ecart_cdf: 500000000, statut_reglementaire: 'CONFORME' }
          ]
        };
      }
      return {
        passed: false,
        message: 'Votre requête doit inclure un JOIN entre eme_wallets_summary et comptes_cantonnement_banques sur eme_code ainsi que l\'instruction CASE WHEN.'
      };
    }
  },
  {
    id: 'sql_chal_05',
    title: 'Marché des Changes : Détection de Volatilité Anormale CDF/USD via LAG()',
    department: 'Direction des Opérations Bancaires et des Marchés (DOBM)',
    difficulty: 'difficile',
    businessContext: 'La BCC suit la volatilité journalière du Franc Congolais. Une variation journalière supérieure à 1.0% sur le cours indicatif déclenche une réunion extraordinaire du comité de veille de change.',
    description: 'Utiliser la fonction de fenêtrage LAG() pour comparer le cours du jour avec celui de la veille et calculer la variation en pourcentage.',
    schemaTables: [
      {
        name: 'cours_indicatif_quotidien',
        columns: [
          { name: 'date_cotation', type: 'DATE', comment: 'Date de séance de change' },
          { name: 'taux_indicatif_cdf', type: 'NUMERIC(10,2)', comment: 'Cours moyen 1 USD en CDF' }
        ],
        sampleData: [
          { date_cotation: '2026-10-20', taux_indicatif_cdf: 2800.00 },
          { date_cotation: '2026-10-21', taux_indicatif_cdf: 2810.00 },
          { date_cotation: '2026-10-22', taux_indicatif_cdf: 2845.00 },
          { date_cotation: '2026-10-23', taux_indicatif_cdf: 2850.00 },
          { date_cotation: '2026-10-24', taux_indicatif_cdf: 2890.00 }
        ]
      }
    ],
    expectedTask: 'Utilisez LAG(taux_indicatif_cdf) OVER (ORDER BY date_cotation) pour calculer le taux de la veille et la variation journalière en pourcentage.',
    initialCode: `-- Calcul de la dépréciation journalière via LAG()
SELECT 
    date_cotation,
    taux_indicatif_cdf,
    LAG(taux_indicatif_cdf) OVER (ORDER BY date_cotation) AS taux_veille,
    -- Calculez la variation journalière en % : ROUND(((taux - veille) / veille) * 100, 2)
FROM cours_indicatif_quotidien;
`,
    solutionQuery: `SELECT 
    date_cotation,
    taux_indicatif_cdf,
    LAG(taux_indicatif_cdf) OVER (ORDER BY date_cotation) AS taux_veille,
    ROUND(((taux_indicatif_cdf - LAG(taux_indicatif_cdf) OVER (ORDER BY date_cotation)) / LAG(taux_indicatif_cdf) OVER (ORDER BY date_cotation)) * 100, 2) AS variation_pct
FROM cours_indicatif_quotidien;`,
    explanation: 'LAG() est la fonction analytique essentielle en macroéconomie financière pour accéder au pas de temps précédent (t-1) sans auto-jointure coûteuse.',
    hint: 'La formule de variation est : ((taux_indicatif_cdf - LAG(taux_indicatif_cdf) OVER (ORDER BY date_cotation)) / LAG(taux_indicatif_cdf) OVER (ORDER BY date_cotation)) * 100.',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasLag = q.includes('lag(') && q.includes('over') && q.includes('order by date_cotation');
      if (hasLag) {
        return {
          passed: true,
          message: 'Requête analytique parfaitement exécutée ! Les variations du 22 octobre (+1.25%) et du 24 octobre (+1.40%) dépassent le seuil de vigilance de 1.0% et déclenchent le rapport pour la Direction des Marchés.',
          rows: [
            { date_cotation: '2026-10-20', taux_indicatif_cdf: 2800.00, taux_veille: null, variation_pct: null },
            { date_cotation: '2026-10-21', taux_indicatif_cdf: 2810.00, taux_veille: 2800.00, variation_pct: 0.36 },
            { date_cotation: '2026-10-22', taux_indicatif_cdf: 2845.00, taux_veille: 2810.00, variation_pct: 1.25 },
            { date_cotation: '2026-10-23', taux_indicatif_cdf: 2850.00, taux_veille: 2845.00, variation_pct: 0.18 },
            { date_cotation: '2026-10-24', taux_indicatif_cdf: 2890.00, taux_veille: 2850.00, variation_pct: 1.40 }
          ]
        };
      }
      return {
        passed: false,
        message: 'Utilisez la fonction de fenêtrage LAG(taux_indicatif_cdf) OVER (ORDER BY date_cotation).'
      };
    }
  },
  {
    id: 'sql_chal_06',
    title: 'Surveillance du Crédit : Taux de Créances en Souffrance (NPL) par Secteur',
    department: 'Direction de la Recherche et des Statistiques (DRS)',
    difficulty: 'difficile',
    businessContext: 'Le Comité de Politique Monétaire (CPM) demande un état d\'exposition aux risques de non-remboursement selon les branches économiques (Mines au Katanga, Télécoms, BTP, Commerce à Kinshasa).',
    description: 'Calculer le volume total de crédits, le volume de créances douteuses, et le ratio de NPL en pourcentage par secteur économique.',
    schemaTables: [
      {
        name: 'portefeuille_credits_secteurs',
        columns: [
          { name: 'credit_id', type: 'INT', comment: 'Identifiant contrat' },
          { name: 'secteur_activite', type: 'VARCHAR(40)', comment: 'Secteur économique en RDC' },
          { name: 'montant_brut_usd', type: 'NUMERIC(15,2)', comment: 'Encours total de crédit accordé' },
          { name: 'classe_risque', type: 'VARCHAR(20)', comment: 'Classification BCC (SAIN, PRE-DOUTEUX, DOUTEUX, COMPROMIS)' }
        ],
        sampleData: [
          { credit_id: 101, secteur_activite: 'Mines & Extraction', montant_brut_usd: 80000000, classe_risque: 'SAIN' },
          { credit_id: 102, secteur_activite: 'Mines & Extraction', montant_brut_usd: 20000000, classe_risque: 'DOUTEUX' },
          { credit_id: 103, secteur_activite: 'Commerce de Gros Kinshasa', montant_brut_usd: 30000000, classe_risque: 'SAIN' },
          { credit_id: 104, secteur_activite: 'Commerce de Gros Kinshasa', montant_brut_usd: 15000000, classe_risque: 'COMPROMIS' },
          { credit_id: 105, secteur_activite: 'Télécommunications & Fintech', montant_brut_usd: 50000000, classe_risque: 'SAIN' },
          { credit_id: 106, secteur_activite: 'Télécommunications & Fintech', montant_brut_usd: 2000000, classe_risque: 'DOUTEUX' }
        ]
      }
    ],
    expectedTask: 'Groupez par secteur_activite, calculez sum(montant_brut_usd), sum des montants en classe DOUTEUX/COMPROMIS, et ratio_npl_pct.',
    initialCode: `-- Analyse de vulnérabilité sectorielle par la DRS
SELECT 
    secteur_activite,
    SUM(montant_brut_usd) AS encours_total_usd,
    SUM(CASE WHEN classe_risque IN ('DOUTEUX', 'COMPROMIS') THEN montant_brut_usd ELSE 0 END) AS montant_npl_usd,
    ROUND((SUM(CASE WHEN classe_risque IN ('DOUTEUX', 'COMPROMIS') THEN montant_brut_usd ELSE 0 END) / SUM(montant_brut_usd)) * 100, 2) AS ratio_npl_pct
FROM portefeuille_credits_secteurs
GROUP BY secteur_activite
ORDER BY ratio_npl_pct DESC;
`,
    solutionQuery: `SELECT 
    secteur_activite,
    SUM(montant_brut_usd) AS encours_total_usd,
    SUM(CASE WHEN classe_risque IN ('DOUTEUX', 'COMPROMIS') THEN montant_brut_usd ELSE 0 END) AS montant_npl_usd,
    ROUND((SUM(CASE WHEN classe_risque IN ('DOUTEUX', 'COMPROMIS') THEN montant_brut_usd ELSE 0 END) / SUM(montant_brut_usd)) * 100, 2) AS ratio_npl_pct
FROM portefeuille_credits_secteurs
GROUP BY secteur_activite
ORDER BY ratio_npl_pct DESC;`,
    explanation: 'La clause conditionnelle SUM(CASE WHEN ...) permet de consolider en une seule passe le numérateur (créances à risque) et le dénominateur (total portefeuille) sans table temporaire.',
    hint: 'Utilisez CASE WHEN classe_risque IN (\'DOUTEUX\', \'COMPROMIS\') pour isoler les NPL au sein du SUM().',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasGroup = q.includes('group by') && q.includes('secteur_activite');
      const hasCase = q.includes('case when') && (q.includes('douteux') || q.includes('compromis'));
      if (hasGroup && hasCase) {
        return {
          passed: true,
          message: 'Analyse sectorielle validée avec succès ! Le Commerce de Gros présente le plus haut taux de sinistralité (33.33%), suivi du secteur Minier (20.00%), tandis que les Télécoms & Fintech conservent une excellente qualité d\'actifs (3.85%).',
          rows: [
            { secteur_activite: 'Commerce de Gros Kinshasa', encours_total_usd: 45000000, montant_npl_usd: 15000000, ratio_npl_pct: 33.33 },
            { secteur_activite: 'Mines & Extraction', encours_total_usd: 100000000, montant_npl_usd: 20000000, ratio_npl_pct: 20.00 },
            { secteur_activite: 'Télécommunications & Fintech', encours_total_usd: 52000000, montant_npl_usd: 2000000, ratio_npl_pct: 3.85 }
          ]
        };
      }
      return {
        passed: false,
        message: 'Votre requête doit grouper par secteur_activite et utiliser CASE WHEN pour filtrer les créances DOUTEUX ou COMPROMIS.'
      };
    }
  }
];

