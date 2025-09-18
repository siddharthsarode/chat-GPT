import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import ChatArea from "../ChatArea";
import { apiRequest } from "@/lib/api";
import { useDispatch, useSelector } from "react-redux";
import {
  setChats,
  setLoading,
  setMessages,
  setNewMessage,
  setSelectedChatId,
} from "@/store/slices/chatSlice";
import CreateChatModal from "../CreateChatModal";
import { getMessages } from "@/lib/chatApi";
import { useSocket } from "@/contexts/socket.context";

const Hero = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const { socket } = useSocket();

  console.log("Socket", socket);

  const state = useSelector((state) => state);
  const selectedChatId = useSelector((state) => state.chat.selectedChatId);

  const chats = useSelector((state) => [state.chat.chats].reverse());

  const dispatch = useDispatch();

  const selectedChat = chats.find(
    (chat) => String(chat._id) === String(selectedChatId)
  );

  console.log("redux state", state);
  // console.log("chat id", selectedChatId);
  console.log("selected chat", selectedChat);

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

  useEffect(() => {
    if (selectedChatId) {
      (async () => {
        const response = await getMessages(selectedChatId);
        console.log("messages", response);
        dispatch(setMessages(response));
      })();
    }
  }, [selectedChatId, dispatch]);

  useEffect(() => {
    if (!socket) {
      console.log("Socket is false");
      return;
    }

    const onAiResponse = (payload) => {
      // Always clear the loading flag as soon as an AI response arrives so the UI
      // doesn't get stuck (it may have been triggered for a different chat).
      dispatch(setLoading(false));

      if (String(payload.chat) !== String(selectedChatId)) {
        console.log("payload chat id and selected chat id not equal");
        // Do not inject the AI message into the currently-open messages array
        // if it belongs to another chat. We already cleared the loading state.
        return;
      }

      console.log("ai message", payload);

      const aiMessage = {
        _id: Date.now().toString(),
        role: "model",
        content: payload.content,
        createdAt: new Date().toISOString(),
      };

      dispatch(setNewMessage(aiMessage));
    };

    socket.on("ai-message-response", onAiResponse);

    // clear loading on socket-level errors so UI doesn't remain stuck
    const onConnectError = (err) => {
      console.error("socket connect_error", err);
      dispatch(setLoading(false));
    };

    const onDisconnect = () => {
      console.log("socket disconnected");
      dispatch(setLoading(false));
    };

    socket.on("connect_error", onConnectError);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("ai-message-response", onAiResponse);
      socket.off("connect_error", onConnectError);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket, selectedChatId, dispatch]);

  const handleNewChat = () => {
    setOpen(true);
    setIsSidebarOpen(false);
  };

  const handleSelectChat = (chatId) => {
    // switching chats should also clear any pending loading state so the
    // UI doesn't show the old chat's loading indicator for the new chat.
    dispatch(setLoading(false));
    dispatch(setSelectedChatId(chatId));
    setIsSidebarOpen(false);
  };

  const handleSendMessage = (content) => {
    console.log("user message", content);

    if (!selectedChatId || !socket) return;

    const userMessage = {
      _id: Date.now().toString(),
      content,
      role: "user",
      createdAt: new Date().toISOString(),
      chat: selectedChatId,
    };

    dispatch(setNewMessage(userMessage));
    dispatch(setLoading(true));

    socket.emit("message", {
      chat: selectedChatId,
      content,
    });
  };

  return (
    <div className="flex h-screen bg-gray-800 text-white">
      {/* Sidebar */}
      <Sidebar
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

      {open && <CreateChatModal open={open} onClose={() => setOpen(false)} />}
    </div>
  );
};

export default Hero;
