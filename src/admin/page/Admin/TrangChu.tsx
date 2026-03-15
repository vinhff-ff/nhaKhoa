import React from "react";
import { Card, Col, Row, Progress, Badge } from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const statCards = [
  {
    key: "booked",
    label: "Bệnh nhân đã đặt lịch",
    value: 11,
    trend: "+3",
    trendUp: true,
    icon: <CalendarOutlined />,
    color: "#2e7d32",
    bg: "#e8f5e9",
  },
  {
    key: "pending",
    label: "Cần xác nhận",
    value: 9,
    trend: "+2",
    trendUp: true,
    icon: <ClockCircleOutlined />,
    color: "#f9a825",
    bg: "#fffde7",
  },
  {
    key: "done",
    label: "Lịch khám đã hoàn thành",
    value: 16,
    trend: "+5",
    trendUp: true,
    icon: <CheckCircleOutlined />,
    color: "#1565c0",
    bg: "#e3f2fd",
  },
  {
    key: "cancelled",
    label: "Lịch hẹn hủy",
    value: 11,
    trend: "-2",
    trendUp: false,
    icon: <CloseCircleOutlined />,
    color: "#c62828",
    bg: "#ffebee",
  },
];

const infoCards = [
  {
    key: "doctor",
    label: "Bác sĩ đang hoạt động",
    value: 24,
    sub: "8 bác sĩ trực hôm nay",
    icon: <MedicineBoxOutlined />,
    color: "#7b1fa2",
    bg: "#f3e5f5",
  },
  {
    key: "patient",
    label: "Tổng bệnh nhân",
    value: 1240,
    sub: "↑ 12% so với tháng trước",
    icon: <UserOutlined />,
    color: "#00695c",
    bg: "#e0f2f1",
  },
  {
    key: "revenue",
    label: "Doanh thu tháng",
    value: "142M",
    sub: "Mục tiêu: 200M",
    icon: <CheckCircleOutlined />,
    color: "#e65100",
    bg: "#fff3e0",
  },
  {
    key: "rate",
    label: "Tỷ lệ hài lòng",
    value: "94%",
    sub: "↑ 2% so với tháng trước",
    icon: <CheckCircleOutlined />,
    color: "#1565c0",
    bg: "#e3f2fd",
  },
];

const ageData = [
  { label: "Dưới 14 tuổi", pct: 9.1 },
  { label: "Từ 15 – 35 tuổi", pct: 72.7 },
  { label: "Từ 36 – 64 tuổi", pct: 18.2 },
  { label: "Từ 65 tuổi", pct: 0 },
];

const pieData = [
  { name: "Đã đặt lịch", value: 30, color: "#f5e27a" },
  { name: "Hoàn thành", value: 44, color: "#64b5f6" },
  { name: "Đã hủy", value: 26, color: "#f48fb1" },
];

const barData = [
  { month: "T1", booked: 40, done: 30, cancelled: 8 },
  { month: "T2", booked: 52, done: 45, cancelled: 10 },
  { month: "T3", booked: 61, done: 55, cancelled: 7 },
  { month: "T4", booked: 48, done: 40, cancelled: 12 },
  { month: "T5", booked: 70, done: 63, cancelled: 9 },
  { month: "T6", booked: 65, done: 58, cancelled: 11 },
  { month: "T7", booked: 80, done: 72, cancelled: 6 },
  { month: "T8", booked: 74, done: 67, cancelled: 8 },
  { month: "T9", booked: 90, done: 82, cancelled: 10 },
  { month: "T10", booked: 85, done: 77, cancelled: 7 },
  { month: "T11", booked: 95, done: 88, cancelled: 9 },
  { month: "T12", booked: 110, done: 100, cancelled: 11 },
];

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}: any) => {
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  if (percent < 0.05) return null;
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// ─── Component ───────────────────────────────────────────────
const TrangChu: React.FC = () => {
  return (
    <div className="trangchu">

      {/* ── ROW 1: 4 stat cards (column layout inside each card) ── */}
      <Row gutter={[16, 16]} className="trangchu__stat-row">
        {statCards.map((c) => (
          <Col xs={24} sm={12} lg={6} key={c.key}>
            <Card className="trangchu__stat-card" bordered={false}>
              <div className="stat-icon-box" style={{ background: c.bg, color: c.color }}>
                {c.icon}
              </div>
              <div className="stat-label">{c.label}</div>
              <div className="stat-value" style={{ color: c.color }}>{c.value}</div>
              <div className={`stat-trend ${c.trendUp ? "up" : "down"}`}>
                {c.trendUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                <span>{c.trend} so với hôm qua</span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ── ROW 2: 4 info cards (flex horizontal inside each card) ── */}
      <Row gutter={[16, 16]} className="trangchu__info-row">
        {infoCards.map((c) => (
          <Col xs={24} sm={12} lg={6} key={c.key}>
            <Card className="trangchu__info-card" bordered={false}>
              <div className="info-icon-wrap" style={{ background: c.bg, color: c.color }}>
                {c.icon}
              </div>
              <div className="info-body">
                <div className="info-label">{c.label}</div>
                <div className="info-value" style={{ color: c.color }}>{c.value}</div>
                <div className="info-sub">{c.sub}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ── ROW 3: 3 chart cards ── */}
      <Row gutter={[16, 16]} className="trangchu__chart-row">

        {/* Card 1: Phân bố độ tuổi */}
        <Col xs={24} md={8}>
          <Card
            className="trangchu__chart-card"
            bordered={false}
            title={<span className="chart-title">Phân bố độ tuổi bệnh nhân</span>}
          >
            <div className="age-list">
              {ageData.map((a) => (
                <div className="age-item" key={a.label}>
                  <div className="age-header">
                    <span className="age-label">{a.label}</span>
                    <span className="age-pct">{a.pct}%</span>
                  </div>
                  <Progress
                    percent={a.pct}
                    showInfo={false}
                    strokeColor="#1565c0"
                    trailColor="#e8eef8"
                    size="small"
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Card 2: Tỷ lệ trạng thái */}
        <Col xs={24} md={8}>
          <Card
            className="trangchu__chart-card"
            bordered={false}
            title={<span className="chart-title">Tỷ lệ trạng thái lịch hẹn</span>}
          >
            <div className="pie-wrap">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomLabel}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>

              <div className="pie-legend">
                {pieData.map((d) => (
                  <div className="legend-item" key={d.name}>
                    <span className="legend-dot" style={{ background: d.color }} />
                    <span>{d.name}</span>
                    <span className="legend-val">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Col>

        {/* Card 3: Biểu đồ cột theo tháng */}
        <Col xs={24} md={8}>
          <Card
            className="trangchu__chart-card"
            bordered={false}
            title={<span className="chart-title">Thống kê lịch hẹn theo tháng</span>}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData} margin={{ top: 4, right: 4, left: -18, bottom: 0 }} barSize={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#90a4ae" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#90a4ae" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "0.5px solid #e0e0e0", fontSize: 12 }}
                  cursor={{ fill: "rgba(0,0,0,0.03)" }}
                />
                <Legend
                  iconType="square"
                  iconSize={9}
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                  formatter={(v) =>
                    v === "booked" ? "Đã đặt" : v === "done" ? "Hoàn thành" : "Đã hủy"
                  }
                />
                <Bar dataKey="booked" fill="#64b5f6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="done" fill="#81c784" radius={[3, 3, 0, 0]} />
                <Bar dataKey="cancelled" fill="#f48fb1" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

      </Row>
    </div>
  );
};

export default TrangChu;