import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Alert, Card } from "react-bootstrap";
import { Plus, Users, Trash2, Edit3 } from "lucide-react";
import API from "../api";
import Loader from "../components/Loader";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "tenant_staff" });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/users");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      setMsg("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const resetForm = () => {
    setForm({ name: "", email: "", password: "", role: "tenant_staff" });
    setEditingUser(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const payload = { name: form.name, role: form.role };
        if (form.email) payload.email = form.email;
        const res = await API.put(`/users/${editingUser.id}`, payload);
        setMsg(res.data.message);
      } else {
        const res = await API.post("/users", form);
        setMsg(res.data.message);
      }
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      setMsg(err.response?.data?.error || "Operation failed");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: "", role: user.role });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await API.delete(`/users/${userId}`);
      setMsg(res.data.message);
      fetchUsers();
    } catch (err) {
      setMsg(err.response?.data?.error || "Failed to delete user");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Team Members</h3>
          <p className="text-muted small">Manage users who can access this account.</p>
        </div>
        <Button
          className="btn-gradient d-flex align-items-center gap-2"
          onClick={() => { resetForm(); setShowModal(true); }}
        >
          <Plus size={20} /> Add Member
        </Button>
      </div>

      {msg && <Alert variant="info" className="border-0 shadow-sm mb-4">{msg}</Alert>}

      {loading ? <Loader text="Loading team members..." /> : (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            <Table hover responsive className="mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">No team members found.</td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td className="fw-semibold">
                        <div className="d-flex align-items-center gap-2">
                          <Users size={16} className="text-muted" /> {u.name}
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'tenant_admin' ? 'badge-gradient-primary' : 'bg-info text-white'}`}>
                          {u.role === 'tenant_admin' ? 'Admin' : 'Staff'}
                        </span>
                      </td>
                      <td>
                        {u.is_active ? (
                          <span className="badge bg-success">Active</span>
                        ) : (
                          <span className="badge bg-secondary">Inactive</span>
                        )}
                      </td>
                      <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}</td>
                      <td>
                        <Button size="sm" variant="outline-warning" className="me-2 rounded-pill px-3" onClick={() => handleEdit(u)}>
                          <Edit3 size={14} className="me-1" /> Edit
                        </Button>
                        <Button size="sm" variant="outline-danger" className="rounded-pill px-3" onClick={() => handleDelete(u.id)}>
                          <Trash2 size={14} className="me-1" /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            {editingUser ? "Edit Team Member" : "Add Team Member"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Name</Form.Label>
              <Form.Control value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Email</Form.Label>
              <Form.Control type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </Form.Group>
            {!editingUser && (
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small">Password</Form.Label>
                <Form.Control type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Role</Form.Label>
              <Form.Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="tenant_staff">Staff</option>
                <option value="tenant_admin">Admin</option>
              </Form.Select>
            </Form.Group>
            <Button type="submit" className="btn-gradient w-100 mt-2">
              {editingUser ? "Update" : "Add Member"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
