import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarChart = ({mount}) => {
    const chartContainer = useRef(null);
    const chartInstance = useRef(null);

    // Function to generate month labels
    const generateMonthLabels = (count) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        return Array.from({ length: count }, (_, i) => {
            return months[(currentMonth - i + 12) % 12];
        }).reverse();
    };

    const labels = generateMonthLabels(7);
    const data = {
        labels: labels,
        datasets: [{
            label: 'My First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
            ],
            borderWidth: 1
        }]
    };

    useEffect(() => {
        if (chartContainer && chartContainer.current) {
            const ctx = chartContainer.current.getContext('2d');
            
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            chartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                },
            });
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    return (
        <div style={{ width: '100%', maxWidth: '800px', height: '200px' }}>
            <h2>Bar Chart</h2>
            <div style={{ position: 'relative', height: '100%', width: '100%',minWidth:'500px',minHeight:'150px' }}>
                <canvas ref={chartContainer} />
            </div>
        </div>
    );
};

export default BarChart;