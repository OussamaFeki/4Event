import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { getAllUsers } from '../../services/clientServices';
import ClientModal from './ClientModal'; // Make sure to import the ClientModal component

function Cards() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('name');
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const cardsPerPage = 3;

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUsers(data);
      console.log(data);
    };
    fetchUsers();
  }, []);

  // Filter users based on the search term and filter type
  const filteredUsers = users.filter(user => {
    if (filterType === 'name') {
      return user.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (filterType === 'email') {
      return user.email.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (filterType === 'address') {
      return user.profile.address.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  });

  // Pagination logic
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredUsers.slice(indexOfFirstCard, indexOfLastCard);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
    setCurrentPage(1); // Reset to the first page on filter change
  };

  const handleOpenModal = (userId) => {
    setSelectedUserId(userId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUserId(null);
  };

  return (
    <Container fluid className="px-3 px-md-5 mt-3">
      {/* Search Bar and Filter */}
      <Row className="justify-content-center mb-4">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Form.Select
              value={filterType}
              onChange={handleFilterTypeChange}
              style={{ maxWidth: '150px' }}
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="address">Address</option>
            </Form.Select>
          </InputGroup>
        </Col>
      </Row>
      {/* Cards Display */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {currentCards.length > 0 ? (
          currentCards.map((user) => (
            <Col key={user._id}>
              <Card>
                <Card.Img variant="top" src={user.avatar || `https://via.placeholder.com/300x200?text=${user.name}`} />
                <Card.Body>
                  <Card.Title>{user.name}</Card.Title>
                  <Card.Text>{user.email}</Card.Text>
                  <Card.Text>
                    <small className="text-muted">Address: {user.profile.address}</small>
                  </Card.Text>
                  <Card.Text>
                    <small className="text-muted">Phone: {user.profile.phoneNumber}</small>
                  </Card.Text>
                  <Button variant="primary" onClick={() => handleOpenModal(user._id)}>
                    Send Message
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p>No users found.</p>
          </Col>
        )}
      </Row>
      {/* Pagination */}
      <Row className="mt-4">
        <Col className="d-flex justify-content-center">
          <Pagination>
            {Array.from({ length: Math.ceil(filteredUsers.length / cardsPerPage) }).map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Col>
      </Row>
      
      {/* Client Modal */}
      <ClientModal
        show={showModal}
        onHide={handleCloseModal}
        userId={selectedUserId}
      />
    </Container>
  );
}

export default Cards;