import { UserProgress } from '../types';

const STORAGE_KEY = 'prepair_progress';

export const getStoredProgress = (): UserProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load progress from localStorage:', error);
  }
  
  return {
    completedQuestions: [],
    answers: {},
    stats: {
      totalAttempted: 0,
      totalCompleted: 0,
      averageTime: 0,
      categories: {}
    }
  };
};

export const saveProgress = (progress: UserProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.warn('Failed to save progress to localStorage:', error);
  }
};

export const clearProgress = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear progress from localStorage:', error);
  }
};