import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";



import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faHeart,
  faCartShopping,
  faBolt,
} from "@fortawesome/free-solid-svg-icons";

// Men Images
import men1 from "../assets/p11.jpeg";
import men2 from "../assets/ts.jpeg";
import men3 from "../assets/cs.jpeg";
import men4 from "../assets/fl.jpeg";

// Women Images
import women1 from "../assets/tl.jpeg";
import women2 from "../assets/csw.jpeg";

// Kids Images
import kids1 from "../assets/ccw.jpeg";

// Other Images
import sma from "../assets/fs.jpeg";
import luxury from "../assets/rw.jpeg";
import rolex from "../assets/rcw.jpeg";
import smart from "../assets/ksw.jpeg";
import digital from "../assets/kdw.jpeg";

function Categories() {
  
const [searchParams] = useSearchParams();

const [search, setSearch] = useState(
  searchParams.get("search") || ""
);

const navigate = useNavigate();

useEffect(() => {
  setSearch(searchParams.get("search") || "");
}, [searchParams]);



  // Products
  const products = [
    {
      id: 1,
      name: "Titan Classic Black Watch",
      brand: "Titan",
      category: "Men",
      type: "Classic Watch",
      description: "Elegant Titan black watch for everyday use.",
      price: 2500,
      image: men1,
    },
    {
      id: 2,
      name: "Titan Luxury Silver Watch",
      brand: "Titan",
      category: "Women",
      type: "Luxury Watch",
      description: "Stylish Titan silver watch with premium design.",
      price: 4500,
      image: women1,
    },
    {
      id: 3,
      name: "Titan Smart Watch",
      brand: "Titan",
      category: "Men",
      type: "Smart Watch",
      description: "Modern Titan smart watch with stylish design.",
      price: 5000,
      image: men2,
    },
    {
      id: 4,
      name: "Casio Sport Watch",
      brand: "Casio",
      category: "Men",
      type: "Sport Watch",
      description: "Modern Casio sport watch for an active lifestyle.",
      price: 3000,
      image: men3,
    },
    {
      id: 5,
      name: "Casio Smart Watch",
      brand: "Casio",
      category: "Women",
      type: "Smart Watch",
      description: "Stylish Casio smart watch for everyday use.",
      price: 4000,
      image: women2,
    },
    {
      id: 6,
      name: "Casio Classic Watch",
      brand: "Casio",
      category: "Kids",
      type: "Classic Watch",
      description: "Simple Casio classic watch for kids.",
      price: 2000,
      image: kids1,
    },
    {
      id: 7,
      name: "Fossil Leather Watch",
      brand: "Fossil",
      category: "Men",
      type: "Leather Watch",
      description: "Premium Fossil leather strap watch.",
      price: 3500,
      image: men4,
    },
    {
      id: 8,
      name: "Fossil Smart Watch",
      brand: "Fossil",
      category: "Women",
      type: "Smart Watch",
      description: "Modern Fossil smart watch with a premium design.",
      price: 5500,
      image: sma,
    },
    {
      id: 9,
      name: "Rolex Luxury Watch",
      brand: "Rolex",
      category: "Men",
      type: "Luxury Watch",
      description: "Luxury Rolex watch with a timeless design.",
      price: 8000,
      image: luxury,
    },
    {
      id: 10,
      name: "Rolex Classic Watch",
      brand: "Rolex",
      category: "Women",
      type: "Classic Watch",
      description: "Elegant Rolex classic watch.",
      price: 7500,
      image: rolex,
    },
    {
      id: 11,
      name: "Kids Smart Watch",
      brand: "Kids",
      category: "Kids",
      type: "Smart Watch",
      description: "Smart and stylish watch specially designed for kids.",
      price: 1800,
      image: smart,
    },
    {
      id: 12,
      name: "Kids Digital Watch",
      brand: "Kids",
      category: "Kids",
      type: "Digital Watch",
      description: "Simple digital watch for kids.",
      price: 1500,
      image: digital,
    },
  ];

  // Search Products
  const filteredProducts = products.filter((product) => {
    const searchText = search.trim().toLowerCase();

    return (
      product.name.toLowerCase().includes(searchText) ||
      product.brand.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText) ||
      product.type.toLowerCase().includes(searchText)
    );
  });

  // Add to Cart
  // Product save aagum; current page change aagadhu.
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
              quantity: (item.quantity || 1) + 1,
            }
          : item
      );

      alert(`${product.name} quantity increased in cart!`);
    } else {
      updatedCart = [
        ...oldCart,
        {
          ...product,
          quantity: 1,
        },
      ];

      alert(`${product.name} added to cart successfully!`);
    }

    localStorage.setItem(
      "watchCart",
      JSON.stringify(updatedCart)
    );
  };

  // Add to Wishlist
  // Product save aagum; current page change aagadhu.
  const addToWishlist = (product) => {
    const oldWishlist =
      JSON.parse(localStorage.getItem("watchWishlist")) || [];

    const alreadyExists = oldWishlist.some(
      (item) => item.id === product.id
    );

    if (alreadyExists) {
      alert("This product is already in your wishlist!");
      return;
    }

    const updatedWishlist = [...oldWishlist, product];

    localStorage.setItem(
      "watchWishlist",
      JSON.stringify(updatedWishlist)
    );

    alert(`${product.name} added to wishlist successfully!`);
  };

  // Buy Now - Separate Page
  const buyNow = (product) => {
    localStorage.setItem(
      "buyNowProduct",
      JSON.stringify({
        ...product,
        quantity: 1,
      })
    );

    navigate("/buynow");
  };

  return (
    <div className="categories-page">
      <Container>
        {/* Heading */}
        <div className="categories-heading">
          <h1>Watch Categories</h1>

          <p>
            Search your favourite watch brand or type.
          </p>
        </div>

        {/* Search */}
        <div className="category-search">
          <Form.Control
            type="text"
            placeholder="Search Titan, Casio, Smart Watch..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {/* Products */}
        <Row>
          {filteredProducts.map((product) => (
            <Col
              xs={12}
              sm={6}
              lg={4}
              className="mb-4"
              key={product.id}
            >
              <Card className="category-card h-100">
                <Card.Img
                  variant="top"
                  src={product.image}
                  alt={product.name}
                  className="category-image"
                />

                <Card.Body className="d-flex flex-column">
                  <span className="category-badge">
                    {product.brand}
                  </span>

                  <Card.Title className="mt-2">
                    {product.name}
                  </Card.Title>

                  <Card.Text>
                    {product.description}
                  </Card.Text>

                  <p className="category-type">
                    Type: {product.type}
                  </p>

                  <p className="category-gender">
                    Category: {product.category}
                  </p>

                  <h5 className="category-price">
                    ₹{product.price.toLocaleString("en-IN")}
                  </h5>

                  <div className="category-buttons d-grid gap-2 mt-auto">
                    {/* Wishlist */}
                    <Button
                      variant="outline-danger"
                      onClick={() => addToWishlist(product)}
                    >
                      <FontAwesomeIcon icon={faHeart} /> Wishlist
                    </Button>

                    {/* Add to Cart */}
                    <Button
                      variant="dark"
                      onClick={() => addToCart(product)}
                    >
                      <FontAwesomeIcon icon={faCartShopping} /> Add
                      to Cart
                    </Button>

                    {/* Buy Now */}
                    <Button
                      variant="warning"
                      onClick={() => buyNow(product)}
                    >
                      <FontAwesomeIcon icon={faBolt} /> Buy Now
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* No Products Found */}
        {filteredProducts.length === 0 && (
          <div className="no-category text-center py-5">
            <h4>No products found</h4>

            <p>
              Try searching Titan, Casio, Fossil, Rolex or Smart Watch.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}

export default Categories;
