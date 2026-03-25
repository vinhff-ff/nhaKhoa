import { useState } from "react";
import CommonInput from "../../components/custom/input";
import ButtonCustom from "../../components/custom/button";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { taoTN } from "../../api/api";

const Contact = () => {
  const [form, setForm] = useState({ name: "", gmail: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.gmail.trim() || !form.text.trim()) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await taoTN(form);
      setSuccess(true);
      setForm({ name: "", gmail: "", text: "" });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Gửi thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contactContainer">
      <div className="contactWrapper">

        <div className="contactMap">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11360.480971770347!2d105.78531781300022!3d21.041176518030433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab355cc2239b%3A0x9ae247114fb38da3!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBTxrAgUGjhuqFtIEjDoCBO4buZaQ!5e1!3m2!1svi!2s!4v1773049849400!5m2!1svi!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
          />
        </div>

        <div className="contactForm">
          <h2>Liên hệ với chúng tôi</h2>

          <div className="formGroup">
            <CommonInput
              placeholder="Họ và tên"
              value={form.name}
              onChange={(e: any) => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div className="formGroup">
            <CommonInput
              placeholder="Email"
              value={form.gmail}
              onChange={(e: any) => setForm(f => ({ ...f, gmail: e.target.value }))}
            />
          </div>

          <div className="formGroup">
            <textarea
              className="textArea"
              placeholder="Nhập nội dung cần tư vấn..."
              value={form.text}
              onChange={(e) => setForm(f => ({ ...f, text: e.target.value }))}
            />
          </div>

          {error && (
            <p style={{ color: "#e53935", fontSize: 13, marginBottom: 8 }}>
              {error}
            </p>
          )}

          {success && (
            <p style={{ color: "#2e7d32", fontSize: 13, marginBottom: 8 }}>
              ✓ Gửi thông tin thành công!
            </p>
          )}

          <ButtonCustom
            text={loading ? "Đang gửi..." : "Gửi thông tin"}
            onClick={handleSubmit}
            disabled={loading}
          />

          <div className="contactInfo">
            <div className="infoCard">
              <MailOutlined className="icon" />
              <div>
                <h4>Email của chúng tôi</h4>
                <p>contact@nhakhoa.vn</p>
              </div>
            </div>

            <div className="infoCard">
              <PhoneOutlined className="icon" />
              <div>
                <h4>Số điện thoại</h4>
                <p>0988 888 888</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;