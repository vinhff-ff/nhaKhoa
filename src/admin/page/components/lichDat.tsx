import React, { useState, useEffect } from "react";
import { message, Tag } from "antd";
import { getLich } from "../../../api/api"; 

// Interface dựa trên JSON bạn cung cấp
export interface Appointment {
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
  status: string;
}

const AdminLichHen: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [search, setSearch] = useState("");

  // ─── Lấy Role từ Local Storage ───────────────────────────
  const userProfile = JSON.parse(localStorage.getItem("user_profile") || "{}");
  const role = userProfile?.role ?? "ADMIN";

  const fetchLich = async () => {
    try {
      setLoading(true);
      const res = await getLich();
      // Giả định API trả về { data: [...] } hoặc mảng trực tiếp
      const data = res?.data || res;
      setAppointments(Array.isArray(data) ? data : []);
    } catch {
      message.error("Không thể tải danh sách lịch hẹn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLich();
  }, []);

  // ─── Filter ───────────────────────────────────────────────
  const filtered = appointments.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.doctorName.toLowerCase().includes(search.toLowerCase())
  );

  // ─── Helper hiển thị Status ──────────────────────────────
  const renderStatus = (status: string) => {
    switch (status) {
      case "CONFIRMED": return <Tag color="success">Đã xác nhận</Tag>;
      case "PENDING": return <Tag color="warning">Chờ duyệt</Tag>;
      case "CANCELLED": return <Tag color="error">Đã hủy</Tag>;
      default: return <Tag>{status}</Tag>;
    }
  };

  return (
    <div className="adm">
      <div className="adm-header">
        <div className="adm-header__left">
          <h1 className="adm-header__title">Quản lý lịch đặt</h1>
          <span className="adm-header__count">{appointments.length} lịch hẹn</span>
        </div>
      </div>

      <div className="adm-toolbar">
        <div className="adm-search">
          <input
            className="adm-search__input"
            placeholder="Tìm theo tên khách hoặc bác sĩ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="adm-toolbar__result">
           Quyền hạn: <b>{role}</b>
        </span>
      </div>

      <div className="adm-table-wrap">
        {loading ? (
          <div className="adm-table__loading">Đang tải...</div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th style={{ width: 48 }}>#</th>
                <th>Khách hàng</th>
                <th>SĐT / Email</th>
                <th>Bác sĩ phụ trách</th>
                <th>Ngày khám</th>
                <th>Trạng thái</th>
                <th style={{ width: 100 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={item.id} className="adm-table__row">
                  <td className="adm-table__idx">{i + 1}</td>
                  <td>
                    <div className="adm-table__name">{item.name}</div>
                    <div style={{fontSize: '11px', color: '#8fa3b3'}}>{item.address}</div>
                  </td>
                  <td>
                    <div>{item.phone}</div>
                    <div className="adm-table__gmail">{item.gmail}</div>
                  </td>
                  <td>
                    <span style={{fontWeight: 500, color: '#1a3a5c'}}>BS. {item.doctorName}</span>
                  </td>
                  <td>
                    {new Date(item.date).toLocaleDateString('vi-VN')}
                    <div style={{fontSize: '11px', color: '#5a6e7f'}}>Giờ mở: {new Date(item.timeOpen).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</div>
                  </td>
                  <td>{renderStatus(item.status)}</td>
                  <td>
                    <div className="adm-actions">
                      <button 
                        className="adm-actions__btn adm-actions__btn--view" 
                        onClick={() => setSelected(item)}
                        title="Xem chi tiết"
                      >
                        👁️
                      </button>

                      {/* CHECK ROLE: Nếu là Doctor mới hiện nút Xóa (hoặc các nút khác) */}
                      {role === "DOCTOR" && (
                        <button className="adm-actions__btn adm-actions__btn--delete" title="Hủy lịch">
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Xem chi tiết */}
      {selected && (
        <div className="adm-overlay" onClick={() => setSelected(null)}>
          <div className="adm-modal adm-modal--view" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal__header">
              <h2>Chi tiết lịch hẹn</h2>
              <button className="adm-modal__close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="adm-modal__body">
              <div className="adm-view">
                <div className="adm-view__right" style={{gridColumn: 'span 2'}}>
                   <div className="adm-view__desc" style={{display:'flex', alignItems:'center'}}>
                      <span className="adm-view__desc-num">i</span>
                      <b>Ghi chú:</b> {selected.note || "Không có ghi chú"}
                   </div>
                   <div style={{marginTop: '15px'}}>
                      <p><b>Khách hàng:</b> {selected.name}</p>
                      <p><b>Địa chỉ:</b> {selected.address}</p>
                      <p><b>Ngày tạo:</b> {new Date(selected.createdAt).toLocaleString('vi-VN')}</p>
                      <p><b>Trạng thái:</b> {selected.status}</p>
                   </div>
                </div>
              </div>
            </div>
            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={() => setSelected(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLichHen;