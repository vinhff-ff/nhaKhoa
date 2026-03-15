import React, { useState } from "react";

export interface ContactSubmission {
  id: number;
  name: string;
  contact: string; // sđt hoặc email
  message: string;
  createdAt: string;
  status: "new" | "read" | "done";
}

const initialData: ContactSubmission[] = [
  {
    id: 1,
    name: "Nguyễn Thị Lan",
    contact: "0912 345 678",
    message: "Tôi muốn tư vấn về phương pháp điều trị cận thị cho con tôi 10 tuổi. Hiện tại bé bị cận 2 độ và tôi muốn biết có thể dùng kính Ortho-K không?",
    createdAt: "2025-06-10T08:30:00",
    status: "new",
  },
  {
    id: 2,
    name: "Trần Văn Minh",
    contact: "tranminh@gmail.com",
    message: "Cho tôi hỏi phòng khám có thực hiện phẫu thuật LASIK không? Chi phí khoảng bao nhiêu và thời gian phục hồi là bao lâu?",
    createdAt: "2025-06-10T09:15:00",
    status: "read",
  },
  {
    id: 3,
    name: "Phạm Hoàng Anh",
    contact: "0987 654 321",
    message: "Tôi bị đau mắt và nhìn mờ từ 3 ngày nay, muốn đặt lịch khám sớm nhất có thể. Phòng khám có nhận khám buổi tối không?",
    createdAt: "2025-06-09T14:20:00",
    status: "done",
  },
  {
    id: 4,
    name: "Lê Thị Hương",
    contact: "huongle92@yahoo.com",
    message: "Xin hỏi về dịch vụ khám mắt định kỳ cho người cao tuổi. Mẹ tôi năm nay 68 tuổi, bị tiểu đường và muốn kiểm tra võng mạc.",
    createdAt: "2025-06-09T10:00:00",
    status: "new",
  },
  {
    id: 5,
    name: "Vũ Đức Thành",
    contact: "0903 111 222",
    message: "Tôi muốn hỏi về giá kính áp tròng và cách chăm sóc sau khi đeo. Phòng khám có tư vấn miễn phí không?",
    createdAt: "2025-06-08T16:45:00",
    status: "read",
  },
  {
    id: 6,
    name: "Bùi Thị Mai",
    contact: "maibui2001@gmail.com",
    message: "Mắt tôi hay bị khô và mỏi khi làm việc với máy tính. Tôi cần tư vấn về hội chứng mắt máy tính và cách điều trị.",
    createdAt: "2025-06-08T11:30:00",
    status: "done",
  },
  {
    id: 7,
    name: "Đỗ Ngọc Sơn",
    contact: "0978 888 999",
    message: "Tôi bị loạn thị từ nhỏ, muốn hỏi xem có thể phẫu thuật để không cần đeo kính nữa không? Tuổi tôi hiện tại là 28.",
    createdAt: "2025-06-07T09:00:00",
    status: "new",
  },
  {
    id: 8,
    name: "Nguyễn Thị Bích Ngọc",
    contact: "bichngoc.nt@outlook.com",
    message: "Phòng khám có dịch vụ khám mắt tại nhà cho người già không đi lại được không? Ông nội tôi 82 tuổi, mắt đang rất kém.",
    createdAt: "2025-06-07T15:10:00",
    status: "read",
  },
];

const STATUS_LABEL: Record<ContactSubmission["status"], string> = {
  new: "Mới",
  read: "Đã xem",
  done: "Hoàn tất",
};

type FilterStatus = "all" | ContactSubmission["status"];

