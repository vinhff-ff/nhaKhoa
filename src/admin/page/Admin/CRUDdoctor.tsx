import React, { useState } from "react";

export interface Doctor {
  id: number;
  name: string;
  school: string;
  gmail: string;
  desc1: string;
  desc2: string;
  desc3: string;
  image: string;
}

const initialDoctors: Doctor[] = [
  {
    id: 1,
    name: "LÊ THỊ THU HÀ",
    school: "TRƯỞNG KHOA KHÚC XẠ - BỆNH VIỆN MẮT QUỐC TẾ DND SÀI GÒN",
    gmail: "leha.dr@tantaydo.vn",
    desc1: "Với hơn 12 năm kinh nghiệm trong lĩnh vực điều trị và phẫu thuật khúc xạ, ThS.BS Lê Thị Thu Hà là chuyên gia uy tín trong kiểm soát tiến triển cận thị và các phẫu thuật khúc xạ hiện đại.",
    desc2: "Tốt nghiệp Thạc sĩ Nhãn khoa – Đại học Y Hà Nội, BS đã thực hiện hàng nghìn ca phẫu thuật thành công, giúp nhiều bệnh nhân lấy lại thị lực và chất lượng sống tốt hơn.",
    desc3: "Luôn cập nhật các kỹ thuật tiên tiến như LASIK, ReLEx SMILE, Femto-Pro và được bệnh nhân yêu mến bởi sự tận tâm trong từng ca điều trị.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    name: "NGUYỄN MINH ANH",
    school: "PHÓ KHOA NHÃN KHOA - BỆNH VIỆN MẮT TRUNG ƯƠNG",
    gmail: "minhanh.dr@tantaydo.vn",
    desc1: "ThS.BS Nguyễn Minh Anh có 10 năm kinh nghiệm trong chẩn đoán và điều trị các bệnh lý võng mạc, đặc biệt là bệnh võng mạc tiểu đường và thoái hóa điểm vàng.",
    desc2: "Tốt nghiệp loại xuất sắc chuyên ngành Nhãn khoa tại Đại học Y Dược TP.HCM, bác sĩ đã tham gia nhiều hội nghị nhãn khoa quốc tế tại Nhật Bản và Hàn Quốc.",
    desc3: "Được bệnh nhân tin tưởng bởi thái độ nhẹ nhàng, tận tình và khả năng giải thích bệnh lý rõ ràng, dễ hiểu.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 3,
    name: "TRẦN ĐỨC HÙNG",
    school: "CHUYÊN KHOA II NHÃN KHOA - BỆNH VIỆN MẮT HÀ NỘI",
    gmail: "duchung.dr@tantaydo.vn",
    desc1: "BS.CKII Trần Đức Hùng có hơn 15 năm trong lĩnh vực phẫu thuật đục thủy tinh thể và cấy ghép thủy tinh thể nhân tạo, đã thực hiện trên 5.000 ca phẫu thuật thành công.",
    desc2: "Hoàn thành chương trình Chuyên khoa II tại Đại học Y Hà Nội và tu nghiệp tại Singapore. Là thành viên của Hội Nhãn khoa Việt Nam và Hội Nhãn khoa châu Á - Thái Bình Dương.",
    desc3: "Chuyên sâu về phẫu thuật phaco không đau, ứng dụng công nghệ laser femtosecond trong phẫu thuật đục thủy tinh thể, mang lại kết quả thị lực vượt trội.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 4,
    name: "PHẠM HOÀNG NAM",
    school: "GIẢNG VIÊN NHÃN KHOA - ĐẠI HỌC Y HÀ NỘI",
    gmail: "hoangnam.dr@tantaydo.vn",
    desc1: "PGS.TS Phạm Hoàng Nam là chuyên gia đầu ngành về glaucoma (tăng nhãn áp) với hơn 20 năm nghiên cứu và điều trị lâm sàng tại các bệnh viện lớn trong và ngoài nước.",
    desc2: "Tác giả của hơn 30 công trình nghiên cứu khoa học được công bố trên các tạp chí y khoa quốc tế. Từng tu nghiệp tại Pháp và Mỹ về điều trị glaucoma nặng.",
    desc3: "Nổi tiếng với phương pháp điều trị toàn diện, kết hợp thuốc và phẫu thuật, giúp bảo tồn thị lực lâu dài cho bệnh nhân glaucoma.",
    image: "https://randomuser.me/api/portraits/men/56.jpg",
  },
  {
    id: 5,
    name: "NGUYỄN THU TRANG",
    school: "TRƯỞNG PHÒNG KHÁM MẮT TRẺ EM - BỆNH VIỆN NHI TRUNG ƯƠNG",
    gmail: "thutrang.dr@tantaydo.vn",
    desc1: "ThS.BS Nguyễn Thu Trang là bác sĩ chuyên khoa về nhãn khoa nhi, với 8 năm kinh nghiệm khám và điều trị các bệnh lý mắt ở trẻ em, đặc biệt là kiểm soát cận thị học đường.",
    desc2: "Tốt nghiệp Thạc sĩ Nhãn khoa – Đại học Y Hà Nội và nhận học bổng nghiên cứu sinh tại Đại học Quốc gia Seoul, Hàn Quốc về lĩnh vực nhãn khoa nhi.",
    desc3: "Sử dụng thành thạo các phương pháp điều trị hiện đại như kính Ortho-K, atropine kiểm soát cận thị và được phụ huynh tin tưởng bởi cách tiếp cận thân thiện với trẻ.",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
  },
];

