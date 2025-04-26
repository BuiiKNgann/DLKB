import React from "react";
import { assets } from "../assets/assets";

const Header = () => {
  return (
    <div className="bg-seconds rounded-lg overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center py-8 md:py-12 lg:py-16">
          {/* Left Content */}
          <div className="w-full md:w-1/2 flex flex-col items-start justify-center space-y-6 mb-8 md:mb-0 md:pr-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-tight">
              Đặt lịch khám
              <span className="block mt-2">nhanh chóng</span>
              <span className="block mt-2 text-2xl md:text-3xl lg:text-4xl font-medium">
                với đội ngũ bác sĩ uy tín hàng đầu
              </span>
            </h1>

            <p className="text-base md:text-lg text-white/90 font-light">
              Khám phá danh sách bác sĩ đáng tin cậy và
              <span className="block mt-1">
                đặt lịch hẹn dễ dàng chỉ trong vài bước
              </span>
            </p>

            <a
              href="#speciality"
              className="inline-flex items-center gap-2 bg-white hover:bg-white/90 px-8 py-4 rounded-full text-seconds font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Đặt lịch ngay
              <img className="w-3 ml-1" src={assets.arrow_icon} alt="" />
            </a>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-1/2 relative">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-seconds/20 to-transparent z-10"></div>
              <img
                className="w-full h-auto object-cover object-center"
                src={assets.doc_header}
                alt="Doctor team"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
