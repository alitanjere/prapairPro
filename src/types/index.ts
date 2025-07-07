export interface Question {
  id: string;
  category: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  timeLimit: number; // in minutes
  hints?: string[];
  sampleAnswer?: string;
  tags: string[];
  evaluationCriteria?: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  questionCount: number;
}

export interface UserProgress {
  completedQuestions: string[];
  answers: Record<string, {
    answer: string;
    timeSpent: number;
    completedAt: Date;
    aiEvaluation?: AIEvaluation;
  }>;
  stats: {
    totalAttempted: number;
    totalCompleted: number;
    averageTime: number;
    categories: Record<string, number>;
    averageScore: number;
  };
}

export interface AIEvaluation {
  score: number; // 0-100
  strengths: string[];
  improvements: string[];
  detailedFeedback: string;
  criteriaScores: Record<string, number>;
  suggestions: string[];
}

export interface AppState {
  currentView: 'home' | 'category' | 'question' | 'results' | 'stats' | 'settings';
  selectedCategory?: string;
  currentQuestion?: Question;
  currentAnswer: string;
  timeRemaining: number;
  isTimerRunning: boolean;
  isEvaluating?: boolean;
}