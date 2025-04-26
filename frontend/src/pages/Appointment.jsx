// import React, { useContext, useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { AppContext } from "../context/AppContext";
// import { assets } from "../assets/assets";
// import RelatedDoctors from "../components/RelatedDoctors";
// import { toast } from "react-toastify";
// import axios from "axios";
// // import doctorModel from "../../../backend/models/doctorModel";
// // import userModel from "../../../backend/models/userModels";
// // import appointmentModel from "../../../backend/models/appointmentModel";
// const Appointment = () => {
//   const { docId } = useParams();
//   const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
//     useContext(AppContext);
//   const daysOfWeek = [
//     "Chủ nhật",
//     "Thứ 2",
//     "Thứ 3",
//     "Thứ 4",
//     "Thứ 5",
//     "Thứ 6",
//     "Thứ 7",
//   ];
//   const navigate = useNavigate();

//   const [docInfo, setDocInfo] = useState(null);
//   const [docSlots, setDocSlots] = useState([]);
//   const [slotIndex, setSlotIndex] = useState(0);
//   const [slotTime, setSlotTime] = useState("");
//   const fetchDocInfo = async () => {
//     const docInfo = doctors.find((doc) => doc._id === docId);
//     setDocInfo(docInfo);
//   };

//   const getAvailableSlots = async () => {
//     setDocSlots([]);

//     // getting current date
//     let today = new Date();
//     for (let i = 0; i < 7; i++) {
//       let currentDate = new Date(today);
//       currentDate.setDate(today.getDate() + i);

//       // setting end time of the date with index
//       let endTime = new Date();
//       endTime.setDate(today.getDate() + i);
//       endTime.setHours(21, 0, 0, 0);

//       // setting hours
//       if (today.getDate() === currentDate.getDate()) {
//         // Nếu là hôm nay
//         currentDate.setHours(
//           currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
//         );
//         currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
//       } else {
//         currentDate.setHours(10);
//         currentDate.setMinutes(0);
//       }
//       let timeSlots = [];

//       while (currentDate < endTime) {
//         let formattedTime = currentDate.toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         });
//         let day = currentDate.getDate();
//         let month = currentDate.getMonth() + 1;
//         let year = currentDate.getFullYear();

//         const slotDate = day + "_" + month + "_" + year;
//         const slotTime = formattedTime;

//         // Check if docInfo and docInfo.slots_booked are available
//         const isSlotAvailable =
//           docInfo &&
//           docInfo.slots_booked &&
//           docInfo.slots_booked[slotDate] &&
//           docInfo.slots_booked[slotDate].includes(slotTime)
//             ? false
//             : true;

//         if (isSlotAvailable) {
//           // add slot to array
//           timeSlots.push({
//             datetime: new Date(currentDate),
//             time: formattedTime,
//           });
//         }

//         currentDate.setMinutes(currentDate.getMinutes() + 30);
//       }
//       setDocSlots((prev) => [...prev, timeSlots]);
//     }
//   };
//   const bookAppointment = async () => {
//     if (!token) {
//       toast.warn("Login to book appointment");
//       return navigate("/login");
//     }
//     try {
//       //docSlots: Đây là một mảng chứa thông tin các slot (thời gian rảnh của bác sĩ).
//       // slotIndex: Đây là chỉ số (index) mà người dùng đã chọn để lấy một slot cụ thể.
//       const date = docSlots[slotIndex][0].datetime;
//       let day = date.getDate();
//       let month = date.getMonth() + 1;
//       let year = date.getFullYear();

//       const slotDate = day + "_" + month + "_" + year;

//       const { data } = await axios.post(
//         backendUrl + "/api/user/book-appointment",
//         { docId, slotDate, slotTime }, // Dữ liệu gửi lên server
//         { headers: { token } }
//       );
//       if (data.success) {
//         toast.success(data.message);
//         getDoctorsData(navigate("/my-appointments"));
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     fetchDocInfo();
//   }, [doctors, docId]);

