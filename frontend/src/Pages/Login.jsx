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

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;

    const email = form.email.value;
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

      if (response.ok) {
        setMessage(data.message);
        setError("");

        localStorage.setItem("isLoggedIn", "true");

        form.reset();

        navigate("/home");
      } else {
        setError(data.message);
        setMessage("");
      }
    } catch (error) {
      console.log(error);

      setError("Unable to connect to server.");
      setMessage("");
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
            >
              Login
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