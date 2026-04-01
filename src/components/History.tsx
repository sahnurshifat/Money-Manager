import React, { useState, useMemo } from 'react';
import { Filter, Trash2, Calendar } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate, sortTransactionsByDate } from '../utils/helpers';
import { Transaction } from '../utils/db';

const History: React.FC = () => {
  const { transactions, categories, deleteTransaction, settings } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [swipedId, setSwipedId] = useState<number | null>(null);

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.category === filterCategory);
    }

    return sortTransactionsByDate(filtered);
  }, [transactions, filterType, filterCategory]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
      setSwipedId(null);
    }
  };

  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    filteredTransactions.forEach(t => {
      if (!groups[t.date]) {
        groups[t.date] = [];
      }
      groups[t.date].push(t);
    });
    return groups;
  }, [filteredTransactions]);

  return (
    <div className="pb-20 px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">History</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {showFilters && (
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <div className="flex gap-2">
              {['all', 'income', 'expense'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as any)}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    filterType === type
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTransactions).map(([date, txns]) => (
            <div key={date}>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                {formatDate(date)}
              </p>
              <div className="space-y-2">
                {txns.map((transaction) => {
                  const category = categories.find(c => c.name === transaction.category);
                  const IconComponent = category
                    ? (Icons[category.icon as keyof typeof Icons] as React.FC<{ className?: string }>)
                    : null;

                  return (
                    <div
                      key={transaction.id}
                      className="relative overflow-hidden"
                      onTouchStart={(e) => {
                        const touch = e.touches[0];
                        const startX = touch.clientX;

                        const handleTouchMove = (moveEvent: TouchEvent) => {
                          const currentX = moveEvent.touches[0].clientX;
                          const diff = startX - currentX;

                          if (diff > 50) {
                            setSwipedId(transaction.id!);
                          } else if (diff < -20) {
                            setSwipedId(null);
                          }
                        };

                        const handleTouchEnd = () => {
                          document.removeEventListener('touchmove', handleTouchMove);
                          document.removeEventListener('touchend', handleTouchEnd);
                        };

                        document.addEventListener('touchmove', handleTouchMove);
                        document.addEventListener('touchend', handleTouchEnd);
                      }}
                    >
                      <div
                        className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-transform duration-200 ${
                          swipedId === transaction.id ? '-translate-x-20' : 'translate-x-0'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: category?.color + '20' }}
                          >
                            {IconComponent && (
                              <IconComponent className="w-6 h-6" style={{ color: category?.color }} />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {transaction.category}
                            </p>
                            {transaction.notes && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {transaction.notes}
                              </p>
                            )}
                          </div>

                          <p
                            className={`text-lg font-bold ${
                              transaction.type === 'income'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatCurrency(transaction.amount, settings.currency)}
                          </p>
                        </div>
                      </div>

                      {swipedId === transaction.id && (
                        <button
                          onClick={() => handleDelete(transaction.id!)}
                          className="absolute right-0 top-0 h-full px-6 bg-red-500 flex items-center justify-center"
                        >
                          <Trash2 className="w-5 h-5 text-white" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
