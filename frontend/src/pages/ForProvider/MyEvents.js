import React, { useEffect, useState } from 'react';
import { getProviderData } from '../../services/providerServices';
import Calendar from '../../components/forProvider/Calender'
const MyEvents = () => {
  const [data, setData] = useState({ availabilities: [], events: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const token = localStorage.getItem('token'); // Adjust this according to how you store the token
        const providerData = await getProviderData(token);

        // Map dayOfWeek to uppercase as per the DayOfWeek enum
        const correctedAvailabilities = providerData.availabilities.map((availability) => ({
          ...availability,
          dayOfWeek: availability.dayOfWeek.toUpperCase(),
        }));

        setData({ ...providerData, availabilities: correctedAvailabilities });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProviderData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <Calendar events={data.events} availability={data.availabilities} />
    </div>
  );
};

export default MyEvents;