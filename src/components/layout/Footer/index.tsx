import { Row, Col } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

import Logo from "../../../assets/logo.png";

const Footer = () => {
  return (
    <div className="footer">
      <Row gutter={[40, 30]}>

        <Col xs={24} md={8}>
          <div className="footer-left">

            <div className="footer-logo">
              <img src={Logo} alt="logo" />
              <div>
                <h3>BỆNH VIỆN MẮT</h3>
          
              </div>
            </div>

            <p>
              Công ty TNHH Tư vấn và Đầu tư Y tế Quốc tế
            </p>

            <p>
              Giấy chứng nhận đăng ký doanh nghiệp số: 0105008493 do Phòng
              Đăng ký kinh doanh - Sở Kế hoạch và Đầu tư TP. Hà Nội cấp ngày
              17/11/2010. Đăng ký thay đổi lần thứ: 14, ngày 16 tháng 12 năm
              2022.
            </p>

            <p>
              Giấy phép hoạt động khám bệnh, chữa bệnh số:
              28/BYT - GPHĐ do Bộ Y tế cấp ngày 22/07/2020
            </p>

          </div>
        </Col>

        <Col xs={24} md={8}>
          <div className="footer-contact">

            <h3>Thông tin liên hệ</h3>

            <div className="contact-item">
              <MailOutlined />
              <span>vienmatquoctednd@gmail.com</span>
            </div>

            <div className="contact-item">
              <PhoneOutlined />
              <span>Hotline Tư vấn & Đặt lịch khám: 0968115588</span>
            </div>

            <div className="contact-item">
              <PhoneOutlined />
              <span>Hotline CSKH & Khiếu nại: 0969.128.128</span>
            </div>

            <div className="contact-item">
              <EnvironmentOutlined />
              <span>
                126-128 Bùi Thị Xuân, P. Hai Bà Trưng, Tp Hà Nội
              </span>
            </div>

          </div>
        </Col>

        <Col xs={24} md={8}>
          <div className="footer-time">
            <h3>Thời gian làm việc</h3>

            <p>Thứ 2: 08h00 - 17h00</p>
            <p>Thứ 3: 08h00 - 17h00</p>
            <p>Thứ 4: 08h00 - 17h00</p>
            <p>Thứ 5: 08h00 - 17h00</p>
            <p>Thứ 6: 08h00 - 17h00</p>
            <p>Thứ 7: 08h00 - 17h00</p>
          </div>
        </Col>

      </Row>
    </div>
  );
};

export default Footer;