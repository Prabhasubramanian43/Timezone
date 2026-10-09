import { useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faHeart,
  faCartShopping,
  faBolt
} from "@fortawesome/free-solid-svg-icons";


// Men Images
import men1 from "../assets/p11.jpeg";
import men2 from "../assets/p12.jpeg";
import men3 from "../assets/p2.jpeg";

// Women Images
import women1 from "../assets/tw.jpeg";
import women2 from "../assets/pw.jpeg";
import women3 from "../assets/classic.jpeg";

// Kids Images
import kids1 from "../assets/ks.jpeg";
import kids2 from "../assets/kd.jpeg";
import kids3 from "../assets/kc.jpeg";


function Products() {

  const [message, setMessage] = useState("");


  // Products

  const products = [

    // Men

    {
      id: 1,
      name: "Classic Black Watch",
      category: "Men",
      description:
        "Elegant black watch for everyday use.",
      price: 2500,
      image: men1
    },

    {
      id: 2,
      name: "Luxury Silver Watch",
      category: "Men",
      description:
        "Stylish silver watch with a premium design.",
      price: 4500,
      image: men2
    },

    {
      id: 3,
      name: "Golden Classic Watch",
      category: "Men",
      description:
        "Classic golden watch for a luxurious look.",
      price: 5000,
      image: men3
    },


    // Women

    {
      id: 4,
      name: "Elegant Women Watch",
      category: "Women",
      description:
        "Elegant watch designed for women.",
      price: 3000,
      image: women1
    },

    {
      id: 5,
      name: "Premium Women Watch",
      category: "Women",
      description:
        "Premium stylish watch for women.",
      price: 4000,
      image: women2
    },

    {
      id: 6,
      name: "Classic Women Watch",
      category: "Women",
      description:
        "Classic watch with a beautiful design.",
      price: 3500,
      image: women3
    },


    // Kids

    {
      id: 7,
      name: "Kids Sport Watch",
      category: "Kids",
      description:
        "Fun and stylish watch for kids.",
      price: 1500,
      image: kids1
    },

    {
      id: 8,
      name: "Kids Digital Watch",
      category: "Kids",
      description:
        "Simple digital watch for kids.",
      price: 1800,
      image: kids2
    },

    {
      id: 9,
      name: "Kids Classic Watch",
      category: "Kids",
      description:
        "Cute classic watch for kids.",
      price: 2000,
      image: kids3
    }

  ];


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


    setMessage(
      `${product.name} added to cart!`
    );

  };


  // Add to Wishlist

  const addToWishlist = (product) => {

    const oldWishlist =
      JSON.parse(
        localStorage.getItem("watchWishlist")
      ) || [];


    const alreadyExists = oldWishlist.find(
      (item) => item.id === product.id
    );


    if (!alreadyExists) {

      const updatedWishlist = [
        ...oldWishlist,
        product
      ];


      localStorage.setItem(
        "watchWishlist",
        JSON.stringify(updatedWishlist)
      );


      setMessage(
        `${product.name} added to wishlist!`
      );

    } else {

      setMessage(
        "This product is already in your wishlist."
      );

    }

  };


  return (

    <div className="products-page">

      <Container>


        {/* Heading */}

        <div className="products-heading">

          <h1>Our Watches</h1>

          <p>
            Explore our latest collection of
            stylish watches.
          </p>

        </div>


        {/* Message */}

        {message && (

          <Alert
            variant="success"
            className="product-message"
            onClose={() => setMessage("")}
            dismissible
          >
            {message}
          </Alert>

        )}


        {/* Product Cards */}

        <Row>

          {products.map((product) => (

            <Col
              md={6}
              lg={4}
              className="mb-4"
              key={product.id}
            >

              <Card className="product-card">


                {/* Product Image */}

                <Card.Img
                  variant="top"
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />


                <Card.Body>


                  {/* Category */}

                  <span className="product-category">
                    {product.category}
                  </span>


                  {/* Product Name */}

                  <Card.Title>
                    {product.name}
                  </Card.Title>


                  {/* Description */}

                  <Card.Text>
                    {product.description}
                  </Card.Text>


                  {/* Price */}

                  <h5 className="product-price">
                    ₹{product.price}
                  </h5>


                  {/* Wishlist */}

                  <Button
                    variant="outline-danger"
                    className="wishlist-button"
                    onClick={() =>
                      addToWishlist(product)
                    }
                  >

                    <FontAwesomeIcon
                      icon={faHeart}
                    />

                  </Button>


                  {/* Add to Cart */}

                  <Button
                    variant="dark"
                    className="cart-button"
                    onClick={() =>
                      addToCart(product)
                    }
                  >

                    <FontAwesomeIcon
                      icon={faCartShopping}
                    />

                    {" "}Add to Cart

                  </Button>


                  {/* Buy Now */}

                  <Button
                    variant="warning"
                    className="buy-button"
                  >

                    <FontAwesomeIcon
                      icon={faBolt}
                    />

                    {" "}Buy Now

                  </Button>


                </Card.Body>

              </Card>

            </Col>

          ))}

        </Row>


      </Container>

    </div>

  );

}


export default Products;