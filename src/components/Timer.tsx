import React, { useEffect } from 'react';
import { Clock, Play, Pause } from 'lucide-react';

interface TimerProps {
  timeRemaining: number;
  totalTime: number;
  isRunning: boolean;
  onToggle: () => void;
  onTimeUp: () => void;
}

export const Timer: React.FC<TimerProps> = ({
  timeRemaining,
  totalTime,
  isRunning,
  onToggle,
  onTimeUp
}) => {
  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
      return;
    }

    if (!isRunning) return;

    const timer = setInterval(() => {
      // Timer logic will be handled by parent component
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isRunning, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((totalTime - timeRemaining) / totalTime) * 100;
  const isLowTime = timeRemaining <= 60; // Last minute
  const isCriticalTime = timeRemaining <= 30; // Last 30 seconds

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Clock className={`w-5 h-5 ${isCriticalTime ? 'text-red-500' : isLowTime ? 'text-orange-500' : 'text-gray-600'}`} />
          <span className="text-sm font-medium text-gray-700">Time Remaining</span>
        </div>
        <button
          onClick={onToggle}
          className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            isRunning 
              ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isRunning ? 'Pause' : 'Start'}</span>
        </button>
      </div>

      <div className="mb-3">
        <div className={`text-2xl font-bold ${
          isCriticalTime ? 'text-red-600' : isLowTime ? 'text-orange-600' : 'text-gray-900'
        }`}>
          {formatTime(timeRemaining)}
        </div>
        <div className="text-sm text-gray-500">
          of {formatTime(totalTime)} total
        </div>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${
            isCriticalTime ? 'bg-red-500' : isLowTime ? 'bg-orange-500' : 'bg-blue-500'
          }`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {isLowTime && (
        <div className={`mt-2 text-sm font-medium ${
          isCriticalTime ? 'text-red-600' : 'text-orange-600'
        }`}>
          {isCriticalTime ? '⚠️ Critical time!' : '⏰ Running low on time'}
        </div>
      )}
    </div>
  );
};