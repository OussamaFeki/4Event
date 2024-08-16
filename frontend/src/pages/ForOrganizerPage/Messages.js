import React, { useEffect, useState } from 'react';
import { Card, Container, Form, Pagination, InputGroup, DropdownButton, Dropdown, Button, Row, Col } from 'react-bootstrap';
import { getMessages } from '../../services/organiserServices';
import SendModal from '../../components/forOrganiser/SendModal';


const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage] = useState(5);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedClientEmail, setSelectedClientEmail] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem('token');
      try {
        const data = await getMessages(token);
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();
  }, []);

  const filteredMessages = messages.filter((message) =>
    message.sender[searchBy].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);

  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleOpenSendModal = (userId, email) => {
    setSelectedUserId(userId);
    setSelectedClientEmail(email);
    setShowSendModal(true);
  };

  const handleCloseSendModal = () => {
    setShowSendModal(false);
    setSelectedUserId(null);
    setSelectedClientEmail('');
  };

  const handleSendMessage = (userId, clientEmail, message) => {
    // Implement the logic to send the message
    console.log(`Sending message to user ${userId} (${clientEmail}): ${message}`);
    // You might want to call an API or service function here
  };

  const handleSendSMS = (phoneNumber) => {
    window.location.href = `sms:${phoneNumber}`;
  };

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
            <Row>
              <Col md={8}>
                <Card.Title>{message.sender.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  <strong>Email:</strong> {message.sender.email}
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">
                  <strong>Phone Number:</strong> {message.sender.phone}
                </Card.Subtitle>
                <Card.Text>
                  <strong>Message:</strong> {message.content}
                </Card.Text>
              </Col>
              <Col md={4} className="text-right">
                <Button 
                  variant="primary" 
                  className="mr-2" 
                  onClick={() => handleOpenSendModal(message.sender.id, message.sender.email)}
                >
                  Send Email
                </Button>
                <Button variant="secondary" onClick={() => handleSendSMS(message.sender.phone)}>
                  Send SMS
                </Button>
              </Col>
            </Row>
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

      <SendModal
        show={showSendModal}
        onHide={handleCloseSendModal}
        userId={selectedUserId}
        clientEmail={selectedClientEmail}
        onSendMessage={handleSendMessage}
      />
    </Container>
  );
};

export default Messages;