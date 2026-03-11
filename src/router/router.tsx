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
const Doctor = lazy(() => import("../page/Doctor/index"));
const HomeAdmin = lazy(() => import("../admin/page/home"));
const QuanLiNhanVien = lazy(() => import("../admin/page/taiKhoanVaPhanQuyen"));
const AddAccount = lazy(() => import("../admin/page/addAcc"));
const Profile = lazy(() => import("../page/Profile/index"));
const GioiThieu = lazy(() => import("../page/GioiThieu/index"));
const OrderKham = lazy(() => import("../page/OrderKham/index"));
const Contact = lazy(() => import("../page/Contact/index"));
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
    name: "Bác sĩ",
    path: BaseUrl.Doctor,
    component: Doctor,
    layout: MainLayout,
    showInMenu: true,
    private: false,
    icon: null,
  },
  {
    name: "Liên hệ",
    path: BaseUrl.Contact,
    component: Contact,
    layout: MainLayout,
    showInMenu: true,
    private: false,
  },
  {
    path: BaseUrl.OrderKham,
    component: OrderKham,
    layout: MainLayout,
    showInMenu: true,
    private: false,
  },
  {
    name: "Giới thiệu",
    path: BaseUrl.GioiThieu,
    component: GioiThieu,
    layout: MainLayout,
    showInMenu: true,
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
