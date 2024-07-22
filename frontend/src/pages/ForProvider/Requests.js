import React, { useState } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { CheckCircle, XCircle, InfoCircle } from 'react-bootstrap-icons';
import { acceptEvent, refuseEvent } from '../../services/providerServices';

const Requests = ({ requests }) => {
  const [currentRequests, setCurrentRequests] = useState(requests);

  const handleAccept = async (eventId) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      await acceptEvent(token, eventId);
      setCurrentRequests(currentRequests.filter(request => request._id !== eventId));
    } catch (error) {
      console.error('Error accepting event:', error);
    }
  };

  const handleRefuse = async (eventId) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      await refuseEvent(token, eventId);
      setCurrentRequests(currentRequests.filter(request => request._id !== eventId));
    } catch (error) {
      console.error('Error refusing event:', error);
    }
  };

  if (currentRequests.length === 0) {
    return <Alert variant="info">There are no requests right now.</Alert>;
  }

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Event Name</th>
          <th>Location</th>
          <th>Date</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Budget</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {currentRequests.map((request, index) => (
          <tr key={index}>
            <td>{request.name}</td>
            <td>{request.location || 'N/A'}</td>
            <td>{new Date(request.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
            <td>{request.startTime}</td>
            <td>{request.endTime}</td>
            <td>{request.payment ? request.payment.amount : 'N/A'}</td>
            <td>
              <Button variant="success" style={{ marginRight: '10px' }} onClick={() => handleAccept(request._id)}>
                <CheckCircle /> Accept
              </Button>
              <Button variant="danger" style={{ marginRight: '10px' }} onClick={() => handleRefuse(request._id)}>
                <XCircle /> Refuse
              </Button>
              <Button variant="info">
                <InfoCircle /> More Info
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default Requests;
