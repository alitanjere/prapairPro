import React from 'react';
import { Brain, BarChart3, Settings, Home } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: 'home' | 'stats' | 'settings') => void;
  completedCount: number;
  totalQuestions: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  onNavigate, 
  completedCount, 
  totalQuestions 
}) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Prepair</h1>
              <p className="text-sm text-gray-500">Technical Interview Practice</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <span>Progress:</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${totalQuestions > 0 ? (completedCount / totalQuestions) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="font-medium">{completedCount}/{totalQuestions}</span>
              </div>
            </div>

            <nav className="flex items-center space-x-1">
              <button
                onClick={() => onNavigate('home')}
                className={`p-2 rounded-lg transition-colors ${
                  currentView === 'home' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Home"
              >
                <Home className="w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate('stats')}
                className={`p-2 rounded-lg transition-colors ${
                  currentView === 'stats' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Statistics"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate('settings')}
                className={`p-2 rounded-lg transition-colors ${
                  currentView === 'settings' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};