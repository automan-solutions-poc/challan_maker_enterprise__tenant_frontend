import React, { useEffect, useState } from "react";
import { Row, Col, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FileText, Clock, CheckCircle2, Plus, Gauge, ArrowRight, AlertCircle } from "lucide-react";
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
} from "recharts";
import API from "../api";
import Loader from "../components/Loader";
import PageHeader from "../components/PageHeader";
import { useTheme } from "../ThemeContext";
import { getStoredUser } from "../utils/session";

// SVG attributes can't resolve CSS variables, so chart colours are picked per theme here.
const CHART_THEME = {
  light: { bar: "#4f46e5", grid: "rgba(18,20,28,0.07)", axis: "#8a909c", cursor: "rgba(79,70,229,0.06)", pending: "#f59e0b", delivered: "#10b981", other: ["#4f46e5", "#a855f7", "#e11d48"] },
  dark: { bar: "#818cf8", grid: "rgba(238,240,244,0.07)", axis: "#7a8190", cursor: "rgba(129,140,248,0.08)", pending: "#fbbf24", delivered: "#34d399", other: ["#818cf8", "#c084fc", "#fb7185"] },
};

const tooltipStyle = {
  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--border-color)",
  borderRadius: 10,
  boxShadow: "var(--shadow-pop)",
  color: "var(--text-main)",
  fontSize: 13,
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

