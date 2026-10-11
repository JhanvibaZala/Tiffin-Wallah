import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Tabs, Tab, Badge, ListGroup, Form, Modal, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getAllFoodItems, getMyOrders, getOrderById } from '../api';
import { AuthContext } from '../utils/AuthContext';
import { formatIndianRupee } from '../utils/currencyFormatter';

const CustomerDashboard = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Load food items and orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get all food items
        const foodResponse = await getAllFoodItems();
        
        // Ensure provider data is properly formatted
        const formattedFoodItems = foodResponse.data.data.map(item => ({
          ...item,
          provider: item.provider || { fullName: 'Unknown Provider' }
        }));
        
        setFoodItems(formattedFoodItems);
        
        // Get customer orders
        const orderResponse = await getMyOrders();
        setOrders(orderResponse.data.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role === 'customer') {
      fetchData();
    } else if (isAuthenticated && user?.role === 'provider') {
      navigate('/dashboard/provider');
    }
  }, [isAuthenticated, navigate, user]);

  // View order details
  const viewOrderDetails = async (orderId) => {
    try {
      const response = await getOrderById(orderId);
      setSelectedOrder(response.data.data);
      setShowModal(true);
    } catch (err) {
      setError('Failed to load order details');
    }
  };

  // Add to cart
  const addToCart = (foodItem) => {
    // Get existing cart items from localStorage
    const existingItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Check if item already exists in cart
    const existingItemIndex = existingItems.findIndex(item => item._id === foodItem._id);
    
    if (existingItemIndex >= 0) {
      // Increment quantity if item exists
      existingItems[existingItemIndex].quantity += 1;
    } else {
      // Add new item with quantity 1, with proper provider information
      existingItems.push({
        ...foodItem,
        quantity: 1,
        // Store both provider ID and name
        provider: foodItem.provider?._id || foodItem.provider,
        providerName: foodItem.provider?.fullName || 'Unknown Provider'
      });
    }
    
    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(existingItems));
    
    // Navigate to cart
    navigate('/cart');
  };

  // Filter food items
  const filteredFoodItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

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
      <h1 className="mb-4">Customer Dashboard</h1>
       {error && (
      <Alert
        variant="danger"
        dismissible
        onClose={() => setError(null)}
      >
        {error}
      </Alert>
    )}
      <Tabs defaultActiveKey="menu" id="dashboard-tabs" className="mb-4">
        {/* Food Menu Tab */}
        <Tab eventKey="menu" title="Food Menu">
          <Row className="mb-4">
            <Col md={8}>
              <Form.Control
                type="text"
                placeholder="Search for food items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snacks">Snacks</option>
                <option value="dessert">Dessert</option>
                <option value="beverage">Beverage</option>
              </Form.Select>
            </Col>
          </Row>
          
          {loading ? (
            <p className="text-center">Loading food items...</p>
          ) : filteredFoodItems.length > 0 ? (
            <Row>
              {filteredFoodItems.map((item) => (
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
                      
                      <Card.Text className="text-muted small mb-2">
                        Provider: {item.provider?.fullName || 'Unknown Provider'}
                      </Card.Text>
                      
                      <Card.Text className="mb-3">
                        {item.description.substring(0, 100)}
                        {item.description.length > 100 ? '...' : ''}
                      </Card.Text>
                      
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <span className="fs-5">{formatIndianRupee(item.price)}</span>
                        <Button 
                          variant="primary" 
                          disabled={!item.isAvailable}
                          onClick={() => addToCart(item)}
                        >
                          {item.isAvailable ? 'Add to Cart' : 'Unavailable'}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <p className="text-center">No food items found matching your criteria.</p>
          )}
        </Tab>
        
        {/* Orders Tab */}
        <Tab eventKey="orders" title="My Orders">
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
                        <strong>Provider:</strong><br />
                        {order.provider?.fullName || 'Unknown Provider'}
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
                      <Badge bg={getStatusColor(order.status)}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </Col>
                    <Col md={2}>
                      <Badge bg={order.paymentStatus === 'completed' ? 'success' : 'warning'}>
                        {order.paymentStatus.toUpperCase()}
                      </Badge>
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
            <p className="text-center">You haven't placed any orders yet.</p>
          )}
        </Tab>
      </Tabs>
      
      {/* Order Details Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
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
                  <p><strong>Provider:</strong> {selectedOrder.provider?.fullName || 'Unknown Provider'}</p>
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
              
              {selectedOrder.deliveryTime && (
                <p>
                  <strong>Delivered at:</strong>{' '}
                  {new Date(selectedOrder.deliveryTime).toLocaleString()}
                </p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CustomerDashboard; 