const AdminContact: React.FC = () => {
  const [data, setData] = useState<ContactSubmission[]>(initialData);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactSubmission | null>(null);

  // ── Filter + search ───────────────────────────
  const filtered = data.filter((c) => {
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch =
      c.name.toLowerCase().includes(q) ||
      c.contact.toLowerCase().includes(q) ||
      c.message.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const countByStatus = (s: ContactSubmission["status"]) =>
    data.filter((c) => c.status === s).length;

  // ── Actions ───────────────────────────────────
  const handleChangeStatus = (id: number, status: ContactSubmission["status"]) => {
    setData(data.map((c) => (c.id === id ? { ...c, status } : c)));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setData(data.filter((c) => c.id !== deleteTarget.id));
    if (selected?.id === deleteTarget.id) setSelected(null);
    setDeleteTarget(null);
  };

  const openDetail = (c: ContactSubmission) => {
    setSelected(c);
    // Auto-mark as read when opened
    if (c.status === "new") handleChangeStatus(c.id, "read");
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const isEmail = (val: string) => val.includes("@");

  return (
    <div className="adc">

      {/* ── Header ── */}
      <div className="adc-header">
        <div className="adc-header__left">
          <h1 className="adc-header__title">Thông tin liên hệ</h1>
          <span className="adc-header__count">{data.length} yêu cầu</span>
        </div>
      </div>

      {/* ── Stat pills ── */}
      <div className="adc-stats">
        {(["all", "new", "read", "done"] as FilterStatus[]).map((s) => (
          <button
            key={s}
            className={`adc-stat ${filterStatus === s ? "adc-stat--active" : ""} ${s !== "all" ? `adc-stat--${s}` : ""}`}
            onClick={() => setFilterStatus(s)}
          >
            <span className="adc-stat__label">
              {s === "all" ? "Tất cả" : STATUS_LABEL[s]}
            </span>
            <span className="adc-stat__num">
              {s === "all" ? data.length : countByStatus(s)}
            </span>
          </button>
        ))}
      </div>

      {/* ── Search + toolbar ── */}
      <div className="adc-toolbar">
        <div className="adc-search">
          <svg className="adc-search__icon" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            className="adc-search__input"
            placeholder="Tìm theo tên, SĐT, email, nội dung..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="adc-search__clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>
        <span className="adc-toolbar__result">
          Hiển thị {filtered.length} / {data.length}
        </span>
      </div>

      {/* ── Table ── */}
      <div className="adc-table-wrap">
        <table className="adc-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th style={{ width: 160 }}>Họ và tên</th>
              <th style={{ width: 180 }}>SĐT / Email</th>
              <th>Nội dung tư vấn</th>
              <th style={{ width: 140 }}>Thời gian</th>
              <th style={{ width: 110 }}>Trạng thái</th>
              <th style={{ width: 120 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="adc-table__empty">
                  Không có yêu cầu nào
                </td>
              </tr>
            ) : (
              filtered.map((c, i) => (
                <tr
                  key={c.id}
                  className={`adc-table__row ${c.status === "new" ? "adc-table__row--new" : ""}`}
                  onClick={() => openDetail(c)}
                >
                  <td className="adc-table__idx">{i + 1}</td>
                  <td>
                    <div className="adc-table__name">
                      {c.status === "new" && <span className="adc-table__dot" />}
                      {c.name}
                    </div>
                  </td>
                  <td>
                    <div className={`adc-table__contact ${isEmail(c.contact) ? "adc-table__contact--email" : "adc-table__contact--phone"}`}>
                      {isEmail(c.contact) ? (
                        <svg viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 4.5l6 4 6-4" stroke="currentColor" strokeWidth="1.2"/></svg>
                      ) : (
                        <svg viewBox="0 0 14 14" fill="none"><path d="M10.5 9.5l-1.5 1.5C7 11 3 7 3 5l1.5-1.5 1.5 2-1 1c.5 1.5 2.5 3.5 4 4l1-1 1.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                      )}
                      {c.contact}
                    </div>
                  </td>
                  <td>
                    <p className="adc-table__message">{c.message}</p>
                  </td>
                  <td className="adc-table__date">{formatDate(c.createdAt)}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <select
                      className={`adc-status-select adc-status-select--${c.status}`}
                      value={c.status}
                      onChange={(e) =>
                        handleChangeStatus(c.id, e.target.value as ContactSubmission["status"])
                      }
                    >
                      <option value="new">Mới</option>
                      <option value="read">Đã xem</option>
                      <option value="done">Hoàn tất</option>
                    </select>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="adc-actions">
                      <button
                        className="adc-actions__btn adc-actions__btn--view"
                        title="Xem chi tiết"
                        onClick={() => openDetail(c)}
                      >
                        <svg viewBox="0 0 16 16" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>
                      </button>
                      <button
                        className="adc-actions__btn adc-actions__btn--delete"
                        title="Xóa"
                        onClick={() => setDeleteTarget(c)}
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

      {/* ══ DETAIL MODAL ══ */}
      {selected && (
        <div className="adc-overlay" onClick={() => setSelected(null)}>
          <div className="adc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adc-modal__header">
              <div className="adc-modal__header-left">
                <div className="adc-modal__avatar">
                  {selected.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="adc-modal__name">{selected.name}</h2>
                  <p className="adc-modal__date">{formatDate(selected.createdAt)}</p>
                </div>
              </div>
              <button className="adc-modal__close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="adc-modal__body">
              {/* Contact info */}
              <div className="adc-detail-row">
                <span className="adc-detail-label">
                  {isEmail(selected.contact) ? "Email" : "Số điện thoại"}
                </span>
                <span className={`adc-detail-value adc-detail-value--${isEmail(selected.contact) ? "email" : "phone"}`}>
                  {selected.contact}
                </span>
              </div>

              <div className="adc-detail-row">
                <span className="adc-detail-label">Trạng thái</span>
                <select
                  className={`adc-status-select adc-status-select--${selected.status}`}
                  value={selected.status}
                  onChange={(e) =>
                    handleChangeStatus(selected.id, e.target.value as ContactSubmission["status"])
                  }
                >
                  <option value="new">Mới</option>
                  <option value="read">Đã xem</option>
                  <option value="done">Hoàn tất</option>
                </select>
              </div>

              {/* Message */}
              <div className="adc-detail-message">
                <p className="adc-detail-label">Nội dung tư vấn</p>
                <div className="adc-detail-message__box">
                  {selected.message}
                </div>
              </div>
            </div>

            <div className="adc-modal__footer">
              <button
                className="adc-btn adc-btn--danger-ghost"
                onClick={() => { setDeleteTarget(selected); setSelected(null); }}
              >
                Xóa yêu cầu
              </button>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="adc-btn adc-btn--ghost" onClick={() => setSelected(null)}>Đóng</button>
                <button
                  className="adc-btn adc-btn--primary"
                  onClick={() => handleChangeStatus(selected.id, "done")}
                  disabled={selected.status === "done"}
                >
                  Đánh dấu hoàn tất
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ DELETE CONFIRM ══ */}
      {deleteTarget && (
        <div className="adc-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="adc-modal adc-modal--confirm" onClick={(e) => e.stopPropagation()}>
            <div className="adc-confirm__icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="adc-confirm__title">Xác nhận xóa</h3>
            <p className="adc-confirm__desc">
              Xóa yêu cầu tư vấn của <strong>{deleteTarget.name}</strong>?<br />
              Hành động này không thể hoàn tác.
            </p>
            <div className="adc-confirm__actions">
              <button className="adc-btn adc-btn--ghost" onClick={() => setDeleteTarget(null)}>Hủy</button>
              <button className="adc-btn adc-btn--danger" onClick={handleDelete}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContact;