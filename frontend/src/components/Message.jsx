export default function Message({ message }) {
  const isUser = message.role === "user"; //Kiểm tra vai trò của tin nhắn

  return (
    //Nếu isUser là true (người dùng): justify-end → đẩy nội dung sang bên phải.
    // Nếu isUser là false (bot): justify-start → đẩy nội dung sang bên trái.
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } items-start gap-2`}
    >
      {/* Biểu tượng bot */}
      {!isUser && (
        <div className="bg-blue-500 text-white p-2 rounded-full">
          <svg className="h-6 w-6" viewBox="0 0 1024 1024" fill="currentColor">
            <path d="M738.3 287.6H285.7c-59 0-106.8 47.8..." />
          </svg>
        </div>
      )}
      {/* Nội dung tin nhắn */}
      <div
        className={`p-3 rounded-lg max-w-[75%] ${
          isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-blue-100 text-gray-800 rounded-bl-none"
        }`}
      >
        {/* Xử lý nội dung tin nhắn */}
        {message.content === "..." ? (
          <div className="flex space-x-1">
            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-150" />
            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-300" />
          </div>
        ) : (
          <div
            className="whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: message.content }}
          />
        )}
      </div>
    </div>
  );
}
// whitespace-pre-line: Đảm bảo định dạng văn bản từ API (như xuống dòng)
// Ý nghĩa:
// dangerouslySetInnerHTML là một thuộc tính đặc biệt của React, cho phép chèn trực tiếp mã HTML vào một phần tử DOM và render nó như HTML thay vì văn bản thuần túy.
// Cú pháp: {{ __html: string }}, trong đó string là chuỗi chứa mã HTML.
// Trong trường hợp này:
// message.content là chuỗi nội dung tin nhắn (có thể là văn bản thuần, HTML, hoặc chứa dấu xuống dòng).
// dangerouslySetInnerHTML={{ __html: message.content }} yêu cầu React render message.content như HTML.
