import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModels.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

// Đăng ký người dùng
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !password || !email) {
      return res.json({ success: false, message: "Sai thông tin" });
    }
    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Vui lòng nhập lại email" });
    }
    //validating strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Vui lòng nhập mật khẩu mạnh hơn",
      });
    }
    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    //Tạo một instance mới của userModel với dữ liệu userData (thường chứa tên, email, mật khẩu, v.v.).
    const newUser = new userModel(userData);
    const user = await newUser.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
    // _id
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// đăng nhập
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Đăng nhập không hợp lệ" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Lỗi đăng nhập" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// profile
// const getProfile = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const userData = await userModel.findById(userId).select("-password");
//     res.json({ success: true, userData });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };
const getProfile = async (req, res) => {
  try {
    const userData = await userModel.findById(req.userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// cập nhật profile người dùng
// const updateProfile = async (req, res) => {
//   try {
//     const { userId, name, phone, address, dob, gender } = req.body;
//     const imageFile = req.file;
//     if (!name || !phone || !dob || !gender) {
//       return res.json({ success: false, message: "Data Missing" });
//     }
//     await userModel.findByIdAndUpdate(userId, {
//       name,
//       phone,
//       address: JSON.parse(address),
//       dob,
//       gender,
//     });
//     if (imageFile) {
//       // upload image to cloudinary
//       const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
//         resource_type: "image",
//       });
//       const imageURL = imageUpload.secure_url;

//       await userModel.findByIdAndUpdate(userId, { image: imageURL });
//     }

//     res.json({ success: true, message: "profile Updated" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    const updateData = {
      name,
      phone,
      dob,
      gender,
      address: typeof address === "string" ? JSON.parse(address) : address,
    };

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.image = imageUpload.secure_url;
    }

    await userModel.findByIdAndUpdate(userId, updateData);
    res.json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.log("Update error:", error);
    res.json({ success: false, message: error.message });
  }
};
// API đặt lịch khám

// API to book appointment
// const bookAppointment = async (req, res) => {
//   try {
//     const { userId, docId, slotDate, slotTime } = req.body;
//     const docData = await doctorModel.findById(docId).select("-password");
//     if (!docData.available) {
//       return res.json({ success: false, message: "Doctor not available" });
//     }
//     let slots_booked = docData.slots_booked;
//     // checking for slot availablity
//     if (slots_booked[slotDate]) {
//       if (slots_booked[slotDate].includes(slotTime)) {
//         return res.json({ success: false, message: "Slot not available" });
//       } else {
//         slots_booked[slotDate].push(slotTime);
//       }
//     } else {
//       slots_booked[slotDate] = [];
//       slots_booked[slotDate].push(slotTime);
//     }

//     const userData = await userModel.findById(userId).select("-password");
//     delete docData.slots_booked;

//     const appointmentData = {
//       userId,
//       docId,
//       userData,
//       docData,
//       amount: docData.fees,
//       slotTime,
//       slotDate,
//       date: Date.now(),
//     };
//     const newAppointment = new appointmentModel(appointmentData);
//     await newAppointment.save();

//     //save new slots dâta in docData
//     await doctorModel.findByIdAndUpdate(docId, { slots_booked });
//     res.json({ success: true, message: "Appointment Booked" });
//   } catch (error) {
//     console.log("Update error:", error);
//     res.json({ success: false, message: error.message });
//   }
// };
const bookAppointment = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Auth userId:", req.userId);

    const userId = req.userId; // Lấy userId từ middleware auth
    const { docId, slotDate, slotTime } = req.body; //

    console.log("userId:", userId);
    console.log("docId:", docId);
    console.log("slotDate:", slotDate);
    console.log("slotTime:", slotTime);

    if (!userId) {
      return res.json({
        success: false,
        message: "Không có thông tin người dùng",
      });
    }

    if (!docId) {
      return res.json({ success: false, message: "Không có thông tin bác sĩ" });
    }

    const docData = await doctorModel.findById(docId).select("-password");
    console.log("docData:", docData ? "Tìm thấy" : "Không tìm thấy");

    if (!docData) {
      return res.json({ success: false, message: "Không tìm thấy bác sĩ" });
    }

    if (!docData.available) {
      return res.json({ success: false, message: "Bác sĩ không khả dụng" });
    }

    let slots_booked = docData.slots_booked;
    // checking for slot availablity
    if (slots_booked[slotDate]) {
      // kiểm tra xem  slottime đã được đặt chưa
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }

      //Phần này thực thi khi ngày (slotDate) mà người dùng muốn đặt lịch chưa có bất kỳ slot nào được đặt trong đối tượng slots_booked.
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }
    // Lấy thông tin người dùng từ cơ sở dữ liệu
    const userData = await userModel.findById(userId).select("-password");
    console.log("userData:", userData ? "Tìm thấy" : "Không tìm thấy");

    if (!userData) {
      return res.json({
        success: false,
        message: "Không tìm thấy thông tin người dùng",
      });
    }
    //Khi tạo dữ liệu đặt lịch hẹn, không cần lưu thông tin về các slot đã được đặt trong đối tượng docData
    delete docData.slots_booked;
    // Tạo đối tượng appointmentData
    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    console.log("appointmentData được tạo với:", {
      userId: appointmentData.userId ? "Có" : "Không",
      userData: appointmentData.userData ? "Có" : "Không",
    });

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    //Cập nhật lại dữ liệu slots_booked của bác sĩ
    // Sau khi một lịch hẹn được đặt thành công, cần phải cập nhật lại thông tin các slot đã được đặt cho bác sĩ
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    console.log("Lỗi đặt lịch chi tiết:", error);
    res.json({ success: false, message: error.message });
  }
};

// API lịch hẹn của người dùng
const listAppointment = async (req, res) => {
  try {
    // const { userId } = req.body;
    const userId = req.userId;
    const appointments = await appointmentModel.find({ userId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API hủy lịch hẹn
const cancelAppointment = async (req, res) => {
  try {
    // const { userId, appointmentId } = req.body;
    const userId = req.userId;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    // xác thực người dùngdùng
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });
    //releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
};
