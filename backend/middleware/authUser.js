import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized. Please login again.",
      });
    }
    // Giải mã token
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = tokenDecoded.id;
    next();
  } catch (error) {
    console.log("Auth error:", error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;

// Kiểm tra token: Lấy token từ req.headers, nếu không có, trả về lỗi "Not Authorized".
// Xác minh token: Giải mã token bằng jwt.verify với khóa bí mật (JWT_SECRET).
// Gán ID người dùng: Lưu ID người dùng từ token vào req.userId.
// Chuyển tiếp: Gọi next() để tiếp tục xử lý nếu xác thực thành công.
// Xử lý lỗi: Bắt lỗi (token không hợp lệ, hết hạn) và trả về thông báo lỗi.
