import React from "react";
import { User, Bot } from "lucide-react";

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          ${isUser ? "bg-blue-600" : "bg-green-600"}
        `}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Message Content */}
      <div
        className={`
          max-w-[90%] p-4 rounded-2xl
          ${
            isUser ? "bg-blue-600 text-white ml-auto" : "bg-gray-700 text-white"
          }
        `}
      >
        <div className="prose prose-invert max-w-none">
          <div className="whitespace-pre-wrap break-words">
            {message.content.split("\n").map((line, index) => {
              // Handle code blocks
              if (line.startsWith("```")) {
                return null; // Skip markdown indicators for now
              }

              // Handle bullet points
              if (line.startsWith("• ") || line.startsWith("- ")) {
                return (
                  <div key={index} className="flex items-start gap-2 my-1">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>{line.substring(2)}</span>
                  </div>
                );
              }

              // Handle numbered lists
              if (/^\d+\./.test(line)) {
                return (
                  <div key={index} className="my-1">
                    <span className="text-blue-400 font-semibold">
                      {line.match(/^\d+\./)?.[0]}
                    </span>
                    <span>{line.substring(line.indexOf(".") + 1)}</span>
                  </div>
                );
              }

              // Handle bold text
              const boldText = line.replace(
                /\*\*(.*?)\*\*/g,
                '<strong class="text-blue-400">$1</strong>'
              );

              return (
                <div
                  key={index}
                  dangerouslySetInnerHTML={{ __html: boldText }}
                />
              );
            })}
          </div>
        </div>

        <div className="mt-2 text-xs text-gray-400">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
