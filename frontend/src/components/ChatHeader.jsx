import React from "react";
import { Menu } from "lucide-react";

const ChatHeader = ({ title, onToggleSidebar }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-white truncate">{title}</h1>
          <p className="text-sm text-gray-400">ChatGPT Clone</p>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
