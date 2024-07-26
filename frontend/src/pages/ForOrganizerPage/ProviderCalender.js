import React from 'react';
import { useLocation } from 'react-router-dom';
import Calendar from '../../components/forOrganiser/Calendar';


const ProviderCalendar = ({userId}) => {
  const location = useLocation();
  console.log(location)
  const { provider } = location.state || {};
  const availability=provider.availabilities;
  console.log("Received provider :",provider);
  console.log('user Id =',userId)
  if (!provider) {
    return <div>No provider data available.</div>;
  }

  return (
    <div>
      <h2>Provider Calendar for {provider.name}</h2>
      <Calendar 
        forOrganiser={true}
        events={provider.events || []}
        availability={availability || []}
        requests={provider.requests || []}
        userId={userId}
      />
    </div>
  );
};

export default ProviderCalendar;
