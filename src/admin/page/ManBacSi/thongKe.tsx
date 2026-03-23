import React, { useState, useEffect, useRef } from "react";

const MONTHS = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"];
const MONTH_FULL = ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"];

const rawData: Record<number, Record<number, {
  revenue: number;
  received: number;
  completed: number;
  cancelled: number;
  waiting: number;
}>> = {
  2023: {
    1:  { revenue: 18500000, received: 42, completed: 35, cancelled: 4, waiting: 3 },
    2:  { revenue: 21000000, received: 48, completed: 40, cancelled: 5, waiting: 3 },
    3:  { revenue: 24500000, received: 55, completed: 47, cancelled: 5, waiting: 3 },
    4:  { revenue: 22000000, received: 50, completed: 42, cancelled: 5, waiting: 3 },
    5:  { revenue: 26000000, received: 58, completed: 50, cancelled: 5, waiting: 3 },
    6:  { revenue: 29500000, received: 65, completed: 56, cancelled: 6, waiting: 3 },
    7:  { revenue: 31000000, received: 70, completed: 61, cancelled: 6, waiting: 3 },
    8:  { revenue: 28000000, received: 63, completed: 54, cancelled: 6, waiting: 3 },
    9:  { revenue: 30000000, received: 67, completed: 58, cancelled: 6, waiting: 3 },
    10: { revenue: 33000000, received: 74, completed: 64, cancelled: 7, waiting: 3 },
    11: { revenue: 35000000, received: 78, completed: 68, cancelled: 7, waiting: 3 },
    12: { revenue: 38000000, received: 85, completed: 74, cancelled: 8, waiting: 3 },
  },
  2024: {
    1:  { revenue: 22000000, received: 50, completed: 43, cancelled: 4, waiting: 3 },
    2:  { revenue: 25000000, received: 56, completed: 48, cancelled: 5, waiting: 3 },
    3:  { revenue: 28000000, received: 63, completed: 55, cancelled: 5, waiting: 3 },
    4:  { revenue: 27000000, received: 60, completed: 52, cancelled: 5, waiting: 3 },
    5:  { revenue: 31000000, received: 69, completed: 60, cancelled: 6, waiting: 3 },
    6:  { revenue: 34000000, received: 76, completed: 66, cancelled: 7, waiting: 3 },
    7:  { revenue: 36000000, received: 80, completed: 70, cancelled: 7, waiting: 3 },
    8:  { revenue: 33000000, received: 73, completed: 63, cancelled: 7, waiting: 3 },
    9:  { revenue: 35000000, received: 78, completed: 68, cancelled: 7, waiting: 3 },
    10: { revenue: 38000000, received: 84, completed: 73, cancelled: 8, waiting: 3 },
    11: { revenue: 41000000, received: 91, completed: 79, cancelled: 8, waiting: 4 },
    12: { revenue: 45000000, received: 100, completed: 87, cancelled: 9, waiting: 4 },
  },
  2025: {
    1:  { revenue: 27000000, received: 60, completed: 52, cancelled: 5, waiting: 3 },
    2:  { revenue: 30000000, received: 67, completed: 58, cancelled: 5, waiting: 4 },
    3:  { revenue: 34000000, received: 75, completed: 65, cancelled: 6, waiting: 4 },
    4:  { revenue: 32000000, received: 71, completed: 62, cancelled: 6, waiting: 3 },
    5:  { revenue: 37000000, received: 82, completed: 71, cancelled: 7, waiting: 4 },
    6:  { revenue: 41000000, received: 91, completed: 79, cancelled: 8, waiting: 4 },
    7:  { revenue: 44000000, received: 97, completed: 84, cancelled: 9, waiting: 4 },
    8:  { revenue: 40000000, received: 89, completed: 77, cancelled: 8, waiting: 4 },
    9:  { revenue: 43000000, received: 95, completed: 82, cancelled: 9, waiting: 4 },
    10: { revenue: 47000000, received: 104, completed: 90, cancelled: 10, waiting: 4 },
    11: { revenue: 50000000, received: 111, completed: 96, cancelled: 10, waiting: 5 },
    12: { revenue: 54000000, received: 120, completed: 104, cancelled: 11, waiting: 5 },
  },
};

const YEARS = [2023, 2024, 2025];

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);

const fmtShort = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".0","") + "tr";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "k";
  return String(n);
};

interface PieChartProps {
  completed: number;
  cancelled: number;
}

