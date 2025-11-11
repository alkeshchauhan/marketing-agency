import React, { useEffect, useState } from "react";
import "../styles/UsersDetails.css";
import Swal from "sweetalert2";
import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Alert,
  Spinner,
  Table,
  Image,
  Modal,
} from "react-bootstrap";

const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function UsersDetails() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("male");
  const [profileFile, setProfileFile] = useState(null);
  const [profileBase64, setProfileBase64] = useState("");

  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [statusLoading, setStatusLoading] = useState(null);

  const handleStatusChange = async (userId, newStatus, currentStatus) => {
    if (!userId) return;

    try {
      // Show sweet alert confirmation
      const result = await Swal.fire({
        title: "Change Status?",
        html: `Are you sure you want to change user status from <b>${currentStatus}</b> to <b>${newStatus}</b>?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: newStatus === "active" ? "#4caf50" : "#ef5350",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, change it!",
        cancelButtonText: "Cancel",
        customClass: {
          title: "fw-semibold",
          htmlContainer: "text-center my-3",
        },
      });

      if (!result.isConfirmed) {
        // Reset the select back to original value if user cancels
        setUsers(users.map((u) => u)); // This forces a re-render with original values
        return;
      }

      // Show loading state
      Swal.fire({
        title: "Updating Status...",
        html: "Please wait",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      setStatusLoading(userId);
      const res = await fetch(`${apiBase}/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || `Server responded ${res.status}`);

      // Update user in the list
      setUsers(
        users.map((u) =>
          u.id === userId || u._id === userId ? { ...u, status: newStatus } : u
        )
      );

      // Show success message
      await Swal.fire({
        title: "Status Updated!",
        html: `User status has been changed to <b>${newStatus}</b>`,
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        customClass: {
          title: "fw-semibold",
          htmlContainer: "text-center my-3",
        },
      });
    } catch (err) {
      // Show error message
      await Swal.fire({
        title: "Error!",
        text: `Failed to update status: ${err.message}`,
        icon: "error",
        customClass: {
          title: "fw-semibold",
        },
      });
      // Reset the select back to original value on error
      setUsers(users.map((u) => u));
    } finally {
      setStatusLoading(null);
    }
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const handleEdit = (user) => {
    // pre-fill form for editing
    setName(user.name || "");
    setEmail(user.email || "");
    setGender(user.gender || "male");
    setProfileBase64(user.profilePicture || "");
    setProfileFile(null);
    setPassword(""); // leave empty unless changing
    setIsEdit(true);
    setEditingUserId(user.id || user._id || null);
    setFormError(null);
    setFormSuccess(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!id) return;
    const confirm = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirm) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${apiBase}/api/users/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || `Server responded ${res.status}`);
      // refresh list
      const listRes = await fetch(`${apiBase}/api/users/`);
      const listData = await listRes.json();
      setUsers(Array.isArray(listData) ? listData : []);
    } catch (err) {
      setError(err.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const abort = new AbortController();

    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${apiBase}/api/users/`, {
          signal: abort.signal,
        });
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== "AbortError")
          setError(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
    return () => abort.abort();
  }, []);

  // convert file to base64 string (data URL) and compress if needed
  useEffect(() => {
    if (!profileFile) {
      setProfileBase64("");
      return;
    }

    // Check file size
    if (profileFile.size > 1024 * 1024) {
      console.log("Large image detected, compressing...");
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        // For images larger than 1MB, compress them
        if (profileFile.size > 1024 * 1024) {
          const img = new Image();
          img.src = reader.result;
          await new Promise((resolve) => {
            img.onload = () => {
              const canvas = document.createElement("canvas");
              let width = img.width;
              let height = img.height;

              // Calculate new dimensions (max 800px)
              if (width > height) {
                if (width > 800) {
                  height *= 800 / width;
                  width = 800;
                }
              } else {
                if (height > 800) {
                  width *= 800 / height;
                  height = 800;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0, width, height);

              // Convert to base64 with compression
              const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
              console.log("Original size:", reader.result.length);
              console.log("Compressed size:", compressedBase64.length);
              setProfileBase64(compressedBase64);
              resolve();
            };
          });
        } else {
          console.log("Small image, using as is. Size:", reader.result.length);
          setProfileBase64(reader.result);
        }
      } catch (err) {
        console.error("Error processing image:", err);
        setFormError("Error processing image. Please try a different one.");
        setProfileBase64("");
      }
    };
    reader.onerror = () => {
      console.error("Error reading file");
      setFormError("Error reading image file. Please try again.");
      setProfileBase64("");
    };
    reader.readAsDataURL(profileFile);
  }, [profileFile]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setGender("male");
    setProfileFile(null);
    setProfileBase64("");
    setFormError(null);
    setFormSuccess(null);
    setIsEdit(false);
    setEditingUserId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!name || !email || (!isEdit && !password))
      return setFormError("Name, email and password are required");

    // Prepare the payload
    const payload = {
      name,
      email,
      gender,
      profilePicture: profileBase64 || null,
    };

    // Log the profile picture size for debugging
    if (profileBase64) {
      console.log("Sending profile picture, size:", profileBase64.length);
    }

    // include password only when creating or when explicitly provided during edit
    if (!isEdit || (isEdit && password)) payload.password = password;

    try {
      setFormLoading(true);
      const url =
        isEdit && editingUserId
          ? `${apiBase}/api/users/${editingUserId}`
          : `${apiBase}/api/users/`;
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || `Server responded ${res.status}`);
      setFormSuccess(
        isEdit ? "User updated successfully" : "User created successfully"
      );
      resetForm();
      // refresh list
      const listRes = await fetch(`${apiBase}/api/users/`);
      const listData = await listRes.json();
      setUsers(Array.isArray(listData) ? listData : []);
      return true;
    } catch (err) {
      setFormError(err.message || "Failed to create user");
      return false;
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Users</h3>
        <div>
          <Button variant="primary" onClick={openModal}>
            Add User
          </Button>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit User" : "Add User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          {formSuccess && <Alert variant="success">{formSuccess}</Alert>}

          <Form
            onSubmit={async (e) => {
              const ok = await handleSubmit(e);
              if (ok) closeModal();
            }}
          >
            <Row>
              <Col md={12}>
                <Form.Group className="mb-2" controlId="uName">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-2" controlId="uEmail">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-2" controlId="uPassword">
                  <Form.Label>
                    Password {isEdit ? "(leave blank to keep current)" : "*"}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-2" controlId="uGender">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2" controlId="uProfile">
                  <Form.Label>Profile Picture</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setProfileFile(e.target.files && e.target.files[0])
                    }
                  />
                  {profileBase64 && (
                    <div className="mt-2 text-center">
                      <Image
                        src={profileBase64}
                        alt="Profile preview"
                        rounded
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={() => {
                  resetForm();
                  closeModal();
                }}
                className="me-2"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading
                  ? "Saving..."
                  : isEdit
                  ? "Save Changes"
                  : "Create User"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* <h3 className="mb-3">Users</h3> */}
      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">Error loading users: {error}</Alert>
      ) : !users.length ? (
        <Alert variant="info">No users found.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr key={u.id || idx}>
                <td>{idx + 1}</td>
                <td style={{ width: 90 }}>
                  {u.profilePicture ? (
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={u.profilePicture}
                        rounded
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                        alt={u.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            u.name
                          )}&background=random`;
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          u.name
                        )}&background=random`}
                        rounded
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                        alt={u.name}
                      />
                    </div>
                  )}
                </td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.gender}</td>
                <td>
                  <Form.Select
                    size="sm"
                    value={u.status || "active"}
                    onChange={(e) =>
                      handleStatusChange(
                        u.id || u._id,
                        e.target.value,
                        u.status || "active"
                      )
                    }
                    style={{
                      width: "auto",
                      minWidth: "100px",
                      cursor: "pointer",
                    }}
                    className={`status-${u.status || "active"}`}
                    disabled={statusLoading === (u.id || u._id)}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Form.Select>
                  {statusLoading === (u.id || u._id) && (
                    <div className="status-loading">
                      <Spinner animation="border" size="sm" />
                    </div>
                  )}
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => handleEdit(u)}
                  >
                    ✏️ Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleDelete(u.id || u._id)}
                  >
                    🗑️ Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default UsersDetails;
