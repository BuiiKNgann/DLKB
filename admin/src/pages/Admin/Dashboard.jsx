import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext.jsx";
import { assets } from "../../assets/assets.js";

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } =
    useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  return (
    dashData && (
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Doctors Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-5 flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-full">
                <img className="w-14 h-14" src={assets.doctor} alt="Doctors" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {dashData.doctors}
                </p>
                <p className="text-gray-500 font-medium">Bác sĩ</p>
              </div>
            </div>
            <div className="bg-blue-500 h-1 w-full"></div>
          </div>

          {/* Appointments Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-5 flex items-center gap-4">
              <div className="bg-green-50 p-3 rounded-full">
                <img
                  className="w-14 h-14"
                  src={assets.medical}
                  alt="Appointments"
                />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {dashData.appointments}
                </p>
                <p className="text-gray-500 font-medium">Lịch khám</p>
              </div>
            </div>
            <div className="bg-green-500 h-1 w-full"></div>
          </div>

          {/* Patients Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-5 flex items-center gap-4">
              <div className="bg-purple-50 p-3 rounded-full">
                <img
                  className="w-14 h-14"
                  src={assets.patient}
                  alt="Patients"
                />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {dashData.appointments}
                </p>
                <p className="text-gray-500 font-medium">Bệnh nhân</p>
              </div>
            </div>
            <div className="bg-purple-500 h-1 w-full"></div>
          </div>
        </div>

        {/* Latest Bookings */}
        <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b bg-gray-50">
            <img src={assets.list_icon} alt="" className="w-5 h-5" />
            <p className="font-semibold text-gray-800 text-lg">
              Lịch khám gần đây
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {dashData.latestAppointments.map((item, index) => (
              <div
                className="flex items-center px-6 py-4 gap-4 hover:bg-gray-50 transition-colors"
                key={index}
              >
                <img
                  className="rounded-full w-12 h-12 object-cover border-2 border-gray-200"
                  src={item.docData.image}
                  alt={item.docData.name}
                />
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">
                    {item.docData.name}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {slotDateFormat(item.slotDate)}
                  </p>
                </div>
                {item.cancelled ? (
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-medium">
                    Đã hủy
                  </span>
                ) : item.isCompleted ? (
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium">
                    Hoàn thành
                  </span>
                ) : (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="flex items-center justify-center p-2 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <img
                      className="w-6 h-6"
                      src={assets.cancel_icon}
                      alt="Cancel"
                    />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
