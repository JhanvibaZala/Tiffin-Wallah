import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row className="align-items-center gy-3">
          <Col md={6} className="text-center text-md-start">
            <h5 className="text-success mb-2">Tiffin Wallah</h5>
            <p className="mb-0">
              Fresh, homemade meals delivered to your doorstep.
            </p>
          </Col>

          <Col md={6} className="text-center text-md-end">
            <Link to="/about" className="text-light text-decoration-none me-3">
              About
            </Link>
            <Link to="/contact" className="text-light text-decoration-none">
              Contact
            </Link>
          </Col>
        </Row>

        <hr className="border-secondary" />

        <p className="text-center text-secondary small mb-0">
          © {new Date().getFullYear()} Tiffin Wallah. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
