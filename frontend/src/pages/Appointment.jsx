import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";
import ReviewDoctor from "../components/ReviewDoctor";
import { FaHeart, FaRegHeart } from "react-icons/fa";
const Appointment = () => {
  const { docId } = useParams(); //ấy docId từ URL
  //truy cập dữ liệu toàn cục từ AppContext.
  const {
    doctors,
    currencySymbol,
    backendUrl,
    token,
    getDoctorsData,
    userData,
    loadUserProfileData,
  } = useContext(AppContext);
  const navigate = useNavigate();

  const daysOfWeek = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];

  const [docInfo, setDocInfo] = useState(null); //Lưu thông tin bác sĩ
  const [docSlots, setDocSlots] = useState([]); //Mảng chứa danh sách khung giờ khả dụng cho 7 ngày tới.
  const [slotIndex, setSlotIndex] = useState(0); //Chỉ số ngày được chọn (0-6, tương ứng 7 ngày).
  const [slotTime, setSlotTime] = useState(""); //Thời gian được chọn
  const [isHovering, setIsHovering] = useState(false); //Trạng thái khi di chuột vào ảnh bác sĩ
  const [isFavorited, setIsFavorited] = useState(false);

  //Lấy thông tin bác sĩ từ danh sách doctors dựa trên docId
  //Tìm trong mảng doctors (từ AppContext) bác sĩ có _id khớp với docId.
  const fetchDocInfo = async () => {
    const foundDoc = doctors.find((doc) => doc._id === docId);
    setDocInfo(foundDoc);
  };

  //Tạo danh sách các slot thời gian khả dụng trong 7 ngày tới.
  const getAvailableSlots = async () => {
    //Xóa danh sách slot hiện tại trong trạng thái docSlots để bắt đầu tính toán mới, tránh dữ liệu cũ chồng lấn.
    setDocSlots([]);
    //Lấy ngày và giờ hiện tại làm mốc để tính các ngày trong tương lai.
    let today = new Date();
    //Lặp qua 7 ngày
    for (let i = 0; i < 7; i++) {
      //currentDate là bản sao của today tránh thay đổi trực tiếp today., được đặt thành ngày thứ i bằng setDate(today.getDate() + i).
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(17, 30, 0, 0); //Đặt giờ của endTime thành 17:30

      //Thiết lập thời gian bắt đầu cho mỗi ngày

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 8 ? currentDate.getHours() + 1 : 8
        );
        //Nếu phút hiện tại > 30, đặt phút là 30.
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        //currentDate không phải hôm nay,đặt thời gian bắt đầu mặc định là 8:00 AM.
        currentDate.setHours(8);
        currentDate.setMinutes(0);
      }

      // Tạo một mảng rỗng timeSlots để lưu các khung giờ khả dụng của ngày hiện tại
      //Mỗi ngày sẽ có một danh sách khung giờ riêng , được thêm vào timeSlots.
      let timeSlots = [];
      //currentDate < endTime, nghĩa là vòng lặp tiếp tục chạy khi currentDate (thời gian hiện tại của khung giờ đang xử lý) sớm hơn endTime
      //       Đảm bảo chỉ tạo các khung giờ trong khoảng thời gian hợp lệ (từ thời gian bắt đầu của currentDate đến 5:30 PM).
      // Ngăn tạo các khung giờ ngoài giờ làm việc (ví dụ: 6:00 PM, 7:00 PM, ...).
      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        //Tạo định dạng ngày (slotDate)
        const slotDate = `${currentDate.getDate()}_${
          currentDate.getMonth() + 1
        }_${currentDate.getFullYear()}`;
        const slotTime = formattedTime;
        //Kiểm tra slot khả dụng:
        // docInfo?.slots_booked: Truy cập đối tượng slots_booked của bác sĩ. Optional chaining (?.) đảm bảo không gây lỗi nếu docInfo hoặc slots_booked là undefined.
        // slots_booked?.[slotDate]: Lấy mảng các slot đã đặt cho ngày slotDate (ví dụ: ["09:00", "10:00"] cho "11_5_2025").
        // .includes(slotTime): Kiểm tra xem slotTime (ví dụ: "09:00") có trong mảng slot đã đặt hay không.
        // Nếu true (slot đã được đặt), isSlotAvailable = false.
        // Nếu false (slot chưa được đặt), isSlotAvailable = true.
        const isSlotAvailable = docInfo?.slots_booked?.[slotDate]?.includes(
          slotTime
        )
          ? false
          : true;
        //Nếu isSlotAvailable là true, thêm slot vào timeSlots
        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }
        //Tăng currentDate lên 30 phút để tạo khung giờ tiếp theo
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      //Lưu danh sách slot
      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };
  //Đặt lịch hẹn
  const bookAppointment = async () => {
    //Kiểm tra token. Nếu không có, yêu cầu đăng nhập và chuyển hướng đến /login.
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }
    try {
      //Lấy đối tượng Date của khung giờ đầu đầu tiên trong ngày được chọn.
      //Ví dụ: Nếu slotIndex = 0 (hôm nay), datetime có thể là 2025-05-11T09:00:00.
      const date = docSlots[slotIndex][0].datetime;
      // //Tạo định dạng ngày (slotDate) để gửi đến backend
      const slotDate = `${date.getDate()}_${
        date.getMonth() + 1
      }_${date.getFullYear()}`;
      //Dữ liệu gửi đi chứa: docId, slotDate, slotTime
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
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

  const toggleFavorite = async () => {
    if (!token) {
      toast.warn("Login to add favorite doctor");
      return navigate("/login");
    }

    try {
      if (isFavorited) {
        // Nếu đã favorite thì xóa
        const { data } = await axios.delete(
          `${backendUrl}/api/user/favorite-doctor/${docId}`,
          {
            headers: { token },
          }
        );
        if (data.success) {
          toast.success("Đã bỏ yêu thích bác sĩ");
          loadUserProfileData();
        }
      } else {
        // Nếu chưa favorite thì thêm
        const { data } = await axios.post(
          `${backendUrl}/api/user/favorite-doctor`,
          { doctorId: docId },
          { headers: { token } }
        );
        if (data.success) {
          toast.success("Đã thêm vào yêu thích");
          loadUserProfileData();
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    if (userData?.favoriteDoctors?.includes(docId)) {
      setIsFavorited(true);
    } else {
      setIsFavorited(false);
    }
  }, [userData, docId]);

  return (
    docInfo && (
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Doctor Details */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-10 border-2 border-gray-200">
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="md:w-1/3 lg:w-1/4">
              <div
                className="relative h-72 md:h-full cursor-pointer overflow-hidden"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div className="absolute inset-0 bg-seconds opacity-20" />
                <img
                  className="w-full h-full object-cover object-center transition-transform duration-300 ease-in-out"
                  src={docInfo.image}
                  alt={`Dr. ${docInfo.name}`}
                  style={{ transform: isHovering ? "scale(1.05)" : "scale(1)" }}
                />
              </div>
            </div>

            {/* Info */}
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
                      {currencySymbol.format(docInfo.fees)}
                    </p>
                  </div>
                </div>

                {/* Favorite & Book Button */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <button
                    onClick={toggleFavorite}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg border-2 font-medium transition-all
    ${
      isFavorited
        ? "border-pink-500 text-pink-600 hover:bg-pink-50"
        : "border-gray-300 text-gray-600 hover:border-pink-400 hover:text-pink-600"
    }
  `}
                  >
                    {isFavorited ? (
                      <FaHeart className="text-pink-500" />
                    ) : (
                      <FaRegHeart />
                    )}
                    {isFavorited ? "Bỏ yêu thích" : "Thêm yêu thích"}
                  </button>
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
              {/* render danh sách ngày nếu docSlots có dữ liệu */}
              {/* docSlots: Mảng 7 phần tử, mỗi item là mảng các slot khả dụng của một ngày.
index: Chỉ số của ngày (0-6, tương ứng từ hôm nay đến 6 ngày sau).
map tạo một ô ngày cho mỗi phần tử trong docSlots. */}
              {docSlots.length > 0 &&
                docSlots.map((item, index) => (
                  // Tạo một ô đại diện cho một ngày
                  //gọi setSlotIndex(index) để cập nhật trạng thái slotIndex, đánh dấu ngày được chọn
                  <div
                    key={index}
                    onClick={() => setSlotIndex(index)}
                    className={`flex flex-col items-center justify-center min-w-20 py-4 px-2 rounded-lg cursor-pointer transition-all ${
                      slotIndex === index
                        ? "bg-seconds text-white shadow-md border-2 border-seconds"
                        : "border-2 border-gray-200 hover:border-seconds"
                    }`}
                  >
                    {/* item: Trong vòng lặp docSlots.map((item, index) => ...), item là một phần tử của mảng docSlots. Mỗi item là một mảng con chứa các khung giờ khả dụng của một ngày cụ thể. */}
                    {/* Điều kiện item[0] && ...: Đảm bảo ngày có khung giờ khả dụng trước khi hiển thị. */}
                    {/* Chỉ hiển thị các ngày có khung giờ khả dụng (item[0]), tránh hiển thị ngày không đặt được (như hôm nay, vì đã quá 5:30 PM). */}
                    {item[0] && (
                      <>
                        {/* Hiển thị thứ trong tuần */}
                        <p className="text-sm font-medium mb-1">
                          {/* là chỉ lấy những ngày trong tuần có khung giờ khả dụng */}
                          {daysOfWeek[item[0].datetime.getDay()]}
                        </p>
                        {/* Hiển thị ngày trong tháng */}
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
              {/*docSlots: Một mảng chứa các danh sách khung giờ. Mỗi phần tử trong docSlots (e.g., docSlots[slotIndex]) là một mảng con chứa các đối tượng thời gian (e.g., { time: "10:00 AM" }). */}
              {/* slotIndex: Một chỉ số (index) xác định danh sách thời gian nào trong docSlots đang được hiển thị */}
              {/* slotIndex được sử dụng để lấy chỉ mục của ngày đang được chọn trong mảng docSlots */}
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
              // Ngăn người dùng đặt lịch khi chưa chọn thời gian.
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
        {/* đánh giá bác sĩ */}

        <div className="mt-10">
          <ReviewDoctor />
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
