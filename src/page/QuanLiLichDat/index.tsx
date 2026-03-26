import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { getUserAppointments, cancelAppointment } from "../../api/api";

interface Appointment {
    id: number;
    name: string;
    date: string;
    phone: string;
    gmail: string;
    address: string;
    createdAt: string;
    doctorName: string;
    timeOpen: string;
    note: string;
    status: "PENDING" | "CONFIRMED" | "SUCCESS" | "CANCELLED";
    fileUrl?: string;
}

const STATUS_MAP = {
    PENDING: { label: "Chờ xác nhận", cls: "upcoming" },
    CONFIRMED: { label: "Đã xác nhận", cls: "upcoming" },
    SUCCESS: { label: "Đã hoàn tất", cls: "completed" },
    CANCELLED: { label: "Đã huỷ", cls: "cancelled" },
};

const formatDate = (iso: string) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
};

const formatTime = (time: string) => {
    if (!time) return "";
    return time.slice(0, 5);
};

const UserAppointment: React.FC = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
    const [filter, setFilter] = useState<"all" | Appointment["status"]>("all");
    const [cancelling, setCancelling] = useState(false);

    // Fetch appointments on mount
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true);
                const data = await getUserAppointments();
                setAppointments(Array.isArray(data) ? data : data?.data ?? []);
            } catch (error) {
                console.error("Lỗi tải lịch khám:", error);
                message.error("Không thể tải lịch khám");
                setAppointments([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const filtered = appointments.filter(a =>
        filter === "all" ? true : a.status === filter
    );

    const handleCancel = async () => {
        if (!cancelTarget) return;
        
        try {
            setCancelling(true);
            await cancelAppointment(cancelTarget.id);
            message.success("Huỷ lịch khám thành công");
            
            // Update local state
            setAppointments(prev =>
                prev.map(a => a.id === cancelTarget.id ? { ...a, status: "CANCELLED" } : a)
            );
            setCancelTarget(null);
        } catch (error) {
            console.error("Lỗi huỷ lịch:", error);
            message.error("Huỷ lịch thất bại");
        } finally {
            setCancelling(false);
        }
    };

    const handleViewFile = (fileUrl?: string) => {
        if (!fileUrl) {
            message.warning("Chưa có file kết quả");
            return;
        }
        window.open(fileUrl, "_blank");
    };

    const countBy = (s: Appointment["status"]) => appointments.filter(a => a.status === s).length;

    if (loading) {
        return (
            <div className="uap">
                <div style={{ padding: "60px 20px", textAlign: "center" }}>Đang tải lịch khám...</div>
            </div>
        );
    }

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
                {(["all", "PENDING", "CONFIRMED", "SUCCESS", "CANCELLED"] as const).map(f => (
                    <button
                        key={f}
                        className={`uap-filter-btn ${filter === f ? "uap-filter-btn--active" : ""} ${f !== "all" ? `uap-filter-btn--${f.toLowerCase()}` : ""}`}
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
                    <div key={a.id} className={`uap-card uap-card--${STATUS_MAP[a.status].cls}`}>

                        <div className="uap-card__left">
                            <div className="uap-card__date-block">
                                <span className="uap-card__day">
                                    {a.createdAt ? a.createdAt.split("-")[2] : "--"}
                                </span>
                                <span className="uap-card__month-year">
                                    {a.createdAt ? `Th${a.createdAt.split("-")[1]}/${a.createdAt.split("-")[0]}` : "--"}
                                </span>
                            </div>
                        </div>

                        <div className="uap-card__divider" />

                        <div className="uap-card__body">
                            <div className="uap-card__top">
                                <div className="uap-card__info">
                                    <span className={`uap-badge uap-badge--${STATUS_MAP[a.status].cls}`}>
                                        {a.status === "PENDING" && (
                                            <svg viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2" /><path d="M5 3v2l1.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                                        )}
                                        {a.status === "CONFIRMED" && (
                                            <svg viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2" /><path d="M5 3v2l1.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                                        )}
                                        {a.status === "SUCCESS" && (
                                            <svg viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5 3.5-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        )}
                                        {a.status === "CANCELLED" && (
                                            <svg viewBox="0 0 10 10" fill="none"><path d="M3 3l4 4M7 3l-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                                        )}
                                        {STATUS_MAP[a.status].label}
                                    </span>
                                </div>
                            </div>

                            <div className="uap-card__details">
                                <div className="uap-card__detail-row">
                                    <svg viewBox="0 0 14 14" fill="none"><path d="M7 1a5 5 0 100 10A5 5 0 007 1zM7 3v4l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                                    <span>{formatTime(a.timeOpen)}</span>
                                </div>
                                <div className="uap-card__detail-row">
                                    <svg viewBox="0 0 14 14" fill="none"><path d="M7 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM2 13a5 5 0 0110 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                                    <span>{a.doctorName}</span>
                                </div>
                                <div className="uap-card__detail-row uap-card__detail-row--problem">
                                    <svg viewBox="0 0 14 14" fill="none"><rect x="2" y="1" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" /><path d="M5 5h4M5 8h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                                    <span>{a.note}</span>
                                </div>
                            </div>
                        </div>

                        <div className="uap-card__actions">
                            {a.status === "PENDING" && (
                                <button
                                    className="uap-card__action-btn uap-card__action-btn--cancel"
                                    onClick={() => setCancelTarget(a)}
                                >
                                    Huỷ lịch
                                </button>
                            )}
                            {a.status === "SUCCESS" && (
                                <button
                                    className="uap-card__action-btn uap-card__action-btn--download"
                                    onClick={() => handleViewFile(a.fileUrl)}
                                    title="Xem file kết quả"
                                >
                                    <svg viewBox="0 0 14 14" fill="none">
                                        <path d="M2 10.5h10M7 1v8.5M4.5 7l2.5 2.5 2.5-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

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
                            Bạn sắp huỷ lịch khám ngày <strong>{formatDate(cancelTarget.createdAt)}</strong> lúc <strong>{formatTime(cancelTarget.timeOpen)}</strong> với <strong>{cancelTarget.doctorName}</strong>.<br />
                            Bạn có thể đặt lại lịch sau khi huỷ.
                        </p>
                        <div className="uap-confirm__actions">
                            <button className="uap-btn uap-btn--ghost" onClick={() => setCancelTarget(null)}>Giữ lịch</button>
                            <button className="uap-btn uap-btn--warning" onClick={handleCancel} disabled={cancelling}>
                                {cancelling ? "Đang huỷ..." : "Xác nhận huỷ"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UserAppointment;
