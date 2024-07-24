import React, { useEffect, useState } from 'react';
import { Modal, Table, Button } from 'react-bootstrap';
import { getAvailableProvidersForEvent } from '../../services/organiserServices';
import ConfirmationModal from '../ConfirmationModal'; // Adjust the import path as necessary

const ProviderModal = ({ show, handleClose, eventId, token }) => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const availableProviders = await getAvailableProvidersForEvent(token, eventId);
        setProviders(availableProviders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (show) {
      fetchProviders();
    }
  }, [show, eventId, token]);

  const handleOpenConfirmationModal = (providerId) => {
    setSelectedProviderId(providerId);
    setShowConfirmationModal(true);
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setSelectedProviderId(null);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Available Providers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : providers.length === 0 ? (
            <p>No providers available for this event.</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {providers.map(provider => (
                  <tr key={provider._id}>
                    <td>{provider.name}</td>
                    <td>{provider.email}</td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => handleOpenConfirmationModal(provider._id)}
                      >
                        Send Request
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <ConfirmationModal
        show={showConfirmationModal}
        handleClose={handleCloseConfirmationModal}
        token={token}
        eventId={eventId}
        providerId={selectedProviderId}
      />
    </>
  );
};

export default ProviderModal;
