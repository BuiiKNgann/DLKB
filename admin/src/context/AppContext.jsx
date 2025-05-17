import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  // ✅ Format tiền VND
  const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  // ✅ Tính tuổi
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };

  // ✅ Tháng tiếng Việt
  const months = [
    "", // index 0 bỏ trống
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  // Format ngày slot đẹp
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_"); // VD: 28_4_2024
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  const value = { calculateAge, slotDateFormat, currencyFormatter };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
