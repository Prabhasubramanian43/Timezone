import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";

import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaBolt,
} from "react-icons/fa";

// Import existing watch images
import watch1 from "../assets/p11.jpeg";
import watch2 from "../assets/p12.jpeg";
import watch3 from "../assets/p2.jpeg";
import watch4 from "../assets/p3.jpeg";
import watch5 from "../assets/p4.jpeg";
import watch6 from "../assets/p5.jpeg";

// Image mapping
const watchImages = {
  "p11.jpeg": watch1,
  "p12.jpeg": watch2,
  "p2.jpeg": watch3,
  "p3.jpeg": watch4,
  "p4.jpeg": watch5,
  "p5.jpeg": watch6,
};

function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);

  // Get logged-in user
  const getLoggedInUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem("loggedInUser") || "null"
      );
    } catch {
      return null;
    }
  };

  // Check login status
  const isUserLoggedIn = () => {
    const user = getLoggedInUser();

    return (
      localStorage.getItem("isLoggedIn") === "true" &&
      user &&
      user._id
    );
  };

  // Get correct image path
  const getProductImage = (image) => {
    if (!image) {
      return "";
    }

    const filename = String(image).split("/").pop();

    return watchImages[filename] || image;
  };

  // Load cart from localStorage
  const fetchCart = () => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("watchCart") || "[]"
      );

      if (!Array.isArray(savedCart)) {
        setCartItems([]);
        return;
      }

      const normalizedCart = savedCart.map((product) => ({
        ...product,
        id: String(product.id || product._id || product.productId),
        image: getProductImage(product.image),
        quantity: Math.max(
          1,
          Number(product.quantity) || 1
        ),
        price: Number(product.price) || 0,
      }));

      setCartItems(normalizedCart);
    } catch (error) {
      console.error("Load cart error:", error);
      setCartItems([]);
    }
  };

  // Load cart and listen for changes
  useEffect(() => {
    fetchCart();

    const handleCartUpdated = () => {
      fetchCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdated);
    window.addEventListener("storage", handleCartUpdated);

    return () => {
      window.removeEventListener(
        "cartUpdated",
        handleCartUpdated
      );

      window.removeEventListener(
        "storage",
        handleCartUpdated
      );
    };
  }, []);

  // Save cart to localStorage
  const saveCart = (updatedCart) => {
    localStorage.setItem(
      "watchCart",
      JSON.stringify(updatedCart)
    );

    setCartItems(updatedCart);

    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Increase or decrease quantity
  const updateQuantity = (productId, quantity) => {
    if (!isUserLoggedIn()) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    if (quantity < 1) {
      return;
    }

    const updatedCart = cartItems.map((item) =>
      String(item.id) === String(productId)
        ? {
            ...item,
            quantity: Number(quantity),
          }
        : item
    );

    saveCart(updatedCart);
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    if (!isUserLoggedIn()) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    const updatedCart = cartItems.filter(
      (item) => String(item.id) !== String(productId)
    );

    saveCart(updatedCart);
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price) * Number(item.quantity),
    0
  );

  // Free shipping
  const shipping = cartItems.length > 0 ? 0 : 0;

  const total = subtotal + shipping;

  // Buy Now
  const handleBuyNow = (product) => {
    if (!isUserLoggedIn()) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    const buyNowProduct = {
      ...product,
      id: String(product.id),
      image: product.image,
      quantity: Number(product.quantity) || 1,
    };

    localStorage.setItem(
      "buyNowProduct",
      JSON.stringify(buyNowProduct)
    );

    navigate("/buynow");
  };

  // Checkout
  const handleCheckout = () => {
    if (!isUserLoggedIn()) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    localStorage.setItem(
      "checkoutProducts",
      JSON.stringify(cartItems)
    );

    navigate("/buynow");
  };

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">
        <FaShoppingCart className="me-2" />
        My Shopping Cart
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <FaShoppingCart
            size={55}
            className="mb-3"
          />

          <h4>Your cart is empty!</h4>

          <p className="text-muted">
            Add your favourite watches to the cart.
          </p>

          <Button
            variant="dark"
            onClick={() => navigate("/products")}
          >
            Shop Now
          </Button>

          <Button
            variant="outline-dark"
            className="ms-2"
            onClick={() => navigate("/categories")}
          >
            Browse Categories
          </Button>
        </div>
      ) : (
        <Row>
          {/* Cart Products */}
          <Col lg={8}>
            {cartItems.map((product) => (
              <Card
                className="mb-3 shadow-sm"
                key={String(product.id)}
              >
                <Card.Body>
                  <Row className="align-items-center">
                    {/* Product Image */}
                    <Col xs={4} md={3}>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                          style={{
                            width: "100%",
                            height: "120px",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <div className="text-muted text-center">
                          Image unavailable
                        </div>
                      )}
                    </Col>

                    {/* Product Details */}
                    <Col xs={8} md={5}>
                      <h5>{product.name}</h5>

                      <p className="text-muted mb-1">
                        {product.brand || "TIMEZONE"}
                      </p>

                      <h6>
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </h6>

                      {/* Quantity */}
                      <div className="d-flex align-items-center mt-3">
                        <Button
                          variant="outline-dark"
                          size="sm"
                          onClick={() =>
                            updateQuantity(
                              product.id,
                              product.quantity - 1
                            )
                          }
                          disabled={product.quantity <= 1}
                        >
                          <FaMinus />
                        </Button>

                        <span className="mx-3">
                          {product.quantity}
                        </span>

                        <Button
                          variant="outline-dark"
                          size="sm"
                          onClick={() =>
                            updateQuantity(
                              product.id,
                              product.quantity + 1
                            )
                          }
                        >
                          <FaPlus />
                        </Button>
                      </div>
                    </Col>

                    {/* Actions */}
                    <Col
                      md={4}
                      className="mt-3 mt-md-0 text-md-end"
                    >
                      <h6 className="mb-3">
                        Subtotal: ₹
                        {(
                          Number(product.price) *
                          Number(product.quantity)
                        ).toLocaleString("en-IN")}
                      </h6>

                      <Button
                        variant="danger"
                        size="sm"
                        className="mb-2"
                        onClick={() =>
                          removeFromCart(product.id)
                        }
                      >
                        <FaTrash className="me-2" />
                        Remove
                      </Button>

                      <br />

                      <Button
                        variant="dark"
                        size="sm"
                        onClick={() =>
                          handleBuyNow(product)
                        }
                      >
                        <FaBolt className="me-2" />
                        Buy Now
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </Col>

          {/* Order Summary */}
          <Col lg={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <h4 className="mb-4">
                  Order Summary
                </h4>

                <div className="d-flex justify-content-between mb-3">
                  <span>Items</span>

                  <span>
                    {cartItems.reduce(
                      (sum, item) =>
                        sum + Number(item.quantity),
                      0
                    )}
                  </span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span>Subtotal</span>

                  <span>
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span>Shipping</span>

                  <span>
                    {shipping === 0
                      ? "Free"
                      : `₹${shipping}`}
                  </span>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-4">
                  <h5>Total</h5>

                  <h5>
                    ₹{total.toLocaleString("en-IN")}
                  </h5>
                </div>

                <Button
                  variant="dark"
                  className="w-100"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outline-dark"
                  className="w-100 mt-3"
                  onClick={() => navigate("/products")}
                >
                  Continue Shopping
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Cart;