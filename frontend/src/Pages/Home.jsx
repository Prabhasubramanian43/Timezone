import { useState } from "react";
import { Link } from "react-router-dom";

import Carousel from "react-bootstrap/Carousel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import "bootstrap/dist/css/bootstrap.min.css";

import watch1 from "../assets/watchh.avif";
import watch2 from "../assets/w1.jpeg";
import watch3 from "../assets/w2.jpeg";

import rolex from "../assets/rol.jpeg";
import casio from "../assets/casio.jpeg";
import fossil from "../assets/foss.jpeg";

function Home() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(false);

  // Submit Customer Feedback
  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;

    const formData = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      feedback: form.elements.feedback.value.trim(),
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to submit feedback!");
        return;
      }

      // Success alert
      alert("Thank you for your feedback!");

      form.reset();

    } catch (error) {
      console.error("Feedback error:", error);

      alert("Unable to connect to server. Please try again.");
    }
  };

  return (<div>
    {/* Company Name */} <section className="company-section"> <h1>TIMEZONE</h1>

      <p>Premium Watches for Every Moment</p>
    </section>

    {/* Hero Slider */}
    <section className="hero-section">
      <Carousel>
        {/* Slide 1 */}
        <Carousel.Item>
          <img
            src={watch1}
            alt="Luxury Watch"
          />

          <Carousel.Caption>
            <h2>Luxury Watches</h2>

            <p>
              Discover premium watches designed with
              style and elegance.
            </p>

            <Link to="/products">
              <Button variant="light">
                Shop Now
              </Button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 2 */}
        <Carousel.Item>
          <img
            src={watch2}
            alt="Classic Watch"
          />

          <Carousel.Caption>
            <h2>Classic Collection</h2>

            <p>
              Timeless designs for your everyday style.
            </p>

            <Link to="/products">
              <Button variant="light">
                Explore Collection
              </Button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 3 */}
        <Carousel.Item>
          <img
            src={watch3}
            alt="Premium Watch"
          />

          <Carousel.Caption>
            <h2>Premium Collection</h2>

            <p>
              Experience quality, comfort and modern design.
            </p>

            <Link to="/products">
              <Button variant="light">
                View Watches
              </Button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </section>

    {/* Customer Feedback */}
    <section className="feedback-section">
      <h2>Customer Feedback</h2>

      <p>We would love to hear from you!</p>

      {/* Success or Error Message */}
      {message && (
        <Alert
          variant={messageType}
          dismissible
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      )}

      {/* Feedback Form */}
      <Form
        className="feedback-form"
        onSubmit={handleSubmit}
      >
        {/* Name */}
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>

          <Form.Control
            type="text"
            name="name"
            placeholder="Enter your name"
            required
          />
        </Form.Group>

        {/* Email */}
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>

          <Form.Control
            type="email"
            name="email"
            placeholder="Enter your email"
            required
          />
        </Form.Group>

        {/* Feedback */}
        <Form.Group className="mb-3">
          <Form.Label>Your Feedback</Form.Label>

          <Form.Control
            as="textarea"
            name="feedback"
            rows={4}
            placeholder="Write your feedback..."
            required
          />
        </Form.Group>

        {/* Submit Button */}
        <Button variant="dark" type="submit">
          Submit Feedback
        </Button>
      </Form>
    </section>

    {/* Our Partners */}
    <section className="partners-section">
      <h2>Our Partners</h2>

      <p>
        We work with trusted watch brands around the world.
      </p>

      <Carousel>
        {/* Rolex */}
        <Carousel.Item>
          <img
            src={rolex}
            alt="Rolex"
          />

          <Carousel.Caption>
            <h3>Rolex</h3>

            <p>
              Rolex is known for luxury watches,
              precision and timeless design.
            </p>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Casio */}
        <Carousel.Item>
          <img
            src={casio}
            alt="Casio"
          />

          <Carousel.Caption>
            <h3>Casio</h3>

            <p>
              Casio offers reliable and stylish watches
              for everyday use.
            </p>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Fossil */}
        <Carousel.Item>
          <img
            src={fossil}
            alt="Fossil"
          />

          <Carousel.Caption>
            <h3>Fossil</h3>

            <p>
              Fossil combines modern fashion with
              classic watch designs.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </section>
  </div>


  );
}

export default Home;
