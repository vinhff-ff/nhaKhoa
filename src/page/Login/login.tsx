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
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!gmail || !password) {
      message.warning("Vui lòng nhập email hoặc mật khẩu");
      return;
    }

    try {
      setLoading(true);

      const loginRes = await authLogin({ gmail, password });


      if (loginRes.satus !== 200) {
        message.error(loginRes.message || "Đăng nhập thất bại");
        return;
      }

      const token = loginRes.data.token;
      localStorage.setItem("access_token", token);

      const profileRes = await getProfile();

      if (profileRes.status !== "success") {
        message.error("Không thể lấy thông tin người dùng");
        return;
      }

      localStorage.setItem("user_profile", JSON.stringify(profileRes.data));

      const role = profileRes.data.role;

      if (role === "CUSTOMER") {
        message.success("Đăng nhập thành công");
        window.location.href = "/";
        return;
      }

      message.success("Đăng nhập thành công");

      if (router) {
        navigate(`/admin`);
      } else {
        window.location.href = "/";
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
          placeholder="Gmail"
          value={gmail}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="auth__field" style={{ position: "relative" }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ paddingRight: "40px" }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#666",
          }}
          title={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
        >
          {showPassword ? (
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <path d="M3 12s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-7-11-7a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a18.47 18.47 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>

      <ButtonCustom
        text="Đăng nhập"
        onClick={handleLogin}
        disabled={loading}
        className="auth__btn"
      />
      <p style={{ textAlign: "end", fontSize: "14px", color: "#555", marginTop: "-12px" }}>
        <span>Quên mật khẩu?</span>
      </p>
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