import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModels.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import mongoose from "mongoose";
import reviewModel from "../models/reviewModels.js";

const addFavoriteDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const userId = req.userId;

    // 🔥 Kiểm tra doctorId hợp lệ
    if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId)) {
      return res
        .status(400)
        .json({ success: false, message: "Mã bác sĩ hợp lệ" });
    }

    // 🔥 Tìm doctor
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy bác sĩ" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }

    if (user.favoriteDoctors.includes(doctorId)) {
      return res
        .status(400)
        .json({ success: false, message: "Đã thêm bác sĩ vào yêu thích" });
    }

    user.favoriteDoctors.push(doctorId);
    await user.save();

    return res
      .status(200)
      .json({ success: true, favoriteDoctors: user.favoriteDoctors });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
// API: Lấy danh sách bác sĩ yêu thích
export const getFavoriteDoctors = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId).populate("favoriteDoctors");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }

    return res.status(200).json({
      success: true,
      favoriteDoctors: user.favoriteDoctors,
    });
  } catch (error) {
    console.error("GetFavoriteDoctors Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// API: Xoá bác sĩ khỏi danh sách yêu thích
export const removeFavoriteDoctor = async (req, res) => {
  try {
    const userId = req.userId;
    const { doctorId } = req.params;

    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }

    if (!user.favoriteDoctors.includes(doctorId)) {
      return res
        .status(400)
        .json({ success: false, message: "Bác sĩ không có trong yêu thích" });
    }

    user.favoriteDoctors = user.favoriteDoctors.filter(
      (favId) => favId.toString() !== doctorId
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Đã xóa bác sĩ khỏi yêu thích",
      favoriteDoctors: user.favoriteDoctors,
    });
  } catch (error) {
    console.error("RemoveFavoriteDoctor Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Đăng ký người dùng
//req (request): Chứa dữ liệu gửi từ client
//res (response): Dùng để gửi phản hồi về client, thường dưới dạng JSON.
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
    //Tạo một đối tượng người dùng mới dựa trên schema

    const user = await newUser.save();
    //id người dùng sẽ được mã dựa vào JWT_SECRET này
    //Khi người dùng gửi lại chuỗi JWT, server sử dụng JWT_SECRET để xác minh
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
    //So sánh mật khẩu
    //Mật khẩu dạng plaintext mà người dùng nhập (password) khi đăng nhập.
    //Mật khẩu đã được mã hóa (user.password) được lưu trong cơ sở dữ liệu khi người dùng đăng ký.
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

const getProfile = async (req, res) => {
  try {
    const userData = await userModel.findById(req.userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Thiếu thông tin" });
    }

    const updateData = {
      name,
      phone,
      dob,
      gender,
      address: typeof address === "string" ? JSON.parse(address) : address,
    };
    // Xử lý tải ảnh lên Cloudinary
    //imageFile.path: Đường dẫn đến file ảnh trên server.
    //resource_type: "image": Chỉ định loại tài nguyên là ảnh (Cloudinary cũng hỗ trợ video, file thô, v.v.).
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      //Thêm trường image vào đối tượng updateData với giá trị là URL của ảnh
      //updateData là đối tượng chứa các thông tin cần cập nhật (như name, phone, address, dob, gender)
      updateData.image = imageUpload.secure_url;
    }

    await userModel.findByIdAndUpdate(userId, updateData);
    res.json({ success: true, message: "Cập nhật thông tin thành công" });
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
    const { docId, slotDate, slotTime } = req.body; //Destructuring từ req.body

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
    //Lấy danh sách slot đã đặt
    let slots_booked = docData.slots_booked;
    // checking for slot availablity
    //Kiểm tra xem slotDate đã tồn tại trong slots_booked
    //Key là ngày (slotDate), value là mảng các giờ (slotTime) đã được đặt.
    if (slots_booked[slotDate]) {
      //Nếu slotDate tồn tại trong slots_booked thì kiểm tra xem  slottime đã được đặt chưa
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Lịch không còn trống" });
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
    const userId = req.userId;
    const appointments = await appointmentModel.find({ userId });
    // Kết quả: Biến appointments chứa danh sách các lịch hẹn
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API user hủy lịch hẹn
const cancelAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId, cancelReasons } = req.body; // ✨ nhận thêm cancelReasons

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }
    //Cập nhật trạng thái lịch hẹn
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
      // Lưu lý do hủy
      cancelReason:
        Array.isArray(cancelReasons) && cancelReasons.length > 0
          ? cancelReasons
          : ["Người dùng tự hủy"], // nếu user không chọn lý do, fallback lý do mặc định
    });
    //Cập nhật khung giờ bác sĩ
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;
    //Đảm bảo ngày slotDate tồn tại trong slots_booked (có khung giờ đã đặt).
    if (slots_booked && slots_booked[slotDate]) {
      //Loại bỏ slotTime khỏi mảng khung giờ của ngày slotDate.
      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (e) => e !== slotTime
      );
      // Nếu mảng slots_booked[slotDate] trở thành rỗng,xóa khóa slotDate khỏi slots_booked.
      if (slots_booked[slotDate].length === 0) {
        delete slots_booked[slotDate];
      }
    }

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Đã hủy lịch khám" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// đánh giá bác sĩ
const addReview = async (req, res) => {
  try {
    const { doctorId, rating, comment } = req.body;
    const userId = req.userId; // lấy từ middleware authUser
    //Sử dụng mongoose.Types.ObjectId.isValid để kiểm tra xem doctorId có đúng định dạng ObjectId của MongoDB hay không.
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid doctorId" });
    }

    // 1. Kiểm tra xem đã khám bác sĩ này và hoàn thành chưa
    const appointment = await appointmentModel.findOne({
      userId,
      docId: doctorId,
      isCompleted: true,
    });

    if (!appointment) {
      return res.status(400).json({
        success: false,
        message: "Bạn chưa hoàn thành lịch khám với bác sĩ này",
      });
    }

    // 2. Kiểm tra xem đã review bác sĩ này chưa
    const existingReview = await reviewModel.findOne({
      user: userId,
      doctor: doctorId,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ success: false, message: "Bạn đã đánh giá bác sĩ này rồi" });
    }

    // 3. Lưu review
    const newReview = await reviewModel.create({
      user: userId,
      doctor: doctorId,
      rating,
      comment,
    });

    // 4. Cập nhật điểm trung bình cho bác sĩ
    //Tìm thông tin bác sĩ dựa trên doctorId và lấy danh sách các đánh giá liên quan.
    const doctor = await doctorModel.findById(doctorId).populate("reviews");

    //Thêm ID của đánh giá mới (newReview._id) vào mảng reviews của bác sĩ.
    doctor.reviews.push(newReview._id);
    //Truy vấn tất cả các đánh giá trong reviewModel liên quan đến bác sĩ có ID là doctorId.
    const allReviews = await reviewModel.find({ doctor: doctorId });
    //Tính tổng điểm đánh giá
    const totalRating = allReviews.reduce((acc, item) => acc + item.rating, 0);
    doctor.averageRating = totalRating / allReviews.length;

    await doctor.save();

    return res
      .status(200)
      .json({ success: true, message: "Đánh giá thành công" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing doctorId" });
    }

    // Tìm tất cả review của doctor đó, populate thêm tên người dùng
    const reviews = await reviewModel
      .find({ doctor: doctorId })
      .populate("user", "name image");

    return res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("GetReview Error:", error);
    return res.status(500).json({ success: false, message: error.message });
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
  addFavoriteDoctor,
  addReview,
  getReviews,
};
