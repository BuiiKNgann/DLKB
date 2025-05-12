// // import React, { useContext, useEffect } from "react";
// // import { DoctorContext } from "../../context/DoctorContext";
// // import { AppContext } from "../../context/AppContext";
// // import { assets } from "../../assets/assets";

// // const DoctorAppointments = () => {
// //   const {
// //     dToken,
// //     appointments,
// //     getAppointments,
// //     completeAppointment,
// //     cancelAppointment,
// //   } = useContext(DoctorContext);
// //   const { calculateAge, slotDateFormat, currency } = useContext(AppContext);
// //   useEffect(() => {
// //     if (dToken) {
// //       getAppointments();
// //     }
// //   }, [dToken]);
// //   return (
// //     <div className="w-full max-w-6xl m-5">
// //       <p className="mb-3 text-lg font-medium">All Appointments</p>
// //       <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll ">
// //         <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b">
// //           <p>#</p>
// //           <p>Patient</p>
// //           <p>Payment</p>
// //           <p>Age</p>
// //           <p>Date & Time</p>
// //           <p>Fees</p>
// //           <p>Action</p>
// //         </div>
// //         {appointments.reverse().map((item, index) => (
// //           <div
// //             className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
// //             key={index}
// //           >
// //             <p className="max-sm:hidden">{index + 1}</p>
// //             <div className="flex items-center gap-2">
// //               <img
// //                 className="w-8 rounded-full"
// //                 src={item.userData.image}
// //                 alt=""
// //               />{" "}
// //               <p>{item.userData.name}</p>
// //             </div>
// //             <div>
// //               <p className="text-xs inline border border-primary px-2 py-2 rounded-full ">
// //                 {item.payment ? "online" : "tiền mặt"}
// //               </p>
// //             </div>
// //             <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
// //             <p>
// //               {slotDateFormat(item.slotDate)}, {item.slotTime}
// //             </p>
// //             <p>
// //               {currency} {item.amount}
// //             </p>
// //             {item.cancelled ? (
// //               <p className="text-red-400 text-xs font-medium">Cancelled</p>
// //             ) : item.isCompleted ? (
// //               <p className="text-green-500 text-xs font-medium">Complete</p>
// //             ) : (
// //               <div className="flex">
// //                 <img
// //                   onClick={() => cancelAppointment(item._id)}
// //                   className="w-10 cursor-pointer"
// //                   src={assets.cancel_icon}
// //                   alt=""
// //                 />
// //                 <img
// //                   onClick={() => completeAppointment(item._id)}
// //                   className="w-10 cursor-pointer"
// //                   src={assets.tick_icon}
// //                   alt=""
// //                 />
// //               </div>
// //             )}
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default DoctorAppointments;

