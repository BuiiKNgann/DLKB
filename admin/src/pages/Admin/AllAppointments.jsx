// import React, { useContext, useEffect } from "react";
// import { AdminContext } from "../../context/AdminContext";
// import { AppContext } from "../../context/AppContext";
// import { assets } from "../../assets/assets.js";
// const AllAppointments = () => {
//   const { aToken, appointments, getAllAppointments, cancelAppointment } =
//     useContext(AdminContext);
//   const { calculateAge, slotDateFormat, currency } = useContext(AppContext);
//   useEffect(() => {
//     getAllAppointments();
//   }, [aToken]);
//   return (
//     <div className="w-full max-w-6xl m-5 ">
//       <p className="mb-3 text-lg font-medium">Tất cả các cuộc hẹn</p>
//       <div className="bg-white border rounded text-sm max-h-[80px] min-h-[60vh] overflow-y-scroll">
//         <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
//           <p>#</p>
//           <p>Bệnh nhân</p>
//           <p>Tuổi</p>
//           <p>Ngày & Giờ</p>
//           <p>Bác sĩ</p>
//           <p>Phí Khám</p>
//           <p>Actions</p>
//         </div>
//         {appointments.map((item, index) => (
//           <div
//             className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
//             key={index}
//           >
//             <p className="max-sm:hidden">{index + 1}</p>
//             <div className="flex items-center gap-2">
//               <img
//                 className="w-8 rounded-full"
//                 src={item.userData.image}
//                 alt=""
//               />
//               <p>{item.userData.name}</p>
//             </div>
//             <p className="max-sm:hidden">{calculateAge(item.userData.dob)} </p>
//             <p>
//               {slotDateFormat(item.slotDate)}, {item.slotTime}
//             </p>
//             <div className="flex items-center gap-2">
//               <img
//                 className="w-8 rounded-full bg-gray-200"
//                 src={item.docData.image}
//                 alt=""
//               />
//               <p>{item.docData.name}</p>
//             </div>
//             <p>
//               {currency}
//               {item.amount}
//             </p>
//             {item.cancelled ? (
//               <p className="text-red-400 text-xs font-medium">Cancelled</p>
//             ) : item.isCompleted ? (
//               <p className="text-green-500 text-xs font-medium">Completed</p>
//             ) : (
//               <img
//                 onClick={() => cancelAppointment(item._id)}
//                 className="w-10 cursor-pointer"
//                 src={assets.cancel_icon}
//                 alt=""
//               />
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AllAppointments;

import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets.js";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [cancelReasons, setCancelReasons] = useState([]);
  const [otherReason, setOtherReason] = useState("");

  const cancelOptions = [
    "Bệnh nhân yêu cầu",
    "Bác sĩ không thể tiếp nhận",
    "Hệ thống lỗi",
    "Lý do khác",
  ];

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  const handleConfirmCancel = () => {
    if (cancelReasons.length === 0) {
      alert("Vui lòng chọn ít nhất một lý do!");
      return;
    }

    // Nếu chọn lý do khác và có nhập thêm nội dung

    //Ví dụ: Nếu cancelReasons = ["Bệnh nhân yêu cầu", "Lý do khác"] và otherReason = "Bệnh nhân bận", thì finalReasons = ["Bệnh nhân yêu cầu", "Bệnh nhân bận"].
    let finalReasons = [...cancelReasons];
    if (cancelReasons.includes("Lý do khác") && otherReason.trim()) {
      finalReasons = cancelReasons.filter((r) => r !== "Lý do khác");
      finalReasons.push(otherReason.trim());
    }

    cancelAppointment(selectedAppointmentId, finalReasons); // Gửi kèm lý do

    // Reset modal
    setShowCancelModal(false);
    setCancelReasons([]);
    setOtherReason("");
  };

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">Tất cả các cuộc hẹn</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b">
          <p>#</p>
          <p>Bệnh nhân</p>
          <p>Tuổi</p>
          <p>Ngày & Giờ</p>
          <p>Bác sĩ</p>
          <p>Phí Khám</p>
          <p>Hành động</p>
        </div>

        {appointments.map((item, index) => (
          <div
            key={index}
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full object-cover"
                src={item.userData.image}
                alt=""
              />
              <p>{item.userData.name}</p>
            </div>
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full object-cover bg-gray-200"
                src={item.docData.image}
                alt=""
              />
              <p>{item.docData.name}</p>
            </div>
            <p>
              {currency}
              {item.amount}
            </p>
            {item.cancelled ? (
              <p className="text-red-400 text-xs font-medium">Đã hủy</p>
            ) : item.isCompleted ? (
              <p className="text-green-500 text-xs font-medium">
                Đã hoàn thành
              </p>
            ) : (
              <img
                onClick={() => {
                  setSelectedAppointmentId(item._id);
                  setShowCancelModal(true);
                }}
                className="w-8 cursor-pointer"
                src={assets.cancel_icon}
                alt="Cancel"
              />
            )}
          </div>
        ))}
      </div>

      {/* Modal chọn lý do hủy lịch */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 animate-fade-in">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Chọn lý do hủy lịch
            </h2>

            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
              {cancelOptions.map((reason, idx) => (
                <label
                  key={idx}
                  className="flex gap-2 items-center text-gray-700"
                >
                  <input
                    type="checkbox"
                    value={reason}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCancelReasons([...cancelReasons, reason]);
                      } else {
                        setCancelReasons(
                          cancelReasons.filter((r) => r !== reason)
                        );
                      }
                    }}
                    checked={cancelReasons.includes(reason)}
                  />
                  {reason}
                </label>
              ))}
            </div>

            {/* Nếu chọn Lý do khác thì show ô nhập */}
            {cancelReasons.includes("Lý do khác") && (
              <div className="mt-4">
                <input
                  type="text"
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  placeholder="Nhập lý do khác..."
                  className="w-full border px-3 py-2 rounded-lg mt-2"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReasons([]);
                  setOtherReason("");
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

export default AllAppointments;
