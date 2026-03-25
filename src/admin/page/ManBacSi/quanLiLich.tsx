import React, { useState, useEffect, useCallback, useRef } from "react";
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
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
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

const mapApiToAppointment = (raw: any): Appointment => ({
  id: raw.id,
  name: raw.name ?? raw.nameCustomer ?? "",
  dob: raw.date ?? raw.year ?? "",
  phone: raw.phone ?? "",
  email: raw.gmail ?? raw.email ?? "",
  address: raw.address ?? "",
  examDate: raw.createdAt ?? "",
  examTime: raw.timeOpen ? raw.timeOpen.slice(0, 5) : "",
  problem: raw.note ?? "",
  status: raw.status ?? "PENDING",
  confirmed: raw.status === "CONFIRMED",
});

const mapScheduleAptToAppointment = (raw: ScheduleAppointment): Appointment => ({
  id: raw.id,
  name: raw.nameCustomer ?? "",
  dob: raw.year ?? "",
  phone: "",
  email: "",
  address: "",
  examDate: raw.createdAt ?? "",
  examTime: raw.timeOpen ? raw.timeOpen.slice(0, 5) : "",
  problem: "",
  status: raw.status ?? "PENDING",
  confirmed: raw.status === "CONFIRMED",
});


interface SuccessUploadModalProps {
  appointmentName: string;
  onConfirm: (file: File) => void;
  onCancel: () => void;
  isUploading: boolean;
}

