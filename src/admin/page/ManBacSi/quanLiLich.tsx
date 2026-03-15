import React, { useState } from "react";

interface Appointment {
  id: number;
  name: string;
  dob: string;
  phone: string;
  email: string;
  address: string;
  examDate: string;
  examTime: string;
  problem: string;
  confirmed: boolean;
}

const initialAppointments: Appointment[] = [
  {
    id: 1,
    name: "Nguyễn Thị Lan",
    dob: "1990-05-14",
    phone: "0912 345 678",
    email: "lan.nt@gmail.com",
    address: "12 Nguyễn Trãi, Đan Phượng, Hà Nội",
    examDate: "2025-06-02",
    examTime: "08:00",
    problem: "Mắt bị mờ khi nhìn xa, có thể bị cận thị tiến triển.",
    confirmed: true,
  },
  {
    id: 2,
    name: "Trần Văn Minh",
    dob: "1985-11-20",
    phone: "0987 654 321",
    email: "minhtv@yahoo.com",
    address: "45 Lê Lợi, Đan Phượng, Hà Nội",
    examDate: "2025-06-04",
    examTime: "09:00",
    problem: "Đau mắt, chảy nước mắt liên tục từ 1 tuần nay.",
    confirmed: true,
  },
  {
    id: 3,
    name: "Phạm Hoàng Anh",
    dob: "2000-03-08",
    phone: "0903 111 222",
    email: "anghp2000@gmail.com",
    address: "78 Trần Hưng Đạo, Đan Phượng, Hà Nội",
    examDate: "2025-06-04",
    examTime: "10:00",
    problem: "Kiểm tra định kỳ, kính hiện tại không còn phù hợp.",
    confirmed: false,
  },
  {
    id: 4,
    name: "Lê Thị Hương",
    dob: "1975-07-22",
    phone: "0978 888 999",
    email: "huongle@outlook.com",
    address: "23 Hùng Vương, Đan Phượng, Hà Nội",
    examDate: "2025-06-09",
    examTime: "13:30",
    problem: "Mắt bị lão thị, khó đọc sách báo, cần tư vấn kính.",
    confirmed: true,
  },
  {
    id: 5,
    name: "Vũ Đức Thành",
    dob: "1995-09-30",
    phone: "0966 777 888",
    email: "thanhvd95@gmail.com",
    address: "56 Đinh Tiên Hoàng, Đan Phượng, Hà Nội",
    examDate: "2025-06-11",
    examTime: "15:00",
    problem: "Mắt khô, hay bị kích ứng khi làm việc với máy tính.",
    confirmed: false,
  },
  {
    id: 6,
    name: "Bùi Thị Mai",
    dob: "1988-02-14",
    phone: "0912 000 111",
    email: "maibui88@gmail.com",
    address: "90 Phan Bội Châu, Đan Phượng, Hà Nội",
    examDate: "2025-06-16",
    examTime: "08:00",
    problem: "Loạn thị, nhìn hình ảnh bị méo, đặc biệt vào ban đêm.",
    confirmed: true,
  },
  {
    id: 7,
    name: "Đỗ Ngọc Sơn",
    dob: "1992-12-05",
    phone: "0934 222 333",
    email: "sondo92@gmail.com",
    address: "34 Lý Thường Kiệt, Đan Phượng, Hà Nội",
    examDate: "2025-06-18",
    examTime: "09:00",
    problem: "Tư vấn phẫu thuật LASIK, cận 4.5 độ cả hai mắt.",
    confirmed: false,
  },
  {
    id: 8,
    name: "Nguyễn Bích Ngọc",
    dob: "1998-06-18",
    phone: "0945 333 444",
    email: "ngocnb98@gmail.com",
    address: "67 Ngô Quyền, Đan Phượng, Hà Nội",
    examDate: "2025-06-23",
    examTime: "10:00",
    problem: "Viêm kết mạc tái phát nhiều lần trong năm.",
    confirmed: true,
  },
  {
    id: 9,
    name: "Hoàng Văn Long",
    dob: "1980-04-10",
    phone: "0956 444 555",
    email: "longhv80@gmail.com",
    address: "11 Bà Triệu, Đan Phượng, Hà Nội",
    examDate: "2025-06-25",
    examTime: "13:30",
    problem: "Kiểm tra võng mạc định kỳ, bệnh nhân tiểu đường type 2.",
    confirmed: false,
  },
];

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number) =>
  new Date(year, month, 1).getDay();

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const formatDob = (iso: string) => formatDate(iso);

const MONTH_NAMES = [
  "Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6",
  "Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12",
];

