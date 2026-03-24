import React, { useEffect, useState } from "react";
import { Card, Col, Row, Progress, Spin } from "antd";
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
import { bieuDoTron, phanBoDoTuoi, thongKeTQ } from "../../../api/admin";

// ─── Types ────────────────────────────────────────────────────
interface BarItem {
  month: number;
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
}

interface PieItem {
  status: string;
  total: number;
  percentage: number;
}

interface AgeItem {
  ageGroup: string;
  total: number;
  percentage: number;
}

interface Overview {
  totalBooked: number;
  totalBookedChange: number;
  totalPending: number;
  totalPendingChange: number;
  totalConfirmed: number;
  totalConfirmedChange: number;
  totalCancelled: number;
  totalCancelledChange: number;
  totalDoctors: number;
  totalCustomers: number;
}

// ─── Helpers ──────────────────────────────────────────────────
const MONTH_LABEL = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"];

const PIE_COLOR_MAP: Record<string, string> = {
  CONFIRMED: "#64b5f6",
  PENDING:   "#f5e27a",
  CANCELLED: "#f48fb1",
};

const PIE_LABEL_MAP: Record<string, string> = {
  CONFIRMED: "Đã xác nhận",
  PENDING:   "Chờ xác nhận",
  CANCELLED: "Đã hủy",
};

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
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

const trendLabel = (change: number) => {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(0)}% so với tháng trước`;
};

// ─── Component ───────────────────────────────────────────────
const TrangChu: React.FC = () => {
  const [overview, setOverview]   = useState<Overview | null>(null);
  const [pieList, setPieList]     = useState<PieItem[]>([]);
  const [ageList, setAgeList]     = useState<AgeItem[]>([]);
  const [barList, setBarList]     = useState<BarItem[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [overviewRes, pieRes, ageRes] = await Promise.all([
          thongKeTQ(),
          bieuDoTron(),
          phanBoDoTuoi(),
        ]);
        setOverview(overviewRes);
        setPieList(pieRes);
        setAgeList(ageRes);
        // bieuDoTron trả về mảng theo tháng — dùng luôn cho bar chart
        // Nếu backend có API riêng cho bar chart thì thay ở đây
        setBarList(pieRes.length ? overviewRes._barData ?? [] : []);
      } catch (err) {
        console.error("Lỗi tải dữ liệu dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Stat cards từ overview ──
  const statCards = overview
    ? [
        {
          key: "booked",
          label: "Bệnh nhân đã đặt lịch",
          value: overview.totalBooked,
          trend: trendLabel(overview.totalBookedChange),
          trendUp: overview.totalBookedChange >= 0,
          icon: <CalendarOutlined />,
          color: "#2e7d32",
          bg: "#e8f5e9",
        },
        {
          key: "pending",
          label: "Cần xác nhận",
          value: overview.totalPending,
          trend: trendLabel(overview.totalPendingChange),
          trendUp: overview.totalPendingChange >= 0,
          icon: <ClockCircleOutlined />,
          color: "#f9a825",
          bg: "#fffde7",
        },
        {
          key: "confirmed",
          label: "Lịch khám đã xác nhận",
          value: overview.totalConfirmed,
          trend: trendLabel(overview.totalConfirmedChange),
          trendUp: overview.totalConfirmedChange >= 0,
          icon: <CheckCircleOutlined />,
          color: "#1565c0",
          bg: "#e3f2fd",
        },
        {
          key: "cancelled",
          label: "Lịch hẹn hủy",
          value: overview.totalCancelled,
          trend: trendLabel(overview.totalCancelledChange),
          trendUp: overview.totalCancelledChange >= 0,
          icon: <CloseCircleOutlined />,
          color: "#c62828",
          bg: "#ffebee",
        },
      ]
    : [];

  // ── Info cards từ overview ──
  const infoCards = overview
    ? [
        {
          key: "doctor",
          label: "Bác sĩ đang hoạt động",
          value: overview.totalDoctors,
          sub: "Tổng số bác sĩ trong hệ thống",
          icon: <MedicineBoxOutlined />,
          color: "#7b1fa2",
          bg: "#f3e5f5",
        },
        {
          key: "patient",
          label: "Tổng bệnh nhân",
          value: overview.totalCustomers,
          sub: "Tổng số khách hàng đã đăng ký",
          icon: <UserOutlined />,
          color: "#00695c",
          bg: "#e0f2f1",
        },
      ]
    : [];

  // ── Bar chart data: map month số → label ──
  const barChartData = barList.map((item) => ({
    month: MONTH_LABEL[(item.month ?? 1) - 1] ?? `T${item.month}`,
    booked: item.total,
    confirmed: item.confirmed,
    cancelled: item.cancelled,
    pending: item.pending,
  }));

  // ── Pie chart data ──
  const pieChartData = pieList.map((item) => ({
    name:  PIE_LABEL_MAP[item.status] ?? item.status,
    value: item.percentage,
    color: PIE_COLOR_MAP[item.status] ?? "#90a4ae",
  }));

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div className="trangchu">

      {/* ── ROW 1: 4 stat cards ── */}
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
                <span>{c.trend}</span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ── ROW 2: info cards ── */}
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
              {ageList.map((a) => (
                <div className="age-item" key={a.ageGroup}>
                  <div className="age-header">
                    <span className="age-label">{a.ageGroup}</span>
                    <span className="age-pct">{a.percentage.toFixed(1)}%</span>
                  </div>
                  <Progress
                    percent={a.percentage}
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

        {/* Card 2: Tỷ lệ trạng thái (Pie) */}
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
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomLabel}
                  >
                    {pieChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>

              <div className="pie-legend">
                {pieChartData.map((d) => (
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
            {barChartData.length === 0 ? (
              <div style={{ textAlign: "center", color: "#90a4ae", padding: "40px 0" }}>
                Chưa có dữ liệu
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={barChartData}
                  margin={{ top: 4, right: 4, left: -18, bottom: 0 }}
                  barSize={6}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#90a4ae" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#90a4ae" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "0.5px solid #e0e0e0", fontSize: 12 }}
                    cursor={{ fill: "rgba(0,0,0,0.03)" }}
                  />
                  <Legend
                    iconType="square"
                    iconSize={9}
                    wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                    formatter={(v) =>
                      v === "booked"    ? "Tổng đặt"      :
                      v === "confirmed" ? "Đã xác nhận"   :
                      v === "pending"   ? "Chờ xác nhận"  :
                                         "Đã hủy"
                    }
                  />
                  <Bar dataKey="booked"    fill="#64b5f6" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="confirmed" fill="#81c784" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="pending"   fill="#f5e27a" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="cancelled" fill="#f48fb1" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>

      </Row>
    </div>
  );
};

export default TrangChu;