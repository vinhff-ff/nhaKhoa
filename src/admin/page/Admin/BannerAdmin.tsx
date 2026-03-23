import React, { useState } from "react";

export interface Banner {
  id: number;
  title: string;
  description: string;
  image: string;
  active: boolean;
  order: number;
}

const initialBanners: Banner[] = [
  {
    id: 1,
    title: "Chăm sóc mắt toàn diện",
    description: "Phòng khám mắt Tân Tây Đô cung cấp dịch vụ khám và điều trị mắt chuyên nghiệp với đội ngũ bác sĩ giàu kinh nghiệm.",
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=900&q=80",
    active: true,
    order: 1,
  },
  {
    id: 2,
    title: "Thiết bị hiện đại hàng đầu",
    description: "Hệ thống máy móc và công nghệ nhãn khoa tiên tiến, hỗ trợ phát hiện sớm và điều trị chính xác các bệnh lý về mắt.",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=900&q=80",
    active: true,
    order: 2,
  },
  {
    id: 3,
    title: "Đội ngũ bác sĩ chuyên môn cao",
    description: "Bác sĩ và nhân viên y tế được đào tạo bài bản, tận tâm và chu đáo trong từng ca khám chữa bệnh.",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=900&q=80",
    active: false,
    order: 3,
  },
  {
    id: 4,
    title: "Khám mắt định kỳ cho trẻ em",
    description: "Phát hiện sớm các tật khúc xạ và bệnh lý mắt ở trẻ em, kiểm soát tiến triển cận thị học đường hiệu quả.",
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=900&q=80",
    active: true,
    order: 4,
  },
];

const emptyForm: Omit<Banner, "id"> = {
  title: "",
  description: "",
  image: "",
  active: true,
  order: 1,
};

type ModalMode = "add" | "edit" | "view" | null;

const AdminBanner: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Banner | null>(null);
  const [form, setForm] = useState<Omit<Banner, "id">>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Banner, "id">, string>>>({});

  // ── Helpers ───────────────────────────────────
  const validate = () => {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = "Vui lòng nhập tiêu đề";
    if (!form.description.trim()) e.description = "Vui lòng nhập mô tả";
    if (!form.image.trim()) e.image = "Vui lòng nhập link ảnh";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Open modals ───────────────────────────────
  const openAdd = () => {
    const maxOrder = Math.max(0, ...banners.map((b) => b.order)) + 1;
    setForm({ ...emptyForm, order: maxOrder });
    setErrors({});
    setModalMode("add");
  };

  const openEdit = (b: Banner) => {
    const { id, ...rest } = b;
    setForm(rest);
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

  // ── CRUD ─────────────────────────────────────
  const handleSave = () => {
    if (!validate()) return;
    if (modalMode === "add") {
      const newId = Math.max(0, ...banners.map((b) => b.id)) + 1;
      setBanners([...banners, { id: newId, ...form }]);
    } else if (modalMode === "edit" && selected) {
      setBanners(banners.map((b) => (b.id === selected.id ? { id: b.id, ...form } : b)));
    }
    closeModal();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setBanners(banners.filter((b) => b.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const toggleActive = (id: number) => {
    setBanners(banners.map((b) => (b.id === id ? { ...b, active: !b.active } : b)));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setForm({ ...form, [name]: val });
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const sortedBanners = [...banners].sort((a, b) => a.order - b.order);

  return (
    <div className="adb">

      {/* ── Header ── */}
      <div className="adb-header">
        <div className="adb-header__left">
          <h1 className="adb-header__title">Quản lý banner</h1>
          <span className="adb-header__count">{banners.length} banner</span>
          <span className="adb-header__active">
            {banners.filter((b) => b.active).length} đang hiển thị
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
        {sortedBanners.map((b) => (
          <div key={b.id} className={`adb-card ${!b.active ? "adb-card--inactive" : ""}`}>

            {/* Image */}
            <div className="adb-card__img-wrap">
              <img
                className="adb-card__img"
                src={b.image}
                alt={b.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://via.placeholder.com/800x300?text=${encodeURIComponent(b.title)}`;
                }}
              />
              {/* Overlay badges */}
              <div className="adb-card__badges">
                <span className="adb-card__order">#{b.order}</span>
                <span className={`adb-card__status ${b.active ? "adb-card__status--on" : "adb-card__status--off"}`}>
                  {b.active ? "Hiển thị" : "Ẩn"}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="adb-card__body">
              <div className="adb-card__text">
                <h3 className="adb-card__title">{b.title}</h3>
                <p className="adb-card__desc">{b.description}</p>
              </div>

              {/* Actions */}
              <div className="adb-card__footer">
                {/* Toggle switch */}
                <label className="adb-toggle" title={b.active ? "Ẩn banner" : "Hiển thị banner"}>
                  <input
                    type="checkbox"
                    checked={b.active}
                    onChange={() => toggleActive(b.id)}
                  />
                  <span className="adb-toggle__track">
                    <span className="adb-toggle__thumb" />
                  </span>
                  <span className="adb-toggle__label">{b.active ? "Bật" : "Tắt"}</span>
                </label>

                <div className="adb-card__actions">
                  <button
                    className="adb-actions__btn adb-actions__btn--view"
                    title="Xem"
                    onClick={() => openView(b)}
                  >
                    <svg viewBox="0 0 16 16" fill="none">
                      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4" />
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </button>
                  <button
                    className="adb-actions__btn adb-actions__btn--edit"
                    title="Sửa"
                    onClick={() => openEdit(b)}
                  >
                    <svg viewBox="0 0 16 16" fill="none">
                      <path d="M11 2l3 3-8 8H3v-3l8-8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    className="adb-actions__btn adb-actions__btn--delete"
                    title="Xóa"
                    onClick={() => setDeleteTarget(b)}
                  >
                    <svg viewBox="0 0 16 16" fill="none">
                      <path d="M3 4h10M6 4V2h4v2M5 4v9h6V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
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
              {/* Image preview */}
              <div className="adb-form__preview-wrap">
                {form.image ? (
                  <img
                    className="adb-form__preview"
                    src={form.image}
                    alt="preview"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="adb-form__preview-empty">
                    <svg viewBox="0 0 40 40" fill="none">
                      <rect x="2" y="8" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="13" cy="17" r="3" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M2 28l9-8 7 7 5-4 10 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                    <span>Nhập link ảnh để xem trước</span>
                  </div>
                )}
              </div>

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

                {/* Description */}
                <div className={`adb-field ${errors.description ? "adb-field--error" : ""}`}>
                  <label>Mô tả <span>*</span></label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Nhập nội dung mô tả..."
                  />
                  {errors.description && <p className="adb-field__error">{errors.description}</p>}
                </div>

                {/* Image URL */}
                <div className={`adb-field ${errors.image ? "adb-field--error" : ""}`}>
                  <label>Link ảnh <span>*</span></label>
                  <input
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                  {errors.image && <p className="adb-field__error">{errors.image}</p>}
                </div>

                <div className="adb-form__row">
                  {/* Order */}
                  <div className="adb-field">
                    <label>Thứ tự</label>
                    <input
                      name="order"
                      type="number"
                      min={1}
                      value={form.order}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Active toggle */}
                  <div className="adb-field adb-field--inline">
                    <label>Hiển thị</label>
                    <label className="adb-toggle">
                      <input
                        type="checkbox"
                        name="active"
                        checked={form.active}
                        onChange={handleChange}
                      />
                      <span className="adb-toggle__track">
                        <span className="adb-toggle__thumb" />
                      </span>
                      <span className="adb-toggle__label">
                        {form.active ? "Bật" : "Tắt"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="adb-modal__footer">
              <button className="adb-btn adb-btn--ghost" onClick={closeModal}>Hủy</button>
              <button className="adb-btn adb-btn--primary" onClick={handleSave}>
                {modalMode === "add" ? "Thêm banner" : "Lưu thay đổi"}
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
                src={selected.image}
                alt={selected.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://via.placeholder.com/800x300?text=${encodeURIComponent(selected.title)}`;
                }}
              />
              <div className="adb-view__meta">
                <span className="adb-view__order">Thứ tự #{selected.order}</span>
                <span className={`adb-view__badge ${selected.active ? "adb-view__badge--on" : "adb-view__badge--off"}`}>
                  {selected.active ? "Đang hiển thị" : "Đang ẩn"}
                </span>
              </div>
              <h3 className="adb-view__title">{selected.title}</h3>
              <p className="adb-view__desc">{selected.description}</p>
              <div className="adb-view__url">
                <span className="adb-view__url-label">Link ảnh</span>
                <span className="adb-view__url-val">{selected.image}</span>
              </div>
            </div>
            <div className="adb-modal__footer">
              <button className="adb-btn adb-btn--ghost" onClick={closeModal}>Đóng</button>
              <button className="adb-btn adb-btn--primary" onClick={() => openEdit(selected)}>
                Chỉnh sửa
              </button>
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
              <button className="adb-btn adb-btn--ghost" onClick={() => setDeleteTarget(null)}>Hủy</button>
              <button className="adb-btn adb-btn--danger" onClick={handleDelete}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBanner;