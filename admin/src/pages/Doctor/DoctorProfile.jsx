import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false); //Boolean xác định trạng thái giao diện

  //Cập nhật hồ sơ
  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
      };
      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        updateData,
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message); //Cập nhật thành côngcông
        setIsEdit(false); //Tắt chế độ chỉnh sửa
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);
  //Chỉ render giao diện nếu profileData tồn tại
  return (
    profileData && (
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="sm:w-64 flex-shrink-0">
            <img
              className="w-full h-64 object-cover rounded-xl shadow border"
              src={profileData.image}
              alt={profileData.name}
            />
          </div>

          {/* Info Section */}
          <div className="flex-1 bg-white p-6 rounded-xl shadow border space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {profileData.name}
              </h2>
              <p className="text-gray-600">
                {profileData.degree} – {profileData.speciality}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {profileData.experience}
              </p>
            </div>

            {/* About */}
            <div>
              <p className="font-semibold text-gray-700">Giới thiệu:</p>
              <p className="text-gray-600 text-sm mt-1">{profileData.about}</p>
            </div>

            {/* Fee */}
            {/* Khi nhập, cập nhật profileData.fees bằng setProfileData, giữ nguyên các trường khác (...prev).
value={profileData.fees} đảm bảo input luôn phản ánh giá trị hiện tại. */}
            <div>
              <p className="font-semibold text-gray-700 mb-1">Phí khám:</p>
              {isEdit ? (
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-32"
                  value={profileData.fees}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      fees: e.target.value,
                    }))
                  }
                />
              ) : (
                <p>
                  {currency}{" "}
                  <span className="font-medium">{profileData.fees}</span>
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <p className="font-semibold text-gray-700 mb-1">Địa chỉ:</p>
              {isEdit ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-1"
                    value={profileData.address.line1}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                  />
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-1"
                    value={profileData.address.line2}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  {profileData.address.line1}
                  <br />
                  {profileData.address.line2}
                </p>
              )}
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={profileData.available}
                onChange={() =>
                  isEdit &&
                  setProfileData((prev) => ({
                    ...prev,
                    available: !prev.available,
                  }))
                }
              />
              <label className="text-sm text-gray-700">Đang nhận khám</label>
            </div>

            {/* Button */}
            <div>
              {isEdit ? (
                <button
                  onClick={updateProfile}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Lưu thay đổi
                </button>
              ) : (
                <button
                  onClick={() => setIsEdit(true)}
                  className="px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100 transition"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
