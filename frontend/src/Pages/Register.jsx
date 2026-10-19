import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";

import watch1 from "../assets/bgi.jpeg";

function Register() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;

    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const address = form.address.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    // Check password
    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match.");
      setMessage("");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            mobile: phone,
            address,
            password,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");

        form.reset();

        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      setError("Unable to connect to server.");
      setMessage("");
    }
  };

  return (
    <div
      className="register-page"
      style={{
        backgroundImage: `url(${watch1})`,
      }}
    >
      <Container>
        <div className="register-box">

          <h1>TIMEZONE</h1>

          <p>Create your account</p>

          {message && (
            <Alert variant="success">
              {message}
            </Alert>
          )}

          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>

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

            {/* Phone Number */}
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>

              <Form.Control
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                required
              />
            </Form.Group>

            {/* Address */}
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>

              <Form.Control
                as="textarea"
                name="address"
                rows={3}
                placeholder="Enter your address"
                required
              />
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>

              <Form.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                required
              />
            </Form.Group>

            {/* Confirm Password */}
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>

              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                required
              />
            </Form.Group>

            <Button
              variant="dark"
              type="submit"
              className="register-button"
            >
              Register
            </Button>

          </Form>

          <p className="login-text">
            Already have an account?{" "}

            <Link to="/login">
              Login
            </Link>
          </p>

        </div>
      </Container>
    </div>
  );
}

export default Register;