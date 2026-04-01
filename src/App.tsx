import React, { useState } from 'react';
import { Home, Plus, Clock, Settings as SettingsIcon } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import Dashboard from './components/Dashboard';
import AddTransaction from './components/AddTransaction';
import History from './components/History';
import Settings from './components/Settings';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add' | 'history' | 'settings'>('dashboard');
  const { loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'add' && <AddTransaction />}
        {activeTab === 'history' && <History />}
        {activeTab === 'settings' && <Settings />}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-around px-4 py-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'dashboard'
                ? 'text-emerald-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'add'
                ? 'text-emerald-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center -mt-8 shadow-lg ${
              activeTab === 'add'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              <Plus className="w-7 h-7" />
            </div>
            <span className="text-xs font-medium mt-1">Add</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'history'
                ? 'text-emerald-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Clock className="w-6 h-6" />
            <span className="text-xs font-medium">History</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'settings'
                ? 'text-emerald-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <SettingsIcon className="w-6 h-6" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
