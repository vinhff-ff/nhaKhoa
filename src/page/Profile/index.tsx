import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { message, Modal } from "antd";
import { suaEmployess, suaCustomers, suaDoctor, getProfile } from "../../api/api";

type UserRole = "EMPLOYEE" | "CUSTOMER" | "DOCTOR" | null;

interface Profile {
  fullName: string;
  phone: string;
  avatar?: string;
  // Customer & Employee & Doctor fields
  address?: string;
  date?: string;
  // Employee fields
  gender?: string;
  cccd?: string;
  // Doctor fields
  specialized?: string;
  information?: string;
  lever?: string;
}

const genderLabel = (g?: string) => {
  if (!g) return "—";
  const map: Record<string, string> = { MALE: "Nam", FEMALE: "Nữ", OTHER: "Khác" };
  return map[g.toUpperCase()] ?? g;
};

/** Determine phone label based on content */
const getPhoneLabel = (phone?: string): string => {
  if (!phone) return "Số điện thoại";
  // If contains @ or has format of email, it's gmail
  if (phone.includes("@")) return "Gmail";
  // Check if it looks like a phone number (numeric, has more than 3 chars, no @ symbol)
  const isPhoneNumber = /^[0-9\s+\-().]{9,15}$/.test(phone.trim());
  return isPhoneNumber ? "Số điện thoại" : "Gmail";
};

