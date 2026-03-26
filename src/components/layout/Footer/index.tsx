import { Row, Col } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  FacebookFilled,
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
                <h3>PHÒNG KHÁM MẮT TÂN TÂY ĐÔ
                </h3>

              </div>
            </div>

            <p>
              Chi nhánh thuộc Công ty Cổ phần Y – Dược Hưng Thành

            </p>

            <p>
              Mã số thuế: 0107008474-001

            </p>

          </div>
        </Col>

        <Col xs={24} md={8}>
          <div className="footer-contact">

            <h3>Thông tin liên hệ</h3>

            {/* <div className="contact-item">
              <MailOutlined />
              <span>vienmatquoctednd@gmail.com</span>
            </div> */}

            <div className="contact-item">
              <PhoneOutlined />
              <span>Hotline:  0982 990 669</span>
            </div>

            <div className="contact-item">
              <FacebookFilled />
              <span>Phòng khám mắt Tân Tây Đô</span>
            </div>
        
            <div className="contact-item">
              <EnvironmentOutlined />
              <span>
                Địa chỉ: BT4 Ô 8 KĐT Tân Tây Đô, Tân Lập, Đan Phượng, Hà Nội
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