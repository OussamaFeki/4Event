import React, { useState, useEffect } from 'react';
import { Container, Alert, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import { Calendar } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { getProviders } from '../../services/organiserServices';

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await getProviders();
        setProviders(data);
      } catch (err) {
        setError('Failed to fetch providers');
      }
    };
    fetchProviders();
  }, []);

  const handleBookClick = (provider) => {
    navigate('/organizer/provider-calendar', { state: { provider } });
  };

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container>
      <h1 className="my-4">Providers</h1>
      {providers.length === 0 ? (
        <Alert variant="info">No providers available.</Alert>
      ) : (
        <Row className="g-4">
          {providers.map((provider) => (
            <Col xs={12} key={provider._id}>
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <Card.Title>{provider.name || 'Unnamed Provider'}</Card.Title>
                      <Card.Text>
                        <strong>Email:</strong> {provider.email}<br />
                        <strong>Price:</strong> ${provider.price}
                      </Card.Text>
                    </div>
                    <Button variant="outline-primary" onClick={() => handleBookClick(provider)}>
                      <Calendar size={20} /> Book
                    </Button>
                  </div>
                  <Card.Subtitle className="mb-2 mt-3">Services</Card.Subtitle>
                  <ListGroup variant="flush">
                    {provider.services?.map((service, index) => (
                      <ListGroup.Item key={index}>{service.name}</ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Providers;