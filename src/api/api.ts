import axiosInstance from "./axios";


// dùng chung
export const getProfile = async () => {
  const res = await axiosInstance.get("/user/profile");
  return res.data;
};

export const getLich = async () => {
  const res = await axiosInstance.get("/appointments");
  return res.data;
};

// user

export const taoTN = async (body: any) => {
  const res = await axiosInstance.post("/contacts/create", body);
  return res.data;
};

export const datLichHen = async (body: any) => {
  const res = await axiosInstance.post("/appointments/create", body);
  return res.data;
};


// profile update
const BASE_URL = process.env.REACT_APP_API_URL;

export const suaEmployess = async (
  id: any,
  body: {
    file?: File;
    fullName: string;
    phone: string;
    gender: string;
    date: string;
    address: string;
    cccd: string;
    pass: string;
  }
) => {
  const token = localStorage.getItem("access_token");
  const formData = new FormData();
  formData.append(
    "request",
    new Blob(
      [
        JSON.stringify({
          fullName: body.fullName,
          phone: body.phone,
          gender: body.gender,
          date: body.date,
          address: body.address,
          cccd: body.cccd,
          pass: body.pass,
        }),
      ],
      { type: "application/json" }
    )
  );
  if (body.file) {
    formData.append("img", body.file);
  }
  const res = await fetch(`${BASE_URL}/employees/upload/profile`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });
  return res.json();
};


export const suaCustomers = async (
  body: {
    file?: File;
    fullName: string;
    phone: string;
    date: string;
    address: string;
    pass: string;
  }
) => {
  const token = localStorage.getItem("access_token");
  const formData = new FormData();
  formData.append(
    "request",
    new Blob(
      [
        JSON.stringify({
          fullName: body.fullName,
          phone: body.phone,
          date: body.date,
          address: body.address,
          pass: body.pass,
        }),
      ],
      { type: "application/json" }
    )
  );
  if (body.file) {
    formData.append("img", body.file);
  }
  const res = await fetch(`${BASE_URL}/customers/update/profile`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });
  return res.json();
};

export const suaDoctor = async (
  body: {
    file?: File;
    fullName: string;
    phone: string;
    specialized: string;
    information: string;
    address: string;
    lever: string;
    pass: string;
  }
) => {
  const token = localStorage.getItem("access_token");
  const formData = new FormData();
  formData.append(
    "request",
    new Blob(
      [
        JSON.stringify({
          fullName: body.fullName,
          phone: body.phone,
          specialized: body.specialized,
          information: body.information,
          address: body.address,
          lever: body.lever,
          pass: body.pass,
        }),
      ],
      { type: "application/json" }
    )
  );
  if (body.file) {
    formData.append("img", body.file); 
  }
  const res = await fetch(`${BASE_URL}/doctor/upload-profile`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  return res.json();
};