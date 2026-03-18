import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const NavBar = ({ user, handleLogout }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Blog App
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Blogs
            </Nav.Link>

            <Nav.Link as={Link} to="/users">
              Users
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto align-items-center">
            <Navbar.Text className="me-2">{user.name} logged in</Navbar.Text>

            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
