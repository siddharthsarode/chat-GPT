import React, { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import InputBox from "./InputBox";

const ChatArea = ({ chat, onSendMessage, onToggleSidebar }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-800">
        <div className="text-center text-gray-400">
          <p className="text-lg">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-800">
      {/* Header */}
      <ChatHeader title={chat.title} onToggleSidebar={onToggleSidebar} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {chat.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400 max-w-md">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Start a conversation
              </h2>
              <p className="text-gray-500">
                Ask me anything, and I'll do my best to help!
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="space-y-6">
              {chat.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="border-t border-gray-700">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <InputBox onSendMessage={onSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
