import React, { useState } from "react";
import Login from "./login";
import Register from "./register";
import Logo from "../../assets/logo.png";
import BgWhiteBorder from "../../components/custom/bgWhiteBoder";

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="auth-page">
      <div className="auth-container">

        <div className="auth-left">
          <div className="auth-logo">
            <img src={Logo} alt="logo" />
            <span>TÂN TÂY ĐÔ</span>
          </div>

          <h1>Chào mừng đến với TÂN TÂY ĐÔ</h1>

          <p>
            Chúng tôi rất vui được chăm sóc sức khỏe của quý vị. 
            Tại đây, chúng tôi cam kết cung cấp dịch vụ y tế chất lượng,
            chu đáo và chuyên nghiệp nhất để mang lại sự an tâm
            và hài lòng cho quý khách.
          </p>
        </div>

        <div className="auth-right">
          <BgWhiteBorder>
            {mode === "login" ? (
              <Login
                router="admin"
                onClose={() => console.log("Login success")}
                onRegister={() => setMode("register")}
              />
            ) : (
              <Register
                onRegisterSuccess={() => setMode("login")}
                onBackToLogin={() => setMode("login")}
              />
            )}
          </BgWhiteBorder>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;