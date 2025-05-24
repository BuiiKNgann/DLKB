import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";
import { MdClose } from "react-icons/md"; // Icon dấu X

const DoctorList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability, backendUrl } =
    useContext(AdminContext);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    speciality: "",
    addressLine1: "",
    addressLine2: "",
    fees: "",
    about: "",
    experience: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  const openEditModal = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.name || "",
      speciality: doctor.speciality || "",
      addressLine1: doctor.address?.line1 || "",
      addressLine2: doctor.address?.line2 || "",
      fees: doctor.fees || "",
      about: doctor.about || "",
      experience: doctor.experience || "",
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (doctor) => {
    setDoctorToDelete(doctor);
    setShowDeleteModal(true);
  };
  //Xử lý thay đổi dữ liệu biểu mẫu
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateDoctor = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/update-doctor-profile",
        // Body yêu cầu chứa:
        {
          doctorId: selectedDoctor._id,
          name: formData.name,
          speciality: formData.speciality,
          address: {
            line1: formData.addressLine1,
            line2: formData.addressLine2,
          },
          fees: formData.fees,
          about: formData.about,
          experience: formData.experience,
        },
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setShowEditModal(false);
        setSelectedDoctor(null);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleDeleteDoctor = async () => {
    if (!doctorToDelete) return;

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/admin/delete-doctor/${doctorToDelete._id}`,
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setShowDeleteModal(false);
      setDoctorToDelete(null);
    }
  };

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-semibold text-gray-700 mb-6">
        Danh sách Bác sĩ
      </h1>

      <div className="flex flex-wrap gap-5">
        {doctors.map((item, index) => (
          <div
            className="relative border border-indigo-200 rounded-xl w-56 h-[350px] overflow-hidden group hover:shadow-lg transition flex flex-col"
            key={index}
          >
            {/* Button X delete */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openDeleteModal(item);
              }}
              className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
            >
              <MdClose size={20} />
            </button>

            <img
              className="w-full h-45 object-cover bg-indigo-50 group-hover:bg-indigo-100 transition-all"
              src={item.image}
              alt=""
              onClick={() => openEditModal(item)}
            />

            <div className="p-4 flex-1 flex flex-col justify-between">
              <p className="text-gray-800 font-medium truncate">{item.name}</p>
              <p className="text-sm text-gray-500">{item.speciality}</p>

              <div
                className="mt-3 flex items-center gap-2 text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  onChange={() => changeAvailability(item._id)}
                  type="checkbox"
                  checked={item.available}
                  className="accent-indigo-500"
                />
                <p>Sẵn sàng tiếp nhận</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal chỉnh sửa bác sĩ */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[400px] space-y-4 shadow-lg">
            <h2 className="text-lg font-bold text-gray-700">
              Chỉnh sửa bác sĩ
            </h2>

            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
              {[
                { label: "Tên bác sĩ", name: "name", type: "text" },
                { label: "Chuyên khoa", name: "speciality", type: "text" },
                { label: "Địa chỉ dòng 1", name: "addressLine1", type: "text" },
                { label: "Địa chỉ dòng 2", name: "addressLine2", type: "text" },
                { label: "Phí khám", name: "fees", type: "number" },
                { label: "Giới thiệu", name: "about", type: "textarea" },
                { label: "Kinh nghiệm", name: "experience", type: "text" },
              ].map((field, idx) => (
                // field: Đối tượng chứa label, name, type
                <div key={idx} className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600">
                    {/* Hiển thị nhãn  */}
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    // Điều kiện render input hoặc textarea
                    <textarea
                      name={field.name}
                      value={formData[field.name]} //Liên kết giá trị với formData (ví dụ: formData.name là "Nguyễn Văn A").
                      onChange={handleInputChange}
                      placeholder={`Nhập ${field.label.toLowerCase()}`}
                      className="border p-2 rounded min-h-[80px]"
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      placeholder={`Nhập ${field.label.toLowerCase()}`}
                      className="border p-2 rounded"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedDoctor(null);
                }}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
              >
                Đóng
              </button>
              <button
                onClick={handleUpdateDoctor}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[350px] shadow-lg">
            <h2 className="text-lg font-bold text-gray-700 mb-4">
              Xác nhận xóa bác sĩ
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa bác sĩ{" "}
              <span className="font-semibold">{doctorToDelete?.name}</span>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false); //đóng modal
                  setDoctorToDelete(null);
                }}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteDoctor}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorList;
