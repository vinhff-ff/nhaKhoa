import { useState, useEffect, useRef } from "react";
import Logo from "../../../assets/logo.png";
import { DownOutlined, MenuOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import ButtonCustom from "../../custom/button";
import UserSidebar from "../../custom/menu_user";
import { useNavigate, useLocation } from "react-router-dom";
import routes from "../../../router/router";

const HeaderCustom = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("access_token");

  const [profile, setProfile] = useState<any>(null);
  const [isOpenUserDropdown, setIsOpenUserDropdown] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const userRef = useRef<HTMLDivElement>(null);

  const menuRoutes = routes.filter((r) => r.showInMenu && r.name);

  useEffect(() => {
    const storedProfile = localStorage.getItem("user_profile");
    if (storedProfile) {
      try {
        setProfile(JSON.parse(storedProfile));
      } catch {}
    }
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setIsOpenUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="header">
        <div className="header-container">

          <div className="header-left">
            <div className="menu-mobile" onClick={() => setOpenDrawer(true)}>
              <MenuOutlined />
            </div>

            <img
              src={Logo}
              alt="logo"
              className="logo"
              onClick={() => navigate("/")}
            />
          </div>

          <div className="header-right">

            <div className="header-menu">
              {menuRoutes.map((item) => (
                <div
                  key={item.path}
                  className={`menu-item ${
                    location.pathname === item.path ? "active" : ""
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  {item.name}
                </div>
              ))}
            </div>

            <div className="user" ref={userRef}>
              {token ? (
                <>
                  <div
                    className="user-trigger"
                    onClick={() =>
                      setIsOpenUserDropdown((prev) => !prev)
                    }
                  >
                    <p>
                      Chào <strong>{profile?.name}</strong>{" "}
                      <DownOutlined style={{ fontSize: 13 }} />
                    </p>
                  </div>

                  {isOpenUserDropdown && (
                    <div className="user-dropdown">
                      <UserSidebar />
                    </div>
                  )}
                </>
              ) : (
                <div className="active-btn-header">
                  <ButtonCustom
                    text="Đặt lịch khám"
                    onClick={() => navigate("/order-lich-kham")}
                  />
                  <ButtonCustom
                    text="Đăng nhập"
                    onClick={() => navigate("/login")}
                  />
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      <Drawer
        title="Menu"
        placement="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        width={260}
      >
        <div className="drawer-menu">
          {menuRoutes.map((item) => (
            <div
              key={item.path}
              className={`drawer-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => {
                navigate(item.path);
                setOpenDrawer(false);
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      </Drawer>
    </>
  );
};

export default HeaderCustom;