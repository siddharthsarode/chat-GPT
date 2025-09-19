// create new chat

import { apiRequest } from "./api";

export const createNewChat = async (title) => {
  return await apiRequest("/api/chats", "POST", { title });
};

// Get All messages by chat id
export const getMessages = async (chatId) => {
  try {
    const response = await apiRequest(`/api/chat/messages/${chatId}`, "GET");
    if (response.success) {
      // console.log("get message response", response);
      return response.data;
    }
  } catch (err) {
    throw new Error(err);
  }
};
