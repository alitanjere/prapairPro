import React, { useState } from 'react';
import { ArrowLeft, Lightbulb, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Question } from '../types';
import { Timer } from './Timer';

interface QuestionCardProps {
  question: Question;
  answer: string;
  timeRemaining: number;
  isTimerRunning: boolean;
  onAnswerChange: (answer: string) => void;
  onTimerToggle: () => void;
  onTimeUp: () => void;
  onComplete: () => void;
  onBack: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answer,
  timeRemaining,
  isTimerRunning,
  onAnswerChange,
  onTimerToggle,
  onTimeUp,
  onComplete,
  onBack
}) => {
  const [showHints, setShowHints] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [activeHintIndex, setActiveHintIndex] = useState(-1);

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800'
  };

  const totalTime = question.timeLimit * 60;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Category</span>
        </button>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[question.difficulty]}`}>
            {question.difficulty}
          </span>
          <div className="text-sm text-gray-500">
            {question.timeLimit} min suggested
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {question.title}
            </h1>
            <p className="text-gray-700 leading-relaxed mb-4">
              {question.description}
            </p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {question.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Hints Section */}
            {question.hints && question.hints.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>{showHints ? 'Hide Hints' : 'Show Hints'}</span>
                </button>
                
                {showHints && (
                  <div className="mt-3 space-y-2">
                    {question.hints.map((hint, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg transition-all cursor-pointer ${
                          activeHintIndex >= index
                            ? 'bg-yellow-50 border border-yellow-200'
                            : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveHintIndex(index)}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-500">
                            Hint {index + 1}:
                          </span>
                          {activeHintIndex >= index && (
                            <span className="text-sm text-gray-700">{hint}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Answer Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Answer</h2>
              <button
                onClick={onComplete}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Submit Answer</span>
              </button>
            </div>
            
            <textarea
              value={answer}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Type your answer here... Explain your thought process, code if applicable, and reasoning."
              className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <div className="mt-4 text-sm text-gray-500">
              {answer.length} characters • Write as much detail as you can
            </div>
          </div>

          {/* Sample Answer */}
          {question.sampleAnswer && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <button
                onClick={() => setShowSample(!showSample)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                {showSample ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showSample ? 'Hide' : 'Show'} Sample Answer</span>
              </button>
              
              {showSample && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-900 mb-2">Sample Answer:</h3>
                  <p className="text-blue-800 leading-relaxed">{question.sampleAnswer}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Timer
            timeRemaining={timeRemaining}
            totalTime={totalTime}
            isRunning={isTimerRunning}
            onToggle={onTimerToggle}
            onTimeUp={onTimeUp}
          />

          {/* Progress Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-3">Session Progress</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Answer length:</span>
                <span className="font-medium">{answer.length} chars</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time spent:</span>
                <span className="font-medium">
                  {Math.floor((totalTime - timeRemaining) / 60)}m {(totalTime - timeRemaining) % 60}s
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hints used:</span>
                <span className="font-medium">{activeHintIndex + 1}</span>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
            <h3 className="font-medium text-blue-900 mb-2">💡 Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Think out loud as you would in a real interview</li>
              <li>• Structure your answer with clear sections</li>
              <li>• Use specific examples when possible</li>
              <li>• Don't be afraid to ask clarifying questions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};