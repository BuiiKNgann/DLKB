// export default function Message({ message }) {
//   const isUser = message.role === "user";

//   return (
//     <div
//       className={`flex ${
//         isUser ? "justify-end" : "justify-start"
//       } items-start gap-2`}
//     >
//       {!isUser && (
//         <div className="bg-blue-500 text-white p-2 rounded-full">
//           <svg className="h-6 w-6" viewBox="0 0 1024 1024" fill="currentColor">
//             <path d="M738.3 287.6H285.7c-59 0-106.8 47.8..." />
//           </svg>
//         </div>
//       )}
//       <div
//         className={`p-3 rounded-lg max-w-[75%] ${
//           isUser
//             ? "bg-blue-500 text-white rounded-br-none"
//             : "bg-blue-100 text-gray-800 rounded-bl-none"
//         }`}
//       >
//         {message.content === "..." ? (
//           <div className="flex space-x-1">
//             <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" />
//             <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-150" />
//             <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-300" />
//           </div>
//         ) : (
//           <p className="whitespace-pre-line">{message.content}</p>
//         )}
//       </div>
//     </div>
//   );
// }
export default function Message({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } items-start gap-2`}
    >
      {!isUser && (
        <div className="bg-blue-500 text-white p-2 rounded-full">
          <svg className="h-6 w-6" viewBox="0 0 1024 1024" fill="currentColor">
            <path d="M738.3 287.6H285.7c-59 0-106.8 47.8..." />
          </svg>
        </div>
      )}
      <div
        className={`p-3 rounded-lg max-w-[75%] ${
          isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-blue-100 text-gray-800 rounded-bl-none"
        }`}
      >
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
