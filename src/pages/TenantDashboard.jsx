import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FileText, Clock, CheckCircle, Plus } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import API from "../api";
import Loader from "../components/Loader";

const PIE_COLORS = ["#f59e0b", "#22c55e", "#3b82f6", "#ef4444", "#a855f7"];
const BAR_COLOR = "#3b82f6";

const chartTooltipStyle = {
  backgroundColor: "rgba(15, 23, 42, 0.95)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  color: "#f8fafc",
};

export default function TenantDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    delivered: 0,
    usage: {},
    charts: { status_breakdown: [], challans_by_month: [] },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/dashboard");
        setStats({
          total: res.data.total ?? 0,
          pending: res.data.pending ?? 0,
          delivered: res.data.delivered ?? 0,
          usage: res.data.usage || {},
          charts: res.data.charts || {
            status_breakdown: [],
            challans_by_month: [],
          },
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Loader text="Loading Dashboard..." />;

  const statusData = stats.charts?.status_breakdown?.length
    ? stats.charts.status_breakdown
    : [
        { name: "Pending", value: stats.pending },
        { name: "Delivered", value: stats.delivered },
      ].filter((d) => d.value > 0);

  const monthData = stats.charts?.challans_by_month || [];

  const usage = stats.usage || {};
  const pdfChartData =
    usage.limit != null && usage.limit >= 0
      ? [
          { name: "Used", value: usage.used ?? 0 },
          { name: "Remaining", value: Math.max(0, (usage.limit ?? 0) - (usage.used ?? 0)) },
        ]
      : [];

  const statCards = [
    {
      title: "Total Challans",
      value: stats.total ?? 0,
      icon: <FileText size={24} />,
      gradient: "var(--primary-gradient)",
    },
    {
      title: "Pending",
      value: stats.pending ?? 0,
      icon: <Clock size={24} />,
      gradient: "var(--warning-gradient)",
    },
    {
      title: "Delivered",
      value: stats.delivered ?? 0,
      icon: <CheckCircle size={24} />,
      gradient: "var(--success-gradient)",
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Dashboard</h3>
          <p className="text-muted small">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <Button
          onClick={() => navigate("/app/challan/new")}
          className="btn-gradient d-flex align-items-center gap-2"
        >
          <Plus size={20} /> Create New
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="border-0 shadow-sm mb-4">
          {error}
        </Alert>
      )}

      <Row className="g-4 mb-4">
        {statCards.map((card, idx) => (
          <Col md={4} key={idx}>
            <Card className="h-100 p-4 border-0 position-relative overflow-hidden">
              <div
                className="position-absolute"
                style={{
                  top: "-20px",
                  right: "-20px",
                  width: "100px",
                  height: "100px",
                  background: card.gradient,
                  opacity: "0.1",
                  borderRadius: "50%",
                }}
              />
              <div className="d-flex align-items-center mb-3">
                <div
                  className="rounded-4 p-3 me-3 d-flex align-items-center justify-content-center"
                  style={{
                    background: card.gradient,
                    color: "white",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  }}
                >
                  {card.icon}
                </div>
                <h6
                  className="text-muted fw-bold mb-0"
                  style={{ fontSize: "0.8rem", letterSpacing: "0.02rem" }}
                >
                  {card.title.toUpperCase()}
                </h6>
              </div>
              <div className="display-5 fw-bold">{card.value}</div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm p-4 h-100">
            <h5 className="fw-bold mb-1">Challans over time</h5>
            <p className="text-muted small mb-4">New challans created — last 6 months</p>
            {monthData.length === 0 ? (
              <p className="text-muted text-center py-5">No challan data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                  <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="count" name="Challans" fill={BAR_COLOR} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm p-4 h-100 mb-4 mb-lg-0">
            <h5 className="fw-bold mb-1">Status mix</h5>
            <p className="text-muted small mb-3">Pending vs delivered</p>
            {statusData.length === 0 ? (
              <p className="text-muted text-center py-4">No challans yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>

      {pdfChartData.length > 0 && (
        <Row className="g-4 mt-1">
          <Col md={6} lg={4}>
            <Card className="border-0 shadow-sm p-4">
              <h5 className="fw-bold mb-1">PDF quota</h5>
              <p className="text-muted small mb-3">
                {usage.month} — {usage.used} / {usage.limit === -1 ? "∞" : usage.limit} used
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pdfChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#334155" />
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      )}

      <div className="mt-4 text-end">
        <Button variant="outline-primary" onClick={() => navigate("/app/challans")}>
          View all challans
        </Button>
      </div>
    </div>
  );
}
