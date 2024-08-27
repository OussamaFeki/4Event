import React, { useEffect, useState } from 'react';
import { Modal, Button, Spinner, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { getContractForMeAndEvent } from '../../services/providerServices';

const EventInfo = ({ show, onHide, event, token }) => {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && event && event._id) {
      const fetchContract = async () => {
        try {
          const contractData = await getContractForMeAndEvent(token, event._id);
          setContract(contractData);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      fetchContract();
    }
  }, [show, event, token]);

  const renderContractDetails = () => {
    if (loading) {
      return <Spinner animation="border" />;
    }

    if (error) {
      return <div>Error loading contract details</div>;
    }

    if (!contract) {
      return <div>No contract details available</div>;
    }

    return (
      <>
        <h5>Contract Details</h5>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Price</th>
              <th>Terms</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${contract.price}</td>
              <td>{contract.terms}</td>
              <td>{new Date(contract.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
              <td>{new Date(contract.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
            </tr>
          </tbody>
        </Table>
      </>
    );
  };

  if (!event) return null; // Return null if no event is provided

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{event.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Event Details</h5>
        <p><strong>Name:</strong> {event.name}</p>
        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        <p><strong>Start Time:</strong> {event.startTime}</p>
        <p><strong>End Time:</strong> {event.endTime}</p>
        <p><strong>Location:</strong> {event.location || 'N/A'}</p>
        
        <h5>Organizer Information</h5>
        {event.organizer ? (
          <p><strong>Organizer:</strong> {event.organizer}</p>
        ) : (
          <p>No organizer information available.</p>
        )}

        {renderContractDetails()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

EventInfo.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    location: PropTypes.string,
    organizer: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  token: PropTypes.string.isRequired,
};

export default EventInfo;
