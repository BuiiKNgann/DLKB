import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]); //Mảng lưu danh sách lịch hẹn của người dùng
  const [showCancelModal, setShowCancelModal] = useState(false); //Boolean xác định modal chọn lý do hủy có hiển thị hay không.
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null); //Lưu _id của lịch hẹn được chọn để hủy.
  const [cancelReasons, setCancelReasons] = useState([]); //Mảng lưu các lý do hủy được người dùng chọn từ danh sách tùy chọn.
  const [customReason, setCustomReason] = useState(""); //Chuỗi lưu lý do hủy tùy chỉnh

  const cancelOptionsUser = [
    "Tôi có việc bận đột xuất",
    "Tôi không thể đến địa điểm khám",
    "Tôi muốn đặt lại lịch khác",
    "Lý do cá nhân khác",
  ];

  const months = [
    " ",
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };
  //Lấy danh sách lịch hẹn (getUserAppointments)
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId, cancelReasons) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId, cancelReasons },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleConfirmCancel = () => {
    if (cancelReasons.length === 0) {
      // Nếu user không chọn lý do nào
      cancelAppointment(selectedAppointmentId, ["Người dùng tự hủy"]);
    } else {
      // Trường hợp có lý do: Sao chép cancelReasons vào reasonsToSend để tránh thay đổi trực tiếp trạng thái
      let reasonsToSend = [...cancelReasons];

      // Nếu reasonsToSend chứa "Lý do cá nhân khác" và customReason không rỗng (customReason.trim() !== ""):
      if (
        reasonsToSend.includes("Lý do cá nhân khác") &&
        customReason.trim() !== ""
      ) {
        //Loại bỏ "Lý do cá nhân khác" khỏi reasonsToSend.
        //Thêm customReason.trim() (xóa khoảng trắng thừa) vào reasonsToSend.
        reasonsToSend = reasonsToSend.filter((r) => r !== "Lý do cá nhân khác");
        reasonsToSend.push(customReason.trim());
      }
      cancelAppointment(selectedAppointmentId, reasonsToSend);
    }
    setShowCancelModal(false);
    setSelectedAppointmentId(null);
    setCancelReasons([]);
    setCustomReason("");
  };
  //Tự động gọi hàm
  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-indigo-800 border-b-2 border-indigo-200 pb-4 mb-6">
        Lịch khám của tôi
      </h2>
      <div className="space-y-6">
        {appointments.map((item, index) => (
          <div
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border-2 border-500"
            key={index}
          >
            <div className="flex flex-col sm:flex-row">
              {/* Hình ảnh bác sĩ */}
              <div className="w-full sm:w-1/4">
                <div className="relative h-48 sm:h-full">
                  <img
                    className="absolute inset-0 w-full h-full object-cover"
                    src={item.docData.image}
                    alt={item.docData.name}
                  />
                </div>
              </div>

              {/* Thông tin lịch khám */}
              <div className="w-full sm:w-3/4 p-4 sm:p-6 flex flex-col sm:flex-row">
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-indigo-900 mb-2">
                    {item.docData.name}
                  </h3>
                  <div className="inline-block px-3 py-1 mb-3 text-sm font-medium text-indigo-800 bg-indigo-100 rounded-full">
                    {item.docData.speciality}
                  </div>

                  <div className="space-y-3 text-gray-700">
                    <div>
                      <p className="font-semibold text-indigo-700">Địa chỉ:</p>
                      <p>{item.docData.address.line1}</p>
                      <p>{item.docData.address.line2}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-indigo-700">
                        Thời gian khám:
                      </p>
                      <p className="text-lg font-medium">
                        {slotDateFormat(item.slotDate)} | {item.slotTime}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nút tác vụ */}
                {/* Hiển thị nút "Hủy lịch khám" chỉ cho các lịch hẹn chưa bị hủy (!item.cancelled) và chưa hoàn thành (!item.isCompleted). */}
                <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col justify-center gap-3 sm:min-w-40">
                  {!item.cancelled && !item.isCompleted && (
                    <button
                      onClick={() => {
                        setSelectedAppointmentId(item._id);
                        setShowCancelModal(true);
                      }}
                      className="px-4 py-2 bg-white border border-red-500 text-red-500 font-medium rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300"
                    >
                      Hủy lịch khám
                    </button>
                  )}
                  {/* Hiển thị trạng thái "Đã hủy" */}
                  {item.cancelled && !item.isCompleted && (
                    <>
                      {/* Chỉ hiển thị thông báo nếu lý do hủy không phải chỉ là "Người dùng tự hủy" */}
                      {!(
                        item.cancelReason.length === 1 &&
                        item.cancelReason[0] === "Người dùng tự hủy"
                      ) && (
                        <div className="flex flex-col gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-600 font-medium rounded-lg text-center">
                          <p>Đã hủy lịch khám</p>
                          <div className="text-xs text-red-500 font-normal text-left">
                            <p className="font-semibold">Lý do hủy:</p>
                            <ul className="list-disc list-inside">
                              {/* Hiển thị lý do */}
                              {item.cancelReason.map((reason, idx) => (
                                <li key={idx}>{reason}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {item.isCompleted && (
                    <div className="px-4 py-2 bg-green-50 border border-green-200 text-green-600 font-medium rounded-lg text-center">
                      Hoàn thành
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {appointments.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-blue-500">
            <p className="text-gray-500 font-medium">
              Bạn chưa có lịch khám nào
            </p>
          </div>
        )}
      </div>

      {/* Modal chọn lý do hủy lịch */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 animate-fade-in">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Chọn lý do hủy lịch
            </h2>
            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
              {cancelOptionsUser.map((reason, idx) => (
                <label
                  key={idx}
                  className="flex gap-2 items-center text-gray-700"
                >
                  {/* Nếu checkbox được chọn (checked = true):
Thêm lý do vào mảng cancelReasons bằng cách sử dụng spread operator ([...cancelReasons, reason]). */}
                  <input
                    type="checkbox"
                    value={reason}
                    checked={cancelReasons.includes(reason)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCancelReasons([...cancelReasons, reason]);
                      } else {
                        setCancelReasons(
                          cancelReasons.filter((r) => r !== reason)
                        );
                      }
                    }}
                  />
                  {reason}
                </label>
              ))}
              {cancelReasons.includes("Lý do cá nhân khác") && (
                <input
                  type="text"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Nhập lý do khác..."
                  className="border p-2 rounded"
                />
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCancelModal(false); //Ẩn modal.
                  setSelectedAppointmentId(null); //Xóa ID lịch hẹn.
                  setCancelReasons([]); //Xóa danh sách lý do.
                  setCustomReason(""); //Xóa lý do tùy chỉnh.
                }}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-800"
              >
                Đóng
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
