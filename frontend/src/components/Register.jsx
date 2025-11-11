import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import "../styles/Register.css";

const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "male",
    profilePicture: null,
  });

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // preview when profilePicture is a File or Data URL
  useEffect(() => {
    if (!formData.profilePicture) return setPreview("");
    if (typeof formData.profilePicture === "string")
      return setPreview(formData.profilePicture);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(formData.profilePicture);
  }, [formData.profilePicture]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      setFormData((s) => ({ ...s, profilePicture: files[0] || null }));
    } else {
      setFormData((s) => ({ ...s, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // convert image to base64 if present to keep backend simple
    let profileBase64 = null;
    if (formData.profilePicture && formData.profilePicture instanceof File) {
      profileBase64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result);
        r.onerror = rej;
        r.readAsDataURL(formData.profilePicture);
      }).catch(() => null);
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        profilePicture: profileBase64,
      };

      const res = await fetch(`${apiBase}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      setSuccess(data.message || "Registered successfully");
      setFormData({
        name: "",
        email: "",
        password: "",
        gender: "male",
        profilePicture: null,
      });
      setPreview("");
    } catch (err) {
      setError(err.message || "Error registering user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <div className="register-card shadow-sm">
              <div className="register-brand text-center p-4">
                <div className="logo-circle">MA</div>
                <h5 className="mt-2">Create Account</h5>
                <p className="text-muted small">
                  Fill the details to create your admin user
                </p>
              </div>

              <div className="p-4 pt-0">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && (
                  <div className="alert alert-success">{success}</div>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="rName">
                    <Form.Label>Full name</Form.Label>
                    <Form.Control
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="rEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="rPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Choose a password"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="rGender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="rProfile">
                    <Form.Label>Profile picture</Form.Label>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ width: 64, height: 64 }}>
                        {preview ? (
                          <Image
                            src={preview}
                            rounded
                            width={64}
                            height={64}
                            alt="preview"
                          />
                        ) : (
                          <div className="avatar-placeholder">N/A</div>
                        )}
                      </div>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        name="profile"
                        onChange={(e) =>
                          handleChange({
                            target: {
                              name: "profilePicture",
                              files: e.target.files,
                              type: "file",
                            },
                          })
                        }
                      />
                    </div>
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create account"}
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
