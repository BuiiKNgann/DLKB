import { useState, useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatFooter from "./ChatFooter";
import Message from "./Message";

const API_KEY = "AIzaSyA6YFHqj8ukTcTXRkk8OdNwQaloxJm4cZI";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`; // Sử dụng model gemini-1.5-flash

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: "Xin chào 👋 Tôi có thể giúp gì cho bạn hôm nay?" },
  ]);
  //Mảng lưu lịch sử chat
  //role: "user" hoặc "model".
  //parts: Mảng chứa các phần nội dung
  const [chatHistory, setChatHistory] = useState([]);

  //Tham chiếu đến khu vực hiển thị tin nhắn để cuộn tự động.
  const chatBodyRef = useRef(null);

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  //Khi messages thay đổi, gọi scrollToBottom() để cuộn xuống tin nhắn mới nhất.
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //  Danh sách kịch bản đặt lịch khám
  const scriptedResponses = [
    {
      keywords: ["đặt lịch", "khám bệnh", "lịch khám"],
      response:
        "Bạn muốn đặt lịch khám? Vui lòng cho tôi biết: họ tên, số điện thoại, chuyên khoa và thời gian mong muốn.",
    },
    {
      keywords: ["bác sĩ", "chuyên khoa"],
      response:
        "Hiện phòng khám có các chuyên khoa: Nội tổng quát, Tai Mũi Họng, Nhi khoa, Da liễu. Bạn cần khám chuyên khoa nào?",
    },
    {
      keywords: ["thời gian", "giờ làm việc", "mở cửa"],
      response:
        "Phòng khám hoạt động từ 7:30 sáng đến 5:30 chiều, Thứ 2 đến Thứ 7.",
    },
    {
      keywords: ["hủy lịch", "hủy khám"],
      response:
        "Bạn muốn hủy lịch? Vui lòng cung cấp mã lịch hẹn hoặc thông tin đặt lịch trước đó.",
    },
    {
      keywords: ["cảm ơn", "thanks"],
      response: "Rất hân hạnh được hỗ trợ bạn! Nếu cần thêm gì, cứ nhắn nhé.",
    },
  ];
  // Phương thức find duyệt qua mảng scriptedResponses, trả về object đầu tiên thỏa mãn điều kiện hoặc undefined nếu không tìm thấy.
  // Điều kiện: item.keywords.some((keyword) => lowered.includes(keyword)).
  // item.keywords: Mảng từ khóa của một kịch bản (VD: ["đặt lịch", "khám bệnh", "lịch khám"]).
  // some: Kiểm tra xem có ít nhất một keyword nằm trong lowered không.
  // lowered.includes(keyword): Kiểm tra xem chuỗi lowered có chứa keyword không.
  // Ví dụ: Nếu lowered = "tôi muốn đặt lịch khám", keyword = "đặt lịch", thì includes("đặt lịch") trả về true.
  const checkScriptedResponse = (text) => {
    const lowered = text.toLowerCase();
    return (
      scriptedResponses.find((item) =>
        item.keywords.some((keyword) => lowered.includes(keyword))
      )?.response || null
    );
  };
  //xử lý tin nhắn người dùng, thêm tin nhắn vào danh sách hiển thị
  //và kiểm tra xem tin nhắn có chứa chuyên khoa nào không để hỗ trợ đặt lịch khám
  const sendMessage = async (text) => {
    if (!text.trim()) return; // Loại bỏ khoảng trắng đầu/cuối của text

    const newUserMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, newUserMessage]); //giữ lại các tin nhắn cũ, thêm newUserMessage vào cuối.

    //Phát hiện chuyên khoa:
    const specialities = [
      "nội tổng quát",
      "tai mũi họng",
      "nhi khoa",
      "da liễu",
    ];
    const loweredText = text.toLowerCase();
    //find để tìm chuyên khoa đầu tiên có trong loweredText
    const detectedSpeciality = specialities.find(
      (sp) => loweredText.includes(sp) //kiểm tra xem chuỗi loweredText có chứa chuyên khoa sp
    );
    //Nếu tìm thấy, detectedSpeciality là chuỗi (VD: "nội tổng quát").
    //Nếu không, detectedSpeciality là undefined.

    //Trích xuất ngày và giờ từ tin nhắn người dùng để sử dụng trong việc gọi API kiểm tra bác sĩ trống.
    let time = null; //Lưu giờ được trích xuất
    let date = null; //Lưu ngày được trích xuất

    //Tìm ngày trong tin nhắn với các định dạng dd/mm/yyyy, dd-mm-yyyy, hoặc yyyy-mm-dd, sau đó định dạng thành YYYY-MM-DD.
    //     Regex giải thích:
    // (\d{1,2}): Nhóm 1, khớp 1 hoặc 2 chữ số (ngày hoặc năm, ví dụ: 15 hoặc 05).
    // [\/\-]: Khớp ký tự / hoặc - (phân cách).
    // (\d{1,2}): Nhóm 2, khớp 1 hoặc 2 chữ số (tháng).
    // [\/\-]: Phân cách tiếp theo.
    // (\d{4}): Nhóm 3, khớp đúng 4 chữ số (năm).
    // Ví dụ: Với 15/05/2025, regex khớp:
    // Nhóm 1: 15 (ngày).
    // Nhóm 2: 05 (tháng).
    // Nhóm 3: 2025 (năm).
    const dateRegex = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/;
    const dateMatch = text.match(dateRegex); //tìm chuỗi trong text khớp với dateRegex (ví dụ người dùng nhập ngày để tìm bác sĩ)
    //// dateMatch = ["15_5_2025", "15", "5", "2025"]
    //   destructuring mảng dateMatch vì thay vì truy cập các phần tử của dateMatch bằng chỉ số:
    // _: Bỏ qua phần tử đầu tiên (dateMatch[0]).
    // d: Ngày (dateMatch[1]).
    // m: Tháng (dateMatch[2]).
    // y: Năm (dateMatch[3]).

    //Bạn có thể sử dụng destructuring để gán trực tiếp các phần tử vào biến
    if (dateMatch) {
      const [_, d, m, y] = dateMatch;
      //  Tạo chuỗi date định dạng YYYY-MM-DD.
      // m.padStart(2, "0"): Đảm bảo tháng có 2 chữ số (ví dụ: "5" → "05").
      // d.padStart(2, "0"): Đảm bảo ngày có 2 chữ số.
      date = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    } else {
      // Mặc định hôm nay nếu không có ngày
      date = new Date().toISOString().split("T")[0];
    }

    // Tách giờ
    // Ví dụ: Với text = "Khám ngày 15/05/2025 lúc 9h", nếu không xóa 15/05/2025, timeRegex có thể khớp 15 (ngày) thay vì 9 (giờ).
    const textWithoutDate = text.replace(dateRegex, "");

    //?: Toàn bộ phần phút này không bắt buộc
    //\s*: Tìm khoảng trắng (
    // \i: Không quan tâm hoa/thường
    //(\d{1,2}): Tìm 1 đến 2 số cho ngày
    //(\d{0,2}): Tìm 0 đến 2 số cho phút
    //gom một số phần lại để dễ tìm, nhưng không lưu phần đó vào danh sách kết quả. Đây là non-capturing group ((?:...)),
    const timeRegex =
      /(\d{1,2})(?:[:h giờ]?(\d{0,2}))?(?:\s*(sáng|chiều|tối|am|pm))?/i;
    const timeMatch = textWithoutDate.match(timeRegex);
    //phương thức match để tìm chuỗi trong textWithoutDate khớp với timeRegex. Kết quả được lưu vào timeMatch.
    // _: Bỏ qua phần tử 0 (chuỗi khớp hoàn chỉnh, VD: "9h30 sáng"), vì không cần dùng.
    // h: Lấy phần tử 1 (giờ, VD: "9").
    // m: Lấy phần tử 2 (phút, VD: "30" hoặc "").
    // period: Lấy phần tử 3 (khoảng thời gian, VD: "sáng" hoặc undefined).
    if (timeMatch) {
      let [_, h, m, period] = timeMatch;
      h = parseInt(h);
      m = m ? parseInt(m) : 0;

      if (period) {
        period = period.toLowerCase();
        //// ví dụ 3 giờ chiều => bé hơn 12h thì cộng thêm 12 cho giờ đã ở định dạng 24 giờ
        //h = 3, period = "pm" → h = 3 + 12 = 15.
        if (["chiều", "tối", "pm"].includes(period) && h < 12) h += 12;
        if (["sáng", "am"].includes(period) && h === 12) h = 0;
      }
      //Đoạn code này là bước trung gian trong việc trích xuất giờ từ tin nhắn để tạo chuỗi time (VD: "09:30")
      //Dùng h và m để tạo chuỗi HH:MM (VD: h = 9, m = 30 → time = "09:30").
      const hourStr = h.toString().padStart(2, "0");
      const minStr = m.toString().padStart(2, "0");
      time = `${hourStr}:${minStr}`;
    }

    if (time || detectedSpeciality) {
      const loadingMessage = {
        role: "bot",
        content: "Đang kiểm tra bác sĩ còn trống...",
      };
      //Lấy danh sách tin nhắn hiện tại (prev).
      //Thêm loadingMessage vào cuối danh sách bằng toán tử spread ([...prev, loadingMessage]).
      setMessages((prev) => [...prev, loadingMessage]);
      //Tạo URL cho yêu cầu GET tới API backend, bao gồm các tham số time, speciality, và date.
      try {
        let url = `http://localhost:4000/api/doctor/available?time=${
          time || "09:00"
        }`;
        //Nếu detectedSpeciality tồn tại
        //, thêm query parameter speciality.
        //encodeURIComponent(detectedSpeciality): Mã hóa giá trị để xử lý ký tự đặc biệt   khi gửi dữ liệu qua URL
        //Đảm bảo tính toàn vẹn dữ liệu: Khi gửi dữ liệu qua HTTP (GET/POST), các ký tự đặc biệt có thể làm hỏng cấu trúc của URL
        if (detectedSpeciality) {
          url += `&speciality=${encodeURIComponent(detectedSpeciality)}`;
        }
        //Nếu date tồn tại (VD: "2025-05-15"), thêm query parameter date
        if (date) {
          url += `&date=${date}`;
        }
        //Gửi yêu cầu GET tới URL API và chuyển phản hồi thành dữ liệu JSON.
        const res = await fetch(url);
        const data = await res.json();
        //Xử lý dữ liệu và tạo tin nhắn phản hồi
        //Thành công, có bác sĩ
        const reply = data.success
          ? data.doctors.length > 0 //Tạo chuỗi thông báo với danh sách bác sĩ
            ? `Bác sĩ ${
                detectedSpeciality || ""
              } còn trống lúc ${time} ngày ${date}:\n${data.doctors
                // Lặp qua mảng doctors, tạo danh sách liên kết HTML cho mỗi bác sĩ
                .map(
                  (d) =>
                    `• <a href="/appointment/${d.id}" class="text-blue-600 underline hover:text-blue-800" target="_blank">${d.name}</a>`
                )
                .join("<br>")}\nBạn muốn đặt với ai?`
            : `Không có bác sĩ ${
                // Tạo tin nhắn thông báo không có bác sĩ.
                detectedSpeciality ? `${detectedSpeciality} ` : ""
              }trống lúc ${time} ngày ${date}.`
          : `Không thể kiểm tra bác sĩ: ${data.message}`;
        //Cập nhật tin nhắn phản hồi
        //prev: Danh sách tin nhắn hiện tại.
        //prev.slice(0, -1): Lấy tất cả tin nhắn trừ tin nhắn cuối (tin nhắn loading).
        //reply : nội dung
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "bot", content: reply },
        ]);
        return;
      } catch (err) {
        console.error("Lỗi khi gọi API bác sĩ:", err.message);
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            role: "bot",
            content: "Có lỗi xảy ra khi kiểm tra bác sĩ. Vui lòng thử lại sau!",
          },
        ]);
        return;
      }
    }

    //  Check kịch bản
    //Hàm này nhận text (tin nhắn người dùng) và chuyển thành chữ thường (lowered) để so sánh không phân biệt hoa thường và check xem trong đó có keyword khôngkhông
    const scriptedReply = checkScriptedResponse(text);
    if (scriptedReply) {
      const scriptedBotMessage = { role: "bot", content: scriptedReply }; //content: scriptedReply: Nội dung phản hồi theo kịch bản.
      setMessages((prev) => [...prev, scriptedBotMessage]); //giữ các tin nhắn cũ và thêm tin nhắn bot mới vào cuối.
      return;
    }

    //Hiển thị tin nhắn "Đang xử lý"
    const thinkingMessage = { role: "bot", content: "..." };
    setMessages((prev) => [...prev, thinkingMessage]); //thêm tin nhắn "..." vào cuối mảng.
    //Gọi API Gemini
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, //Định dạng dữ liệu gửi đi là JSON.
        mode: "cors", // tránh lỗi CORS khi gọi API từ một miền khác.
        body: JSON.stringify({
          contents: [...chatHistory, { role: "user", parts: [{ text }] }],
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Lỗi API Gemini: ${response.status} ${response.statusText}`
        );
      }
      //để trích xuất nội dung văn bản từ phản hồi JSON của API Gemini
      //? cho phép truy cập vào các thuộc tính hoặc phần tử của một đối tượng mà không gây lỗi nếu một phần trong chuỗi truy cập là null hoặc undefined.
      //candidates thường là một mảng chứa các phản hồi tiềm năng từ mô hình AI
      //data?.candidates: Truy cập vào mảng candidates trong data.
      //[0]: Truy cập vào phần tử đầu tiên của mảng candidates.
      // Giả định: API Gemini trả về một mảng candidates, và phần tử đầu tiên ([0]) chứa phản hồi chính (hoặc phản hồi được ưu tiên).

      //data?.candidates?.[0]?.content
      //content: Thuộc tính này nằm trong đối tượng tại candidates[0]. Nó chứa nội dung của phản hồi từ mô hình AI.
      //Giả định: candidates[0] là một đối tượng có thuộc tính content.
      //parts thường là một mảng chứa các phần của nội dung phản hồi (ví dụ: các đoạn văn bản, hình ảnh, hoặc các loại dữ liệu khác).
      //text: Thuộc tính này nằm trong parts[0]. Nó chứa chuỗi văn bản thực tế của phản hồi từ mô hình AI.

      //{ candidates: [{ content: { parts: [{ text: "Nội dung phản hồi" }] } }]}
      //       Quy trình:
      // Bắt đầu từ data (JSON từ API).
      // Truy cập mảng candidates, lấy phần tử đầu tiên ([0]).
      // Lấy đối tượng content, rồi mảng parts bên trong.
      // Lấy phần tử đầu tiên của parts ([0]) và thuộc tính text.
      const data = await response.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Xin lỗi, tôi không hiểu.";

      setMessages((prev) => [
        ...prev.slice(0, -1), //Lấy tất cả tin nhắn trừ tin nhắn cuối cùng
        { role: "bot", content: reply },
      ]);
      setChatHistory((prev) => [
        ...prev,
        { role: "user", parts: [{ text }] }, //Tin nhắn của người dùng
        { role: "model", parts: [{ text: reply }] }, //Phản hồi của mô hình
      ]);
    } catch (error) {
      console.error("Lỗi khi gọi API Gemini:", error.message);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "bot", content: `Có lỗi xảy ra: ${error.message}` },
      ]);
    }
  };

  return (
    <div>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600"
      >
        {isOpen ? "✖" : "💬"}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-8 w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[9999]">
          <ChatHeader onClose={() => setIsOpen(false)} />
          <div
            ref={chatBodyRef}
            className="p-4 space-y-4 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
          >
            {/* messages là một mảng state chứa các tin nhắn (giả định từ đoạn mã trước, có dạng { role: "user" | "bot", content: string }).
Lặp qua từng msg trong messages, render component Message. */}
            {messages.map((msg, idx) => (
              // Message là component riêng để hiển thị một tin nhắn.
              // key={idx}: Đảm bảo React phân biệt các tin nhắn (dùng chỉ số idx làm key, nhưng lý tưởng nên dùng ID duy nhất nếu có).
              // message={msg}: Truyền đối tượng tin nhắn (msg) để Message hiển thị nội dung và định dạng (ví dụ: tin nhắn người dùng bên phải, bot bên trái).
              <Message key={idx} message={msg} />
            ))}
          </div>
          <ChatFooter onSend={sendMessage} />
        </div>
      )}
    </div>
  );
}
