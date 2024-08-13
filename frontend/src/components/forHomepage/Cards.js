import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/Container';

function Cards() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const cardsPerPage = 3;
  const totalCards = 9; // Assuming we have 9 cards in total

  // Generate an array of card data
  const cardData = Array.from({ length: totalCards }, (_, index) => ({
    id: index + 1,
    title: `Card ${index + 1}`,
    text: `This is the content for card ${index + 1}. This is a longer card with supporting text below as a natural lead-in to additional content.`
  }));

  // Filter cards based on search term
  const filteredCards = cardData.filter(card => 
    card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the cards to display on the current page
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center mb-4">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Search cards..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </Col>
      </Row>
      <Row xs={1} md={3} className="g-4">
        {currentCards.map((card) => (
          <Col key={card.id}>
            <Card>
              <Card.Img variant="top" src={`https://picsum.photos/id/${card.id}/300/200`} />
              <Card.Body>
                <Card.Title>{card.title}</Card.Title>
                <Card.Text>{card.text}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Pagination className="mt-4 justify-content-center">
        {Array.from({ length: Math.ceil(filteredCards.length / cardsPerPage) }).map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </Container>
  );
}

export default Cards;