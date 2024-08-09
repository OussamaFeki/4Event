import React from 'react';
import { useLocation } from 'react-router-dom';
import Calendar from '../../components/forOrganiser/Calendar';

const ProviderCalendar = ({ userId }) => {
  const location = useLocation();
  const { provider1 } = location.state || {};
  return (
    <div>
      <h2>Provider Calendar for {provider1.name}</h2>
      <Calendar 
        userId={userId}
        providerId={provider1._id}
      />
    </div>
  );
};

export default ProviderCalendar;