//   useEffect(() => {
//     getAvailableSlots();
//   }, [docInfo]);

//   useEffect(() => {
//     console.log(docSlots);
//   }, [docSlots]);
//   return (
//     docInfo && (
//       <div>
//         {/* -----------Doctor Details--------- */}
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div>
//             <img
//               className="bg-seconds w-full sm:max-w-72 rounded-lg"
//               src={docInfo.image}
//               alt=""
//             />
//           </div>
//           <div className="flex-1 border border-gray-400 roundedlg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
//             {/* --------Doc Info: name, degree, experience --------- */}
//             <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
//               {docInfo.name}
//               <img className="w-5" src={assets.verified_icon} alt="" />
//             </p>
//             <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
//               <p>
//                 {docInfo.degree} - {docInfo.speciality}
//               </p>
//               <button className="py-0.5 px-2 border text-cs rounded-full">
//                 {docInfo.experience}
//               </button>
//             </div>
//             {/* ----------Doctor About ---------- */}
//             <div>
//               <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3 ">
//                 Về bác sĩ <img src={assets.info_icon} alt="" />
//               </p>
//               <p className="text-sm text-gray-500 max-w-[700px] mt-1">
//                 {docInfo.about}
//               </p>
//             </div>
//             <p className="text-gray-500 font-medium mt-4">
//               Phí khám bệnh:{" "}
//               <span className="text-gray-600">
//                 {currencySymbol}
//                 {docInfo.fees}
//               </span>
//             </p>
//           </div>
//         </div>
//         {/* ------Booking slots-------- */}
//         <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700 ">
//           <p>Lịch trống</p>
//           <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
//             {docSlots.length &&
//               docSlots.map((item, index) => (
//                 <div
//                   onClick={() => setSlotIndex(index)}
//                   className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
//                     slotIndex === index
//                       ? "bg-seconds text-white"
//                       : "border border-gray-200"
//                   }`}
//                   key={index}
//                 >
//                   <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
//                   <p>{item[0] && item[0].datetime.getDate()}</p>
//                 </div>
//               ))}
//           </div>
//           <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
//             {docSlots.length &&
//               docSlots[slotIndex].map((item, index) => (
//                 <p
//                   onClick={() => setSlotTime(item.time)}
//                   className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
//                     item.time === slotTime
//                       ? "bg-seconds text-white"
//                       : "text-gray-400 border border-gray-300 "
//                   }`}
//                   key={index}
//                 >
//                   {item.time.toLowerCase()}
//                 </p>
//               ))}
//           </div>
//           <button
//             onClick={bookAppointment}
//             className="bg-seconds text-white text-sm font-light px-14 py-3 rounded-full my-6"
//           >
//             Đặt lịch khám
//           </button>
//         </div>
//         {/* Listing Related Doctor  */}
//         <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
//       </div>
//     )
//   );
// };

