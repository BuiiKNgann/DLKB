// import React, { useEffect, useState, useContext } from "react";
// import { AppContext } from "../context/AppContext";
// import { useNavigate, useParams } from "react-router-dom";
// const Doctors = () => {
//   const { speciality } = useParams();
//   const [filterDoc, setFilterDoc] = useState([]);
//   const [showFilter, setShowFilter] = useState(false);
//   const navigate = useNavigate();
//   const { doctors } = useContext(AppContext);

//   const applyFilter = () => {
//     if (speciality) {
//       setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
//     } else {
//       setFilterDoc(doctors);
//     }
//   };
//   useEffect(() => {
//     applyFilter();
//   }, [doctors, speciality]);

//   return (
//     <div>
//       <p className="text-gray-600">Khám phá các bác sĩ theo chuyên khoa.</p>
//       <div className="flex flex-col sm:flex-row items-start gap-5 mt-5 ">
//         <button
//           className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
//             showFilter ? "bg-seconds text-white" : ""
//           }`}
//           //prev là giá trị hiện tại của biến showFilter
//           //setShowFilter là hàm dùng để cập nhật lại giá trị của showFilter.
//           onClick={() => setShowFilter((prev) => !prev)}
//         >
//           Filters
//         </button>
//         <div
//           // flex-flex-col gap-4 text-sm text-gray-600
//           className={`flex-col gap-4 text-sm text-gray-600 ${
//             showFilter ? "flex" : "hidden sm:flex"
//           }`}
//         >
//           {/* Nếu đang chọn chuyên khoa đó → điều hướng /doctors để bỏ lọc. */}
//           <p
//             onClick={() =>
//               speciality === "Bác sĩ đa khoa"
//                 ? navigate("/doctors")
//                 : navigate("/doctors/Bác sĩ đa khoa")
//             }
//             //whitespace-nowrap: không cho xuống dòng
//             className={`inline-block whitespace-nowrap pl-12 py-1.5 pr-12 border border-gray-300 rounded transition-all cursor-pointer ${
//               speciality === "Bác sĩ đa khoa" ? "bg-indigo-100 text-black" : ""
//             } `}
//           >
//             Bác sĩ đa khoa
//           </p>
//           <p
//             onClick={() =>
//               speciality === "Bác sĩ phụ khoa"
//                 ? navigate("/doctors")
//                 : navigate("/doctors/Bác sĩ phụ khoa")
//             }
//             className={`inline-block whitespace-nowrap pl-12 py-1.5 pr-12 border border-gray-300 rounded transition-all cursor-pointer ${
//               speciality === "Bác sĩ phụ khoa" ? "bg-indigo-100 text-black" : ""
//             } `}
//           >
//             Bác sĩ phụ khoa
//           </p>
//           <p
//             onClick={() =>
//               speciality === "Bác sĩ da liễu"
//                 ? navigate("/doctors")
//                 : navigate("/doctors/Bác sĩ da liễu")
//             }
//             className={`inline-block whitespace-nowrap pl-12 py-1.5 pr-12 border border-gray-300 rounded transition-all cursor-pointer ${
//               speciality === "Bác sĩ da liễu" ? "bg-indigo-100 text-black" : ""
//             } `}
//           >
//             Bác sĩ da liễu
//           </p>
//           <p
//             onClick={() =>
//               speciality === "Bác sĩ nhi khoa"
//                 ? navigate("/doctors")
//                 : navigate("/doctors/Bác sĩ nhi khoa")
//             }
//             className={`inline-block whitespace-nowrap pl-12 py-1.5 pr-12 border border-gray-300 rounded transition-all cursor-pointer ${
//               speciality === "Bác sĩ nhi khoa" ? "bg-indigo-100 text-black" : ""
//             } `}
//           >
//             Bác sĩ nhi khoa
//           </p>
//           <p
//             onClick={() =>
//               speciality === "Bác sĩ thần kinh"
//                 ? navigate("/doctors")
//                 : navigate("/doctors/Bác sĩ thần kinh")
//             }
//             className={`  inline-block whitespace-nowrap pl-12 py-1.5 pr-12 border border-gray-300 rounded transition-all cursor-pointer ${
//               speciality === "Bác sĩ thần kinh"
//                 ? "bg-indigo-100 text-black"
//                 : ""
//             } `}
//           >
//             Bác sĩ thần kinh
//           </p>
//           <p
//             onClick={() =>
//               speciality === "Bác sĩ tiêu hóa"
//                 ? navigate("/doctors")
//                 : navigate("/doctors/Bác sĩ tiêu hóa")
//             }
//             className={`inline-block whitespace-nowrap pl-12 py-1.5 pr-12 border border-gray-300 rounded transition-all cursor-pointer${
//               speciality === "Bác sĩ tiêu hóa" ? "bg-indigo-100 text-black" : ""
//             } `}
//           >
//             Bác sĩ tiêu hóa
//           </p>
//         </div>
//         <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
//           {/* overflow-hidden: cắt nội dung bị tràn */}
//           {filterDoc.map((item, index) => (
//             <div
//               onClick={() => navigate(`/appointment/${item._id}`)}
//               className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
//               key={index}
//             >
//               <img className="bg-blue-50" src={item.image} alt="" />
//               <div className="p-4">
//                 <div
//                   className={`flex items-center gap-2 text-sm text-center ${
//                     item.available ? "text-green-500" : "text-gray-500"
//                   } `}
//                 >
//                   <p
//                     className={`w-2 h-2 ${
//                       item.available ? "bg-green-500" : "bg-gray-500"
//                     }  rounded-full`}
//                   ></p>
//                   <p>
//                     {item.available ? "Sẵn sàng tiếp nhận" : "Không tiếp nhận"}
//                   </p>
//                 </div>
//                 <p className="text-gray-900 text-lg font-medium">{item.name}</p>
//                 <p className="text-gray-600 text-sm">{item.speciality}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Doctors;
import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const { doctors, getDoctorAverageRating } = useContext(AppContext);

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div>
      <p className="text-gray-600">Khám phá các bác sĩ theo chuyên khoa.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        {/* Filter button (mobile) */}
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-seconds text-white" : ""
          }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>

        {/* Filters */}
        <div
          className={`flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}
        >
          {[
            "Tổng quát",
            "Sản phụ khoa",
            "Da liễu",
            "Nhi khoa",
            "Thần kinh",
            "Tiêu hóa",
          ].map((spec) => (
            <p
              key={spec}
              onClick={() =>
                speciality === spec
                  ? navigate("/doctors")
                  : navigate(`/doctors/${spec}`)
              }
              className={`inline-block whitespace-nowrap pl-12 py-1.5 pr-12 border border-gray-300 rounded transition-all cursor-pointer ${
                speciality === spec ? "bg-indigo-100 text-black" : ""
              }`}
            >
              {spec}
            </p>
          ))}
        </div>

        {/* Doctors list */}
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {filterDoc.map((item, index) => (
            <div
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500"
              key={index}
            >
              <img
                className="bg-blue-50 w-full h-48 object-cover"
                src={item.image}
                alt={item.name}
              />
              <div className="p-4">
                {/* Status */}
                <div
                  className={`flex items-center gap-2 text-sm ${
                    item.available ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.available ? "bg-green-500" : "bg-gray-500"
                    }`}
                  ></div>
                  <p>
                    {item.available ? "Sẵn sàng tiếp nhận" : "Không tiếp nhận"}
                  </p>
                </div>

                {/* Name */}
                <p className="text-gray-900 text-lg font-medium mt-1">
                  {item.name}
                </p>

                {/* Speciality */}
                <p className="text-gray-600 text-sm">{item.speciality}</p>

                {/* ⭐ Average Rating */}
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex text-yellow-400 text-sm">
                    {Array(Math.round(item.averageRating || 0))
                      .fill()
                      .map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                  </div>
                  <span className="text-gray-600 text-xs ml-1">
                    {getDoctorAverageRating(item)} / 5
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