const SuccessUploadModal: React.FC<SuccessUploadModalProps> = ({
  appointmentName,
  onConfirm,
  onCancel,
  isUploading,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) setSelectedFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="ads-overlay ads-overlay--top" onClick={onCancel}>
      <div className="ads-modal ads-modal--upload" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="ads-modal__header ads-modal__header--success">
          <div className="ads-upload-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2 className="ads-modal__name">Hoàn thành lịch khám</h2>
            <p className="ads-modal__sub">{appointmentName}</p>
          </div>
          <button className="ads-modal__close" onClick={onCancel}>✕</button>
        </div>

        {/* Body */}
        <div className="ads-modal__body">
          <p className="ads-upload-desc">
            Để đánh dấu lịch khám là <strong>Hoàn thành</strong>, vui lòng tải lên tài liệu kết quả khám (đơn thuốc, kết quả xét nghiệm...).
          </p>

          <div
            className={`ads-dropzone ${dragOver ? "ads-dropzone--over" : ""} ${selectedFile ? "ads-dropzone--has-file" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            {selectedFile ? (
              <div className="ads-dropzone__file">
                <svg viewBox="0 0 24 24" fill="none" className="ads-dropzone__file-icon">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M14 2v6h6M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <div className="ads-dropzone__file-info">
                  <span className="ads-dropzone__file-name">{selectedFile.name}</span>
                  <span className="ads-dropzone__file-size">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <button
                  className="ads-dropzone__remove"
                  onClick={e => { e.stopPropagation(); setSelectedFile(null); }}
                >✕</button>
              </div>
            ) : (
              <div className="ads-dropzone__placeholder" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <svg viewBox="0 0 24 24" fill="none" className="ads-dropzone__upload-icon" width="32" height="32">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <p className="ads-dropzone__text">
                  Click vào đây <span>để chọn file</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="ads-modal__footer">
          <div />
          <div className="ads-modal__footer-right">
            <button className="ads-btn ads-btn--ghost" onClick={onCancel} disabled={isUploading}>
              Hủy
            </button>
            <button
              className="ads-btn ads-btn--success"
              disabled={!selectedFile || isUploading}
              onClick={() => selectedFile && onConfirm(selectedFile)}
            >
              {isUploading ? (
                <span className="ads-btn__loading">
                  <svg viewBox="0 0 24 24" fill="none" className="ads-spin">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31.4" strokeDashoffset="10" />
                  </svg>
                  Đang tải lên...
                </span>
              ) : "Xác nhận hoàn thành"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Component ───────────────────────────────────────────────
const AdminSchedule: React.FC = () => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<TodaySchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [selected, setSelected] = useState<Appointment | null>(null);
  const [dayAppointments, setDayAppointments] = useState<Appointment[] | null>(null);
  const [filterConfirmed, setFilterConfirmed] = useState<"all" | "PENDING" | "CONFIRMED" | "SUCCESS" | "CANCELLED">("all");

  const [successTarget, setSuccessTarget] = useState<Appointment | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // ── Fetch dữ liệu ──
  const fetchData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);

      const [aptRes, scheduleRes] = await Promise.all([
        getAppointments(),
        getSchedule(),
      ]);
      const rawList: any[] = Array.isArray(aptRes) ? aptRes : aptRes?.data ?? [];
      const mapped = rawList.map(mapApiToAppointment);
      setAppointments(mapped);

      // ✅ Sync lại selected nếu đang mở modal
      setSelected(prev => prev ? (mapped.find(a => a.id === prev.id) ?? null) : null);

      if (scheduleRes) setTodaySchedule(scheduleRes);
    } catch (err) {
      console.error("Lỗi tải dữ liệu lịch:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(false); }, [fetchData]);

  // ── Toggle CONFIRMED / PENDING ──
  const toggleConfirm = async (id: number) => {
    const target = appointments.find(a => a.id === id);
    if (!target || target.status === "SUCCESS") return;

    const newStatus = target.confirmed ? "PENDING" : "CONFIRMED";
    setUpdatingId(id);
    try {
      await updateAppointments(id, { status: newStatus });
      await fetchData(true);
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Mở popup SUCCESS ──
  const openSuccessPopup = (apt: Appointment) => {
    if (apt.status === "SUCCESS") return;
    setSuccessTarget(apt);
  };


  const handleSuccessConfirm = async (file: File) => {
    if (!successTarget) return;
    setIsUploading(true);
    try {
      await updateAppointments(successTarget.id, { file, status: "SUCCESS" });
      setSuccessTarget(null);
      await fetchData(true);

    } catch (err) {
      console.error("Lỗi cập nhật SUCCESS:", err);
    } finally {
      setIsUploading(false);
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
    if (filterConfirmed === "all") return true;
    return a.status === filterConfirmed;
  });
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const isToday = (day: number) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  // ── Render status badge ──
  const renderStatusBtn = (a: Appointment, stopProp = true) => {
    const isSuccess = a.status === "SUCCESS";
    const isUpdating = updatingId === a.id;

    if (isSuccess) {
      return (
        <button className="ads-status-btn ads-status-btn--success" disabled>
          Hoàn thành
        </button>
      );
    }

    return (
      <button
        className={`ads-status-btn ${a.confirmed ? "ads-status-btn--confirmed" : "ads-status-btn--pending"}`}
        disabled={isUpdating}
        onClick={(e) => {
          if (stopProp) e.stopPropagation();
          toggleConfirm(a.id);
        }}
      >
        {isUpdating ? "..." : a.confirmed ? "Đã xác nhận" : "Chờ xác nhận"}
      </button>
    );
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <span style={{ color: "#90a4ae", fontSize: 15 }}>Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="ads">

      {/* ✅ Indicator refresh ngầm */}
      {refreshing && (
        <div style={{ position: "fixed", top: 12, right: 20, fontSize: 12, color: "#90a4ae", zIndex: 9999 }}>
          Đang cập nhật...
        </div>
      )}

      <div className="ads-header">
        <div className="ads-header__left">
          <h1 className="ads-header__title">Lịch khám bệnh nhân</h1>
          <span className="ads-header__count">{appointments.length} lịch hẹn</span>
          <span className="ads-header__confirmed">
            {appointments.filter(a => a.confirmed).length} đã xác nhận
          </span>
          <span className="ads-header__success">
            {appointments.filter(a => a.status === "SUCCESS").length} hoàn thành
          </span>
        </div>

        {todaySchedule && (
          <div className="ads-today-banner" style={{ display: "flex", gap: "30px" }}>
            <span className="ads-today-banner__label">
              Lịch hôm nay: {todaySchedule.startTime?.slice(0, 5)} – {todaySchedule.endTime?.slice(0, 5)}
            </span>
            <span className="ads-today-banner__count">
              {todaySchedule.appointments?.length ?? 0} / {todaySchedule.maxPatient} bệnh nhân
            </span>
            <span className={`ads-today-banner__status ads-today-banner__status--${todaySchedule.scheduleStatus?.toLowerCase()}`}>
              {todaySchedule.scheduleStatus === "AVAILABLE" ? "Đang mở" : todaySchedule.scheduleStatus}
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
                <svg viewBox="0 0 16 16" fill="none"><path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <span className="ads-calendar__nav-title">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <button className="ads-calendar__nav-btn" onClick={nextMonth}>
                <svg viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
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
                      const dayApts = getAppointmentsForDate(day);
                      const hasConfirmed = dayApts.some(a => a.confirmed);
                      const hasPending = dayApts.some(a => !a.confirmed);
                      const isSun = di === 0;
                      return (
                        <td
                          key={di}
                          className={[
                            "ads-cal-table__day",
                            isToday(day) ? "ads-cal-table__day--today" : "",
                            isSun ? "ads-cal-table__day--sun" : "",
                            dayApts.length > 0 ? "ads-cal-table__day--has" : "",
                          ].join(" ")}
                          onClick={() => dayApts.length > 0 && setDayAppointments(dayApts)}
                        >
                          <span className="ads-cal-table__num">{day}</span>
                          {(hasConfirmed || hasPending) && (
                            <div className="ads-cal-table__dots">
                              {hasConfirmed && <span className="ads-cal-table__dot ads-cal-table__dot--confirmed" />}
                              {hasPending && <span className="ads-cal-table__dot ads-cal-table__dot--pending" />}
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
        </div>

        {/* ── RIGHT: Table ── */}
        <div className="ads-right">
          <div className="ads-table-header">
            <span className="ads-table-title">Danh sách lịch hẹn</span>
            <div className="ads-filter">
              {([
                { key: "all", label: "Tất cả" },
                { key: "PENDING", label: "Chờ xác nhận" },
                { key: "CONFIRMED", label: "Đã xác nhận" },
                { key: "SUCCESS", label: "Hoàn thành" },
                { key: "CANCELLED", label: "Đã hủy" },
              ] as const).map(f => (
                <button
                  key={f.key}
                  className={`ads-filter__btn ${filterConfirmed === f.key ? "ads-filter__btn--active" : ""}`}
                  onClick={() => setFilterConfirmed(f.key)}
                >
                  {f.label}
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
                  <th style={{ width: 120 }}>Trạng thái</th>
                  <th style={{ width: 130 }}>Thao tác</th>
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
                      className={[
                        "ads-table__row",
                        !a.confirmed ? "ads-table__row--pending" : "",
                        a.status === "SUCCESS" ? "ads-table__row--success" : "",
                      ].join(" ")}
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
                        {renderStatusBtn(a)}
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <div className="ads-actions">
                          <button
                            className="ads-actions__btn ads-actions__btn--view"
                            onClick={() => setSelected(a)}
                            title="Chi tiết"
                          >
                            <svg viewBox="0 0 16 16" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4" /><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" /></svg>
                          </button>
                          {a.status !== "SUCCESS" && (
                            <button
                              className="ads-actions__btn ads-actions__btn--success"
                              onClick={() => openSuccessPopup(a)}
                              title="Đánh dấu hoàn thành"
                            >
                              <svg viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                          )}
                          <button
                            className="ads-actions__btn ads-actions__btn--delete"
                            onClick={() => deleteAppointment(a.id)}
                            title="Xóa"
                          >
                            <svg viewBox="0 0 16 16" fill="none"><path d="M3 4h10M6 4V2h4v2M5 4v9h6V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
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

              {selected.status === "SUCCESS" && (
                <div className="ads-detail-success-badge">
                  <svg viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Lịch khám đã hoàn thành
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

                {selected.status === "SUCCESS" ? (
                  <button className="ads-btn ads-btn--success" disabled>
                    <svg viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Đã hoàn thành
                  </button>
                ) : (
                  <>
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
                  </>
                )}
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
                  <span className={`ads-status-btn ${a.status === "SUCCESS"
                    ? "ads-status-btn--success"
                    : a.confirmed
                      ? "ads-status-btn--confirmed"
                      : "ads-status-btn--pending"
                    }`}>
                    {a.status === "SUCCESS" ? "Hoàn thành" : a.confirmed ? "Đã xác nhận" : "Chờ xác nhận"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Popup Upload SUCCESS ── */}
      {successTarget && (
        <SuccessUploadModal
          appointmentName={successTarget.name}
          onConfirm={handleSuccessConfirm}
          onCancel={() => setSuccessTarget(null)}
          isUploading={isUploading}
        />
      )}
    </div>
  );
};

export default AdminSchedule;