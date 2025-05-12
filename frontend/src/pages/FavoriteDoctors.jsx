// import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";

const FavoriteDoctors = () => {
  const { favoriteDoctors, backendUrl, token, getFavoriteDoctorsData } =
    useContext(AppContext);

  const navigate = useNavigate();

  const handleRemoveFavorite = async (doctorId) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/user/favorite-doctor/${doctorId}`,
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Đã bỏ yêu thích bác sĩ");
        getFavoriteDoctorsData(); // 🔥 Tải lại danh sách yêu thích
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const goToAppointment = (doctorId) => {
    navigate(`/appointment/${doctorId}`);
  };

  if (!favoriteDoctors.length) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Bạn chưa yêu thích bác sĩ nào.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {favoriteDoctors.map((doc) => (
        <div
          key={doc._id}
          className="bg-white rounded-2xl shadow hover:shadow-lg p-4 flex flex-col border transition-transform hover:-translate-y-1"
        >
          <div
            className="cursor-pointer"
            onClick={() => goToAppointment(doc._id)}
          >
            <img
              src={doc.image}
              alt={doc.name}
              className="w-full h-69 object-cover rounded-xl mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800">{doc.name}</h3>
            <p className="text-gray-600">{doc.speciality}</p>
            <p className="text-sm text-gray-400">{doc.experience}</p>
          </div>

          <button
            onClick={() => handleRemoveFavorite(doc._id)}
            className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
          >
            Xóa khỏi yêu thích
          </button>
        </div>
      ))}
    </div>
  );
};

export default FavoriteDoctors;
