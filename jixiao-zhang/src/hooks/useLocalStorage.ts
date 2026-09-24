import type { Expense, Income, Budget, Category } from '../types';
import { useState, useEffect, useCallback } from 'react';

interface StorageData {
  expenses: Expense[];
  incomes: Income[];
  budget: Budget;
}

const STORAGE_KEY = 'jixiao-zhang-data';

export function useLocalStorage() {
  const [data, setData] = useState<StorageData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse storage:', e);
    }
    return {
      expenses: [],
      incomes: [],
      budget: { monthlyLimit: 3000, categoryLimits: {} as Record<Category, number> },
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to storage:', e);
    }
  }, [data]);

  const addExpense = useCallback((expense: Omit<Expense, 'id' | 'createdAt'>) => {
    setData(prev => ({
      ...prev,
      expenses: [{
        ...expense,
        id: Date.now().toString(),
        createdAt: Date.now(),
      }, ...prev.expenses],
    }));
  }, []);

  const addIncome = useCallback((income: Omit<Income, 'id' | 'createdAt'>) => {
    setData(prev => ({
      ...prev,
      incomes: [{
        ...income,
        id: Date.now().toString(),
        createdAt: Date.now(),
      }, ...prev.incomes],
    }));
  }, []);

  const updateExpense = useCallback((id: string, updates: Partial<Expense>) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.map(e => e.id === id ? { ...e, ...updates } : e),
    }));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== id),
    }));
  }, []);

  const updateBudget = useCallback((budget: Partial<Budget>) => {
    setData(prev => ({
      ...prev,
      budget: { ...prev.budget, ...budget },
    }));
  }, []);

  const clearAllData = useCallback(() => {
    setData({
      expenses: [],
      incomes: [],
      budget: { monthlyLimit: 3000, categoryLimits: {} as Record<Category, number> },
    });
  }, []);

  return {
    data,
    addExpense,
    addIncome,
    updateExpense,
    deleteExpense,
    updateBudget,
    clearAllData,
  };
}
