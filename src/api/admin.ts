import axiosInstance from "./axios";
// crud bac si
export const getDoctor = async () => {
    const res = await axiosInstance.get("/doctor/getall");
    return res.data;
};
export const createDoctor = async (payload: {
    gmail: string;
    name: string;
    specialized: string;
}) => {
    const res = await axiosInstance.post("/doctor/create", payload);
    return res.data;
};
export const deleteDoctor = async (id: any) => {
    const res = await axiosInstance.post(`/doctor/delete/${id}`);
    return res.data;
};
// crud banner
const BASE_URL = process.env.REACT_APP_API_URL;

export interface PostPayload {
  title: string;
  content: string;
  status: "DRAFT" | "PUBLISHED";
  category: number;
}

export const createPost = async (data: PostPayload, img?: File | null) => {
  const token = localStorage.getItem("access_token");

  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );
  if (img) {
    formData.append("img", img);
  }

  const res = await fetch(`${BASE_URL}/posts/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return res.json();
};

export const updatePost = async (
  id: number | string,
  data: PostPayload,
  img?: File | null
) => {
  const token = localStorage.getItem("access_token");

  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );
  if (img) {
    formData.append("img", img);
  }

  const res = await fetch(`${BASE_URL}/posts/update/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return res.json();
};
export const deletePost = async (id: any) => {
    const res = await axiosInstance.post(`/posts/delete/${id}`);
    return res.data;
};
export const getPost = async () => {
    const res = await axiosInstance.get(`/posts/getall`);
    return res.data;
};
// crud nhan vien
export const getNhanVien = async () => {
    const res = await axiosInstance.get("/employees/getall");
    return res.data;
};
export const createNhanVien = async (payload: {
    gmail: string;
    name: string;
    gender: string;
}) => {
    const res = await axiosInstance.post("/employees/create", payload);
    return res.data;
};
export const deleteNhanVien = async (id: any) => {
    const res = await axiosInstance.post(`/employees/delete/${id}`);
    return res.data;
};
// tin nhắn 
export const getTinNhan = async () => {
    const res = await axiosInstance.get(`/contacts/list`);
    return res.data;
};
export const deleteTinNhan = async (id: any) => {
    const res = await axiosInstance.post(`/contacts/delete/${id}`);
    return res.data;
};


// dashboard

// biểu đồ cột
export const bieuDoCot = async () => {
    const res = await axiosInstance.get(`dashboard/monthly-stats`);
    return res.data;
};

// biểu đồ tròn
export const bieuDoTron = async () => {
    const res = await axiosInstance.get(`/dashboard/status-rate`);
    return res.data;
};

// phân bố độ tuổi
export const phanBoDoTuoi = async () => {
    const res = await axiosInstance.get(`/dashboard/age-distribution`);
    return res.data;
};

// thống kê tổng quan 
export const thongKeTQ = async () => {
    const res = await axiosInstance.get(`/dashboard/overview`);
    return res.data;
};