import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [cancelReasons, setCancelReasons] = useState([]);
  const [customReason, setCustomReason] = useState("");

  const cancelOptions = [
    "Bận việc đột xuất",
    "Bệnh nhân không đủ điều kiện khám",
    "Bác sĩ gặp sự cố",
    "Lý do cá nhân khác", // Nếu chọn sẽ hiện thêm ô nhập custom reason
  ];

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  const handleConfirmCancel = () => {
    if (cancelReasons.length === 0) {
      alert("Vui lòng chọn ít nhất một lý do để hủy!");
      return;
    }

    // Nếu chọn "Lý do cá nhân khác" và có nhập customReason thì thêm vào
    let reasonsToSend = [...cancelReasons];
    if (
      reasonsToSend.includes("Lý do cá nhân khác") &&
      customReason.trim() !== ""
    ) {
      reasonsToSend = reasonsToSend.filter((r) => r !== "Lý do cá nhân khác"); // bỏ nhãn "Lý do cá nhân khác"
      reasonsToSend.push(customReason.trim()); // thay bằng lý do nhập tay
    }

    cancelAppointment(selectedAppointmentId, reasonsToSend);
    setShowCancelModal(false);
    setCancelReasons([]);
    setCustomReason("");
  };

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">Tất cả lịch hẹn</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b">
          <p>#</p>
          <p>Bệnh nhân</p>
          <p>Thanh toán</p>
          <p>Tuổi</p>
          <p>Ngày & Giờ</p>
          <p>Phí</p>
          <p>Thao tác</p>
        </div>

        {appointments
          .slice()
          .reverse()
          .map((item, index) => (
            <div
              className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
              key={index}
            >
              <p className="max-sm:hidden">{index + 1}</p>
              <div className="flex items-center gap-2">
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={item.userData.image}
                  alt=""
                />
                <p>{item.userData.name}</p>
              </div>
              <div>
                <p className="text-xs inline border border-primary px-2 py-1 rounded-full">
                  {item.payment ? "Online" : "Tiền mặt"}
                </p>
              </div>
              <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
              <p>
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </p>
              <p>
                {currency} {item.amount}
              </p>
              {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Đã hủy</p>
              ) : item.isCompleted ? (
                <p className="text-green-500 text-xs font-medium">
                  Đã hoàn thành
                </p>
              ) : (
                <div className="flex gap-2">
                  <img
                    onClick={() => {
                      setSelectedAppointmentId(item._id);
                      setShowCancelModal(true);
                    }}
                    className="w-8 cursor-pointer"
                    src={assets.cancel_icon}
                    alt="Hủy"
                  />
                  <img
                    onClick={() => completeAppointment(item._id)}
                    className="w-8 cursor-pointer"
                    src={assets.tick_icon}
                    alt="Hoàn thành"
                  />
                </div>
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

              {/* Nếu chọn "Lý do cá nhân khác" thì hiện thêm ô nhập lý do */}
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
                  setShowCancelModal(false);
                  setCancelReasons([]);
                  setCustomReason("");
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

export default DoctorAppointments;

// import React, { useContext, useEffect } from "react";
// import { DoctorContext } from "../../context/DoctorContext";
// import { AppContext } from "../../context/AppContext";
// import { assets } from "../../assets/assets";

// const DoctorAppointments = () => {
//   const {
//     dToken,
//     appointments,
//     getAppointments,
//     completeAppointment,
//     cancelAppointment,
//   } = useContext(DoctorContext);
//   const { calculateAge, slotDateFormat, currency } = useContext(AppContext);
//   useEffect(() => {
//     if (dToken) {
//       getAppointments();
//     }
//   }, [dToken]);
//   return (
//     <div className="w-full max-w-6xl m-5">
//       <p className="mb-3 text-lg font-medium">All Appointments</p>
//       <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll ">
//         <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b">
//           <p>#</p>
//           <p>Patient</p>
//           <p>Payment</p>
//           <p>Age</p>
//           <p>Date & Time</p>
//           <p>Fees</p>
//           <p>Action</p>
//         </div>
//         {appointments.reverse().map((item, index) => (
//           <div
//             className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
//             key={index}
//           >
//             <p className="max-sm:hidden">{index + 1}</p>
//             <div className="flex items-center gap-2">
//               <img
//                 className="w-8 rounded-full"
//                 src={item.userData.image}
//                 alt=""
//               />{" "}
//               <p>{item.userData.name}</p>
//             </div>
//             <div>
//               <p className="text-xs inline border border-primary px-2 py-2 rounded-full ">
//                 {item.payment ? "online" : "tiền mặt"}
//               </p>
//             </div>
//             <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
//             <p>
//               {slotDateFormat(item.slotDate)}, {item.slotTime}
//             </p>
//             <p>
//               {currency} {item.amount}
//             </p>
//             {item.cancelled ? (
//               <p className="text-red-400 text-xs font-medium">Cancelled</p>
//             ) : item.isCompleted ? (
//               <p className="text-green-500 text-xs font-medium">Complete</p>
//             ) : (
//               <div className="flex">
//                 <img
//                   onClick={() => cancelAppointment(item._id)}
//                   className="w-10 cursor-pointer"
//                   src={assets.cancel_icon}
//                   alt=""
//                 />
//                 <img
//                   onClick={() => completeAppointment(item._id)}
//                   className="w-10 cursor-pointer"
//                   src={assets.tick_icon}
//                   alt=""
//                 />
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DoctorAppointments;
