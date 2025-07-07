import React from 'react';
import { BarChart3, Clock, Target, TrendingUp, Award } from 'lucide-react';
import { UserProgress } from '../types';
import { categories } from '../data/questions';

interface StatisticsProps {
  progress: UserProgress;
}

export const Statistics: React.FC<StatisticsProps> = ({ progress }) => {
  const { stats, completedQuestions, answers } = progress;
  
  const completionRate = stats.totalAttempted > 0 ? (stats.totalCompleted / stats.totalAttempted) * 100 : 0;
  
  const categoryStats = categories.map(category => {
    const categoryQuestions = completedQuestions.filter(qId => 
      Object.keys(answers).includes(qId) && qId.startsWith(category.id.substring(0, 2))
    );
    return {
      ...category,
      completed: categoryQuestions.length,
      percentage: (categoryQuestions.length / category.questionCount) * 100
    };
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const hours = Math.floor(mins / 60);
    if (hours > 0) {
      return `${hours}h ${mins % 60}m`;
    }
    return `${mins}m`;
  };

  const recentAnswers = Object.entries(answers)
    .sort(([,a], [,b]) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Progress</h1>
        <p className="text-gray-600">Track your interview preparation journey</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Questions Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCompleted}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(completionRate)}%</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.averageTime > 0 ? formatTime(stats.averageTime) : '-'}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Practice Streak</p>
              <p className="text-2xl font-bold text-gray-900">3 days</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Progress */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Progress by Category</h2>
        <div className="space-y-4">
          {categoryStats.map(category => (
            <div key={category.id} className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${category.color} bg-opacity-20`}>
                  <div className={`w-4 h-4 ${category.color}`}></div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">
                    {category.completed} of {category.questionCount} questions
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${category.color} transition-all duration-500`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700 w-12 text-right">
                  {Math.round(category.percentage)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {recentAnswers.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentAnswers.map(([questionId, answer]) => (
              <div key={questionId} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">Question #{questionId}</p>
                  <p className="text-sm text-gray-500">
                    Completed in {formatTime(answer.timeSpent)}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(answer.completedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200 p-6">
        <h2 className="text-xl font-semibold text-purple-900 mb-6">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-purple-200">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">First Question</p>
              <p className="text-sm text-gray-500">Complete your first question</p>
            </div>
          </div>
          
          <div className={`flex items-center space-x-3 p-4 rounded-lg border ${
            stats.totalCompleted >= 5 
              ? 'bg-white border-purple-200' 
              : 'bg-gray-50 border-gray-200 opacity-50'
          }`}>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Practice Starter</p>
              <p className="text-sm text-gray-500">Complete 5 questions</p>
            </div>
          </div>

          <div className={`flex items-center space-x-3 p-4 rounded-lg border ${
            stats.totalCompleted >= 20 
              ? 'bg-white border-purple-200' 
              : 'bg-gray-50 border-gray-200 opacity-50'
          }`}>
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Dedicated Learner</p>
              <p className="text-sm text-gray-500">Complete 20 questions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};