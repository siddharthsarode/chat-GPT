import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

const InputBox = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-end gap-3 p-3 bg-gray-700 rounded-lg border border-gray-600 focus-within:border-gray-500">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message ChatGPT..."
          className="flex-1 bg-transparent text-white placeholder-gray-400 resize-none outline-none min-h-[24px] max-h-32"
          rows={1}
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className={`
            p-2 rounded-lg transition-colors flex-shrink-0
            ${
              message.trim()
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          <Send size={16} />
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-500 text-center">
        Press Enter to send, Shift + Enter for new line
      </div>
    </form>
  );
};

export default InputBox;
