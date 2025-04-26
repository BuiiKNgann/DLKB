import multer from "multer";

//diskStorage	Cấu hình cách lưu file
const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
  // file.originalname: giữ nguyên tên gốc của file
});
//Khi có người upload file, hãy lưu file xuống ổ đĩa, và dùng config này để quyết định tên file.
const upload = multer({ storage });
export default upload;
