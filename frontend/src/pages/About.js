import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <Container fluid>
        {/* Vision Section */}
        <section className="vision-section">
          <Row className="align-items-center">
            <Col lg={7} className="mb-4 mb-lg-0">
              <div className="vision-image">
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Our Vision"
                  className="img-fluid"
                />
              </div>
            </Col>
            <Col lg={5}>
              <div className="vision-content">
                <i className="fas fa-eye vision-icon"></i>
                <h2>Our Vision</h2>
                <p>To become the most trusted and loved food delivery service, bringing the warmth of home-cooked meals to every doorstep.</p>
                <div className="vision-points">
                  <div className="vision-point">
                    <i className="fas fa-heart"></i>
                    <span>Quality Food</span>
                  </div>
                  <div className="vision-point">
                    <i className="fas fa-clock"></i>
                    <span>Timely Delivery</span>
                  </div>
                  <div className="vision-point">
                    <i className="fas fa-smile"></i>
                    <span>Customer Satisfaction</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <i className="fas fa-bullseye mission-icon"></i>
          <h2>Our Mission</h2>
          <p className="mission-statement">
            To provide fresh, nutritious, and delicious home-cooked meals to busy individuals, helping them maintain a healthy lifestyle without compromising on taste or quality.
          </p>
          <Row className="mission-cards">
            <Col md={4} className="mb-4">
              <Card className="mission-card">
                <Card.Body>
                  <i className="fas fa-leaf"></i>
                  <h3>Fresh Ingredients</h3>
                  <p>We use only the freshest ingredients to prepare your meals daily.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="mission-card">
                <Card.Body>
                  <i className="fas fa-truck"></i>
                  <h3>On-Time Delivery</h3>
                  <p>Your meals reach you fresh and hot, right when you need them.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="mission-card">
                <Card.Body>
                  <i className="fas fa-shield-alt"></i>
                  <h3>Hygienic Preparation</h3>
                  <p>We maintain the highest standards of hygiene in food preparation.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        {/* Services Section */}
        <section className="services-section">
          <i className="fas fa-concierge-bell services-icon"></i>
          <h2>Our Services</h2>
          <Row>
            <Col md={6} className="mb-4">
              <div className="service-card">
                <i className="fas fa-calendar-check"></i>
                <h3>Daily Meal Plans</h3>
                <p>Subscribe to our daily meal plans and enjoy fresh meals every day.</p>
              </div>
            </Col>
            <Col md={6} className="mb-4">
              <div className="service-card">
                <i className="fas fa-utensils"></i>
                <h3>Customized Meals</h3>
                <p>Choose your favorite dishes and create your own meal plan.</p>
              </div>
            </Col>
            <Col md={6} className="mb-4">
              <div className="service-card">
                <i className="fas fa-building"></i>
                <h3>Office Delivery</h3>
                <p>Get your meals delivered to your workplace at your preferred time.</p>
              </div>
            </Col>
            <Col md={6} className="mb-4">
              <div className="service-card">
                <i className="fas fa-gift"></i>
                <h3>Special Occasions</h3>
                <p>Order special meals for parties, meetings, or family gatherings.</p>
              </div>
            </Col>
          </Row>
        </section>

        {/* Customer Reviews Section */}
        <section className="reviews-section">
          <i className="fas fa-comments reviews-icon"></i>
          <h2>What Our Customers Say</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="review-card">
                <Card.Body>
                  <div className="review-rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <p className="review-text">"The food is always fresh and delicious. It's like having home-cooked meals every day!"</p>
                  <div className="reviewer">
                    <img src="https://randomuser.me/api/portraits/women/1.jpg" alt="Customer" />
                    <div>
                      <h4>Priya Sharma</h4>
                      <p>Regular Customer</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="review-card">
                <Card.Body>
                  <div className="review-rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <p className="review-text">"Perfect for my busy schedule. The delivery is always on time and the food is amazing!"</p>
                  <div className="reviewer">
                    <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Customer" />
                    <div>
                      <h4>Rahul Patel</h4>
                      <p>Office Worker</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="review-card">
                <Card.Body>
                  <div className="review-rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <p className="review-text">"As a student, this service has been a lifesaver. Great food at affordable prices!"</p>
                  <div className="reviewer">
                    <img src="https://randomuser.me/api/portraits/women/2.jpg" alt="Customer" />
                    <div>
                      <h4>Ananya Singh</h4>
                      <p>Student</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
};

export default About; 