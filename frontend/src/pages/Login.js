// Login.js
import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Google } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { hasProfile, login as loginService } from '../services/auth'; // Import the login function from auth.js
import { useAuth } from '../guard/AuthContext'; // Import the useAuth hook from AuthContext.js
import './Login.css'; // Import custom CSS for additional styling
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await loginService(email, password);
      const decodedToken = jwtDecode(response.token);
      login(response.token);

      if (decodedToken.providerId) {
        // If the user is a provider
        if (await hasProfile()) {
          navigate('/provider'); // Navigate to the provider's main interface
        } else {
          navigate('/createProfile'); // Navigate to create profile
        }
      } else if (decodedToken.userId) {
        // If the user is a regular user
        navigate('/organizer'); // Navigate to the user's main interface
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    }
  };
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="login-container">
        <h2 className="login-header">LogIn</h2>
        <p className="text-center">
          Don't have an account? <a href="/signup">Sign up now</a>
        </p>
        {error && <p className="text-danger text-center">{error}</p>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label className="form-label">Email address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className="mt-3">
            <Form.Label className="form-label">Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <p className="text-end">
            <a href="/forgot-password">Forgot password?</a>
          </p>

          <Button variant="primary" type="submit" className="mt-3 login-button">
            Sign In
          </Button>
        </Form>

        <div className="separator">or</div>

        <Button variant="light" className="google-button">
          <Google /> Sign in with Google
        </Button>
      </div>
    </Container>
  );
};

export default Login;
