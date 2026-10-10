import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Spinner,
} from "react-bootstrap";

function BuyNow() {
  const navigate = useNavigate();

  // Get selected product or checkout products
  const [products, setProducts] = useState(() => {
    try {
      const savedProduct = JSON.parse(
        localStorage.getItem("buyNowProduct")
      );

      if (!savedProduct) return [];

      if (Array.isArray(savedProduct)) {
        return savedProduct.map((item) => ({
          ...item,
          quantity: Number(item.quantity) || 1,
        }));
      }

      return [
        {
          ...savedProduct,
          quantity: Number(savedProduct.quantity) || 1,
        },
      ];
    } catch {
      return [];
    }
  });

  // Customer details
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  // Order success popup
  const [showSuccess, setShowSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Calculate total
  const totalPrice = products.reduce(
    (total, product) =>
      total +
      Number(product.price) * Number(product.quantity),
    0
  );

  // Increase quantity
  const increaseQuantity = (id) => {
    setProducts((previous) =>
      previous.map((product) =>
        String(product.id || product._id) === String(id)
          ? {
              ...product,
              quantity: Number(product.quantity) + 1,
            }
          : product
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (id) => {
    setProducts((previous) =>
      previous.map((product) =>
        String(product.id || product._id) === String(id) &&
        product.quantity > 1
          ? {
              ...product,
              quantity: Number(product.quantity) - 1,
            }
          : product
      )
    );
  };

  // Handle customer input
  const handleChange = (event) => {
    const { name, value } = event.target;

    setCustomer((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Place order and save to MongoDB
  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (loading) return;

    if (products.length === 0) {
      alert("No products selected!");
      return;
    }

    if (
      !customer.name.trim() ||
      !customer.email.trim() ||
      !customer.phone.trim() ||
      !customer.address.trim()
    ) {
      alert("Please fill in all customer details.");
      return;
    }

    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "null"
    );

    if (!loggedInUser || !loggedInUser._id) {
      alert("Please login first!");
      navigate("/");
      return;
    }

    // Validate product details
    const orderProducts = products.map((product) => ({
      productId: product.productId || product._id || product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image || "",
      quantity: Number(product.quantity) || 1,
    }));

    const invalidProduct = orderProducts.some(
      (product) =>
        !product.name ||
        !Number.isFinite(product.price) ||
        product.price < 0 ||
        !Number.isInteger(product.quantity) ||
        product.quantity < 1
    );

    if (invalidProduct) {
      alert("Invalid product details. Please try again.");
      return;
    }

    const calculatedTotal = orderProducts.reduce(
      (total, product) =>
        total + product.price * product.quantity,
      0
    );

    // Detect cart checkout
    let savedCheckoutData = null;

    try {
      savedCheckoutData = JSON.parse(
        localStorage.getItem("buyNowProduct") || "null"
      );
    } catch {
      savedCheckoutData = null;
    }

    const isCartCheckout = Array.isArray(savedCheckoutData);

    setLoading(true);

    try {
      // Save order to MongoDB
      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: loggedInUser._id,
            customerName: customer.name.trim(),
            email: customer.email.trim(),
            phone: customer.phone.trim(),
            address: customer.address.trim(),
            products: orderProducts,
            totalAmount: calculatedTotal,
            paymentMethod: "Cash on Delivery",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to place your order."
        );
      }

      // Save order details for the success popup
      const orderDetails = {
        orderId: data.order._id,
        customerName: customer.name.trim(),
        products: orderProducts,
        totalAmount: calculatedTotal,
        orderDate: new Date().toLocaleString(),
        status: "Order Placed",
      };

      setPlacedOrder(orderDetails);

      // Optional local copy for existing frontend features
      const oldOrders = JSON.parse(
        localStorage.getItem("watchOrders") || "[]"
      );

      localStorage.setItem(
        "watchOrders",
        JSON.stringify([...oldOrders, orderDetails])
      );

      // Clear purchased products from MongoDB cart
      if (isCartCheckout) {
        try {
          const cartResponse = await fetch(
            `http://localhost:5000/api/cart/${loggedInUser._id}`
          );

          if (cartResponse.ok) {
            const cartData = await cartResponse.json();

            const purchasedIds = orderProducts.map(
              (product) => String(product.productId)
            );

            for (const cartProduct of cartData.products || []) {
              if (
                purchasedIds.includes(
                  String(cartProduct.productId)
                )
              ) {
                await fetch(
                  `http://localhost:5000/api/cart/${loggedInUser._id}/${cartProduct.productId}`,
                  {
                    method: "DELETE",
                  }
                );
              }
            }
          }
        } catch (cartError) {
          console.error(
            "Order saved, but cart cleanup failed:",
            cartError
          );
        }
      }

      // Clear checkout data
      localStorage.removeItem("buyNowProduct");

      // Show popup only after order is saved
      setShowSuccess(true);
    } catch (error) {
      console.error("Place order error:", error);

      alert(
        error.message ||
          "Unable to place order. Please check your backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  // Close popup and navigate
  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/home");
  };

  // No product selected
  if (products.length === 0 && !showSuccess) {
    return (
      <Container className="my-5 text-center">
        <h2>No Product Selected</h2>

        <p>Please select a watch before placing an order.</p>

        <Button
          variant="dark"
          onClick={() => navigate("/products")}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container className="buy-now-container my-5">
      <h2 className="text-center mb-4">
        Complete Your <span>Order</span>
      </h2>

      <Row className="g-4">
        {/* Product Details */}
        <Col md={5}>
          {products.map((product) => (
            <Card
              className="buy-product-card mb-3"
              key={String(product.id || product._id)}
            >
              <Card.Img
                variant="top"
                src={product.image}
                alt={product.name}
                className="buy-product-image"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />

              <Card.Body>
                <h4>{product.name}</h4>

                {product.brand && (
                  <p>
                    <strong>Brand:</strong> {product.brand}
                  </p>
                )}

                <h5 className="text-success">
                  Price: ₹
                  {Number(product.price).toLocaleString("en-IN")}
                </h5>

                <div className="d-flex align-items-center gap-3 my-3">
                  <strong>Quantity:</strong>

                  <Button
                    type="button"
                    variant="outline-dark"
                    onClick={() =>
                      decreaseQuantity(product.id || product._id)
                    }
                    disabled={product.quantity <= 1 || loading}
                  >
                    −
                  </Button>

                  <span>{product.quantity}</span>

                  <Button
                    type="button"
                    variant="outline-dark"
                    onClick={() =>
                      increaseQuantity(product.id || product._id)
                    }
                    disabled={loading}
                  >
                    +
                  </Button>
                </div>

                <p>
                  Subtotal: ₹
                  {(
                    Number(product.price) * product.quantity
                  ).toLocaleString("en-IN")}
                </p>
              </Card.Body>
            </Card>
          ))}

          <Card className="p-3">
            <h4>
              Total: ₹{totalPrice.toLocaleString("en-IN")}
            </h4>
          </Card>
        </Col>

        {/* Customer Details */}
        <Col md={7}>
          <Card className="buy-form-card h-100">
            <Card.Body>
              <h4 className="mb-4">Customer Details</h4>

              <Form onSubmit={handlePlaceOrder}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>

                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={customer.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>

                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={customer.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>

                  <Form.Control
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={customer.phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    title="Enter a 10-digit phone number"
                    maxLength={10}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Delivery Address</Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    placeholder="Enter your complete address"
                    value={customer.address}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div className="order-summary mb-3">
                  <h5>Order Summary</h5>

                  {products.map((product) => (
                    <p key={String(product.id || product._id)}>
                      {product.name} × {product.quantity}
                    </p>
                  ))}

                  <h5>
                    Total Amount: ₹
                    {totalPrice.toLocaleString("en-IN")}
                  </h5>

                  <p>Payment Method: Cash on Delivery</p>
                </div>

                <Button
                  type="submit"
                  variant="success"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        size="sm"
                        className="me-2"
                      />
                      Placing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline-dark"
                  className="w-100 mt-3"
                  onClick={() => navigate("/products")}
                  disabled={loading}
                >
                  Continue Shopping
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Order Success Popup */}
      <Modal
        show={showSuccess}
        onHide={handleSuccessClose}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="bg-success text-white">
          <Modal.Title>🎉 Order Successful!</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center py-4">
          <div style={{ fontSize: "55px" }}>✅</div>

          <h4 className="text-success mt-3">
            Thank you for your order!
          </h4>

          <p>Your order has been saved successfully.</p>

          {placedOrder && (
            <>
              <p>
                <strong>Order ID:</strong>{" "}
                {placedOrder.orderId}
              </p>

              <p>
                <strong>Products:</strong>{" "}
                {placedOrder.products.length}
              </p>

              <h5>
                Total Amount: ₹
                {placedOrder.totalAmount.toLocaleString("en-IN")}
              </h5>

              <p>
                <strong>Status:</strong> Order Placed
              </p>
            </>
          )}

          <p className="text-muted">
            Payment Method: Cash on Delivery
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="success"
            className="w-100"
            onClick={handleSuccessClose}
          >
            Continue Shopping
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default BuyNow;