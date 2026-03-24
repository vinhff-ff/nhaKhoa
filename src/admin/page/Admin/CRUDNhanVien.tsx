import React, { useState, useEffect } from "react";
import { message } from "antd";
import { getNhanVien, createNhanVien, deleteNhanVien } from "../../../api/admin";

// Interface khớp 100% với dữ liệu JSON bạn cung cấp
export interface Employee {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  gender: string;
  date: string;
  address: string;
  cccd: string;
  img: string | null;
  roleName: string;
  createdAt: string;
}

type ModalMode = "add" | "view" | null;

interface AddForm {
  gmail: string; // Theo payload của hàm createNhanVien
  name: string;  // Theo payload của hàm createNhanVien
  gender: string;
}

const emptyForm: AddForm = { gmail: "", name: "", gender: "MALE" };

const AdminNhanVien: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [form, setForm] = useState<AddForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");

  // ─── Fetch danh sách nhân viên ────────────────────────────
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await getNhanVien();
      // API của bạn trả về { data: [...] }
      if (res && res.data) {
        setEmployees(res.data);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      message.error("Không thể tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ─── Filter an toàn (Sửa lỗi toLowerCase) ──────────────────
  const filtered = employees.filter((e) => {
    const searchTerm = search.toLowerCase();
    const name = e?.fullName?.toLowerCase() || "";
    const email = e?.email?.toLowerCase() || "";
    return name.includes(searchTerm) || email.includes(searchTerm);
  });

  // ─── Modal helpers ────────────────────────────────────────
  const openAdd = () => {
    setForm(emptyForm);
    setModalMode("add");
  };

  const openView = (e: Employee) => {
    setSelected(e);
    setModalMode("view");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelected(null);
    setForm(emptyForm);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ─── Thêm nhân viên ───────────────────────────────────────
  const handleSave = async () => {
    if (!form.gmail.trim() || !form.name.trim()) {
      message.warning("Vui lòng nhập đầy đủ Họ tên và Gmail");
      return;
    }
    try {
      setSaving(true);
      // Payload gửi đi khớp với định nghĩa hàm createNhanVien của bạn
      await createNhanVien({
        gmail: form.gmail,
        name: form.name,
        gender: form.gender
      });
      message.success("Thêm nhân viên thành công");
      closeModal();
      fetchEmployees();
    } catch (error) {
      message.error("Lỗi khi thêm nhân viên");
    } finally {
      setSaving(false);
    }
  };

  // ─── Xoá nhân viên ────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteNhanVien(deleteTarget.id);
      message.success("Xóa nhân viên thành công");
      setDeleteTarget(null);
      fetchEmployees();
    } catch (error) {
      message.error("Lỗi khi xóa nhân viên");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="adm">
      <div className="adm-header">
        <div className="adm-header__left">
          <h1 className="adm-header__title">Quản lý nhân viên</h1>
          <span className="adm-header__count">{employees.length} nhân viên</span>
        </div>
        <button className="adm-btn adm-btn--primary" onClick={openAdd}>
          Thêm nhân viên
        </button>
      </div>

      <div className="adm-toolbar">
        <div className="adm-search">
          <input
            className="adm-search__input"
            placeholder="Tìm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            
          />
        </div>
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
                <th>Giới tính</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th style={{ width: 120 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="adm-table__empty">Không tìm thấy nhân viên</td>
                </tr>
              ) : (
                filtered.map((emp, i) => (
                  <tr key={emp.id} className="adm-table__row">
                    <td>{i + 1}</td>
                    <td>
                      <img
                        className="adm-table__avatar"
                        src={emp.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.fullName)}&background=random`}
                        alt=""
                      />
                    </td>
                    <td><span className="adm-table__name">{emp.fullName}</span></td>
                    <td>{emp.gender === "FEMALE" ? "Nữ" : "Nam"}</td>
                    <td>{emp.email}</td>
                    <td>{emp.phone}</td>
                    <td>
                      <div className="adm-actions">
                        <button className="adm-actions__btn" onClick={() => openView(emp)}>👁️</button>
                        <button className="adm-actions__btn adm-actions__btn--delete" onClick={() => setDeleteTarget(emp)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Thêm nhân viên */}
      {modalMode === "add" && (
        <div className="adm-overlay" onClick={closeModal}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal__header">
              <h2>Thêm nhân viên mới</h2>
            </div>
            <div className="adm-modal__body">
              <div className="adm-field">
                <label>Họ và tên *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="VD: Trần Thị Thu Hà" />
              </div>
              <div className="adm-field">
                <label>Gmail *</label>
                <input name="gmail" value={form.gmail} onChange={handleChange} placeholder="VD: thuhatran98@gmail.com" />
              </div>
              <div className="adm-field">
                <label>Giới tính</label>
                <select name="gender" value={form.gender} onChange={handleChange as any}>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                </select>
              </div>
            </div>
            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={closeModal}>Hủy</button>
              <button className="adm-btn adm-btn--primary" onClick={handleSave} disabled={saving}>
                {saving ? "Đang lưu..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xem chi tiết */}
      {modalMode === "view" && selected && (
        <div className="adm-overlay" onClick={closeModal}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal__header">
              <h2>Chi tiết nhân viên</h2>
              <button className="adm-modal__close" onClick={closeModal}>✕</button>
            </div>
            <div className="adm-modal__body">
               <p><b>Họ tên:</b> {selected.fullName}</p>
               <p><b>Email:</b> {selected.email}</p>
               <p><b>Số điện thoại:</b> {selected.phone}</p>
               <p><b>Địa chỉ:</b> {selected.address}</p>
               <p><b>CCCD:</b> {selected.cccd}</p>
               <p><b>Ngày sinh:</b> {selected.date}</p>
               <p><b>Vai trò:</b> {selected.roleName}</p>
            </div>
            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={closeModal}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác nhận xóa */}
      {deleteTarget && (
        <div className="adm-overlay">
          <div className="adm-modal adm-modal--confirm">
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc muốn xóa <b>{deleteTarget.fullName}</b>?</p>
            <div className="adm-confirm__actions">
              <button className="adm-btn" onClick={() => setDeleteTarget(null)}>Hủy</button>
              <button className="adm-btn adm-btn--danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Đang xóa..." : "Đồng ý"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNhanVien;