import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import watch1 from "../assets/bg.jpeg";

function Login() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    const form = event.currentTarget;

    const email = form.email.value.trim();
    const password = form.password.value;

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      // Check whether user details are available
      if (!data.user || !data.user._id) {
        setError(
          "User details are missing. Please check your backend login API."
        );

        console.log("Login response:", data);
        return;
      }

      // Save login status in localStorage
      localStorage.setItem("isLoggedIn", "true");

      // Save logged-in user details
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(data.user)
      );

      console.log("Logged-in user:", data.user);

      // Notify App.jsx about login status
      window.dispatchEvent(new Event("loginStatusChanged"));

      // Reset form
      form.reset();

      // Show success message
      alert("Login successful!");

      // Navigate to Home
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("Login error:", err);

      setError(
        "Unable to connect to server. Please check whether your backend is running."
      );

      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `url(${watch1})`,
      }}
    >
      <Container>
        <div className="login-box">
          <h1>TIMEZONE</h1>

          <p>Welcome back!</p>

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
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>

              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>

              <Form.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                required
              />
            </Form.Group>

            <Button
              variant="dark"
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form>

          <p className="register-text">
            Don't have an account?{" "}
            <Link to="/register">
              Register
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}

export default Login;