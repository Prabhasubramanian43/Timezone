import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert, Spinner, } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCartShopping, faBolt, } from "@fortawesome/free-solid-svg-icons";

import "../app.css";

// Existing watch images
import watch1 from "../assets/p11.jpeg";
import watch2 from "../assets/p12.jpeg";
import watch3 from "../assets/p2.jpeg";
import watch4 from "../assets/p3.jpeg";
import watch5 from "../assets/p4.jpeg";
import watch6 from "../assets/p5.jpeg";

// Map MongoDB image filenames to imported images
const watchImages = {
  "p11.jpeg": watch1,
  "p12.jpeg": watch2,
  "p2.jpeg": watch3,
  "p3.jpeg": watch4,
  "p4.jpeg": watch5,
  "p5.jpeg": watch6,
};

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch products from MongoDB through the backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/products"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load products"
          );
        }

        setProducts(data);
      } catch (error) {
        console.error("Fetch products error:", error);

        setError(
          "Unable to load products. Please check your backend server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ADD TO CART
  // ADD TO CART - MongoDB
  const addToCart = async (product) => {
    try {
      // Get logged-in user
      const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
      );

      if (!loggedInUser || !loggedInUser._id) {
        alert("Please login first!");
        navigate("/");
        return;
      }

      // Send product to MongoDB backend
      const response = await fetch(
        `http://localhost:5000/api/cart/${loggedInUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product: {
              productId: product._id,
              name: product.name,
              price: product.price,
              image: product.image,
              brand: product.brand || "TIMEZONE",
              quantity: 1,
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to add product");
      }

      alert(`${product.name} added to cart successfully!`);
    } catch (error) {
      console.error("Add to cart error:", error);
      alert(error.message || "Unable to connect to cart database.");
    }
  };

  // ADD TO WISHLIST
  const addToWishlist = (product) => {
    const oldWishlist =
      JSON.parse(localStorage.getItem("watchWishlist")) || [];

    const alreadyExists = oldWishlist.some(
      (item) => item.id === product._id
    );

    if (alreadyExists) {
      alert("This product is already in your wishlist!");
      return;
    }

    const updatedWishlist = [
      ...oldWishlist,
      {
        ...product,
        id: product._id,
        image: watchImages[product.image] || product.image,
      },
    ];

    localStorage.setItem(
      "watchWishlist",
      JSON.stringify(updatedWishlist)
    );

    alert(`${product.name} added to wishlist successfully!`);
  };

  // BUY NOW
  const buyNow = (product) => {
    const selectedProduct = {
      ...product,
      id: product._id,
      image: watchImages[product.image] || product.image,
      quantity: 1,
    };

    localStorage.setItem(
      "buyNowProduct",
      JSON.stringify(selectedProduct)
    );

    navigate("/buynow");
  };

  // Loading
  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />

        <p className="mt-3">
          Loading products...
        </p>
      </Container>
    );
  }

  // Error
  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="products-container my-5">
      <h2 className="text-center mb-4">
        Our <span>Products</span>
      </h2>

      {products.length === 0 ? (
        <Alert variant="info">
          No products found in the database.
        </Alert>
      ) : (
        <Row>
          {products.map((product) => (
            <Col
              key={product._id}
              xs={12}
              sm={6}
              md={4}
              className="mb-4"
            >
              <Card className="product-card h-100">
                <Card.Img
                  variant="top"
                  src={
                    watchImages[product.image] ||
                    product.image
                  }
                  alt={product.name}
                  className="product-image"
                />

                <Card.Body className="d-flex flex-column">
                  <Card.Title>
                    {product.name}
                  </Card.Title>

                  <Card.Text>
                    {product.description}
                  </Card.Text>

                  <h5 className="product-price">
                    ₹{product.price}
                  </h5>

                  <div className="category-buttons d-grid gap-2 mt-auto">
                    {/* Wishlist */}
                    <Button
                      variant="outline-danger"
                      onClick={() => addToWishlist(product)}
                    >
                      <FontAwesomeIcon icon={faHeart} />{" "}
                      Wishlist
                    </Button>

                    {/* Add to Cart */}
                    <Button
                      variant="dark"
                      onClick={() => addToCart(product)}
                    >
                      <FontAwesomeIcon
                        icon={faCartShopping}
                      />{" "}
                      Add to Cart
                    </Button>

                    {/* Buy Now */}
                    <Button
                      variant="warning"
                      onClick={() => buyNow(product)}
                    >
                      <FontAwesomeIcon icon={faBolt} />{" "}
                      Buy Now
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Products;