import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Navbar,
  Nav,
  Container,
  Button,
  NavDropdown
} from 'react-bootstrap';
import { AuthContext } from '../../utils/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-success">
          Tiffin Wallah
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/menu">
              Menu
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about">
              About Us
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contact">
              Contact
            </Nav.Link>
            {!isAuthenticated && (
              <Nav.Link as={NavLink} to="/cart">
                Cart
              </Nav.Link>
            )}
            {isAuthenticated && user?.role === 'customer' && (
              <>
                <Nav.Link as={NavLink} to="/cart">
                  Cart
                </Nav.Link>
                <Nav.Link as={NavLink} to="/dashboard/customer">
                  My Dashboard
                </Nav.Link>
              </>
            )}
            {isAuthenticated && user?.role === 'provider' && (
              <Nav.Link as={NavLink} to="/dashboard/provider">
                Provider Dashboard
              </Nav.Link>
            )}
          </Nav>

          <Nav className="align-items-lg-center">
            {isAuthenticated ? (
              <>
                <Navbar.Text className="me-lg-3">
                  Hello, {user?.fullName || user?.name || 'User'}
                </Navbar.Text>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">
                  Login
                </Nav.Link>
                <Button
                  as={Link}
                  to="/register"
                  variant="success"
                  size="sm"
                  className="ms-lg-2"
                >
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;