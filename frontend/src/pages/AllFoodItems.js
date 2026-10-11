import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Accordion } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getAllFoodItems } from '../api';
import { formatIndianRupee } from '../utils/currencyFormatter';

const AllFoodItems = () => {
  const [allFoodItems, setAllFoodItems] = useState([]);
  const [foodByProvider, setFoodByProvider] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllFoodItems = async () => {
      try {
        setLoading(true);
        const response = await getAllFoodItems();
        const foods = response.data.data;
        setAllFoodItems(foods);
        
        // Group food items by provider
        const groupedFood = {};
        foods.forEach(item => {
          const providerId = item.provider._id;
          const providerName = item.provider.fullName || 'Unknown Provider';
          
          if (!groupedFood[providerId]) {
            groupedFood[providerId] = {
              providerName,
              providerInfo: item.provider,
              items: []
            };
          }
          
          groupedFood[providerId].items.push(item);
        });
        
        setFoodByProvider(groupedFood);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching food items:', err);
        setError('Failed to load food items. Please try again later.');
        setLoading(false);
      }
    };

    fetchAllFoodItems();
  }, []);

  const addToCart = (foodItem) => {
    // Get current cart items from localStorage
    const existingCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Check if item already exists in cart
    const existingItemIndex = existingCartItems.findIndex(item => item._id === foodItem._id);
    
    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      existingCartItems[existingItemIndex].quantity += 1;
    } else {
      // Add new item with quantity 1
      existingCartItems.push({
        ...foodItem,
        quantity: 1,
        providerName: foodItem.provider.fullName,
        provider: foodItem.provider._id
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(existingCartItems));
    
    // Show feedback that item was added (optional)
    alert(`${foodItem.name} added to cart!`);
  };

  const getCategoryBadge = (category) => {
    const badgeColors = {
      breakfast: 'info',
      lunch: 'success',
      dinner: 'danger',
      snacks: 'warning',
      dessert: 'primary',
      beverage: 'secondary'
    };
    
    return (
      <Badge bg={badgeColors[category] || 'secondary'} className="me-2">
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h2>Loading Food Items...</h2>
          <div className="spinner-border mt-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h2>Error</h2>
          <p className="text-danger">{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4 text-center">All Food Items</h1>
      <p className="text-center mb-5">Browse all delicious food items from our amazing providers</p>
      
      {Object.keys(foodByProvider).length === 0 ? (
        <div className="text-center">
          <p>No food items available yet. Check back soon!</p>
        </div>
      ) : (
        <Accordion defaultActiveKey={Object.keys(foodByProvider)[0]} alwaysOpen>
          {Object.entries(foodByProvider).map(([providerId, providerData]) => (
            <Accordion.Item key={providerId} eventKey={providerId}>
              <Accordion.Header>
                <div>
                  <h3 className="mb-0">{providerData.providerName}</h3>
                  <small className="text-muted">
                    {providerData.items.length} food items available
                  </small>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <Row className="mb-4">
                  {providerData.providerInfo && (
                    <Col md={12} className="mb-3">
                      <Card className="border-0 bg-light">
                        <Card.Body>
                          <h5>About {providerData.providerName}</h5>
                          <p>
                            <strong>Contact:</strong> {providerData.providerInfo.email} | {providerData.providerInfo.phone}
                          </p>
                          <p>
                            <strong>Address:</strong> {providerData.providerInfo.address}
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}
                </Row>
                <Row>
                  {providerData.items.map((item) => (
                    <Col key={item._id} md={4} sm={6} className="mb-4">
                      <Card className="h-100 shadow-sm">
                        <div style={{ height: '160px', overflow: 'hidden' }}>
                          <Card.Img 
                            variant="top" 
                            src={item.image && item.image !== 'no-photo.jpg' 
                              ? item.image 
                              : `https://source.unsplash.com/400x300/?food,${item.name}`} 
                            alt={item.name}
                            style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                          />
                        </div>
                        <Card.Body className="d-flex flex-column">
                          <Card.Title>{item.name}</Card.Title>
                          <div className="mb-2">
                            {getCategoryBadge(item.category)}
                            {item.isVegetarian && (
                              <Badge bg="success" className="me-2">Vegetarian</Badge>
                            )}
                          </div>
                          <Card.Text className="mb-3">{item.description}</Card.Text>
                          <div className="d-flex justify-content-between align-items-center mt-auto">
                            <span className="fs-5">{formatIndianRupee(item.price)}</span>
                            <Button 
                              variant="primary" 
                              onClick={() => addToCart(item)}
                              disabled={!item.isAvailable}
                            >
                              {item.isAvailable ? 'Add to Cart' : 'Not Available'}
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  );
};

export default AllFoodItems; 