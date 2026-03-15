import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


interface Appointment {
    id: number;
    examDate: string;
    doctor: string;
    examTime: string;
    problem: string;
    status: "upcoming" | "cancelled" | "completed";
    createdAt: string;
}

const doctors = [
    { label: "BS. Lê Thị Thu Hà", value: "le-thi-thu-ha" },
    { label: "BS. Nguyễn Minh Anh", value: "nguyen-minh-anh" },
    { label: "BS. Trần Đức Hùng", value: "tran-duc-hung" },
    { label: "BS. Phạm Hoàng Nam", value: "pham-hoang-nam" },
    { label: "BS. Nguyễn Thu Trang", value: "nguyen-thu-trang" },
];

const times = ["08:00", "09:00", "10:00", "13:30", "15:00", "16:30"];

const initialAppointments: Appointment[] = [
    {
        id: 1,
        examDate: "2025-06-20",
        doctor: "BS. Lê Thị Thu Hà",
        examTime: "09:00",
        problem: "Mắt bị mờ khi nhìn xa, nghi cận thị tăng độ.",
        status: "upcoming",
        createdAt: "2025-06-10",
    },
    {
        id: 2,
        examDate: "2025-05-15",
        doctor: "BS. Trần Đức Hùng",
        examTime: "13:30",
        problem: "Kiểm tra định kỳ sau phẫu thuật đục thủy tinh thể.",
        status: "completed",
        createdAt: "2025-05-01",
    },
    {
        id: 3,
        examDate: "2025-04-10",
        doctor: "BS. Nguyễn Minh Anh",
        examTime: "10:00",
        problem: "Mắt khô và mỏi sau khi làm việc với máy tính nhiều giờ.",
        status: "cancelled",
        createdAt: "2025-03-28",
    },
];

const emptyForm = {
    examDate: "",
    doctorValue: "",
    examTime: "",
    problem: "",
};

type ModalMode = "add" | "edit" | null;

const STATUS_MAP = {
    upcoming: { label: "Sắp tới", cls: "upcoming" },
    completed: { label: "Đã hoàn tất", cls: "completed" },
    cancelled: { label: "Đã huỷ", cls: "cancelled" },
};

const formatDate = (iso: string) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
};

