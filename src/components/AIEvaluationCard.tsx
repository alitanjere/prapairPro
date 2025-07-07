import React from 'react';
import { Brain, TrendingUp, AlertCircle, CheckCircle, Target } from 'lucide-react';
import { AIEvaluation } from '../types';

interface AIEvaluationCardProps {
  evaluation: AIEvaluation;
  isLoading?: boolean;
}

export const AIEvaluationCard: React.FC<AIEvaluationCardProps> = ({ 
  evaluation, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Brain className="w-5 h-5 text-blue-600 animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Evaluación con IA</h3>
            <p className="text-sm text-gray-500">Analizando tu respuesta...</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5" />;
    if (score >= 60) return <TrendingUp className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Brain className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Evaluación con IA</h3>
            <p className="text-sm text-gray-500">Análisis detallado de tu respuesta</p>
          </div>
        </div>
        
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${getScoreColor(evaluation.score)}`}>
          {getScoreIcon(evaluation.score)}
          <span className="font-bold text-lg">{evaluation.score}/100</span>
        </div>
      </div>

      {/* Feedback detallado */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-2">Análisis General</h4>
        <p className="text-gray-700 leading-relaxed">{evaluation.detailedFeedback}</p>
      </div>

      {/* Fortalezas */}
      {evaluation.strengths.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Fortalezas Identificadas</span>
          </h4>
          <ul className="space-y-2">
            {evaluation.strengths.map((strength, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm">{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Áreas de mejora */}
      {evaluation.improvements.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
            <Target className="w-4 h-4 text-orange-600" />
            <span>Áreas de Mejora</span>
          </h4>
          <ul className="space-y-2">
            {evaluation.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Criterios específicos */}
      {Object.keys(evaluation.criteriaScores).length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Evaluación por Criterios</h4>
          <div className="space-y-3">
            {Object.entries(evaluation.criteriaScores).map(([criterion, score]) => (
              <div key={criterion} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex-1">{criterion}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-8">{score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sugerencias */}
      {evaluation.suggestions.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">💡 Sugerencias para Mejorar</h4>
          <ul className="space-y-1">
            {evaluation.suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-blue-800">• {suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};