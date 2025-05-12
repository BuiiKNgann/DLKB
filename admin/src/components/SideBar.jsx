// import React, { useContext } from "react";
// import { AdminContext } from "../context/AdminContext";
// import { NavLink } from "react-router-dom";
// import { assets } from "../assets/assets";
// import { DoctorContext } from "../context/DoctorContext";

// const Sidebar = () => {
//   const { aToken } = useContext(AdminContext);
//   const { dToken } = useContext(DoctorContext);
//   return (
//     <div className="min-h-screen bg-white border-r ">
//       {aToken && (
//         <ul className="text-[#515151] mt-5">
//           <NavLink
//             className={({ isActive }) =>
//               `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
//                 isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
//               }`
//             }
//             to={"/admin-dashboard"}
//           >
//             <img src={assets.home_icon} alt="" />
//             <p className="hidden md:block">Dashboard</p>
//           </NavLink>
//           {/* Boolean, true nếu path hiện tại === path của to */}
//           <NavLink
//             className={({ isActive }) =>
//               `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
//                 isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
//               }`
//             }
//             to={"/all-appointments"}
//           >
//             <img src={assets.appointment_icon} alt="" />
//             <p className="hidden md:block">Lịch khám</p>
//           </NavLink>
//           <NavLink
//             className={({ isActive }) =>
//               `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
//                 isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
//               }`
//             }
//             to={"/add-doctor"}
//           >
//             <img src={assets.add_icon} alt="" />
//             <p className="hidden md:block">Thêm bác sĩ</p>
//           </NavLink>

//           <NavLink
//             className={({ isActive }) =>
//               `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
//                 isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
//               }`
//             }
//             to={"/doctor-list"}
//           >
//             <img src={assets.people_icon} alt="" />
//             <p>Danh sách bác sĩ</p>
//           </NavLink>
//         </ul>
//       )}

//       {dToken && (
//         <ul className="text-[#515151] mt-5">
//           <NavLink
//             className={({ isActive }) =>
//               `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
//                 isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
//               }`
//             }
//             to={"/doctor-dashboard"}
//           >
//             <img src={assets.home_icon} alt="" />
//             <p className="hidden md:block">Dashboard</p>
//           </NavLink>
//           {/* Boolean, true nếu path hiện tại === path của to */}
//           <NavLink
//             className={({ isActive }) =>
//               `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
//                 isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
//               }`
//             }
//             to={"/doctor-appointments"}
//           >
//             <img src={assets.appointment_icon} alt="" />
//             <p className="hidden md:block">Lịch khám</p>
//           </NavLink>

//           <NavLink
//             className={({ isActive }) =>
//               `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
//                 isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
//               }`
//             }
//             to={"/doctor-profile"}
//           >
//             <img src={assets.people_icon} alt="" />
//             <p className="hidden md:block">Profile</p>
//           </NavLink>
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Sidebar;
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import {
  MdDashboard,
  MdOutlineEventAvailable,
  MdPersonAdd,
  MdGroups,
  MdPerson,
} from "react-icons/md";

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  // Các mục sidebar cho admin
  const adminLinks = [
    {
      to: "/admin-dashboard",
      label: "Dashboard",
      icon: <MdDashboard size={22} />,
    },
    {
      to: "/all-appointments",
      label: "Lịch khám",
      icon: <MdOutlineEventAvailable size={22} />,
    },
    {
      to: "/add-doctor",
      label: "Thêm bác sĩ",
      icon: <MdPersonAdd size={22} />,
    },
    {
      to: "/doctor-list",
      label: "Danh sách bác sĩ",
      icon: <MdGroups size={22} />,
    },
  ];

  // Các mục sidebar cho doctor
  const doctorLinks = [
    {
      to: "/doctor-dashboard",
      label: "Dashboard",
      icon: <MdDashboard size={22} />,
    },
    {
      to: "/doctor-appointments",
      label: "Lịch khám",
      icon: <MdOutlineEventAvailable size={22} />,
    },
    { to: "/doctor-profile", label: "Hồ sơ", icon: <MdPerson size={22} /> },
  ];

  const renderLinks = (links) => (
    <ul className="text-[#515151] mt-6">
      {links.map((link, index) => (
        <NavLink
          key={index}
          to={link.to}
          className={({ isActive }) =>
            `flex items-center gap-4 py-3 px-4 md:px-8 rounded-lg mx-3 my-2 font-medium hover:bg-blue-50 transition-all ${
              isActive ? "bg-blue-100 text-blue-700" : ""
            }`
          }
        >
          {link.icon}
          <span className="hidden md:inline">{link.label}</span>
        </NavLink>
      ))}
    </ul>
  );

  return (
    <div className="min-h-screen bg-white border-r border-gray-200 shadow-sm">
      {aToken && renderLinks(adminLinks)}
      {dToken && renderLinks(doctorLinks)}
    </div>
  );
};

export default Sidebar;
