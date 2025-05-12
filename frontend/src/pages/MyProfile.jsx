import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  //gửi dữ liệu dạng multipart/form-data
  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      image && formData.append("image", image);

      // Gửi request cập nhật đến backend
      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData(); //Gọi loadUserProfileData() để tải lại dữ liệu hồ sơ đã cập nhật.
        setIsEdit(false); //Tắt chế độ chỉnh sửa và xóa ảnh
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    userData && (
      <div className="max-w-sm bg-white rounded-lg shadow-md p-6 mx-auto">
        <div className="flex flex-col items-center mb-4">
          {/* Nếu isEdit === true: cho phép chỉnh sửa thông tin. */}
          {isEdit ? (
            <label htmlFor="image" className="mb-4">
              <div className="relative cursor-pointer">
                {/* Ảnh xem trước sẽ là URL.createObjectURL(image). */}
                <img
                  className="w-24 h-24 rounded-full bg-blue-50"
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt="Profile"
                />
                <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                  <img
                    className="w-5 h-5"
                    src={image ? "" : assets.upload_icon}
                    alt="Upload"
                  />
                </div>
              </div>
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                hidden
              />
            </label>
          ) : (
            <div className="mb-4">
              <img
                className="w-24 h-24 rounded-full bg-blue-50 mx-auto"
                src={userData.image}
                alt="Profile"
              />
            </div>
          )}

          {isEdit ? (
            <input
              className="text-xl font-medium text-center py-1 px-3 bg-gray-50 rounded border border-gray-200 w-full mb-2"
              type="text"
              value={userData.name}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          ) : (
            <h1 className="text-xl font-medium text-blue-600 text-center">
              {userData.name}
            </h1>
          )}
        </div>

        <hr className="my-4" />

        {/* Contact Information */}
        <div className="mb-5">
          <h2 className="text-sm font-medium text-blue-600 mb-3 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            THÔNG TIN LIÊN HỆ
          </h2>
          <div className="grid grid-cols-[100px_1fr] gap-y-3 text-sm">
            <p className="font-medium">Email:</p>
            <p className="text-blue-500">{userData.email}</p>

            <p className="font-medium">Điện thoại:</p>
            {isEdit ? (
              <input
                className="px-2 py-1 bg-gray-50 rounded border border-gray-200 w-full"
                type="text"
                value={userData.phone}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            ) : (
              <p className="text-blue-500">{userData.phone}</p>
            )}

            <p className="font-medium">Địa chỉ:</p>
            {isEdit ? (
              <div className="space-y-2">
                <input
                  className="w-full px-2 py-1 bg-gray-50 rounded border border-gray-200"
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                  value={userData.address.line1}
                  type="text"
                  placeholder="Dòng 1"
                />
                <input
                  className="w-full px-2 py-1 bg-gray-50 rounded border border-gray-200"
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                  value={userData.address.line2}
                  type="text"
                  placeholder="Dòng 2"
                />
              </div>
            ) : (
              <p className="text-gray-500">
                {userData.address.line1}
                <br />
                {userData.address.line2}
              </p>
            )}
          </div>
        </div>

        {/* Basic Information */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-blue-600 mb-3 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            THÔNG TIN CƠ BẢN
          </h2>
          <div className="grid grid-cols-[100px_1fr] gap-y-3 text-sm">
            <p className="font-medium">Giới tính:</p>
            {isEdit ? (
              <select
                className="px-2 py-1 bg-gray-50 rounded border border-gray-200"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, gender: e.target.value }))
                }
                value={userData.gender}
              >
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
              </select>
            ) : (
              <p className="text-gray-500">
                {userData.gender === "Male" ? "Nam" : "Nữ"}
              </p>
            )}

            <p className="font-medium">Ngày sinh:</p>
            {isEdit ? (
              <input
                className="px-2 py-1 bg-gray-50 rounded border border-gray-200"
                type="date"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, dob: e.target.value }))
                }
                value={userData.dob}
              />
            ) : (
              <p className="text-gray-500">{userData.dob || "Not Selected"}</p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          {isEdit ? (
            <button
              className="px-5 py-2 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-all flex items-center"
              onClick={updateUserProfileData}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Lưu thông tin
            </button>
          ) : (
            <button
              className="px-5 py-2 border border-blue-500 text-blue-500 font-medium rounded-full hover:bg-blue-500 hover:text-white transition-all flex items-center"
              onClick={() => setIsEdit(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default MyProfile;
