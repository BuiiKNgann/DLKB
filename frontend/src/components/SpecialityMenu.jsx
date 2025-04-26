import React from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
  return (
    <section id="speciality" className="py-14 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Chuyên khoa</h2>
          <div className="w-16 h-0.5 bg-seconds mx-auto mb-4"></div>
          <p className="max-w-lg mx-auto text-gray-600 text-sm">
            Khám phá danh sách bác sĩ đáng tin cậy theo chuyên ngành và đặt lịch
            nhanh chóng, không lo rườm rà.
          </p>
        </div>

        <div className="flex justify-start md:justify-center gap-6 w-full overflow-x-auto pb-4 md:overflow-visible md:flex-wrap">
          {specialityData.map((item, index) => (
            <Link
              onClick={() => window.scrollTo(0, 0)}
              key={index}
              to={`/doctors/${item.speciality}`}
              className="group"
            >
              <div className="flex flex-col items-center min-w- transition-all duration-300 hover:-translate-y-2 border-2 border-seconds rounded-lg p-5 hover:shadow-md">
                <div className="w-20 h-20 flex items-center justify-center mb-4">
                  <img
                    className="w-16 h-auto object-contain transition-transform duration-300 group-hover:scale-110"
                    src={item.image}
                    alt={item.speciality}
                  />
                </div>
                <h3 className="text-sm font-medium text-gray-800 text-center">
                  {item.speciality}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialityMenu;
