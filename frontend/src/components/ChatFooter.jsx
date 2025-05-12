import { useState } from "react";
import { FaRegSmile, FaPaperPlane } from "react-icons/fa";

export default function ChatFooter({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div className="p-4 border-t flex items-center gap-2">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Message..."
        className="flex-1 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows={1}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <button className="text-blue-500 text-xl hover:text-blue-700 transition">
        <FaRegSmile />
      </button>
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
      >
        <FaPaperPlane />
      </button>
    </div>
  );
}
