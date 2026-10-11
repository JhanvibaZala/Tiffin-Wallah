import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api';
import { AuthContext } from '../utils/AuthContext';
import { formatIndianRupee } from '../utils/currencyFormatter';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Load cart items from localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
    
    // Set default address from user profile
    if (user && user.address) {
      setAddress(user.address);
    }
  }, [isAuthenticated, navigate, user]);
  
  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 50 : 0; // Changed from $5 to ₹50
  const total = subtotal + deliveryFee;
  
  // Update quantity
  const updateQuantity = (index, qty) => {
    const updatedItems = [...cartItems];
    if (qty > 0) {
      updatedItems[index].quantity = qty;
    }
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };
  
  // Remove item from cart
  const removeItem = (index) => {
    const updatedItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };
  
  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };
  
  // Submit order
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Group items by provider
      const providerItems = {};
      
      cartItems.forEach(item => {
        // Make sure we have a valid provider ID
        const providerId = item.provider?._id || item.provider;
        
        if (!providerId) {
          throw new Error('Invalid provider information');
        }
        
        if (!providerItems[providerId]) {
          providerItems[providerId] = [];
        }
        
        providerItems[providerId].push({
          foodItem: item._id,
          quantity: item.quantity,
          price: item.price
        });
      });
      
      // Create an order for each provider
      for (const providerId in providerItems) {
        await createOrder({
          provider: providerId, // This should be a string ID
          items: providerItems[providerId],
          deliveryAddress: address,
          paymentMethod,
          notes
        });
      }
      
      setSuccess(true);
      clearCart();
      setLoading(false);
      
      // Redirect to customer dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard/customer');
      }, 3000);
    } catch (err) {
      setLoading(false);
      console.error('Order error:', err);
      setError(err.response?.data?.error || 'Failed to place order');
    }
  };

  return (
    <Container>
      <h1 className="mb-4">Your Cart</h1>
      
      {success && (
        <Alert variant="success" className="mb-4">
          Your order has been placed successfully! Redirecting to your dashboard...
        </Alert>
      )}
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      <Row>
        <Col md={8}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h2 className="h5 mb-4">Cart Items ({cartItems.length})</h2>
              
              {cartItems.length === 0 ? (
                <p>Your cart is empty. Add some delicious food!</p>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map((item, index) => (
                    <ListGroup.Item key={index} className="py-3">
                      <Row className="align-items-center">
                        <Col md={2}>
                          <img
                            src={item.image === 'no-photo.jpg' 
                              ? `https://source.unsplash.com/100x100/?food,${item.name}` 
                              : item.image
                            }
                            alt={item.name}
                            className="img-fluid rounded"
                            style={{ height: '60px', width: '60px', objectFit: 'cover' }}
                          />
                        </Col>
                        <Col md={4}>
                          <h5 className="mb-0">{item.name}</h5>
                          <small className="text-muted">{item.providerName}</small>
                        </Col>
                        <Col md={2} className="text-center">
                          {formatIndianRupee(item.price)}
                        </Col>
                        <Col md={2}>
                          <Form.Control
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                            className="text-center"
                          />
                        </Col>
                        <Col md={1} className="text-end">
                          {formatIndianRupee(item.price * item.quantity)}
                        </Col>
                        <Col md={1} className="text-center">
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
              
              {cartItems.length > 0 && (
                <div className="d-flex justify-content-end mt-3">
                  <Button variant="outline-secondary" onClick={clearCart}>
                    Clear Cart
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="h5 mb-4">Order Summary</h2>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>{formatIndianRupee(subtotal)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery Fee:</span>
                <span>{formatIndianRupee(deliveryFee)}</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-4">
                <strong>Total:</strong>
                <strong>{formatIndianRupee(total)}</strong>
              </div>
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="deliveryAddress">
                  <Form.Label>Delivery Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="paymentMethod">
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="cash">Cash on Delivery</option>
                    <option value="online">Online Payment</option>
                    <option value="upi">UPI Payment</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="notes">
                  <Form.Label>Order Notes (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Any special instructions"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </Form.Group>
                
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={cartItems.length === 0 || loading}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart; 