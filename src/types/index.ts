export type Category = 
  | 'psychotech_logic'
  | 'psychotech_numerical'
  | 'psychotech_entry_level'
  | 'sql_data_analysis'
  | 'python_econometrics'
  | 'bank_risk_prudential'
  | 'monetary_reporting_cpm';

export type Difficulty = 'moyen' | 'difficile' | 'extreme';

export interface Question {
  id: string;
  category: Category;
  categoryLabel: string;
  difficulty: Difficulty;
  title: string;
  prompt: string;
  contextData?: {
    type: 'table' | 'code' | 'chart' | 'matrix';
    headers?: string[];
    rows?: (string | number)[][];
    codeSnippet?: string;
    codeLanguage?: string;
    matrixGrid?: string[][];
  };
  options: string[];
  correctIndex: number;
  explanation: {
    summary: string;
    steps: string[];
    bccRelevance: string; // How this applies to daily work at Banque Centrale du Congo
    proTip: string;
  };
  timeEstimateSeconds: number;
}

export interface UserAnswerRecord {
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
  timestamp: number;
  category: Category;
}

export interface ExamSession {
  id: string;
  timestamp: number;
  totalQuestions: number;
  score: number;
  accuracy: number;
  totalTimeSeconds: number;
  categoryBreakdown: Record<Category, { total: number; correct: number }>;
  completed: boolean;
}

export interface SQLChallenge {
  id: string;
  title: string;
  department: string;
  difficulty: Difficulty;
  description: string;
  businessContext: string;
  schemaTables: {
    name: string;
    columns: { name: string; type: string; comment: string }[];
    sampleData: Record<string, string | number | null>[];
  }[];
  expectedTask: string;
  initialCode: string;
  solutionQuery: string;
  explanation: string;
  hint: string;
  validator: (userQuery: string) => { passed: boolean; message: string; rows?: any[] };
}

export interface RiskScenario {
  id: string;
  title: string;
  crisisType: string;
  departmentTarget: string;
  briefing: string;
  initialTelemetry: {
    tauxChangeCDF_USD: number;
    reservesChangeSemaines: number;
    inflationGlissement: number;
    tauxDirecteurBCC: number;
    ratioLCRSystemique: number;
    tauxNPL: number;
  };
  stages: {
    stageNumber: number;
    stageTitle: string;
    situationReport: string;
    keyMetricUpdate?: Record<string, number | string>;
    dataTable?: {
      headers: string[];
      rows: (string | number)[][];
    };
    decisionQuestion: string;
    options: {
      id: string;
      label: string;
      technicalRationale: string;
      impact: {
        reservesImpact: string;
        inflationImpact: string;
        bankingRiskImpact: string;
        score: number; // 0 to 100
      };
      cpmFeedback: string;
    }[];
  }[];
}

export interface CompetencyScore {
  category: Category;
  categoryLabel: string;
  scorePercent: number;
  totalAttempted: number;
  correctCount: number;
  status: 'Faible' | 'Moyen' | 'Solide' | 'Maître';
  recommendation: string;
}
