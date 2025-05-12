import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModels.js";
// API for adding doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;
    // Kiểm tra đủ thông tin chưa:
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "Hãy nhập đủ thông tin" });
    }
    // Kiểm tra định dạng email
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Hãy nhập đúng định dạng email",
      });
    }
    // Kiểm tra độ dài password:
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Hãy nhập mật khẩu mạnh",
      });
    }
    // hashing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    //secure_url là URL bạn sẽ lưu vào database và dùng để hiển thị ảnh sau này.
    const imageUrl = imageUpload.secure_url;

    // thêm bác sĩ
    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    res.json({ success: true, message: "Bác sĩ đã thêm thành công" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//  admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSPWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({
        success: false,
        message: "Thông tin đăng nhập không hợp lệ.",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// hiển thị danh sách bác sĩ
const allDoctors = async (req, res) => {
  try {
    // doctorModel.find({}) Lấy tất cả các bác sĩ trong database
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// API lấy danh sách cuộc hẹn
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API hủy lịch hẹn
// const appointmentCancel = async (req, res) => {
//   try {
//     const { appointmentId } = req.body;

//     const appointmentData = await appointmentModel.findById(appointmentId);

//     await appointmentModel.findByIdAndUpdate(appointmentId, {
//       cancelled: true,
//     });
//     //releasing doctor slot
//     const { docId, slotDate, slotTime } = appointmentData;
//     const doctorData = await doctorModel.findById(docId);
//     let slots_booked = doctorData.slots_booked;
//     slots_booked[slotDate] = slots_booked[slotDate].filter(
//       (e) => e !== slotTime
//     );
//     await doctorModel.findByIdAndUpdate(docId, { slots_booked });
//     res.json({ success: true, message: "Appointment Cancelled" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId, cancelReasons } = req.body; // ✨ nhận thêm cancelReasons từ body

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Không tìm thấy lịch khám" });
    }

    // 1. Cập nhật trạng thái hủy và lưu lý do
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
      cancelReason: Array.isArray(cancelReasons)
        ? cancelReasons
        : [cancelReasons],
    });

    // 2. Giải phóng slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;

    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (e) => e !== slotTime
      );

      // Nếu slots_booked[slotDate] rỗng sau khi xóa -> xóa luôn ngày đó để DB gọn gàng
      if (slots_booked[slotDate].length === 0) {
        delete slots_booked[slotDate];
      }
    }

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Đã hủy có lý do" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API dashboard admin Tạo một đối tượng dashData chứa dữ liệu tổng hợp cho Dashboard:

const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});
    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5), //	5 lịch hẹn mới nhất: lấy mảng appointments
    };
    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//  API admin cập nhật thông tin bác sĩ
const updateDoctorByAdmin = async (req, res) => {
  try {
    const { doctorId, name, speciality, address, fees, about, experience } =
      req.body;

    await doctorModel.findByIdAndUpdate(doctorId, {
      name,
      speciality,
      address,
      fees,
      about,
      experience,
    });

    res.json({
      success: true,
      message: "Cập nhật thông tin bác sĩ thành công",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// API admin xóa bác sĩ
const deleteDoctorByAdmin = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Kiểm tra xem doctorId có hợp lệ không
    if (!doctorId) {
      return res
        .status(400)
        .json({ success: false, message: "Mã bác sĩ không hợp lệ" });
    }

    const deletedDoctor = await doctorModel.findByIdAndDelete(doctorId);

    if (!deletedDoctor) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy bác sĩ" });
    }

    res.json({ success: true, message: "Xóa bác sĩ thành công" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
  updateDoctorByAdmin,
  deleteDoctorByAdmin,
};
