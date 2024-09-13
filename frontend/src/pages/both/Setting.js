import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getProfile, updateProfile } from '../../services/auth';
import { updateUserAvatar } from '../../redux/actions/userAction'; 
const Setting = () => {
  const [userPassword, setUserPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState('');
  const [activeKey, setActiveKey] = useState('0');

  const dispatch = useDispatch();
  
  // Accessing the user state from Redux to reflect any updates
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (activeKey === '1') { // Check if the Update Profile section is opened
        try {
          const profileData = await getProfile();
          if (profileData.profile) {
            setAddress(profileData.profile.address || '');
            setPhoneNumber(profileData.profile.phoneNumber || '');
            setBio(profileData.profile.bio || '');
          }
        } catch (error) {
          console.error('Failed to fetch profile data:', error.message);
        }
      }
    };

    fetchProfileData();
  }, [activeKey]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(address, phoneNumber, bio);
      console.log('Profile Updated', { address, phoneNumber, bio });
    } catch (error) {
      console.error('Update profile failed:', error.message);
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    // Logic for changing password
    console.log('Password Changed', { oldPassword, userPassword });
  };

  const handleChangeAvatar = async (e) => {
    e.preventDefault();
    if (avatar) {
      // Dispatch the updateUserAvatar action
      dispatch(updateUserAvatar(avatar));
      console.log('Avatar changed via Redux', avatar);
    } else {
      console.log('No avatar selected');
    }
  };

  return (
    <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
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
            <Form.Group controlId="formAddress" className="mt-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
              />
            </Form.Group>
            <Form.Group controlId="formPhoneNumber" className="mt-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
              />
            </Form.Group>
            <Form.Group controlId="formBio" className="mt-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Enter your bio"
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
