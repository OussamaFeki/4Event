import React, { useEffect, useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { getContractForMeAndEvent } from '../../services/providerServices';

const ContractModal = ({ show, handleClose, token, eventId }) => {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(token,eventId);
  useEffect(() => {
    if (show && eventId) {
      const fetchContract = async () => {
        try {
          const contractData = await getContractForMeAndEvent(token, eventId);
          setContract(contractData);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      fetchContract();
    }
  }, [show, eventId, token]);

  const renderContent = () => {
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
      <div>
        <h4>Contract Details</h4>
        <p><strong>Terms:</strong> {contract.terms}</p>
        <p><strong>Price:</strong> ${contract.price}</p>
        <p><strong>Created At:</strong> {new Date(contract.createdAt).toLocaleDateString()}</p>
        <p><strong>Updated At:</strong> {new Date(contract.updatedAt).toLocaleDateString()}</p>
      </div>
    );
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Contract Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {renderContent()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ContractModal;
