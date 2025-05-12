import { useState, useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatFooter from "./ChatFooter";
import Message from "./Message";

const API_KEY = "AIzaSyA6YFHqj8ukTcTXRkk8OdNwQaloxJm4cZI";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: "Xin chào 👋 Tôi có thể giúp gì cho bạn hôm nay?" },
  ]);

  const [chatHistory, setChatHistory] = useState([
    { role: "model", parts: [{}] },
  ]);

  const chatBodyRef = useRef(null);

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 🔥 Danh sách kịch bản đặt lịch khám
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

  const checkScriptedResponse = (text) => {
    const lowered = text.toLowerCase();
    return (
      scriptedResponses.find((item) =>
        item.keywords.some((keyword) => lowered.includes(keyword))
      )?.response || null
    );
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const newUserMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, newUserMessage]);

    const specialities = [
      "nội tổng quát",
      "tai mũi họng",
      "nhi khoa",
      "da liễu",
    ];
    const loweredText = text.toLowerCase();
    const detectedSpeciality = specialities.find((sp) =>
      loweredText.includes(sp)
    );

    // ✅ Tách ngày: dd/mm/yyyy hoặc dd-mm-yyyy hoặc yyyy-mm-dd
    let time = null;
    let date = null;

    const dateRegex = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/;
    const dateMatch = text.match(dateRegex);
    if (dateMatch) {
      const [_, d, m, y] = dateMatch;
      date = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    } else {
      // Mặc định hôm nay nếu không có ngày
      date = new Date().toISOString().split("T")[0];
    }

    // ✅ Tách giờ: sau khi loại bỏ ngày ra khỏi văn bản để tránh hiểu nhầm số
    const textWithoutDate = text.replace(dateRegex, "");

    const timeRegex =
      /(\d{1,2})(?:[:h giờ]?(\d{0,2}))?(?:\s*(sáng|chiều|tối|am|pm))?/i;
    const timeMatch = textWithoutDate.match(timeRegex);

    if (timeMatch) {
      let [_, h, m, period] = timeMatch;
      h = parseInt(h);
      m = m ? parseInt(m) : 0;

      if (period) {
        period = period.toLowerCase();
        if (["chiều", "tối", "pm"].includes(period) && h < 12) h += 12;
        if (["sáng", "am"].includes(period) && h === 12) h = 0;
      }

      const hourStr = h.toString().padStart(2, "0");
      const minStr = m.toString().padStart(2, "0");
      time = `${hourStr}:${minStr}`;
    }

    if (time || detectedSpeciality) {
      const loadingMessage = {
        role: "bot",
        content: "🔎 Đang kiểm tra bác sĩ còn trống...",
      };
      setMessages((prev) => [...prev, loadingMessage]);

      try {
        let url = `http://localhost:4000/api/doctor/available?time=${
          time || "09:00"
        }`;
        if (detectedSpeciality) {
          url += `&speciality=${encodeURIComponent(detectedSpeciality)}`;
        }
        if (date) {
          url += `&date=${date}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        const reply = data.success
          ? data.doctors.length > 0
            ? `✅ Bác sĩ ${
                detectedSpeciality || ""
              } còn trống lúc ${time} ngày ${date}:\n${data.doctors
                .map(
                  (d) =>
                    `• <a href="/appointment/${d.id}" class="text-blue-600 underline hover:text-blue-800" target="_blank">${d.name}</a>`
                )
                .join("<br>")}\nBạn muốn đặt với ai?`
            : `❌ Không có bác sĩ ${
                detectedSpeciality ? `${detectedSpeciality} ` : ""
              }trống lúc ${time} ngày ${date}.`
          : `⚠️ Không thể kiểm tra bác sĩ: ${data.message}`;

        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "bot", content: reply },
        ]);
        return;
      } catch (err) {
        console.error(err);
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            role: "bot",
            content:
              "❗ Có lỗi xảy ra khi kiểm tra bác sĩ. Vui lòng thử lại sau!",
          },
        ]);
        return;
      }
    }

    // 🔥 Check kịch bản
    const scriptedReply = checkScriptedResponse(text);
    if (scriptedReply) {
      const scriptedBotMessage = { role: "bot", content: scriptedReply };
      setMessages((prev) => [...prev, scriptedBotMessage]);
      return;
    }

    // 🤖 Nếu không khớp ➝ gọi Gemini API
    const thinkingMessage = { role: "bot", content: "..." };
    setMessages((prev) => [...prev, thinkingMessage]);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [...chatHistory, { role: "user", parts: [{ text }] }],
        }),
      });

      const data = await response.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Xin lỗi, tôi không hiểu.";

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "bot", content: reply },
      ]);
      setChatHistory((prev) => [
        ...prev,
        { role: "user", parts: [{ text }] },
        { role: "model", parts: [{ text: reply }] },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "bot", content: "Có lỗi xảy ra!" },
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
            {messages.map((msg, idx) => (
              <Message key={idx} message={msg} />
            ))}
          </div>
          <ChatFooter onSend={sendMessage} />
        </div>
      )}
    </div>
  );
}