export default function TenantDashboard() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const colors = CHART_THEME[theme] || CHART_THEME.light;
  const user = getStoredUser();
  const firstName = (user?.name || "").trim().split(/\s+/)[0];

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

  if (loading) return <Loader text="Loading dashboard…" fullscreen />;

  const statusData = (stats.charts?.status_breakdown?.length
    ? stats.charts.status_breakdown
    : [
        { name: "Pending", value: stats.pending },
        { name: "Delivered", value: stats.delivered },
      ]
  ).filter((d) => d.value > 0);

  const colorFor = (name, index) => {
    const key = String(name).toLowerCase();
    if (key.includes("pend")) return colors.pending;
    if (key.includes("deliver")) return colors.delivered;
    return colors.other[index % colors.other.length];
  };

  const statusTotal = statusData.reduce((sum, d) => sum + (d.value || 0), 0);
  const monthData = stats.charts?.challans_by_month || [];

  const usage = stats.usage || {};
  const hasLimit = usage.limit != null && usage.limit !== -1;
  const used = usage.used ?? 0;
  const usedPct = hasLimit ? Math.min((used / Math.max(usage.limit, 1)) * 100, 100) : 0;
  const remaining = hasLimit ? Math.max(usage.limit - used, 0) : null;

  const statCards = [
    { label: "Total challans", value: stats.total ?? 0, icon: FileText, tone: "", foot: "All time" },
    { label: "Pending", value: stats.pending ?? 0, icon: Clock, tone: "tone-warning", foot: "Awaiting pickup" },
    { label: "Delivered", value: stats.delivered ?? 0, icon: CheckCircle2, tone: "tone-success", foot: "OTP verified" },
  ];

  const today = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="page">
      <PageHeader
        eyebrow={today}
        title={firstName ? `${greeting()}, ${firstName}` : greeting()}
        subtitle="Here's how the counter is doing."
        actions={
          <>
            <Button variant="secondary" onClick={() => navigate("/app/challans")}>
              View challans
            </Button>
            <Button onClick={() => navigate("/app/challan/new")}>
              <Plus size={16} /> New challan
            </Button>
          </>
        }
      />

      {error && (
        <Alert variant="danger" className="mb-4">
          <AlertCircle size={16} className="flex-shrink-0 mt-1" /> <span>{error}</span>
        </Alert>
      )}

      <Row className="g-3 mb-3">
        {statCards.map(({ label, value, icon: Icon, tone, foot }) => (
          <Col sm={6} xl={3} key={label}>
            <div className="surface stat-card">
              <div className="d-flex align-items-center justify-content-between">
                <span className="stat-label">{label}</span>
                <span className={`icon-tile ${tone}`} style={{ width: 34, height: 34, borderRadius: 10 }}>
                  <Icon size={17} />
                </span>
              </div>
              <div className="stat-value">{value}</div>
              <div className="stat-foot">{foot}</div>
            </div>
          </Col>
        ))}

        <Col sm={6} xl={3}>
          <div className="surface stat-card d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between">
              <span className="stat-label">PDF quota{usage.month ? ` · ${usage.month}` : ""}</span>
              <span className="icon-tile" style={{ width: 34, height: 34, borderRadius: 10 }}>
                <Gauge size={17} />
              </span>
            </div>
            {hasLimit ? (
              <>
                <div className="stat-value">
                  {used}
                  <span className="text-faint" style={{ fontSize: "1.1rem", fontWeight: 500 }}> / {usage.limit}</span>
                </div>
                <div className={`meter mt-3 ${used >= usage.limit ? "is-full" : ""}`}>
                  <span style={{ width: `${usedPct}%` }} />
                </div>
                <div className="stat-foot">
                  {remaining === 0 ? "Limit reached for this month" : `${remaining} left this month`}
                </div>
              </>
            ) : (
              <>
                <div className="stat-value">∞</div>
                <div className="stat-foot">Unlimited PDFs on your plan</div>
              </>
            )}
          </div>
        </Col>
      </Row>

      {stats.total === 0 && !error ? (
        <div className="surface empty-state">
          <div className="icon-tile mx-auto">
            <FileText size={24} />
          </div>
          <h3>Create your first challan</h3>
          <p>Log a customer's device, and infiChallan generates a branded PDF with a QR code for tracking.</p>
          <Button onClick={() => navigate("/app/challan/new")}>
            <Plus size={16} /> New challan
          </Button>
        </div>
      ) : (
        <Row className="g-3">
          <Col lg={8}>
            <div className="surface surface-pad h-100">
              <div className="d-flex align-items-start justify-content-between gap-3 section-head">
                <div>
                  <h2 className="section-title">Challans over time</h2>
                  <p className="section-desc">New challans created in the last 6 months</p>
                </div>
              </div>
              {monthData.length === 0 ? (
                <p className="text-muted text-center py-5 mb-0">No challan data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={monthData} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke={colors.grid} />
                    <XAxis dataKey="label" tick={{ fill: colors.axis, fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: colors.axis, fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: colors.cursor }} labelStyle={{ color: "var(--text-muted)" }} itemStyle={{ color: "var(--text-main)" }} />
                    <Bar dataKey="count" name="Challans" fill={colors.bar} radius={[6, 6, 0, 0]} maxBarSize={44} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Col>

          <Col lg={4}>
            <div className="surface surface-pad h-100">
              <div className="section-head">
                <h2 className="section-title">Status mix</h2>
                <p className="section-desc">Pending vs delivered</p>
              </div>
              {statusData.length === 0 ? (
                <p className="text-muted text-center py-4 mb-0">No challans yet.</p>
              ) : (
                <>
                  <div className="position-relative">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={62}
                          outerRadius={86}
                          paddingAngle={2}
                          stroke="none"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={entry.name} fill={colorFor(entry.name, index)} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "var(--text-main)" }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="position-absolute top-50 start-50 translate-middle text-center" style={{ pointerEvents: "none" }}>
                      <div className="tabular-nums" style={{ fontSize: "1.6rem", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1, color: "var(--text-main)" }}>{statusTotal}</div>
                      <div className="small text-faint">total</div>
                    </div>
                  </div>
                  <ul className="list-unstyled mb-0 mt-3">
                    {statusData.map((entry, index) => (
                      <li key={entry.name} className="d-flex align-items-center justify-content-between py-2" style={{ borderTop: index ? "1px solid var(--border-color)" : 0 }}>
                        <span className="d-inline-flex align-items-center gap-2 small">
                          <span style={{ width: 8, height: 8, borderRadius: 999, background: colorFor(entry.name, index) }} />
                          {entry.name}
                        </span>
                        <span className="small fw-semibold tabular-nums" style={{ color: "var(--text-main)" }}>
                          {entry.value}
                          <span className="text-faint fw-normal ms-2">
                            {statusTotal ? Math.round((entry.value / statusTotal) * 100) : 0}%
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <Button variant="link" size="sm" className="px-0 mt-2" onClick={() => navigate("/app/challans")}>
                Open challan list <ArrowRight size={14} />
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
}
