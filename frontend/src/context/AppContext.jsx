import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );

  const [userData, setUserData] = useState(false);
  const [favoriteDoctors, setFavoriteDoctors] = useState([]);

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const loadUserProfileData = async () => {
    try {
      //headers là phần thông tin đi kèm khi bạn gửi request (gọi API) đến server.
      //Tôi là người dùng có token là abc123, cho tôi xem hồ sơ cá nhân
      //Request gửi đi sẽ có headers như sau: GET /api/user/get-profile HTTP/1.1 .,Host: example.com,token: abc123
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { token }, //gửi token trong phần header để xác thực người dùng
      });
      if (data.success) {
        //cập nhật dữ liệu hồ sơ người dùng vào state
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getFavoriteDoctorsData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/user/favorite-doctors",
        { headers: { token } }
      );
      if (data.success) {
        setFavoriteDoctors(data.favoriteDoctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // ⭐ Hàm tính điểm trung bình của bác sĩ
  const getDoctorAverageRating = (doctor) => {
    if (!doctor || typeof doctor.averageRating !== "number") {
      return "0.0"; // Nếu không có rating thì trả về 0.0
    }
    return doctor.averageRating.toFixed(1);
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
      getFavoriteDoctorsData();
    } else {
      setUserData(false);
      setFavoriteDoctors([]);
    }
  }, [token]);

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    favoriteDoctors,
    setFavoriteDoctors,
    getFavoriteDoctorsData,
    getDoctorAverageRating, // ✅ Đưa hàm này vào context luôn
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
