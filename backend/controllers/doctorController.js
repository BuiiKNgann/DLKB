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

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: "Không tìm thấy lịch khám" });
    }

    if (appointmentData.docId !== docId) {
      return res.json({ success: false, message: "Không có quyền." });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
      cancelReason: Array.isArray(cancelReasons)
        ? cancelReasons
        : [cancelReasons],
    });

    // Cập nhật slot
    const { slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;

    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (e) => e !== slotTime
      );
    }

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
    let earnings = 0;
    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });
    // Tránh tính trùng, 1 bệnh nhân đặt nhiều lịch cũng chỉ tính 1 lần.
    let patients = [];
    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

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
// // ✅ API kiểm tra bác sĩ trống theo chuyên khoa và giờ
// const availableDoctors = async (req, res) => {
//   try {
//     const { speciality, time } = req.query;

//     if (!speciality || !time) {
//       return res.json({
//         success: false,
//         message: "Thiếu chuyên khoa hoặc thời gian",
//       });
//     }

//     const doctors = await doctorModel.find({
//       speciality: { $regex: new RegExp(speciality, "i") },
//       available: true,
//     });

//     // Lọc bác sĩ có slot trống tại thời gian được yêu cầu
//     const result = doctors.filter((doc) => {
//       const slots = doc.slots_booked || {};
//       const bookedTimes = slots[new Date().toISOString().split("T")[0]] || []; // kiểm tra theo ngày hiện tại
//       return !bookedTimes.includes(time);
//     });

//     res.json({
//       success: true,
//       doctors: result.map((d) => ({ id: d._id, name: d.name })),
//     });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };
const availableDoctors = async (req, res) => {
  try {
    const { speciality, time, date } = req.query;
    const targetDate = date || new Date().toISOString().split("T")[0];

    if (!time) {
      return res.json({
        success: false,
        message: "Thiếu thời gian",
      });
    }

    // Nếu có speciality → lọc theo chuyên khoa
    const query = {
      available: true,
    };

    if (speciality) {
      query.speciality = { $regex: new RegExp(speciality, "i") };
    }

    const doctors = await doctorModel.find(query);

    // Lọc bác sĩ còn slot trống tại thời gian được yêu cầu
    const result = doctors.filter((doc) => {
      const slots = doc.slots_booked || {};
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const bookedTimes = slots[today] || [];
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
