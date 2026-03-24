import React, { useState, useEffect, useCallback } from "react";
import { getAppointments, updateAppointments, getSchedule } from "../../../api/doctor";

// ─── Types ────────────────────────────────────────────────────
interface Appointment {
  id: number;
  name: string;
  dob: string;
  phone: string;
  email: string;
  address: string;
  examDate: string;
  examTime: string;
  problem: string;
  confirmed: boolean;
  status: string;
}

interface ScheduleAppointment {
  id: number;
  nameCustomer: string;
  year: string;
  createdAt: string;
  timeOpen: string;
  status: string;
}

interface TodaySchedule {
  scheduleId: number;
  workDate: string;
  startTime: string;
  endTime: string;
  maxPatient: number;
  scheduleStatus: string;
  appointments: ScheduleAppointment[];
}

// ─── Helpers ──────────────────────────────────────────────────
const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const MONTH_NAMES = [
  "Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6",
  "Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12",
];

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number) =>
  new Date(year, month, 1).getDay();

const formatDate = (iso: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

/** Map dữ liệu từ API /appointments/my-appointments về shape nội bộ */
const mapApiToAppointment = (raw: any): Appointment => ({
  id:        raw.id,
  name:      raw.name       ?? raw.nameCustomer ?? "",
  dob:       raw.date       ?? raw.year         ?? "",
  phone:     raw.phone      ?? "",
  email:     raw.gmail      ?? raw.email        ?? "",
  address:   raw.address    ?? "",
  examDate:  raw.createdAt  ?? "",
  examTime:  raw.timeOpen   ? raw.timeOpen.slice(0, 5) : "",
  problem:   raw.note       ?? "",
  status:    raw.status     ?? "PENDING",
  confirmed: raw.status === "CONFIRMED",
});

/** Map dữ liệu từ API /schedules/today (appointments bên trong) */
const mapScheduleAptToAppointment = (raw: ScheduleAppointment): Appointment => ({
  id:        raw.id,
  name:      raw.nameCustomer ?? "",
  dob:       raw.year         ?? "",
  phone:     "",
  email:     "",
  address:   "",
  examDate:  raw.createdAt    ?? "",
  examTime:  raw.timeOpen     ? raw.timeOpen.slice(0, 5) : "",
  problem:   "",
  status:    raw.status       ?? "PENDING",
  confirmed: raw.status === "CONFIRMED",
});

// ─── Component ───────────────────────────────────────────────
const AdminSchedule: React.FC = () => {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const [appointments,    setAppointments]    = useState<Appointment[]>([]);
  const [todaySchedule,   setTodaySchedule]   = useState<TodaySchedule | null>(null);
  const [loading,         setLoading]         = useState(true);
  const [updatingId,      setUpdatingId]      = useState<number | null>(null);

  const [selected,         setSelected]         = useState<Appointment | null>(null);
  const [dayAppointments,  setDayAppointments]  = useState<Appointment[] | null>(null);
  const [filterConfirmed,  setFilterConfirmed]  = useState<"all" | "confirmed" | "pending">("all");

  // ── Fetch tất cả dữ liệu ──
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [aptRes, scheduleRes] = await Promise.all([
        getAppointments(),
        getSchedule(),
      ]);

      // /appointments/my-appointments trả về { data: [...] } hoặc mảng thẳng
      const rawList: any[] = Array.isArray(aptRes)
        ? aptRes
        : aptRes?.data ?? [];
      setAppointments(rawList.map(mapApiToAppointment));

      // /schedules/today trả về object đơn hoặc null
      if (scheduleRes) setTodaySchedule(scheduleRes);
    } catch (err) {
      console.error("Lỗi tải dữ liệu lịch:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Toggle xác nhận / huỷ ──
  const toggleConfirm = async (id: number) => {
    const target = appointments.find(a => a.id === id);
    if (!target) return;

    const newStatus = target.confirmed ? "PENDING" : "CONFIRMED";
    setUpdatingId(id);
    try {
      await updateAppointments(id, { status: newStatus });

      // Cập nhật local state ngay, không cần refetch
      setAppointments(prev =>
        prev.map(a => a.id === id
          ? { ...a, confirmed: !a.confirmed, status: newStatus }
          : a
        )
      );
      if (selected?.id === id) {
        setSelected(prev => prev
          ? { ...prev, confirmed: !prev.confirmed, status: newStatus }
          : null
        );
      }
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteAppointment = (id: number) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    setSelected(null);
  };

  // ── Calendar helpers ──
  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const getAppointmentsForDate = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return appointments.filter(a => a.examDate === dateStr);
  };

  const filteredAppointments = appointments.filter(a => {
    if (filterConfirmed === "confirmed") return a.confirmed;
    if (filterConfirmed === "pending")   return !a.confirmed;
    return true;
  });

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay    = getFirstDayOfMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const isToday = (day: number) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  // ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <span style={{ color: "#90a4ae", fontSize: 15 }}>Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="ads">

      <div className="ads-header">
        <div className="ads-header__left">
          <h1 className="ads-header__title">Lịch khám bệnh nhân</h1>
          <span className="ads-header__count">{appointments.length} lịch hẹn</span>
          <span className="ads-header__confirmed">
            {appointments.filter(a => a.confirmed).length} đã xác nhận
          </span>
        </div>

        {/* Banner lịch hôm nay từ getSchedule() */}
        {todaySchedule && (
          <div className="ads-today-banner" style={{display:'flex', gap:'30px'}}>
            <span className="ads-today-banner__label">Lịch hôm nay:  {todaySchedule.startTime?.slice(0,5)} – {todaySchedule.endTime?.slice(0,5)}</span>
            <span className="ads-today-banner__count">
              {todaySchedule.appointments?.length ?? 0} / {todaySchedule.maxPatient} bệnh nhân
            </span>
            <span className={`ads-today-banner__status ads-today-banner__status--${todaySchedule.scheduleStatus?.toLowerCase()}`}>
              {todaySchedule.scheduleStatus === "AVAILABLE" ? " Đang mở" : todaySchedule.scheduleStatus}
            </span>
          </div>
        )}
      </div>

      <div className="ads-body">

        {/* ── LEFT: Calendar ── */}
        <div className="ads-left">
          <div className="ads-calendar">
            <div className="ads-calendar__nav">
              <button className="ads-calendar__nav-btn" onClick={prevMonth}>
                <svg viewBox="0 0 16 16" fill="none"><path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <span className="ads-calendar__nav-title">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <button className="ads-calendar__nav-btn" onClick={nextMonth}>
                <svg viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>

            <table className="ads-cal-table">
              <thead>
                <tr>
                  {WEEKDAYS.map(d => (
                    <th key={d} className={d === "CN" ? "ads-cal-table__th--sun" : ""}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, wi) => (
                  <tr key={wi}>
                    {week.map((day, di) => {
                      if (!day) return <td key={di} className="ads-cal-table__empty" />;
                      const dayApts      = getAppointmentsForDate(day);
                      const hasConfirmed = dayApts.some(a => a.confirmed);
                      const hasPending   = dayApts.some(a => !a.confirmed);
                      const isSun        = di === 0;
                      return (
                        <td
                          key={di}
                          className={[
                            "ads-cal-table__day",
                            isToday(day)       ? "ads-cal-table__day--today" : "",
                            isSun              ? "ads-cal-table__day--sun"   : "",
                            dayApts.length > 0 ? "ads-cal-table__day--has"   : "",
                          ].join(" ")}
                          onClick={() => dayApts.length > 0 && setDayAppointments(dayApts)}
                        >
                          <span className="ads-cal-table__num">{day}</span>
                          {(hasConfirmed || hasPending) && (
                            <div className="ads-cal-table__dots">
                              {hasConfirmed && <span className="ads-cal-table__dot ads-cal-table__dot--confirmed" />}
                              {hasPending   && <span className="ads-cal-table__dot ads-cal-table__dot--pending"   />}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="ads-calendar__legend">
              <div className="ads-legend-item">
                <span className="ads-legend-dot ads-legend-dot--confirmed" />Đã xác nhận
              </div>
              <div className="ads-legend-item">
                <span className="ads-legend-dot ads-legend-dot--pending" />Chờ xác nhận
              </div>
            </div>
          </div>

          {/* Danh sách lịch hôm nay từ getSchedule() */}
          {/* {todaySchedule && todaySchedule.appointments?.length > 0 && (
            <div className="ads-today-list">
              <div className="ads-today-list__title">Lịch hôm nay ({formatDate(todaySchedule.workDate)})</div>
              {todaySchedule.appointments.map(a => (
                <div
                  key={a.id}
                  className="ads-day-item"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    const full = appointments.find(ap => ap.id === a.id);
                    if (full) setSelected(full);
                    else setSelected(mapScheduleAptToAppointment(a));
                  }}
                >
                  <div className="ads-day-item__time">{a.timeOpen?.slice(0, 5)}</div>
                  <div className="ads-day-item__info">
                    <span className="ads-day-item__name">{a.nameCustomer}</span>
                  </div>
                  <span className={`ads-status-btn ${a.status === "CONFIRMED" ? "ads-status-btn--confirmed" : "ads-status-btn--pending"}`}>
                    {a.status === "CONFIRMED" ? "Đã xác nhận" : "Chờ xác nhận"}
                  </span>
                </div>
              ))}
            </div>
          )} */}
        </div>

        {/* ── RIGHT: Table ── */}
        <div className="ads-right">
          <div className="ads-table-header">
            <span className="ads-table-title">Danh sách lịch hẹn</span>
            <div className="ads-filter">
              {(["all", "confirmed", "pending"] as const).map(f => (
                <button
                  key={f}
                  className={`ads-filter__btn ${filterConfirmed === f ? "ads-filter__btn--active" : ""}`}
                  onClick={() => setFilterConfirmed(f)}
                >
                  {f === "all" ? "Tất cả" : f === "confirmed" ? "Đã xác nhận" : "Chờ xác nhận"}
                </button>
              ))}
            </div>
          </div>

          <div className="ads-table-wrap">
            <table className="ads-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}>#</th>
                  <th>Bệnh nhân</th>
                  <th style={{ width: 110 }}>Ngày khám</th>
                  <th style={{ width: 76 }}>Giờ</th>
                  <th style={{ width: 100 }}>Trạng thái</th>
                  <th style={{ width: 100 }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="ads-table__empty">Không có lịch hẹn nào</td>
                  </tr>
                ) : (
                  filteredAppointments.map((a, i) => (
                    <tr
                      key={a.id}
                      className={`ads-table__row ${!a.confirmed ? "ads-table__row--pending" : ""}`}
                      onClick={() => setSelected(a)}
                    >
                      <td className="ads-table__idx">{i + 1}</td>
                      <td>
                        <div className="ads-table__name">{a.name}</div>
                        <div className="ads-table__phone">{a.phone || "—"}</div>
                      </td>
                      <td className="ads-table__date">{formatDate(a.examDate)}</td>
                      <td>
                        <span className="ads-table__time">{a.examTime}</span>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <button
                          className={`ads-status-btn ${a.confirmed ? "ads-status-btn--confirmed" : "ads-status-btn--pending"}`}
                          disabled={updatingId === a.id}
                          onClick={() => toggleConfirm(a.id)}
                        >
                          {updatingId === a.id
                            ? "..."
                            : a.confirmed
                              ? (<>
                                  <svg viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                  Đã xác nhận
                                </>)
                              : "Chờ xác nhận"
                          }
                        </button>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <div className="ads-actions">
                          <button
                            className="ads-actions__btn ads-actions__btn--view"
                            onClick={() => setSelected(a)}
                            title="Chi tiết"
                          >
                            <svg viewBox="0 0 16 16" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>
                          </button>
                          <button
                            className="ads-actions__btn ads-actions__btn--delete"
                            onClick={() => deleteAppointment(a.id)}
                            title="Xóa"
                          >
                            <svg viewBox="0 0 16 16" fill="none"><path d="M3 4h10M6 4V2h4v2M5 4v9h6V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Modal chi tiết lịch hẹn ── */}
      {selected && (
        <div className="ads-overlay" onClick={() => setSelected(null)}>
          <div className="ads-modal" onClick={e => e.stopPropagation()}>
            <div className="ads-modal__header">
              <div className="ads-modal__avatar">{selected.name.charAt(0)}</div>
              <div>
                <h2 className="ads-modal__name">{selected.name}</h2>
                <p className="ads-modal__sub">{formatDate(selected.examDate)} — {selected.examTime}</p>
              </div>
              <button className="ads-modal__close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="ads-modal__body">
              <div className="ads-detail-grid">
                <div className="ads-detail-item">
                  <span className="ads-detail-label">Ngày sinh</span>
                  <span className="ads-detail-value">{formatDate(selected.dob) || "—"}</span>
                </div>
                <div className="ads-detail-item">
                  <span className="ads-detail-label">Số điện thoại</span>
                  <span className="ads-detail-value ads-detail-value--phone">{selected.phone || "—"}</span>
                </div>
                <div className="ads-detail-item">
                  <span className="ads-detail-label">Email</span>
                  <span className="ads-detail-value ads-detail-value--email">{selected.email || "—"}</span>
                </div>
                <div className="ads-detail-item ads-detail-item--full">
                  <span className="ads-detail-label">Địa chỉ</span>
                  <span className="ads-detail-value">{selected.address || "—"}</span>
                </div>
                <div className="ads-detail-item">
                  <span className="ads-detail-label">Ngày khám</span>
                  <span className="ads-detail-value">{formatDate(selected.examDate)}</span>
                </div>
                <div className="ads-detail-item">
                  <span className="ads-detail-label">Giờ khám</span>
                  <span className="ads-detail-value">{selected.examTime}</span>
                </div>
              </div>

              {selected.problem && (
                <div className="ads-detail-problem">
                  <span className="ads-detail-label">Ghi chú</span>
                  <div className="ads-detail-problem__box">{selected.problem}</div>
                </div>
              )}
            </div>

            <div className="ads-modal__footer">
              <button
                className="ads-modal__delete-btn"
                onClick={() => deleteAppointment(selected.id)}
              >
                Xóa lịch hẹn
              </button>
              <div className="ads-modal__footer-right">
                <button className="ads-btn ads-btn--ghost" onClick={() => setSelected(null)}>Đóng</button>
                <button
                  className={`ads-btn ${selected.confirmed ? "ads-btn--ghost" : "ads-btn--primary"}`}
                  disabled={updatingId === selected.id}
                  onClick={() => toggleConfirm(selected.id)}
                >
                  {updatingId === selected.id
                    ? "Đang xử lý..."
                    : selected.confirmed ? "Hủy xác nhận" : "Xác nhận lịch"
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal lịch theo ngày ── */}
      {dayAppointments && (
        <div className="ads-overlay" onClick={() => setDayAppointments(null)}>
          <div className="ads-modal ads-modal--day" onClick={e => e.stopPropagation()}>
            <div className="ads-modal__header">
              <h2 className="ads-modal__name">
                Lịch ngày {formatDate(dayAppointments[0].examDate)}
              </h2>
              <button className="ads-modal__close" onClick={() => setDayAppointments(null)}>✕</button>
            </div>
            <div className="ads-modal__body">
              {dayAppointments.map(a => (
                <div
                  key={a.id}
                  className="ads-day-item"
                  onClick={() => { setDayAppointments(null); setSelected(a); }}
                >
                  <div className="ads-day-item__time">{a.examTime}</div>
                  <div className="ads-day-item__info">
                    <span className="ads-day-item__name">{a.name}</span>
                    <span className="ads-day-item__problem">{a.problem}</span>
                  </div>
                  <span className={`ads-status-btn ${a.confirmed ? "ads-status-btn--confirmed" : "ads-status-btn--pending"}`}>
                    {a.confirmed ? "Đã xác nhận" : "Chờ xác nhận"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSchedule;