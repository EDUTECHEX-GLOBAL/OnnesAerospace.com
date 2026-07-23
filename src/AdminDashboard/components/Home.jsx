import React, { useEffect, useState } from "react";
import api from "../../api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { FaEnvelope, FaUsers, FaEye, FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa";
import CountUp from "react-countup";

// ─── Stat card config ───────────────────────────────────────────────────────
const CARD_CONFIG = [
  {
    key: "contacts",
    label: "Contacts",
    icon: FaEnvelope,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    shadow: "rgba(102, 126, 234, 0.35)",
  },
  {
    key: "visitors",
    label: "Visitors",
    icon: FaEye,
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    shadow: "rgba(67, 233, 123, 0.35)",
  },
  {
    key: "subscribers",
    label: "Subscribers",
    icon: FaUsers,
    gradient: "linear-gradient(135deg, #fe9496 0%, #ff6b6b 100%)",
    shadow: "rgba(254, 148, 150, 0.35)",
  },
];

const PIE_COLORS = [
  "rgba(155, 49, 146, 0.85)",
  "rgba(89, 11, 247, 0.85)",
  "rgba(251, 122, 58, 0.85)",
];

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: 10,
      padding: "10px 16px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
      fontSize: 13,
      color: "#1a365d",
    }}>
      <p style={{ margin: 0, fontWeight: 600, marginBottom: 4 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ margin: 0, color: "#3b82f6" }}>
          {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

// ─── Custom Pie Label (outside, non-overlapping) ─────────────────────────────
const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
  // Only render label if slice is large enough to show
  if (percent < 0.04) return null;
  const radius = outerRadius + 28;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#475569"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={500}
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const HomeDashboard = () => {
  const [counts, setCounts] = useState({ contacts: 0, visitors: 0, subscribers: 0 });
  const [pctChange, setPctChange] = useState({ contacts: null, visitors: null, subscribers: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [contactRes, visitorRes, subRes] = await Promise.all([
          api.get("/api/admin-contact/count"),
          api.get("/api/admin-visitors/count"),
          api.get("/api/admin-subscribe/count"),
        ]);
        setCounts({
          contacts: contactRes.data.count || 0,
          visitors: visitorRes.data.count || 0,
          subscribers: subRes.data.count || 0,
        });
      } catch (err) {
        console.error("Failed to fetch counts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    const fetchWeekData = async () => {
      try {
        const [c, v, s] = await Promise.all([
          api.get("/api/week-data/contacts"),
          api.get("/api/week-data/visitors"),
          api.get("/api/week-data/subscribers"),
        ]);
        const data = { contacts: c.data, visitors: v.data, subscribers: s.data };
        const pct = {};
        Object.entries(data).forEach(([key, { current, previousWeek }]) => {
          pct[key] = previousWeek === 0 ? null : ((current - previousWeek) / previousWeek) * 100;
        });
        setPctChange(pct);
      } catch (err) {
        console.error("Failed to fetch weekly data:", err);
      }
    };
    fetchWeekData();
  }, []);

  const chartData = [
    { name: "Contacts", value: counts.contacts },
    { name: "Visitors", value: counts.visitors },
    { name: "Subscribers", value: counts.subscribers },
  ];

  return (
    <div style={{ padding: "28px 28px 40px", backgroundColor: "#f0f4f8", minHeight: "100vh" }}>

      {/* ── Page heading ── */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{
          margin: 0,
          fontSize: "1.45rem",
          fontWeight: 700,
          color: "#1a365d",
          letterSpacing: "-0.3px",
        }}>
          Dashboard Overview
        </h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#94a3b8" }}>
          All-time totals and week-over-week change
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 20,
        marginBottom: 28,
      }}>
        {CARD_CONFIG.map(({ key, label, icon: Icon, gradient, shadow }) => {
          const delta = pctChange[key];
          const hasPrev = delta !== null && delta !== undefined;
          const isUp = delta > 0;

          return (
            <div key={key} style={{
              background: gradient,
              borderRadius: 16,
              padding: "22px 24px",
              boxShadow: `0 8px 24px ${shadow}`,
              position: "relative",
              overflow: "hidden",
              color: "#fff",
            }}>
              {/* Decorative circles */}
              <div style={{
                position: "absolute", right: -24, top: -24,
                width: 110, height: 110, borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", right: 18, top: 18,
                width: 44, height: 44, borderRadius: "50%",
                background: "rgba(255,255,255,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
                pointerEvents: "none",
              }}>
                <Icon size={16} color="rgba(255,255,255,0.9)" />
              </div>

              <div style={{ position: "relative", zIndex: 1 }}>
                {/* Label */}
                <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 500, opacity: 0.88 }}>
                  {label}
                </p>

                {/* Count */}
                <p style={{ margin: "0 0 14px", fontSize: "2rem", fontWeight: 800, lineHeight: 1, letterSpacing: "-1px" }}>
                  {loading ? "—" : <CountUp end={counts[key]} duration={2.2} separator="," />}
                </p>

                {/* Trend */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.22)",
                  borderRadius: 20, padding: "4px 10px 4px 8px",
                  fontSize: 12, fontWeight: 500,
                }}>
                  {hasPrev ? (
                    isUp ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />
                  ) : (
                    <FaMinus size={10} />
                  )}
                  <span>
                    {hasPrev
                      ? `${isUp ? "+" : ""}${delta.toFixed(1)}% this week`
                      : "No prior week data"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Charts ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
        gap: 20,
      }}>

        {/* Area chart */}
        <div style={cardStyle}>
          <p style={chartHeading}>Category Trends</p>
          <p style={chartSubheading}>Total count by category</p>
          <div style={{ height: 280, marginTop: 16 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9eef4" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  width={52}
                  tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fill="url(#areaGrad)"
                  dot={{ r: 5, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
                  activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart */}
        <div style={cardStyle}>
          <p style={chartHeading}>Category Distribution</p>
          <p style={chartSubheading}>Proportional breakdown</p>
          <div style={{ height: 280, marginTop: 16 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="46%"
                  outerRadius={95}
                  innerRadius={52}
                  paddingAngle={3}
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value.toLocaleString(), name]}
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                    fontSize: 13,
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12, color: "#64748b", paddingTop: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ── Responsive styles ── */}
      <style>{`
        @media (max-width: 640px) {
          .dashboard-grid-charts {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

// ─── Shared card style object ────────────────────────────────────────────────
const cardStyle = {
  background: "#fff",
  borderRadius: 16,
  padding: "22px 24px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  border: "1px solid #e9eef4",
};

const chartHeading = {
  margin: 0,
  fontSize: "0.95rem",
  fontWeight: 700,
  color: "#1a365d",
};

const chartSubheading = {
  margin: "3px 0 0",
  fontSize: 12,
  color: "#94a3b8",
};

export default HomeDashboard;