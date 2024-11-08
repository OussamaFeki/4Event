import React, { useState, useEffect } from 'react';
import { Container, Alert, Row, Col, Card, ListGroup, Button, Image, Form, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { Calendar } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { getProviders } from '../../services/organiserServices';
import Pagination from 'react-bootstrap/Pagination';

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('Name');
  const providersPerPage = 3;
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
    navigate('/organizer/provider-calendar', { state: { provider1: provider } });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when the search term changes
  };

  const handleFilterChange = (filterBy) => {
    setSearchFilter(filterBy);
    setCurrentPage(1); // Reset to the first page when the search filter changes
  };

  const filteredProviders = providers.filter((provider) => {
    if (searchFilter === 'Name') {
      return provider.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchFilter === 'Email') {
      return provider.email.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchFilter === 'Service') {
      return provider.services.some((service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return provider;
  });

  const indexOfLastProvider = currentPage * providersPerPage;
  const indexOfFirstProvider = indexOfLastProvider - providersPerPage;
  const currentProviders = filteredProviders.slice(indexOfFirstProvider, indexOfLastProvider);

  const totalPages = Math.ceil(filteredProviders.length / providersPerPage);

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container>
      <h1 className="my-4">Providers</h1>
      <InputGroup className="mb-3">
        <DropdownButton
          as={InputGroup.Prepend}
          variant="outline-secondary"
          title={`Search by ${searchFilter}`}
          id="input-group-dropdown-1"
          onSelect={handleFilterChange}
          style={{ width: '120px' }}
        >
          <Dropdown.Item eventKey="Name">Name</Dropdown.Item>
          <Dropdown.Item eventKey="Email">Email</Dropdown.Item>
          <Dropdown.Item eventKey="Service">Service</Dropdown.Item>
        </DropdownButton>
        <Form.Control
          type="text"
          placeholder={`Search by ${searchFilter}`}
          value={searchTerm}
          onChange={handleSearchChange}
          className="me-2"
        />
      </InputGroup>
      {filteredProviders.length === 0 ? (
        <Alert variant="info">No providers available.</Alert>
      ) : (
        <>
          <Row className="g-4">
            {currentProviders.map((provider) => (
              <Col xs={12} key={provider._id}>
                <Card>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex align-items-center">
                        <Image
                          src={provider.avatar || 'https://via.placeholder.com/100'}
                          roundedCircle
                          width={100}
                          height={100}
                          className="me-3"
                        />
                        <div>
                          <Card.Title>{provider.name || 'Unnamed Provider'}</Card.Title>
                          <Card.Text>
                            <strong>Email:</strong> {provider.email}<br />
                          </Card.Text>
                        </div>
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
          <Pagination className="mt-4">
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}
    </Container>
  );
};

export default Providers;