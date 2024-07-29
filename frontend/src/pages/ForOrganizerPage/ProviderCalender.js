import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Calendar from '../../components/forOrganiser/Calendar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProviderData } from '../../redux/actions/providerAction';

const ProviderCalendar = ({ userId }) => {
  const location = useLocation();
  const { provider1 } = location.state || {};
  return (
    <div>
      <h2>Provider Calendar for {provider1.name}</h2>
      <Calendar 
        forOrganiser={true}
        userId={userId}
        providerId={provider1._id}
      />
    </div>
  );
};

export default ProviderCalendar;
