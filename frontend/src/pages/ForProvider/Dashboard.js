import React, { useEffect, useState } from 'react';
import { Person, CalendarEvent, CurrencyDollar } from 'react-bootstrap-icons';
import DoughnutChart from '../../components/forProvider/Chart';
import CardStatic from '../../components/CardStatic'; // Import CardStatic component
import './Dashboard.css'; // Import CSS for Dashboard styling
import NumericChart from '../../components/Numericchart';
import BarChart from '../../components/BarChart';
import { getAvailabilitypercentage, getProviderStats, getMonthlyBudgetSum } from '../../services/providerServices';

const Dashboard = () => {
  const [data, setData] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState();
  const [monthlyBudget, setMonthlyBudget] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const percentage = await getAvailabilitypercentage(token);
        setData(percentage);
        const datastate = await getProviderStats(token);
        setStats(datastate);
        const budgetData = await getMonthlyBudgetSum(token);
        setMonthlyBudget(budgetData.monthlyBudgetSum);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get current date and format it
  const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="cards-container">
        <CardStatic 
          color="green" 
          data={`${stats.totalPrices}`} 
          title="Budget" 
          icon={<CurrencyDollar />} 
        />
        <CardStatic 
          color="red" 
          data={stats.totalEvents} 
          title="Total Events" 
          icon={<CalendarEvent />} 
        />
        <CardStatic 
          color="blue" 
          data={stats.totalUsers} 
          title="Clients" 
          icon={<Person />} 
        />
        <CardStatic 
          color="orange" 
          data={currentDate} 
          title="Date" 
        />
      </div>
      <div className="section">
        <div className="barchart-container">
          <BarChart data={monthlyBudget} />
        </div>
        <div className="chart-container">
          <NumericChart data={data} />
        </div>
        <div className="chart-container">
          <DoughnutChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
