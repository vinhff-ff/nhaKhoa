import React, { useState, useEffect, useCallback } from "react";
import { getDoctor, addSchedule, seeEmptySchedule, seeSchedule } from "../../../api/employees";
import { message } from "antd";

// ─── Types ────────────────────────────────────────────────────
interface Doctor {
  id: number;
  email: string;
  name: string;
  phone: string;
  specialized: string;
  information: string;
  address: string;
  img: string | null;
  lever: string;
  createdAt: string | null;
}

interface Schedule {
  id: number;
  doctorId: number;
  doctorName: string;
  workDate: string;
  startTime: string;
  endTime: string;
  maxPatient: number;
  currentPatient: number | null;
  status: string;
}

interface TimeSlot {
  workDate: string;
  timeSlot: string;
}

interface AssignForm {
  doctorId: number | null;
  workDate: string;
  startTime: string;
  endTime: string;
  maxPatient: number;
}

// ─── Helpers ──────────────────────────────────────────────────
const formatDate = (iso: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const formatTime = (t: string) => (t ? t.slice(0, 5) : "");

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  AVAILABLE: { label: "Đang mở", cls: "dm-badge--available" },
  FULL: { label: "Đã đầy", cls: "dm-badge--full" },
  CANCELLED: { label: "Đã hủy", cls: "dm-badge--cancelled" },
};

const LEVER_MAP: Record<string, string> = {
  "TIẾN SĨ": "TS.",
  "THẠC SĨ": "ThS.",
  "BÁC SĨ": "BS.",
};

