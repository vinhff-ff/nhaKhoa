import React, { useState } from "react";
import ButtonCustom from "../../components/custom/button";
import { message } from "antd";
import { authLogin } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../api/api";

interface LoginProps {
  onClose?: () => void;
  onRegister?: () => void;
  router?: string;
}

const Login: React.FC<LoginProps> = ({ onRegister, router }) => {
  const [gmail, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!gmail || !password) {
      message.warning("Vui lòng nhập email hoặc mật khẩu");
      return;
    }

    try {
      setLoading(true);
      const loginRes = await authLogin({
        gmail,
        password,
      });

      if (loginRes.satus !== 200) {
        message.error(loginRes.message || "Đăng nhập thất bại");
        return;
      }

      const token = loginRes.data.token;
      localStorage.setItem("access_token", token);

      const profileRes = await getProfile();

      if (profileRes.satus === 200) {
        localStorage.setItem(
          "user_profile",
          JSON.stringify(profileRes.data)
        );
      }
      message.success("Đăng nhập thành công");
      if (router) {
        navigate(`/admin`);
      } else {
        window.location.href = "/"
      }


    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Đăng nhập thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth auth--login">
      <h2 className="auth__title">ĐĂNG NHẬP</h2>

      <div className="auth__field">
        <input
          type="email"
          placeholder="Email"
          value={gmail}
          onChange={(e) => setUsername(e.target.value)}
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

      <ButtonCustom
        text="Đăng nhập"
        onClick={handleLogin}
        disabled={loading}
        className="auth__btn"
      />

      <div className="auth__footer">
        <span>Bạn chưa có tài khoản?</span>
        <span className="auth__link" onClick={onRegister}>
          Đăng kí
        </span>
      </div>
    </div>
  );
};

export default Login;