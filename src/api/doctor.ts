import axiosInstance from "./axios";
const BASE_URL = process.env.REACT_APP_API_URL;
export const getAppointments = async () => {
  const res = await axiosInstance.get("/appointments/my-appointments");
  return res.data;
};

export const updateAppointments = async (id: any, body: { file?: File; status: string }) => {
  const token = localStorage.getItem('access_token');

  const formData = new FormData();

  if (body.file) {
    formData.append("file", body.file);
  }

  formData.append(
    "request",
    new Blob([JSON.stringify({ status: body.status })], { type: "application/json" })
  );

  await fetch(`${BASE_URL}/appointments/update/status/${id}`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });
};

export const getSchedule = async () => {
  const res = await axiosInstance.get("/schedules/today");
  return res.data;
};