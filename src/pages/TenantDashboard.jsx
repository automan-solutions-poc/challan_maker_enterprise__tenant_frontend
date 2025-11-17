import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../api"; // Make sure this points to your axios instance (baseURL: /api/tenant)
import Loader from "../compopnents/Loader";

export default function TenantDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, pending: 0, delivered: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard data
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

  if (loading)
    return (
     <Loader text="Loading Dashboard..." />
    );

  return (
    <div>
      <h3>Dashboard</h3>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      <Row className="g-3 mt-3">
        <Col md={4}>
          <Card className="p-3 shadow-sm border-0">
            <h5 className="text-secondary">Total Challans</h5>
            <div className="display-6 fw-bold text-dark">
              {stats.total ?? 0}
            </div>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-3 shadow-sm border-0">
            <h5 className="text-secondary">Pending</h5>
            <div className="display-6 fw-bold text-warning">
              {stats.pending ?? 0}
            </div>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-3 shadow-sm border-0">
            <h5 className="text-secondary">Delivered</h5>
            <div className="display-6 fw-bold text-success">
              {stats.delivered ?? 0}
            </div>
          </Card>
        </Col>
      </Row>

      <div className="mt-4">
        <Button
          onClick={() => navigate("/app/challan/new")}
          variant="primary"
          size="md"
          className="px-4"
        >
          + Create New Challan
        </Button>
      </div>
    </div>
  );
}
