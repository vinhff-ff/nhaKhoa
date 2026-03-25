import { useState, useEffect, useRef } from "react";
import Logo from "../../../assets/logo.png";
import { DownOutlined, MenuOutlined, UserOutlined, CalendarOutlined, LogoutOutlined } from "@ant-design/icons";
import { Drawer, Dropdown } from "antd";
import type { MenuProps } from "antd";
import ButtonCustom from "../../custom/button";
import { useNavigate, useLocation } from "react-router-dom";
import routes from "../../../router/router";

const HeaderCustom = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("access_token");

  const [profile, setProfile] = useState<any>(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  const menuRoutes = routes.filter((r) => r.showInMenu && r.name);

  useEffect(() => {
    const storedProfile = localStorage.getItem("user_profile");
    if (storedProfile) {
      try {
        setProfile(JSON.parse(storedProfile));
      } catch { }
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_profile");
    navigate("/login");
  };

  const dropdownItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Thông tin cá nhân",
      onClick: () => navigate("/profile"),
    },
    {
      key: "appointments",
      icon: <CalendarOutlined />,
      label: "Lịch khám của tôi",
      onClick: () => navigate("/lich-cua-toi"),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
      onClick: handleLogout,
    },
  ];

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
                  className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
                  onClick={() => navigate(item.path)}
                >
                  {item.name}
                </div>
              ))}
              <ButtonCustom
                text="Đặt lịch khám"
                onClick={() => navigate("/order-lich-kham")}
              />
            </div>

            <div className="user">
              {token ? (
                <Dropdown
                  menu={{ items: dropdownItems }}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <div className="user-trigger" style={{ cursor: "pointer" }}>
                    <p>
                      Chào <strong>{profile?.name ?? "bạn"}</strong>{" "}
                      <DownOutlined style={{ fontSize: 13 }} />
                    </p>
                  </div>
                </Dropdown>

              ) : (
                <div className="active-btn-header">
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
              className={`drawer-item ${location.pathname === item.path ? "active" : ""}`}
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