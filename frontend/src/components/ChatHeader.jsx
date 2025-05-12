export default function ChatHeader({ onClose }) {
  return (
    <div className="flex items-center justify-between p-4 bg-blue-500 text-white">
      <div className="flex items-center gap-2">
        <div className="bg-white p-1 rounded-full">
          {/* <svg
            className="h-8 w-8 text-blue-500"
            viewBox="0 0 1024 1024"
            fill="currentColor"
          >
            <path d="M738.3 287.6H285.7c-59 0-106.8 47.8..." />
          </svg> */}
        </div>
        <h2 className="font-bold text-lg">Chatbot</h2>
      </div>
      <button onClick={onClose} className="text-xl">
        ⮟
      </button>
    </div>
  );
}
