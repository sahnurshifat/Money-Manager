import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useApp } from '../context/AppContext';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryChartProps {
  data: Record<string, number>;
}

const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  const { categories, settings } = useApp();

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: Object.keys(data).map(categoryName => {
          const category = categories.find(c => c.name === categoryName);
          return category?.color || '#6b7280';
        }),
        borderWidth: 0,
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
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${settings.currency}${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default CategoryChart;