const AdminSchedule: React.FC = () => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [dayAppointments, setDayAppointments] = useState<Appointment[] | null>(null);
  const [filterConfirmed, setFilterConfirmed] = useState<"all" | "confirmed" | "pending">("all");

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const toggleConfirm = (id: number) => {
    setAppointments(prev =>
      prev.map(a => a.id === id ? { ...a, confirmed: !a.confirmed } : a)
    );
    if (selected?.id === id) {
      setSelected(prev => prev ? { ...prev, confirmed: !prev.confirmed } : null);
    }
  };

  const deleteAppointment = (id: number) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    setSelected(null);
  };

  const getAppointmentsForDate = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return appointments.filter(a => a.examDate === dateStr);
  };

  const filteredAppointments = appointments.filter(a => {
    if (filterConfirmed === "confirmed") return a.confirmed;
    if (filterConfirmed === "pending") return !a.confirmed;
    return true;
  });

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const isToday = (day: number) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  return (
    <div className="ads">

      <div className="ads-header">
        <div className="ads-header__left">
          <h1 className="ads-header__title">Lịch khám bệnh nhân</h1>
          <span className="ads-header__count">{appointments.length} lịch hẹn</span>
          <span className="ads-header__confirmed">
            {appointments.filter(a => a.confirmed).length} đã xác nhận
          </span>
        </div>
      </div>

      <div className="ads-body">

        <div className="ads-left">
          <div className="ads-calendar">
            <div className="ads-calendar__nav">
              <button className="ads-calendar__nav-btn" onClick={prevMonth}>
                <svg viewBox="0 0 16 16" fill="none"><path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <span className="ads-calendar__nav-title">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <button className="ads-calendar__nav-btn" onClick={nextMonth}>
                <svg viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>

            <table className="ads-cal-table">
              <thead>
                <tr>
                  {WEEKDAYS.map(d => (
                    <th key={d} className={d === "CN" ? "ads-cal-table__th--sun" : ""}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, wi) => (
                  <tr key={wi}>
                    {week.map((day, di) => {
                      if (!day) return <td key={di} className="ads-cal-table__empty" />;
                      const dayApts = getAppointmentsForDate(day);
                      const hasConfirmed = dayApts.some(a => a.confirmed);
                      const hasPending = dayApts.some(a => !a.confirmed);
                      const isSun = di === 0;
                      return (
                        <td
                          key={di}
                          className={[
                            "ads-cal-table__day",
                            isToday(day) ? "ads-cal-table__day--today" : "",
                            isSun ? "ads-cal-table__day--sun" : "",
                            dayApts.length > 0 ? "ads-cal-table__day--has" : "",
                          ].join(" ")}
                          onClick={() => dayApts.length > 0 && setDayAppointments(dayApts)}
                        >
                          <span className="ads-cal-table__num">{day}</span>
                          {(hasConfirmed || hasPending) && (
                            <div className="ads-cal-table__dots">
                              {hasConfirmed && <span className="ads-cal-table__dot ads-cal-table__dot--confirmed" />}
                              {hasPending && <span className="ads-cal-table__dot ads-cal-table__dot--pending" />}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="ads-calendar__legend">
              <div className="ads-legend-item">
                <span className="ads-legend-dot ads-legend-dot--confirmed" />
                Đã xác nhận
              </div>
              <div className="ads-legend-item">
                <span className="ads-legend-dot ads-legend-dot--pending" />
                Chờ xác nhận
              </div>
            </div>
          </div>
        </div>

        <div className="ads-right">
          <div className="ads-table-header">
            <span className="ads-table-title">Danh sách lịch hẹn</span>
            <div className="ads-filter">
              {(["all", "confirmed", "pending"] as const).map(f => (
                <button
                  key={f}
                  className={`ads-filter__btn ${filterConfirmed === f ? "ads-filter__btn--active" : ""}`}
                  onClick={() => setFilterConfirmed(f)}
                >
                  {f === "all" ? "Tất cả" : f === "confirmed" ? "Đã xác nhận" : "Chờ xác nhận"}
                </button>
              ))}
            </div>
          </div>

          <div className="ads-table-wrap">
            <table className="ads-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}>#</th>
                  <th>Bệnh nhân</th>
                  <th style={{ width: 110 }}>Ngày khám</th>
                  <th style={{ width: 76 }}>Giờ</th>
                  <th style={{ width: 100 }}>Trạng thái</th>
                  <th style={{ width: 100 }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="ads-table__empty">Không có lịch hẹn nào</td>
                  </tr>
                ) : (
                  filteredAppointments.map((a, i) => (
                    <tr
                      key={a.id}
                      className={`ads-table__row ${!a.confirmed ? "ads-table__row--pending" : ""}`}
                      onClick={() => setSelected(a)}
                    >
                      <td className="ads-table__idx">{i + 1}</td>
                      <td>
                        <div className="ads-table__name">{a.name}</div>
                        <div className="ads-table__phone">{a.phone}</div>
                      </td>
                      <td className="ads-table__date">{formatDate(a.examDate)}</td>
                      <td>
                        <span className="ads-table__time">{a.examTime}</span>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <button
                          className={`ads-status-btn ${a.confirmed ? "ads-status-btn--confirmed" : "ads-status-btn--pending"}`}
                          onClick={() => toggleConfirm(a.id)}
                        >
                          {a.confirmed ? (
                            <>
                              <svg viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              Đã xác nhận
                            </>
                          ) : "Chờ xác nhận"}
                        </button>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <div className="ads-actions">
                          <button
                            className="ads-actions__btn ads-actions__btn--view"
                            onClick={() => setSelected(a)}
                            title="Chi tiết"
                          >
                            <svg viewBox="0 0 16 16" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>
                          </button>
                          <button
                            className="ads-actions__btn ads-actions__btn--delete"
                            onClick={() => deleteAppointment(a.id)}
                            title="Xóa"
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
        </div>
      </div>

      {selected && (
        <div className="ads-overlay" onClick={() => setSelected(null)}>
          <div className="ads-modal" onClick={e => e.stopPropagation()}>
            <div className="ads-modal__header">
              <div className="ads-modal__avatar">{selected.name.charAt(0)}</div>
              <div>
                <h2 className="ads-modal__name">{selected.name}</h2>
                <p className="ads-modal__sub">{formatDate(selected.examDate)} — {selected.examTime}</p>
              </div>
              <button className="ads-modal__close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="ads-modal__body">
              <div className="ads-detail-grid">
                <div className="ads-detail-item">
                  <span className="ads-detail-label">Ngày sinh</span>
                  <span className="ads-detail-value">{formatDob(selected.dob)}</span>
                </div>
                <div className="ads-detail-item">
                  <span className="ads-detail-label">Số điện thoại</span>
                  <span className="ads-detail-value ads-detail-value--phone">{selected.phone}</span>
                </div>
                <div className="ads-detail-item">
                  <span className="ads-detail-label">Email</span>
                  <span className="ads-detail-value ads-detail-value--email">{selected.email}</span>
                </div>
                <div className="ads-detail-item ads-detail-item--full">
                  <span className="ads-detail-label">Địa chỉ</span>
                  <span className="ads-detail-value">{selected.address}</span>
                </div>
                <div className="ads-detail-item">
                  <span className="ads-detail-label">Ngày khám</span>
                  <span className="ads-detail-value">{formatDate(selected.examDate)}</span>
                </div>
                <div className="ads-detail-item">
                  <span className="ads-detail-label">Giờ khám</span>
                  <span className="ads-detail-value">{selected.examTime}</span>
                </div>
              </div>

              <div className="ads-detail-problem">
                <span className="ads-detail-label">Vấn đề mắt</span>
                <div className="ads-detail-problem__box">{selected.problem}</div>
              </div>
            </div>

            <div className="ads-modal__footer">
              <button
                className="ads-modal__delete-btn"
                onClick={() => deleteAppointment(selected.id)}
              >
                Xóa lịch hẹn
              </button>
              <div className="ads-modal__footer-right">
                <button className="ads-btn ads-btn--ghost" onClick={() => setSelected(null)}>Đóng</button>
                <button
                  className={`ads-btn ${selected.confirmed ? "ads-btn--ghost" : "ads-btn--primary"}`}
                  onClick={() => toggleConfirm(selected.id)}
                >
                  {selected.confirmed ? "Hủy xác nhận" : "Xác nhận lịch"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {dayAppointments && (
        <div className="ads-overlay" onClick={() => setDayAppointments(null)}>
          <div className="ads-modal ads-modal--day" onClick={e => e.stopPropagation()}>
            <div className="ads-modal__header">
              <h2 className="ads-modal__name">
                Lịch ngày {formatDate(dayAppointments[0].examDate)}
              </h2>
              <button className="ads-modal__close" onClick={() => setDayAppointments(null)}>✕</button>
            </div>
            <div className="ads-modal__body">
              {dayAppointments.map(a => (
                <div
                  key={a.id}
                  className="ads-day-item"
                  onClick={() => { setDayAppointments(null); setSelected(a); }}
                >
                  <div className="ads-day-item__time">{a.examTime}</div>
                  <div className="ads-day-item__info">
                    <span className="ads-day-item__name">{a.name}</span>
                    <span className="ads-day-item__problem">{a.problem}</span>
                  </div>
                  <span className={`ads-status-btn ${a.confirmed ? "ads-status-btn--confirmed" : "ads-status-btn--pending"}`}>
                    {a.confirmed ? "Đã xác nhận" : "Chờ xác nhận"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSchedule;