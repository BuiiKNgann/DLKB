import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

const changeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body;
    //docData chứa thông tin về bác sĩ này từ cơ sở dữ liệu
    const docData = await doctorModel.findById(docId);
    //Cập nhật trạng thái available
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available, //Đảo ngược trạng thái của bác sĩ từ true thành false
    });
    res.json({ success: true, message: "Cập nhật trạng thái thành công" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// Lấy danh sách tất cả bác sĩ
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API đăng nhập bác sĩ
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.json({
        success: false,
        message: "Thông tin đăng nhập không hợp lệ",
      });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Thông tin đăng nhập không hợp lệ" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// API lấy lịch khám bệnh của bác sĩ
const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API đánh dấu đã hoàn thành lịch khám bệnh
const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    //So sánh appointmentData.docId (ID bác sĩ liên kết với lịch khám) với docId (ID bác sĩ gửi yêu cầu).
    //đảm bảo chỉ bác sĩ liên quan đến lịch khám mới có thể đánh dấu nó là hoàn thành.
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({ success: true, message: "Lịch khám đã hoàn thành" });
    } else {
      return res.json({ success: false, message: "Đã hủy" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API hủy lịch khám bệnh

const appointmentCancel = async (req, res) => {
  try {
    const { docId } = req.body; // docId nên lấy từ token xác thực thay vì truyền body (nếu cần)
    const { appointmentId, cancelReasons } = req.body;

    //Tìm kiếm dữ liệu lịch khám
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: "Không tìm thấy lịch khám" });
    }
    //Kiểm tra quyền truy cập
    if (appointmentData.docId !== docId) {
      return res.json({ success: false, message: "Không có quyền." });
    }
    //Cập nhật lịch khám
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
      // Lưu lý do hủy vào trường cancelReason
      cancelReason: Array.isArray(cancelReasons)
        ? cancelReasons
        : [cancelReasons],
    });

    // Cập nhật slot
    // Trích xuất slotDate (ngày của lịch khám) và slotTime (khung giờ) từ dữ liệu lịch khám.
    // Truy vấn doctorModel để lấy thông tin bác sĩ theo docId.
    // Lấy danh sách các khung giờ đã đặt (slots_booked) từ dữ liệu bác sĩ.
    const { slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;
    //Xóa khung giờ đã hủy
    //Kiểm tra xem slots_booked có chứa danh sách khung giờ cho slotDate không.
    //Nếu có, lọc bỏ slotTime của lịch khám bị hủy khỏi mảng khung giờ của ngày đó.
    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (e) => e !== slotTime
      );
    }
    //Cập nhật dữ liệu bác sĩ với danh sách slots_booked đã được chỉnh sửa.
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Hủy lịch khám có lý do" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API dashboard bác sĩ
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });
    //tính tổng tiền bác sĩ đã kiếm được: chỉ cộng tiền những lịch đã hoàn thành hoặc đã thanh toán.
    //  Tính tổng doanh thu (earnings)
    let earnings = 0;
    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });
    //Đếm số bệnh nhân duy nhất
    // Tránh tính trùng, 1 bệnh nhân đặt nhiều lịch cũng chỉ tính 1 lần.
    //Khởi tạo mảng rỗng patients = [] để lưu các userId.
    let patients = [];
    //Kiểm tra xem item.userId (ID của bệnh nhân) đã có trong mảng patients chưa bằng !patients.includes(item.userId).
    //Nếu chưa có, thêm userId vào mảng patients.
    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    //Tạo dữ liệu dashboard
    //Tạo một object chứa các thông tin cần thiết cho dashboard.
    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };
    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API lấy thông tin bác sĩ
const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;
    const profileData = await doctorModel.findById(docId).select("-password");
    res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API cập nhật thông tin bác sĩ
// Tìm document bác sĩ có _id khớp với docId.
// Cập nhật các trường fees, address, và available với giá trị từ req.body.
const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available } = req.body;
    await doctorModel.findByIdAndUpdate(docId, { fees, address, available });
    res.json({
      success: true,
      message: "Cập nhật thông tin bác sĩ thành công",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
// API này trả về danh sách bác sĩ có sẵn
const availableDoctors = async (req, res) => {
  try {
    const { speciality, time, date } = req.query;
    //biến targetDate, chứa ngày (định dạng YYYY-MM-DD) được sử dụng để kiểm tra slot thời gian của bác sĩ
    //Tham số date từ req.query (nếu có).
    //Nếu không có date, sử dụng ngày hiện tại.
    const targetDate = date || new Date().toISOString().split("T")[0];

    if (!time) {
      return res.json({
        success: false,
        message: "Thiếu thời gian",
      });
    }

    // query: Một object dùng để truy vấn MongoDB
    //Điều kiện bắt buộc: available: true
    const query = {
      available: true,
    };
    // $regex: Tìm kiếm chuỗi khớp với speciality.
    // new RegExp(speciality, "i"): Tạo biểu thức chính quy, với "i" để không phân biệt hoa thường (case-insensitive).
    if (speciality) {
      query.speciality = { $regex: new RegExp(speciality, "i") };
    }

    const doctors = await doctorModel.find(query);

    // Lọc bác sĩ còn slot trống tại thời gian được yêu cầu
    const result = doctors.filter((doc) => {
      // Lấy object slots_booked từ tài liệu bác sĩ (doc).
      const slots = doc.slots_booked || {};
      //Chuyển Date thành chuỗi ISO (2025-05-15T13:51:00.000Z).
      //Cắt chuỗi tại ký tự T, lấy phần đầu tiên (2025-05-15)
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      //slots[today]: Truy cập mảng thời gian trong slots tương ứng với ngày today.
      //VD: Nếu today = "2025-05-15" và slots = { "2025-05-15": ["09:00", "10:00"] }, thì slots[today] = ["09:00", "10:00"].
      const bookedTimes = slots[today] || [];
      //Kiểm tra xem thời gian yêu cầu (time) có nằm trong danh sách thời gian đã đặt (bookedTimes) không.
      //Trả về true nếu thời gian còn trống (giữ bác sĩ trong result).
      //Trả về false nếu thời gian đã bị đặt (loại bác sĩ khỏi result).
      return !bookedTimes.includes(time);
    });

    res.json({
      success: true,
      doctors: result.map((d) => ({ id: d._id, name: d.name })),
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  changeAvailablity,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  appointmentComplete,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
  availableDoctors,
};
