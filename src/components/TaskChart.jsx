import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function TaskChart({ taskHistory }) {
  // Calculate completion percentage for each day
  const completionData = taskHistory.slice(-7).map(day => {
    const total = day.todo + day.inProgress + day.done;
    return total > 0 ? (day.done / total) * 100 : 0;
  });

  const chartData = {
    labels: taskHistory.slice(-7).map(h => h.date),
    datasets: [
      {
        label: 'Completion Rate',
        data: completionData,
       
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
      
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Task Completion Trend',
        color: '#9ca3af',
        padding: {
          bottom: 20,
        },
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => `Completion Rate: ${context.parsed.y.toFixed(1)}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { 
          color: '#9ca3af',
          padding: 8,
          callback: (value) => `${value}%`,
        },
        grid: { 
          color: 'rgba(156, 163, 175, 0.1)',
        },
        border: {
          display: false,
        },
      },
      x: {
        ticks: { 
          color: '#9ca3af',
          padding: 8,
        },
        grid: { 
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        borderWidth: 3,
      },
    },
  };

  return (
    <div className="backdrop-blur-lg bg-white/5 rounded-lg p-6 border border-[#ffffff19] w-full h-auto max-w-full overflow-auto" style={{width:"100%", height:"100%" , overflow:"auto"}}>
      <Line options={chartOptions} data={chartData} />
    </div>
  );
}
