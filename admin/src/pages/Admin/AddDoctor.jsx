import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 năm");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("Bác sĩ đa khoa");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (!docImg) {
        return toast.error("Image Not Selected");
      }
      //Tạo object FormData để chứa dữ liệu form
      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );
      //formData được dùng vì endpoint yêu cầu gửi file ảnh (req.file) và dữ liệu văn bản
      formData.forEach((value, key) => {
        console.log(`${key} : ${value}`);
      });
      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        // reset lại form
        setDocImg(false);
        setName("");
        setPassword("");
        setEmail("");
        setAddress1("");
        setAddress2("");
        setDegree("");
        setAbout("");
        setFees("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };
  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium ">Thêm bác sĩ</p>
      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            {/* URL.createObjectURL(docImg): Tạo một URL tạm thời từ docImg để
            trình duyệt có thể hiển thị ảnh xem trước. */}
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer "
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p>Thêm ảnh</p>
        </div>
        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600 ">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Tên bác sĩ </p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border rounded px-3 py-2"
                type="text"
                placeholder=""
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Email </p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border rounded px-3 py-2"
                type="email"
                placeholder=""
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>mật khẩu </p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border rounded px-3 py-2"
                type="password"
                placeholder=""
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Kinh nghiệm</p>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="border rounded px-3 py-2"
                name=""
                id=""
              >
                <option value="1 năm">1 năm</option>
                <option value="2 năm">2 năm</option>
                <option value="3 năm">3 năm</option>
                <option value="4 năm">4 năm</option>
                <option value="5 năm">5 năm</option>
                <option value="6 năm">6 năm</option>
                <option value="7 năm">7 năm</option>
                <option value="8 năm">8 năm</option>
                <option value="9 năm">9 năm</option>
                <option value="10 năm">10 năm</option>
                <option value="11 năm">11 năm</option>
                <option value="12 năm">12 năm</option>
                <option value="13 năm">13 năm</option>
                <option value="14 năm">14 năm</option>
                <option value="15 năm">15 năm</option>
                <option value="16 năm">16 năm</option>
                <option value="17 năm">17 năm</option>
                <option value="18 năm">18 năm</option>
                <option value="19 năm">19 năm</option>
                <option value="20 năm">20 năm</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Phí khám bệnh: </p>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className="border rounded px-3 py-2"
                type="number"
                placeholder=""
                required
              />
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Chuyên khoa</p>
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                className="border rounded px-3 py-2"
                name=""
                id=""
              >
                <option value="Tổng quát">Tổng quát</option>
                <option value="Sản phụ khoa">Sản phụ khoa</option>
                <option value="Da liễu">Da liễu</option>
                <option value="Nhi khoa">Nhi khoa</option>
                <option value="Thần kinh">Thần kinh</option>
                <option value="Tiêu hóa">Tiêu hóa</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Học vấn </p>
              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                className="border rounded px-3 py-2"
                type="text"
                placeholder=""
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Địa chỉ</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className="border rounded px-3 py-2"
                type="text"
                placeholder=""
                required
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className="border rounded px-3 py-2"
                type="text"
                placeholder=""
                required
              />
            </div>
          </div>
        </div>

        <div>
          <p className="mt-4 mb-2">Về bác sĩ </p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full px-4 pt-2 border rounded"
            placeholder=""
            rows={5}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-primary px-10 py-3 mt-4 text-white rounded-full "
        >
          Thêm bác sĩ
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
