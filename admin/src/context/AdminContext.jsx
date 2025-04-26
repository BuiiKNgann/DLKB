import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  // Lấy token từ localStorage nếu có, để giữ đăng nhập khi reload trang.

  // Nếu không có token thì gán aToken bằng chuỗi rỗng "".

  // setAToken dùng để cập nhật token khi admin đăng nhập hoặc đăng xuất.
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dashData, setDashData] = useState(false);
  // Dùng axios.post() để gửi POST request đến backend tại endpoint /api/admin/all-doctors.
  // Tham số thứ nhất: đường dẫn API.
  //Tham số thứ hai: body rỗng ({}), vì không gửi dữ liệu nào.
  //Tham số thứ ba: headers, bao gồm aToken – có thể là token xác thực người dùng (JWT chẳng hạn).
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/all-doctors",
        {},
        { headers: { aToken } }
      );
      if (data.success) {
        setDoctors(data.doctors);
        console.log(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { docId }, //ID bác sĩ cần cập nhật.
        { headers: { aToken } } //token xác thực admin.
      );
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/appointments", {
        headers: { aToken },
      });
      if (data.success) {
        setAppointments(data.appointments);
        console.log(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/cancel-appointment",
        { appointmentId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/dashboard", {
        headers: { aToken },
      });
      if (data) {
        setDashData(data.dashData);
        console.log(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    dashData,
    getDashData,
  };
  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
