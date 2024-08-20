import React, { useEffect, useState } from 'react';
import { Table, Button, Alert, Modal } from 'react-bootstrap';
import { CheckCircle, XCircle, InfoCircle } from 'react-bootstrap-icons';
import { acceptEvent, getRequests, refuseEvent } from '../../services/providerServices';
import ContractModal from '../../components/forProvider/ContractModal';


const Requests = () => {
  const [currentRequests, setCurrentRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null); // State to hold the selected request
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [showContractModal, setShowContractModal] = useState(false); // State to control ContractModal visibility
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requests = await getRequests(token);
        console.log(requests);
        setCurrentRequests(requests);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [token]);

  const handleAccept = async (eventId) => {
    try {
      await acceptEvent(token, eventId);
      const acceptedEvent = currentRequests.find(request => request._id === eventId);

      const updatedRequests = currentRequests.filter(request => {
        if (request._id === eventId) {
          return false;
        }

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
      await refuseEvent(token, eventId);
      setCurrentRequests(currentRequests.filter(request => request._id !== eventId));
    } catch (error) {
      console.error('Error refusing event:', error);
    }
  };

  const handleMoreInfo = (request) => {
    setSelectedRequest(request);
    setShowContractModal(true); // Show ContractModal instead of RequestModal
  };

  const handleCloseModal = () => {
    setShowContractModal(false);
    setSelectedRequest(null);
  };

  if (currentRequests.length === 0) {
    return <Alert variant="info">There are no requests right now.</Alert>;
  }

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Location</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Budget</th>
            <th>Organizer Name</th>
            <th>Organizer Email</th>
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
              <td>{request.organizer?.name || 'N/A'}</td>
              <td>{request.organizer?.email || 'N/A'}</td>
              <td>
                <Button variant="success" style={{ marginRight: '10px' }} onClick={() => handleAccept(request._id)}>
                  <CheckCircle /> Accept
                </Button>
                <Button variant="danger" style={{ marginRight: '10px' }} onClick={() => handleRefuse(request._id)}>
                  <XCircle /> Refuse
                </Button>
                <Button variant="info" onClick={() => handleMoreInfo(request)}>
                  <InfoCircle /> More Info
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Display ContractModal */}
      {selectedRequest && (
        <ContractModal
          show={showContractModal}
          handleClose={handleCloseModal}
          token={token}
          eventId={selectedRequest._id} // Pass the eventId to the ContractModal
        />
      )}
    </>
  );
};

export default Requests;