// ─── Component ────────────────────────────────────────────────
const DoctorManagement: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"schedule" | "doctor">("schedule");

  // Assign modal
  const [showAssign, setShowAssign] = useState(false);
  const [assignTarget, setAssignTarget] = useState<Doctor | null>(null);
  const [assignForm, setAssignForm] = useState<AssignForm>({
    doctorId: null,
    workDate: "",
    startTime: "",
    endTime: "",
    maxPatient: 10,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Schedule filter
  const [filterDoctor, setFilterDoctor] = useState<number | "all">("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Empty slots
  const [showSlots, setShowSlots] = useState(false);
  const [slotTarget, setSlotTarget] = useState<Doctor | null>(null);
  const [slotDate, setSlotDate] = useState("");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [docRes, schRes] = await Promise.all([getDoctor(), seeSchedule()]);
      const docList: Doctor[] = Array.isArray(docRes)
        ? docRes
        : docRes?.data ?? [];
      const schList: Schedule[] = Array.isArray(schRes)
        ? schRes
        : schRes?.data ?? [];
      setDoctors(docList);
      setSchedules(schList);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Mở form phân công ──
  const openAssign = (doctor: Doctor) => {
    setAssignTarget(doctor);
    setAssignForm({
      doctorId: doctor.id,
      workDate: "",
      startTime: "",
      endTime: "",
      maxPatient: 10,
    });
    setSubmitSuccess(false);
    setShowAssign(true);
  };

  const handleAssignSubmit = async () => {
    if (!assignForm.doctorId || !assignForm.workDate || !assignForm.startTime || !assignForm.endTime) return;

    if (assignForm.startTime < "07:00" || assignForm.endTime > "17:00") {
      message.error("Chỉ được xếp lịch từ 07:00 sáng đến 5:00 chiều");
      return;
    }
    if (assignForm.startTime >= assignForm.endTime) {
      message.error("Giờ bắt đầu phải nhỏ hơn giờ kết thúc");
      return;
    }
    if (
      !assignForm.doctorId ||
      !assignForm.workDate ||
      !assignForm.startTime ||
      !assignForm.endTime
    )
      return;
    setSubmitting(true);
    try {
      await addSchedule({
        doctorId: assignForm.doctorId,
        workDate: assignForm.workDate,
        startTime: assignForm.startTime + ":00",
        endTime: assignForm.endTime + ":00",
        maxPatient: assignForm.maxPatient,
      });
      setSubmitSuccess(true);
      await fetchAll();
      setTimeout(() => {
        setShowAssign(false);
        setSubmitSuccess(false);
      }, 1200);
    } catch (err) {
      console.error("Lỗi thêm lịch:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Xem lịch trống ──
  const openSlots = (doctor: Doctor) => {
    setSlotTarget(doctor);
    setSlotDate("");
    setSlots([]);
    setShowSlots(true);
  };

  const fetchSlots = async () => {
    if (!slotTarget || !slotDate) return;
    setLoadingSlots(true);
    try {
      const res = await seeEmptySchedule({
        doctorId: slotTarget.id,
        workDate: slotDate,
      });
      setSlots(Array.isArray(res) ? res : res?.data ?? []);
    } catch (err) {
      console.error("Lỗi tải slot:", err);
    } finally {
      setLoadingSlots(false);
    }
  };

  // ── Filter schedules ──
  const filteredSchedules = schedules.filter((s) => {
    if (filterDoctor !== "all" && s.doctorId !== filterDoctor) return false;
    if (filterStatus !== "all" && s.status !== filterStatus) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="dm-loading">
        <div className="dm-loading__spinner" />
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .dm {
          font-family: 'Be Vietnam Pro', 'Segoe UI', sans-serif;
          padding: 24px;
          min-height: 100vh;
          background: #f4f6fb;
          color: #1a2332;
        }

        /* ── Header ── */
        .dm-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .dm-header__title {
          font-size: 22px;
          font-weight: 700;
          color: #1a2332;
          margin: 0;
        }
        .dm-header__sub {
          font-size: 13px;
          color: #7a8ca0;
          margin-top: 2px;
        }

        /* ── Tabs ── */
        .dm-tabs {
          display: flex;
          gap: 4px;
          background: #e8ecf2;
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 24px;
          width: fit-content;
        }
        .dm-tab {
          padding: 8px 20px;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #7a8ca0;
          cursor: pointer;
          transition: all 0.18s;
        }
        .dm-tab--active {
          background: #fff;
          color: #1a2332;
          font-weight: 600;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }

        /* ── Card ── */
        .dm-card {
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.06);
          overflow: hidden;
        }
        .dm-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #f0f2f6;
          flex-wrap: wrap;
          gap: 12px;
        }
        .dm-card__title {
          font-size: 15px;
          font-weight: 600;
          color: #1a2332;
        }
        .dm-card__count {
          font-size: 12px;
          color: #7a8ca0;
          background: #f4f6fb;
          padding: 3px 10px;
          border-radius: 20px;
          margin-left: 8px;
        }

        /* ── Filters ── */
        .dm-filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .dm-select {
          padding: 7px 12px;
          border: 1px solid #e2e6ee;
          border-radius: 8px;
          font-size: 13px;
          color: #1a2332;
          background: #f8fafc;
          cursor: pointer;
          outline: none;
        }
        .dm-select:focus { border-color: #4f7ef8; }

        /* ── Table ── */
        .dm-table-wrap {
          overflow-x: auto;
        }
        .dm-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .dm-table thead th {
          padding: 11px 16px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #7a8ca0;
          background: #f8fafc;
          border-bottom: 1px solid #f0f2f6;
          white-space: nowrap;
        }
        .dm-table tbody tr {
          border-bottom: 1px solid #f5f7fb;
          transition: background 0.13s;
        }
        .dm-table tbody tr:last-child { border-bottom: none; }
        .dm-table tbody tr:hover { background: #f8fafc; }
        .dm-table td {
          padding: 12px 16px;
          vertical-align: middle;
        }
        .dm-table__empty {
          text-align: center;
          color: #b0bec5;
          padding: 40px !important;
          font-size: 13px;
        }

        /* ── Doctor card in table ── */
        .dm-doctor-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .dm-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #4f7ef8, #7c5cfc);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 14px;
          flex-shrink: 0;
        }
        .dm-doctor-cell__name {
          font-weight: 600;
          color: #1a2332;
          font-size: 13px;
        }
        .dm-doctor-cell__spec {
          font-size: 11px;
          color: #7a8ca0;
          margin-top: 1px;
        }

        /* ── Badge ── */
        .dm-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }
        .dm-badge--available  { background: #e8f5e9; color: #2e7d32; }
        .dm-badge--full       { background: #fff3e0; color: #e65100; }
        .dm-badge--cancelled  { background: #fce4ec; color: #c62828; }
        .dm-badge--lever {
          background: #ede9fe;
          color: #5b21b6;
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 6px;
          font-weight: 600;
        }

        /* ── Time display ── */
        .dm-time {
          font-size: 13px;
          font-variant-numeric: tabular-nums;
          color: #3d5a80;
          font-weight: 500;
        }
        .dm-date {
          font-size: 13px;
          color: #1a2332;
          font-weight: 500;
        }

        /* ── Action buttons ── */
        .dm-actions {
          display: flex;
          gap: 6px;
        }
        .dm-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border: none;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .dm-btn svg { width: 13px; height: 13px; }
        .dm-btn--primary { background: #4f7ef8; color: #fff; }
        .dm-btn--primary:hover { background: #3a6ae0; }
        .dm-btn--outline {
          background: #f4f6fb;
          color: #4f7ef8;
          border: 1px solid #dde3f0;
        }
        .dm-btn--outline:hover { background: #e8edfb; }
        .dm-btn--ghost { background: transparent; color: #7a8ca0; border: 1px solid #e2e6ee; }
        .dm-btn--ghost:hover { background: #f4f6fb; }
        .dm-btn--success { background: #2e7d32; color: #fff; }
        .dm-btn--success:hover { background: #1b5e20; }
        .dm-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── Progress bar ── */
        .dm-progress {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .dm-progress__bar {
          flex: 1;
          height: 5px;
          background: #e8ecf2;
          border-radius: 10px;
          overflow: hidden;
          min-width: 60px;
        }
        .dm-progress__fill {
          height: 100%;
          border-radius: 10px;
          background: linear-gradient(90deg, #4f7ef8, #7c5cfc);
          transition: width 0.3s;
        }
        .dm-progress__text {
          font-size: 12px;
          color: #7a8ca0;
          white-space: nowrap;
        }

        /* ── Overlay & Modal ── */
        .dm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 20, 40, 0.45);
          backdrop-filter: blur(3px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .dm-modal {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.18);
          width: 100%;
          max-width: 480px;
          overflow: hidden;
          animation: dm-slide-up 0.22s ease;
        }
        @keyframes dm-slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dm-modal__header {
          padding: 20px 24px 16px;
          border-bottom: 1px solid #f0f2f6;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .dm-modal__icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #4f7ef8, #7c5cfc);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .dm-modal__icon svg { width: 20px; height: 20px; color: #fff; }
        .dm-modal__title { font-size: 16px; font-weight: 700; color: #1a2332; margin: 0; }
        .dm-modal__sub { font-size: 12px; color: #7a8ca0; margin-top: 2px; }
        .dm-modal__close {
          margin-left: auto;
          background: none;
          border: none;
          font-size: 18px;
          color: #b0bec5;
          cursor: pointer;
          line-height: 1;
          padding: 4px;
        }
        .dm-modal__close:hover { color: #1a2332; }
        .dm-modal__body { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }
        .dm-modal__footer {
          padding: 16px 24px;
          border-top: 1px solid #f0f2f6;
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }

        /* ── Form ── */
        .dm-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .dm-form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .dm-form-group--full { grid-column: 1 / -1; }
        .dm-label {
          font-size: 12px;
          font-weight: 600;
          color: #5a6a7a;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .dm-input {
          padding: 9px 12px;
          border: 1.5px solid #e2e6ee;
          border-radius: 8px;
          font-size: 13px;
          color: #1a2332;
          background: #f8fafc;
          outline: none;
          transition: border-color 0.15s;
        }
        .dm-input:focus { border-color: #4f7ef8; background: #fff; }

        /* ── Success state ── */
        .dm-success-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 20px 0;
        }
        .dm-success-state__icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #e8f5e9;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dm-success-state__icon svg { width: 26px; height: 26px; color: #2e7d32; }
        .dm-success-state__text { font-size: 14px; font-weight: 600; color: #2e7d32; }

        /* ── Slot modal ── */
        .dm-slot-search {
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }
        .dm-slot-search .dm-form-group { flex: 1; }
        .dm-slots {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 4px;
        }
        .dm-slot-chip {
          padding: 6px 14px;
          border-radius: 8px;
          background: #e8edfb;
          color: #3a5fc0;
          font-size: 13px;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }
        .dm-slot-empty {
          color: #b0bec5;
          font-size: 13px;
          text-align: center;
          padding: 16px 0;
          width: 100%;
        }

        /* ── Loading ── */
        .dm-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          gap: 12px;
          color: #7a8ca0;
          font-size: 14px;
        }
        .dm-loading__spinner {
          width: 28px;
          height: 28px;
          border: 3px solid #e2e6ee;
          border-top-color: #4f7ef8;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="dm">
        <div className="dm-header">
          <div>
            <h1 className="dm-header__title">Quản lý bác sĩ</h1>
            <p className="dm-header__sub">
              {doctors.length} bác sĩ · {schedules.length} ca làm việc
            </p>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="dm-tabs">
          <button
            className={`dm-tab ${activeTab === "schedule" ? "dm-tab--active" : ""}`}
            onClick={() => setActiveTab("schedule")}
          >
            📅 Phân công làm việc
          </button>
          <button
            className={`dm-tab ${activeTab === "doctor" ? "dm-tab--active" : ""}`}
            onClick={() => setActiveTab("doctor")}
          >
            👨‍⚕️ Danh sách bác sĩ
          </button>
        </div>

        {/* ══════════════ TAB 1: SCHEDULE ══════════════ */}
        {activeTab === "schedule" && (
          <div className="dm-card">
            <div className="dm-card__header">
              <div>
                <span className="dm-card__title">Ca làm việc</span>
                <span className="dm-card__count">{filteredSchedules.length}</span>
              </div>
              <div className="dm-filters">
                <select
                  className="dm-select"
                  value={filterDoctor}
                  onChange={(e) =>
                    setFilterDoctor(
                      e.target.value === "all" ? "all" : Number(e.target.value)
                    )
                  }
                >
                  <option value="all">Tất cả bác sĩ</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <select
                  className="dm-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="AVAILABLE">Đang mở</option>
                  <option value="FULL">Đã đầy</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
              </div>
            </div>

            <div className="dm-table-wrap">
              <table className="dm-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Bác sĩ</th>
                    <th>Ngày làm việc</th>
                    <th>Giờ làm việc</th>
                    <th>Bệnh nhân</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="dm-table__empty">
                        Không có ca làm việc nào
                      </td>
                    </tr>
                  ) : (
                    filteredSchedules.map((s, i) => {
                      const badge =
                        STATUS_MAP[s.status] ?? { label: s.status, cls: "" };
                      const cur = s.currentPatient ?? 0;
                      const pct = s.maxPatient
                        ? Math.min((cur / s.maxPatient) * 100, 100)
                        : 0;
                      return (
                        <tr key={s.id}>
                          <td style={{ color: "#b0bec5", fontSize: 12 }}>
                            {i + 1}
                          </td>
                          <td>
                            <div className="dm-doctor-cell">
                              <div className="dm-avatar">
                                {s.doctorName.charAt(0)}
                              </div>
                              <span
                                style={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: "#1a2332",
                                }}
                              >
                                {s.doctorName}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="dm-date">
                              {formatDate(s.workDate)}
                            </span>
                          </td>
                          <td>
                            <span className="dm-time">
                              {formatTime(s.startTime)} – {formatTime(s.endTime)}
                            </span>
                          </td>
                          <td>
                            <div className="dm-progress">
                              <div className="dm-progress__bar">
                                <div
                                  className="dm-progress__fill"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="dm-progress__text">
                                {cur}/{s.maxPatient}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className={`dm-badge ${badge.cls}`}>
                              {badge.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════ TAB 2: DOCTORS ══════════════ */}
        {activeTab === "doctor" && (
          <div className="dm-card">
            <div className="dm-card__header">
              <div>
                <span className="dm-card__title">Danh sách bác sĩ</span>
                <span className="dm-card__count">{doctors.length}</span>
              </div>
            </div>

            <div className="dm-table-wrap">
              <table className="dm-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Bác sĩ</th>
                    <th>Chuyên khoa</th>
                    <th>Liên hệ</th>
                    <th>Địa chỉ</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="dm-table__empty">
                        Không có bác sĩ nào
                      </td>
                    </tr>
                  ) : (
                    doctors.map((d, i) => (
                      <tr key={d.id}>
                        <td style={{ color: "#b0bec5", fontSize: 12 }}>
                          {i + 1}
                        </td>
                        <td>
                          <div className="dm-doctor-cell">
                            <div className="dm-avatar">
                              {d.name.charAt(0)}
                            </div>
                            <div>
                              <div className="dm-doctor-cell__name">
                                {LEVER_MAP[d.lever] ?? ""} {d.name}
                              </div>
                              <div className="dm-doctor-cell__spec">
                                <span className="dm-badge--lever dm-badge">
                                  {d.lever}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            style={{
                              fontSize: 12,
                              color: "#5a6a7a",
                              fontWeight: 500,
                            }}
                          >
                            {d.specialized}
                          </span>
                        </td>
                        <td>
                          <div
                            style={{
                              fontSize: 12,
                              color: "#1a2332",
                              lineHeight: 1.6,
                            }}
                          >
                            <div>{d.phone}</div>
                            <div style={{ color: "#7a8ca0" }}>{d.email}</div>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: 12, color: "#7a8ca0" }}>
                            {d.address}
                          </span>
                        </td>
                        <td>
                          <div className="dm-actions">
                            <button
                              className="dm-btn dm-btn--primary"
                              onClick={() => openAssign(d)}
                            >
                              <svg viewBox="0 0 16 16" fill="none">
                                <path
                                  d="M8 3v10M3 8h10"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                />
                              </svg>
                              Phân công
                            </button>
                            <button
                              className="dm-btn dm-btn--outline"
                              onClick={() => openSlots(d)}
                            >
                              <svg viewBox="0 0 16 16" fill="none">
                                <rect
                                  x="2"
                                  y="3"
                                  width="12"
                                  height="11"
                                  rx="2"
                                  stroke="currentColor"
                                  strokeWidth="1.4"
                                />
                                <path
                                  d="M5 1v3M11 1v3M2 7h12"
                                  stroke="currentColor"
                                  strokeWidth="1.4"
                                  strokeLinecap="round"
                                />
                              </svg>
                              Lịch trống
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
        )}
      </div>

      {/* ══════════════ MODAL PHÂN CÔNG ══════════════ */}
      {showAssign && assignTarget && (
        <div className="dm-overlay" onClick={() => setShowAssign(false)}>
          <div className="dm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dm-modal__header">
              <div className="dm-modal__icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h2 className="dm-modal__title">Phân công lịch làm việc</h2>
                <p className="dm-modal__sub">{assignTarget.name}</p>
              </div>
              <button
                className="dm-modal__close"
                onClick={() => setShowAssign(false)}
              >
                ✕
              </button>
            </div>

            <div className="dm-modal__body">
              {submitSuccess ? (
                <div className="dm-success-state">
                  <div className="dm-success-state__icon">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="dm-success-state__text">
                    Phân công thành công!
                  </span>
                </div>
              ) : (
                <>
                  <div className="dm-form-row">
                    <div className="dm-form-group dm-form-group--full">
                      <label className="dm-label">Ngày làm việc</label>
                      <input
                        type="date"
                        className="dm-input"
                        value={assignForm.workDate}
                        onChange={(e) =>
                          setAssignForm((f) => ({
                            ...f,
                            workDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="dm-form-row">
                    <div className="dm-form-group">
                      <label className="dm-label">Giờ bắt đầu</label>
                      <input
                        type="time"
                        className="dm-input"
                        value={assignForm.startTime}
                        onChange={(e) =>
                          setAssignForm((f) => ({
                            ...f,
                            startTime: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="dm-form-group">
                      <label className="dm-label">Giờ kết thúc</label>
                      <input
                        type="time"
                        className="dm-input"
                        value={assignForm.endTime}
                        onChange={(e) =>
                          setAssignForm((f) => ({
                            ...f,
                            endTime: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="dm-form-row">
                    <div className="dm-form-group dm-form-group--full">
                      <label className="dm-label">Số bệnh nhân tối đa</label>
                      <input
                        type="number"
                        className="dm-input"
                        min={1}
                        max={100}
                        value={assignForm.maxPatient}
                        onChange={(e) =>
                          setAssignForm((f) => ({
                            ...f,
                            maxPatient: Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {!submitSuccess && (
              <div className="dm-modal__footer">
                <button
                  className="dm-btn dm-btn--ghost"
                  onClick={() => setShowAssign(false)}
                  disabled={submitting}
                >
                  Hủy
                </button>
                <button
                  className="dm-btn dm-btn--primary"
                  onClick={handleAssignSubmit}
                  disabled={
                    submitting ||
                    !assignForm.workDate ||
                    !assignForm.startTime ||
                    !assignForm.endTime
                  }
                >
                  {submitting ? "Đang lưu..." : "Xác nhận phân công"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════ MODAL LỊCH TRỐNG ══════════════ */}
      {showSlots && slotTarget && (
        <div className="dm-overlay" onClick={() => setShowSlots(false)}>
          <div className="dm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dm-modal__header">
              <div className="dm-modal__icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M12 6v6l4 2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <h2 className="dm-modal__title">Lịch trống</h2>
                <p className="dm-modal__sub">{slotTarget.name}</p>
              </div>
              <button
                className="dm-modal__close"
                onClick={() => setShowSlots(false)}
              >
                ✕
              </button>
            </div>

            <div className="dm-modal__body">
              <div className="dm-slot-search">
                <div className="dm-form-group">
                  <label className="dm-label">Chọn ngày</label>
                  <input
                    type="date"
                    className="dm-input"
                    value={slotDate}
                    onChange={(e) => setSlotDate(e.target.value)}
                  />
                </div>
                <button
                  className="dm-btn dm-btn--primary"
                  style={{ height: 38 }}
                  onClick={fetchSlots}
                  disabled={!slotDate || loadingSlots}
                >
                  {loadingSlots ? "..." : "Tìm"}
                </button>
              </div>

              <div className="dm-slots">
                {loadingSlots ? (
                  <span className="dm-slot-empty">Đang tải...</span>
                ) : slots.length === 0 && slotDate ? (
                  <span className="dm-slot-empty">
                    Không có lịch trống ngày này
                  </span>
                ) : (
                  slots.map((s, i) => (
                    <span key={i} className="dm-slot-chip">
                      {formatTime(s.timeSlot)}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="dm-modal__footer">
              <button
                className="dm-btn dm-btn--ghost"
                onClick={() => setShowSlots(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorManagement;