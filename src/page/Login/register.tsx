import React, { useState } from "react";
import ButtonCustom from "../../components/custom/button";
import { authRegister } from "../../api/auth";
import { message } from "antd";

interface RegisterProps {
  onRegisterSuccess: () => void;
  onBackToLogin?: () => void;
}

const Register: React.FC<RegisterProps> = ({
  onRegisterSuccess,
  onBackToLogin,
}) => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !phone || !password || !confirmPassword) {
      message.warning("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      message.warning("Mật khẩu không khớp");
      return;
    }

    try {
      setLoading(true);

      const body = {
        gmail: username,
        phone: phone,
        password: password,
      };

      await authRegister(body);

      message.success("Đăng kí thành công");
      onRegisterSuccess();

    } catch (error: any) {
      message.warning(error?.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth auth--register">
      <h2 className="auth__title">ĐĂNG KÍ</h2>
      <div className="auth__field">
        <input
          type="email"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="auth__field">
        <input
          type="text"
          placeholder="Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="auth__field">
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="auth__field">
        <input
          type="password"
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <ButtonCustom
        text={(loading ? "Loading..." : "Đăng kí" as string)}
        onClick={handleRegister}
        disabled={loading}
        className="auth__btn"
      />

      <div className="auth__footer">
        <span>Bạn đã có tài khoản?</span>
        <span className="auth__link" onClick={onBackToLogin}>
          Đăng nhập
        </span>
      </div>
    </div>
  );
};

export default Register;