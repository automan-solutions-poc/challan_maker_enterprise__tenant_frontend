import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FileText, Clock, CheckCircle, Plus } from "lucide-react";
import API from "../api";
import Loader from "../components/Loader";

export default function TenantDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, pending: 0, delivered: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error("❌ Error fetching dashboard stats:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Loader text="Loading Dashboard..." />;

  const statCards = [
    {
      title: "Total Challans",
      value: stats.total ?? 0,
      icon: <FileText size={24} />,
      gradient: "var(--primary-gradient)",
      textColor: "white",
    },
    {
      title: "Pending",
      value: stats.pending ?? 0,
      icon: <Clock size={24} />,
      gradient: "var(--warning-gradient)",
      textColor: "white",
    },
    {
      title: "Delivered",
      value: stats.delivered ?? 0,
      icon: <CheckCircle size={24} />,
      gradient: "var(--success-gradient)",
      textColor: "white",
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">Dashboard Overview</h3>
        <Button
          onClick={() => navigate("/app/challan/new")}
          variant="primary"
          className="d-flex align-items-center gap-2 shadow-sm px-4 py-2"
          style={{ borderRadius: '12px', fontWeight: '600' }}
        >
          <Plus size={20} /> Create New
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="border-0 shadow-sm mb-4">
          {error}
        </Alert>
      )}

      <Row className="g-4">
        {statCards.map((card, idx) => (
          <Col md={4} key={idx}>
            <Card className="h-100 p-4 border-0 position-relative overflow-hidden">
              <div
                className="position-absolute"
                style={{
                  top: '-20px',
                  right: '-20px',
                  width: '100px',
                  height: '100px',
                  background: card.gradient,
                  opacity: '0.1',
                  borderRadius: '50%',
                }}
              />
              <div className="d-flex align-items-center mb-3">
                <div
                  className="rounded-3 p-3 me-3 d-flex align-items-center justify-content-center"
                  style={{
                    background: card.gradient,
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  {card.icon}
                </div>
                <h6 className="text-muted fw-bold mb-0">{card.title}</h6>
              </div>
              <div className="display-5 fw-bold">{card.value}</div>
              <div className="mt-2">
                <small className="text-success fw-semibold">
                  Updated just now
                </small>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Placeholder for more dashboard content */}
      <div className="mt-5">
        <Card className="p-5 border-0 text-center">
            <div className="mb-4">
                <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
                    <FileText size={48} className="text-primary" />
                </div>
                <h4>Recent Activity</h4>
                <p className="text-muted">Your recent challans and updates will appear here.</p>
            </div>
            <div>
                <Button variant="outline-primary" onClick={() => navigate("/app/challans")}>
                    View All Challans
                </Button>
            </div>
        </Card>
      </div>
    </div>
  );
}
