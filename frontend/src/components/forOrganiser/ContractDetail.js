import React, { useState, useEffect } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { getContractForProviderAndEvent } from '../../services/organiserServices';

const ContractDetail = ({ show, onHide, eventId, providerId }) => {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
        const contractData = await getContractForProviderAndEvent(token, providerId, eventId);
        setContract(contractData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch contract details');
        setLoading(false);
      }
    };

    if (show && eventId && providerId) {
      fetchContract();
    }
  }, [show, eventId, providerId]);

  if (!show) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Contract Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <p>Loading contract details...</p>}
        {error && <p className="text-danger">{error}</p>}
        {contract && (
          <Table striped bordered hover>
            <tbody>
              <tr>
                <th>Event</th>
                <td>{contract.event.name}</td>
              </tr>
              <tr>
                <th>Provider</th>
                <td>{contract.provider.name}</td>
              </tr>
              <tr>
                <th>Terms</th>
                <td>{contract.terms}</td>
              </tr>
              <tr>
                <th>Price</th>
                <td>${contract.price}</td>
              </tr>
              <tr>
                <th>Created At</th>
                <td>{new Date(contract.createdAt).toLocaleString()}</td>
              </tr>
              <tr>
                <th>Updated At</th>
                <td>{new Date(contract.updatedAt).toLocaleString()}</td>
              </tr>
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ContractDetail;