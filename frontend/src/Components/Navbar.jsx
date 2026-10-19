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
  sessionStorage.removeItem("isLoggedIn");
  sessionStorage.removeItem("loggedInUser");

  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("loggedInUser");

  window.dispatchEvent(new Event("loginStatusChanged"));

  navigate("/login", { replace: true });
};

  // Search watches
  const handleSearch = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const searchText = search.trim();

      if (searchText) {
        navigate(`/categories?search=${encodeURIComponent(searchText)}`);
      } else {
        navigate("/categories");
      }

      setShowSearch(false);
    }
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
                type="button"
                className="icon-button"
                aria-label="Search watches"
                onClick={() => setShowSearch((previous) => !previous)}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>

              {showSearch && (
                <Form.Control
                  type="text"
                  placeholder="Search watches..."
                  aria-label="Search watches"
                  className="search-box"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={handleSearch}
                  autoFocus
                />
              )}
            </div>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="nav-icon"
              aria-label="Wishlist"
            >
              <FontAwesomeIcon icon={faHeart} />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="nav-icon" aria-label="Cart">
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