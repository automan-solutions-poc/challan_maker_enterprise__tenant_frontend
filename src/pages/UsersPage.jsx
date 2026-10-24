import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Alert, Spinner } from "react-bootstrap";
import { UserPlus, Users, Trash2, Pencil, CheckCircle2, AlertCircle } from "lucide-react";
import API from "../api";
import Loader from "../components/Loader";
import PageHeader from "../components/PageHeader";
import PasswordField from "../components/PasswordField";
import { useConfirm } from "../components/ConfirmDialog";
import { trackEvent, Events } from "../analytics";
import { getStoredUser, initialsOf } from "../utils/session";

const EMPTY_FORM = { name: "", email: "", password: "", role: "tenant_staff" };

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [formError, setFormError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [confirm, confirmDialog] = useConfirm();
  const currentUser = getStoredUser();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/users");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      setNotice({ variant: "danger", text: "Failed to load team members." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreate = () => {
    setEditingUser(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: "", role: user.role });
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      if (editingUser) {
        const payload = { name: form.name, role: form.role };
        if (form.email) payload.email = form.email;
        const res = await API.put(`/users/${editingUser.id}`, payload);
        trackEvent(Events.TEAM_USER_UPDATED, { user_id: editingUser.id, role: form.role });
        setNotice({ variant: "success", text: res.data.message || "Team member updated." });
      } else {
        const res = await API.post("/users", form);
        trackEvent(Events.TEAM_USER_CREATED, { role: form.role });
        setNotice({ variant: "success", text: res.data.message || "Team member added." });
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.error || "Operation failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user) => {
    const ok = await confirm({
      title: `Remove ${user.name}?`,
      body: `${user.email} will lose access to this workspace immediately.`,
      confirmLabel: "Remove member",
      tone: "danger",
    });
    if (!ok) return;
    try {
      const res = await API.delete(`/users/${user.id}`);
      trackEvent(Events.TEAM_USER_DELETED, { user_id: user.id });
      setNotice({ variant: "success", text: res.data.message || "Team member removed." });
      fetchUsers();
    } catch (err) {
      setNotice({ variant: "danger", text: err.response?.data?.error || "Failed to delete user." });
    }
  };

  const isSelf = (u) =>
    currentUser && (String(u.id) === String(currentUser.id) || (u.email && u.email === currentUser.email));

  return (
    <div className="page">
      <PageHeader
        eyebrow="Administration"
        title="Team"
        subtitle="Admins manage design, email and people. Staff work on challans."
        actions={
          <Button onClick={openCreate}>
            <UserPlus size={16} /> Add member
          </Button>
        }
      />

      {notice && (
        <Alert variant={notice.variant} dismissible onClose={() => setNotice(null)}>
          {notice.variant === "success" ? (
            <CheckCircle2 size={16} className="flex-shrink-0 mt-1" />
          ) : (
            <AlertCircle size={16} className="flex-shrink-0 mt-1" />
          )}
          <span>{notice.text}</span>
        </Alert>
      )}

      <div className="surface">
        {loading ? (
          <Loader text="Loading team members…" />
        ) : users.length === 0 ? (
          <div className="empty-state">
            <div className="icon-tile mx-auto">
              <Users size={24} />
            </div>
            <h3>No team members yet</h3>
            <p>Add the people who work at your counter so they can create and hand over challans.</p>
            <Button onClick={openCreate}>
              <UserPlus size={16} /> Add member
            </Button>
          </div>
        ) : (
          <div className="data-table-wrap">
            <Table hover className="data-table" style={{ minWidth: 640 }}>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Added</th>
                  <th className="text-end">
                    <span className="visually-hidden">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <span className="avatar">{initialsOf(u.name)}</span>
                        <div className="min-w-0">
                          <div className="cell-primary">
                            {u.name}
                            {isSelf(u) && <span className="text-faint fw-normal ms-2 small">(you)</span>}
                          </div>
                          <div className="cell-sub text-truncate">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill no-dot ${u.role === "tenant_admin" ? "is-accent" : ""}`}>
                        {u.role === "tenant_admin" ? "Admin" : "Staff"}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${u.is_active ? "is-success" : ""}`}>
                        {u.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="text-nowrap">
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
                        : "—"}
                    </td>
                    <td className="text-end text-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="btn-icon"
                        onClick={() => handleEdit(u)}
                        aria-label={`Edit ${u.name}`}
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="btn-icon ms-1 btn-icon-danger"
                        onClick={() => handleDelete(u)}
                        disabled={isSelf(u)}
                        aria-label={`Remove ${u.name}`}
                        title={isSelf(u) ? "You can't remove yourself" : "Remove"}
                      >
                        <Trash2 size={15} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={closeModal} centered>
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title>{editingUser ? "Edit team member" : "Add team member"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formError && (
              <Alert variant="danger">
                <AlertCircle size={16} className="flex-shrink-0 mt-1" /> <span>{formError}</span>
              </Alert>
            )}
            <Form.Group className="mb-3" controlId="tm-name">
              <Form.Label>Name</Form.Label>
              <Form.Control value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="tm-email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </Form.Group>
            {!editingUser && (
              <Form.Group className="mb-3">
                <Form.Label htmlFor="tm-password">Temporary password</Form.Label>
                <PasswordField
                  id="tm-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete="new-password"
                />
                <Form.Text>Share it with them privately; they can sign in right away.</Form.Text>
              </Form.Group>
            )}
            <Form.Group controlId="tm-role">
              <Form.Label>Role</Form.Label>
              <div className="segmented d-flex" role="radiogroup" aria-label="Role">
                {[
                  { value: "tenant_staff", label: "Staff", hint: "Challans only" },
                  { value: "tenant_admin", label: "Admin", hint: "Full access" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={form.role === opt.value}
                    className="flex-fill"
                    onClick={() => setForm({ ...form, role: opt.value })}
                    disabled={editingUser && isSelf(editingUser)}
                  >
                    {opt.label} <span className="text-faint fw-normal">· {opt.hint}</span>
                  </button>
                ))}
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Spinner animation="border" size="sm" />}
              {editingUser ? "Save changes" : "Add member"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {confirmDialog}
    </div>
  );
}
