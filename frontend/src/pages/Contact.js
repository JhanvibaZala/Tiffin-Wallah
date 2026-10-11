import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [validated, setValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { name, email, message } = formData;
  
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setValidated(true);
    
    // In a real app, this would be an API call to send the message
    console.log('Form submitted:', formData);
    
    // Show success message and reset form
    setShowSuccess(true);
    setFormData({
      name: '',
      email: '',
      message: ''
    });
    setValidated(false);
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  return (
    <Container>
      <Row>
        <Col lg={8} className="mx-auto">
          <div className="text-center mb-5">
            <h1 className="display-4 mb-3">Contact Us</h1>
            <p className="lead">We'd love to hear from you</p>
          </div>
          
          {showSuccess && (
            <Alert variant="success" className="mb-4">
              Thank you for your message! We'll get back to you soon.
            </Alert>
          )}
          
          <Row>
            <Col md={5} className="mb-4 mb-md-0">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <h4 className="mb-4">Get In Touch</h4>
                  
                  <div className="mb-4">
                    <h5 className="mb-2">Email</h5>
                    <p className="mb-0">
                      <a href="mailto:info@tiffinwallah.com" className="text-decoration-none">
                        info@tiffinwallah.com
                      </a>
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="mb-2">Phone</h5>
                    <p className="mb-0">
                      <a href="tel:+11234567890" className="text-decoration-none">
                        +1 (123) 456-7890
                      </a>
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="mb-2">Address</h5>
                    <p className="mb-0">
                      Besides Kathiyawadi Point, Khau Gali, 150ft, Ring Rd<br />
                      Bhavnagar, Gujarat 364002<br />
                
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={7}>
              <Card className="shadow-sm">
                <Card.Body>
                  <h4 className="mb-4">Send a Message</h4>
                  
                  <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="name">
                      <Form.Label>Your Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your name"
                        name="name"
                        value={name}
                        onChange={onChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide your name.
                      </Form.Control.Feedback>
                    </Form.Group>
                    
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
                    
                    <Form.Group className="mb-3" controlId="message">
                      <Form.Label>Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder="What would you like to tell us?"
                        name="message"
                        value={message}
                        onChange={onChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a message.
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Button variant="primary" type="submit">
                      Send Message
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <div className="mt-5">
            <h4 className="text-center mb-4">Find Us</h4>
            <div className="embed-responsive embed-responsive-16by9 rounded overflow-hidden shadow-sm">
              <iframe
                title="Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.9999999999995!2d72.12345678901234!3d21.76543210987654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395f5a0c0e0e0e0e%3A0x0!2sBhavnagar%2C%20Gujarat%2C%20India!5e0!3m2!1sen!2sin!4v1600784962382!5m2!1sen!2sin"
                width="100%"
                height="450"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen=""
                aria-hidden="false"
                tabIndex="0"
              ></iframe>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact; 