import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
      {/* -------Left Section---------- */}
      <div>
        <img className="mb-5 w-40 " src={assets.MediConnectlogo} alt="" />
        <p className="w-full md:w-2/3 text-gray-600 leading-6 ">
          Mediconnect là hệ thống đặt lịch khám bệnh trực tuyến, giúp kết nối
          bệnh nhân với bác sĩ uy tín, tìm kiếm theo chuyên khoa và đặt lịch
          nhanh chóng, dễ dàng.
        </p>
      </div>
      {/* -------Center Section------------ */}
      <div>
        <p className="text-xl font-medium mb-5">Về MEDICONNECT</p>
        <ul className="flex flex-col gap-2 text-gray-600">
          <li>Giới thiệu</li>
          <li>Về chúng tôi</li>
          <li>Liên lạc</li>
          <li>Chính sách bảo mật </li>
        </ul>
      </div>

      {/* --------Right Section--------------- */}
      <div>
        <p className="text-xl font-medium mb-5">Liên hệ </p>
        <ul className="flex flex-col gap-2 text-gray-600">
          <li>0374822130</li>
          <li>mediconnect@gmail.com</li>
        </ul>
      </div>
      {/* ---------Copyright text----------*/}
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright © 2025 NGANBUI - All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
