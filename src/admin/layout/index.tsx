import React, { useState, useEffect } from "react";
import {
  HomeOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  FileTextOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  PhoneOutlined,
  PictureOutlined,
  ScheduleOutlined,
  LineChartOutlined,
  ShoppingCartOutlined,
  SolutionOutlined,
  DollarOutlined,
  ProfileOutlined,
  CustomerServiceOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Avatar,
  Dropdown,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/logo.png";

const { Header, Content, Sider } = Layout;

type Role = "ADMIN" | "EMPLOYEE" | "CUSTOMER" | "DOCTOR";

interface RouteConfig {
  key: string;
  path: string;
  label: string;
  icon: React.ReactNode;
  roles: Role[];
}

const ALL_ROUTES: RouteConfig[] = [
  {
    key: "admin",
    path: "/admin",
    label: "Trang quản lí",
    icon: <HomeOutlined />,
    roles: ["ADMIN", 'DOCTOR', 'EMPLOYEE'],
  },
  // ─── ADMIN
  {
    key: "adminTrangChu",
    path: "/trang-chu-admin",
    label: "Thống kê",
    icon: <LineChartOutlined />,
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
    key: "adminCRUDnhanVien",
    path: "/crud-nhan-vien",
    label: "Quản lí nhân viên",
    icon: <TeamOutlined />,
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
    key: "lichdat",
    path: "/lich-dat",
    label: "Lịch đặt khám",
    icon: <ScheduleOutlined />,
    roles: ["ADMIN"],
  },

  // ─── EMPLOYEE 
  {
    key: "employeeTrangChu",
    path: "/phan-lich-bac-si",
    label: "Phân lịch cho bác sĩ",
    icon: <ScheduleOutlined />,
    roles: ["EMPLOYEE"],
  },

  // ─── CUSTOMER
  {
    key: "customerTrangChu",
    path: "/trang-chu-khach-hang",
    label: "Trang chủ",
    icon: <HomeOutlined />,
    roles: ["CUSTOMER"],
  },
  {
    key: "customerDatLich",
    path: "/khach-hang-dat-lich",
    label: "Đặt lịch khám",
    icon: <CalendarOutlined />,
    roles: ["CUSTOMER"],
  },
  {
    key: "customerLichSuKham",
    path: "/khach-hang-lich-su-kham",
    label: "Lịch sử khám bệnh",
    icon: <FileTextOutlined />,
    roles: ["CUSTOMER"],
  },
  {
    key: "customerHoSo",
    path: "/khach-hang-ho-so",
    label: "Hồ sơ sức khoẻ",
    icon: <ProfileOutlined />,
    roles: ["CUSTOMER"],
  },
  {
    key: "customerDonHang",
    path: "/khach-hang-don-hang",
    label: "Đơn hàng của tôi",
    icon: <ShoppingCartOutlined />,
    roles: ["CUSTOMER"],
  },
  {
    key: "customerHoTro",
    path: "/khach-hang-ho-tro",
    label: "Hỗ trợ",
    icon: <CustomerServiceOutlined />,
    roles: ["CUSTOMER"],
  },

  // ─── DOCTOR 
  {
    key: "doctorHome",
    path: "/bac-si-quan-li-lich",
    label: "Lịch làm việc",
    icon: <ScheduleOutlined />,
    roles: ["DOCTOR"],
  },
];

// ─── helpers 

const getMenuItemsByRole = (role: Role) =>
  ALL_ROUTES.filter((r) => r.roles.includes(role)).map((r) => ({
    key: r.key,
    icon: r.icon,
    label: r.label,
  }));

const KEY_TO_PATH = Object.fromEntries(
  ALL_ROUTES.map((r) => [r.key, r.path])
);

const getSelectedKey = (pathname: string): string => {
  const match = ALL_ROUTES.slice()
    .sort((a, b) => b.path.length - a.path.length)
    .find((r) => pathname.startsWith(r.path));
  return match?.key ?? "adminTrangChu";
};

const ROLE_META: Record<
  Role,
  { headerTitle: string; roleLabel: string; avatarColor: string }
> = {
  ADMIN: {
    headerTitle: "Admin Panel",
    roleLabel: "Quản trị viên",
    avatarColor: "#f5222d",
  },
  EMPLOYEE: {
    headerTitle: "Nhân viên",
    roleLabel: "Nhân viên",
    avatarColor: "#fa8c16",
  },
  CUSTOMER: {
    headerTitle: "Khách hàng",
    roleLabel: "Khách hàng",
    avatarColor: "#1677ff",
  },
  DOCTOR: {
    headerTitle: "Bác sĩ",
    roleLabel: "Bác sĩ",
    avatarColor: "#52c41a",
  },
};

// ─── component ───────────────────────────────────────────────────────────────

interface AdminLayoutProps {
  children: React.ReactNode;
  breadcrumb?: { title: string }[];
}

const ALLOWED_ROLES: Role[] = ["ADMIN", "EMPLOYEE", "DOCTOR"];

const AdminLayout = ({
  children,
  breadcrumb = [],
}: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ─── Guard: check token + role ───────────────────────────
  const token = localStorage.getItem("access_token");
  const userProfileRaw = localStorage.getItem("user_profile");

  useEffect(() => {
    if (!token || !userProfileRaw) {
      navigate("/", { replace: true });
      return;
    }
    try {
      const parsed = JSON.parse(userProfileRaw);
      if (!ALLOWED_ROLES.includes(parsed?.role)) {
        navigate("/", { replace: true });
      }
    } catch {
      navigate("/", { replace: true });
    }
  }, [location.pathname]);
  // ─────────────────────────────────────────────────────────

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

  const userProfile = JSON.parse(
    localStorage.getItem("user_profile") || "{}"
  );
  const role: Role = userProfile?.role ?? "ADMIN";
  const userName: string = userProfile?.name || "Admin";

  const { headerTitle, roleLabel, avatarColor } =
    ROLE_META[role] ?? ROLE_META["ADMIN"];

  const menuItems = getMenuItemsByRole(role);
  const selectedKey = getSelectedKey(location.pathname);

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_profile");
      navigate("/login", { replace: true });
    }
  };

  const userDropdownItems: MenuProps["items"] = [
    { key: "profile", icon: <UserOutlined />, label: "Hồ sơ cá nhân", onClick: () => navigate("/profile") },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
    },
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
        {!collapsed && (
          <div className="nav-section-label">ĐIỀU HƯỚNG</div>
        )}

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(KEY_TO_PATH[key])}
        />

        <div className="sider-footer">
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            {!collapsed && <span>Thu gọn</span>}
          </button>
        </div>

        {!collapsed && (
          <div className="resize-handle" onMouseDown={handleMouseDown} />
        )}
      </Sider>

      <Layout className="main-layout">
        <Header
          className="admin-header"
          style={{ background: colorBgContainer }}
        >
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
            <Dropdown
              menu={{ items: userDropdownItems, onClick: handleMenuClick }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <div className="header-user">
                <Avatar
                  className="user-avatar"
                  size={34}
                  style={{ backgroundColor: avatarColor }}
                >
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
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;