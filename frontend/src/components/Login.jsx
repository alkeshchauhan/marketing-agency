import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Form,
  Button,
  Spinner,
  Container,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import "../styles/Login.css";

const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    // debug: log current form values
    console.log("Login submit", { email, password, remember });

    try {
      const response = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch (e) {
        console.warn("Could not parse JSON response", e);
      }

      console.log("Login response", response.status, data);

      if (!response.ok) {
        throw new Error((data && data.message) || "Login failed");
      }

      // Save token and user info in localStorage (or session if not remembered)
      try {
        if (remember) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (e) {
        console.warn("Storage error", e);
      }

      // If login successful, redirect to admin dashboard
      if (data && data.user && data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        setError("Access denied. Admin privileges required.");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} sm={10} md={8} lg={5} xl={4}>
            <div className="login-card shadow-lg">
              <div className="login-brand text-center mb-3">
                <div className="logo-circle">MA</div>
                <h5 className="mt-2">Marketing Agency</h5>
              </div>

              <div className="px-4 pb-4">
                <h4 className="mb-3">Admin Sign In</h4>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="loginEmail">
                    <Form.Label className="small">Email</Form.Label>
                    <Form.Control
                      name="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="loginPassword">
                    <Form.Label className="small">Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Check
                      type="checkbox"
                      id="rememberMe"
                      label={<small>Remember me</small>}
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    <a className="small" href="#">
                      Forgot?
                    </a>
                  </div>

                  <div className="d-grid mb-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" />{" "}
                          <span className="ms-2">Signing in...</span>
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </Button>
                  </div>

                  <div className="text-center small text-muted">
                    <span>Use admin credentials to access the dashboard</span>
                  </div>
                </Form>
              </div>
            </div>
            <div className="text-center mt-3 small text-muted">
              © {new Date().getFullYear()} Marketing Agency
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
