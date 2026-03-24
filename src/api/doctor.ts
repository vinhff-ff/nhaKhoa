import axiosInstance from "./axios";

export const getAppointments = async () => {
    const res = await axiosInstance.get("/appointments/my-appointments");
    return res.data;
};
export const updateAppointments = async (id: any, body: any) => {
    const res = await axiosInstance.post(`/appointments/update/status/${id}`, body);
    return res.data;
};

export const getSchedule = async () => {
    const res = await axiosInstance.get("/schedules/today");
    return res.data;
};