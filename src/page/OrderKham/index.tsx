import InputCustom from "../../components/custom/input";
import SelectCustom from "../../components/custom/select";
import ButtonCustom from "../../components/custom/button";
import bgBooking from "../../assets/bgUser.png";
import BgWhiteBorder from "../../components/custom/bgWhiteBoder";

const doctors = [
  { label: "BS. Lê Thị Thu Hà", value: "1" },
  { label: "BS. Nguyễn Minh Anh", value: "2" },
  { label: "BS. Trần Đức Hùng", value: "3" },
  { label: "BS. Phạm Hoàng Nam", value: "4" },
  { label: "BS. Nguyễn Thu Trang", value: "5" },
];

const times = [
  { label: "08:00", value: "08:00" },
  { label: "09:00", value: "09:00" },
  { label: "10:00", value: "10:00" },
  { label: "13:30", value: "13:30" },
  { label: "15:00", value: "15:00" },
  { label: "16:00", value: "16:00" },
  { label: "17:00", value: "17:00" },
];

const OrderLichKham = () => {
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
                  <InputCustom placeholder="Họ và tên" />
                </div>

                <div className="formRow">
                  <label>Ngày tháng năm sinh</label>
                  <InputCustom type="date" />
                </div>

                <div className="formRow">
                  <label>Số điện thoại</label>
                  <InputCustom placeholder="Số điện thoại" />
                </div>

                <div className="formRow">
                  <label>Email</label>
                  <InputCustom placeholder="Email" />
                </div>

                <div className="formRow">
                  <label>Địa chỉ</label>
                  <InputCustom placeholder="Địa chỉ" />
                </div>
              </div>

              {/* COL RIGHT */}
              <div className="orderForm__col">
                <div className="formRow">
                  <label>Ngày khám bệnh</label>
                  <InputCustom type="date" />
                </div>

                <div className="formRow">
                  <label>Chọn bác sĩ</label>
                  <SelectCustom options={doctors} placeholder="Chọn bác sĩ" />
                </div>

                <div className="formRow">
                  <label>Giờ khám</label>
                  <SelectCustom options={times} placeholder="Chọn giờ khám" />
                </div>

                <div className="formRow textareaRow">
                  <label>Vấn đề mắt đang gặp phải</label>
                  <textarea placeholder="Mô tả vấn đề mắt..." />
                </div>
              </div>

            </div>

            {/* ── Submit ── */}
            <div className="btnBox">
              <ButtonCustom text="Đặt lịch khám" />
            </div>

          </div>
        </BgWhiteBorder>
      </div>
    </div>
  );
};

export default OrderLichKham;