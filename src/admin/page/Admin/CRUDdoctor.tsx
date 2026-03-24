import React, { useState, useEffect } from "react";
import { message } from "antd";
import { getDoctor, createDoctor, deleteDoctor } from "../../../api/admin";


export interface Doctor {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialized: string;
  information: string;
  address: string;
  img: string | null;
  lever: string;
  createdAt: string | null;
}

type ModalMode = "add" | "view" | null;

interface AddForm {
  gmail: string;
  name: string;
  specialized: string;
}

const emptyForm: AddForm = { gmail: "", name: "", specialized: "" };

const AdminDoctor: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [form, setForm] = useState<AddForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Doctor | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");

  // ─── Fetch danh sách bác sĩ ──────────────────────────────
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await getDoctor();
      if (res.message === "Get all success") {
        setDoctors(res.data);
      } else {
        message.error(res.message || "Không thể tải danh sách bác sĩ");
      }
    } catch {
      message.error("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // ─── Filter ───────────────────────────────────────────────
  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      d.specialized.toLowerCase().includes(search.toLowerCase())
  );

  // ─── Modal helpers ────────────────────────────────────────
  const openAdd = () => {
    setForm(emptyForm);
    setModalMode("add");
  };

  const openView = (d: Doctor) => {
    setSelected(d);
    setModalMode("view");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelected(null);
    setForm(emptyForm);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ─── Thêm bác sĩ ─────────────────────────────────────────
  const handleSave = async () => {
    if (!form.gmail.trim() || !form.name.trim() || !form.specialized.trim()) {
      message.warning("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }
    try {
      setSaving(true);
      const res = await createDoctor(form);
      message.success("Thêm bác sĩ thành công");
      closeModal();
      fetchDoctors();
    } catch {
      message.error("Lỗi kết nối server");
    } finally {
      setSaving(false);
    }
  };

  // ─── Xoá bác sĩ ──────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await deleteDoctor(deleteTarget.id);
      message.success("Xóa bác sĩ thành công");
      setDeleteTarget(null);
      fetchDoctors();
    } catch {
      message.error("Bác sĩ đang được phân công, không được phép xoá");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="adm">
      <div className="adm-header">
        <div className="adm-header__left">
          <h1 className="adm-header__title">Quản lý bác sĩ</h1>
          <span className="adm-header__count">{doctors.length} bác sĩ</span>
        </div>
        <button className="adm-btn adm-btn--primary" onClick={openAdd}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Thêm bác sĩ
        </button>
      </div>

      <div className="adm-toolbar">
        <div className="adm-search">
          <svg className="adm-search__icon" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            className="adm-search__input"
            placeholder="Tìm theo tên, email, chuyên khoa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{paddingLeft:'30px'}}
          />
        </div>
        <span className="adm-toolbar__result">
          Hiển thị {filtered.length} / {doctors.length}
        </span>
      </div>

      <div className="adm-table-wrap">
        {loading ? (
          <div className="adm-table__loading">Đang tải dữ liệu...</div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th style={{ width: 48 }}>#</th>
                <th style={{ width: 56 }}>Ảnh</th>
                <th>Họ và tên</th>
                <th>Chuyên khoa</th>
                <th>Email</th>
                <th>Học vị</th>
                <th style={{ width: 120 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="adm-table__empty">
                    Không tìm thấy bác sĩ nào
                  </td>
                </tr>
              ) : (
                filtered.map((d, i) => (
                  <tr key={d.id} className="adm-table__row">
                    <td className="adm-table__idx">{i + 1}</td>
                    <td>
                      <img
                        className="adm-table__avatar"
                        src={
                          d.img ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=d6e8f5&color=1a3a5c`
                        }
                        alt={d.name}
                      />
                    </td>
                    <td>
                      <span className="adm-table__name">{d.name}</span>
                    </td>
                    <td>
                      <span className="adm-table__school">{d.specialized}</span>
                    </td>
                    <td>
                      <span className="adm-table__gmail">{d.email}</span>
                    </td>
                    <td>
                      <span className="adm-table__lever">{d.lever}</span>
                    </td>
                    <td>
                      <div className="adm-actions">
                        <button
                          className="adm-actions__btn adm-actions__btn--view"
                          title="Xem"
                          onClick={() => openView(d)}
                        >
                          👁️
                        </button>
                        <button
                          className="adm-actions__btn adm-actions__btn--delete"
                          title="Xóa"
                          onClick={() => setDeleteTarget(d)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ─── Modal Thêm bác sĩ ─────────────────────────────── */}
      {modalMode === "add" && (
        <div className="adm-overlay" onClick={closeModal}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal__header">
              <h2>Thêm bác sĩ mới</h2>
              <button className="adm-modal__close" onClick={closeModal}>✕</button>
            </div>
            <div className="adm-modal__body">
              <div className="adm-field">
                <label>Họ và tên <span>*</span></label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="VD: Nguyễn Văn A"
                />
              </div>
              <div className="adm-field">
                <label>Gmail <span>*</span></label>
                <input
                  name="gmail"
                  value={form.gmail}
                  onChange={handleChange}
                  placeholder="VD: nguyenvana@gmail.com"
                />
              </div>
              <div className="adm-field">
                <label>Chuyên khoa <span>*</span></label>
                <input
                  name="specialized"
                  value={form.specialized}
                  onChange={handleChange}
                  placeholder="VD: NHA KHOA RĂNG HÀM MẶT"
                />
              </div>
            </div>
            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={closeModal}>
                Hủy
              </button>
              <button
                className="adm-btn adm-btn--primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Đang lưu..." : "Thêm bác sĩ"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal Xem chi tiết ─────────────────────────────── */}
      {modalMode === "view" && selected && (
        <div className="adm-overlay" onClick={closeModal}>
          <div className="adm-modal adm-modal--view" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal__header">
              <h2>Chi tiết bác sĩ</h2>
              <button className="adm-modal__close" onClick={closeModal}>✕</button>
            </div>
            <div className="adm-modal__body">
              <div className="adm-view">
                <div className="adm-view__left">
                  <img
                    className="adm-view__avatar"
                    src={
                      selected.img ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(selected.name)}&background=d6e8f5&color=1a3a5c&size=200`
                    }
                    alt={selected.name}
                  />
                  <h3 className="adm-view__name">{selected.name}</h3>
                  <p className="adm-view__school">{selected.specialized}</p>
                  <p className="adm-view__lever">{selected.lever}</p>
                  <p className="adm-view__gmail">
                    <svg viewBox="0 0 16 16" fill="none">
                      <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                    {selected.email}
                  </p>
                  {selected.phone && (
                    <p className="adm-view__phone">📞 {selected.phone}</p>
                  )}
                  {selected.address && (
                    <p className="adm-view__address">📍 {selected.address}</p>
                  )}
                </div>
                <div className="adm-view__right">
                  {selected.information && (
                    <div className="adm-view__desc">
                      <span className="adm-view__desc-num">1</span>
                      <p>{selected.information}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={closeModal}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal Xác nhận xoá ─────────────────────────────── */}
      {deleteTarget && (
        <div className="adm-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="adm-modal adm-modal--confirm" onClick={(e) => e.stopPropagation()}>
            <div className="adm-confirm__icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="adm-confirm__title">Xác nhận xóa</h3>
            <p className="adm-confirm__desc">
              Bạn có chắc muốn xóa bác sĩ <strong>{deleteTarget.name}</strong>?{" "}
              Hành động này không thể hoàn tác.
            </p>
            <div className="adm-confirm__actions">
              <button
                className="adm-btn adm-btn--ghost"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Hủy
              </button>
              <button
                className="adm-btn adm-btn--danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctor;