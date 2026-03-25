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
    dob: "",
    phone: "",
    email: "",
    address: "",
    selectedTime: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch doctors with schedules for selected date
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        
        // Get all schedules
        const res = await seeSchedule();
        const schedules: Schedule[] = Array.isArray(res) ? res : res?.data ?? [];
        
        // Filter schedules for selected date
        const filteredSchedules = schedules.filter(s => s.workDate === examDate);
        
        // Extract unique doctors from filtered schedules
        const doctorMap = new Map<number, { id: number; name: string }>();
        filteredSchedules.forEach(schedule => {
          if (!doctorMap.has(schedule.doctorId)) {
            doctorMap.set(schedule.doctorId, {
              id: schedule.doctorId,
              name: schedule.doctorName,
            });
          }
        });
        
        // Convert map to array
        const docList = Array.from(doctorMap.values());
        setDoctors(docList);
        
        // Map to SelectCustom format
        const options = docList.map(doc => ({
          label: `BS. ${doc.name}`,
          value: String(doc.id),
        }));
        setDoctorOptions(options);
        
        // Reset selected doctor when date changes
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
        
        // Map to SelectCustom format and filter out lunch break (11:00-13:00)
        const options = slotList
          .map(slot => ({
            time: formatTime(slot.timeSlot),
            label: formatTime(slot.timeSlot),
            value: formatTime(slot.timeSlot),
          }))
          .filter(item => {
            // Hide times between 11:00 and 13:00 (lunch break)
            return !(item.time >= "11:00" && item.time < "13:00");
          })
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
    // Validate fields (dob is optional)
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim() ||
      !formData.address.trim() ||
      !selectedDoctor ||
      !examDate ||
      !formData.selectedTime ||
      !formData.note.trim()
    ) {
      message.error("Vui lòng điền đầy đủ tất cả các trường bắt buộc");
      return;
    }

    setSubmitting(true);
    try {
      // Combine exam date and time into ISO datetime format for appointment
      const dateTimeString = `${examDate}T${formData.selectedTime}:00`;

      const body = {
        doctorId: Number(selectedDoctor),
        name: formData.name,
        date: formData.dob || null,  // date of birth (ngày sinh)
        phone: formData.phone,
        gmail: formData.email,
        address: formData.address,
        timeOpen: dateTimeString,    // appointment time (thời gian khám)
        note: formData.note,
      };

      const result = await datLichHen(body);
      console.log("Đặt lịch thành công:", result);
      message.success("Đặt lịch khám thành công! Chúng tôi sẽ liên hệ bạn sớm.");
      
      // Reset form after 1.5 seconds
      setTimeout(() => {
        setFormData({
          name: "",
          dob: "",
          phone: "",
          email: "",
          address: "",
          selectedTime: "",
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
                    value={formData.dob}
                    onChange={(e: any) =>
                      setFormData({ ...formData, dob: e.target.value })
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
                  <label>Email</label>
                  <InputCustom
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e: any) =>
                      setFormData({ ...formData, email: e.target.value })
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
                    value={formData.selectedTime}
                    onChange={(value: string) =>
                      setFormData({ ...formData, selectedTime: value })
                    }
                  />
                </div>

                <div className="formRow textareaRow">
                  <label>Vấn đề mắt đang gặp phải</label>
                  <textarea
                    placeholder="Mô tả vấn đề mắt..."
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