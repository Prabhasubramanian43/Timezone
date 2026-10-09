import { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faHeart,
  faCartShopping,
  faTrash
} from "@fortawesome/free-solid-svg-icons";


function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const savedWishlist =
      JSON.parse(localStorage.getItem("watchWishlist")) || [];

    setWishlist(savedWishlist);
  }, []);

  // Remove from Wishlist

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter(
      (item) => item.id !== id
    );

    setWishlist(updatedWishlist);

    localStorage.setItem(
      "watchWishlist",
      JSON.stringify(updatedWishlist)
    );
  };

  // Add to Cart

  const addToCart = (product) => {
    const oldCart =
      JSON.parse(localStorage.getItem("watchCart")) || [];

    const existingProduct = oldCart.find(
      (item) => item.id === product.id
    );

    let updatedCart;

    if (existingProduct) {
      updatedCart = oldCart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      );
    } else {
      updatedCart = [
        ...oldCart,
        {
          ...product,
          quantity: 1
        }
      ];
    }

    localStorage.setItem(
      "watchCart",
      JSON.stringify(updatedCart)
    );

    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="wishlist-page">

      <Container>

        <div className="wishlist-heading">

          <h1>
            <FontAwesomeIcon icon={faHeart} /> My Wishlist
          </h1>

          <p>
            Your favourite watches are saved here.
          </p>

        </div>

        {wishlist.length === 0 ? (

          <div className="empty-wishlist">

            <FontAwesomeIcon
              icon={faHeart}
              className="empty-heart"
            />

            <h3>Your wishlist is empty ❤️</h3>

            <p>
              Add your favourite watches to your wishlist.
            </p>

          </div>

        ) : (

          <Row>

            {wishlist.map((product) => (

              <Col
                md={6}
                lg={4}
                className="mb-4"
                key={product.id}
              >

                <Card className="wishlist-card">

                  <Card.Img
                    variant="top"
                    src={product.image}
                    alt={product.name}
                    className="wishlist-image"
                  />

                  <Card.Body>

                    <Card.Title>
                      {product.name}
                    </Card.Title>

                    <Card.Text>
                      {product.description}
                    </Card.Text>

                    <h5 className="wishlist-price">
                      ₹{product.price}
                    </h5>

                    <Button
                      variant="dark"
                      className="wishlist-cart-button"
                      onClick={() => addToCart(product)}
                    >
                      <FontAwesomeIcon
                        icon={faCartShopping}
                      />
                      {" "}Add to Cart
                    </Button>

                    <Button
                      variant="outline-danger"
                      onClick={() =>
                        removeFromWishlist(product.id)
                      }
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                      />
                      {" "}Remove
                    </Button>

                  </Card.Body>

                </Card>

              </Col>

            ))}

          </Row>

        )}

      </Container>

    </div>
  );
}

export default Wishlist;