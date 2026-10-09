import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faHeart,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";

import logo from "../assets/logo.jpeg";

function NavigationBar() {

  const navigate = useNavigate();

  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <Navbar expand="lg" className="timezone-navbar">
      <Container>

        {/* Logo */}
        <Navbar.Brand as={Link} to="/home" className="timezone-logo">
          <img src={logo} alt="TIMEZONE Logo" />
          <span>TIMEZONE</span>
        </Navbar.Brand>

        {/* Mobile Toggle */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">

          {/* Menu */}
          <Nav className="mx-auto navbar-menu">

            <Nav.Link as={Link} to="/home">
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/products">
              Products
            </Nav.Link>

            <Nav.Link as={Link} to="/categories">
              Categories
            </Nav.Link>

          </Nav>

          {/* Right Side */}
          <div className="navbar-right">

            {/* Search */}
            <div className="search-area">

              <button
                className="icon-button"
                onClick={() => setShowSearch(!showSearch)}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>

              {showSearch && (
                <Form.Control
                  type="text"
                  placeholder="Search watches..."
                  className="search-box"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      navigate(`/categories?search=${search}`);
                      setShowSearch(false);
                    }
                  }}
                />
              )}

            </div>

            {/* Wishlist */}
            <Link to="/wishlist" className="nav-icon">
              <FontAwesomeIcon icon={faHeart} />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="nav-icon">
              <FontAwesomeIcon icon={faCartShopping} />
            </Link>

            {/* Logout */}
            <Button
              variant="dark"
              className="login-link"
              onClick={handleLogout}
            >
              Logout
            </Button>

          </div>

        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
}

export default NavigationBar;
