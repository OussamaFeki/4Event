import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import './Login.css'; // Import custom CSS for additional styling
import { Google } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../guard/AuthContext';
import { signup, login as loginService } from '../services/auth'; // Import the signup and login functions from auth.js

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirm, setConfirm] = useState('');
    const [role, setRole] = useState(''); // Define a state for role
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirm) {
            setError('Passwords do not match');
            return;
        }
        try {
            await signup(name, email, password, role);
            const response = await loginService(email, password);
            login(response.token);
            navigate('/createProfile');
        } catch(error) {
          console.error('Signup error:', error);
          setError(error.message);
        }
        // Handle signup logic here
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Role:', role);
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100 mt-4">
            <div className="login-container">
                <h2 className="login-header">Sign Up</h2>
                <p className="text-center">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicName">
                        <Form.Label className="form-label">Full Name</Form.Label>
                        <Form.Control
                            type="text" // Corrected type to 'text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
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
                    <Form.Group controlId="formBasicConfirm" className="mt-3">
                        <Form.Label className="form-label">Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicRole" className="mt-3">
                        <Form.Select aria-label="Default select example" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option>Choose your role</option>
                            <option value='provider'>Provider</option>
                            <option value='organizer'>Organiser</option>
                        </Form.Select>
                    </Form.Group>

                    {error && <div style={{ color: 'red' }}>{error}</div>}

                    <Button variant="primary" type="submit" className="mt-3 login-button">
                        Sign Up
                    </Button>
                </Form>

                <div className="separator">or</div>

                <Button variant="light" className="google-button mt-3">
                    <Google /> Sign up with Google
                </Button>
            </div>
        </Container>
    );
};

export default Signup;
