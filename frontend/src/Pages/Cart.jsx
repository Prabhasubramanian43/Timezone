import { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faPlus,
  faMinus,
  faTrash,
  faCartShopping
} from "@fortawesome/free-solid-svg-icons";


function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("watchCart")) || [];

    setCart(savedCart);
  }, []);

  // Increase Quantity

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: item.quantity + 1
          }
        : item
    );

    setCart(updatedCart);

    localStorage.setItem(
      "watchCart",
      JSON.stringify(updatedCart)
    );
  };

  // Decrease Quantity

  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity - 1
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);

    localStorage.setItem(
      "watchCart",
      JSON.stringify(updatedCart)
    );
  };

  // Remove Product

  const removeFromCart = (id) => {
    const updatedCart = cart.filter(
      (item) => item.id !== id
    );

    setCart(updatedCart);

    localStorage.setItem(
      "watchCart",
      JSON.stringify(updatedCart)
    );
  };

  // Calculate Total

  const totalPrice = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-page">

      <Container>

        <div className="cart-heading">

          <h1>
            <FontAwesomeIcon icon={faCartShopping} /> My Cart
          </h1>

          <p>
            Review your selected watches before checkout.
          </p>

        </div>

        {cart.length === 0 ? (

          <div className="empty-cart">

            <FontAwesomeIcon
              icon={faCartShopping}
              className="empty-cart-icon"
            />

            <h3>Your cart is empty 🛒</h3>

            <p>
              Add some watches to your cart.
            </p>

          </div>

        ) : (

          <Row>

            <Col lg={8}>

              {cart.map((item) => (

                <Card
                  className="cart-card"
                  key={item.id}
                >

                  <Row className="align-items-center">

                    <Col md={4}>

                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-image"
                      />

                    </Col>

                    <Col md={8}>

                      <Card.Body>

                        <Card.Title>
                          {item.name}
                        </Card.Title>

                        <p className="cart-price">
                          ₹{item.price}
                        </p>

                        <div className="quantity-section">

                          <Button
                            variant="dark"
                            onClick={() =>
                              decreaseQuantity(item.id)
                            }
                          >
                            <FontAwesomeIcon
                              icon={faMinus}
                            />
                          </Button>

                          <span>
                            {item.quantity}
                          </span>

                          <Button
                            variant="dark"
                            onClick={() =>
                              increaseQuantity(item.id)
                            }
                          >
                            <FontAwesomeIcon
                              icon={faPlus}
                            />
                          </Button>

                        </div>

                        <p className="item-subtotal">
                          Subtotal: ₹
                          {item.price * item.quantity}
                        </p>

                        <Button
                          variant="outline-danger"
                          onClick={() =>
                            removeFromCart(item.id)
                          }
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                          />
                          {" "}Remove
                        </Button>

                      </Card.Body>

                    </Col>

                  </Row>

                </Card>

              ))}

            </Col>

            <Col lg={4}>

              <Card className="summary-card">

                <Card.Body>

                  <h3>Order Summary</h3>

                  <div className="summary-row">

                    <span>Subtotal</span>

                    <span>
                      ₹{totalPrice}
                    </span>

                  </div>

                  <div className="summary-row">

                    <span>Shipping</span>

                    <span>Free</span>

                  </div>

                  <hr />

                  <div className="summary-total">

                    <span>Total</span>

                    <span>
                      ₹{totalPrice}
                    </span>

                  </div>

                  <Button
                    variant="dark"
                    className="checkout-button"
                    onClick={() =>
                      alert("Checkout feature coming soon!")
                    }
                  >
                    Proceed to Checkout
                  </Button>

                </Card.Body>

              </Card>

            </Col>

          </Row>

        )}

      </Container>

    </div>
  );
}

export default Cart;