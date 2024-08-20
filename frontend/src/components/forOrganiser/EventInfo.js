import React, { useState, useEffect } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import ContractDetail from './ContractDetail';
import ContractUpdateModal from './ContractUpdateModal';
import { getNotApprovedContracts, updateContract } from '../../services/organiserServices';

const handleShowContractModal = (setSelectedProviderId, setShowContractModal) => {
  return (providerId) => {
    setSelectedProviderId(providerId);
    setShowContractModal(true);
  };
};

const EventInfo = ({ show, onHide, event }) => {
  const [showContractModal, setShowContractModal] = useState(false);
  const [showContractUpdateModal, setShowContractUpdateModal] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
  const [notApprovedContracts, setNotApprovedContracts] = useState([]);

  const handleShowContractModalCallback = handleShowContractModal(
    setSelectedProviderId,
    setShowContractModal
  );

  const handleShowContractUpdateModal = (contract) => {
    setSelectedContract(contract);
    setShowContractUpdateModal(true);
  };

  const handleContractUpdate = async (updatedContract) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Update the contract on the server
      const response = await updateContract(token, selectedContract._id, updatedContract);

      // Update the local state to reflect the changes
      setNotApprovedContracts((prevContracts) =>
        prevContracts.map((contract) =>
          contract._id === selectedContract._id ? { ...contract, ...response } : contract
        )
      );

      // Close the update modal
      setShowContractUpdateModal(false);
    } catch (error) {
      console.error('Failed to update contract:', error);
    }
  };

  useEffect(() => {
    const fetchNotApprovedContracts = async () => {
      if (event && event._id) {
        const token = localStorage.getItem('token');
        try {
          const contracts = await getNotApprovedContracts(token, event._id);
          setNotApprovedContracts(contracts);
        } catch (error) {
          if (error.response && error.response.data) {
            console.error('Error fetching not approved contracts:', error.response.data.message);
          } else {
            console.error('Error fetching not approved contracts:', error.message);
          }
        }
      }
    };

    fetchNotApprovedContracts();
  }, [event]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Event Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Event Details</h5>
          <p><strong>Name:</strong> {event.name}</p>
          <p><strong>Location:</strong> {event.location || 'N/A'}</p>
          <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          <p><strong>Start Time:</strong> {event.startTime}</p>
          <p><strong>End Time:</strong> {event.endTime}</p>

          <h5>Requests</h5>
          {event.requests && event.requests.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Provider Name</th>
                  <th>Provider Email</th>
                </tr>
              </thead>
              <tbody>
                {event.requests.map((request, index) => (
                  <tr key={request._id}>
                    <td>{index + 1}</td>
                    <td>{request.name}</td>
                    <td>{request.email}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No requests available for this event.</p>
          )}

          <h5>Providers</h5>
          {event.providers && event.providers.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Provider Name</th>
                  <th>Provider Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {event.providers.map((provider, index) => (
                  <tr key={provider._id}>
                    <td>{index + 1}</td>
                    <td>{provider.name}</td>
                    <td>{provider.email}</td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleShowContractModalCallback(provider._id)}
                      >
                        See Contract
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No providers available for this event.</p>
          )}

          <h5>Contracts</h5>
          {notApprovedContracts && notApprovedContracts.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Price</th>
                  <th>Terms</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {notApprovedContracts.map((contract, index) => (
                  <tr key={contract._id}>
                    <td>{index + 1}</td>
                    <td>{contract.price}</td>
                    <td>{contract.terms}</td>
                    <td>
                      {new Date(contract.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleShowContractUpdateModal(contract)}
                      >
                        Update
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No contracts available for this event.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <ContractDetail
        show={showContractModal}
        onHide={() => setShowContractModal(false)}
        eventId={event._id}
        providerId={selectedProviderId}
      />

      <ContractUpdateModal
        show={showContractUpdateModal}
        onHide={() => setShowContractUpdateModal(false)}
        contract={selectedContract}
        onUpdate={handleContractUpdate}
      />
    </>
  );
};

export default EventInfo;