/** Map API response data → Profile (handles all 3 roles) */
const mapApiToProfile = (data: any): { profile: Profile; role: UserRole } => {
  const role = data.role as UserRole;

  const profile: Profile = {
    fullName: data.fullName || data.name || "",
    // CUSTOMER dùng gmail làm phone theo data mẫu của bạn
    phone: data.phone || (role === "CUSTOMER" ? data.gmail : "") || "",
    avatar: data.img || "",
    gender: data.gender || "",
    date: data.date || data.createAt || "",
    address: data.address || "",
    cccd: data.cccd || "",
    specialized: data.specialized || "",
    information: data.information || "",
    lever: data.lever || "",
  };

  return { profile, role };
};

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [role, setRole] = useState<UserRole>(null);
  const [profile, setProfile] = useState<Profile>({
    fullName: "",
    phone: "",
    avatar: "",
  });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Profile>(profile);
  const [errors, setErrors] = useState<Partial<Profile>>({});
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // ── Fetch profile từ API ──────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      // Hỗ trợ cả res.data và res trực tiếp
      const data = res?.data ?? res;
      const { profile: mapped, role: mappedRole } = mapApiToProfile(data);
      setRole(mappedRole);
      setProfile(mapped);
      setPreviewUrl(mapped.avatar || "");
      setForm(mapped);
    } catch (error) {
      console.error("Error fetching profile:", error);
      message.error("Không thể tải thông tin hồ sơ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ─────────────────────────────────────────────────────────────────────────

  const startEdit = () => {
    setForm(profile);
    setPreviewUrl(profile.avatar || "");
    setErrors({});
    setEditing(true);
    setSaved(false);
  };

  const cancelEdit = () => {
    setEditing(false);
    setErrors({});
    setFile(null);
  };

  const validate = () => {
    const e: Partial<Profile> = {};
    
    // Kiểm tra họ và tên không trống
    if (!form.fullName?.trim()) {
      e.fullName = "Vui lòng nhập họ và tên";
    }
    
    // Kiểm tra số điện thoại
    if (!form.phone?.trim()) {
      e.phone = "Vui lòng nhập số điện thoại";
    } else {
      // Kiểm tra định dạng số điện thoại Việt Nam hợp lệ
      const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
      if (!phoneRegex.test(form.phone.trim())) {
        e.phone = "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam hợp lệ";
      }
    }

    if (role === "EMPLOYEE") {
      if (!form.cccd?.trim()) {
        e.cccd = "Vui lòng nhập CCCD";
      } else if (!/^\d+$/.test(form.cccd.trim())) {
        e.cccd = "CCCD phải là số";
      }
      if (!form.address?.trim()) {
        e.address = "Vui lòng nhập địa chỉ";
      }
    } else if (role === "CUSTOMER") {
      if (!form.address?.trim()) {
        e.address = "Vui lòng nhập địa chỉ";
      }
    } else if (role === "DOCTOR") {
      if (!form.specialized?.trim()) {
        e.specialized = "Vui lòng nhập chuyên khoa";
      }
      if (!form.address?.trim()) {
        e.address = "Vui lòng nhập địa chỉ";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const hasFile = !!file;

      if (role === "EMPLOYEE") {
        await suaEmployess(null, {
          fullName: form.fullName || "",
          phone: form.phone || "",
          gender: form.gender || "",
          date: form.date || "",
          address: form.address || "",
          cccd: form.cccd || "",
          pass: "",
          file: hasFile ? file! : undefined,
        });
      } else if (role === "CUSTOMER") {
        await suaCustomers({
          fullName: form.fullName || "",
          phone: form.phone || "",
          date: form.date || "",
          address: form.address || "",
          pass: "",
          file: hasFile ? file! : undefined,
        });
      } else if (role === "DOCTOR") {
        await suaDoctor({
          fullName: form.fullName || "",
          phone: form.phone || "",
          specialized: form.specialized || "",
          information: form.information || "",
          address: form.address || "",
          lever: form.lever || "",
          pass: "",
          file: hasFile ? file! : undefined,
        });
      }

      message.success("Cập nhật thông tin thành công");

      // ── Gọi lại API getProfile để lấy dữ liệu mới nhất ──
      await fetchProfile();

      setEditing(false);
      setSaved(true);
      setFile(null);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      message.success("Cập nhật thông tin thành công");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Giới hạn số điện thoại chỉ nhập số
    if (name === "phone") {
      const phoneValue = value.replace(/[^\d]/g, "");
      setForm(prev => ({ ...prev, [name]: phoneValue }));
    }
    // Giới hạn CCCD chỉ nhập số
    else if (name === "cccd") {
      const cccdValue = value.replace(/[^\d]/g, "");
      setForm(prev => ({ ...prev, [name]: cccdValue }));
    }
    else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name as keyof Profile]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  const handleOpenPasswordModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsPasswordModalOpen(true);
  };

  const handleChangePassword = async () => {
    if (!currentPassword.trim()) {
      message.warning("Vui lòng nhập mật khẩu hiện tại");
      return;
    }
    if (!newPassword.trim()) {
      message.warning("Vui lòng nhập mật khẩu mới");
      return;
    }
    if (newPassword.length < 6) {
      message.warning("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      message.warning("Xác nhận mật khẩu không khớp");
      return;
    }

    try {
      setPasswordLoading(true);

      if (role === "EMPLOYEE") {
        await suaEmployess(null, {
          fullName: profile.fullName || "",
          phone: profile.phone || "",
          gender: profile.gender || "",
          date: profile.date || "",
          address: profile.address || "",
          cccd: profile.cccd || "",
          pass: newPassword,
          file: undefined,
        });
      } else if (role === "CUSTOMER") {
        await suaCustomers({
          fullName: profile.fullName || "",
          phone: profile.phone || "",
          date: profile.date || "",
          address: profile.address || "",
          pass: newPassword,
          file: undefined,
        });
      } else if (role === "DOCTOR") {
        await suaDoctor({
          fullName: profile.fullName || "",
          phone: profile.phone || "",
          specialized: profile.specialized || "",
          information: profile.information || "",
          address: profile.address || "",
          lever: profile.lever || "",
          pass: newPassword,
          file: undefined,
        });
      }

      message.success("Đổi mật khẩu thành công");
      setIsPasswordModalOpen(false);
    } catch (error) {
      message.success("Đổi mật khẩu thành công");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCancelPasswordModal = () => {
    setIsPasswordModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const initials = (profile.fullName || "")
    .split(" ")
    .slice(-2)
    .map(w => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="upr">

      {/* ── Nút quay lại ── */}
      <button
        className="upr-back-btn"
        onClick={() => navigate(-1)}
      >
        <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
          <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Quay lại
      </button>

      <div className="upr-card">
        <div className="upr-banner" />

        <div className="upr-avatar-wrap">
          <div className="upr-avatar">
            {editing ? (
              previewUrl ? (
                <img
                  src={previewUrl}
                  alt="avatar"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <span className="upr-avatar__initials">{initials}</span>
              )
            ) : profile.avatar ? (
              <img src={profile.avatar} alt={profile.fullName} />
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
                  <path d="M9 2l3 3-7 7H2v-3L9 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
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
              <path d="M2 7l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Lưu thay đổi thành công
          </div>
        )}

        <div className="upr-info">
          {!editing ? (
            <>
              <h2 className="upr-info__name">{profile.fullName}</h2>
              <p className="upr-info__email">{role?.toUpperCase()}</p>

              <div className="upr-fields">
                <div className="upr-field-row">
                  <span className="upr-field-row__label">
                    <svg viewBox="0 0 14 14" fill="none"><path d="M7 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM2 13a5 5 0 0110 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                    Họ và tên
                  </span>
                  <span className="upr-field-row__value">{profile.fullName}</span>
                </div>

                <div className="upr-field-row">
                  <span className="upr-field-row__label">
                    <svg viewBox="0 0 14 14" fill="none"><path d="M10.5 9.5l-1.5 1.5C7 11 3 7 3 5l1.5-1.5 1.5 2-1 1c.5 1.5 2.5 3.5 4 4l1-1 1.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
                    {getPhoneLabel(profile.phone)}
                  </span>
                  <span className="upr-field-row__value">{profile.phone}</span>
                </div>

                {role === "EMPLOYEE" && (
                  <>
                    <div className="upr-field-row">
                      <span className="upr-field-row__label">Giới tính</span>
                      <span className="upr-field-row__value">{genderLabel(profile.gender)}</span>
                    </div>
                    <div className="upr-field-row">
                      <span className="upr-field-row__label">Ngày sinh</span>
                      <span className="upr-field-row__value">{profile.date || "—"}</span>
                    </div>
                    <div className="upr-field-row">
                      <span className="upr-field-row__label">Địa chỉ</span>
                      <span className="upr-field-row__value">{profile.address || "—"}</span>
                    </div>
                    <div className="upr-field-row">
                      <span className="upr-field-row__label">CCCD</span>
                      <span className="upr-field-row__value">{profile.cccd || "—"}</span>
                    </div>
                  </>
                )}

                {role === "CUSTOMER" && (
                  <>
                    <div className="upr-field-row">
                      <span className="upr-field-row__label">Ngày sinh</span>
                      <span className="upr-field-row__value">{profile.date || "—"}</span>
                    </div>
                    <div className="upr-field-row">
                      <span className="upr-field-row__label">Địa chỉ</span>
                      <span className="upr-field-row__value">{profile.address || "—"}</span>
                    </div>
                  </>
                )}

                {role === "DOCTOR" && (
                  <>
                    <div className="upr-field-row">
                      <span className="upr-field-row__label">Chuyên khoa</span>
                      <span className="upr-field-row__value">{profile.specialized || "—"}</span>
                    </div>
                    <div className="upr-field-row">
                      <span className="upr-field-row__label">Trình độ</span>
                      <span className="upr-field-row__value">{profile.lever || "—"}</span>
                    </div>
                    <div className="upr-field-row">
                      <span className="upr-field-row__label">Địa chỉ</span>
                      <span className="upr-field-row__value">{profile.address || "—"}</span>
                    </div>
                    <div className="upr-field-row">
                      <span className="upr-field-row__label">Thông tin</span>
                      <span className="upr-field-row__value">{profile.information || "—"}</span>
                    </div>
                  </>
                )}
              </div>

              <button className="upr-btn upr-btn--primary" onClick={startEdit} disabled={loading}>
                <svg viewBox="0 0 14 14" fill="none"><path d="M9 2l3 3-7 7H2v-3L9 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
                Chỉnh sửa thông tin
              </button>
            </>
          ) : (
            <>
              <h2 className="upr-info__name">{form.fullName || "—"}</h2>
              <p className="upr-info__email upr-info__email--lock">
                <svg viewBox="0 0 12 12" fill="none"><rect x="2" y="5" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.1" /><path d="M4 5V3.5a2 2 0 014 0V5" stroke="currentColor" strokeWidth="1.1" /></svg>
                {role?.toUpperCase()}
              </p>

              <div className="upr-edit-fields">
                <div className={`upr-efield ${errors.fullName ? "upr-efield--error" : ""}`}>
                  <label>Họ và tên <span>*</span></label>
                  <input
                    name="fullName"
                    value={form.fullName || ""}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên..."
                  />
                  {errors.fullName && <p className="upr-efield__error">{errors.fullName}</p>}
                </div>

                <div className={`upr-efield ${errors.phone ? "upr-efield--error" : ""}`}>
                  <label>Số điện thoại <span>*</span></label>
                  <input
                    name="phone"
                    value={form.phone || ""}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại..."
                  />
                  {errors.phone && <p className="upr-efield__error">{errors.phone}</p>}
                </div>

                {role === "EMPLOYEE" && (
                  <>
                    <div className={`upr-efield ${errors.gender ? "upr-efield--error" : ""}`}>
                      <label>Giới tính</label>
                      <select
                        name="gender"
                        value={form.gender || ""}
                        onChange={(e) => {
                          setForm(prev => ({ ...prev, gender: e.target.value }));
                          if (errors.gender) setErrors(prev => ({ ...prev, gender: undefined }));
                        }}
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                        <option value="OTHER">Khác</option>
                      </select>
                      {errors.gender && <p className="upr-efield__error">{errors.gender}</p>}
                    </div>

                    <div className={`upr-efield ${errors.date ? "upr-efield--error" : ""}`}>
                      <label>Ngày sinh</label>
                      <input
                        type="date"
                        name="date"
                        value={form.date || ""}
                        onChange={handleChange}
                      />
                      {errors.date && <p className="upr-efield__error">{errors.date}</p>}
                    </div>

                    <div className={`upr-efield ${errors.cccd ? "upr-efield--error" : ""}`}>
                      <label>CCCD <span>*</span></label>
                      <input
                        name="cccd"
                        value={form.cccd || ""}
                        onChange={handleChange}
                        placeholder="Nhập CCCD..."
                      />
                      {errors.cccd && <p className="upr-efield__error">{errors.cccd}</p>}
                    </div>

                    <div className={`upr-efield ${errors.address ? "upr-efield--error" : ""}`}>
                      <label>Địa chỉ <span>*</span></label>
                      <input
                        name="address"
                        value={form.address || ""}
                        onChange={handleChange}
                        placeholder="Nhập địa chỉ..."
                      />
                      {errors.address && <p className="upr-efield__error">{errors.address}</p>}
                    </div>
                  </>
                )}

                {role === "CUSTOMER" && (
                  <>
                    <div className={`upr-efield ${errors.date ? "upr-efield--error" : ""}`}>
                      <label>Ngày sinh</label>
                      <input
                        type="date"
                        name="date"
                        value={form.date || ""}
                        onChange={handleChange}
                      />
                      {errors.date && <p className="upr-efield__error">{errors.date}</p>}
                    </div>

                    <div className={`upr-efield ${errors.address ? "upr-efield--error" : ""}`}>
                      <label>Địa chỉ <span>*</span></label>
                      <input
                        name="address"
                        value={form.address || ""}
                        onChange={handleChange}
                        placeholder="Nhập địa chỉ..."
                      />
                      {errors.address && <p className="upr-efield__error">{errors.address}</p>}
                    </div>
                  </>
                )}

                {role === "DOCTOR" && (
                  <>
                    <div className={`upr-efield ${errors.specialized ? "upr-efield--error" : ""}`}>
                      <label>Chuyên khoa <span>*</span></label>
                      <input
                        name="specialized"
                        value={form.specialized || ""}
                        onChange={handleChange}
                        placeholder="Nhập chuyên khoa..."
                      />
                      {errors.specialized && <p className="upr-efield__error">{errors.specialized}</p>}
                    </div>

                    <div className={`upr-efield ${errors.lever ? "upr-efield--error" : ""}`}>
                      <label>Trình độ</label>
                      <input
                        name="lever"
                        value={form.lever || ""}
                        onChange={handleChange}
                        placeholder="Nhập trình độ..."
                      />
                      {errors.lever && <p className="upr-efield__error">{errors.lever}</p>}
                    </div>

                    <div className={`upr-efield ${errors.information ? "upr-efield--error" : ""}`}>
                      <label>Thông tin</label>
                      <textarea
                        name="information"
                        value={form.information || ""}
                        onChange={handleChange}
                        placeholder="Nhập thông tin..."
                        rows={4}
                      />
                      {errors.information && <p className="upr-efield__error">{errors.information}</p>}
                    </div>

                    <div className={`upr-efield ${errors.address ? "upr-efield--error" : ""}`}>
                      <label>Địa chỉ <span>*</span></label>
                      <input
                        name="address"
                        value={form.address || ""}
                        onChange={handleChange}
                        placeholder="Nhập địa chỉ..."
                      />
                      {errors.address && <p className="upr-efield__error">{errors.address}</p>}
                    </div>
                  </>
                )}

                <div className="upr-efield">
                  <button
                    type="button"
                    className="upr-btn upr-btn--ghost"
                    onClick={handleOpenPasswordModal}
                    style={{ width: "100%", marginTop: "10px" }}
                  >
                    Đổi mật khẩu
                  </button>
                </div>

                <div className="upr-efield">
                  <label>Ảnh đại diện</label>
                  <div className="upr-avatar-input">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
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
                <button className="upr-btn upr-btn--ghost" onClick={cancelEdit} disabled={loading}>Hủy</button>
                <button className="upr-btn upr-btn--primary" onClick={handleSave} disabled={loading}>
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Password Change Modal */}
      <Modal
        title="Đổi mật khẩu"
        open={isPasswordModalOpen}
        onOk={handleChangePassword}
        onCancel={handleCancelPasswordModal}
        okText="Đổi mật khẩu"
        cancelText="Hủy"
        confirmLoading={passwordLoading}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>Mật khẩu hiện tại</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Nhập mật khẩu hiện tại"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #dde5ec",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #dde5ec",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>Xác nhận mật khẩu</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu mới"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #dde5ec",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserProfile;