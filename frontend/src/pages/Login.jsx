import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          password,
          email,
        });

        //Lưu token vào trình duyệt thông qua localStorage
        //Cập nhật state toàn cục (token) trong React app qua setToken
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.messge);
        }
        // const { data } lấy dữ liệu từ server sau khi gọi apiapi, bao gồm token (JWT) mà bạn hỏi trước đó. Token này được lưu vào localStorage để sử dụng cho các yêu cầu xác thực sau.
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          password,
          email,
        });
        //localStorage: Là một cơ chế lưu trữ dữ liệu phía client, cho phép lưu trữ các cặp key-value dưới dạng chuỗi.
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.messge);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);
  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Đăng ký" : "Đăng nhập"}
        </p>

        {state === "Sign Up" && (
          <div className="w-full">
            <p>Tên</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className="w-full">
          <p>Mật khẩu</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-seconds text-white w-full py-2 rounded-md text-base"
        >
          {state === "Sign Up" ? "Tạo tài khoản" : "Đăng nhập"}
        </button>
        {state === "Sign Up" ? (
          <p>
            Bạn đã có tài khoản?{" "}
            <span
              onClick={() => setState("login")}
              className="text-seconds underline cursor-pointer"
            >
              Đăng nhập
            </span>
          </p>
        ) : (
          <p>
            Tạo tài khoản?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-seconds underline cursor-pointer"
            >
              {" "}
              Nhấn vào đây
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
