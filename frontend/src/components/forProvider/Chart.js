import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto'; // import chart.js
import { getDoughnuts } from '../../services/providerServices';

const DoughnutChart = () => {
  const chartContainer = useRef(null);
  const chartInstance = useRef(null); // to store the chart instance
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await getDoughnuts(token);
        console.log(data)
        setChartData({
          labels: ['Events', 'Pause', 'Availability'],
          datasets: [
            {
              label: 'Availability Rate',
              data: [data.eventTime, data.pauseTime, data.availableTime], // Adjust according to your data structure
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching doughnut chart data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartContainer && chartContainer.current && chartData.datasets.length > 0) {
      // Chart.js setup
      const ctx = chartContainer.current.getContext('2d');
      
      // Ensure previous instance is destroyed before creating a new one
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return tooltipItem.label + ': ' + tooltipItem.raw;
                },
              },
            },
          },
          layout: {
            padding: {
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
            },
          },
        },
      });
    }

    // Cleanup function to destroy the chart instance
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <div style={{ maxWidth: '300px' }}>
      <h2>Doughnut Chart</h2>
      <canvas ref={chartContainer} width="100" height="100" />
    </div>
  );
};

export default DoughnutChart;
