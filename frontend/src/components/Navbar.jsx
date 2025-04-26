import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
  };

  return (
    <div className="sticky top-0 z-50 bg-white shadow-md w-full">
      <div className="w-full flex items-center justify-between py-4 px-6 md:px-12 lg:px-16">
        <img
          onClick={() => navigate("/")}
          className="w-44 cursor-pointer transition-transform hover:scale-105"
          src={assets.MediConnect}
          alt="MediConnect Logo"
        />

        <ul className="hidden md:flex items-center gap-8 font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-seconds border-b-2 border-seconds"
                : "text-gray-700 hover:text-seconds"
            }
          >
            <li className="py-2">Trang chủ</li>
          </NavLink>

          <NavLink
            to="/doctors"
            className={({ isActive }) =>
              isActive
                ? "text-seconds border-b-2 border-seconds"
                : "text-gray-700 hover:text-seconds"
            }
          >
            <li className="py-2">Bác sĩ</li>
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-seconds border-b-2 border-seconds"
                : "text-gray-700 hover:text-seconds"
            }
          >
            <li className="py-2">Giới thiệu</li>
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "text-seconds border-b-2 border-seconds"
                : "text-gray-700 hover:text-seconds"
            }
          >
            <li className="py-2">Liên hệ</li>
          </NavLink>
        </ul>

        <div className="flex items-center gap-6">
          {token && userData ? (
            <div className="flex items-center gap-2 cursor-pointer group relative">
              <div className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors">
                <img
                  className="w-8 h-8 rounded-full object-cover border-2 border-seconds"
                  src={userData.image}
                  alt="Profile"
                />
                <img
                  className="w-3 transition-transform group-hover:rotate-180"
                  src={assets.dropdown_icon}
                  alt="Dropdown"
                />
              </div>

              <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
                <div className="min-w-48 bg-white rounded-lg shadow-lg flex flex-col gap-2 p-3 border border-gray-200">
                  <p
                    onClick={() => navigate("my-profile")}
                    className="px-3 py-2 hover:bg-gray-100 hover:text-seconds rounded-md transition-colors cursor-pointer"
                  >
                    Thông tin cá nhân
                  </p>
                  <p
                    onClick={() => navigate("my-appointments")}
                    className="px-3 py-2 hover:bg-gray-100 hover:text-seconds rounded-md transition-colors cursor-pointer"
                  >
                    Lịch khám của tôi
                  </p>
                  <div className="w-full h-px bg-gray-200 my-1"></div>
                  <p
                    onClick={logout}
                    className="px-3 py-2 hover:bg-gray-100 hover:text-red-500 rounded-md transition-colors cursor-pointer"
                  >
                    Đăng xuất
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-seconds text-white px-8 py-3 rounded-full font-medium hidden md:block hover:bg-opacity-90 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Đăng ký
            </button>
          )}

          <button
            onClick={() => setShowMenu(true)}
            className="p-2 rounded-full hover:bg-gray-100 md:hidden flex items-center justify-center"
          >
            <img className="w-6" src={assets.menu_icon} alt="Menu" />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 z-50 bg-white transition-all duration-300 ease-in-out md:hidden ${
            showMenu ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b">
            <img className="w-36" src={assets.logo} alt="Logo" />
            <button
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => setShowMenu(false)}
            >
              <img className="w-6" src={assets.cross_icon} alt="Close" />
            </button>
          </div>

          <ul className="flex flex-col items-center gap-2 mt-8 px-5 text-lg font-medium">
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/"
              className={({ isActive }) =>
                `w-full text-center ${
                  isActive
                    ? "bg-seconds bg-opacity-10 text-seconds"
                    : "text-gray-700"
                }`
              }
            >
              <p className="px-6 py-4 rounded-lg">Trang chủ</p>
            </NavLink>

            <NavLink
              onClick={() => setShowMenu(false)}
              to="/doctors"
              className={({ isActive }) =>
                `w-full text-center ${
                  isActive
                    ? "bg-seconds bg-opacity-10 text-seconds"
                    : "text-gray-700"
                }`
              }
            >
              <p className="px-6 py-4 rounded-lg">Bác sĩ</p>
            </NavLink>

            <NavLink
              onClick={() => setShowMenu(false)}
              to="/about"
              className={({ isActive }) =>
                `w-full text-center ${
                  isActive
                    ? "bg-seconds bg-opacity-10 text-seconds"
                    : "text-gray-700"
                }`
              }
            >
              <p className="px-6 py-4 rounded-lg">Về chúng tôi</p>
            </NavLink>

            <NavLink
              onClick={() => setShowMenu(false)}
              to="/contact"
              className={({ isActive }) =>
                `w-full text-center ${
                  isActive
                    ? "bg-seconds bg-opacity-10 text-seconds"
                    : "text-gray-700"
                }`
              }
            >
              <p className="px-6 py-4 rounded-lg">Liên hệ</p>
            </NavLink>

            {!token && (
              <button
                onClick={() => {
                  navigate("/login");
                  setShowMenu(false);
                }}
                className="mt-4 bg-seconds text-white px-8 py-3 rounded-full font-medium w-4/5 shadow-md"
              >
                Đăng ký
              </button>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
