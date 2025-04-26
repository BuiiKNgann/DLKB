import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } =
    useContext(AdminContext);
  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]); //Nếu chưa có aToken, sẽ không gọi getAllDoctors()
  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium ">Bác sĩ</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {doctors.map((item, index) => (
          <div
            className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group "
            key={index}
          >
            <img
              className="bg-indigo-50 group-hover:bg-seconds transition-all duration-500"
              src={item.image}
              alt=""
            />
            <div className="p-4">
              <p className="text-neutral-800 text-lg font-medium">
                {item.name}
              </p>
              <p className="text-zinc-600 text-sm">{item.speciality}</p>
              <div className="mt-2 flex items-center gap-1 text-sm">
                {/*  ID của bác sĩ hiện tại (được truyền vào hàm changeAvailability) để backend có thể xác định bác sĩ nào cần thay đổi trạng thái. */}
                <input
                  onChange={() => changeAvailability(item._id)}
                  type="checkbox"
                  checked={item.available}
                />
                <p>Sẵn sàng tiếp nhận</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
