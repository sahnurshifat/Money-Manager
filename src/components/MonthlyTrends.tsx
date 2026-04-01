import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Transaction } from '../utils/db';
import { getMonthlyTrends } from '../utils/helpers';
import { useApp } from '../context/AppContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyTrendsProps {
  transactions: Transaction[];
}

const MonthlyTrends: React.FC<MonthlyTrendsProps> = ({ transactions }) => {
  const { settings } = useApp();
  const trends = getMonthlyTrends(transactions, 6);

  const labels = Object.keys(trends).map(month => {
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString('en-US', { month: 'short' });
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: Object.values(trends).map(t => t.income),
        backgroundColor: '#10b981',
        borderRadius: 8,
      },
      {
        label: 'Expenses',
        data: Object.values(trends).map(t => t.expenses),
        backgroundColor: '#ef4444',
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
          color: settings.darkMode ? '#9ca3af' : '#4b5563',
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${settings.currency}${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: settings.darkMode ? '#9ca3af' : '#4b5563',
        },
      },
      y: {
        grid: {
          color: settings.darkMode ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: settings.darkMode ? '#9ca3af' : '#4b5563',
          callback: (value: any) => `${settings.currency}${value}`,
        },
      },
    },
  };

  return (
    <div className="w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default MonthlyTrends;
