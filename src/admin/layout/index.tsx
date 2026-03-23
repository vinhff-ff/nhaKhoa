import React, { useState, useEffect } from "react";
import {
  HomeOutlined,
  UserAddOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  FileTextOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  PhoneOutlined,
  PictureOutlined,
  ScheduleOutlined,
  LineChartOutlined,

} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme, Avatar, Badge, Tooltip, Dropdown } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/logo.png";

const { Header, Content, Sider } = Layout;

type Role = "ADMIN" | "DOCTOR";

interface RouteConfig {
  key: string;
  path: string;
  label: string;
  icon: React.ReactNode;
  roles: Role[];
}

const ALL_ROUTES: RouteConfig[] = [
  {
    key: "adminTrangChu",
    path: "/trang-chu-admin",
    label: "Trang ADMIN",
    icon: <HomeOutlined />,
    roles: ["ADMIN"],
  },
  {
    key: "adminCRUDbacSi",
    path: "/crud-bac-si",
    label: "Quản lí bác sĩ",
    icon: <MedicineBoxOutlined />,
    roles: ["ADMIN"],
  },
  {
    key: "adminInforContact",
    path: "/admin-infor-contact",
    label: "Quản lí tin nhắn",
    icon: <PhoneOutlined />,
    roles: ["ADMIN"],
  },
  {
    key: "adminBanner",
    path: "/admin-banner",
    label: "Quản lí banner",
    icon: <PictureOutlined />,
    roles: ["ADMIN"],
  },


  
  {
    key: "doctorHome",
    path: "/bac-si-quan-li-lich",
    label: "Lịch làm việc",
    icon: <ScheduleOutlined />,
    roles: ["DOCTOR"],
  },
  {
    key: "doctorThongKe",
    path: "/bac-si-thong-ke",
    label: "Thống kê năng suất",
    icon: <LineChartOutlined />,
    roles: ["DOCTOR"],
  }
];



const getMenuItemsByRole = (role: Role) =>
  ALL_ROUTES.filter((r) => r.roles.includes(role)).map((r) => ({
    key: r.key,
    icon: r.icon,
    label: r.label,
  }));

const KEY_TO_PATH = Object.fromEntries(ALL_ROUTES.map((r) => [r.key, r.path]));

const getSelectedKey = (pathname: string): string => {
  const match = ALL_ROUTES
    .slice()
    .sort((a, b) => b.path.length - a.path.length)
    .find((r) => pathname.startsWith(r.path));
  return match?.key ?? "adminHome";
};

const ROLE_META: Record<Role, { headerTitle: string; roleLabel: string }> = {
  ADMIN: { headerTitle: "Admin Panel", roleLabel: "Quản trị viên" },
  DOCTOR: { headerTitle: "Bác sĩ", roleLabel: "Bác sĩ" },
};


interface AdminLayoutProps {
  children: React.ReactNode;
  breadcrumb?: { title: string }[];
}

const AdminLayout = ({ children, breadcrumb = [] }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [siderWidth, setSiderWidth] = useState<number>(() => {
    const saved = localStorage.getItem("admin_sider_width");
    return saved ? Number(saved) : 240;
  });

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    localStorage.setItem("admin_sider_width", String(siderWidth));
  }, [siderWidth]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = siderWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      if (newWidth >= 180 && newWidth <= 420) setSiderWidth(newWidth);
    };
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const userProfile = JSON.parse(localStorage.getItem("user_profile") || "{}");
  const role: Role = userProfile?.role ?? "ADMIN";
  const userName: string = userProfile?.name || "Admin";

  const { headerTitle, roleLabel } = ROLE_META[role] ?? {
    headerTitle: "Trang quản lí",
    roleLabel: "Người dùng",
  };

  const menuItems = getMenuItemsByRole(role);
  const selectedKey = getSelectedKey(location.pathname);

  const userDropdownItems: MenuProps["items"] = [
    { key: "profile", icon: <UserOutlined />, label: "Hồ sơ cá nhân" },
    { key: "settings", icon: <SettingOutlined />, label: "Cài đặt" },
    { type: "divider" },
    { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất", danger: true },
  ];

  return (
    <Layout className="admin-layout">
      <Sider
        width={collapsed ? 80 : siderWidth}
        collapsedWidth={80}
        collapsed={collapsed}
        className="admin-sider"
      >
        <div className="admin-logo">
          <div className="logo-wrapper">
            <img src={Logo} alt="logo" />
          </div>
          {!collapsed && (
            <div className="logo-text">
              <span className="logo-title">Trang quản trị</span>
              <span className="logo-subtitle">{roleLabel}</span>
            </div>
          )}
        </div>

        <div className="sider-divider" />
        {!collapsed && <div className="nav-section-label">ĐIỀU HƯỚNG</div>}

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(KEY_TO_PATH[key])}
        />

        <div className="sider-footer">
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            {!collapsed && <span>Thu gọn</span>}
          </button>
        </div>

        {!collapsed && <div className="resize-handle" onMouseDown={handleMouseDown} />}
      </Sider>

      <Layout className="main-layout">
        <Header className="admin-header" style={{ background: colorBgContainer }}>
          <div className="header-left">
            <div className="header-page-info">
              <h1 className="header-title">{headerTitle}</h1>
              {breadcrumb.length > 0 && (
                <Breadcrumb
                  className="header-breadcrumb"
                  items={[{ title: <HomeOutlined /> }, ...breadcrumb]}
                />
              )}
            </div>
          </div>

          <div className="header-right">
            <Tooltip title="Thông báo">
              <Badge count={3} size="small">
                <button className="header-icon-btn">
                  <BellOutlined />
                </button>
              </Badge>
            </Tooltip>

            <Tooltip title="Cài đặt">
              <button className="header-icon-btn">
                <SettingOutlined />
              </button>
            </Tooltip>

            <div className="header-divider" />

            <Dropdown
              menu={{ items: userDropdownItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <div className="header-user">
                <Avatar className="user-avatar" size={34}>
                  {userName.charAt(0).toUpperCase()}
                </Avatar>
                <div className="user-info">
                  <span className="user-name">{userName}</span>
                  <span className="user-role">{roleLabel}</span>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="admin-content-wrapper">
          <div
            className="admin-content-box"
            style={{ background: colorBgContainer, borderRadius: borderRadiusLG }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;