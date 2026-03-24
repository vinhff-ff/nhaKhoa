import React, { useState, useEffect, useRef } from "react";
import { message } from "antd";
import { createPost, updatePost, deletePost, getPost } from "../../../api/admin";

export interface Banner {
  id: number;
  title: string;
  content: string;
  status: "DRAFT" | "PUBLISHED";
  category: number;
  img: string | null;
}

interface BannerForm {
  title: string;
  content: string;
  status: "DRAFT" | "PUBLISHED";
  imgFile: File | null;
  previewUrl: string;
}

const emptyForm: BannerForm = {
  title: "",
  content: "",
  status: "DRAFT",
  imgFile: null,
  previewUrl: "",
};

type ModalMode = "add" | "edit" | "view" | null;

const AdminBanner: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Banner | null>(null);
  const [form, setForm] = useState<BannerForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof BannerForm, string>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Fetch ────────────────────────────────────────────────
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await getPost();
      setBanners(res.data);
    } catch {
      message.error("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // ─── Validate ─────────────────────────────────────────────
  const validate = () => {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = "Vui lòng nhập tiêu đề";
    if (!form.content.trim()) e.content = "Vui lòng nhập mô tả";
    if (modalMode === "add" && !form.imgFile) e.imgFile = "Vui lòng chọn ảnh";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ─── Modal helpers ────────────────────────────────────────
  const openAdd = () => {
    setForm(emptyForm);
    setErrors({});
    setModalMode("add");
  };

  const openEdit = (b: Banner) => {
    setForm({
      title: b.title,
      content: b.content,
      status: b.status,
      imgFile: null,
      previewUrl: b.img || "",
    });
    setSelected(b);
    setErrors({});
    setModalMode("edit");
  };

  const openView = (b: Banner) => {
    setSelected(b);
    setModalMode("view");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelected(null);
    setForm(emptyForm);
    setErrors({});
  };

  // ─── Handle file chọn ảnh ─────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    setForm({
      ...form,
      imgFile: file,
      previewUrl: URL.createObjectURL(file),
    });
    if (errors.imgFile) setErrors({ ...errors, imgFile: undefined });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name as keyof typeof errors])
      setErrors({ ...errors, [name]: undefined });
  };

  // ─── Thêm banner ──────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      const payload = {
        title: form.title,
        content: form.content,
        status: form.status,
        category: 1, // cố định category = 1
      };

      let res;
      if (modalMode === "add") {
        res = await createPost(payload, form.imgFile);
      } else if (modalMode === "edit" && selected) {
        res = await updatePost(selected.id, payload, form.imgFile || null);
      }

      message.success(modalMode === "add" ? "Thêm banner thành công" : "Cập nhật banner thành công");
      closeModal();
      fetchBanners();
    } catch {
      closeModal();
      fetchBanners();
    } finally {
      setSaving(false);
    }
  };

  // ─── Xoá banner ───────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await deletePost(deleteTarget.id);
      message.success("Xóa banner thành công");
      setDeleteTarget(null);
      fetchBanners();
    } catch {
      message.error("Lỗi kết nối server");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="adb">

      {/* ── Header ── */}
      <div className="adb-header">
        <div className="adb-header__left">
          <h1 className="adb-header__title">Quản lý banner</h1>
          <span className="adb-header__count">{banners.length} banner</span>
          <span className="adb-header__active">
            {banners.filter((b) => b.status === "PUBLISHED").length} đang hiển thị
          </span>
        </div>
        <button className="adb-btn adb-btn--primary" onClick={openAdd}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Thêm banner
        </button>
      </div>

      {/* ── Banner grid ── */}
      <div className="adb-grid">
        {loading ? (
          <div className="adb-table__loading">Đang tải dữ liệu...</div>
        ) : banners.length === 0 ? (
          <div className="adb-empty">Chưa có banner nào</div>
        ) : (
          banners.map((b) => (
            <div key={b.id} className={`adb-card ${b.status === "DRAFT" ? "adb-card--inactive" : ""}`}>
              <div className="adb-card__img-wrap">
                <img
                  className="adb-card__img"
                  src={b.img || `https://via.placeholder.com/800x300?text=${encodeURIComponent(b.title)}`}
                  alt={b.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://via.placeholder.com/800x300?text=${encodeURIComponent(b.title)}`;
                  }}
                />
                <div className="adb-card__badges">
                  <span className={`adb-card__status ${b.status === "PUBLISHED" ? "adb-card__status--on" : "adb-card__status--off"}`}>
                    {b.status === "PUBLISHED" ? "Hiển thị" : "Nháp"}
                  </span>
                </div>
              </div>

              <div className="adb-card__body">
                <div className="adb-card__text">
                  <h3 className="adb-card__title">{b.title}</h3>
                  <p className="adb-card__desc">{b.content}</p>
                </div>
                <div className="adb-card__footer">
                  <div className="adb-card__actions">
                    <button className="adb-actions__btn adb-actions__btn--view" title="Xem" onClick={() => openView(b)}>
                      <svg viewBox="0 0 16 16" fill="none">
                        <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4" />
                        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                    </button>
                    <button className="adb-actions__btn adb-actions__btn--edit" title="Sửa" onClick={() => openEdit(b)}>
                      <svg viewBox="0 0 16 16" fill="none">
                        <path d="M11 2l3 3-8 8H3v-3l8-8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button className="adb-actions__btn adb-actions__btn--delete" title="Xóa" onClick={() => setDeleteTarget(b)}>
                      <svg viewBox="0 0 16 16" fill="none">
                        <path d="M3 4h10M6 4V2h4v2M5 4v9h6V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ══ ADD / EDIT MODAL ══ */}
      {(modalMode === "add" || modalMode === "edit") && (
        <div className="adb-overlay" onClick={closeModal}>
          <div className="adb-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adb-modal__header">
              <h2>{modalMode === "add" ? "Thêm banner mới" : "Chỉnh sửa banner"}</h2>
              <button className="adb-modal__close" onClick={closeModal}>✕</button>
            </div>

            <div className="adb-modal__body">

              {/* ── Preview ảnh ── */}
              <div
                className="adb-form__preview-wrap"
                onClick={() => fileInputRef.current?.click()}
                style={{ cursor: "pointer" }}
              >
                {form.previewUrl ? (
                  <img className="adb-form__preview" src={form.previewUrl} alt="preview" />
                ) : (
                  <div className="adb-form__preview-empty">
                    <svg viewBox="0 0 40 40" fill="none">
                      <rect x="2" y="8" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="13" cy="17" r="3" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M2 28l9-8 7 7 5-4 10 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                    <span>Click để chọn ảnh</span>
                  </div>
                )}
              </div>

              {/* Input file ẩn */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              {errors.imgFile && <p className="adb-field__error">{errors.imgFile}</p>}
              {form.imgFile && (
                <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                  📎 {form.imgFile.name}
                </p>
              )}

              <div className="adb-form__fields">
                {/* Title */}
                <div className={`adb-field ${errors.title ? "adb-field--error" : ""}`}>
                  <label>Tiêu đề <span>*</span></label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Nhập tiêu đề banner..."
                  />
                  {errors.title && <p className="adb-field__error">{errors.title}</p>}
                </div>

                {/* Content */}
                <div className={`adb-field ${errors.content ? "adb-field--error" : ""}`}>
                  <label>Mô tả <span>*</span></label>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Nhập nội dung mô tả..."
                  />
                  {errors.content && <p className="adb-field__error">{errors.content}</p>}
                </div>

                {/* Status */}
                <div className="adb-field">
                  <label>Trạng thái</label>
                  <select name="status" value={form.status} onChange={handleChange}>
                    <option value="DRAFT">Nháp</option>
                    <option value="PUBLISHED">Hiển thị</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="adb-modal__footer">
              <button className="adb-btn adb-btn--ghost" onClick={closeModal} disabled={saving}>Hủy</button>
              <button className="adb-btn adb-btn--primary" onClick={handleSave} disabled={saving}>
                {saving ? "Đang lưu..." : modalMode === "add" ? "Thêm banner" : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ VIEW MODAL ══ */}
      {modalMode === "view" && selected && (
        <div className="adb-overlay" onClick={closeModal}>
          <div className="adb-modal adb-modal--view" onClick={(e) => e.stopPropagation()}>
            <div className="adb-modal__header">
              <h2>Chi tiết banner</h2>
              <button className="adb-modal__close" onClick={closeModal}>✕</button>
            </div>
            <div className="adb-modal__body">
              <img
                className="adb-view__img"
                src={selected.img || `https://via.placeholder.com/800x300?text=${encodeURIComponent(selected.title)}`}
                alt={selected.title}
              />
              <div className="adb-view__meta">
                <span className={`adb-view__badge ${selected.status === "PUBLISHED" ? "adb-view__badge--on" : "adb-view__badge--off"}`}>
                  {selected.status === "PUBLISHED" ? "Đang hiển thị" : "Nháp"}
                </span>
              </div>
              <h3 className="adb-view__title">{selected.title}</h3>
              <p className="adb-view__desc">{selected.content}</p>
            </div>
            <div className="adb-modal__footer">
              <button className="adb-btn adb-btn--ghost" onClick={closeModal}>Đóng</button>
              <button className="adb-btn adb-btn--primary" onClick={() => openEdit(selected)}>Chỉnh sửa</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ DELETE CONFIRM ══ */}
      {deleteTarget && (
        <div className="adb-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="adb-modal adb-modal--confirm" onClick={(e) => e.stopPropagation()}>
            <div className="adb-confirm__icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="adb-confirm__title">Xác nhận xóa</h3>
            <p className="adb-confirm__desc">
              Bạn có chắc muốn xóa banner <strong>"{deleteTarget.title}"</strong>?<br />
              Hành động này không thể hoàn tác.
            </p>
            <div className="adb-confirm__actions">
              <button className="adb-btn adb-btn--ghost" onClick={() => setDeleteTarget(null)} disabled={deleting}>Hủy</button>
              <button className="adb-btn adb-btn--danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBanner;