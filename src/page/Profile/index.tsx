import React, { useState, useRef } from "react";

interface Profile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

const initialProfile: Profile = {
  name: "Nguyễn Thị Lan",
  email: "lan.nguyen@gmail.com",
  phone: "0912 345 678",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
};

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Pick<Profile, "name" | "phone" | "avatar">>({
    name: profile.name,
    phone: profile.phone,
    avatar: profile.avatar,
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [previewUrl, setPreviewUrl] = useState<string>(profile.avatar);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setForm({ name: profile.name, phone: profile.phone, avatar: profile.avatar });
    setPreviewUrl(profile.avatar);
    setErrors({});
    setEditing(true);
    setSaved(false);
  };

  const cancelEdit = () => {
    setEditing(false);
    setErrors({});
  };

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập họ và tên";
    if (!form.phone.trim()) e.phone = "Vui lòng nhập số điện thoại";
    else if (!/^[0-9\s+\-().]{9,15}$/.test(form.phone.trim())) e.phone = "Số điện thoại không hợp lệ";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setProfile({ ...profile, name: form.name, phone: form.phone, avatar: previewUrl });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setForm(prev => ({ ...prev, avatar: url }));
  };

  const initials = profile.name
    .split(" ")
    .slice(-2)
    .map(w => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="upr">
      <div className="upr-card">

        <div className="upr-banner" />

        <div className="upr-avatar-wrap">
          <div className="upr-avatar">
            {editing ? (
              <img
                src={previewUrl}
                alt="avatar"
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            ) : profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} />
            ) : (
              <span className="upr-avatar__initials">{initials}</span>
            )}

            {editing && (
              <button
                className="upr-avatar__edit-btn"
                onClick={() => fileRef.current?.click()}
                title="Đổi ảnh"
              >
                <svg viewBox="0 0 14 14" fill="none">
                  <path d="M9 2l3 3-7 7H2v-3L9 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        {saved && (
          <div className="upr-toast">
            <svg viewBox="0 0 14 14" fill="none">
              <path d="M2 7l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Lưu thay đổi thành công
          </div>
        )}

        <div className="upr-info">
          {!editing ? (

            <>
              <h2 className="upr-info__name">{profile.name}</h2>
              <p className="upr-info__email">{profile.email}</p>

              <div className="upr-fields">
                <div className="upr-field-row">
                  <span className="upr-field-row__label">
                    <svg viewBox="0 0 14 14" fill="none"><path d="M7 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM2 13a5 5 0 0110 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                    Họ và tên
                  </span>
                  <span className="upr-field-row__value">{profile.name}</span>
                </div>

                <div className="upr-field-row">
                  <span className="upr-field-row__label">
                    <svg viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 5l6 4 6-4" stroke="currentColor" strokeWidth="1.2"/></svg>
                    Email
                  </span>
                  <span className="upr-field-row__value upr-field-row__value--muted">{profile.email}</span>
                </div>

                <div className="upr-field-row">
                  <span className="upr-field-row__label">
                    <svg viewBox="0 0 14 14" fill="none"><path d="M10.5 9.5l-1.5 1.5C7 11 3 7 3 5l1.5-1.5 1.5 2-1 1c.5 1.5 2.5 3.5 4 4l1-1 1.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                    Số điện thoại
                  </span>
                  <span className="upr-field-row__value">{profile.phone}</span>
                </div>
              </div>

              <button className="upr-btn upr-btn--primary" onClick={startEdit}>
                <svg viewBox="0 0 14 14" fill="none"><path d="M9 2l3 3-7 7H2v-3L9 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
                Chỉnh sửa thông tin
              </button>
            </>

          ) : (

            <>
              <h2 className="upr-info__name">{form.name || "—"}</h2>
              <p className="upr-info__email upr-info__email--lock">
                <svg viewBox="0 0 12 12" fill="none"><rect x="2" y="5" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.1"/><path d="M4 5V3.5a2 2 0 014 0V5" stroke="currentColor" strokeWidth="1.1"/></svg>
                {profile.email}
              </p>

              <div className="upr-edit-fields">
                <div className={`upr-efield ${errors.name ? "upr-efield--error" : ""}`}>
                  <label>Họ và tên <span>*</span></label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên..."
                  />
                  {errors.name && <p className="upr-efield__error">{errors.name}</p>}
                </div>

                <div className="upr-efield upr-efield--disabled">
                  <label>
                    Email
                    <span className="upr-efield__lock">
                      <svg viewBox="0 0 10 10" fill="none"><rect x="2" y="4.5" width="6" height="5" rx="1" stroke="currentColor" strokeWidth="1"/><path d="M3.5 4.5V3a1.5 1.5 0 013 0v1.5" stroke="currentColor" strokeWidth="1"/></svg>
                      Không thể sửa
                    </span>
                  </label>
                  <input value={profile.email} disabled />
                </div>

                <div className={`upr-efield ${errors.phone ? "upr-efield--error" : ""}`}>
                  <label>Số điện thoại <span>*</span></label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại..."
                  />
                  {errors.phone && <p className="upr-efield__error">{errors.phone}</p>}
                </div>

                <div className="upr-efield">
                  <label>Ảnh đại diện</label>
                  <div className="upr-avatar-input">
                    <input
                      name="avatarUrl"
                      value={previewUrl.startsWith("blob:") ? "" : previewUrl}
                      onChange={e => {
                        setPreviewUrl(e.target.value);
                        setForm(prev => ({ ...prev, avatar: e.target.value }));
                      }}
                      placeholder="Dán link ảnh hoặc tải lên bên trên..."
                    />
                    <button
                      type="button"
                      className="upr-avatar-input__upload"
                      onClick={() => fileRef.current?.click()}
                    >
                      Tải lên
                    </button>
                  </div>
                </div>
              </div>

              <div className="upr-edit-actions">
                <button className="upr-btn upr-btn--ghost" onClick={cancelEdit}>Hủy</button>
                <button className="upr-btn upr-btn--primary" onClick={handleSave}>Lưu thay đổi</button>
              </div>
            </>

          )}
        </div>

      </div>
    </div>
  );
};

export default UserProfile;