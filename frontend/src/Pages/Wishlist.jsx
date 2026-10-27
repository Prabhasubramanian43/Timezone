import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faTrash,
  faCartShopping,
  faBolt,
} from "@fortawesome/free-solid-svg-icons";

function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  // Check login status
  const isUserLoggedIn = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    let loggedInUser = null;

    try {
      loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
      );
    } catch {
      loggedInUser = null;
    }

    if (!isLoggedIn || !loggedInUser?._id) {
      alert("Please login first!");
      navigate("/login");
      return false;
    }

    return true;
  };

  // Load wishlist from localStorage
  const loadWishlist = () => {
    try {
      const savedWishlist = JSON.parse(
        localStorage.getItem("watchWishlist") || "[]"
      );

      setWishlist(Array.isArray(savedWishlist) ? savedWishlist : []);
    } catch {
      setWishlist([]);
    }
  };

  useEffect(() => {
    loadWishlist();

    const handleWishlistUpdate = () => {
      loadWishlist();
    };

    window.addEventListener(
      "wishlistUpdated",
      handleWishlistUpdate
    );

    window.addEventListener("storage", handleWishlistUpdate);

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        handleWishlistUpdate
      );

      window.removeEventListener(
        "storage",
        handleWishlistUpdate
      );
    };
  }, []);

  // Save updated wishlist
  const updateWishlist = (updatedWishlist) => {
    setWishlist(updatedWishlist);

    localStorage.setItem(
      "watchWishlist",
      JSON.stringify(updatedWishlist)
    );

    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  // Remove product from wishlist
  const removeProduct = (id) => {
    const updatedWishlist = wishlist.filter(
      (product) =>
        String(product.id || product._id) !== String(id)
    );

    updateWishlist(updatedWishlist);

    alert("Product removed from wishlist!");
  };

  // Add product to cart
  const addToCart = (product) => {
    if (!isUserLoggedIn()) return;

    let oldCart = [];

    try {
      oldCart = JSON.parse(
        localStorage.getItem("watchCart") || "[]"
      );

      if (!Array.isArray(oldCart)) {
        oldCart = [];
      }
    } catch {
      oldCart = [];
    }

    const productId = String(product.id || product._id);

    const existingProduct = oldCart.find(
      (item) =>
        String(item.id || item._id || item.productId) === productId
    );

    let updatedCart;

    if (existingProduct) {
      updatedCart = oldCart.map((item) =>
        String(item.id || item._id || item.productId) === productId
          ? {
              ...item,
              quantity: Number(item.quantity || 1) + 1,
            }
          : item
      );

      alert(`${product.name} quantity increased in cart!`);
    } else {
      updatedCart = [
        ...oldCart,
        {
          ...product,
          id: product.id || product._id,
          quantity: 1,
        },
      ];

      alert(`${product.name} added to cart successfully!`);
    }

    localStorage.setItem(
      "watchCart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Buy Now
  const buyNow = (product) => {
    if (!isUserLoggedIn()) return;

    localStorage.setItem(
      "buyNowProduct",
      JSON.stringify({
        ...product,
        quantity: 1,
      })
    );

    navigate("/buynow");
  };

  // Empty wishlist
  if (wishlist.length === 0) {
    return (
      <Container className="wishlist-page my-5 text-center">
        <FontAwesomeIcon
          icon={faHeart}
          className="empty-wishlist-icon"
        />

        <h2 className="mt-3">Your Wishlist is Empty</h2>

        <p className="mt-3">
          Save your favourite watches here.
        </p>

        <Button
          variant="dark"
          onClick={() => navigate("/products")}
        >
          Explore Products
        </Button>
      </Container>
    );
  }

  return (
    <Container className="wishlist-page my-5">
      <h2 className="text-center mb-5">
        My <span>Wishlist</span>
      </h2>

      <Row>
        {wishlist.map((product) => (
          <Col
            xs={12}
            sm={6}
            lg={4}
            className="mb-4"
            key={product.id || product._id}
          >
            <Card className="wishlist-product-card h-100">
              <Card.Img
                variant="top"
                src={product.image}
                alt={product.name}
                className="wishlist-product-image"
              />

              <Card.Body className="d-flex flex-column">
                <Card.Title>
                  {product.name}
                </Card.Title>

                <Card.Text>
                  {product.description}
                </Card.Text>

                {product.brand && (
                  <p className="text-muted mb-2">
                    Brand: {product.brand}
                  </p>
                )}

                <h5 className="text-success">
                  ₹{Number(product.price || 0).toLocaleString("en-IN")}
                </h5>

                <div className="wishlist-buttons d-grid gap-2 mt-auto">
                  <Button
                    variant="dark"
                    onClick={() => addToCart(product)}
                  >
                    <FontAwesomeIcon icon={faCartShopping} /> Add
                    to Cart
                  </Button>

                  <Button
                    variant="warning"
                    onClick={() => buyNow(product)}
                  >
                    <FontAwesomeIcon icon={faBolt} /> Buy Now
                  </Button>

                  <Button
                    variant="outline-danger"
                    onClick={() =>
                      removeProduct(product.id || product._id)
                    }
                  >
                    <FontAwesomeIcon icon={faTrash} /> Remove
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Wishlist;