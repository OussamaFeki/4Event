import React, { useEffect, useState } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { CheckCircle, XCircle, InfoCircle } from 'react-bootstrap-icons';
import { acceptEvent, getRequests, refuseEvent } from '../../services/providerServices';

const Requests = () => {
  const [currentRequests, setCurrentRequests] = useState([]);
  useEffect(()=>{
    const fetchData=async ()=>{
      try{
        const token = localStorage.getItem('token');
      const requests = await getRequests(token);
      setCurrentRequests(requests);
      }catch(err){
        console.log(err)
      }
      
    }
     fetchData();
  },[])
  const handleAccept = async (eventId) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
  
      // Accept the event
      await acceptEvent(token, eventId);
  
      // Retrieve the details of the accepted event
      const acceptedEvent = currentRequests.find(request => request._id === eventId);
  
      // Filter out overlapping requests from currentRequests
      const updatedRequests = currentRequests.filter(request => {
        if (request._id === eventId) {
          return false;
        }
  
        // Check if the request overlaps with the accepted event on the same date
        if (request.date === acceptedEvent.date) {
          return !(
            (request.startTime >= acceptedEvent.startTime && request.startTime < acceptedEvent.endTime) ||
            (request.endTime > acceptedEvent.startTime && request.endTime <= acceptedEvent.endTime) ||
            (request.startTime <= acceptedEvent.startTime && request.endTime >= acceptedEvent.endTime)
          );
        }
  
        return true;
      });
  
      setCurrentRequests(updatedRequests);
  
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
