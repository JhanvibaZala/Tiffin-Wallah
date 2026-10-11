import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Tabs, Tab, Badge, ListGroup, Form, Modal, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getFoodItemsByProvider, createFoodItem, updateFoodItem, deleteFoodItem, getMyOrders, updateOrderStatus, updatePaymentStatus, getOrderById } from '../api';
import { AuthContext } from '../utils/AuthContext';
import { formatIndianRupee } from '../utils/currencyFormatter';

const ProviderDashboard = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Form state for food item
  const [foodForm, setFoodForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'lunch',
    isVegetarian: false,
    isAvailable: true,
    image: 'no-photo.jpg' // Default image
  });
  
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Load food items and orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (user?._id) {
          // Get provider's food items
          const foodResponse = await getFoodItemsByProvider(user._id);
          setFoodItems(foodResponse.data.data);
          
          // Get provider's orders
          const orderResponse = await getMyOrders();
          setOrders(orderResponse.data.data);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role === 'provider') {
      fetchData();
    } else if (isAuthenticated && user?.role === 'customer') {
      navigate('/dashboard/customer');
    }
  }, [isAuthenticated, navigate, user]);
  
  // Reset form and success/error messages
  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };
  
  // Open food item modal
  const openAddFoodModal = () => {
    setFoodForm({
      name: '',
      description: '',
      price: '',
      category: 'lunch',
      isVegetarian: false,
      isAvailable: true,
      image: 'no-photo.jpg'
    });
    setIsEditMode(false);
    setShowFoodModal(true);
    resetMessages();
  };
  
  // Open edit food item modal
  const openEditFoodModal = (foodItem) => {
    setFoodForm({
      name: foodItem.name,
      description: foodItem.description,
      price: foodItem.price,
      category: foodItem.category,
      isVegetarian: foodItem.isVegetarian,
      isAvailable: foodItem.isAvailable,
      image: foodItem.image || 'no-photo.jpg'
    });
    setSelectedFoodItem(foodItem);
    setIsEditMode(true);
    setShowFoodModal(true);
    resetMessages();
  };
  
  // Handle food form input change
  const handleFoodFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFoodForm({
      ...foodForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle food form submit
  const handleFoodFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      resetMessages();
      
      // Prepare form data
      const formData = {
        ...foodForm,
        price: parseFloat(foodForm.price)
      };
      
      let response;
      
      if (isEditMode) {
        // Update existing food item
        response = await updateFoodItem(selectedFoodItem._id, formData);
        
        // Update food items list
        setFoodItems(foodItems.map(item => 
          item._id === selectedFoodItem._id ? response.data.data : item
        ));
        
        setSuccess('Food item updated successfully');
      } else {
        // Create new food item
        response = await createFoodItem(formData);
        
        // Add to food items list
        setFoodItems([...foodItems, response.data.data]);
        
        setSuccess('Food item added successfully');
      }
      
      setLoading(false);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowFoodModal(false);
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Failed to save food item');
    }
  };
  
  // Delete food item
  const handleDeleteFoodItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await deleteFoodItem(id);
        
        // Remove from food items list
        setFoodItems(foodItems.filter(item => item._id !== id));
        
        setSuccess('Food item deleted successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } catch (err) {
        setError('Failed to delete food item');
      }
    }
  };
  
  // View order details
  const viewOrderDetails = async (orderId) => {
    try {
      const response = await getOrderById(orderId);
      setSelectedOrder(response.data.data);
      setShowOrderModal(true);
      resetMessages();
    } catch (err) {
      setError('Failed to load order details');
    }
  };
  
  // Update order status
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, { status });
      
      // Update orders list
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status } : order
      ));
      
      // Update selected order if modal is open
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
      
      setSuccess(`Order status updated to ${status}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError('Failed to update order status');
    }
  };
  
  // Update payment status
  const handleUpdatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      await updatePaymentStatus(orderId, { paymentStatus });
      
      // Update orders list
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, paymentStatus } : order
      ));
      
      // Update selected order if modal is open
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, paymentStatus });
      }
      
      setSuccess(`Payment status updated to ${paymentStatus}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError('Failed to update payment status');
    }
  };
  
  // Get order status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'preparing':
        return 'primary';
      case 'out for delivery':
        return 'secondary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'light';
    }
  };

  return (
    <Container>
      <h1 className="mb-4">Provider Dashboard</h1>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" className="mb-4">
          {success}
        </Alert>
      )}
      
      <Tabs defaultActiveKey="menu" id="dashboard-tabs" className="mb-4">
        {/* Food Menu Tab */}
        <Tab eventKey="menu" title="My Menu">
          <div className="d-flex justify-content-end mb-4">
            <Button 
              variant="primary"
              onClick={openAddFoodModal}
            >
              Add New Food Item
            </Button>
          </div>
          
          {loading ? (
            <p className="text-center">Loading food items...</p>
          ) : foodItems.length > 0 ? (
            <Row>
              {foodItems.map((item) => (
                <Col md={4} className="mb-4" key={item._id}>
                  <Card className="h-100 shadow-sm">
                    <Card.Img 
                      variant="top" 
                      src={item.image === 'no-photo.jpg' 
                        ? `https://source.unsplash.com/300x200/?food,${item.name}` 
                        : item.image
                      }
                      style={{ height: '180px', objectFit: 'cover' }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Card.Title className="mb-0">{item.name}</Card.Title>
                        <Badge bg={item.isVegetarian ? 'success' : 'danger'}>
                          {item.isVegetarian ? 'Veg' : 'Non-Veg'}
                        </Badge>
                      </div>
                      
                      <Badge 
                        bg={item.isAvailable ? 'success' : 'secondary'}
                        className="mb-2 align-self-start"
                      >
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </Badge>
                      
                      <Card.Text className="text-muted small mb-2">
                        Category: {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </Card.Text>
                      
                      <Card.Text className="mb-3">
                        {item.description.substring(0, 100)}
                        {item.description.length > 100 ? '...' : ''}
                      </Card.Text>
                      
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <span className="fs-5">{formatIndianRupee(item.price)}</span>
                        <div>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            className="me-2"
                            onClick={() => openEditFoodModal(item)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDeleteFoodItem(item._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center">
              <p>You don't have any food items yet.</p>
              <Button 
                variant="primary"
                onClick={openAddFoodModal}
              >
                Add Your First Food Item
              </Button>
            </div>
          )}
        </Tab>
        
        {/* Orders Tab */}
        <Tab eventKey="orders" title="Orders">
          {loading ? (
            <p className="text-center">Loading orders...</p>
          ) : orders.length > 0 ? (
            <ListGroup>
              {orders.map((order) => (
                <ListGroup.Item key={order._id} className="mb-3 shadow-sm">
                  <Row className="align-items-center">
                    <Col md={3}>
                      <p className="mb-1">
                        <strong>Order ID:</strong><br />
                        <small>{order._id}</small>
                      </p>
                      <p className="mb-0">
                        <strong>Date:</strong><br />
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </Col>
                    <Col md={3}>
                      <p className="mb-1">
                        <strong>Customer:</strong><br />
                        {order.customer?.fullName || 'Unknown Customer'}
                      </p>
                      <p className="mb-0">
                        <strong>Items:</strong> {order.items.length}
                      </p>
                    </Col>
                    <Col md={2}>
                      <p className="mb-1">
                        <strong>Total:</strong><br />
                        {formatIndianRupee(order.totalAmount)}
                      </p>
                      <Form.Select 
                        size="sm"
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        className="mb-2"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="out for delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </Form.Select>
                    </Col>
                    <Col md={2}>
                      <Form.Select 
                        size="sm"
                        value={order.paymentStatus}
                        onChange={(e) => handleUpdatePaymentStatus(order._id, e.target.value)}
                      >
                        <option value="pending">Payment Pending</option>
                        <option value="completed">Payment Completed</option>
                      </Form.Select>
                    </Col>
                    <Col md={2} className="text-end">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => viewOrderDetails(order._id)}
                      >
                        View Details
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p className="text-center">You don't have any orders yet.</p>
          )}
        </Tab>
      </Tabs>
      
      {/* Food Item Modal */}
      <Modal
        show={showFoodModal}
        onHide={() => setShowFoodModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? 'Edit Food Item' : 'Add New Food Item'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success" className="mb-4">
              {success}
            </Alert>
          )}
          
          <Form onSubmit={handleFoodFormSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Food Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={foodForm.name}
                    onChange={handleFoodFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="price">
                  <Form.Label>Price (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0.01"
                    step="0.01"
                    name="price"
                    value={foodForm.price}
                    onChange={handleFoodFormChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={foodForm.description}
                onChange={handleFoodFormChange}
                required
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={foodForm.category}
                    onChange={handleFoodFormChange}
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snacks">Snacks</option>
                    <option value="dessert">Dessert</option>
                    <option value="beverage">Beverage</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <div className="mt-4">
                  <Form.Check
                    type="checkbox"
                    id="isVegetarian"
                    name="isVegetarian"
                    label="Vegetarian"
                    checked={foodForm.isVegetarian}
                    onChange={handleFoodFormChange}
                    className="mb-2"
                  />
                  
                  <Form.Check
                    type="checkbox"
                    id="isAvailable"
                    name="isAvailable"
                    label="Available for Order"
                    checked={foodForm.isAvailable}
                    onChange={handleFoodFormChange}
                  />
                </div>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                name="image"
                value={foodForm.image}
                onChange={handleFoodFormChange}
                placeholder="Enter image URL or leave as default"
              />
              <Form.Text className="text-muted">
                Enter a URL to an image. If left empty, a default image will be used.
              </Form.Text>
              
              {/* Add image preview */}
              <div className="mt-2">
                <p className="mb-1">Image Preview:</p>
                <img 
                  src={foodForm.image === 'no-photo.jpg' 
                    ? `https://source.unsplash.com/300x200/?food,${foodForm.name}` 
                    : foodForm.image
                  } 
                  alt="Food preview" 
                  style={{ 
                    width: '100%', 
                    maxHeight: '200px', 
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://source.unsplash.com/300x200/?food`;
                  }}
                />
              </div>
            </Form.Group>
            
            <div className="d-flex justify-content-end mt-4">
              <Button 
                variant="secondary" 
                onClick={() => setShowFoodModal(false)}
                className="me-2"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Saving...' : (isEditMode ? 'Update Food Item' : 'Add Food Item')}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      
      {/* Order Details Modal */}
      <Modal 
        show={showOrderModal} 
        onHide={() => setShowOrderModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                  <p><strong>Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <Badge bg={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status.toUpperCase()}
                    </Badge>
                  </p>
                </Col>
                <Col md={6}>
                  <p><strong>Customer:</strong> {selectedOrder.customer?.fullName}</p>
                  <p><strong>Delivery Address:</strong> {selectedOrder.deliveryAddress}</p>
                  <p>
                    <strong>Payment:</strong>{' '}
                    <Badge bg={selectedOrder.paymentStatus === 'completed' ? 'success' : 'warning'}>
                      {selectedOrder.paymentStatus.toUpperCase()}
                    </Badge>{' '}
                    ({selectedOrder.paymentMethod.toUpperCase()})
                  </p>
                </Col>
              </Row>
              
              <h5>Order Items</h5>
              <ListGroup className="mb-3">
                {selectedOrder.items.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={6}>
                        {item.foodItem.name}
                      </Col>
                      <Col md={2} className="text-center">
                        {formatIndianRupee(item.price)}
                      </Col>
                      <Col md={2} className="text-center">
                        x{item.quantity}
                      </Col>
                      <Col md={2} className="text-end">
                        {formatIndianRupee(item.price * item.quantity)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              
              <div className="text-end">
                <p><strong>Total Amount: {formatIndianRupee(selectedOrder.totalAmount)}</strong></p>
              </div>
              
              {selectedOrder.notes && (
                <>
                  <h5>Notes</h5>
                  <p>{selectedOrder.notes}</p>
                </>
              )}
              
              <hr />
              
              <h5>Update Order</h5>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Order Status</Form.Label>
                    <Form.Select
                      value={selectedOrder.status}
                      onChange={(e) => handleUpdateOrderStatus(selectedOrder._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="out for delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Payment Status</Form.Label>
                    <Form.Select
                      value={selectedOrder.paymentStatus}
                      onChange={(e) => handleUpdatePaymentStatus(selectedOrder._id, e.target.value)}
                    >
                      <option value="pending">Payment Pending</option>
                      <option value="completed">Payment Completed</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProviderDashboard; 