const PieChart: React.FC<PieChartProps> = ({ completed, cancelled }) => {
  const total = completed + cancelled;
  if (total === 0) return <div className="chart-empty">Không có dữ liệu</div>;

  const pCompleted = (completed / total) * 100;
  const pCancelled = (cancelled / total) * 100;

  const r = 70;
  const cx = 90;
  const cy = 90;
  const circ = 2 * Math.PI * r;

  const completedLen = (pCompleted / 100) * circ;
  const cancelledLen = (pCancelled / 100) * circ;
  const gap = 3;

  const completedOffset = 0;
  const cancelledOffset = -(completedLen + gap);

  return (
    <div className="pie-wrap">
      <svg viewBox="0 0 180 180" className="pie-svg">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e8edf2" strokeWidth="26" />
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke="#1a7a4a" strokeWidth="26"
          strokeDasharray={`${completedLen - gap} ${circ - completedLen + gap}`}
          strokeDashoffset={-completedOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke="#c0392b" strokeWidth="26"
          strokeDasharray={`${cancelledLen - gap} ${circ - cancelledLen + gap}`}
          strokeDashoffset={cancelledOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize="22" fontWeight="600" fill="#1a3a5c" fontFamily="Lora, serif">
          {Math.round(pCompleted)}%
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="#8fa3b3" fontFamily="Be Vietnam Pro, sans-serif">
          hoàn thành
        </text>
      </svg>
      <div className="pie-legend">
        <div className="pie-legend__item">
          <span className="pie-legend__dot pie-legend__dot--completed" />
          <div>
            <span className="pie-legend__label">Đã chữa xong</span>
            <span className="pie-legend__val">{completed} ca ({Math.round(pCompleted)}%)</span>
          </div>
        </div>
        <div className="pie-legend__item">
          <span className="pie-legend__dot pie-legend__dot--cancelled" />
          <div>
            <span className="pie-legend__label">Đã huỷ đơn</span>
            <span className="pie-legend__val">{cancelled} ca ({Math.round(pCancelled)}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LineChartProps {
  dataByYear: Record<number, number[]>;
  years: number[];
}

const COLORS = ["#1a3a5c","#2e7d9c","#c49a3c"];

const LineChart: React.FC<LineChartProps> = ({ dataByYear, years }) => {
  const W = 520;
  const H = 200;
  const padL = 48;
  const padR = 20;
  const padT = 16;
  const padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const allVals = years.flatMap(y => dataByYear[y] || []);
  const maxVal = Math.max(...allVals, 1);
  const minVal = 0;

  const xStep = innerW / 11;

  const toX = (i: number) => padL + i * xStep;
  const toY = (v: number) => padT + innerH - ((v - minVal) / (maxVal - minVal)) * innerH;

  const makePath = (vals: number[]) =>
    vals.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");

  const gridLines = 4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="line-svg" preserveAspectRatio="xMidYMid meet">
      {Array.from({ length: gridLines + 1 }).map((_, i) => {
        const y = padT + (innerH / gridLines) * i;
        const val = Math.round(maxVal - (maxVal / gridLines) * i);
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#dde5ec" strokeWidth="1" strokeDasharray="4 3" />
            <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#8fa3b3" fontFamily="Be Vietnam Pro">{val}</text>
          </g>
        );
      })}

      {MONTHS.map((m, i) => (
        <text key={m} x={toX(i)} y={H - 6} textAnchor="middle" fontSize="9" fill="#8fa3b3" fontFamily="Be Vietnam Pro">{m}</text>
      ))}

      {years.map((y, yi) => {
        const vals = dataByYear[y] || [];
        if (vals.length === 0) return null;
        return (
          <g key={y}>
            <path d={makePath(vals)} fill="none" stroke={COLORS[yi % COLORS.length]} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
            {vals.map((v, i) => (
              <circle key={i} cx={toX(i)} cy={toY(v)} r="3.5" fill={COLORS[yi % COLORS.length]} />
            ))}
          </g>
        );
      })}
    </svg>
  );
};

const AdminStatistics: React.FC = () => {
  const today = new Date();
  const [selYear, setSelYear] = useState(today.getFullYear());
  const [selMonth, setSelMonth] = useState(today.getMonth() + 1);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(selYear);
  const pickerRef = useRef<HTMLDivElement>(null);

  const [lineYears, setLineYears] = useState<number[]>([2025]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const monthData = rawData[selYear]?.[selMonth] ?? { revenue: 0, received: 0, completed: 0, cancelled: 0, waiting: 0 };

  const prevMonth = selMonth === 1
    ? rawData[selYear - 1]?.[12]
    : rawData[selYear]?.[selMonth - 1];

  const diff = (cur: number, prev: number | undefined) => {
    if (!prev) return null;
    const d = cur - prev;
    return { val: Math.abs(d), up: d >= 0 };
  };

  const lineData: Record<number, number[]> = {};
  lineYears.forEach(y => {
    lineData[y] = Array.from({ length: 12 }, (_, i) => rawData[y]?.[i + 1]?.completed ?? 0);
  });

  const pieCompleted = Object.values(rawData[selYear] ?? {}).reduce((s, m) => s + m.completed, 0);
  const pieCancelled = Object.values(rawData[selYear] ?? {}).reduce((s, m) => s + m.cancelled, 0);

  const cards = [
    {
      key: "revenue",
      label: "Doanh thu",
      value: fmtCurrency(monthData.revenue),
      rawVal: monthData.revenue,
      prevVal: prevMonth?.revenue,
      color: "gold",
      icon: (
        <svg viewBox="0 0 20 20" fill="none"><path d="M10 2v16M6 6h6a2 2 0 010 4H8a2 2 0 000 4h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
      ),
    },
    {
      key: "received",
      label: "Bệnh nhân đã nhận",
      value: monthData.received,
      rawVal: monthData.received,
      prevVal: prevMonth?.received,
      color: "blue",
      icon: (
        <svg viewBox="0 0 20 20" fill="none"><path d="M13 7a3 3 0 11-6 0 3 3 0 016 0zM4 17a6 6 0 0112 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
      ),
    },
    {
      key: "completed",
      label: "Đã chữa xong",
      value: monthData.completed,
      rawVal: monthData.completed,
      prevVal: prevMonth?.completed,
      color: "green",
      icon: (
        <svg viewBox="0 0 20 20" fill="none"><path d="M4 10l5 5 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ),
    },
    {
      key: "cancelled",
      label: "Đơn đã huỷ",
      value: monthData.cancelled,
      rawVal: monthData.cancelled,
      prevVal: prevMonth?.cancelled,
      color: "red",
      icon: (
        <svg viewBox="0 0 20 20" fill="none"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
      ),
    },
    {
      key: "waiting",
      label: "Đang chờ",
      value: monthData.waiting,
      rawVal: monthData.waiting,
      prevVal: prevMonth?.waiting,
      color: "orange",
      icon: (
        <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
      ),
    },
  ];

  return (
    <div className="ast">

      <div className="ast-header">
        <div className="ast-header__left">
          <h1 className="ast-header__title">Thống kê</h1>
        </div>

        <div className="ast-picker-wrap" ref={pickerRef}>
          <button className="ast-picker-trigger" onClick={() => setShowPicker(v => !v)}>
            <svg viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M1 6h14M5 1v2M11 1v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            {MONTH_FULL[selMonth - 1]} {selYear}
            <svg viewBox="0 0 10 10" fill="none" className="ast-picker-trigger__caret"><path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          {showPicker && (
            <div className="ast-picker">
              <div className="ast-picker__year-nav">
                <button onClick={() => setPickerYear(y => Math.max(2023, y - 1))}>
                  <svg viewBox="0 0 10 10" fill="none"><path d="M7 2L4 5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <span>{pickerYear}</span>
                <button onClick={() => setPickerYear(y => Math.min(2025, y + 1))}>
                  <svg viewBox="0 0 10 10" fill="none"><path d="M3 2l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
              <div className="ast-picker__months">
                {MONTHS.map((m, i) => (
                  <button
                    key={m}
                    className={`ast-picker__month-btn ${selMonth === i + 1 && selYear === pickerYear ? "ast-picker__month-btn--active" : ""}`}
                    onClick={() => { setSelMonth(i + 1); setSelYear(pickerYear); setShowPicker(false); }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="ast-cards">
        {cards.map(c => {
          const d = diff(c.rawVal as number, c.prevVal as number | undefined);
          return (
            <div key={c.key} className={`ast-card ast-card--${c.color}`}>
              <div className="ast-card__icon">{c.icon}</div>
              <div className="ast-card__body">
                <span className="ast-card__label">{c.label}</span>
                <span className="ast-card__value">{c.value}</span>
                {d && (
                  <span className={`ast-card__diff ${d.up ? "ast-card__diff--up" : "ast-card__diff--down"}`}>
                    {d.up ? "▲" : "▼"} {c.key === "revenue" ? fmtShort(d.val) : d.val} so với tháng trước
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="ast-charts">
        <div className="ast-chart-box ast-chart-box--pie">
          <div className="ast-chart-box__header">
            <h3 className="ast-chart-box__title">Tỉ lệ đơn — Năm {selYear}</h3>
          </div>
          <PieChart completed={pieCompleted} cancelled={pieCancelled} />
        </div>

        <div className="ast-chart-box ast-chart-box--line">
          <div className="ast-chart-box__header">
            <h3 className="ast-chart-box__title">Đơn thành công theo năm</h3>
            <div className="ast-year-toggle">
              {YEARS.map((y, i) => (
                <button
                  key={y}
                  className={`ast-year-toggle__btn ${lineYears.includes(y) ? "ast-year-toggle__btn--active" : ""}`}
                  style={lineYears.includes(y) ? { borderColor: COLORS[i], color: COLORS[i] } : {}}
                  onClick={() => {
                    setLineYears(prev =>
                      prev.includes(y)
                        ? prev.length > 1 ? prev.filter(v => v !== y) : prev
                        : [...prev, y]
                    );
                  }}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
          <div className="ast-line-wrap">
            <LineChart dataByYear={lineData} years={lineYears} />
          </div>
          <div className="ast-line-legend">
            {lineYears.map((y, i) => (
              <div key={y} className="ast-line-legend__item">
                <span className="ast-line-legend__dot" style={{ background: COLORS[YEARS.indexOf(y) % COLORS.length] }} />
                {y}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;