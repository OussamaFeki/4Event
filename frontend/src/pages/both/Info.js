import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import 'bootstrap/dist/css/bootstrap.min.css';

const Info = () => {
  return (
    <div className="d-flex flex-wrap justify-content-around">
      {/* Profile Card */}
      <Card style={{ width: '18rem' }} className="mb-4">
        <Card.Body className="text-center">
          <Image
            src="https://via.placeholder.com/150"
            roundedCircle
            style={{ width: '100px', height: '100px' }}
          />
          <Card.Title className="mt-3">My Profile</Card.Title>
          <Card.Text>
            Sami Rahman <br />
            Last login: 07 Aug 2018, 14:54 <br />
            WorkSpace ID: 12481047 New York (US)
          </Card.Text>
          <ListGroup variant="flush">
            <ListGroup.Item>+1- 585-596-929-1236</ListGroup.Item>
            <ListGroup.Item>Sami.rahman007@gmail.com</ListGroup.Item>
          </ListGroup>
          <Form.Check 
            type="switch"
            id="sms-alerts"
            label="SMS alerts activation"
            className="mt-3"
          />
          <Button variant="warning" className="mt-2">Save</Button>
        </Card.Body>
      </Card>

      {/* xPay Accounts Card */}
      <Card style={{ width: '18rem' }} className="mb-4">
        <Card.Body>
          <Card.Title>My xPay accounts</Card.Title>
          <Card.Text>Active account</Card.Text>
          <Button variant="danger" className="mb-2">Block Account</Button>
          <Card.Text>Blocked account</Card.Text>
          <Button variant="success">Unblock Account</Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Info;