const emptyForm: Omit<Doctor, "id"> = {
  name: "",
  school: "",
  gmail: "",
  desc1: "",
  desc2: "",
  desc3: "",
  image: "",
};

type ModalMode = "add" | "edit" | "view" | null;

const AdminDoctor: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [form, setForm] = useState<Omit<Doctor, "id">>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Doctor | null>(null);
  const [search, setSearch] = useState("");

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.gmail.toLowerCase().includes(search.toLowerCase()) ||
      d.school.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm(emptyForm);
    setModalMode("add");
  };

  const openEdit = (d: Doctor) => {
    const { id, ...rest } = d;
    setForm(rest);
    setSelected(d);
    setModalMode("edit");
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

  const handleSave = () => {
    if (!form.name.trim() || !form.gmail.trim()) return;

    if (modalMode === "add") {
      const newId = Math.max(0, ...doctors.map((d) => d.id)) + 1;
      setDoctors([...doctors, { id: newId, ...form }]);
    } else if (modalMode === "edit" && selected) {
      setDoctors(
        doctors.map((d) => (d.id === selected.id ? { id: d.id, ...form } : d))
      );
    }
    closeModal();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setDoctors(doctors.filter((d) => d.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="adm">
      <div className="adm-header">
        <div className="adm-header__left">
          <h1 className="adm-header__title">Quản lý bác sĩ</h1>
          <span className="adm-header__count">{doctors.length} bác sĩ</span>
        </div>
        <button className="adm-btn adm-btn--primary" onClick={openAdd}>
          <svg viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          Thêm bác sĩ
        </button>
      </div>

      <div className="adm-toolbar">
        <div className="adm-search">
          <svg className="adm-search__icon" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            className="adm-search__input"
            placeholder="Tìm theo tên, email, đơn vị..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="adm-toolbar__result">
          Hiển thị {filtered.length} / {doctors.length}
        </span>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th style={{ width: 48 }}>#</th>
              <th style={{ width: 56 }}>Ảnh</th>
              <th>Họ và tên</th>
              <th>Đơn vị</th>
              <th>Gmail</th>
              <th style={{ width: 140 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="adm-table__empty">
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
                      src={d.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=d6e8f5&color=1a3a5c`}
                      alt={d.name}
                    />
                  </td>
                  <td>
                    <span className="adm-table__name">{d.name}</span>
                  </td>
                  <td>
                    <span className="adm-table__school">{d.school}</span>
                  </td>
                  <td>
                    <span className="adm-table__gmail">{d.gmail}</span>
                  </td>
                  <td>
                    <div className="adm-actions">
                      <button
                        className="adm-actions__btn adm-actions__btn--view"
                        title="Xem"
                        onClick={() => openView(d)}
                      >
                        <svg viewBox="0 0 16 16" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>
                      </button>
                      <button
                        className="adm-actions__btn adm-actions__btn--edit"
                        title="Sửa"
                        onClick={() => openEdit(d)}
                      >
                        <svg viewBox="0 0 16 16" fill="none"><path d="M11 2l3 3-8 8H3v-3l8-8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>
                      </button>
                      <button
                        className="adm-actions__btn adm-actions__btn--delete"
                        title="Xóa"
                        onClick={() => setDeleteTarget(d)}
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


      {(modalMode === "add" || modalMode === "edit") && (
        <div className="adm-overlay" onClick={closeModal}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal__header">
              <h2>{modalMode === "add" ? "Thêm bác sĩ mới" : "Chỉnh sửa bác sĩ"}</h2>
              <button className="adm-modal__close" onClick={closeModal}>✕</button>
            </div>

            <div className="adm-modal__body">
              <div className="adm-form__grid">
                <div className="adm-form__col">
                  <div className="adm-field">
                    <label>Họ và tên <span>*</span></label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="VD: NGUYỄN VĂN A" />
                  </div>
                  <div className="adm-field">
                    <label>Gmail <span>*</span></label>
                    <input name="gmail" value={form.gmail} onChange={handleChange} placeholder="VD: bsA@tantaydo.vn" />
                  </div>
                  <div className="adm-field">
                    <label>Đơn vị / Chức vụ</label>
                    <input name="school" value={form.school} onChange={handleChange} placeholder="VD: TRƯỞNG KHOA NHÃN KHOA..." />
                  </div>
                  <div className="adm-field">
                    <label>Link ảnh đại diện</label>
                    <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
                    {form.image && (
                      <img className="adm-field__preview" src={form.image} alt="preview"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    )}
                  </div>
                </div>

                <div className="adm-form__col">
                  <div className="adm-field">
                    <label>Mô tả 1</label>
                    <textarea name="desc1" value={form.desc1} onChange={handleChange} rows={3} placeholder="Kinh nghiệm, chuyên môn nổi bật..." />
                  </div>
                  <div className="adm-field">
                    <label>Mô tả 2</label>
                    <textarea name="desc2" value={form.desc2} onChange={handleChange} rows={3} placeholder="Học vấn, đào tạo..." />
                  </div>
                  <div className="adm-field">
                    <label>Mô tả 3</label>
                    <textarea name="desc3" value={form.desc3} onChange={handleChange} rows={3} placeholder="Kỹ thuật, phong cách làm việc..." />
                  </div>
                </div>
              </div>
            </div>

            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={closeModal}>Hủy</button>
              <button className="adm-btn adm-btn--primary" onClick={handleSave}>
                {modalMode === "add" ? "Thêm bác sĩ" : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

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
                    src={selected.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(selected.name)}&background=d6e8f5&color=1a3a5c&size=200`}
                    alt={selected.name}
                  />
                  <h3 className="adm-view__name">{selected.name}</h3>
                  <p className="adm-view__school">{selected.school}</p>
                  <p className="adm-view__gmail">
                    <svg viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.3"/></svg>
                    {selected.gmail}
                  </p>
                </div>
                <div className="adm-view__right">
                  {[selected.desc1, selected.desc2, selected.desc3]
                    .filter(Boolean)
                    .map((desc, i) => (
                      <div key={i} className="adm-view__desc">
                        <span className="adm-view__desc-num">{i + 1}</span>
                        <p>{desc}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={closeModal}>Đóng</button>
              <button className="adm-btn adm-btn--primary" onClick={() => openEdit(selected)}>Chỉnh sửa</button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="adm-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="adm-modal adm-modal--confirm" onClick={(e) => e.stopPropagation()}>
            <div className="adm-confirm__icon">
              <svg viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 className="adm-confirm__title">Xác nhận xóa</h3>
            <p className="adm-confirm__desc">
              Bạn có chắc muốn xóa bác sĩ <strong>{deleteTarget.name}</strong>? Hành động này không thể hoàn tác.
            </p>
            <div className="adm-confirm__actions">
              <button className="adm-btn adm-btn--ghost" onClick={() => setDeleteTarget(null)}>Hủy</button>
              <button className="adm-btn adm-btn--danger" onClick={handleDelete}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctor;