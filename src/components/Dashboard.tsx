import React from 'react';
import { Wallet, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateTotals, getMonthlyTransactions, getCategoryBreakdown, getCurrentMonth, getMonthName, formatCurrency } from '../utils/helpers';
import CategoryChart from './CategoryChart';
import MonthlyTrends from './MonthlyTrends';

const Dashboard: React.FC = () => {
  const { transactions, budget, settings } = useApp();
  const currentMonth = getCurrentMonth();
  const monthlyTransactions = getMonthlyTransactions(transactions, currentMonth);
  const totals = calculateTotals(monthlyTransactions);
  const expenseBreakdown = getCategoryBreakdown(monthlyTransactions.filter(t => t.type === 'expense'));

  const budgetPercentage = budget ? (totals.expenses / budget.limit) * 100 : 0;
  const isBudgetWarning = budgetPercentage >= 80 && budgetPercentage < 100;
  const isBudgetExceeded = budgetPercentage >= 100;

  return (
    <div className="pb-20 px-4 pt-6 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{getMonthName(currentMonth)}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5" />
            <span className="text-sm opacity-90">Total Balance</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(totals.balance, settings.currency)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Income</span>
            </div>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totals.income, settings.currency)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Expenses</span>
            </div>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(totals.expenses, settings.currency)}
            </p>
          </div>
        </div>
      </div>

      {budget && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Monthly Budget</h3>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {formatCurrency(totals.expenses, settings.currency)} / {formatCurrency(budget.limit, settings.currency)}
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                isBudgetExceeded
                  ? 'bg-red-500'
                  : isBudgetWarning
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            />
          </div>

          {(isBudgetWarning || isBudgetExceeded) && (
            <div className={`flex items-center gap-2 mt-3 p-3 rounded-lg ${
              isBudgetExceeded
                ? 'bg-red-50 dark:bg-red-900/20'
                : 'bg-amber-50 dark:bg-amber-900/20'
            }`}>
              <AlertCircle className={`w-4 h-4 ${
                isBudgetExceeded ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
              }`} />
              <p className={`text-xs ${
                isBudgetExceeded ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
              }`}>
                {isBudgetExceeded
                  ? `Budget exceeded by ${formatCurrency(totals.expenses - budget.limit, settings.currency)}`
                  : `You've used ${budgetPercentage.toFixed(0)}% of your budget`
                }
              </p>
            </div>
          )}
        </div>
      )}

      {Object.keys(expenseBreakdown).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Expense Breakdown</h3>
          <CategoryChart data={expenseBreakdown} />
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">6-Month Trends</h3>
        <MonthlyTrends transactions={transactions} />
      </div>
    </div>
  );
};

export default Dashboard;
