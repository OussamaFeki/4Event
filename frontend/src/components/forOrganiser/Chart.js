import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // import chart.js

const DoughnutChart = () => {
  const chartContainer = useRef(null);
  const chartInstance = useRef(null); // to store the chart instance

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      // Chart.js setup
      const ctx = chartContainer.current.getContext('2d');
      
      // Ensure previous instance is destroyed before creating a new one
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Events', 'Pause', 'invalid'],
          datasets: [
            {
              label: 'My First Dataset',
              data: [300, 50, 100],
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',

              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
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
              right: 10
            }
          }
        },
      });
    }

    // Cleanup function to destroy the chart instance
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div style={{ maxWidth: '300px' }}>
      <h2>Doughnut Chart</h2>
      <canvas ref={chartContainer} width="100" height="100" />
    </div>
  );
};

export default DoughnutChart;
