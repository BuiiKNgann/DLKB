import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors, getDoctorAverageRating } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium"> Các Bác Sĩ Hàng Đầu </h1>
      <p className="sm:w-1/3 text-center text-sm">
        Khám phá danh sách các bác sĩ uy tín hàng đầu của chúng tôi.
      </p>

      <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {doctors
          .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0)) // ⭐ Sắp xếp theo điểm cao
          .slice(0, 5)
          .map((item, index) => (
            <div
              key={index}
              onClick={() => {
                navigate(`/appointment/${item._id}`);
                scrollTo(0, 0);
              }}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500"
            >
              <img
                className="bg-blue-50 w-full h-48 object-cover"
                src={item.image}
                alt={item.name}
              />
              <div className="p-4">
                {/* Trạng thái */}
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

                {/* Tên bác sĩ */}
                <p className="text-gray-900 text-lg font-semibold mt-1">
                  {item.name}
                </p>

                {/* Chuyên môn */}
                <p className="text-gray-600 text-sm">{item.speciality}</p>

                {/* ⭐ Hiển thị điểm đánh giá */}
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

      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10"
      >
        Xem thêm
      </button>
    </div>
  );
};

export default TopDoctors;
