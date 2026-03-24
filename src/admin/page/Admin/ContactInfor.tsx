import React, { useState, useEffect } from "react";
import { message } from "antd";
import { getTinNhan, deleteTinNhan } from "../../../api/admin";

// Interface khớp 100% với dữ liệu BE trả về
export interface ContactSubmission {
  id: number;
  name: string;
  gmail: string;
  text: string;
  createdAt: string | null;
  updateAt: string | null;
}

const AdminContact: React.FC = () => {
  const [data, setData] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactSubmission | null>(null);

  // ─── Lấy Role từ Local Storage ───────────────────────────


  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await getTinNhan();
      const result = res?.data || res;
      setData(Array.isArray(result) ? result : []);
    } catch {
      message.error("Không thể tải danh sách liên hệ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ─── Filter + search ──────────────────────────────────────
  const filtered = data.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.gmail?.toLowerCase().includes(q) ||
      c.text?.toLowerCase().includes(q)
    );
  });

  // ─── Actions ─────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTinNhan(deleteTarget.id);
      message.success("Xóa liên hệ thành công");
      setData(data.filter((item) => item.id !== deleteTarget.id));
      if (selected?.id === deleteTarget.id) setSelected(null);
      setDeleteTarget(null);
    } catch {
      message.error("Lỗi khi xóa dữ liệu");
    }
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return "Không có";
    const d = new Date(iso);
    return d.toLocaleString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="adc">
      {/* ── Header ── */}
      <div className="adc-header">
        <div className="adc-header__left">
          <h1 className="adc-header__title">Tin nhắn liên hệ</h1>
          <span className="adc-header__count">{data.length} yêu cầu</span>
        </div>
      </div>

      {/* ── Search + toolbar ── */}
      <div className="adc-toolbar">
        <div className="adc-search">
          <svg className="adc-search__icon" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            className="adc-search__input"
            placeholder="Tìm theo tên, email, nội dung..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

      </div>

      {/* ── Table ── */}
      <div className="adc-table-wrap">
        <table className="adc-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th style={{ width: 180 }}>Họ và tên</th>
              <th style={{ width: 220 }}>Gmail</th>
              <th>Nội dung liên hệ</th>
              <th style={{ width: 160 }}>Thời gian</th>
              <th style={{ width: 100 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="adc-table__empty">Đang tải...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="adc-table__empty">Không tìm thấy yêu cầu nào</td></tr>
            ) : (
              filtered.map((c, i) => (
                <tr key={c.id} className="adc-table__row" onClick={() => setSelected(c)}>
                  <td className="adc-table__idx">{i + 1}</td>
                  <td><div className="adc-table__name">{c.name}</div></td>
                  <td>
                    <div className="adc-table__contact adc-table__contact--email">
                      <svg viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" /><path d="M1 4.5l6 4 6-4" stroke="currentColor" strokeWidth="1.2" /></svg>
                      {c.gmail}
                    </div>
                  </td>
                  <td><p className="adc-table__message">{c.text}</p></td>
                  <td className="adc-table__date">{formatDate(c.createdAt)}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="adc-actions">
                      <button className="adc-actions__btn adc-actions__btn--view" onClick={() => setSelected(c)}>
                        👁️
                      </button>


                      <button className="adc-actions__btn adc-actions__btn--delete" onClick={() => setDeleteTarget(c)}>
                        🗑️
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ══ MODAL CHI TIẾT ══ */}
      {selected && (
        <div className="adc-overlay" onClick={() => setSelected(null)}>
          <div className="adc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adc-modal__header">
              <div className="adc-modal__header-left">
                <div className="adc-modal__avatar">{selected.name.charAt(0).toUpperCase()}</div>
                <div>
                  <h2 className="adc-modal__name">{selected.name}</h2>
                  <p className="adc-modal__date">Ngày gửi: {formatDate(selected.createdAt)}</p>
                </div>
              </div>
              <button className="adc-modal__close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="adc-modal__body">
              <div className="adc-detail-row">
                <span className="adc-detail-label">Email</span>
                <span className="adc-detail-value adc-detail-value--email">{selected.gmail}</span>
              </div>
              <div className="adc-detail-message">
                <p className="adc-detail-label">Nội dung tin nhắn</p>
                <div className="adc-detail-message__box">{selected.text}</div>
              </div>
            </div>
            <div className="adc-modal__footer">
              <button className="adc-btn adc-btn--ghost" onClick={() => setSelected(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL XÁC NHẬN XÓA ══ */}
      {deleteTarget && (
        <div className="adc-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="adc-modal adc-modal--confirm" onClick={(e) => e.stopPropagation()} style={{padding:'20px'}}>
            <h3 className="adc-confirm__title">Xác nhận xóa</h3>
            <p className="adc-confirm__desc">Bạn có chắc muốn xóa tin nhắn của <strong>{deleteTarget.name}</strong>?</p>
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