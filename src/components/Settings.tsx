import React, { useState } from 'react';
import { Moon, Sun, Download, Upload, DollarSign, Tags, Target, Plus, Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCurrentMonth, getMonthName } from '../utils/helpers';
import { COLOR_OPTIONS, ICON_OPTIONS } from '../utils/constants';

const Settings: React.FC = () => {
  const { settings, budget, categories, updateSettings, setBudget, addCategory, deleteCategory, exportData, importData } = useApp();
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState(budget?.limit.toString() || '');
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: 'Tag',
    color: COLOR_OPTIONS[0],
    type: 'expense' as 'income' | 'expense' | 'both',
  });

  const handleExport = async () => {
    const data = await exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        await importData(text);
        alert('Data imported successfully!');
      }
    };
    input.click();
  };

  const handleSaveBudget = async () => {
    if (budgetAmount) {
      await setBudget(parseFloat(budgetAmount));
      setShowBudgetModal(false);
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.name) {
      await addCategory({ ...newCategory, isDefault: false });
      setShowCategoryModal(false);
      setNewCategory({
        name: '',
        icon: 'Tag',
        color: COLOR_OPTIONS[0],
        type: 'expense',
      });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Delete this category? Transactions using it will keep the category name.')) {
      await deleteCategory(id);
    }
  };

  return (
    <div className="pb-20 px-4 pt-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.darkMode ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark theme</p>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.darkMode ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.darkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <button
            onClick={() => {
              setBudgetAmount(budget?.limit.toString() || '');
              setShowBudgetModal(true);
            }}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div className="text-left">
                <p className="font-semibold text-gray-900 dark:text-white">Monthly Budget</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {budget ? `${settings.currency}${budget.limit} for ${getMonthName(getCurrentMonth())}` : 'Not set'}
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Tags className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <p className="font-semibold text-gray-900 dark:text-white">Categories</p>
            </div>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 text-emerald-500" />
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {categories.map((cat) => {
              const IconComponent = Icons[cat.icon as keyof typeof Icons] as React.FC<{ className?: string }>;
              return (
                <div key={cat.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: cat.color + '20' }}
                  >
                    {IconComponent && <IconComponent className="w-4 h-4" style={{ color: cat.color }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{cat.name}</p>
                  </div>
                  {!cat.isDefault && (
                    <button
                      onClick={() => handleDeleteCategory(cat.id!)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-3">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <p className="font-semibold text-gray-900 dark:text-white">Data Management</p>
          </div>

          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
          >
            <Download className="w-5 h-5" />
            Export Data
          </button>

          <button
            onClick={handleImport}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-medium transition-colors"
          >
            <Upload className="w-5 h-5" />
            Import Data
          </button>
        </div>
      </div>

      {showBudgetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Set Monthly Budget
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {getMonthName(getCurrentMonth())}
            </p>
            <input
              type="number"
              step="0.01"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white mb-4"
              placeholder="Enter budget limit"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowBudgetModal(false)}
                className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBudget}
                className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full my-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Add Category
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white"
                  placeholder="Category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={newCategory.type}
                  onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value as any })}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto p-2">
                  {ICON_OPTIONS.map((iconName) => {
                    const IconComponent = Icons[iconName as keyof typeof Icons] as React.FC<{ className?: string }>;
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setNewCategory({ ...newCategory, icon: iconName })}
                        className={`p-2 rounded-lg border-2 ${
                          newCategory.icon === iconName
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {IconComponent && <IconComponent className="w-5 h-5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewCategory({ ...newCategory, color })}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newCategory.color === color
                          ? 'border-gray-900 dark:border-white'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-medium"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
