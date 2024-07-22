import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

const Setting = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [avatar, setAvatar] = useState(null);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Logic for updating profile
    console.log('Profile Updated', { userName, userEmail });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    // Logic for changing password
    console.log('Password Changed', { oldPassword, userPassword });
  };

  const handleChangeAvatar = (e) => {
    e.preventDefault();
    // Logic for changing avatar
    console.log('Avatar Changed', avatar);
  };

  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Change Password</Accordion.Header>
        <Accordion.Body>
          <Form onSubmit={handleChangePassword}>
            <Form.Group controlId="formOldPassword">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter your old password"
              />
            </Form.Group>
            <Form.Group controlId="formNewPassword" className="mt-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                placeholder="Enter your new password"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Change Password
            </Button>
          </Form>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Update Profile</Accordion.Header>
        <Accordion.Body>
          <Form onSubmit={handleProfileUpdate}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Update Profile
            </Button>
          </Form>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>Change Avatar</Accordion.Header>
        <Accordion.Body>
          <Form onSubmit={handleChangeAvatar}>
            <Form.Group controlId="formAvatar">
              <Form.Label>Upload Avatar</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setAvatar(e.target.files[0])}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Change Avatar
            </Button>
          </Form>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default Setting;
