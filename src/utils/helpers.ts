import { Transaction } from './db';

export function formatCurrency(amount: number, currency: string = '$'): string {
  return `${currency}${Math.abs(amount).toFixed(2)}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

export function getCurrentMonth(): string {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function getMonthName(monthString: string): string {
  const [year, month] = monthString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function calculateTotals(transactions: Transaction[]) {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expenses,
    balance: income - expenses,
  };
}

export function getMonthlyTransactions(transactions: Transaction[], month: string): Transaction[] {
  return transactions.filter(t => t.date.startsWith(month));
}

export function getCategoryBreakdown(transactions: Transaction[]) {
  const breakdown: Record<string, number> = {};

  transactions.forEach(t => {
    if (!breakdown[t.category]) {
      breakdown[t.category] = 0;
    }
    breakdown[t.category] += t.amount;
  });

  return breakdown;
}

export function getMonthlyTrends(transactions: Transaction[], months: number = 6) {
  const trends: Record<string, { income: number; expenses: number }> = {};
  const today = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    trends[monthKey] = { income: 0, expenses: 0 };
  }

  transactions.forEach(t => {
    const month = t.date.substring(0, 7);
    if (trends[month]) {
      if (t.type === 'income') {
        trends[month].income += t.amount;
      } else {
        trends[month].expenses += t.amount;
      }
    }
  });

  return trends;
}

export function sortTransactionsByDate(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort((a, b) => b.timestamp - a.timestamp);
}

export function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}
