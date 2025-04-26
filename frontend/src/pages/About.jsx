import React from "react";
import { assets } from "../assets/assets";
const About = () => {
  return (
    <div>
      <p className="text-center text-2xl pt-10 text-gray-500">
        Về <span className="text-gray-700 font-medium ">chúng tôi</span>
      </p>
      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.about_image}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
            Chào mừng bạn đến với MEDICONNECT – đối tác đáng tin cậy trong việc
            quản lý nhu cầu chăm sóc sức khỏe của bạn một cách tiện lợi và hiệu
            quả. Tại Prescripto, chúng tôi thấu hiểu những khó khăn mà mọi người
            thường gặp phải khi đặt lịch hẹn với bác sĩ và quản lý hồ sơ sức
            khỏe của mình.
          </p>
          <p>
            Chúng tôi không ngừng nỗ lực nâng cấp nền tảng của mình, tích hợp
            những tiến bộ mới nhất nhằm cải thiện trải nghiệm người dùng và cung
            cấp dịch vụ vượt trội. Dù bạn đang đặt lịch khám lần đầu hay đang
            theo dõi quá trình điều trị dài hạn, MEDICONNECT luôn đồng hành cùng
            bạn trên từng chặng đường chăm sóc sức khỏe.
          </p>
          <b className="text-gray-800">Tầm nhìn</b>
          <p>
            Tầm nhìn của MEDICONNECT là tạo ra một trải nghiệm chăm sóc sức khỏe
            liền mạch cho mọi người dùng. Chúng tôi hướng đến việc thu hẹp
            khoảng cách giữa bệnh nhân và các nhà cung cấp dịch vụ y tế, giúp
            bạn dễ dàng tiếp cận dịch vụ chăm sóc sức khỏe khi cần, bất cứ lúc
            nào bạn cần.
          </p>
        </div>
      </div>
      <div className="text-xl my-4">
        <p>
          Hãy{" "}
          <span className="text-gray-700 font-semibold"> chọn chúng tôi</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py=-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-seconds hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Hiệu quả:</b>
          <p>
            Đặt lịch hẹn khám bệnh một cách nhanh chóng, phù hợp với lối sống
            bận rộn của bạn.
          </p>
        </div>
        <div className="border px-10 md:px-16 py=-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-seconds hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Tiện lợi:</b>
          <p>
            Tiếp cận mạng lưới các chuyên gia y tế đáng tin cậy trong khu vực
            của bạn.
          </p>
        </div>
        <div className="border px-10 md:px-16 py=-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-seconds hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Cá nhân hóa:</b>
          <p>
            Đề xuất và nhắc nhở được cá nhân hóa giúp bạn chủ động trong việc
            chăm sóc sức khỏe.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
