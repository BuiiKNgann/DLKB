import { v2 as cloudinary } from "cloudinary";
const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME, //Tên tài khoản Cloudinary
    api_key: process.env.CLOUDINARY_API_KEY, //Khóa API công khai, dùng để xác thực các yêu cầu tới Cloudinary.
    api_secret: process.env.CLOUDINARY_SECRET_KEY, //Khóa bí mật, dùng để ký các yêu cầu nhạy cảm (như upload hoặc xóa file).
  });
};

export default connectCloudinary;
