import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import watch1 from "../assets/bgi.jpeg";

function Register() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setMessage("");
    setError("");

    const form = event.currentTarget;

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const address = form.address.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    // Validate customer details
    if (!name || !email || !phone || !address || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    // Check password
    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

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

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Invalid server response. Please check your backend API."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed. Please try again."
        );
      }

      setMessage(
        data.message || "Registration successful! Please login."
      );

      form.reset();

      // Redirect to login after successful registration
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (err) {
      console.error("Registration error:", err);

      if (
        err instanceof TypeError &&
        err.message.toLowerCase().includes("fetch")
      ) {
        setError(
          "Unable to connect to server. Please start your backend server."
        );
      } else {
        setError(
          err.message || "Unable to register. Please try again."
        );
      }

      setMessage("");
    } finally {
      setLoading(false);
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
                autoComplete="name"
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
                autoComplete="email"
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
                autoComplete="tel"
                pattern="[0-9]{10}"
                maxLength={10}
                title="Enter a 10-digit phone number"
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
                autoComplete="street-address"
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
                autoComplete="new-password"
                minLength={6}
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
                autoComplete="new-password"
                minLength={6}
                required
              />
            </Form.Group>

            <Button
              variant="dark"
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
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
