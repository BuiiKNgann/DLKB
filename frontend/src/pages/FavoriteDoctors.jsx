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
        getFavoriteDoctorsData(); // Tải lại danh sách yêu thích
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
      <div className="text-center py-12">
        <p className="text-gray-500 text-sm">Bạn chưa yêu thích bác sĩ nào.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {favoriteDoctors.map((doc) => (
        <div
          key={doc._id}
          className="bg-white rounded-xl shadow hover:shadow-md p-3 flex flex-col border transition-transform hover:-translate-y-0.5"
        >
          <div
            className="cursor-pointer"
            onClick={() => goToAppointment(doc._id)}
          >
            <img
              src={doc.image}
              alt={doc.name}
              className="w-full h-21 object-cover rounded-lg mb-3"
            />
            <h3 className="text-base font-semibold text-gray-800">
              {doc.name}
            </h3>
            <p className="text-gray-600 text-sm">{doc.speciality}</p>
            <p className="text-xs text-gray-400">{doc.experience}</p>
          </div>

          <button
            onClick={() => handleRemoveFavorite(doc._id)}
            className="mt-3 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition-all"
          >
            Xóa khỏi yêu thích
          </button>
        </div>
      ))}
    </div>
  );
};

export default FavoriteDoctors;