// export default Appointment;
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(AppContext);
  const daysOfWeek = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];
  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlots = async () => {
    setDocSlots([]);

    // getting current date
    let today = new Date();
    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // setting end time of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // setting hours
      if (today.getDate() === currentDate.getDate()) {
        // Nếu là hôm nay
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }
      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = day + "_" + month + "_" + year;
        const slotTime = formattedTime;

        // Check if docInfo and docInfo.slots_booked are available
        const isSlotAvailable =
          docInfo &&
          docInfo.slots_booked &&
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;

        if (isSlotAvailable) {
          // add slot to array
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }
    try {
      const date = docSlots[slotIndex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getDoctorsData(navigate("/my-appointments"));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    console.log(docSlots);
  }, [docSlots]);

  return (
    docInfo && (
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Doctor Details Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-10 border-2 border-gray-200">
          <div className="flex flex-col md:flex-row">
            {/* Doctor Image with hover effect */}
            <div className="md:w-1/3 lg:w-1/4">
              <div
                className="relative h-72 md:h-full cursor-pointer overflow-hidden"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div
                  className={`absolute inset-0 bg-seconds transition-opacity duration-300 ${
                    isHovering ? "opacity-20" : "opacity-0"
                  }`}
                ></div>
                <img
                  className="w-full h-full object-cover object-center transition-transform duration-300 ease-in-out"
                  src={docInfo.image}
                  alt={`Dr. ${docInfo.name}`}
                  style={{ transform: isHovering ? "scale(1.05)" : "scale(1)" }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/70 to-transparent p-4 md:hidden">
                  <h2 className="text-white text-xl font-bold flex items-center">
                    {docInfo.name}
                    <img
                      className="w-5 ml-2"
                      src={assets.verified_icon}
                      alt="Verified"
                    />
                  </h2>
                </div>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="flex-1 p-6 md:p-8 flex flex-col border-t md:border-t-0 md:border-l border-gray-200">
              <div className="hidden md:block">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  {docInfo.name}
                  <img
                    className="w-5 ml-2"
                    src={assets.verified_icon}
                    alt="Verified"
                  />
                </h2>
                <div className="flex items-center mt-2 text-gray-600">
                  <span className="font-medium">{docInfo.degree}</span>
                  <span className="mx-2">•</span>
                  <span>{docInfo.speciality}</span>
                  <span className="ml-3 px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100">
                    {docInfo.experience}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="flex items-center font-semibold text-gray-800">
                  Về bác sĩ
                  <img className="w-4 ml-1" src={assets.info_icon} alt="Info" />
                </h3>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  {docInfo.about}
                </p>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-500">Phí khám bệnh</span>
                    <p className="text-xl font-bold text-blue-700">
                      {currencySymbol}
                      {docInfo.fees}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Booking Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Đặt lịch khám
          </h3>

          {/* Date Selection */}
          <div className="mb-8">
            <h4 className="text-gray-800 font-medium mb-4">Chọn ngày</h4>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {docSlots.length > 0 &&
                docSlots.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setSlotIndex(index)}
                    className={`flex flex-col items-center justify-center min-w-20 py-4 px-2 rounded-lg cursor-pointer transition-all ${
                      slotIndex === index
                        ? "bg-seconds text-white shadow-md border-2 border-seconds"
                        : "border-2 border-gray-200 hover:border-seconds"
                    }`}
                  >
                    {item[0] && (
                      <>
                        <p className="text-sm font-medium mb-1">
                          {daysOfWeek[item[0].datetime.getDay()]}
                        </p>
                        <p className="text-xl font-bold">
                          {item[0].datetime.getDate()}
                        </p>
                      </>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Time Selection */}
          <div className="mb-8">
            <h4 className="text-gray-800 font-medium mb-4">Chọn thời gian</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {docSlots.length > 0 &&
                docSlots[slotIndex].map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSlotTime(item.time)}
                    className={`py-3 px-2 text-center rounded-lg transition-all ${
                      item.time === slotTime
                        ? "bg-seconds text-white shadow-md border-2 border-seconds"
                        : "border-2 border-gray-200 text-gray-600 hover:border-seconds"
                    }`}
                  >
                    {item.time.toLowerCase()}
                  </button>
                ))}
            </div>
          </div>

          {/* Booking Button */}
          <div className="text-center md:text-left">
            <button
              onClick={bookAppointment}
              disabled={!slotTime}
              className={`px-8 py-3 rounded-lg font-medium text-white transition-all border-2 ${
                slotTime
                  ? "bg-seconds hover:bg-opacity-90 border-seconds shadow-md"
                  : "bg-gray-400 border-gray-400 cursor-not-allowed"
              }`}
            >
              Đặt lịch khám
            </button>
          </div>
        </div>

        {/* Related Doctors Section */}
        <div className="mt-10">
          <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
        </div>
      </div>
    )
  );
};

export default Appointment;
