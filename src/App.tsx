import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CategoryCard } from './components/CategoryCard';
import { QuestionCard } from './components/QuestionCard';
import { Results } from './components/Results';
import { Statistics } from './components/Statistics';
import { DocumentUploader } from './components/DocumentUploader';
import { OllamaStatus } from './components/OllamaStatus';
import { categories, questions } from './data/questions';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AppState, UserProgress, Question } from './types';
import { evaluateAnswer } from './services/aiEvaluator';

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentView: 'home',
    currentAnswer: '',
    timeRemaining: 0,
    isTimerRunning: false,
    isEvaluating: false,
  });

  const [progress, setProgress] = useLocalStorage<UserProgress>('prepair_progress', {
    completedQuestions: [],
    answers: {},
    stats: {
      totalAttempted: 0,
      totalCompleted: 0,
      averageTime: 0,
      averageScore: 0,
      categories: {}
    }
  });

  // Timer effect
  useEffect(() => {
    if (appState.isTimerRunning && appState.timeRemaining > 0) {
      const timer = setInterval(() => {
        setAppState(prev => ({
          ...prev,
          timeRemaining: Math.max(0, prev.timeRemaining - 1)
        }));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [appState.isTimerRunning, appState.timeRemaining]);

  const handleNavigate = (view: 'home' | 'stats' | 'settings') => {
    setAppState(prev => ({ ...prev, currentView: view }));
  };

  const handleCategorySelect = (categoryId: string) => {
    const categoryQuestions = questions.filter(q => q.category === categoryId);
    const uncompletedQuestions = categoryQuestions.filter(q => 
      !progress.completedQuestions.includes(q.id)
    );
    
    if (uncompletedQuestions.length > 0) {
      const nextQuestion = uncompletedQuestions[0];
      setAppState(prev => ({
        ...prev,
        currentView: 'question',
        selectedCategory: categoryId,
        currentQuestion: nextQuestion,
        currentAnswer: '',
        timeRemaining: nextQuestion.timeLimit * 60,
        isTimerRunning: false
      }));
    } else {
      // All questions completed, show first question for review
      const firstQuestion = categoryQuestions[0];
      if (firstQuestion) {
        setAppState(prev => ({
          ...prev,
          currentView: 'question',
          selectedCategory: categoryId,
          currentQuestion: firstQuestion,
          currentAnswer: progress.answers[firstQuestion.id]?.answer || '',
          timeRemaining: firstQuestion.timeLimit * 60,
          isTimerRunning: false
        }));
      }
    }
  };

  const handleAnswerChange = (answer: string) => {
    setAppState(prev => ({ ...prev, currentAnswer: answer }));
  };

  const handleTimerToggle = () => {
    setAppState(prev => ({ ...prev, isTimerRunning: !prev.isTimerRunning }));
  };

  const handleTimeUp = () => {
    setAppState(prev => ({ ...prev, isTimerRunning: false }));
  };

  const handleQuestionComplete = async () => {
    if (!appState.currentQuestion) return;

    const timeSpent = (appState.currentQuestion.timeLimit * 60) - appState.timeRemaining;
    const questionId = appState.currentQuestion.id;

    // Mostrar vista de resultados inmediatamente
    setAppState(prev => ({
      ...prev,
      currentView: 'results',
      isTimerRunning: false,
      isEvaluating: true
    }));

    try {
      // Evaluar respuesta con IA
      const aiEvaluation = await evaluateAnswer(
        appState.currentQuestion, 
        appState.currentAnswer, 
        timeSpent
      );

      // Update progress
      const newProgress = { ...progress };
      
      // Add to completed questions if not already there
      if (!newProgress.completedQuestions.includes(questionId)) {
        newProgress.completedQuestions.push(questionId);
        newProgress.stats.totalCompleted++;
      }
      
      // Update answer with AI evaluation
      newProgress.answers[questionId] = {
        answer: appState.currentAnswer,
        timeSpent,
        completedAt: new Date(),
        aiEvaluation
      };

      // Update stats
      newProgress.stats.totalAttempted = Math.max(
        newProgress.stats.totalAttempted, 
        newProgress.stats.totalCompleted
      );
      
      // Calculate average time
      const allTimes = Object.values(newProgress.answers).map(a => a.timeSpent);
      newProgress.stats.averageTime = allTimes.reduce((sum, time) => sum + time, 0) / allTimes.length;

      // Calculate average score
      const allScores = Object.values(newProgress.answers)
        .map(a => a.aiEvaluation?.score)
        .filter(score => score !== undefined) as number[];
      newProgress.stats.averageScore = allScores.length > 0 
        ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length 
        : 0;

      // Update category stats
      const category = appState.currentQuestion.category;
      newProgress.stats.categories[category] = (newProgress.stats.categories[category] || 0) + 1;

      setProgress(newProgress);
      
      // Finalizar evaluación
      setAppState(prev => ({ ...prev, isEvaluating: false }));

    } catch (error) {
      console.error('Error evaluating answer:', error);
      setAppState(prev => ({ ...prev, isEvaluating: false }));
    }
  };

  const handleResultsContinue = () => {
    if (!appState.selectedCategory) return;
    
    const categoryQuestions = questions.filter(q => q.category === appState.selectedCategory);
    const uncompletedQuestions = categoryQuestions.filter(q => 
      !progress.completedQuestions.includes(q.id)
    );
    
    if (uncompletedQuestions.length > 0) {
      const nextQuestion = uncompletedQuestions[0];
      setAppState(prev => ({
        ...prev,
        currentView: 'question',
        currentQuestion: nextQuestion,
        currentAnswer: '',
        timeRemaining: nextQuestion.timeLimit * 60,
        isTimerRunning: false
      }));
    } else {
      // No more questions, go back to category view
      setAppState(prev => ({ ...prev, currentView: 'home' }));
    }
  };

  const handleResultsRetry = () => {
    if (!appState.currentQuestion) return;
    
    setAppState(prev => ({
      ...prev,
      currentView: 'question',
      currentAnswer: '',
      timeRemaining: prev.currentQuestion!.timeLimit * 60,
      isTimerRunning: false
    }));
  };

  const handleBackToCategory = () => {
    setAppState(prev => ({ ...prev, currentView: 'home' }));
  };

  const getCategoryProgress = (categoryId: string) => {
    return progress.completedQuestions.filter(qId => {
      const question = questions.find(q => q.id === qId);
      return question?.category === categoryId;
    }).length;
  };

  const totalQuestions = questions.length;
  const completedCount = progress.completedQuestions.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentView={appState.currentView}
        onNavigate={handleNavigate}
        completedCount={completedCount}
        totalQuestions={totalQuestions}
      />

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        {appState.currentView === 'home' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Domina tus Entrevistas Técnicas
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Practica con preguntas reales de entrevistas de las mejores empresas tech. 
                Desarrolla confianza, mejora tus respuestas, y consigue el trabajo de tus sueños.
              </p>
              <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Evaluación con IA</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Feedback Personalizado</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Soft Skills + Técnicas</span>
                </div>
              </div>
              
              {/* Status de Ollama */}
              <div className="mt-4 flex justify-center">
                <OllamaStatus />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map(category => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  completedCount={getCategoryProgress(category.id)}
                  onSelect={handleCategorySelect}
                />
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-12 bg-white rounded-lg border border-gray-200 p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600">{completedCount}</div>
                  <div className="text-gray-600">Preguntas Completadas</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {totalQuestions > 0 ? Math.round((completedCount / totalQuestions) * 100) : 0}%
                  </div>
                  <div className="text-gray-600">Progreso General</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">
                    {progress.stats.averageScore > 0 ? Math.round(progress.stats.averageScore) : '-'}
                  </div>
                  <div className="text-gray-600">Puntuación Promedio</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600">{categories.length}</div>
                  <div className="text-gray-600">Categorías Disponibles</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {appState.currentView === 'question' && appState.currentQuestion && (
          <QuestionCard
            question={appState.currentQuestion}
            answer={appState.currentAnswer}
            timeRemaining={appState.timeRemaining}
            isTimerRunning={appState.isTimerRunning}
            onAnswerChange={handleAnswerChange}
            onTimerToggle={handleTimerToggle}
            onTimeUp={handleTimeUp}
            onComplete={handleQuestionComplete}
            onBack={handleBackToCategory}
          />
        )}

        {appState.currentView === 'results' && appState.currentQuestion && (
          <Results
            question={appState.currentQuestion}
            answer={appState.currentAnswer}
            timeSpent={(appState.currentQuestion.timeLimit * 60) - appState.timeRemaining}
            hintsUsed={0} // TODO: Track hints used
            aiEvaluation={progress.answers[appState.currentQuestion.id]?.aiEvaluation}
            isEvaluating={appState.isEvaluating}
            onContinue={handleResultsContinue}
            onRetry={handleResultsRetry}
          />
        )}

        {appState.currentView === 'stats' && (
          <Statistics progress={progress} />
        )}

        {appState.currentView === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Configuración</h1>
              
              {/* Sección de documentos RAG */}
              <div className="mb-8">
                <DocumentUploader />
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Gestión de Datos</h3>
                  <button
                    onClick={() => {
                      if (confirm('¿Estás seguro de que quieres reiniciar todo el progreso? Esta acción no se puede deshacer.')) {
                        setProgress({
                          completedQuestions: [],
                          answers: {},
                          stats: {
                            totalAttempted: 0,
                            totalCompleted: 0,
                            averageTime: 0,
                            averageScore: 0,
                            categories: {}
                          }
                        });
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reiniciar Todo el Progreso
                  </button>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Acerca de Prepair</h3>
                  <p className="text-gray-600 mb-2">
                    Versión 2.0.0 - Construido para la preparación de entrevistas técnicas
                  </p>
                  <p className="text-sm text-gray-500">
                    Incluye evaluación con IA, preguntas comportamentales, feedback personalizado y sistema RAG
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;