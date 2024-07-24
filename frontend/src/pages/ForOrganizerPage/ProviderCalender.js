import React from 'react';
import Calendar from '../../components/forProvider/Calender';
import { useLocation } from 'react-router-dom';

const ProviderCalender = () => {
  const location = useLocation();
  const { events, availability, request, providerId } = location.state || {};
  console.log(events)
  return (
    <div>
      <h2>Provider Calendar</h2>
      <Calendar 
        events={events} 
        availability={availability} 
        request={request} 
        forOrganiser={true}
      />
    </div>
  );
};

export default ProviderCalender;