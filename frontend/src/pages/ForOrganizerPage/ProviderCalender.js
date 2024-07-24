import React from 'react';
import { useLocation } from 'react-router-dom';
import Calendar from '../../components/forProvider/Calender';

const ProviderCalendar = () => {
  const location = useLocation();
  console.log(location)
  const { provider } = location.state || {};

  console.log("Received provider data:",provider);

  if (!provider) {
    return <div>No provider data available.</div>;
  }

  return (
    <div>
      <h2>Provider Calendar for {provider.name}</h2>
      <Calendar 
        forOrganiser={true}
        events={provider.events || []}
        availability={provider.availabilities|| []}
        request={provider.requests}
      />
    </div>
  );
};

export default ProviderCalendar;
