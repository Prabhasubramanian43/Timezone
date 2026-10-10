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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get logged-in user
  const getLoggedInUser = () => {
    try {
      return JSON.parse(localStorage.getItem("loggedInUser"));
    } catch {
      return null;
    }
  };

  // Get correct image path
  const getProductImage = (image) => {
    if (!image) {
      return "";
    }

    // Database-la filename mattum irundhaal
    const filename = image.split("/").pop();

    return watchImages[filename] || image;
  };

  // Fetch cart from MongoDB
  const fetchCart = async () => {
    setLoading(true);
    setError("");

    try {
      const user = getLoggedInUser();

      if (!user || !user._id) {
        setCartItems([]);
        setError("Please login to view your cart.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/cart/${user._id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load cart.");
      }

      const products = (data.products || []).map((product) => ({
        ...product,
        id: product.productId,
        image: getProductImage(product.image),
        quantity: Number(product.quantity) || 1,
      }));

      setCartItems(products);
    } catch (err) {
      console.error("Fetch cart error:", err);
      setError(
        "Unable to load cart. Please check your backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Increase or decrease quantity
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      return;
    }

    const user = getLoggedInUser();

    if (!user || !user._id) {
      alert("Please login first!");
      navigate("/");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${user._id}/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update quantity.");
      }

      // Update frontend immediately
      setCartItems((previousItems) =>
        previousItems.map((item) =>
          String(item.id) === String(productId)
            ? { ...item, quantity }
            : item
        )
      );
    } catch (err) {
      console.error("Update quantity error:", err);
      alert(err.message || "Unable to update quantity.");
    }
  };

  // Remove product from cart
  const removeFromCart = async (productId) => {
    const user = getLoggedInUser();

    if (!user || !user._id) {
      alert("Please login first!");
      navigate("/");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${user._id}/${productId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to remove product.");
      }

      setCartItems((previousItems) =>
        previousItems.filter(
          (item) => String(item.id) !== String(productId)
        )
      );
    } catch (err) {
      console.error("Remove cart error:", err);
      alert(err.message || "Unable to remove product.");
    }
  };

  // Calculate total
  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  );

  const shipping = cartItems.length > 0 ? 0 : 0;
  const total = subtotal + shipping;

  // Buy Now
  const handleBuyNow = (product) => {
    const buyNowProduct = {
      ...product,
      id: product.id,
      image: product.image,
      quantity: product.quantity,
    };

    localStorage.setItem(
      "buyNowProduct",
      JSON.stringify(buyNowProduct)
    );

    navigate("/buynow");
  };

  // Checkout
  const handleCheckout = () => {
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

      {loading ? (
        <div className="text-center py-5">
          <h5>Loading your cart...</h5>
        </div>
      ) : error ? (
        <div className="text-center py-5">
          <p className="text-danger">{error}</p>

          <Button
            variant="dark"
            onClick={() => navigate("/")}
          >
            Go to Login
          </Button>

          <Button
            variant="outline-dark"
            className="ms-2"
            onClick={fetchCart}
          >
            Try Again
          </Button>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="text-center py-5">
          <FaShoppingCart size={55} className="mb-3" />

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
                            event.currentTarget.style.display = "none";
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
                        onClick={() => removeFromCart(product.id)}
                      >
                        <FaTrash className="me-2" />
                        Remove
                      </Button>

                      <br />

                      <Button
                        variant="dark"
                        size="sm"
                        onClick={() => handleBuyNow(product)}
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
                <h4 className="mb-4">Order Summary</h4>

                <div className="d-flex justify-content-between mb-3">
                  <span>Items</span>
                  <span>
                    {cartItems.reduce(
                      (sum, item) => sum + item.quantity,
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
                    {shipping === 0 ? "Free" : `₹${shipping}`}
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