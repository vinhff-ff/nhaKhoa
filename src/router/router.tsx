import { lazy } from "react";
import BaseUrl from "./path";
import MainLayout from "../components/layout/mainLayout";
import MainLayoutAdmin from "../admin/layout/index";

const HomePage = lazy(() => import("../page/TrangChu/index"));
const Login = lazy(() => import("../page/Login/index"));
const Doctor = lazy(() => import("../page/Doctor/index"));
const Profile = lazy(() => import("../page/Profile/index"));
const GioiThieu = lazy(() => import("../page/GioiThieu/index"));
const OrderKham = lazy(() => import("../page/OrderKham/index"));
const Contact = lazy(() => import("../page/Contact/index"));
const ThietBi = lazy(() => import("../page/ThietBiDetails/index"));
const MySche = lazy(() => import("../page/QuanLiLichDat/index"));

const AdminChung = lazy(() => import("../admin/layout/admin"));

const TrangChuAdmin = lazy(() => import("../admin/page/Admin/TrangChu"));
const CRUDBacSi = lazy(() => import("../admin/page/Admin/CRUDdoctor"));
const ContactInfor = lazy(() => import("../admin/page/Admin/ContactInfor"));
const BannerAdmin = lazy(() => import("../admin/page/Admin/BannerAdmin"));
const NhanVienAdmin = lazy(() => import("../admin/page/Admin/CRUDNhanVien"));
const LichDat = lazy(() => import("../admin/page/components/lichDat"));

const BacSiLich = lazy(() => import("../admin/page/ManBacSi/quanLiLich"));
const BacSiThongKe = lazy(() => import("../admin/page/ManBacSi/thongKe"));

const NVPLBS = lazy(() => import("../admin/page/ManNV/qlBacSi"));
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
  // user
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
    name: "Giới thiệu",
    path: BaseUrl.GioiThieu,
    component: GioiThieu,
    layout: MainLayout,
    showInMenu: true,
    private: false,
    icon: null,
  },
  {
    path: BaseUrl.OrderKham,
    component: OrderKham,
    layout: MainLayout,
    showInMenu: true,
    private: false,
  },
  {
    path: BaseUrl.Profile,
    component: Profile,
    layout: null,
    showInMenu: true,
    private: false,
  },
  {
    name: null,
    path: BaseUrl.ThietBi,
    component: ThietBi,
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
    path: BaseUrl.MySche,
    component: MySche,
    layout: MainLayout,
    showInMenu: false,
    private: false,
    icon: null,
  },







  // admin
  {
    name: null,
    path: BaseUrl.AdminChung,
    component: AdminChung,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: false,
    icon: null,
  },

  {
    name: null,
    path: BaseUrl.TrangChuAdmin,
    component: TrangChuAdmin,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: false,
    icon: null,
  },
  {
    name: null,
    path: BaseUrl.CRUDBacSi,
    component: CRUDBacSi,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: false,
    icon: null,
  },
  {
    name: null,
    path: BaseUrl.ContactInfor,
    component: ContactInfor,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: false,
    icon: null,
  },
  {
    name: null,
    path: BaseUrl.BannerAdmin,
    component: BannerAdmin,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: false,
    icon: null,
  },
  {
    name: null,
    path: BaseUrl.NhanVienAdmin,
    component: NhanVienAdmin,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: false,
    icon: null,
  },
  {
    name: null,
    path: BaseUrl.LichDat,
    component: LichDat,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: false,
    icon: null,
  },





  {
    name: null,
    path: BaseUrl.BacSiLich,
    component: BacSiLich,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: false,
    icon: null,
  },
  {
    name: null,
    path: BaseUrl.BacSiThongKe,
    component: BacSiThongKe,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: false,
    icon: null,
  },




   {
    name: null,
    path: BaseUrl.NVPLBS,
    component: NVPLBS,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: false,
    icon: null,
  },
];

export default routes;
