import { SQLChallenge } from '../types';

export const SQL_CHALLENGES: SQLChallenge[] = [
  // ============================================================
  // 1. DIRECTION DES SYSTÈMES DE PAIEMENT & CENAREF
  // ============================================================
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
    initialCode: `-- Surveillance CENAREF / BCC
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
      const hasWhere = q.includes('where') && (q.includes('< 10000') || q.includes('<10000'));
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
    initialCode: `-- Calcul du solde progressif en continu
SELECT 
    op_id,
    bank_code,
    heure,
    flux_net_usd,
    -- Complétez la fonction de fenêtrage running_balance...
FROM reglement_interbancaire
ORDER BY bank_code, heure;
`,
    solutionQuery: `SELECT 
    op_id,
    bank_code,
    heure,
    flux_net_usd,
    SUM(flux_net_usd) OVER (PARTITION BY bank_code ORDER BY heure) AS solde_progressif_usd
FROM reglement_interbancaire
ORDER BY bank_code, heure;`,
    explanation: 'La clause OVER (PARTITION BY bank_code ORDER BY heure) crée une fenêtre glissante ordonnée qui additionne les flux au fur et à mesure sans grouper ni réduire les lignes.',
    hint: 'Utilisez SUM(flux_net_usd) OVER (PARTITION BY bank_code ORDER BY heure).',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasOver = q.includes('over') && q.includes('partition by bank_code') && q.includes('order by heure');
      const hasSum = q.includes('sum(flux_net_usd)') || q.includes('sum( flux_net_usd )');
      if (hasOver && hasSum) {
        return {
          passed: true,
          message: 'Excellente maîtrise du fenêtrage SQL ! Le solde de RAWBANK passe successivement de +15M$ à +7M$ puis -5M$ (alerte découvert à 11h45).',
          rows: [
            { op_id: 1, bank_code: 'RAWBANK', heure: '08:30:00', flux_net_usd: 15000000, solde_progressif_usd: 15000000 },
            { op_id: 2, bank_code: 'RAWBANK', heure: '09:15:00', flux_net_usd: -8000000, solde_progressif_usd: 7000000 },
            { op_id: 3, bank_code: 'RAWBANK', heure: '11:45:00', flux_net_usd: -12000000, solde_progressif_usd: -5000000 }
          ]
        };
      }
      return {
        passed: false,
        message: 'La requête doit contenir la fonction de fenêtrage : SUM(flux_net_usd) OVER (PARTITION BY bank_code ORDER BY heure).'
      };
    }
  },
  {
    id: 'sql_chal_03',
    title: 'Surveillance Réglementaire : Audit du Ratio de Liquidité LCR < 100%',
    department: 'Direction de la Surveillance des Intermédiaires Financiers (DSIF)',
    difficulty: 'moyen',
    businessContext: 'Selon les normes prudentielles inspirées de Bâle III et appliquées par la BCC, le ratio LCR (Actifs liquides de haute qualité / Sorties nettes de trésorerie à 30 jours) doit être >= 100%.',
    description: 'Identifier toutes les banques commerciales congolaises en situation d\'infraction de liquidité (LCR < 100%) et calculer leur déficit de liquidité.',
    schemaTables: [
      {
        name: 'declarations_prudentielles_lcr',
        columns: [
          { name: 'bank_code', type: 'VARCHAR(10)', comment: 'Code banque' },
          { name: 'date_declaration', type: 'DATE', comment: 'Fin de mois' },
          { name: 'actifs_liquides_hla', type: 'NUMERIC(15,2)', comment: 'Total HQLA (caisse + comptes BCC + Bons BCC)' },
          { name: 'sorties_nettes_30j', type: 'NUMERIC(15,2)', comment: 'Sorties nettes de trésorerie à 30 jours' }
        ],
        sampleData: [
          { bank_code: 'BANQUE_A', date_declaration: '2026-09-30', actifs_liquides_hla: 120000000, sorties_nettes_30j: 100000000 },
          { bank_code: 'BANQUE_B', date_declaration: '2026-09-30', actifs_liquides_hla: 75000000, sorties_nettes_30j: 90000000 },
          { bank_code: 'BANQUE_C', date_declaration: '2026-09-30', actifs_liquides_hla: 45000000, sorties_nettes_30j: 60000000 },
          { bank_code: 'BANQUE_D', date_declaration: '2026-09-30', actifs_liquides_hla: 210000000, sorties_nettes_30j: 180000000 }
        ]
      }
    ],
    expectedTask: 'Calculez le ratio_lcr_pct = ROUND((actifs_liquides_hla / sorties_nettes_30j) * 100, 2), filtrez les banques avec ratio < 100, et calculez le deficit_liquidite_usd.',
    initialCode: `-- Identification des banques vulnérables en liquidité
SELECT 
    bank_code,
    actifs_liquides_hla,
    sorties_nettes_30j,
    -- Calculez le ratio LCR en % et le déficit en USD...
FROM declarations_prudentielles_lcr
WHERE date_declaration = '2026-09-30'
-- Complétez le filtre sur le ratio...
`,
    solutionQuery: `SELECT 
    bank_code,
    actifs_liquides_hla,
    sorties_nettes_30j,
    ROUND((actifs_liquides_hla / sorties_nettes_30j) * 100, 2) AS ratio_lcr_pct,
    (sorties_nettes_30j - actifs_liquides_hla) AS deficit_liquidite_usd
FROM declarations_prudentielles_lcr
WHERE date_declaration = '2026-09-30'
  AND (actifs_liquides_hla / sorties_nettes_30j) < 1.0
ORDER BY ratio_lcr_pct ASC;`,
    explanation: 'Le ratio LCR est un ratio fondamental de Bâle III. Quand actifs_liquides_hla < sorties_nettes_30j, la banque n\'a pas assez de réserves pour survivre à un stress de liquidité de 30 jours.',
    hint: 'Pour filtrer sur les banques ayant un ratio < 100%, utilisez la condition AND (actifs_liquides_hla / sorties_nettes_30j) < 1.0 ou filtrez via un WHERE ou HAVING.',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasFormula = q.includes('actifs_liquides_hla / sorties_nettes_30j') || q.includes('actifs_liquides_hla/sorties_nettes_30j');
      const hasFilter = q.includes('< 1.0') || q.includes('< 100') || q.includes('<1.0') || q.includes('<100');
      if (hasFormula && hasFilter) {
        return {
          passed: true,
          message: 'Analyse prudentielle validée ! Deux établissements sont en infraction : BANQUE_C (75.00%, déficit de 15M$) et BANQUE_B (83.33%, déficit de 15M$).',
          rows: [
            { bank_code: 'BANQUE_C', ratio_lcr_pct: 75.0, deficit_liquidite_usd: 15000000 },
            { bank_code: 'BANQUE_B', ratio_lcr_pct: 83.33, deficit_liquidite_usd: 15000000 }
          ]
        };
      }
      return {
        passed: false,
        message: 'Vérifiez la division (actifs_liquides_hla / sorties_nettes_30j) et la condition de filtrage inférieure à 100% (ou < 1.0).'
      };
    }
  },
  {
    id: 'sql_chal_04',
    title: 'Surveillance Fintech : Contrôle de Couverture des Cantonnements Mobile Money',
    department: 'Direction des Systèmes de Paiement (Instruction n°24)',
    difficulty: 'difficile',
    description: 'Vérifier la conformité de l\'Instruction Administrative n°24 : le solde cantonné dans la banque commerciale partenaire doit TOUJOURS être >= 100% de la monnaie électronique émise en circulation.',
    businessContext: 'En RDC, les Établissements de Monnaie Électronique (EME comme Vodacash, Airtel Money, Orange Money) doivent garantir chaque unité de valeur émise par un dépôt fiduciaire équivalent bloqué sur un compte de cantonnement.',
    schemaTables: [
      {
        name: 'eme_emissions_journalieres',
        columns: [
          { name: 'eme_id', type: 'VARCHAR(20)', comment: 'Identifiant EME (VODACASH, AIRTEL_MONEY, ORANGE_MONEY)' },
          { name: 'devise', type: 'VARCHAR(3)', comment: 'CDF ou USD' },
          { name: 'date_audit', type: 'DATE', comment: 'Date d\'inventaire' },
          { name: 'encours_emoney_emis', type: 'NUMERIC(15,2)', comment: 'Valeur totale de la monnaie électronique en circulation' }
        ],
        sampleData: [
          { eme_id: 'VODACASH', devise: 'USD', date_audit: '2026-10-27', encours_emoney_emis: 85000000 },
          { eme_id: 'AIRTEL_MONEY', devise: 'USD', date_audit: '2026-10-27', encours_emoney_emis: 62000000 },
          { eme_id: 'ORANGE_MONEY', devise: 'USD', date_audit: '2026-10-27', encours_emoney_emis: 35000000 }
        ]
      },
      {
        name: 'comptes_cantonnement_banques',
        columns: [
          { name: 'eme_id', type: 'VARCHAR(20)', comment: 'Identifiant EME' },
          { name: 'banque_partenaire', type: 'VARCHAR(20)', comment: 'Banque dépositaire (RAWBANK, EQUITY, TMB)' },
          { name: 'devise', type: 'VARCHAR(3)', comment: 'CDF ou USD' },
          { name: 'date_audit', type: 'DATE', comment: 'Date relevé banque' },
          { name: 'solde_bloque_usd', type: 'NUMERIC(15,2)', comment: 'Montant certifié bloqué au compte trust' }
        ],
        sampleData: [
          { eme_id: 'VODACASH', banque_partenaire: 'RAWBANK', devise: 'USD', date_audit: '2026-10-27', solde_bloque_usd: 50000000 },
          { eme_id: 'VODACASH', banque_partenaire: 'EQUITY_BCDC', devise: 'USD', date_audit: '2026-10-27', solde_bloque_usd: 36000000 },
          { eme_id: 'AIRTEL_MONEY', banque_partenaire: 'TMB', devise: 'USD', date_audit: '2026-10-27', solde_bloque_usd: 58000000 },
          { eme_id: 'ORANGE_MONEY', banque_partenaire: 'ECOBANK', devise: 'USD', date_audit: '2026-10-27', solde_bloque_usd: 35500000 }
        ]
      }
    ],
    expectedTask: 'Faites une jointure (INNER JOIN) entre les 2 tables, agrégez les soldes bloqués par eme_id, calculez le taux_couverture_pct = (SUM(solde_bloque) / encours_emoney_emis) * 100, et classez le statut de conformité.',
    initialCode: `-- Audit du cantonnement Instruction n°24
SELECT 
    e.eme_id,
    e.encours_emoney_emis,
    SUM(c.solde_bloque_usd) AS total_cantonne_usd,
    ROUND((SUM(c.solde_bloque_usd) / e.encours_emoney_emis) * 100, 2) AS taux_couverture_pct,
    CASE 
        WHEN SUM(c.solde_bloque_usd) >= e.encours_emoney_emis THEN 'CONFORME (Couverture >= 100%)'
        ELSE 'INFRACTION CRITIQUE (Déficit de cantonnement)'
    END AS avis_conformite_bcc
FROM eme_emissions_journalieres e
-- Complétez la jointure JOIN et le GROUP BY...
`,
    solutionQuery: `SELECT 
    e.eme_id,
    e.encours_emoney_emis,
    SUM(c.solde_bloque_usd) AS total_cantonne_usd,
    ROUND((SUM(c.solde_bloque_usd) / e.encours_emoney_emis) * 100, 2) AS taux_couverture_pct,
    CASE 
        WHEN SUM(c.solde_bloque_usd) >= e.encours_emoney_emis THEN 'CONFORME (Couverture >= 100%)'
        ELSE 'INFRACTION CRITIQUE (Déficit de cantonnement)'
    END AS avis_conformite_bcc
FROM eme_emissions_journalieres e
INNER JOIN comptes_cantonnement_banques c 
    ON e.eme_id = c.eme_id 
    AND e.date_audit = c.date_audit 
    AND e.devise = c.devise
WHERE e.date_audit = '2026-10-27' AND e.devise = 'USD'
GROUP BY e.eme_id, e.encours_emoney_emis;`,
    explanation: 'Un EME peut répartir ses fonds de cantonnement sur plusieurs banques commerciales (ex: Vodacash chez Rawbank + EquityBCDC). Il est donc impératif de sommer le cantonnement avant de comparer à l\'encours total émis.',
    hint: 'Joignez sur e.eme_id = c.eme_id et groupez par e.eme_id, e.encours_emoney_emis.',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasJoin = q.includes('join') && q.includes('comptes_cantonnement_banques');
      const hasSum = q.includes('sum(c.solde_bloque_usd)') || q.includes('sum(solde_bloque_usd)');
      const hasGroup = q.includes('group by') && q.includes('eme_id');
      if (hasJoin && hasSum && hasGroup) {
        return {
          passed: true,
          message: 'Contrôle réglementaire validé ! AIRTEL_MONEY présente une anomalie critique : 62M$ émis pour seulement 58M$ cantonnés (couverture de 93.55%, déficit de 4M$). VODACASH (101.18%) et ORANGE_MONEY (101.43%) sont conformes.',
          rows: [
            { eme_id: 'AIRTEL_MONEY', encours_emoney_emis: 62000000, total_cantonne_usd: 58000000, taux_couverture_pct: 93.55, avis: 'INFRACTION CRITIQUE' },
            { eme_id: 'VODACASH', encours_emoney_emis: 85000000, total_cantonne_usd: 86000000, taux_couverture_pct: 101.18, avis: 'CONFORME' },
            { eme_id: 'ORANGE_MONEY', encours_emoney_emis: 35000000, total_cantonne_usd: 35500000, taux_couverture_pct: 101.43, avis: 'CONFORME' }
          ]
        };
      }
      return {
        passed: false,
        message: 'La requête doit effectuer un JOIN sur comptes_cantonnement_banques et calculer SUM(solde_bloque_usd) groupé par eme_id.'
      };
    }
  },
  {
    id: 'sql_chal_05',
    title: 'Surveillance du Marché des Changes : Calcul de la Volatilité Journalière CDF/USD',
    department: 'Direction des Marchés & Direction de la Recherche et Statistiques',
    difficulty: 'difficile',
    businessContext: 'Pour calibrer les interventions de la BCC par vente ou achat de devises, le gouverneur doit observer la variation en pourcentage jour le jour du cours interbancaire officiel.',
    description: 'Utiliser la fonction analytique LAG() pour comparer le cours du jour à celui de la veille et calculer la dépréciation journalière en pourcentage.',
    schemaTables: [
      {
        name: 'cours_indicatif_journalier',
        columns: [
          { name: 'date_cours', type: 'DATE', comment: 'Date de séance de change' },
          { name: 'taux_interbancaire_cdf_usd', type: 'NUMERIC(8,2)', comment: 'Cours moyen indicatif en Franc Congolais' }
        ],
        sampleData: [
          { date_cours: '2026-10-20', taux_interbancaire_cdf_usd: 2840.50 },
          { date_cours: '2026-10-21', taux_interbancaire_cdf_usd: 2845.00 },
          { date_cours: '2026-10-22', taux_interbancaire_cdf_usd: 2862.00 },
          { date_cours: '2026-10-23', taux_interbancaire_cdf_usd: 2895.00 },
          { date_cours: '2026-10-24', taux_interbancaire_cdf_usd: 2890.00 }
        ]
      }
    ],
    expectedTask: 'Utilisez LAG(taux_interbancaire_cdf_usd, 1) OVER (ORDER BY date_cours) et calculez la variation en % : ROUND(((taux_interbancaire_cdf_usd - LAG) / LAG) * 100, 3).',
    initialCode: `-- Mesure de la volatilité quotidienne du Franc Congolais
SELECT 
    date_cours,
    taux_interbancaire_cdf_usd,
    -- Obtenez le cours de la veille avec LAG()
    -- Calculez la variation en pourcentage...
FROM cours_indicatif_journalier
ORDER BY date_cours;
`,
    solutionQuery: `SELECT 
    date_cours,
    taux_interbancaire_cdf_usd,
    LAG(taux_interbancaire_cdf_usd, 1) OVER (ORDER BY date_cours) AS cours_veille,
    ROUND(
        ((taux_interbancaire_cdf_usd - LAG(taux_interbancaire_cdf_usd, 1) OVER (ORDER BY date_cours)) 
        / LAG(taux_interbancaire_cdf_usd, 1) OVER (ORDER BY date_cours)) * 100, 3
    ) AS variation_journaliere_pct
FROM cours_indicatif_journalier
ORDER BY date_cours;`,
    explanation: 'La fonction LAG(col, 1) OVER (ORDER BY date) récupère la valeur de la ligne précédente chronologique sans nécessiter une auto-jointure (self-join) coûteuse en ressources.',
    hint: 'Utilisez LAG(taux_interbancaire_cdf_usd, 1) OVER (ORDER BY date_cours) pour accéder au taux du jour précédent.',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasLag = q.includes('lag(taux_interbancaire_cdf_usd') || q.includes('lag( taux_interbancaire_cdf_usd');
      const hasOver = q.includes('over (order by date_cours)') || q.includes('over(order by date_cours)');
      if (hasLag && hasOver) {
        return {
          passed: true,
          message: 'Calcul de volatilité validé ! L\'accélération de la dépréciation le 23 octobre (+1.153%) dépasse le seuil de tolérance de 0.5% du CPM, déclenchant une alerte d\'intervention.',
          rows: [
            { date_cours: '2026-10-20', taux: 2840.50, cours_veille: null, variation_pct: null },
            { date_cours: '2026-10-21', taux: 2845.00, cours_veille: 2840.50, variation_pct: 0.158 },
            { date_cours: '2026-10-22', taux: 2862.00, cours_veille: 2845.00, variation_pct: 0.598 },
            { date_cours: '2026-10-23', taux: 2895.00, cours_veille: 2862.00, variation_pct: 1.153 },
            { date_cours: '2026-10-24', taux: 2890.00, cours_veille: 2895.00, variation_pct: -0.173 }
          ]
        };
      }
      return {
        passed: false,
        message: 'Utilisez la fonction LAG(...) OVER (ORDER BY date_cours) pour récupérer le cours de la séance précédente.'
      };
    }
  },
  {
    id: 'sql_chal_06',
    title: 'Surveillance Macroprudentielle : Analyse du Taux de Créances Douteuses (NPL) par Secteur',
    department: 'Direction de la Surveillance des Intermédiaires Financiers (DSIF)',
    difficulty: 'moyen',
    businessContext: 'La BCC effectue une surveillance macroprudentielle pour identifier les secteurs économiques congolais (Mines, Télécoms, BTP, Commerce) les plus exposés au défaut de paiement.',
    description: 'Calculer l\'encours total de crédit brut, le volume de crédits non performants (NPL = classes DOUTEUX et COMPROMIS) et le ratio NPL sectoriel en pourcentage.',
    schemaTables: [
      {
        name: 'portefeuille_credits_secteurs',
        columns: [
          { name: 'credit_id', type: 'VARCHAR(20)', comment: 'Référence dossier crédit' },
          { name: 'bank_code', type: 'VARCHAR(10)', comment: 'Banque prêteuse' },
          { name: 'secteur_activite', type: 'VARCHAR(50)', comment: 'Mines, Télécoms, Commerce, Agriculture' },
          { name: 'montant_brut_usd', type: 'NUMERIC(15,2)', comment: 'Encours prêt' },
          { name: 'classe_risque', type: 'VARCHAR(15)', comment: 'SAIN, SPECIAL, DOUTEUX, COMPROMIS' }
        ],
        sampleData: [
          { credit_id: 'CR-01', bank_code: 'RAW', secteur_activite: 'Mines & Extraction', montant_brut_usd: 50000000, classe_risque: 'SAIN' },
          { credit_id: 'CR-02', bank_code: 'RAW', secteur_activite: 'Mines & Extraction', montant_brut_usd: 30000000, classe_risque: 'SAIN' },
          { credit_id: 'CR-03', bank_code: 'RAW', secteur_activite: 'Mines & Extraction', montant_brut_usd: 20000000, classe_risque: 'DOUTEUX' },
          { credit_id: 'CR-04', bank_code: 'EQB', secteur_activite: 'Commerce de Gros Kinshasa', montant_brut_usd: 30000000, classe_risque: 'SAIN' },
          { credit_id: 'CR-05', bank_code: 'EQB', secteur_activite: 'Commerce de Gros Kinshasa', montant_brut_usd: 15000000, classe_risque: 'COMPROMIS' },
          { credit_id: 'CR-06', bank_code: 'TMB', secteur_activite: 'Télécommunications & Fintech', montant_brut_usd: 50000000, classe_risque: 'SAIN' },
          { credit_id: 'CR-07', bank_code: 'TMB', secteur_activite: 'Télécommunications & Fintech', montant_brut_usd: 2000000, classe_risque: 'SPECIAL' }
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
  },

  // ============================================================
  // NOUVEAUX EXERCICES : 7 À 26 (20 DÉFIS RÉELS HAUTE RIGUEUR BCC)
  // ============================================================

  // 7. DSIF : Ratio de Solvabilité Bâle II / Cooke
  {
    id: 'sql_chal_07',
    title: 'Surveillance Prudentielle : Ratio de Solvabilité (Fonds Propres / RWA) < 10%',
    department: 'Direction de la Surveillance des Intermédiaires Financiers (DSIF)',
    difficulty: 'difficile',
    description: 'Identifier les banques commerciales en infraction du ratio de solvabilité prudentielle de la BCC (Fonds Propres Réglementaires / Actifs Pondérés par les Risques RWA < 10%).',
    businessContext: 'L\'Instruction Administrative n°14 de la BCC impose un ratio de solvabilité minimum de 10%. Les banques sous ce seuil risquent la mise sous administration provisoire ou l\'interdiction de prêter.',
    schemaTables: [
      {
        name: 'solvabilite_banques_rdc',
        columns: [
          { name: 'bank_code', type: 'VARCHAR(10)', comment: 'Code banque commerciale' },
          { name: 'trimestre', type: 'VARCHAR(7)', comment: 'Ex: 2026-Q3' },
          { name: 'fonds_propres_base_usd', type: 'NUMERIC(15,2)', comment: 'Tier 1 Capital' },
          { name: 'fonds_propres_comp_usd', type: 'NUMERIC(15,2)', comment: 'Tier 2 Capital' },
          { name: 'rwa_credit_usd', type: 'NUMERIC(15,2)', comment: 'Pondération Risque de Crédit' },
          { name: 'rwa_marche_usd', type: 'NUMERIC(15,2)', comment: 'Pondération Risque de Marché' },
          { name: 'rwa_operationnel_usd', type: 'NUMERIC(15,2)', comment: 'Pondération Risque Opérationnel' }
        ],
        sampleData: [
          { bank_code: 'EQUITY_BCDC', trimestre: '2026-Q3', fonds_propres_base_usd: 180000000, fonds_propres_comp_usd: 40000000, rwa_credit_usd: 1200000000, rwa_marche_usd: 100000000, rwa_operationnel_usd: 150000000 },
          { bank_code: 'BANQUE_AFRILAND', trimestre: '2026-Q3', fonds_propres_base_usd: 25000000, fonds_propres_comp_usd: 5000000, rwa_credit_usd: 280000000, rwa_marche_usd: 30000000, rwa_operationnel_usd: 40000000 },
          { bank_code: 'RAWBANK', trimestre: '2026-Q3', fonds_propres_base_usd: 250000000, fonds_propres_comp_usd: 60000000, rwa_credit_usd: 1800000000, rwa_marche_usd: 120000000, rwa_operationnel_usd: 200000000 }
        ]
      }
    ],
    expectedTask: 'Calculez total_fonds_propres = (fonds_propres_base_usd + fonds_propres_comp_usd), total_rwa = (rwa_credit + rwa_marche + rwa_operationnel), le ratio en % et filtrez les banques avec ratio < 10.0%.',
    initialCode: `-- Détection des banques sous-capitalisées selon Bâle II / BCC
SELECT 
    bank_code,
    trimestre,
    (fonds_propres_base_usd + fonds_propres_comp_usd) AS total_fonds_propres,
    (rwa_credit_usd + rwa_marche_usd + rwa_operationnel_usd) AS total_rwa,
    -- Calculez le ratio de solvabilité en pourcentage...
FROM solvabilite_banques_rdc
WHERE trimestre = '2026-Q3'
-- Filtrez sur ratio < 10%...
`,
    solutionQuery: `SELECT 
    bank_code,
    trimestre,
    (fonds_propres_base_usd + fonds_propres_comp_usd) AS total_fonds_propres,
    (rwa_credit_usd + rwa_marche_usd + rwa_operationnel_usd) AS total_rwa,
    ROUND(((fonds_propres_base_usd + fonds_propres_comp_usd) / (rwa_credit_usd + rwa_marche_usd + rwa_operationnel_usd)) * 100, 2) AS ratio_solvabilite_pct
FROM solvabilite_banques_rdc
WHERE trimestre = '2026-Q3'
  AND ((fonds_propres_base_usd + fonds_propres_comp_usd) / (rwa_credit_usd + rwa_marche_usd + rwa_operationnel_usd)) < 0.10;`,
    explanation: 'Le ratio de solvabilité mesure la capacité d\'absorption des chocs de la banque. Si le capital total divisé par l\'ensemble des RWA passe sous 10%, la banque est en situation d\'alerte prudentielle immédiate.',
    hint: 'Total RWA = (rwa_credit_usd + rwa_marche_usd + rwa_operationnel_usd). Filtrez avec < 0.10 ou ratio_solvabilite_pct < 10.',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasRwa = q.includes('rwa_credit_usd') && q.includes('rwa_marche_usd') && q.includes('rwa_operationnel_usd');
      const hasFilter = q.includes('< 0.10') || q.includes('< 10') || q.includes('<0.10') || q.includes('<10');
      if (hasRwa && hasFilter) {
        return {
          passed: true,
          message: 'Contrôle de solvabilité réussi ! BANQUE_AFRILAND est en infraction critique avec un ratio de 8.57% (30M$ de fonds propres pour 350M$ de RWA). Convocation requise par la DSIF.',
          rows: [
            { bank_code: 'BANQUE_AFRILAND', total_fonds_propres: 30000000, total_rwa: 350000000, ratio_solvabilite_pct: 8.57 }
          ]
        };
      }
      return {
        passed: false,
        message: 'Votre requête doit sommer les 3 composantes de RWA et filtrer sur un ratio inférieur au seuil prudentiel de 10% (< 0.10).'
      };
    }
  },

  // 8. DSIF : Division des Grands Risques (Seuil 25% Instruction 15)
  {
    id: 'sql_chal_08',
    title: 'Surveillance des Grands Risques : Dépassement de la Limite de 25% par Groupe Débiteur',
    department: 'Direction de la Surveillance des Intermédiaires Financiers (DSIF)',
    difficulty: 'difficile',
    description: 'Détecter les groupes d\'entreprises débitrices dont l\'exposition consolidée dépasse 25% des fonds propres nets de la banque prêteuse (Instruction n°15 de la BCC).',
    businessContext: 'Pour éviter qu\'une seule faillite d\'entreprise n\'emporte une banque congolaise, la BCC interdit d\'octroyer à un même bénéficiaire plus de 25% des fonds propres réglementaires de l\'établissement.',
    schemaTables: [
      {
        name: 'expositions_credits_banques',
        columns: [
          { name: 'bank_code', type: 'VARCHAR(10)', comment: 'Banque prêteuse' },
          { name: 'groupe_emprunteur', type: 'VARCHAR(50)', comment: 'Nom du groupe client (Mines, Pétrole, Logistique)' },
          { name: 'engagement_total_usd', type: 'NUMERIC(15,2)', comment: 'Total encours crédits + cautions' }
        ],
        sampleData: [
          { bank_code: 'TMB', groupe_emprunteur: 'GROUPE_KATANGA_MINING', engagement_total_usd: 35000000 },
          { bank_code: 'TMB', groupe_emprunteur: 'GROUPE_KIN_DISTRIB', engagement_total_usd: 15000000 },
          { bank_code: 'FBNBANK', groupe_emprunteur: 'CONGO_PETROLEUM_CORP', engagement_total_usd: 18000000 },
          { bank_code: 'FBNBANK', groupe_emprunteur: 'CONGO_TELECOM_SUPPLY', engagement_total_usd: 6000000 }
        ]
      },
      {
        name: 'fonds_propres_nets_banques',
        columns: [
          { name: 'bank_code', type: 'VARCHAR(10)', comment: 'Code banque' },
          { name: 'fonds_propres_nets_usd', type: 'NUMERIC(15,2)', comment: 'Fonds propres nets prudentiels' }
        ],
        sampleData: [
          { bank_code: 'TMB', fonds_propres_nets_usd: 100000000 },
          { bank_code: 'FBNBANK', fonds_propres_nets_usd: 50000000 }
        ]
      }
    ],
    expectedTask: 'Joignez les 2 tables, calculez ratio_grand_risque_pct = (engagement_total_usd / fonds_propres_nets_usd) * 100, et filtrez sur ratio > 25.0%.',
    initialCode: `-- Contrôle de division des risques (Instruction n°15 BCC)
SELECT 
    e.bank_code,
    e.groupe_emprunteur,
    e.engagement_total_usd,
    f.fonds_propres_nets_usd,
    -- Calculez le ratio de concentration en %...
FROM expositions_credits_banques e
INNER JOIN fonds_propres_nets_banques f ON e.bank_code = f.bank_code
-- Complétez la clause de filtrage sur l'infraction > 25%...
`,
    solutionQuery: `SELECT 
    e.bank_code,
    e.groupe_emprunteur,
    e.engagement_total_usd,
    f.fonds_propres_nets_usd,
    ROUND((e.engagement_total_usd / f.fonds_propres_nets_usd) * 100, 2) AS ratio_grand_risque_pct
FROM expositions_credits_banques e
INNER JOIN fonds_propres_nets_banques f ON e.bank_code = f.bank_code
WHERE (e.engagement_total_usd / f.fonds_propres_nets_usd) > 0.25
ORDER BY ratio_grand_risque_pct DESC;`,
    explanation: 'Un grand risque est défini par tout engagement supérieur à 10% des fonds propres. L\'infraction légale survient dès qu\'un seul groupe dépasse 25% (ou 0.25).',
    hint: 'Joignez sur bank_code et filtrez WHERE (engagement_total_usd / fonds_propres_nets_usd) > 0.25.',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasJoin = q.includes('join') && q.includes('fonds_propres_nets_banques');
      const hasRatio = q.includes('engagement_total_usd / f.fonds_propres_nets_usd') || q.includes('engagement_total_usd / fonds_propres_nets_usd') || q.includes('engagement_total_usd/f.fonds_propres_nets_usd');
      const hasFilter = q.includes('> 0.25') || q.includes('> 25') || q.includes('>0.25') || q.includes('>25');
      if (hasJoin && hasRatio && hasFilter) {
        return {
          passed: true,
          message: 'Infractions de concentration détectées avec succès ! GROUPE_KATANGA_MINING chez TMB (35.00%) et CONGO_PETROLEUM_CORP chez FBNBANK (36.00%) violent la limite légale des 25%.',
          rows: [
            { bank_code: 'FBNBANK', groupe: 'CONGO_PETROLEUM_CORP', engagement: 18000000, ratio_pct: 36.00 },
            { bank_code: 'TMB', groupe: 'GROUPE_KATANGA_MINING', engagement: 35000000, ratio_pct: 35.00 }
          ]
        };
      }
      return {
        passed: false,
        message: 'Effectuez une jointure sur les fonds propres nets et filtrez sur un ratio engagement / fonds propres supérieur à 25% (> 0.25).'
      };
    }
  },

  // 9. DSIF & CPM : Contrôle de la Réserve Obligatoire (RO)
  {
    id: 'sql_chal_09',
    title: 'Politique Monétaire : Vérification Hebdomadaire des Réserves Obligatoires (RO) en Devises',
    department: 'Direction de la Surveillance des Intermédiaires Financiers & CPM',
    difficulty: 'difficile',
    description: 'Calculer la réserve obligatoire exigible en devises (Assiette des dépôts en USD * taux légal de 10%) et détecter les banques en défaut de constitution sur leur compte BCC.',
    businessContext: 'Chaque semaine, les banques commerciales doivent bloquer un montant déterminé sur leur compte courant à la Banque Centrale du Congo. Tout déficit de réserve obligatoire est sanctionné par une pénalité financière calculée au taux directeur majoré.',
    schemaTables: [
      {
        name: 'assiette_depots_usd',
        columns: [
          { name: 'bank_code', type: 'VARCHAR(10)', comment: 'Code banque' },
          { name: 'semaine_audit', type: 'VARCHAR(10)', comment: 'Ex: 2026-W43' },
          { name: 'depots_a_vue_usd', type: 'NUMERIC(15,2)', comment: 'Dépôts à vue clientèle en USD' },
          { name: 'depots_a_terme_usd', type: 'NUMERIC(15,2)', comment: 'Dépôts à terme clientèle en USD' }
        ],
        sampleData: [
          { bank_code: 'RAWBANK', semaine_audit: '2026-W43', depots_a_vue_usd: 800000000, depots_a_terme_usd: 200000000 },
          { bank_code: 'ECOBANK', semaine_audit: '2026-W43', depots_a_vue_usd: 250000000, depots_a_terme_usd: 50000000 },
          { bank_code: 'SOFIBANQUE', semaine_audit: '2026-W43', depots_a_vue_usd: 180000000, depots_a_terme_usd: 20000000 }
        ]
      },
      {
        name: 'comptes_courants_bcc_usd',
        columns: [
          { name: 'bank_code', type: 'VARCHAR(10)', comment: 'Code banque' },
          { name: 'semaine_audit', type: 'VARCHAR(10)', comment: 'Ex: 2026-W43' },
          { name: 'solde_moyen_bloque_usd', type: 'NUMERIC(15,2)', comment: 'Solde réel constaté sur le compte RO à la BCC' }
        ],
        sampleData: [
          { bank_code: 'RAWBANK', semaine_audit: '2026-W43', solde_moyen_bloque_usd: 105000000 },
          { bank_code: 'ECOBANK', semaine_audit: '2026-W43', solde_moyen_bloque_usd: 26000000 },
          { bank_code: 'SOFIBANQUE', semaine_audit: '2026-W43', solde_moyen_bloque_usd: 21000000 }
        ]
      }
    ],
    expectedTask: 'Calculez ro_exigible_usd = (depots_a_vue_usd + depots_a_terme_usd) * 0.10, joignez avec les comptes courants et filtrez les banques dont solde_moyen_bloque_usd < ro_exigible_usd.',
    initialCode: `-- Contrôle hebdomadaire de conformité de la Réserve Obligatoire (BCC)
SELECT 
    a.bank_code,
    a.semaine_audit,
    (a.depots_a_vue_usd + a.depots_a_terme_usd) * 0.10 AS ro_exigible_usd,
    c.solde_moyen_bloque_usd,
    (c.solde_moyen_bloque_usd - ((a.depots_a_vue_usd + a.depots_a_terme_usd) * 0.10)) AS ecart_liquidite_usd
FROM assiette_depots_usd a
INNER JOIN comptes_courants_bcc_usd c 
    ON a.bank_code = c.bank_code AND a.semaine_audit = c.semaine_audit
-- Complétez le filtre pour identifier le manquement...
`,
    solutionQuery: `SELECT 
    a.bank_code,
    a.semaine_audit,
    (a.depots_a_vue_usd + a.depots_a_terme_usd) * 0.10 AS ro_exigible_usd,
    c.solde_moyen_bloque_usd,
    (c.solde_moyen_bloque_usd - ((a.depots_a_vue_usd + a.depots_a_terme_usd) * 0.10)) AS ecart_liquidite_usd
FROM assiette_depots_usd a
INNER JOIN comptes_courants_bcc_usd c 
    ON a.bank_code = c.bank_code AND a.semaine_audit = c.semaine_audit
WHERE c.solde_moyen_bloque_usd < ((a.depots_a_vue_usd + a.depots_a_terme_usd) * 0.10);`,
    explanation: 'L\'assiette de calcul de la Réserve Obligatoire en devises regroupe l\'ensemble des dépôts exigibles en USD. Avec un coefficient réglementaire de 10%, un établissement disposant de 300M$ de dépôts doit avoir au moins 30M$ séquestrés à la BCC.',
    hint: 'Filtrez avec WHERE c.solde_moyen_bloque_usd < ro_exigible_usd.',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasJoin = q.includes('join') && q.includes('comptes_courants_bcc_usd');
      const hasRoCalc = q.includes('0.10') || q.includes('0.1') || q.includes('* 10 / 100');
      const hasDeficit = q.includes('c.solde_moyen_bloque_usd <') || q.includes('solde_moyen_bloque_usd <');
      if (hasJoin && hasRoCalc && hasDeficit) {
        return {
          passed: true,
          message: 'Anomalie de réserve obligatoire isolée ! ECOBANK est en déficit de 4 millions USD (RO exigible de 30M$ contre 26M$ bloqués). Application de la pénalité CPM requise.',
          rows: [
            { bank_code: 'ECOBANK', ro_exigible_usd: 30000000, solde_bloque: 26000000, ecart_liquidite_usd: -4000000 }
          ]
        };
      }
      return {
        passed: false,
        message: 'Calculez la réserve exigible à 10% des dépôts totaux et filtrez les banques dont le solde bloqué est strictement inférieur au montant exigé.'
      };
    }
  },

  // 10. DSIF : Crédits aux Dirigeants et Apparentés (Insiders Lending Instruction 17)
  {
    id: 'sql_chal_10',
    title: 'Gouvernance & Risque de Crédit : Cumul des Prêts aux Dirigeants et Actionnaires > 20%',
    department: 'Direction de la Surveillance des Intermédiaires Financiers (DSIF)',
    difficulty: 'difficile',
    description: 'Sommer tous les crédits octroyés aux personnes apparentées (administrateurs, directeurs généraux, actionnaires significatifs) par banque et vérifier le respect du plafond global de 20% des fonds propres (Instruction n°17).',
    businessContext: 'Le pillage d\'établissements bancaires par leurs propres actionnaires est une cause historique majeure de faillite bancaire en Afrique centrale. La BCC surveille rigoureusement les prêts aux initiés.',
    schemaTables: [
      {
        name: 'credits_apparentes_inities',
        columns: [
          { name: 'credit_id', type: 'VARCHAR(20)', comment: 'N° dossier crédit' },
          { name: 'bank_code', type: 'VARCHAR(10)', comment: 'Banque prêteuse' },
          { name: 'qualite_emprunteur', type: 'VARCHAR(30)', comment: 'ADMINISTRATEUR, ACTIONNAIRE, DIRECTEUR_GENERAL' },
          { name: 'montant_accorde_usd', type: 'NUMERIC(15,2)', comment: 'Montant du prêt' }
        ],
        sampleData: [
          { credit_id: 'PR-901', bank_code: 'BANQUE_X', qualite_emprunteur: 'ADMINISTRATEUR', montant_accorde_usd: 8000000 },
          { credit_id: 'PR-902', bank_code: 'BANQUE_X', qualite_emprunteur: 'ACTIONNAIRE', montant_accorde_usd: 5000000 },
          { credit_id: 'PR-903', bank_code: 'BANQUE_Y', qualite_emprunteur: 'DIRECTEUR_GENERAL', montant_accorde_usd: 2000000 },
          { credit_id: 'PR-904', bank_code: 'BANQUE_Y', qualite_emprunteur: 'ADMINISTRATEUR', montant_accorde_usd: 1500000 }
        ]
      },
      {
        name: 'fonds_propres_banques',
        columns: [
          { name: 'bank_code', type: 'VARCHAR(10)', comment: 'Banque' },
          { name: 'fonds_propres_usd', type: 'NUMERIC(15,2)', comment: 'Fonds propres prudentiels' }
        ],
        sampleData: [
          { bank_code: 'BANQUE_X', fonds_propres_usd: 50000000 },
          { bank_code: 'BANQUE_Y', fonds_propres_usd: 80000000 }
        ]
      }
    ],
    expectedTask: 'Groupez par bank_code, calculez SUM(montant_accorde_usd), joignez les fonds propres et filtrez WHERE (SUM(montant_accorde_usd) / fonds_propres_usd) > 0.20.',
    initialCode: `-- Audit des crédits aux initiés (Instruction n°17 BCC)
SELECT 
    c.bank_code,
    SUM(c.montant_accorde_usd) AS total_prets_inities_usd,
    f.fonds_propres_usd,
    ROUND((SUM(c.montant_accorde_usd) / f.fonds_propres_usd) * 100, 2) AS ratio_apparentes_pct
FROM credits_apparentes_inities c
INNER JOIN fonds_propres_banques f ON c.bank_code = f.bank_code
GROUP BY c.bank_code, f.fonds_propres_usd
-- Filtrez sur dépassement du plafond de 20%...
`,
    solutionQuery: `SELECT 
    c.bank_code,
    SUM(c.montant_accorde_usd) AS total_prets_inities_usd,
    f.fonds_propres_usd,
    ROUND((SUM(c.montant_accorde_usd) / f.fonds_propres_usd) * 100, 2) AS ratio_apparentes_pct
FROM credits_apparentes_inities c
INNER JOIN fonds_propres_banques f ON c.bank_code = f.bank_code
GROUP BY c.bank_code, f.fonds_propres_usd
HAVING (SUM(c.montant_accorde_usd) / f.fonds_propres_usd) > 0.20;`,
    explanation: 'Le ratio d\'engagements sur les personnes apparentées ne doit jamais dépasser 20% des fonds propres. La clause HAVING permet de filtrer sur le résultat agrégé de la somme.',
    hint: 'Utilisez HAVING (SUM(c.montant_accorde_usd) / f.fonds_propres_usd) > 0.20.',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasGroup = q.includes('group by') && q.includes('bank_code');
      const hasHaving = q.includes('having') && (q.includes('> 0.20') || q.includes('> 20') || q.includes('>0.20') || q.includes('>20'));
      if (hasGroup && hasHaving) {
        return {
          passed: true,
          message: 'Infraction de gouvernance confirmée ! BANQUE_X a accordé 13 millions USD à ses administrateurs pour 50M$ de fonds propres (ratio de 26.00%), violant le plafond légal de 20%.',
          rows: [
            { bank_code: 'BANQUE_X', total_inities: 13000000, fonds_propres: 50000000, ratio_pct: 26.00 }
          ]
        };
      }
      return {
        passed: false,
        message: 'Votre requête doit grouper par bank_code et filtrer via une clause HAVING le ratio dépassant 20% (0.20).'
      };
    }
  },

  // 11. DSIF : Contrôle du Provisionnement Prudentiel selon l'Instruction n°14
  {
    id: 'sql_chal_11',
    title: 'Surveillance Prudentielle : Contrôle du Provisionnement Minimum Obligatoire des Créances',
    department: 'Direction de la Surveillance des Intermédiaires Financiers (DSIF)',
    difficulty: 'difficile',
    description: 'Calculer la provision prudentielle requise selon les normes BCC (Sains: 0%, Mention Spéciale: 1%, Douteux: 20%, Compromis: 100%) et identifier les banques sous-provisionnées.',
    businessContext: 'La sous-évaluation des provisions par les banques masque les pertes réelles et fausse le résultat net. Les inspecteurs de la BCC recalibrent systématiquement les dotations obligatoires.',
    schemaTables: [
      {
        name: 'portefeuille_credits_provisions',
        columns: [
          { name: 'bank_code', type: 'VARCHAR(10)', comment: 'Code banque' },
          { name: 'classe_credit', type: 'VARCHAR(20)', comment: 'SAIN, SPECIAL, DOUTEUX, COMPROMIS' },
          { name: 'encours_brut_usd', type: 'NUMERIC(15,2)', comment: 'Montant brut' },
          { name: 'provisions_constituees_usd', type: 'NUMERIC(15,2)', comment: 'Provisions inscrites au bilan' }
        ],
        sampleData: [
          { bank_code: 'BANQUE_NORD', classe_credit: 'SAIN', encours_brut_usd: 80000000, provisions_constituees_usd: 0 },
          { bank_code: 'BANQUE_NORD', classe_credit: 'SPECIAL', encours_brut_usd: 20000000, provisions_constituees_usd: 100000 },
          { bank_code: 'BANQUE_NORD', classe_credit: 'DOUTEUX', encours_brut_usd: 15000000, provisions_constituees_usd: 1500000 },
          { bank_code: 'BANQUE_NORD', classe_credit: 'COMPROMIS', encours_brut_usd: 10000000, provisions_constituees_usd: 6000000 }
        ]
      }
    ],
    expectedTask: 'Calculez provision_bcc_requise avec un CASE WHEN (SAIN: 0, SPECIAL: encours * 0.01, DOUTEUX: encours * 0.20, COMPROMIS: encours * 1.0), puis faites la somme par banque et comparez aux provisions constituées.',
    initialCode: `-- Contrôle de conformité des provisions bancaires
SELECT 
    bank_code,
    SUM(provisions_constituees_usd) AS total_constitue_usd,
    SUM(
        CASE classe_credit
            WHEN 'SAIN' THEN 0
            WHEN 'SPECIAL' THEN encours_brut_usd * 0.01
            WHEN 'DOUTEUX' THEN encours_brut_usd * 0.20
            WHEN 'COMPROMIS' THEN encours_brut_usd * 1.00
        END
    ) AS total_exige_bcc_usd
FROM portefeuille_credits_provisions
GROUP BY bank_code;
`,
    solutionQuery: `SELECT 
    bank_code,
    SUM(provisions_constituees_usd) AS total_constitue_usd,
    SUM(
        CASE classe_credit
            WHEN 'SAIN' THEN 0
            WHEN 'SPECIAL' THEN encours_brut_usd * 0.01
            WHEN 'DOUTEUX' THEN encours_brut_usd * 0.20
            WHEN 'COMPROMIS' THEN encours_brut_usd * 1.00
        END
    ) AS total_exige_bcc_usd,
    (SUM(provisions_constituees_usd) - SUM(
        CASE classe_credit
            WHEN 'SAIN' THEN 0
            WHEN 'SPECIAL' THEN encours_brut_usd * 0.01
            WHEN 'DOUTEUX' THEN encours_brut_usd * 0.20
            WHEN 'COMPROMIS' THEN encours_brut_usd * 1.00
        END
    )) AS deficit_provision_usd
FROM portefeuille_credits_provisions
GROUP BY bank_code;`,
    explanation: 'Le calcul pondéré par classe de risque permet de vérifier si la banque a constitué les dotations minimales obligatoires. Un écart négatif impose un redressement comptable immédiat.',
    hint: 'Utilisez CASE classe_credit WHEN ... THEN encours_brut_usd * coefficient END.',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasCase = q.includes('case') && q.includes('0.01') && q.includes('0.20') && q.includes('1.0');
      const hasGroup = q.includes('group by') && q.includes('bank_code');
      if (hasCase && hasGroup) {
        return {
          passed: true,
          message: 'Audit de provisionnement validé ! BANQUE_NORD présente un déficit de provisionnement de 5,6 millions USD (7,6M$ constitués contre 13,2M$ exigés par la BCC). Mise en demeure automatique générée.',
          rows: [
            { bank_code: 'BANQUE_NORD', total_constitue_usd: 7600000, total_exige_bcc_usd: 13200000, deficit_provision_usd: -5600000 }
          ]
        };
      }
      return {
        passed: false,
        message: 'Votre requête doit appliquer les coefficients légaux (0% Sain, 1% Spécial, 20% Douteux, 100% Compromis) et sommer par banque.'
      };
    }
  },

  // 12. DSIF : Ratio de Transformation à Long Terme (Maturity Mismatch)
  {
    id: 'sql_chal_12',
    title: 'Surveillance ALM : Ratio de Transformation à Long Terme (Ressources Stables / Emplois Longs)',
    department: 'Direction de la Surveillance des Intermédiaires Financiers (DSIF)',
    difficulty: 'difficile',
    description: 'Calculer le ratio de transformation à long terme d\'une banque commerciale : Ressources stables à plus d\'1 an / Emplois à plus d\'1 an (Seuil minimum prudentiel >= 80%).',
    businessContext: 'Prêter à long terme (5 ans pour l\'immobilier ou les mines) avec des dépôts à vue (retirables immédiatement) crée un risque d\'illiquidité mortel en cas de crise. La BCC exige un taux de couverture minimal de 80%.',
    schemaTables: [
      {
        name: 'bilan_alm_maturites',
        columns: [
          { name: 'bank_code', type: 'VARCHAR(10)', comment: 'Code banque' },
          { name: 'ressources_stables_sup_1an_usd', type: 'NUMERIC(15,2)', comment: 'Fonds propres + Dépôts à terme > 1 an' },
          { name: 'emplois_immobilises_sup_1an_usd', type: 'NUMERIC(15,2)', comment: 'Crédits > 1 an + Immobilisations' }
        ],
        sampleData: [
          { bank_code: 'EQUITY_BCDC', ressources_stables_sup_1an_usd: 450000000, emplois_immobilises_sup_1an_usd: 400000000 },
          { bank_code: 'BANQUE_SUD', ressources_stables_sup_1an_usd: 120000000, emplois_immobilises_sup_1an_usd: 200000000 },
          { bank_code: 'TMB', ressources_stables_sup_1an_usd: 310000000, emplois_immobilises_sup_1an_usd: 350000000 }
        ]
      }
    ],
    expectedTask: 'Calculez ratio_transformation_pct = (ressources_stables_sup_1an_usd / emplois_immobilises_sup_1an_usd) * 100, et filtrez les banques sous le seuil prudentiel de 80%.',
    initialCode: `-- Contrôle du risque de maturité ALM
SELECT 
    bank_code,
    ressources_stables_sup_1an_usd,
    emplois_immobilises_sup_1an_usd,
    -- Calculez le ratio en pourcentage...
FROM bilan_alm_maturites
-- Filtrez les banques en risque de transformation (< 80%)...
`,
    solutionQuery: `SELECT 
    bank_code,
    ressources_stables_sup_1an_usd,
    emplois_immobilises_sup_1an_usd,
    ROUND((ressources_stables_sup_1an_usd / emplois_immobilises_sup_1an_usd) * 100, 2) AS ratio_transformation_pct
FROM bilan_alm_maturites
WHERE (ressources_stables_sup_1an_usd / emplois_immobilises_sup_1an_usd) < 0.80
ORDER BY ratio_transformation_pct ASC;`,
    explanation: 'Un ratio de transformation inférieur à 80% (ou 0.80) indique une dépendance excessive aux dépôts à court terme pour financer des projets longs, exposant la banque à un déséquilibre violent en cas de panique bancaire.',
    hint: 'Divisez ressources stables par emplois immobilisés et filtrez WHERE ratio < 0.80.',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasRatio = q.includes('ressources_stables_sup_1an_usd / emplois_immobilises_sup_1an_usd') || q.includes('ressources_stables_sup_1an_usd/emplois_immobilises_sup_1an_usd');
      const hasFilter = q.includes('< 0.80') || q.includes('< 80') || q.includes('<0.80') || q.includes('<80');
      if (hasRatio && hasFilter) {
        return {
          passed: true,
          message: 'Alerte de transformation validée ! BANQUE_SUD présente un ratio dangereux de 60.00% (120M$ de ressources stables pour 200M$ d\'emplois longs). Ordre d\'augmentation de capital requis.',
          rows: [
            { bank_code: 'BANQUE_SUD', ratio_transformation_pct: 60.00 }
          ]
        };
      }
      return {
        passed: false,
        message: 'Calculez le ratio de transformation et filtrez les banques inférieures au seuil prudentiel de 80% (< 0.80).'
      };
    }
  },

  // 13. DSP : Audit du Switch National ATS/CSD (Taux de Rejets et Liquidité)
  {
    id: 'sql_chal_13',
    title: 'Surveillance ATS / Switch National : Détection des Banques au Taux de Rejet Anormal pour Solde Insuffisant',
    department: 'Direction des Systèmes de Paiement (DSP)',
    difficulty: 'difficile',
    description: 'Calculer pour chaque banque participante au switch national ATS le nombre total de virements émis, le nombre de rejets pour défaut de provision ("INSUFFICIENT_FUNDS"), et le taux d\'échec journalier en %.',
    businessContext: 'Le système ATS interconnecte toutes les banques de la RDC. Lorsqu\'une banque émet des virements rejetés en masse faute de liquidités sur son compte à la BCC, cela perturbe la chaîne nationale de paiement.',
    schemaTables: [
      {
        name: 'ats_switch_logs',
        columns: [
          { name: 'tx_ref', type: 'VARCHAR(25)', comment: 'Référence message ATS' },
          { name: 'bank_sender', type: 'VARCHAR(10)', comment: 'Banque émettrice' },
          { name: 'amount_cdf', type: 'NUMERIC(15,2)', comment: 'Montant en CDF' },
          { name: 'status_code', type: 'VARCHAR(20)', comment: 'SETTLED, REJECTED_INSUFFICIENT_FUNDS, REJECTED_TECHNICAL' },
          { name: 'log_date', type: 'DATE', comment: 'Date de séance ATS' }
        ],
        sampleData: [
          { tx_ref: 'ATS-01', bank_sender: 'BANQUE_ALPHA', amount_cdf: 500000000, status_code: 'SETTLED', log_date: '2026-10-29' },
          { tx_ref: 'ATS-02', bank_sender: 'BANQUE_ALPHA', amount_cdf: 200000000, status_code: 'REJECTED_INSUFFICIENT_FUNDS', log_date: '2026-10-29' },
          { tx_ref: 'ATS-03', bank_sender: 'BANQUE_ALPHA', amount_cdf: 150000000, status_code: 'REJECTED_INSUFFICIENT_FUNDS', log_date: '2026-10-29' },
          { tx_ref: 'ATS-04', bank_sender: 'BANQUE_BETA', amount_cdf: 800000000, status_code: 'SETTLED', log_date: '2026-10-29' },
          { tx_ref: 'ATS-05', bank_sender: 'BANQUE_BETA', amount_cdf: 900000000, status_code: 'SETTLED', log_date: '2026-10-29' }
        ]
      }
    ],
    expectedTask: 'Groupez par bank_sender, comptez le total de transactions, comptez les REJECTED_INSUFFICIENT_FUNDS avec COUNT(CASE WHEN ...), et calculez le taux_rejet_pct. Filtrez les banques ayant un taux > 5%.',
    initialCode: `-- Audit de fluidité des règlements ATS
SELECT 
    bank_sender,
    COUNT(*) AS total_transactions_emises,
    COUNT(CASE WHEN status_code = 'REJECTED_INSUFFICIENT_FUNDS' THEN 1 END) AS nb_rejets_liquidite,
    -- Calculez le taux de rejet en pourcentage...
FROM ats_switch_logs
WHERE log_date = '2026-10-29'
GROUP BY bank_sender;
`,
    solutionQuery: `SELECT 
    bank_sender,
    COUNT(*) AS total_transactions_emises,
    COUNT(CASE WHEN status_code = 'REJECTED_INSUFFICIENT_FUNDS' THEN 1 END) AS nb_rejets_liquidite,
    ROUND((COUNT(CASE WHEN status_code = 'REJECTED_INSUFFICIENT_FUNDS' THEN 1 END)::NUMERIC / COUNT(*)) * 100, 2) AS taux_rejet_pct
FROM ats_switch_logs
WHERE log_date = '2026-10-29'
GROUP BY bank_sender
HAVING (COUNT(CASE WHEN status_code = 'REJECTED_INSUFFICIENT_FUNDS' THEN 1 END)::NUMERIC / COUNT(*)) > 0.05
ORDER BY taux_rejet_pct DESC;`,
    explanation: 'L\'agrégation conditionnelle permet de déterminer instantanément les participants présentant un risque de contrepartie intrajournalier sans multiplier les sous-requêtes.',
    hint: 'Utilisez COUNT(CASE WHEN status_code = \'REJECTED_INSUFFICIENT_FUNDS\' THEN 1 END) et une clause HAVING pour isoler les banques avec un taux de rejet supérieur à 5%.',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasCount = q.includes('count(*)') || q.includes('count(1)');
      const hasCase = q.includes('rejected_insufficient_funds');
      const hasGroup = q.includes('group by') && q.includes('bank_sender');
      if (hasCount && hasCase && hasGroup) {
        return {
          passed: true,
          message: 'Anomalie ATS détectée ! BANQUE_ALPHA affiche un taux de rejet critique de 66.67% (2 rejets sur 3 transactions émises). Blocage préventif des files d\'attente ATS recommandé.',
          rows: [
            { bank_sender: 'BANQUE_ALPHA', total: 3, nb_rejets: 2, taux_rejet_pct: 66.67 }
          ]
        };
      }
      return {
        passed: false,
        message: 'Votre requête doit grouper par bank_sender, compter les rejets pour insuffisance de provision et filtrer sur un taux supérieur à 5%.'
      };
    }
  },

  // 14. DSP : Mobile Money Instruction 24 - Alerte Déficit Journalier
  {
    id: 'sql_chal_14',
    title: 'Surveillance EME : Alerte Automatisée de Déficit de Cantonnement Mobile Money',
    department: 'Direction des Systèmes de Paiement (DSP)',
    difficulty: 'difficile',
    description: 'Générer la liste d\'alerte journalière des opérateurs Mobile Money en déficit de cantonnement, avec le montant exact du déficit en USD et l\'astreinte journalière encourue (1% du déficit selon la circulaire BCC).',
    businessContext: 'Conformément à l\'Instruction n°24, tout déficit de cantonnement non régularisé dans les 24 heures expose l\'établissement émetteur de monnaie électronique à une pénalité financière et à la suspension de son agrément.',
    schemaTables: [
      {
        name: 'eme_synthese_cantonnement',
        columns: [
          { name: 'eme_code', type: 'VARCHAR(20)', comment: 'VODACASH, AIRTEL_MONEY, ORANGE_MONEY' },
          { name: 'date_situation', type: 'DATE', comment: 'Date du contrôle' },
          { name: 'valeur_emoney_circulante_usd', type: 'NUMERIC(15,2)', comment: 'Float total' },
          { name: 'fonds_cantonnes_certifies_usd', type: 'NUMERIC(15,2)', comment: 'Fonds bloqués certifiés' }
        ],
        sampleData: [
          { eme_code: 'AIRTEL_MONEY', date_situation: '2026-10-28', valeur_emoney_circulante_usd: 70000000, fonds_cantonnes_certifies_usd: 66000000 },
          { eme_code: 'VODACASH', date_situation: '2026-10-28', valeur_emoney_circulante_usd: 95000000, fonds_cantonnes_certifies_usd: 96000000 },
          { eme_code: 'ORANGE_MONEY', date_situation: '2026-10-28', valeur_emoney_circulante_usd: 40000000, fonds_cantonnes_certifies_usd: 40200000 }
        ]
      }
    ],
    expectedTask: 'Filtrez WHERE fonds_cantonnes_certifies_usd < valeur_emoney_circulante_usd, calculez montant_deficit_usd = (valeur - fonds) et astreinte_journaliere_usd = montant_deficit * 0.01.',
    initialCode: `-- Génération d'astreinte pour déficit de cantonnement
SELECT 
    eme_code,
    date_situation,
    valeur_emoney_circulante_usd,
    fonds_cantonnes_certifies_usd,
    (valeur_emoney_circulante_usd - fonds_cantonnes_certifies_usd) AS montant_deficit_usd,
    -- Calculez l'astreinte journalière à 1% du déficit...
FROM eme_synthese_cantonnement
-- Complétez le filtre d'alerte...
`,
    solutionQuery: `SELECT 
    eme_code,
    date_situation,
    valeur_emoney_circulante_usd,
    fonds_cantonnes_certifies_usd,
    (valeur_emoney_circulante_usd - fonds_cantonnes_certifies_usd) AS montant_deficit_usd,
    ROUND((valeur_emoney_circulante_usd - fonds_cantonnes_certifies_usd) * 0.01, 2) AS astreinte_journaliere_usd
FROM eme_synthese_cantonnement
WHERE fonds_cantonnes_certifies_usd < valeur_emoney_circulante_usd;`,
    explanation: 'Le calcul automatisé du déficit permet à la DSP de notifier l\'opérateur à 09h00 dès réception des extraits bancaires certifiés, avec l\'astreinte légale calculée au centime près.',
    hint: 'Filtrez les cas où les fonds certifiés sont strictement inférieurs à la monnaie en circulation.',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasDeficit = q.includes('valeur_emoney_circulante_usd - fonds_cantonnes_certifies_usd') || q.includes('valeur_emoney_circulante_usd-fonds_cantonnes_certifies_usd');
      const hasAstreinte = q.includes('0.01') || q.includes('/ 100');
      const hasFilter = q.includes('fonds_cantonnes_certifies_usd < valeur_emoney_circulante_usd');
      if (hasDeficit && hasAstreinte && hasFilter) {
        return {
          passed: true,
          message: 'Alerte d\'astreinte validée ! AIRTEL_MONEY présente un déficit de 4 000 000 USD, générant une astreinte journalière immédiate de 40 000 USD.',
          rows: [
            { eme_code: 'AIRTEL_MONEY', date: '2026-10-28', deficit: 4000000, astreinte_usd: 40000 }
          ]
        };
      }
      return {
        passed: false,
        message: 'Votre requête doit filtrer sur les fonds cantonnés inférieurs au float et calculer l\'astreinte de 1% sur le déficit.'
      };
    }
  },

  // 15. DSP : Surveillance des Agents Bancaires (Agent Banking Plafonds)
  {
    id: 'sql_chal_15',
    title: 'Surveillance des Réseaux d\'Agents : Détection de Dépassement de Plafond Journalier par Point de Service',
    department: 'Direction des Systèmes de Paiement (DSP)',
    difficulty: 'difficile',
    description: 'Identifier les sous-agents bancaires et points Mobile Money ayant traité dans la journée un volume cumulé de dépôts/retraits en cash supérieur à leur agrément légal (Plafond de 20 000 USD / jour).',
    businessContext: 'Les points de vente non régulés manipulant des dizaines de milliers de dollars par jour en espèces constituent des vecteurs prioritaires de blanchiment d\'argent et d\'économie informelle en RDC.',
    schemaTables: [
      {
        name: 'agent_banking_operations',
        columns: [
          { name: 'op_id', type: 'BIGINT', comment: 'N° opération' },
          { name: 'agent_id', type: 'VARCHAR(20)', comment: 'Identifiant point de vente' },
          { name: 'ville', type: 'VARCHAR(30)', comment: 'Kinshasa, Lubumbashi, Goma, Matadi' },
          { name: 'type_operation', type: 'VARCHAR(15)', comment: 'CASH_IN, CASH_OUT' },
          { name: 'montant_usd', type: 'NUMERIC(10,2)', comment: 'Montant cash traité' },
          { name: 'date_op', type: 'DATE', comment: 'Date d\'opération' }
        ],
        sampleData: [
          { op_id: 101, agent_id: 'AGT-KIN-0042', ville: 'Kinshasa', type_operation: 'CASH_IN', montant_usd: 12000, date_op: '2026-10-28' },
          { op_id: 102, agent_id: 'AGT-KIN-0042', ville: 'Kinshasa', type_operation: 'CASH_IN', montant_usd: 9500, date_op: '2026-10-28' },
          { op_id: 103, agent_id: 'AGT-GOM-0115', ville: 'Goma', type_operation: 'CASH_OUT', montant_usd: 5000, date_op: '2026-10-28' },
          { op_id: 104, agent_id: 'AGT-LUB-0890', ville: 'Lubumbashi', type_operation: 'CASH_IN', montant_usd: 8000, date_op: '2026-10-28' }
        ]
      }
    ],
    expectedTask: 'Groupez par agent_id, ville, date_op, calculez SUM(montant_usd) et filtrez avec HAVING SUM(montant_usd) > 20000.',
    initialCode: `-- Contrôle des plafonds d'agents bancaires
SELECT 
    agent_id,
    ville,
    date_op,
    COUNT(*) AS nombre_operations,
    SUM(montant_usd) AS volume_total_cash_usd
FROM agent_banking_operations
GROUP BY agent_id, ville, date_op
-- Filtrez sur dépassement du plafond légal de 20 000 USD...
`,
    solutionQuery: `SELECT 
    agent_id,
    ville,
    date_op,
    COUNT(*) AS nombre_operations,
    SUM(montant_usd) AS volume_total_cash_usd
FROM agent_banking_operations
GROUP BY agent_id, ville, date_op
HAVING SUM(montant_usd) > 20000
ORDER BY volume_total_cash_usd DESC;`,
    explanation: 'Le seuil réglementaire de 20 000 USD vise à forcer les commerçants traitant des flux d\'entreprise à ouvrir un compte institutionnel plutôt que de transiter par des comptes d\'agents particuliers.',
    hint: 'Utilisez HAVING SUM(montant_usd) > 20000.',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasGroup = q.includes('group by') && q.includes('agent_id');
      const hasHaving = q.includes('having') && (q.includes('> 20000') || q.includes('>20000'));
      if (hasGroup && hasHaving) {
        return {
          passed: true,
          message: 'Point de service hors-norme détecté ! L\'agent AGT-KIN-0042 à Kinshasa a brassé 21 500 USD en seulement 2 opérations, dépassant le plafond d\'agrément. Contrôle sur place requis.',
          rows: [
            { agent_id: 'AGT-KIN-0042', ville: 'Kinshasa', operations: 2, total_usd: 21500 }
          ]
        };
      }
      return {
        passed: false,
        message: 'Votre requête doit grouper par agent_id et utiliser la clause HAVING SUM(montant_usd) > 20000.'
      };
    }
  },

  // 16. DSP : Matrice de Règlement Net Multilatéral Interbancaire de Clôture
  {
    id: 'sql_chal_16',
    title: 'Compensation Interbancaire : Calcul des Soldes Nets Multilatéraux pour Clôture Journalière ATS',
    department: 'Direction des Systèmes de Paiement (DSP)',
    difficulty: 'difficile',
    description: 'Calculer la position nette finale (Total virements reçus - Total virements émis) de chaque banque commerciale participante pour injection finale au Grand Livre de la BCC.',
    businessContext: 'À 15h30, le switch de compensation interbancaire de la BCC arrête les échanges et calcule le solde net multilatéral de chaque banque : les débiteurs sont débités et les créanciers sont crédités simultanément.',
    schemaTables: [
      {
        name: 'compensation_flux_bilateraux',
        columns: [
          { name: 'banque_emettrice', type: 'VARCHAR(10)', comment: 'Banque qui paie' },
          { name: 'banque_destinataire', type: 'VARCHAR(10)', comment: 'Banque qui reçoit' },
          { name: 'montant_cdf', type: 'NUMERIC(15,2)', comment: 'Montant en CDF' }
        ],
        sampleData: [
          { banque_emettrice: 'RAWBANK', banque_destinataire: 'EQUITY_BCDC', montant_cdf: 45000000000 },
          { banque_emettrice: 'EQUITY_BCDC', banque_destinataire: 'TMB', montant_cdf: 20000000000 },
          { banque_emettrice: 'TMB', banque_destinataire: 'RAWBANK', montant_cdf: 30000000000 },
          { banque_emettrice: 'EQUITY_BCDC', banque_destinataire: 'RAWBANK', montant_cdf: 10000000000 }
        ]
      }
    ],
    expectedTask: 'Avec une CTE (WITH) ou UNION ALL, calculez pour chaque banque total_recu_cdf, total_emis_cdf et solde_net_cdf = (total_recu - total_emis).',
    initialCode: `-- Calcul des positions nettes pour le Grand Livre BCC
WITH flux_banques AS (
    SELECT banque_destinataire AS bank_code, montant_cdf AS credit, 0 AS debit FROM compensation_flux_bilateraux
    UNION ALL
    SELECT banque_emettrice AS bank_code, 0 AS credit, montant_cdf AS debit FROM compensation_flux_bilateraux
)
SELECT 
    bank_code,
    SUM(credit) AS total_recu_cdf,
    SUM(debit) AS total_emis_cdf,
    (SUM(credit) - SUM(debit)) AS position_nette_cdf,
    CASE 
        WHEN (SUM(credit) - SUM(debit)) > 0 THEN 'CREANCIER NET (A CREDITER)'
        ELSE 'DEBITEUR NET (A DEBITER)'
    END AS action_comptable_bcc
FROM flux_banques
GROUP BY bank_code
ORDER BY position_nette_cdf DESC;
`,
    solutionQuery: `WITH flux_banques AS (
    SELECT banque_destinataire AS bank_code, montant_cdf AS credit, 0 AS debit FROM compensation_flux_bilateraux
    UNION ALL
    SELECT banque_emettrice AS bank_code, 0 AS credit, montant_cdf AS debit FROM compensation_flux_bilateraux
)
SELECT 
    bank_code,
    SUM(credit) AS total_recu_cdf,
    SUM(debit) AS total_emis_cdf,
    (SUM(credit) - SUM(debit)) AS position_nette_cdf,
    CASE 
        WHEN (SUM(credit) - SUM(debit)) > 0 THEN 'CREANCIER NET (A CREDITER)'
        ELSE 'DEBITEUR NET (A DEBITER)'
    END AS action_comptable_bcc
FROM flux_banques
GROUP BY bank_code
ORDER BY position_nette_cdf DESC;`,
    explanation: 'La structure UNION ALL permet de convertir les colonnes émetteur et récepteur en un seul flux consolidé Débit/Crédit, garantissant que la somme des positions nettes de toutes les banques soit strictement égale à zéro.',
    hint: 'Utilisez UNION ALL pour réunir les flux entrants (crédits) et sortants (débits).',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasUnion = q.includes('union all');
      const hasNet = q.includes('sum(credit) - sum(debit)') || q.includes('sum( credit ) - sum( debit )');
      if (hasUnion && hasNet) {
        return {
          passed: true,
          message: 'Compensation multilatérale calculée à la perfection ! EQUITY_BCDC est créancière nette de +15 milliards CDF, TMB est débitrice de -10 milliards CDF, et RAWBANK est débitrice de -5 milliards CDF. Conservation exacte des soldes.',
          rows: [
            { bank_code: 'EQUITY_BCDC', recu: 45000000000, emis: 30000000000, solde_net: 15000000000 },
            { bank_code: 'RAWBANK', recu: 40000000000, emis: 45000000000, solde_net: -5000000000 },
            { bank_code: 'TMB', recu: 20000000000, emis: 30000000000, solde_net: -10000000000 }
          ]
        };
      }
      return {
        passed: false,
        message: 'Utilisez la CTE avec UNION ALL pour agréger les crédits et débits de chaque banque.'
      };
    }
  },

  // 17. DSP & DSI : Détection de Doublons Frauduleux ISO 20022
  {
    id: 'sql_chal_17',
    title: 'Sécurité des Systèmes de Paiement : Détection de Messages ISO 20022 en Double (Replay Attack)',
    department: 'Direction des Systèmes de Paiement & Sécurité SI',
    difficulty: 'difficile',
    description: 'Détecter les transactions financières ayant exactement le même compte émetteur, même compte bénéficiaire et même montant, exécutées à moins de 60 secondes d\'intervalle (risque de double débit ou attaque par rejeu).',
    businessContext: 'Dans les switchs bancaires modernes sous standard ISO 20022 (pacs.008), les pannes réseau peuvent amener une banque à réémettre un ordre sans vérifier si le premier avait été compensé, causant des litiges interbancaires.',
    schemaTables: [
      {
        name: 'iso20022_pacs008_messages',
        columns: [
          { name: 'msg_id', type: 'VARCHAR(30)', comment: 'Identifiant message' },
          { name: 'sender_iban', type: 'VARCHAR(30)', comment: 'Compte débité' },
          { name: 'receiver_iban', type: 'VARCHAR(30)', comment: 'Compte crédité' },
          { name: 'amount_usd', type: 'NUMERIC(12,2)', comment: 'Montant transféré' },
          { name: 'msg_timestamp', type: 'TIMESTAMP', comment: 'Horodatage précis' }
        ],
        sampleData: [
          { msg_id: 'MSG-001', sender_iban: 'CD05RAW1009', receiver_iban: 'CD14EQB8820', amount_usd: 25000, msg_timestamp: '2026-10-29 10:14:02' },
          { msg_id: 'MSG-002', sender_iban: 'CD05RAW1009', receiver_iban: 'CD14EQB8820', amount_usd: 25000, msg_timestamp: '2026-10-29 10:14:24' },
          { msg_id: 'MSG-003', sender_iban: 'CD22TMB3301', receiver_iban: 'CD30FBN4410', amount_usd: 5000, msg_timestamp: '2026-10-29 11:30:00' }
        ]
      }
    ],
    expectedTask: 'Faites un SELF-JOIN sur sender_iban, receiver_iban, amount_usd, avec m1.msg_id != m2.msg_id et un écart temporel <= 60 secondes.',
    initialCode: `-- Détection des doublons d'ordres de paiement ISO 20022
SELECT 
    m1.msg_id AS msg_id_original,
    m2.msg_id AS msg_id_suspect,
    m1.sender_iban,
    m1.receiver_iban,
    m1.amount_usd,
    m1.msg_timestamp AS heure_1,
    m2.msg_timestamp AS heure_2
FROM iso20022_pacs008_messages m1
INNER JOIN iso20022_pacs008_messages m2 
    ON m1.sender_iban = m2.sender_iban 
    AND m1.receiver_iban = m2.receiver_iban 
    AND m1.amount_usd = m2.amount_usd
-- Complétez la condition d'écart temporel et de séparation des identifiants...
`,
    solutionQuery: `SELECT 
    m1.msg_id AS msg_id_original,
    m2.msg_id AS msg_id_suspect,
    m1.sender_iban,
    m1.receiver_iban,
    m1.amount_usd,
    m1.msg_timestamp AS heure_1,
    m2.msg_timestamp AS heure_2
FROM iso20022_pacs008_messages m1
INNER JOIN iso20022_pacs008_messages m2 
    ON m1.sender_iban = m2.sender_iban 
    AND m1.receiver_iban = m2.receiver_iban 
    AND m1.amount_usd = m2.amount_usd
    AND m1.msg_id < m2.msg_id
    AND m2.msg_timestamp - m1.msg_timestamp <= INTERVAL '60 SECONDS';`,
    explanation: 'Le self-join avec la condition m1.msg_id < m2.msg_id élimine la comparaison d\'un message avec lui-même et évite les doublons inversés (A=B et B=A).',
    hint: 'Utilisez m1.msg_id < m2.msg_id et une condition d\'intervalle <= 60 secondes.',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasSelfJoin = q.includes('iso20022_pacs008_messages m1') && q.includes('iso20022_pacs008_messages m2');
      const hasIdCheck = q.includes('m1.msg_id < m2.msg_id') || q.includes('m1.msg_id != m2.msg_id');
      const hasInterval = q.includes('60') || q.includes('interval');
      if (hasSelfJoin && hasIdCheck && hasInterval) {
        return {
          passed: true,
          message: 'Anomalie de rejeu détectée ! MSG-001 et MSG-002 (25 000 USD entre Rawbank et EquityBCDC) ont été envoyés à 22 secondes d\'intervalle. Blocage conservatoire du second virement effectué.',
          rows: [
            { original: 'MSG-001', doublon: 'MSG-002', montant: 25000, intervalle: '22 secondes' }
          ]
        };
      }
      return {
        passed: false,
        message: 'Votre requête doit réaliser un self-join entre m1 et m2 sur les mêmes comptes et montants, avec m1.msg_id < m2.msg_id et écart <= 60 secondes.'
      };
    }
  },

  // 18. DRS : Indice des Prix (IPC) et Glissement Annuel de l'Inflation
  {
    id: 'sql_chal_18',
    title: 'Économétrie Appliquée : Calcul du Glissement Annuel de l\'Inflation Hebdomadaire à Kinshasa',
    department: 'Direction de la Recherche et des Statistiques (DRS)',
    difficulty: 'difficile',
    description: 'Calculer pour chaque semaine le taux d\'inflation en glissement annuel : ((IPC_semaine - IPC_semaine_an_passe) / IPC_semaine_an_passe) * 100 via LAG() sur 52 périodes.',
    businessContext: 'Le Comité de Politique Monétaire (CPM) de la BCC fixe son taux directeur principalement sur la base du glissement annuel de l\'IPC publié par l\'Institut National de la Statistique (INS) et la DRS.',
    schemaTables: [
      {
        name: 'ipc_hebdomadaire_kinshasa',
        columns: [
          { name: 'semaine_id', type: 'INT', comment: 'Index chronologique continu' },
          { name: 'annee', type: 'INT', comment: '2025, 2026' },
          { name: 'numero_semaine', type: 'INT', comment: '1 à 52' },
          { name: 'valeur_ipc', type: 'NUMERIC(8,3)', comment: 'Indice des prix à la consommation' }
        ],
        sampleData: [
          { semaine_id: 1, annee: 2025, numero_semaine: 43, valeur_ipc: 142.100 },
          { semaine_id: 53, annee: 2026, numero_semaine: 43, valeur_ipc: 168.390 }
        ]
      }
    ],
    expectedTask: 'Utilisez LAG(valeur_ipc, 52) OVER (ORDER BY semaine_id) pour accéder à l\'IPC de la même semaine de l\'année précédente et calculez le glissement annuel.',
    initialCode: `-- Calcul de l'inflation annuelle par la DRS / BCC
SELECT 
    annee,
    numero_semaine,
    valeur_ipc,
    LAG(valeur_ipc, 52) OVER (ORDER BY semaine_id) AS ipc_annee_precedente,
    -- Calculez le taux d'inflation annuel en %...
FROM ipc_hebdomadaire_kinshasa
ORDER BY semaine_id;
`,
    solutionQuery: `SELECT 
    annee,
    numero_semaine,
    valeur_ipc,
    LAG(valeur_ipc, 52) OVER (ORDER BY semaine_id) AS ipc_annee_precedente,
    ROUND(
        ((valeur_ipc - LAG(valeur_ipc, 52) OVER (ORDER BY semaine_id)) 
        / LAG(valeur_ipc, 52) OVER (ORDER BY semaine_id)) * 100, 2
    ) AS inflation_glissement_annuel_pct
FROM ipc_hebdomadaire_kinshasa
ORDER BY semaine_id;`,
    explanation: 'Sur des séries temporelles hebdomadaires, le décalage sur 52 semaines permet de neutraliser les effets saisonniers (fêtes de fin d\'année, rentrée scolaire) et d\'isoler la dérive monétaire structurelle.',
    hint: 'Utilisez LAG(valeur_ipc, 52) OVER (ORDER BY semaine_id).',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasLag = q.includes('lag(valeur_ipc, 52)') || q.includes('lag( valeur_ipc, 52 )') || q.includes('lag(valeur_ipc,52)');
      const hasOver = q.includes('over') && q.includes('semaine_id');
      if (hasLag && hasOver) {
        return {
          passed: true,
          message: 'Modélisation économétrique confirmée ! Pour la semaine 43 de 2026, l\'inflation en glissement annuel atteint 18.50% (IPC passé de 142.10 à 168.39), justifiant le maintien du taux directeur à 25%.',
          rows: [
            { annee: 2026, semaine: 43, ipc: 168.39, ipc_an_passe: 142.10, inflation_annuelle_pct: 18.50 }
          ]
        };
      }
      return {
        passed: false,
        message: 'Utilisez LAG(valeur_ipc, 52) OVER (ORDER BY semaine_id) pour décaler d\'une année complète (52 semaines).'
      };
    }
  },

  // 19. DRS & CPM : Semaines d'Importation Couvertes par les Réserves de Change
  {
    id: 'sql_chal_19',
    title: 'Surveillance Extérieure : Calcul des Semaines d\'Importation Couvertes par les Réserves de Change',
    department: 'Direction de la Recherche et des Statistiques (DRS)',
    difficulty: 'difficile',
    description: 'Calculer le niveau des réserves de change internationales de la République en semaines d\'importation de biens et services : (Réserves brutes en USD / (Importations annuelles prévisionnelles / 52)).',
    businessContext: 'Le critère de convergence macroéconomique du FMI et de la SADC impose à la RDC un minimum de 12 semaines d\'importation pour assurer la sécurité alimentaire et énergétique du pays.',
    schemaTables: [
      {
        name: 'reserves_internationales_rdc',
        columns: [
          { name: 'date_situation', type: 'DATE', comment: 'Date de situation comptable' },
          { name: 'reserves_brutes_usd', type: 'NUMERIC(15,2)', comment: 'Avoirs extérieurs en devises + or' },
          { name: 'importations_annuelles_usd', type: 'NUMERIC(15,2)', comment: 'Facture annuelle prévisionnelle' }
        ],
        sampleData: [
          { date_situation: '2026-10-15', reserves_brutes_usd: 5800000000, importations_annuelles_usd: 21500000000 },
          { date_situation: '2026-10-22', reserves_brutes_usd: 5950000000, importations_annuelles_usd: 21500000000 }
        ]
      }
    ],
    expectedTask: 'Calculez cout_hebdo_importation_usd = (importations_annuelles_usd / 52.0) et semaines_couverture = ROUND(reserves_brutes_usd / (importations_annuelles_usd / 52.0), 2).',
    initialCode: `-- Calcul du coussin de réserves de change (Indicateur CPM)
SELECT 
    date_situation,
    reserves_brutes_usd,
    importations_annuelles_usd,
    -- Calculez les semaines de couverture...
FROM reserves_internationales_rdc
ORDER BY date_situation DESC;
`,
    solutionQuery: `SELECT 
    date_situation,
    reserves_brutes_usd,
    importations_annuelles_usd,
    ROUND(reserves_brutes_usd / (importations_annuelles_usd / 52.0), 2) AS semaines_couverture_importation,
    CASE 
        WHEN (reserves_brutes_usd / (importations_annuelles_usd / 52.0)) >= 12.0 THEN 'CONFORME (Seuil FMI >= 12 sem.)'
        ELSE 'VULNERABILITE CRITIQUE'
    END AS evaluation_prudentielle
FROM reserves_internationales_rdc
ORDER BY date_situation DESC;`,
    explanation: 'Diviser la facture annuelle d\'importation par 52 donne le coût moyen hebdomadaire en devises pour nourrir et équiper le pays. La comparaison avec les réserves brutes indique l\'autonomie en devises de la BCC.',
    hint: 'La formule est : reserves_brutes_usd / (importations_annuelles_usd / 52.0).',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasFormula = q.includes('52') && (q.includes('reserves_brutes_usd') && q.includes('importations_annuelles_usd'));
      if (hasFormula) {
        return {
          passed: true,
          message: 'Indicateur macroéconomique calculé avec rigueur ! Les réserves au 22 octobre atteignent 5,95 milliards USD, soit 14.39 semaines d\'importation, dépassant confortablement le seuil de sécurité du FMI (12 semaines).',
          rows: [
            { date: '2026-10-22', reserves: 5950000000, semaines: 14.39, statut: 'CONFORME' },
            { date: '2026-10-15', reserves: 5800000000, semaines: 14.03, statut: 'CONFORME' }
          ]
        };
      }
      return {
        passed: false,
        message: 'Divisez les importations annuelles par 52 pour obtenir le rythme hebdomadaire, puis divisez les réserves brutes par ce montant.'
      };
    }
  },

  // 20. Marchés : Adjudication des Bons BCC (Prix Marginal)
  {
    id: 'sql_chal_20',
    title: 'Opérations d\'Open Market : Adjudication des Bons BCC au Taux Marginal (Enchères Hollandaises)',
    department: 'Direction des Marchés & Direction de la Trésorerie',
    difficulty: 'difficile',
    description: 'Classer les soumissions bancaires à l\'adjudication des Bons BCC à 7 jours par ordre croissant de taux proposé, cumuler les montants demandés et déterminer le taux marginal d\'attribution.',
    businessContext: 'Pour éponger la surliquidité bancaire et stabiliser le Franc Congolais, la BCC émet chaque semaine des Bons BCC pour un volume cible. Les banques proposant les taux les plus bas sont servies en priorité.',
    schemaTables: [
      {
        name: 'soumissions_bons_bcc',
        columns: [
          { name: 'soumission_id', type: 'INT', comment: 'N° ordre' },
          { name: 'bank_code', type: 'VARCHAR(10)', comment: 'Banque soumissionnaire' },
          { name: 'taux_propose_pct', type: 'NUMERIC(5,2)', comment: 'Taux demandé par la banque' },
          { name: 'montant_demande_cdf', type: 'NUMERIC(15,2)', comment: 'Montant en CDF' }
        ],
        sampleData: [
          { soumission_id: 1, bank_code: 'RAWBANK', taux_propose_pct: 22.50, montant_demande_cdf: 20000000000 },
          { soumission_id: 2, bank_code: 'EQUITY_BCDC', taux_propose_pct: 23.00, montant_demande_cdf: 25000000000 },
          { soumission_id: 3, bank_code: 'TMB', taux_propose_pct: 24.20, montant_demande_cdf: 15000000000 },
          { soumission_id: 4, bank_code: 'SOFIBANQUE', taux_propose_pct: 25.50, montant_demande_cdf: 20000000000 }
        ]
      }
    ],
    expectedTask: 'Calculez montant_cumule_cdf avec SUM(montant_demande_cdf) OVER (ORDER BY taux_propose_pct ASC), et déterminez les banques servies pour un volume adjugé de 50 milliards CDF.',
    initialCode: `-- Classement des soumissions d'Open Market
SELECT 
    soumission_id,
    bank_code,
    taux_propose_pct,
    montant_demande_cdf,
    SUM(montant_demande_cdf) OVER (ORDER BY taux_propose_pct ASC) AS cumul_attribue_cdf,
    CASE 
        WHEN SUM(montant_demande_cdf) OVER (ORDER BY taux_propose_pct ASC) <= 50000000000 THEN 'ENTIEREMENT SERVI'
        WHEN SUM(montant_demande_cdf) OVER (ORDER BY taux_propose_pct ASC) - montant_demande_cdf < 50000000000 THEN 'PARTIELLEMENT SERVI'
        ELSE 'REJETE (HORS ENVELOPPE)'
    END AS statut_adjudication
FROM soumissions_bons_bcc
ORDER BY taux_propose_pct ASC;
`,
    solutionQuery: `SELECT 
    soumission_id,
    bank_code,
    taux_propose_pct,
    montant_demande_cdf,
    SUM(montant_demande_cdf) OVER (ORDER BY taux_propose_pct ASC) AS cumul_attribue_cdf,
    CASE 
        WHEN SUM(montant_demande_cdf) OVER (ORDER BY taux_propose_pct ASC) <= 50000000000 THEN 'ENTIEREMENT SERVI'
        WHEN SUM(montant_demande_cdf) OVER (ORDER BY taux_propose_pct ASC) - montant_demande_cdf < 50000000000 THEN 'PARTIELLEMENT SERVI'
        ELSE 'REJETE (HORS ENVELOPPE)'
    END AS statut_adjudication
FROM soumissions_bons_bcc
ORDER BY taux_propose_pct ASC;`,
    explanation: 'Le fenêtrage cumulatif permet d\'attribuer automatiquement les tranches de liquidité jusqu\'au plafond fixé par la BCC (50 milliards CDF), révélant le taux marginal de coupure (24.20%).',
    hint: 'Utilisez SUM(montant_demande_cdf) OVER (ORDER BY taux_propose_pct ASC).',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasOver = q.includes('over') && q.includes('order by taux_propose_pct');
      const hasSum = q.includes('sum(montant_demande_cdf)');
      if (hasOver && hasSum) {
        return {
          passed: true,
          message: 'Adjudication monétaire simulée avec exactitude ! RAWBANK (20 Mrds à 22.50%) et EQUITY_BCDC (25 Mrds à 23.00%) sont intégralement servies (45 Mrds cumulés). TMB est partiellement servie à concurrence de 5 Mrds au taux marginal de 24.20%.',
          rows: [
            { banque: 'RAWBANK', taux: 22.50, montant: 20000000000, cumul: 20000000000, statut: 'ENTIEREMENT SERVI' },
            { banque: 'EQUITY_BCDC', taux: 23.00, montant: 25000000000, cumul: 45000000000, statut: 'ENTIEREMENT SERVI' },
            { banque: 'TMB', taux: 24.20, montant: 15000000000, cumul: 60000000000, statut: 'PARTIELLEMENT SERVI' }
          ]
        };
      }
      return {
        passed: false,
        message: 'Utilisez la fonction de fenêtrage SUM(montant_demande_cdf) OVER (ORDER BY taux_propose_pct ASC) pour cumuler les offres par ordre croissant de taux.'
      };
    }
  },

  // 21. Marchés : Surveillance Spéculation Change (Spread Indicatif vs Marché)
  {
    id: 'sql_chal_21',
    title: 'Surveillance des Bureaux de Change : Détection de Pratiques Spéculatives et Écarts Abusifs',
    department: 'Direction des Marchés & Direction de la Surveillance des Intermédiaires Financiers',
    difficulty: 'difficile',
    description: 'Identifier les banques et bureaux de change agréés vendant des dollars à un taux supérieur de plus de 2,5% au cours indicatif officiel publié par la BCC le même jour (infraction d\'écartement spéculatif).',
    businessContext: 'La réglementation de la BCC interdit aux intervenants agréés de s\'écarter de la bande de fluctuation autour du taux indicatif sous peine de retrait d\'agrément et de gel des avoirs.',
    schemaTables: [
      {
        name: 'cours_bureaux_change',
        columns: [
          { name: 'entite_id', type: 'VARCHAR(25)', comment: 'Banque ou bureau de change' },
          { name: 'date_seance', type: 'DATE', comment: 'Date de transaction' },
          { name: 'taux_vente_applique_cdf', type: 'NUMERIC(8,2)', comment: 'Taux facturé au client' }
        ],
        sampleData: [
          { entite_id: 'BUREAU_GOMBE_EXCHANGE', date_seance: '2026-10-28', taux_vente_applique_cdf: 2980.00 },
          { entite_id: 'BUREAU_LIMETE_CHANGE', date_seance: '2026-10-28', taux_vente_applique_cdf: 2890.00 },
          { entite_id: 'BANQUE_COMMERCIALE_Z', date_seance: '2026-10-28', taux_vente_applique_cdf: 2960.00 }
        ]
      },
      {
        name: 'cours_officiel_bcc',
        columns: [
          { name: 'date_seance', type: 'DATE', comment: 'Date' },
          { name: 'taux_indicatif_officiel_cdf', type: 'NUMERIC(8,2)', comment: 'Cours officiel du jour' }
        ],
        sampleData: [
          { date_seance: '2026-10-28', taux_indicatif_officiel_cdf: 2870.00 }
        ]
      }
    ],
    expectedTask: 'Joignez sur date_seance, calculez ecart_pct = ((taux_vente_applique_cdf - taux_indicatif_officiel_cdf) / taux_indicatif_officiel_cdf) * 100, et filtrez les infractions avec ecart_pct > 2.50%.',
    initialCode: `-- Détection des dérives spéculatives sur le Franc Congolais
SELECT 
    b.entite_id,
    b.date_seance,
    b.taux_vente_applique_cdf,
    o.taux_indicatif_officiel_cdf,
    -- Calculez l'écart en pourcentage...
FROM cours_bureaux_change b
INNER JOIN cours_officiel_bcc o ON b.date_seance = o.date_seance
-- Filtrez sur l'infraction > 2.50%...
`,
    solutionQuery: `SELECT 
    b.entite_id,
    b.date_seance,
    b.taux_vente_applique_cdf,
    o.taux_indicatif_officiel_cdf,
    ROUND(((b.taux_vente_applique_cdf - o.taux_indicatif_officiel_cdf) / o.taux_indicatif_officiel_cdf) * 100, 2) AS ecart_speculatif_pct
FROM cours_bureaux_change b
INNER JOIN cours_officiel_bcc o ON b.date_seance = o.date_seance
WHERE ((b.taux_vente_applique_cdf - o.taux_indicatif_officiel_cdf) / o.taux_indicatif_officiel_cdf) > 0.025
ORDER BY ecart_speculatif_pct DESC;`,
    explanation: 'Un écart supérieur à 2,5% (0.025) alimente la prime de risque sur le marché noir et accélère l\'inflation importée à Kinshasa.',
    hint: 'Joignez sur date_seance et filtrez WHERE ecart > 0.025.',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasJoin = q.includes('join') && q.includes('cours_officiel_bcc');
      const hasSpread = q.includes('taux_vente_applique_cdf - o.taux_indicatif_officiel_cdf') || q.includes('taux_vente_applique_cdf - taux_indicatif_officiel_cdf');
      const hasFilter = q.includes('> 0.025') || q.includes('> 2.5') || q.includes('>0.025') || q.includes('>2.5');
      if (hasJoin && hasSpread && hasFilter) {
        return {
          passed: true,
          message: 'Infractions de change constatées ! BUREAU_GOMBE_EXCHANGE applique 2980 CDF (+3.83%) et BANQUE_COMMERCIALE_Z applique 2960 CDF (+3.14%), violant l\'encadrement des spreads. Sanctions transmises à la Direction des Marchés.',
          rows: [
            { entite: 'BUREAU_GOMBE_EXCHANGE', applique: 2980.00, officiel: 2870.00, ecart_pct: 3.83 },
            { entite: 'BANQUE_COMMERCIALE_Z', applique: 2960.00, officiel: 2870.00, ecart_pct: 3.14 }
          ]
        };
      }
      return {
        passed: false,
        message: 'Joignez les tables de cours et filtrez les écarts supérieurs à 2.5% (> 0.025) par rapport au cours indicatif officiel.'
      };
    }
  },

  // 22. DRS : Dollarisation Financière par Province
  {
    id: 'sql_chal_22',
    title: 'Surveillance Monétaire : Mesure du Degré de Dollarisation des Dépôts Bancaires par Province',
    department: 'Direction de la Recherche et des Statistiques (DRS)',
    difficulty: 'difficile',
    description: 'Calculer pour chaque province de la RDC le montant des dépôts en USD convertis en équivalent CDF, le montant des dépôts en CDF, et le ratio de dollarisation : (Dépôts USD_eq / (Dépôts USD_eq + Dépôts CDF)) * 100.',
    businessContext: 'La dollarisation varie fortement entre Kinshasa, le Katanga minier et le Grand Kivu. La BCC suit cette cartographie pour orienter sa stratégie de dédollarisation progressive.',
    schemaTables: [
      {
        name: 'depots_bancaires_provinces',
        columns: [
          { name: 'province', type: 'VARCHAR(30)', comment: 'Kinshasa, Haut-Katanga, Nord-Kivu, Kongo-Central' },
          { name: 'depots_usd', type: 'NUMERIC(15,2)', comment: 'Dépôts libellés en dollars' },
          { name: 'depots_cdf', type: 'NUMERIC(15,2)', comment: 'Dépôts libellés en Francs Congolais' },
          { name: 'cours_conversion_cdf_usd', type: 'NUMERIC(8,2)', comment: 'Taux officiel de conversion' }
        ],
        sampleData: [
          { province: 'Haut-Katanga', depots_usd: 1200000000, depots_cdf: 285000000000, cours_conversion_cdf_usd: 2850.00 },
          { province: 'Kinshasa', depots_usd: 2500000000, depots_cdf: 1425000000000, cours_conversion_cdf_usd: 2850.00 },
          { province: 'Kongo-Central', depots_usd: 150000000, depots_cdf: 285000000000, cours_conversion_cdf_usd: 2850.00 }
        ]
      }
    ],
    expectedTask: 'Calculez total_usd_en_cdf = depots_usd * cours_conversion_cdf_usd, puis taux_dollarisation_pct = (total_usd_en_cdf / (total_usd_en_cdf + depots_cdf)) * 100.',
    initialCode: `-- Cartographie de la dollarisation en RDC
SELECT 
    province,
    (depots_usd * cours_conversion_cdf_usd) AS depots_usd_en_cdf,
    depots_cdf,
    -- Calculez le ratio de dollarisation en %...
FROM depots_bancaires_provinces
ORDER BY province;
`,
    solutionQuery: `SELECT 
    province,
    (depots_usd * cours_conversion_cdf_usd) AS depots_usd_en_cdf,
    depots_cdf,
    ROUND(
        ((depots_usd * cours_conversion_cdf_usd) / ((depots_usd * cours_conversion_cdf_usd) + depots_cdf)) * 100, 2
    ) AS taux_dollarisation_pct
FROM depots_bancaires_provinces
ORDER BY taux_dollarisation_pct DESC;`,
    explanation: 'Pour agréger des actifs bimonétaires, il faut d\'abord convertir les devises en monnaie nationale au cours officiel, puis calculer le poids relatif des devises dans la masse monétaire locale.',
    hint: 'Multipliez depots_usd par cours_conversion_cdf_usd avant de diviser par la somme des deux composantes.',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasConversion = q.includes('depots_usd * cours_conversion_cdf_usd');
      const hasRatio = q.includes('taux_dollarisation_pct') || q.includes('round(');
      if (hasConversion && hasRatio) {
        return {
          passed: true,
          message: 'Cartographie monétaire validée ! Le Haut-Katanga affiche la plus forte dollarisation du pays avec 92.31%, suivi de Kinshasa à 83.33%, tandis que le Kongo-Central reste plus monétisé en CDF (60.00%).',
          rows: [
            { province: 'Haut-Katanga', taux_dollarisation_pct: 92.31 },
            { province: 'Kinshasa', taux_dollarisation_pct: 83.33 },
            { province: 'Kongo-Central', taux_dollarisation_pct: 60.00 }
          ]
        };
      }
      return {
        passed: false,
        message: 'Convertissez d\'abord les dépôts USD en équivalent CDF (depots_usd * cours) avant de calculer le ratio par rapport au total.'
      };
    }
  },

  // 23. DSI : Audit Sécurité SI - Connexions Privilégiées DBA Hors Heures
  {
    id: 'sql_chal_23',
    title: 'Audit de Sécurité Informatique DSI : Détection des Requêtes DBA / Administrateur Hors Heures Ouvrables',
    department: 'Direction des Systèmes d\'Information (DSI BCC)',
    difficulty: 'difficile',
    description: 'Identifier les sessions administrateur (comptes "sa", "postgres", "bcc_dba") ayant exécuté des commandes de mise à jour ou suppression (UPDATE, DELETE, DROP) la nuit (entre 20h00 et 06h00) ou le dimanche, sans ticket de maintenance approuvé.',
    businessContext: 'La DSI de la BCC impose une traçabilité totale sur les bases de données du Core Banking et de la passerelle RTGS. Toute modification directe en base hors fenêtre de maintenance programmée déclenche une enquête de la sécurité interne.',
    schemaTables: [
      {
        name: 'database_audit_logs',
        columns: [
          { name: 'session_id', type: 'BIGINT', comment: 'N° session' },
          { name: 'db_user', type: 'VARCHAR(25)', comment: 'Nom compte utilisateur DB' },
          { name: 'client_ip', type: 'VARCHAR(20)', comment: 'Adresse IP source' },
          { name: 'action_type', type: 'VARCHAR(15)', comment: 'SELECT, UPDATE, DELETE, DROP' },
          { name: 'log_time', type: 'TIMESTAMP', comment: 'Horodatage' },
          { name: 'ticket_itsm_ref', type: 'VARCHAR(20)', comment: 'Référence ticket (NULL si non documenté)' }
        ],
        sampleData: [
          { session_id: 881, db_user: 'postgres', client_ip: '10.10.4.15', action_type: 'UPDATE', log_time: '2026-10-25 02:14:00', ticket_itsm_ref: null },
          { session_id: 882, db_user: 'bcc_analyst', client_ip: '10.10.4.22', action_type: 'SELECT', log_time: '2026-10-25 09:30:00', ticket_itsm_ref: null },
          { session_id: 883, db_user: 'sa', client_ip: '192.168.1.99', action_type: 'DELETE', log_time: '2026-10-25 23:45:00', ticket_itsm_ref: null },
          { session_id: 884, db_user: 'bcc_dba', client_ip: '10.10.4.10', action_type: 'UPDATE', log_time: '2026-10-26 14:00:00', ticket_itsm_ref: 'CHG-9901' }
        ]
      }
    ],
    expectedTask: 'Filtrez les utilisateurs privilégiés (db_user IN (\'sa\', \'postgres\', \'bcc_dba\')), les actions à risque (action_type IN (\'UPDATE\', \'DELETE\', \'DROP\')), les tickets non renseignés (ticket_itsm_ref IS NULL), et les horaires suspects (heure < 6 OU heure >= 20 OU jour = dimanche).',
    initialCode: `-- Audit de sécurité des bases de données critiques BCC
SELECT 
    session_id,
    db_user,
    client_ip,
    action_type,
    log_time
FROM database_audit_logs
WHERE db_user IN ('sa', 'postgres', 'bcc_dba')
  AND action_type IN ('UPDATE', 'DELETE', 'DROP')
  AND ticket_itsm_ref IS NULL
  -- Complétez la condition horaire nocturne ou week-end...
;`,
    solutionQuery: `SELECT 
    session_id,
    db_user,
    client_ip,
    action_type,
    log_time
FROM database_audit_logs
WHERE db_user IN ('sa', 'postgres', 'bcc_dba')
  AND action_type IN ('UPDATE', 'DELETE', 'DROP')
  AND ticket_itsm_ref IS NULL
  AND (
      EXTRACT(HOUR FROM log_time) < 6 
      OR EXTRACT(HOUR FROM log_time) >= 20 
      OR EXTRACT(DOW FROM log_time) = 0
  )
ORDER BY log_time DESC;`,
    explanation: 'L\'extraction de l\'heure (EXTRACT(HOUR)) et du jour de la semaine (EXTRACT(DOW) où 0 = dimanche) permet de détecter les intrusions ou sabotages internes en dehors des heures d\'exploitation normale.',
    hint: 'Utilisez EXTRACT(HOUR FROM log_time) < 6 OR EXTRACT(HOUR FROM log_time) >= 20.',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasExtract = q.includes('extract(hour') || q.includes('extract (hour') || q.includes('to_char(log_time') || q.includes('time(');
      const hasRisk = q.includes('ticket_itsm_ref is null');
      if (hasExtract && hasRisk) {
        return {
          passed: true,
          message: 'Alerte sécurité SI confirmée ! Deux sessions non autorisées détectées : session 881 (UPDATE par postgres à 02h14) et session 883 (DELETE par sa depuis une IP externe à 23h45). Blocage des comptes et ouverture de procédure d\'audit immédiat.',
          rows: [
            { session_id: 881, user: 'postgres', action: 'UPDATE', heure: '02:14:00' },
            { session_id: 883, user: 'sa', action: 'DELETE', heure: '23:45:00' }
          ]
        };
      }
      return {
        passed: false,
        message: 'Votre requête doit filtrer sur les comptes privilégiés modifiant des données sans ticket ITSM et en dehors des heures ouvrées (EXTRACT(HOUR)).'
      };
    }
  },

  // 24. Trésorerie : Rapprochement Automatisé Nostro (Banques Correspondantes Étrangères)
  {
    id: 'sql_chal_24',
    title: 'Comptabilité des Réserves de Change : Rapprochement Automatisé des Écritures en Suspens Nostro (Banque de France / FED NY)',
    department: 'Direction de la Trésorerie & Direction de la Comptabilité',
    difficulty: 'difficile',
    description: 'Identifier les écritures débitées sur le relevé de compte de la Federal Reserve Bank of New York qui n\'ont AUCUNE contrepartie correspondante dans le Grand Livre de la BCC depuis plus de 48 heures.',
    businessContext: 'Les réserves de change de la BCC sont déposées auprès des banques centrales étrangères. Tout écart de rapprochement (débit étranger sans écriture interne BCC) représente une anomalie comptable grave ou une fraude sur les avoirs de la Nation.',
    schemaTables: [
      {
        name: 'releve_nostro_fed_ny',
        columns: [
          { name: 'fed_tx_ref', type: 'VARCHAR(30)', comment: 'Référence relevé FED' },
          { name: 'montant_usd', type: 'NUMERIC(15,2)', comment: 'Débit en devises' },
          { name: 'date_valeur_fed', type: 'DATE', comment: 'Date d\'exécution à New York' }
        ],
        sampleData: [
          { fed_tx_ref: 'FED-2026-901', montant_usd: 12500000, date_valeur_fed: '2026-10-24' },
          { fed_tx_ref: 'FED-2026-902', montant_usd: 5000000, date_valeur_fed: '2026-10-25' },
          { fed_tx_ref: 'FED-2026-903', montant_usd: 800000, date_valeur_fed: '2026-10-28' }
        ]
      },
      {
        name: 'grand_livre_bcc_nostro',
        columns: [
          { name: 'bcc_ecriture_ref', type: 'VARCHAR(30)', comment: 'Référence comptable interne' },
          { name: 'fed_tx_ref', type: 'VARCHAR(30)', comment: 'Référence rattachée' },
          { name: 'montant_usd', type: 'NUMERIC(15,2)', comment: 'Montant enregistré' }
        ],
        sampleData: [
          { bcc_ecriture_ref: 'GL-BCC-8821', fed_tx_ref: 'FED-2026-903', montant_usd: 800000 }
        ]
      }
    ],
    expectedTask: 'Faites un LEFT JOIN de releve_nostro_fed_ny vers grand_livre_bcc_nostro, filtrez WHERE g.fed_tx_ref IS NULL et date_valeur_fed <= \'2026-10-26\'.',
    initialCode: `-- Rapprochement des comptes miroirs de devises
SELECT 
    f.fed_tx_ref,
    f.montant_usd,
    f.date_valeur_fed
FROM releve_nostro_fed_ny f
-- Effectuez la jointure externe LEFT JOIN et filtrez les écritures orphelines...
`,
    solutionQuery: `SELECT 
    f.fed_tx_ref,
    f.montant_usd,
    f.date_valeur_fed
FROM releve_nostro_fed_ny f
LEFT JOIN grand_livre_bcc_nostro g ON f.fed_tx_ref = g.fed_tx_ref
WHERE g.fed_tx_ref IS NULL
  AND f.date_valeur_fed <= '2026-10-26'
ORDER BY f.date_valeur_fed ASC;`,
    explanation: 'Le LEFT JOIN avec condition WHERE g.fed_tx_ref IS NULL est l\'algorithme canonique d\'extraction d\'écritures en suspens (reconciliation breaks), indispensable pour certifier les comptes de la Banque Centrale.',
    hint: 'Utilisez LEFT JOIN et filtrez WHERE g.fed_tx_ref IS NULL.',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasLeft = q.includes('left join') && q.includes('grand_livre_bcc_nostro');
      const hasNull = q.includes('is null');
      if (hasLeft && hasNull) {
        return {
          passed: true,
          message: 'Rapprochement comptable Nostro complété ! Deux débits majeurs à New York sont orphelins : FED-2026-901 (12,5M$) et FED-2026-902 (5M$). Régularisation d\'urgence transmise au Département des Opérations Étrangères.',
          rows: [
            { ref: 'FED-2026-901', montant: 12500000, date: '2026-10-24' },
            { ref: 'FED-2026-902', montant: 5000000, date: '2026-10-25' }
          ]
        };
      }
      return {
        passed: false,
        message: 'Votre requête doit utiliser un LEFT JOIN et filtrer les lignes où la clé de la table de droite est IS NULL.'
      };
    }
  },

  // 25. Sécurité Monétique : Détection de Fraude Multi-GAB & Vélocité Géographique
  {
    id: 'sql_chal_25',
    title: 'Surveillance Monétique Nationale : Détection de Fraude par Clonage de Carte (Retraits Distants < 30 min)',
    department: 'Direction des Systèmes de Paiement & Sécurité Monétique',
    difficulty: 'difficile',
    description: 'Identifier les cartes bancaires ayant effectué deux retraits physiques à des distributeurs automatiques (GAB) situés dans deux villes différentes à moins de 30 minutes d\'intervalle (impossibilité physique de déplacement).',
    businessContext: 'Le piratage par skimming et clonage de cartes bancaires internationales à Kinshasa et Lubumbashi est surveillé en temps réel par la cellule anti-fraude monétique de la BCC.',
    schemaTables: [
      {
        name: 'retraits_monetiques_gab',
        columns: [
          { name: 'retrait_id', type: 'BIGINT', comment: 'N° ordre' },
          { name: 'pan_carte_hash', type: 'VARCHAR(32)', comment: 'Empreinte unique de la carte' },
          { name: 'gab_id', type: 'VARCHAR(20)', comment: 'Identifiant GAB' },
          { name: 'ville_gab', type: 'VARCHAR(30)', comment: 'Kinshasa, Lubumbashi, Kolwezi' },
          { name: 'retrait_time', type: 'TIMESTAMP', comment: 'Horodatage du retrait' },
          { name: 'montant_cdf', type: 'NUMERIC(10,2)', comment: 'Montant retiré' }
        ],
        sampleData: [
          { retrait_id: 1, pan_carte_hash: 'HASH-CARD-771', gab_id: 'GAB-KIN-01', ville_gab: 'Kinshasa', retrait_time: '2026-10-29 14:10:00', montant_cdf: 500000 },
          { retrait_id: 2, pan_carte_hash: 'HASH-CARD-771', gab_id: 'GAB-LUB-04', ville_gab: 'Lubumbashi', retrait_time: '2026-10-29 14:25:00', montant_cdf: 800000 },
          { retrait_id: 3, pan_carte_hash: 'HASH-CARD-990', gab_id: 'GAB-KIN-02', ville_gab: 'Kinshasa', retrait_time: '2026-10-29 15:00:00', montant_cdf: 200000 }
        ]
      }
    ],
    expectedTask: 'Faites un SELF-JOIN sur pan_carte_hash, avec r1.retrait_id < r2.retrait_id, r1.ville_gab != r2.ville_gab et (r2.retrait_time - r1.retrait_time) <= INTERVAL \'30 MINUTES\'.',
    initialCode: `-- Détection des retraits physiquement impossibles (Fraude carte clonée)
SELECT 
    r1.pan_carte_hash,
    r1.ville_gab AS ville_1,
    r2.ville_gab AS ville_2,
    r1.retrait_time AS heure_1,
    r2.retrait_time AS heure_2
FROM retraits_monetiques_gab r1
INNER JOIN retraits_monetiques_gab r2 
    ON r1.pan_carte_hash = r2.pan_carte_hash
-- Complétez la condition de ville différente et d'intervalle <= 30 minutes...
`,
    solutionQuery: `SELECT 
    r1.pan_carte_hash,
    r1.ville_gab AS ville_1,
    r2.ville_gab AS ville_2,
    r1.retrait_time AS heure_1,
    r2.retrait_time AS heure_2
FROM retraits_monetiques_gab r1
INNER JOIN retraits_monetiques_gab r2 
    ON r1.pan_carte_hash = r2.pan_carte_hash
    AND r1.retrait_id < r2.retrait_id
    AND r1.ville_gab != r2.ville_gab
    AND r2.retrait_time - r1.retrait_time <= INTERVAL '30 MINUTES';`,
    explanation: 'La distance entre Kinshasa et Lubumbashi est de plus de 1 500 km (2h30 d\'avion). Un retrait à 14h10 à Kinshasa suivi d\'un retrait à 14h25 à Lubumbashi avec la même carte constitue la preuve mathématique d\'un clonage frauduleux.',
    hint: 'Utilisez r1.ville_gab != r2.ville_gab et r2.retrait_time - r1.retrait_time <= INTERVAL \'30 MINUTES\'.',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasSelf = q.includes('retraits_monetiques_gab r1') && q.includes('retraits_monetiques_gab r2');
      const hasDiffCity = q.includes('!=') || q.includes('<>');
      const hasTime = q.includes('30') || q.includes('interval');
      if (hasSelf && hasDiffCity && hasTime) {
        return {
          passed: true,
          message: 'Fraude monétique interceptée avec succès ! La carte HASH-CARD-771 a été utilisée à Kinshasa à 14h10 puis à Lubumbashi à 14h25 (écart de 15 min). Blocage carte et alerte switch monétique national émis.',
          rows: [
            { carte: 'HASH-CARD-771', ville_1: 'Kinshasa', ville_2: 'Lubumbashi', intervalle: '15 minutes' }
          ]
        };
      }
      return {
        passed: false,
        message: 'Votre requête doit joindre la table sur elle-même pour la même carte, filtrer sur des villes distinctes et un écart temporel <= 30 minutes.'
      };
    }
  },

  // 26. DRS : Vélocité de la Monnaie Scripturale Interbancaire
  {
    id: 'sql_chal_26',
    title: 'Analyse Monétaire : Calcul de la Vélocité de Circulation de la Monnaie Scripturale Interbancaire',
    department: 'Direction de la Recherche et des Statistiques (DRS)',
    difficulty: 'difficile',
    description: 'Calculer la vitesse de circulation (vélocité) de la monnaie scripturale pour chaque banque commerciale : (Volume annuel total des débits compensés / Solde moyen annuel du compte de règlement à la BCC).',
    businessContext: 'Une accélération anormale de la vélocité monétaire dans un contexte de crise signale une fuite de capitaux ou une perte de confiance dans la monnaie nationale (effet "patate chaude").',
    schemaTables: [
      {
        name: 'velocite_monnaie_banques',
        columns: [
          { name: 'bank_code', type: 'VARCHAR(10)', comment: 'Code banque commerciale' },
          { name: 'annee', type: 'INT', comment: '2026' },
          { name: 'debit_total_compense_cdf', type: 'NUMERIC(18,2)', comment: 'Volume annuel des virements émis' },
          { name: 'solde_moyen_compte_bcc_cdf', type: 'NUMERIC(15,2)', comment: 'Encours moyen de monnaie centrale' }
        ],
        sampleData: [
          { bank_code: 'RAWBANK', annee: 2026, debit_total_compense_cdf: 150000000000000, solde_moyen_compte_bcc_cdf: 3000000000000 },
          { bank_code: 'EQUITY_BCDC', annee: 2026, debit_total_compense_cdf: 120000000000000, solde_moyen_compte_bcc_cdf: 2500000000000 },
          { bank_code: 'BANQUE_SPECULATIVE', annee: 2026, debit_total_compense_cdf: 85000000000000, solde_moyen_compte_bcc_cdf: 500000000000 }
        ]
      }
    ],
    expectedTask: 'Calculez velocite_rotation = ROUND(debit_total_compense_cdf / solde_moyen_compte_bcc_cdf, 2), et classez les banques par vitesse de rotation décroissante.',
    initialCode: `-- Modélisation de la vélocité de la monnaie scripturale
SELECT 
    bank_code,
    annee,
    debit_total_compense_cdf,
    solde_moyen_compte_bcc_cdf,
    -- Calculez le coefficient de rotation (vélocité)...
FROM velocite_monnaie_banques
ORDER BY debit_total_compense_cdf DESC;
`,
    solutionQuery: `SELECT 
    bank_code,
    annee,
    debit_total_compense_cdf,
    solde_moyen_compte_bcc_cdf,
    ROUND(debit_total_compense_cdf / solde_moyen_compte_bcc_cdf, 2) AS velocite_rotation_monnaie,
    CASE 
        WHEN (debit_total_compense_cdf / solde_moyen_compte_bcc_cdf) > 100 THEN 'ROTATION HYPER-RAPIDE (RISQUE SPECULATIF)'
        ELSE 'ROTATION SYSTEMIQUE NORMALE'
    END AS diagnostic_economique
FROM velocite_monnaie_banques
ORDER BY velocite_rotation_monnaie DESC;`,
    explanation: 'La formule $V = T / M$ (équation quantitative de Fisher appliquée aux réserves interbancaires) montre à quel rythme chaque Franc Congolais en compte de règlement change de main au cours de l\'année.',
    hint: 'Divisez debit_total_compense_cdf par solde_moyen_compte_bcc_cdf.',
    validator: (query: string) => {
      const q = query.toLowerCase();
      const hasDiv = q.includes('debit_total_compense_cdf / solde_moyen_compte_bcc_cdf') || q.includes('debit_total_compense_cdf/solde_moyen_compte_bcc_cdf');
      if (hasDiv) {
        return {
          passed: true,
          message: 'Analyse de vélocité monétaire validée ! BANQUE_SPECULATIVE présente une rotation anormale de 170.00 fois par an avec un matelas de sécurité minuscule (500 Mrds pour 85 000 Mrds traités), exposant l\'établissement à une rupture de paiement intrajournalière.',
          rows: [
            { bank_code: 'BANQUE_SPECULATIVE', velocite: 170.00, diagnostic: 'RISQUE SPECULATIF' },
            { bank_code: 'RAWBANK', velocite: 50.00, diagnostic: 'NORMALE' },
            { bank_code: 'EQUITY_BCDC', velocite: 48.00, diagnostic: 'NORMALE' }
          ]
        };
      }
      return {
        passed: false,
        message: 'Divisez le débit total compensé par le solde moyen en compte de règlement à la BCC.'
      };
    }
  }
];
