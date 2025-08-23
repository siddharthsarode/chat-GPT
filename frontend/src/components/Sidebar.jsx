import React from "react";
import {
  Plus,
  MessageSquare,
  Settings,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const Sidebar = ({
  chats,
  selectedChatId,
  isOpen,
  onToggle,
  onNewChat,
  onSelectChat,
}) => {
  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          w-64 h-full bg-gray-900 flex flex-col
        `}
      >
        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors group"
          >
            <Plus size={18} className="text-gray-400 group-hover:text-white" />
            <span className="text-sm font-medium">New chat</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-4">
          <div className="space-y-1">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors group
                  ${
                    selectedChatId === chat.id
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                <MessageSquare size={16} className="flex-shrink-0" />
                <span className="text-sm truncate">{chat.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-700">
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white">
              <Settings size={16} />
              <span className="text-sm">Settings</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white">
              <User size={16} />
              <span className="text-sm">Profile</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white">
              <LogOut size={16} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
