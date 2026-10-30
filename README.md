# BCC Data Master — Préparation Concours Informaticien Data Analyste

Plateforme d'entraînement intensif et simulateur d'épreuves pour le concours de recrutement au poste d'**Informaticien Data Analyste à la Banque Centrale du Congo (BCC)**.

Conçue spécifiquement pour les profils techniques (informatique, télécom, analyse de données) n'ayant pas encore d'expérience préalable dans le secteur bancaire traditionnel.

---

## 🚀 Fonctionnalités Clés

1. **Simulateur Concours Chronométré** :
   - Compte à rebours dynamique avec jauge d'urgence et tension sonore optionnelle (3 rythmes : 25m, 15m, 8m).
   - Mode « Corrigé direct » : analyse immédiate des mauvaises réponses avec explication pas à pas et résolution guidée.
   - Évaluation instantanée selon les standards d'admission BCC.

2. **Psychotechnique Débutant (Premier Emploi)** :
   - Dominos et arithmétique modulaire en base 7.
   - Syllogismes formels et logique d'inclusion.
   - Calcul mental de prorata sans calculatrice.
   - Suites logiques alternées et épreuves de vigilance alphanumérique.
   - Jugement situationnel et déontologie bancaire (secret professionnel, indépendance BCC).

3. **Laboratoire SQL Pratique (Données Réelles RDC)** :
   - 6 défis interactifs basés sur des cas bancaires réels.
   - Détection de *smurfing* AML (transactions fractionnées sous le seuil déclaratif de 10 000 $).
   - Calcul de solde glissant avec fonctions de fenêtrage (`SUM() OVER()`).
   - Audit des ratios prudentiels de liquidité (LCR < 100%).
   - Réconciliation du compte de cantonnement Mobile Money (Instruction administrative n°24 de la BCC).
   - Diagnostic immédiat des erreurs SQL et affichage de la requête de référence.

4. **Passerelle Télécom ➔ Banque Centrale** :
   - Table de conversion directe des concepts Télécom (CDR, Churn, SIM Box, Float) vers la Banque Centrale (RTGS, Bank Run, Smurfing, Cantonnements).
   - Guide d'entretien pour valoriser le traitement de flux haute fréquence.

5. **War Room & Gestion de Crise Systémique** :
   - Scénarios macroéconomiques : effondrement des cours du cuivre, crise de liquidité bancaire, doctrine du prêteur en dernier ressort (Bagehot).

6. **Sprint Éclair 30s** :
   - Session flash de rapidité cognitive avec multiplicateurs de score et ambiance arcade stimulante.

---

## 🛠️ Stack Technique

- **Framework** : React 19 + TypeScript + Vite
- **Styling** : Tailwind CSS v4
- **Composants & Animations** : Lucide React, Canvas Confetti
- **Audio** : Web Audio API native (bips d'urgence et feedback sonore sans assets externes)
- **Persistance** : `localStorage` navigateur (fonctionne à 100% hors-ligne)

---

## 💻 Démarrage en Localhost

### 1. Prérequis
- [Node.js](https://nodejs.org) (v20 ou supérieur recommandé)
- npm

### 2. Installation
```bash
git clone https://github.com/kams77/TEST_BCC_2026_DATA_ANALYSTE.git
cd TEST_BCC_2026_DATA_ANALYSTE
npm install
```

### 3. Lancement
```bash
npm run dev
```

Ouvrez votre navigateur sur **`http://localhost:3000`**.

---

## 📄 Licence
Projet préparé pour le concours BCC 2026.
