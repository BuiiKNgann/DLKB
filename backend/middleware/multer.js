import multer from "multer";

//diskStorage	Cấu hình cách lưu file
const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
  // file.originalname: giữ nguyên tên gốc của file
});
//multer.diskStorage là một hàm của multer dùng để cấu hình cách lưu file vào đĩa (disk).
//Khi có người upload file, hãy lưu file xuống ổ đĩa, và dùng config này để quyết định tên file.
//Multer được dùng để xử lý các yêu cầu HTTP có chứa dữ liệu dạng multipart/form-data (thường dùng khi upload file)Tạo một cấu hình lưu trữ file bằng phương thức diskStorage của Multer. diskStorage cho phép kiểm soát cách file được lưu trên ổ đĩa, bao gồm:
//Tạo một cấu hình lưu trữ file bằng phương thức diskStorage của Multer. diskStorage cho phép kiểm soát cách file được lưu trên ổ đĩa
//  Hàm filename quyết định tên của file khi lưu trên server.
// Các tham số:
// req: Đối tượng request từ client.
// file: Thông tin về file được upload (ví dụ: tên gốc, kích thước, loại file...).
// callback: Hàm gọi lại để trả về kết quả.
// callback(null, file.originalname):
// null: Không có lỗi.
// file.originalname: Giữ nguyên tên gốc của file mà client đã upload (ví dụ: nếu client upload file avatar.jpg, file lưu trên server cũng sẽ có tên avatar.jpg).

const upload = multer({ storage });
//instance là một đối tượng được tạo ra từ hàm multer với cấu hình cụ thể (như storage).
//Dòng này khởi tạo một instance của multer với cấu hình storage mà bạn đã định nghĩa.
//Multer được cấu hình để lưu file xuống ổ đĩa (với diskStorage) và sử dụng tên gốc của file.
export default upload;

//Tóm tắt ngắn gọn:
// Đoạn code sử dụng thư viện multer để xử lý upload file trong Node.js:
// const storage = multer.diskStorage({...}): Cấu hình cách lưu file, giữ nguyên tên gốc (file.originalname).
// const upload = multer({ storage }): Tạo middleware upload để xử lý file upload, lưu file vào đĩa theo cấu hình storage.

//Ý nghĩa:
// Cho phép ứng dụng nhận và lưu file từ client (qua form hoặc API) vào máy chủ.
// Middleware upload có thể dùng trong Express để xử lý file trong các route, ví dụ: upload.single('file') để xử lý một file duy nhất.
