import { Category } from './db';

export const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Salary', icon: 'Banknote', color: '#10b981', type: 'income', isDefault: true },
  { name: 'Freelance', icon: 'Laptop', color: '#059669', type: 'income', isDefault: true },
  { name: 'Investment', icon: 'TrendingUp', color: '#34d399', type: 'income', isDefault: true },
  { name: 'Other Income', icon: 'DollarSign', color: '#6ee7b7', type: 'income', isDefault: true },

  { name: 'Food & Dining', icon: 'UtensilsCrossed', color: '#ef4444', type: 'expense', isDefault: true },
  { name: 'Shopping', icon: 'ShoppingBag', color: '#dc2626', type: 'expense', isDefault: true },
  { name: 'Transport', icon: 'Car', color: '#f97316', type: 'expense', isDefault: true },
  { name: 'Entertainment', icon: 'Film', color: '#f59e0b', type: 'expense', isDefault: true },
  { name: 'Bills & Utilities', icon: 'Receipt', color: '#8b5cf6', type: 'expense', isDefault: true },
  { name: 'Healthcare', icon: 'HeartPulse', color: '#ec4899', type: 'expense', isDefault: true },
  { name: 'Education', icon: 'GraduationCap', color: '#3b82f6', type: 'expense', isDefault: true },
  { name: 'Other Expense', icon: 'MoreHorizontal', color: '#6b7280', type: 'expense', isDefault: true },
];

export const ICON_OPTIONS = [
  'Banknote', 'Laptop', 'TrendingUp', 'DollarSign', 'UtensilsCrossed',
  'ShoppingBag', 'Car', 'Film', 'Receipt', 'HeartPulse', 'GraduationCap',
  'Home', 'Plane', 'Coffee', 'Shirt', 'Smartphone', 'Music', 'Book',
  'Gift', 'Briefcase', 'CreditCard', 'Wallet', 'PiggyBank', 'MoreHorizontal'
];

export const COLOR_OPTIONS = [
  '#10b981', '#059669', '#34d399', '#6ee7b7',
  '#ef4444', '#dc2626', '#f87171', '#fca5a5',
  '#f97316', '#ea580c', '#fb923c', '#fdba74',
  '#f59e0b', '#d97706', '#fbbf24', '#fcd34d',
  '#8b5cf6', '#7c3aed', '#a78bfa', '#c4b5fd',
  '#ec4899', '#db2777', '#f472b6', '#f9a8d4',
  '#3b82f6', '#2563eb', '#60a5fa', '#93c5fd',
  '#6b7280', '#4b5563', '#9ca3af', '#d1d5db'
];
