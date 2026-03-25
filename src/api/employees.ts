import axiosInstance from "./axios";
// view bác sĩ 
export const getDoctor = async () => {
    const res = await axiosInstance.get("/doctor/getall");
    return res.data;
};
// thêm lịch làm việc cho bác sĩ
export const addSchedule = async (body: any) => {
    const res = await axiosInstance.post("/schedules/create", body);
    return res.data;
};
// xem lịch trống của từng bác sĩ
export const seeEmptySchedule = async (body: any) => {
    const res = await axiosInstance.post("/schedules/available-slots", body);
    return res.data;
};
// xem lịch của tất cả bác sĩ
export const seeSchedule = async () => {
    const res = await axiosInstance.get("/schedules/getall");
    return res.data;
};
// xoá lịch cho bác sĩ
export const deleteSchedule = async (id: any) => {
    const res = await axiosInstance.post(`/schedules/delete/${id}`);
    return res.data;
};