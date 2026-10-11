import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Tabs, Tab } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: 'customer'
  });
  
  const [validated, setValidated] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [activeTab, setActiveTab] = useState('customer');
  
  const { register, isAuthenticated, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    
    // Clear any previous errors
    clearError();
  }, [isAuthenticated, navigate, clearError]);
  
  const { fullName, email, password, confirmPassword, phone, address } = formData;
  
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Check password match when either password field changes
    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      if (e.target.name === 'password') {
        setPasswordMatch(e.target.value === confirmPassword);
      } else {
        setPasswordMatch(e.target.value === password);
      }
    }
  };
  
  const handleTabChange = (key) => {
    setActiveTab(key);
    setFormData({...formData, role: key});
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false || !passwordMatch) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setValidated(true);
    
    if (password !== confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    
    await register(formData);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Create an Account</h2>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Tabs
                activeKey={activeTab}
                onSelect={handleTabChange}
                id="register-tabs"
                className="mb-4"
              >
                <Tab eventKey="customer" title="Customer">
                  <p className="text-muted">Register as a customer to order food from providers</p>
                </Tab>
                <Tab eventKey="provider" title="Food Provider">
                  <p className="text-muted">Register as a food provider to sell your food items</p>
                </Tab>
              </Tabs>
              
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="fullName">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your full name"
                        name="fullName"
                        value={fullName}
                        onChange={onChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Full name is required.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid email.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                        minLength="6"
                        isInvalid={validated && (!password || password.length < 6 || !passwordMatch)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {!passwordMatch ? 'Passwords do not match.' : 'Password must be at least 6 characters.'}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="confirmPassword">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirm your password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={onChange}
                        required
                        minLength="6"
                        isInvalid={validated && (!confirmPassword || !passwordMatch)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {!passwordMatch ? 'Passwords do not match.' : 'Please confirm your password.'}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="phone">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="Enter your phone number"
                        name="phone"
                        value={phone}
                        onChange={onChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Phone number is required.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3" controlId="address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter your address"
                    name="address"
                    value={address}
                    onChange={onChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Address is required.
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Button variant="primary" type="submit" className="w-100 mt-3">
                  Register
                </Button>
              </Form>
              
              <div className="mt-3 text-center">
                <p>
                  Already have an account? <Link to="/login">Login here</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register; 