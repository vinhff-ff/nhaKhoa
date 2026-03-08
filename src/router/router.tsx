import { lazy } from "react";
import {
  HomeOutlined,
  FileTextOutlined,
  IdcardOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import BaseUrl from "./path";
import MainLayout from "../components/layout/mainLayout";
import MainLayoutAdmin from "../admin/layout";

const HomePage = lazy(() => import("../page/TrangChu/index"));
const Login = lazy(() => import("../page/Login/index"));
const DetailsVe = lazy(() => import("../page/DetailsVe/index"));
const HomeAdmin = lazy(() => import("../admin/page/home"));
const QuanLiNhanVien = lazy(() => import("../admin/page/taiKhoanVaPhanQuyen"));
const AddAccount = lazy(() => import("../admin/page/addAcc"));
const Profile = lazy(() => import("../page/Profile/index"));
const QuanLiDonHang = lazy(() => import("../page/QuanLiDonHang/index"));
const MyTicket = lazy(() => import("../page/MyTicket/index"));
const MyCart = lazy(() => import("../page/Cart/index"));
export interface AppRoute {
  name: string;
  path: string;
  component: React.ComponentType<any>;
  layout?: React.ComponentType<any>;
  showInMenu?: boolean;
  private: boolean;
  icon?: React.ReactNode;
}
const routes = [
  {
    name: "Trang chủ",
    path: BaseUrl.Home,
    component: HomePage,
    layout: MainLayout,
    showInMenu: true,
    private: false,
  },
  {
    name: "Đơn hàng của tôi",
    path: BaseUrl.Oder,
    component: QuanLiDonHang,
    layout: MainLayout,
    showInMenu: true,
    private: false,
    icon: <FileTextOutlined />,
  },
  {
    name: "Giỏ hàng của tôi",
    path: BaseUrl.MyCart,
    component: MyCart,
    layout: MainLayout,
    showInMenu: true,
    private: false,
    icon: <ShoppingCartOutlined />,
  },
  {
    name: "Vé của tôi",
    path: BaseUrl.MyTicket,
    component: MyTicket,
    layout: MainLayout,
    showInMenu: true,
    private: false,
    icon: <IdcardOutlined />,
  },
  {
    name: "Chi tiết vé",
    path: BaseUrl.DetailVe,
    component: DetailsVe,
    layout: MainLayout,
    showInMenu: false,
    private: false,
    icon: null,
  },
  {
    name: null,
    path: BaseUrl.Profile,
    component: Profile,
    layout: MainLayout,
    showInMenu: false,
    private: false,
    icon: null,
  },
  {
    name: null,
    path: BaseUrl.Login,
    component: Login,
    layout: null,
    showInMenu: false,
    private: false,
    icon: null,
  },
  {
    name: null,
    path: BaseUrl.QuanLiNhanVien,
    component: QuanLiNhanVien,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: true,
    icon: null,
  },
  {
    name: null,
    path: BaseUrl.HomeAdmin,
    component: HomeAdmin,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: true,
    icon: null,
  },
  {
    name: null,
    path: BaseUrl.AddAccount,
    component: AddAccount,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: true,
    icon: null,
  },
];

export default routes;