const UserAppointment: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [editTarget, setEditTarget] = useState<Appointment | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Partial<typeof emptyForm>>({});
    const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Appointment | null>(null);
    const [filter, setFilter] = useState<"all" | Appointment["status"]>("all");
    const navigate = useNavigate();
    const filtered = appointments.filter(a =>
        filter === "all" ? true : a.status === filter
    );

    const validate = () => {
        const e: Partial<typeof emptyForm> = {};
        if (!form.examDate) e.examDate = "Vui lòng chọn ngày khám";
        if (!form.doctorValue) e.doctorValue = "Vui lòng chọn bác sĩ";
        if (!form.examTime) e.examTime = "Vui lòng chọn giờ khám";
        if (!form.problem.trim()) e.problem = "Vui lòng mô tả vấn đề";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const openAdd = () => {
        setForm(emptyForm);
        setErrors({});
        setEditTarget(null);
        setModalMode("add");
    };

    const openRebook = (a: Appointment) => {
        const doc = doctors.find(d => d.label === a.doctor);
        setForm({
            examDate: "",
            doctorValue: doc?.value ?? "",
            examTime: a.examTime,
            problem: a.problem,
        });
        setErrors({});
        setEditTarget(a);
        setModalMode("edit");
    };

    const closeModal = () => {
        setModalMode(null);
        setEditTarget(null);
        setForm(emptyForm);
        setErrors({});
    };

    const handleSave = () => {
        if (!validate()) return;
        const docLabel = doctors.find(d => d.value === form.doctorValue)?.label ?? "";
        const today = new Date().toISOString().split("T")[0];

        if (modalMode === "add") {
            const newId = Math.max(0, ...appointments.map(a => a.id)) + 1;
            setAppointments([
                {
                    id: newId,
                    examDate: form.examDate,
                    doctor: docLabel,
                    examTime: form.examTime,
                    problem: form.problem,
                    status: "upcoming",
                    createdAt: today,
                },
                ...appointments,
            ]);
        } else if (modalMode === "edit" && editTarget) {
            const newId = Math.max(0, ...appointments.map(a => a.id)) + 1;
            setAppointments([
                {
                    id: newId,
                    examDate: form.examDate,
                    doctor: docLabel,
                    examTime: form.examTime,
                    problem: form.problem,
                    status: "upcoming",
                    createdAt: today,
                },
                ...appointments,
            ]);
        }
        closeModal();
    };

    const handleCancel = () => {
        if (!cancelTarget) return;
        setAppointments(prev =>
            prev.map(a => a.id === cancelTarget.id ? { ...a, status: "cancelled" } : a)
        );
        setCancelTarget(null);
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        setAppointments(prev => prev.filter(a => a.id !== deleteTarget.id));
        setDeleteTarget(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const countBy = (s: Appointment["status"]) => appointments.filter(a => a.status === s).length;

    return (
        <div className="uap">

            <div className="uap-header">
                <div className="uap-header__left">
                    <h1 className="uap-header__title">Lịch khám của tôi</h1>
                </div>
                <button className="uap-btn uap-btn--primary" onClick={() => navigate('/order-lich-kham')}>
                    <svg viewBox="0 0 16 16" fill="none">
                        <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Đặt lịch mới
                </button>
            </div>

            <div className="uap-filters">
                {(["all", "upcoming", "completed", "cancelled"] as const).map(f => (
                    <button
                        key={f}
                        className={`uap-filter-btn ${filter === f ? "uap-filter-btn--active" : ""} ${f !== "all" ? `uap-filter-btn--${f}` : ""}`}
                        onClick={() => setFilter(f)}
                    >
                        {f === "all" ? "Tất cả" : STATUS_MAP[f].label}
                        <span className="uap-filter-btn__count">
                            {f === "all" ? appointments.length : countBy(f)}
                        </span>
                    </button>
                ))}
            </div>

            <div className="uap-list">
                {filtered.length === 0 && (
                    <div className="uap-empty">
                        <svg viewBox="0 0 48 48" fill="none">
                            <rect x="6" y="10" width="36" height="32" rx="4" stroke="currentColor" strokeWidth="1.8" />
                            <path d="M6 18h36M16 6v6M32 6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            <path d="M16 28h8M16 34h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                        <p>Không có lịch hẹn nào</p>
                    </div>
                )}

                {filtered.map(a => (
                    <div key={a.id} className={`uap-card uap-card--${a.status}`}>

                        <div className="uap-card__left">
                            <div className="uap-card__date-block">
                                <span className="uap-card__day">
                                    {a.examDate ? a.examDate.split("-")[2] : "--"}
                                </span>
                                <span className="uap-card__month-year">
                                    {a.examDate ? `Th${a.examDate.split("-")[1]}/${a.examDate.split("-")[0]}` : "--"}
                                </span>
                            </div>
                        </div>

                        <div className="uap-card__divider" />

                        <div className="uap-card__body">
                            <div className="uap-card__top">
                                <div className="uap-card__info">
                                    <span className={`uap-badge uap-badge--${a.status}`}>
                                        {a.status === "upcoming" && (
                                            <svg viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2" /><path d="M5 3v2l1.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                                        )}
                                        {a.status === "completed" && (
                                            <svg viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5 3.5-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        )}
                                        {a.status === "cancelled" && (
                                            <svg viewBox="0 0 10 10" fill="none"><path d="M3 3l4 4M7 3l-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                                        )}
                                        {STATUS_MAP[a.status].label}
                                    </span>
                                </div>
                            </div>

                            <div className="uap-card__details">
                                <div className="uap-card__detail-row">
                                    <svg viewBox="0 0 14 14" fill="none"><path d="M7 1a5 5 0 100 10A5 5 0 007 1zM7 3v4l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                                    <span>{a.examTime}</span>
                                </div>
                                <div className="uap-card__detail-row">
                                    <svg viewBox="0 0 14 14" fill="none"><path d="M7 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM2 13a5 5 0 0110 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                                    <span>{a.doctor}</span>
                                </div>
                                <div className="uap-card__detail-row uap-card__detail-row--problem">
                                    <svg viewBox="0 0 14 14" fill="none"><rect x="2" y="1" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" /><path d="M5 5h4M5 8h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                                    <span>{a.problem}</span>
                                </div>
                            </div>
                        </div>

                        <div className="uap-card__actions">
                            {a.status === "upcoming" && (
                                <button
                                    className="uap-card__action-btn uap-card__action-btn--cancel"
                                    onClick={() => setCancelTarget(a)}
                                >
                                    Huỷ lịch
                                </button>
                            )}
                            {a.status === "cancelled" && (
                                <button
                                    className="uap-card__action-btn uap-card__action-btn--rebook"
                                    onClick={() => navigate('/order-lich-kham')}
                                >
                                    Đặt lại
                                </button>
                            )}
                            <button
                                className="uap-card__action-btn uap-card__action-btn--delete"
                                onClick={() => setDeleteTarget(a)}
                                title="Xoá lịch"
                            >
                                <svg viewBox="0 0 14 14" fill="none">
                                    <path d="M2.5 3.5h9M5 3.5V2h4v1.5M4.5 3.5v8h5v-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {modalMode && (
                <div className="uap-overlay" onClick={closeModal}>
                    <div className="uap-modal" onClick={e => e.stopPropagation()}>
                        <div className="uap-modal__header">
                            <h2>{modalMode === "add" ? "Đặt lịch khám" : "Đặt lịch lại"}</h2>
                            <button className="uap-modal__close" onClick={closeModal}>✕</button>
                        </div>

                        <div className="uap-modal__body">
                            {modalMode === "edit" && editTarget && (
                                <div className="uap-rebook-notice">
                                    <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" /><path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                                    Đặt lại từ lịch đã huỷ ngày {formatDate(editTarget.examDate)} — {editTarget.examTime}
                                </div>
                            )}

                            <div className="uap-field">
                                <label>Ngày khám <span>*</span></label>
                                <input
                                    type="date"
                                    name="examDate"
                                    value={form.examDate}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split("T")[0]}
                                />
                                {errors.examDate && <p className="uap-field__error">{errors.examDate}</p>}
                            </div>

                            <div className="uap-field">
                                <label>Chọn bác sĩ <span>*</span></label>
                                <select name="doctorValue" value={form.doctorValue} onChange={handleChange}>
                                    <option value="">-- Chọn bác sĩ --</option>
                                    {doctors.map(d => (
                                        <option key={d.value} value={d.value}>{d.label}</option>
                                    ))}
                                </select>
                                {errors.doctorValue && <p className="uap-field__error">{errors.doctorValue}</p>}
                            </div>

                            <div className="uap-field">
                                <label>Giờ khám <span>*</span></label>
                                <div className="uap-time-grid">
                                    {times.map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            className={`uap-time-btn ${form.examTime === t ? "uap-time-btn--active" : ""}`}
                                            onClick={() => {
                                                setForm(prev => ({ ...prev, examTime: t }));
                                                setErrors(prev => ({ ...prev, examTime: undefined }));
                                            }}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                                {errors.examTime && <p className="uap-field__error">{errors.examTime}</p>}
                            </div>

                            <div className="uap-field">
                                <label>Vấn đề của tôi <span>*</span></label>
                                <textarea
                                    name="problem"
                                    value={form.problem}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Mô tả vấn đề về mắt bạn đang gặp phải..."
                                />
                                {errors.problem && <p className="uap-field__error">{errors.problem}</p>}
                            </div>
                        </div>

                        <div className="uap-modal__footer">
                            <button className="uap-btn uap-btn--ghost" onClick={closeModal}>Hủy</button>
                            <button className="uap-btn uap-btn--primary" onClick={handleSave}>
                                {modalMode === "add" ? "Xác nhận đặt lịch" : "Xác nhận đặt lại"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {cancelTarget && (
                <div className="uap-overlay" onClick={() => setCancelTarget(null)}>
                    <div className="uap-modal uap-modal--confirm" onClick={e => e.stopPropagation()}>
                        <div className="uap-confirm__icon uap-confirm__icon--warning">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3 className="uap-confirm__title">Huỷ lịch khám?</h3>
                        <p className="uap-confirm__desc">
                            Bạn sắp huỷ lịch khám ngày <strong>{formatDate(cancelTarget.examDate)}</strong> lúc <strong>{cancelTarget.examTime}</strong> với <strong>{cancelTarget.doctor}</strong>.<br />
                            Bạn có thể đặt lại lịch sau khi huỷ.
                        </p>
                        <div className="uap-confirm__actions">
                            <button className="uap-btn uap-btn--ghost" onClick={() => setCancelTarget(null)}>Giữ lịch</button>
                            <button className="uap-btn uap-btn--warning" onClick={handleCancel}>Xác nhận huỷ</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteTarget && (
                <div className="uap-overlay" onClick={() => setDeleteTarget(null)}>
                    <div className="uap-modal uap-modal--confirm" onClick={e => e.stopPropagation()}>
                        <div className="uap-confirm__icon uap-confirm__icon--danger">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3 className="uap-confirm__title">Xoá lịch hẹn?</h3>
                        <p className="uap-confirm__desc">
                            Xoá lịch ngày <strong>{formatDate(deleteTarget.examDate)}</strong> với <strong>{deleteTarget.doctor}</strong>?<br />
                            Hành động này không thể hoàn tác.
                        </p>
                        <div className="uap-confirm__actions">
                            <button className="uap-btn uap-btn--ghost" onClick={() => setDeleteTarget(null)}>Hủy</button>
                            <button className="uap-btn uap-btn--danger" onClick={handleDelete}>Xoá</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserAppointment;