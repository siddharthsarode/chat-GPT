import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import ChatArea from "../ChatArea";
import { apiRequest } from "@/lib/api";
import { useDispatch, useSelector } from "react-redux";
import { setChats } from "@/store/slices/chatSlice";

// // Dummy data
// const dummyChats = [
//   {
//     id: "1",
//     title: "React Best Practices",
//     messages: [
//       {
//         id: "1",
//         content: "What are some React best practices for 2024?",
//         role: "user",
//         timestamp: new Date("2024-01-15T10:00:00"),
//       },
//       {
//         id: "2",
//         content:
//           "Here are some key React best practices for 2024:\n\n1. **Use Functional Components**: Prefer functional components with hooks over class components\n2. **Custom Hooks**: Extract reusable logic into custom hooks\n3. **State Management**: Use React Query/TanStack Query for server state\n4. **Performance**: Leverage React.memo, useMemo, and useCallback judiciously\n5. **TypeScript**: Use TypeScript for better type safety and developer experience",
//         role: "assistant",
//         timestamp: new Date("2024-01-15T10:00:30"),
//       },
//       {
//         id: "3",
//         content: "Can you elaborate on custom hooks?",
//         role: "user",
//         timestamp: new Date("2024-01-15T10:01:00"),
//       },
//       {
//         id: "4",
//         content:
//           'Custom hooks are JavaScript functions that:\n\n• Start with "use" prefix\n• Can call other hooks\n• Allow you to extract component logic into reusable functions\n• Help with separation of concerns\n\nExample:\n```javascript\nfunction useCounter(initialValue = 0) {\n  const [count, setCount] = useState(initialValue);\n  const increment = () => setCount(c => c + 1);\n  const decrement = () => setCount(c => c - 1);\n  return { count, increment, decrement };\n}\n```',
//         role: "assistant",
//         timestamp: new Date("2024-01-15T10:01:30"),
//       },
//     ],
//     updatedAt: new Date("2024-01-15T10:01:30"),
//   },
//   {
//     id: "2",
//     title: "JavaScript Array Methods",
//     messages: [
//       {
//         id: "5",
//         content: "Explain the difference between map, filter, and reduce",
//         role: "user",
//         timestamp: new Date("2024-01-14T15:30:00"),
//       },
//       {
//         id: "6",
//         content:
//           "Here are the key differences:\n\n**map()**: Transforms each element and returns a new array of the same length\n```javascript\n[1, 2, 3].map(x => x * 2) // [2, 4, 6]\n```\n\n**filter()**: Returns a new array with elements that pass a test\n```javascript\n[1, 2, 3, 4].filter(x => x > 2) // [3, 4]\n```\n\n**reduce()**: Reduces array to a single value\n```javascript\n[1, 2, 3, 4].reduce((sum, x) => sum + x, 0) // 10\n```",
//         role: "assistant",
//         timestamp: new Date("2024-01-14T15:30:30"),
//       },
//     ],
//     updatedAt: new Date("2024-01-14T15:30:30"),
//   },
//   {
//     id: "3",
//     title: "CSS Grid vs Flexbox",
//     messages: [
//       {
//         id: "7",
//         content: "When should I use CSS Grid vs Flexbox?",
//         role: "user",
//         timestamp: new Date("2024-01-13T09:15:00"),
//       },
//       {
//         id: "8",
//         content:
//           "**Use Flexbox when:**\n• Working with one-dimensional layouts (row OR column)\n• Distributing space among items in a container\n• Aligning items within a container\n• Creating flexible, responsive navigation bars\n\n**Use CSS Grid when:**\n• Working with two-dimensional layouts (rows AND columns)\n• Creating complex page layouts\n• You need precise control over both axes\n• Building card layouts or dashboard interfaces\n\n**Pro tip**: They work great together! Use Grid for page layout, Flexbox for component layout.",
//         role: "assistant",
//         timestamp: new Date("2024-01-13T09:15:45"),
//       },
//     ],
//     updatedAt: new Date("2024-01-13T09:15:45"),
//   },
// ];

const Hero = () => {
  // const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const chats = useSelector((state) => state.chat.chats);

  const dispatch = useDispatch();

  const selectedChat = chats.find((chat) => chat._id === selectedChatId);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await apiRequest("/api/chats", "GET");
        if (response.success) {
          dispatch(setChats(response.data));
        }
        console.log("Fetched chats:", response);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };
    fetchChats();
  }, [dispatch]);

  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      updatedAt: new Date(),
    };
    setChats((prev) => [newChat, ...prev]);
    setSelectedChatId(newChat.id);
    setIsSidebarOpen(false);
  };

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
    setIsSidebarOpen(false);
  };

  const handleSendMessage = (content) => {
    if (!selectedChat) return;

    const userMessage = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    const assistantMessage = {
      id: (Date.now() + 1).toString(),
      content:
        "I'm a demo ChatGPT clone! This is where the AI response would appear. The message you sent was: \"" +
        content +
        '"',
      role: "assistant",
      timestamp: new Date(),
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              messages: [...chat.messages, userMessage, assistantMessage],
              title:
                chat.messages.length === 0
                  ? content.slice(0, 30) + (content.length > 30 ? "..." : "")
                  : chat.title,
              updatedAt: new Date(),
            }
          : chat
      )
    );
  };

  return (
    <div className="flex h-screen bg-gray-800 text-white">
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        selectedChatId={selectedChatId}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <ChatArea
          chat={selectedChat}
          onSendMessage={handleSendMessage}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Hero;
