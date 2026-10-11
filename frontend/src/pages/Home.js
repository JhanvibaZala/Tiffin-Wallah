import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Carousel, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAllFoodItems } from '../api';
import { formatIndianRupee } from '../utils/currencyFormatter';
import { motion } from 'framer-motion';
import { FaUtensils, FaTruck, FaLeaf, FaStar, FaQuoteLeft } from 'react-icons/fa';
import { MdDeliveryDining, MdFoodBank } from 'react-icons/md';
import './Home.css';

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const response = await getAllFoodItems();
        // Get first 6 items as featured items
        setFeaturedItems(response.data.data.slice(0, 6));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured items:', error);
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribed with email:', email);
    setEmail('');
  };

  return (
    <Container fluid className="px-0">
      {/* Hero Section */}
      <section className="position-relative mb-5">
        <div className="hero-overlay"></div>
        <Carousel controls={false} indicators={false} interval={5000}>
          <Carousel.Item>
            <div 
              className="hero-image" 
              style={{ 
                backgroundImage: 'url("/images/top-view-circular-food-frame.jpg")',
                height: '80vh',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="hero-content text-white text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="display-3 fw-bold mb-4">Welcome to Tiffin Wallah</h1>
                  <p className="lead mb-4">Experience the taste of home-cooked meals delivered to your doorstep</p>
                  <Link to="/register" className="btn btn-primary btn-lg px-5 py-3">
                    Get Started
                  </Link>
                </motion.div>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>
      </section>

      {/* Value Proposition */}
      <section className="py-5 mb-5">
        <Container>
          <h2 className="text-center mb-5 display-4 fw-bold">Why Choose Tiffin Wallah?</h2>
          <Row className="g-4">
            <Col md={4}>
              <motion.div 
                className="value-card p-4 text-center rounded-4 shadow-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="icon-wrapper mb-4">
                  <MdFoodBank size={50} className="text-primary" />
                </div>
                <h4 className="fw-bold">Home Cooked Food</h4>
                <p className="text-muted">Enjoy authentic home-cooked meals prepared by local chefs with love and care.</p>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div 
                className="value-card p-4 text-center rounded-4 shadow-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="icon-wrapper mb-4">
                  <MdDeliveryDining size={50} className="text-primary" />
                </div>
                <h4 className="fw-bold">Fast Delivery</h4>
                <p className="text-muted">Get your food delivered quickly and safely right to your doorstep.</p>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div 
                className="value-card p-4 text-center rounded-4 shadow-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="icon-wrapper mb-4">
                  <FaLeaf size={50} className="text-primary" />
                </div>
                <h4 className="fw-bold">Fresh Ingredients</h4>
                <p className="text-muted">All meals are prepared using fresh, high-quality ingredients daily.</p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Items */}
      <section className="py-5 mb-5 bg-light">
        <Container>
          <h2 className="text-center mb-5 display-4 fw-bold">Featured Food Items</h2>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : featuredItems.length > 0 ? (
            <Row className="g-4">
              {featuredItems.map((item) => (
                <Col md={4} key={item._id}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="h-100 border-0 shadow-sm">
                      <div className="position-relative">
                        <Card.Img 
                          variant="top" 
                          src={item.image === 'no-photo.jpg' 
                            ? `https://source.unsplash.com/300x200/?food,${item.name}` 
                            : item.image
                          } 
                          style={{ height: '250px', objectFit: 'cover' }}
                        />
                        <div className="position-absolute top-0 end-0 m-3">
                          <Button variant="light" className="rounded-circle">
                            <FaStar className="text-warning" />
                          </Button>
                        </div>
                      </div>
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="fw-bold">{item.name}</Card.Title>
                        <Card.Text className="text-muted">{item.description.substring(0, 100)}...</Card.Text>
                        <div className="mt-auto d-flex justify-content-between align-items-center">
                          <span className="fs-4 fw-bold text-primary">{formatIndianRupee(item.price)}</span>
                          <Button variant="primary" className="rounded-pill px-4">
                            View Details
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          ) : (
            <p className="text-center">No featured items available at the moment.</p>
          )}
          <div className="text-center mt-5">
            <Link to="/menu" className="btn btn-primary btn-lg px-5">
              View All Food Items
            </Link>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-5 mb-5">
        <Container>
          <h2 className="text-center mb-5 display-4 fw-bold">What Our Customers Say</h2>
          <Row className="g-4">
            {[1, 2, 3].map((testimonial) => (
              <Col md={4} key={testimonial}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <FaQuoteLeft className="text-primary me-2" size={24} />
                      <div className="ms-2">
                        <h5 className="mb-1">Amazing Service!</h5>
                        <div className="text-warning">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted">
                      "The food quality is exceptional, and the delivery is always on time. I love the variety of options available!"
                    </p>
                    <div className="d-flex align-items-center mt-3">
                      <img
                        src={`https://i.pravatar.cc/150?img=${testimonial}`}
                        alt="Customer"
                        className="rounded-circle me-3"
                        width="50"
                        height="50"
                      />
                      <div>
                        <h6 className="mb-0">Customer {testimonial}</h6>
                        <small className="text-muted">Regular Customer</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Newsletter */}
      <section className="py-5 mb-5 bg-primary text-white">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <h2 className="display-4 fw-bold mb-4">Stay Updated</h2>
              <p className="lead mb-4">Subscribe to our newsletter for the latest updates and special offers</p>
              <Form onSubmit={handleSubscribe} className="d-flex gap-2 justify-content-center">
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-pill px-4 py-3"
                  style={{ maxWidth: '400px' }}
                />
                <Button type="submit" variant="light" className="rounded-pill px-4">
                  Subscribe
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-5 mb-5 bg-primary text-white">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h2 className="display-4 fw-bold mb-4">Ready to Experience Delicious Home-Cooked Food?</h2>
              <p className="lead mb-5">Join Tiffin Wallah today and enjoy quality meals delivered to your doorstep.</p>
              <div className="d-flex gap-3 justify-content-center">
                <Link to="/register" className="btn btn-light btn-lg px-5 py-3">
                  Sign Up Now
                </Link>
                <Link to="/about" className="btn btn-outline-light btn-lg px-5 py-3">
                  Learn More
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Container>
  );
};

export default Home; 