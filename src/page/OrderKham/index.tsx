import { useState, useEffect } from "react";
import { message } from "antd";
import InputCustom from "../../components/custom/input";
import SelectCustom from "../../components/custom/select";
import ButtonCustom from "../../components/custom/button";
import bgBooking from "../../assets/bgUser.png";
import BgWhiteBorder from "../../components/custom/bgWhiteBoder";
import { seeEmptySchedule, seeSchedule } from "../../api/employees";
import { datLichHen } from "../../api/api";

// Helper: Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper: Format time from HH:MM:SS to HH:MM
const formatTime = (time: string) => {
  if (!time) return "";
  return time.slice(0, 5);
};

// Helper: Map lever to prefix
const LEVER_MAP: Record<string, string> = {
  "TIẾN SĨ": "TS.",
  "THẠC SĨ": "ThS.",
  "BÁC SĨ": "BS.",
};

interface Doctor {
  id: number;
  name: string;
  lever?: string;
  [key: string]: any;
}

interface TimeSlot {
  timeSlot: string;
  [key: string]: any;
}

interface Schedule {
  id: number;
  doctorId: number;
  doctorName: string;
  workDate: string;
  startTime: string;
  endTime: string;
  maxPatient: number;
  currentPatient: number | null;
  status: string;
}

const OrderLichKham = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorOptions, setDoctorOptions] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [examDate, setExamDate] = useState(getTodayDate());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [timeOptions, setTimeOptions] = useState<any[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",   // → date (ngày sinh, LocalDate)
    phone: "",
    gmail: "",
    address: "",
    appointmentTime: "", // → timeOpen (giờ khám, LocalTime)
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch doctors with schedules for selected date
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);

        const res = await seeSchedule();
        const schedules: Schedule[] = Array.isArray(res) ? res : res?.data ?? [];

        const filteredSchedules = schedules.filter(s => s.workDate === examDate);

        const doctorMap = new Map<number, { id: number; name: string }>();
        filteredSchedules.forEach(schedule => {
          if (!doctorMap.has(schedule.doctorId)) {
            doctorMap.set(schedule.doctorId, {
              id: schedule.doctorId,
              name: schedule.doctorName,
            });
          }
        });

        const docList = Array.from(doctorMap.values());
        setDoctors(docList);

        const options = docList.map(doc => ({
          label: `BS. ${doc.name}`,
          value: String(doc.id),
        }));
        setDoctorOptions(options);

        setSelectedDoctor("");
      } catch (err) {
        console.error("Lỗi tải danh sách bác sĩ:", err);
        message.error("Không thể tải danh sách bác sĩ");
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, [examDate]);

  // Fetch available slots when doctor or exam date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDoctor || !examDate) return;

      try {
        setLoadingSlots(true);
        const res = await seeEmptySchedule({
          doctorId: Number(selectedDoctor),
          workDate: examDate,
        });

        const slotList: TimeSlot[] = Array.isArray(res) ? res : res?.data ?? [];
        setSlots(slotList);

        const options = slotList
          .map(slot => ({
            time: formatTime(slot.timeSlot),
            label: formatTime(slot.timeSlot),
            value: formatTime(slot.timeSlot),
          }))
          .filter(item => !(item.time >= "11:00" && item.time < "13:00"))
          .map(({ label, value }) => ({ label, value }));

        setTimeOptions(options);
      } catch (err) {
        console.error("Lỗi tải giờ trống:", err);
        setTimeOptions([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDoctor, examDate]);

  // Handle form submission
  const handleSubmit = async () => {
    // Kiểm tra các trường bắt buộc không được để trống
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.gmail.trim() ||
      !formData.address.trim() ||
      !selectedDoctor ||
      !examDate ||
      !formData.appointmentTime ||
      !formData.note.trim()
    ) {
      message.error("Vui lòng điền đầy đủ tất cả các trường bắt buộc");
      return;
    }

    // Kiểm tra số điện thoại phải là số và hợp lệ (Việt Nam)
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      message.error("Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam hợp lệ");
      return;
    }

    // Kiểm tra gmail phải là định dạng @gmail.com
    const gmailRegex = /^[^\s@]+@gmail\.com$/;
    if (!gmailRegex.test(formData.gmail.trim())) {
      message.error("Vui lòng nhập đúng định dạng Gmail (example@gmail.com)");
      return;
    }

    setSubmitting(true);
    try {
      const body = {
        doctorId: Number(selectedDoctor),
        name: formData.name,
        date: formData.dateOfBirth || null,         // ngày sinh (LocalDate: YYYY-MM-DD)
        phone: formData.phone,
        gmail: formData.gmail,
        address: formData.address,
        createdAt: examDate,                        // ngày khám bệnh (LocalDate: YYYY-MM-DD)
        timeOpen: `${formData.appointmentTime}:00`, // giờ khám (LocalTime: HH:MM:SS)
        note: formData.note,
      };

      const result = await datLichHen(body);
      console.log("Đặt lịch thành công:", result);
      message.success("Đặt lịch khám thành công! Chúng tôi sẽ liên hệ bạn sớm.");

      setTimeout(() => {
        setFormData({
          name: "",
          dateOfBirth: "",
          phone: "",
          gmail: "",
          address: "",
          appointmentTime: "",
          note: "",
        });
        setSelectedDoctor("");
        setExamDate(getTodayDate());
      }, 1500);
    } catch (err) {
      console.error("Lỗi đặt lịch:", err);
      message.error("Đặt lịch thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="orderContainer"
      style={{ backgroundImage: `url(${bgBooking})` }}
    >
      <div className="overlay" />

      <div className="orderWrapper">
        <BgWhiteBorder className="whiteOverlayBox">
          <div className="orderForm">

            <div className="orderForm__header">
              <h2>Đặt lịch khám</h2>
              <p>Điền thông tin bên dưới, chúng tôi sẽ xác nhận lịch hẹn sớm nhất</p>
            </div>

            <div className="orderForm__grid">

              <div className="orderForm__col">
                <div className="formRow">
                  <label>Họ và tên</label>
                  <InputCustom
                    placeholder="Họ và tên"
                    value={formData.name}
                    onChange={(e: any) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="formRow">
                  <label>Ngày tháng năm sinh</label>
                  <InputCustom
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e: any) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                  />
                </div>

                <div className="formRow">
                  <label>Số điện thoại</label>
                  <InputCustom
                    placeholder="Số điện thoại"
                    value={formData.phone}
                    onChange={(e: any) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="formRow">
                  <label>Gmail</label>
                  <InputCustom
                    placeholder="Gmail"
                    value={formData.gmail}
                    onChange={(e: any) =>
                      setFormData({ ...formData, gmail: e.target.value })
                    }
                  />
                </div>

                <div className="formRow">
                  <label>Địa chỉ</label>
                  <InputCustom
                    placeholder="Địa chỉ"
                    value={formData.address}
                    onChange={(e: any) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* COL RIGHT */}
              <div className="orderForm__col">
                <div className="formRow">
                  <label>Ngày khám bệnh</label>
                  <InputCustom
                    type="date"
                    value={examDate}
                    onChange={(e: any) => setExamDate(e.target.value)}
                  />
                </div>

                <div className="formRow">
                  <label>Chọn bác sĩ</label>
                  <SelectCustom
                    options={doctorOptions}
                    placeholder={loadingDoctors ? "Đang tải..." : "Chọn bác sĩ"}
                    value={selectedDoctor}
                    onChange={(value: string) => setSelectedDoctor(value)}
                  />
                </div>

                <div className="formRow">
                  <label>Giờ khám</label>
                  <SelectCustom
                    options={timeOptions}
                    placeholder={loadingSlots ? "Đang tải..." : "Chọn giờ khám"}
                    disabled={!selectedDoctor || loadingSlots}
                    value={formData.appointmentTime}
                    onChange={(value: string) =>
                      setFormData({ ...formData, appointmentTime: value })
                    }
                  />
                </div>

                <div className="formRow textareaRow">
                  <label>Vấn đề đang gặp phải</label>
                  <textarea
                    placeholder="Mô tả vấn đề..."
                    value={formData.note}
                    onChange={(e) =>
                      setFormData({ ...formData, note: e.target.value })
                    }
                  />
                </div>
              </div>

            </div>

            {/* ── Submit ── */}
            <div className="btnBox">
              <ButtonCustom
                text={submitting ? "Đang xử lý..." : "Đặt lịch khám"}
                onClick={handleSubmit}
                disabled={submitting}
              />
            </div>

          </div>
        </BgWhiteBorder>
      </div>
    </div>
  );
};

export default OrderLichKham;