import React, { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import InputBox from "./InputBox";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";

const ChatArea = ({ onSendMessage, onToggleSidebar, onNewChat }) => {
  const messagesEndRef = useRef(null);
  const selectedChatId = useSelector((state) => state.chat.selectedChatId);
  const chat = useSelector((state) => state.chat);
  const isLoading = useSelector((state) => state.chat.isLoading);

  console.log("chat id", selectedChatId);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  if (!selectedChatId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-400 space-y-3">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-white via-gray-500 to-gray-600 bg-clip-text text-transparent mb-2">
            ChatGPT Clone
          </h1>
          <p className="text-lg">Select a chat to start messaging</p>
          <Button className={"cursor-pointer"} onClick={onNewChat}>
            Create New Chat
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      {/* Header */}
      <ChatHeader title={chat?.title || ""} onToggleSidebar={onToggleSidebar} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 py-8">
        {!chat || chat?.messages?.length === 0 ? (
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
          <div className="space-y-6">
            {chat?.messages?.map((message) => (
              <ChatMessage key={message._id} message={message} />
            ))}

            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="bg-gray-700 px-3 py-2 rounded-lg max-w-xs">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900">
        <div className="flex justify-center items-center">
          <div className="w-full md:w-1/2 lg:w-1/3 p-4 lg:ms-44">
            <InputBox onSendMessage={onSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
