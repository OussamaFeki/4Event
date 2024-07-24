import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const NumericChart = ({ data }) => {
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      const ctx = chartContainer.current.getContext('2d');

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const percentage = data.percentage;
      console.log(percentage)
      const dataValue = [percentage, 100 - percentage];

      const centerText = {
        id: 'centerText',
        afterDraw: (chart) => {
          const { width, height, ctx } = chart;
          ctx.restore();
          const fontSize = (height / 114).toFixed(2);
          ctx.font = `${fontSize}em sans-serif`;
          ctx.textBaseline = 'middle';
          const text = `${percentage.toFixed(0)}%`;
          const textX = Math.round((width - ctx.measureText(text).width) / 2);
          const textY = height / 2;
          ctx.fillText(text, textX, textY + 40);
          ctx.save();
        },
      };

      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: [`${percentage.toFixed(0)}%`, ''],
          datasets: [
            {
              label: '',
              data: dataValue,
              backgroundColor: ['#70E49B', '#E5E5E5'],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
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
          circumference: 180,
          rotation: -90,
          cutout: '80%',
        },
        plugins: [centerText],
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data.percentage]);

  return (
    <div style={{ maxWidth: '300px' }}>
      <p>Pourcentage of the event in your availability this week</p>
      <canvas ref={chartContainer} width="100" height="100" />
    </div>
  );
};

export default NumericChart;
