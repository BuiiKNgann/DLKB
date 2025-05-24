import multer from "multer";

//diskStorage	Cấu hình cách lưu file
const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
  // file.originalname: giữ nguyên tên gốc của file
});

const upload = multer({ storage });
export default upload;
//Khi bạn gọi multer({ storage }), bạn đang tạo một instance (phiên bản) của Multer với cấu hình storage. Instance này sẽ xử lý file theo cách bạn đã thiết lập trong storage.
