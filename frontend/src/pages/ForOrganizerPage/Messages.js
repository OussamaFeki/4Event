import React, { useEffect, useState } from 'react';
import { Card, Container, Form, Pagination, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { getMessages } from '../../services/organiserServices';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name'); // Default search by name
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage] = useState(5); // Number of messages per page

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages();
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();
  }, []);

  // Filter messages based on search term and selected filter
  const filteredMessages = messages.filter((message) =>
    message.sender[searchBy].toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);

  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container>
      <InputGroup className="mb-3">
        <DropdownButton
          as={InputGroup.Prepend}
          variant="outline-secondary"
          title={`Search by ${searchBy}`}
          id="input-group-dropdown-1"
        >
          <Dropdown.Item onClick={() => setSearchBy('name')}>Name</Dropdown.Item>
          <Dropdown.Item onClick={() => setSearchBy('email')}>Email</Dropdown.Item>
        </DropdownButton>
        <Form.Control
          placeholder={`Search by ${searchBy}`}
          onChange={handleSearch}
          value={searchTerm}
        />
      </InputGroup>

      {currentMessages.map((message, index) => (
        <Card key={index} className="mb-3" style={{ width: '100%' }}>
          <Card.Body>
            <Card.Title>{message.sender.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{message.sender.email}</Card.Subtitle>
            <Card.Text>{message.content}</Card.Text>
          </Card.Body>
        </Card>
      ))}

      <Pagination>
        {[...Array(totalPages).keys()].map(number => (
          <Pagination.Item
            key={number + 1}
            active={number + 1 === currentPage}
            onClick={() => handlePageChange(number + 1)}
          >
            {number + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </Container>
  );
};

export default Messages;
