import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db, Transaction, Category, Budget, Settings } from '../utils/db';
import { DEFAULT_CATEGORIES } from '../utils/constants';
import { getCurrentMonth } from '../utils/helpers';

interface AppContextType {
  transactions: Transaction[];
  categories: Category[];
  budget: Budget | null;
  settings: Settings;
  loading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  setBudget: (limit: number, month?: string) => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  exportData: () => Promise<string>;
  importData: (jsonData: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budget, setBudgetState] = useState<Budget | null>(null);
  const [settings, setSettings] = useState<Settings>({
    darkMode: false,
    currency: '$',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const initializeApp = async () => {
    try {
      await db.init();

      const [txns, cats, existingSettings] = await Promise.all([
        db.getAllTransactions(),
        db.getAllCategories(),
        db.getSettings(),
      ]);

      setTransactions(txns);

      if (cats.length === 0) {
        for (const cat of DEFAULT_CATEGORIES) {
          await db.addCategory(cat);
        }
        const newCats = await db.getAllCategories();
        setCategories(newCats);
      } else {
        setCategories(cats);
      }

      if (existingSettings) {
        setSettings(existingSettings);
      } else {
        const defaultSettings: Settings = {
          darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
          currency: '$',
        };
        await db.updateSettings(defaultSettings);
        setSettings(defaultSettings);
      }

      const currentMonth = getCurrentMonth();
      const currentBudget = await db.getBudget(currentMonth);
      setBudgetState(currentBudget || null);

      setLoading(false);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      timestamp: Date.now(),
    };
    await db.addTransaction(newTransaction);
    const txns = await db.getAllTransactions();
    setTransactions(txns);
  };

  const updateTransaction = async (transaction: Transaction) => {
    await db.updateTransaction(transaction);
    const txns = await db.getAllTransactions();
    setTransactions(txns);
  };

  const deleteTransaction = async (id: number) => {
    await db.deleteTransaction(id);
    const txns = await db.getAllTransactions();
    setTransactions(txns);
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    await db.addCategory(category);
    const cats = await db.getAllCategories();
    setCategories(cats);
  };

  const updateCategory = async (category: Category) => {
    await db.updateCategory(category);
    const cats = await db.getAllCategories();
    setCategories(cats);
  };

  const deleteCategory = async (id: number) => {
    await db.deleteCategory(id);
    const cats = await db.getAllCategories();
    setCategories(cats);
  };

  const setBudget = async (limit: number, month: string = getCurrentMonth()) => {
    await db.setBudget({ month, limit });
    const newBudget = await db.getBudget(month);
    setBudgetState(newBudget || null);
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    await db.updateSettings(updated);
    setSettings(updated);
  };

  const exportData = async () => {
    return await db.exportData();
  };

  const importData = async (jsonData: string) => {
    await db.importData(jsonData);
    await refreshData();
  };

  const refreshData = async () => {
    const [txns, cats, currentSettings] = await Promise.all([
      db.getAllTransactions(),
      db.getAllCategories(),
      db.getSettings(),
    ]);
    setTransactions(txns);
    setCategories(cats);
    if (currentSettings) {
      setSettings(currentSettings);
    }
    const currentMonth = getCurrentMonth();
    const currentBudget = await db.getBudget(currentMonth);
    setBudgetState(currentBudget || null);
  };

  return (
    <AppContext.Provider
      value={{
        transactions,
        categories,
        budget,
        settings,
        loading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        setBudget,
        updateSettings,
        exportData,
        importData,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
