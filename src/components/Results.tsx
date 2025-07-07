import React from 'react';
import { CheckCircle, Clock, Lightbulb, ArrowRight, RotateCcw, Brain } from 'lucide-react';
import { Question, AIEvaluation } from '../types';
import { AIEvaluationCard } from './AIEvaluationCard';

interface ResultsProps {
  question: Question;
  answer: string;
  timeSpent: number;
  hintsUsed: number;
  aiEvaluation?: AIEvaluation;
  isEvaluating?: boolean;
  onContinue: () => void;
  onRetry: () => void;
}

export const Results: React.FC<ResultsProps> = ({
  question,
  answer,
  timeSpent,
  hintsUsed,
  aiEvaluation,
  isEvaluating = false,
  onContinue,
  onRetry
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const totalTime = question.timeLimit * 60;
  const timeEfficiency = Math.max(0, Math.min(100, ((totalTime - timeSpent) / totalTime) * 100));
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Excelente trabajo!</h1>
        <p className="text-gray-600">Has completado: "{question.title}"</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal - Tu respuesta */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tu Respuesta</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans">
                {answer || "No se proporcionó respuesta"}
              </pre>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>{answer.length} caracteres escritos</span>
              <span>Tiempo utilizado: {formatTime(timeSpent)}</span>
            </div>
          </div>

          {/* Evaluación con IA */}
          <AIEvaluationCard 
            evaluation={aiEvaluation!} 
            isLoading={isEvaluating} 
          />

          {/* Respuesta de ejemplo */}
          {question.sampleAnswer && !isEvaluating && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Respuesta de Ejemplo</h2>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-blue-800 leading-relaxed">{question.sampleAnswer}</p>
              </div>
              
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h3 className="font-medium text-yellow-800 mb-2">💡 Puntos Clave a Considerar:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Compara tu enfoque con la respuesta de ejemplo</li>
                  <li>• Busca conceptos que podrías haber omitido</li>
                  <li>• Considera soluciones alternativas u optimizaciones</li>
                  <li>• Piensa en casos edge que no fueron cubiertos</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Estadísticas y acciones */}
        <div className="space-y-6">
          {/* Resumen de rendimiento */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Rendimiento</h3>
            
            <div className="space-y-4">
              {aiEvaluation && !isEvaluating && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700">Puntuación IA</span>
                  </div>
                  <span className={`font-bold text-lg ${getScoreColor(aiEvaluation.score)}`}>
                    {aiEvaluation.score}/100
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700">Eficiencia de Tiempo</span>
                </div>
                <span className={`font-bold ${getScoreColor(timeEfficiency)}`}>
                  {Math.round(timeEfficiency)}%
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-700">Pistas Usadas</span>
                </div>
                <span className="font-medium text-gray-900">{hintsUsed}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600 space-y-1">
                <div>Tiempo empleado: {formatTime(timeSpent)}</div>
                <div>Tiempo límite: {formatTime(totalTime)}</div>
                <div>Longitud de respuesta: {answer.length} caracteres</div>
                <div>Categoría: {question.category}</div>
              </div>
            </div>
          </div>

          {/* Próximos pasos */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
            <h3 className="font-semibold text-blue-900 mb-4">¿Qué sigue?</h3>
            
            <div className="space-y-3">
              <button
                onClick={onContinue}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>Continuar a la Siguiente Pregunta</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={onRetry}
                className="w-full flex items-center justify-center space-x-2 bg-white text-blue-600 py-3 px-4 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Intentar Esta Pregunta Otra Vez</span>
              </button>
            </div>
          </div>

          {/* Consejos de estudio */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">📚 Consejos de Preparación</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              {question.category === 'behavioral' ? (
                <>
                  <li>• Usa la metodología STAR en respuestas comportamentales</li>
                  <li>• Prepara 3-5 historias que puedas adaptar</li>
                  <li>• Incluye métricas y resultados específicos</li>
                  <li>• Practica contando historias de forma concisa</li>
                </>
              ) : question.category === 'technical' ? (
                <>
                  <li>• Explica tu proceso de pensamiento paso a paso</li>
                  <li>• Incluye ejemplos de código cuando sea relevante</li>
                  <li>• Menciona trade-offs y alternativas</li>
                  <li>• Practica dibujar diagramas si es necesario</li>
                </>
              ) : (
                <>
                  <li>• Sé específico con ejemplos de tu experiencia</li>
                  <li>• Conecta tus respuestas con el valor de negocio</li>
                  <li>• Muestra tu proceso de pensamiento</li>
                  <li>• Practica respuestas de 2-3 minutos</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};