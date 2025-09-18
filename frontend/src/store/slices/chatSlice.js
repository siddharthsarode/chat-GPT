import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [],
  selectedChatId: null,
  messages: [],
  isLoading: false,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
      state.selectedChatId =
        action.payload.length > 0 ? action.payload[0]._id : null;
    },
    setNewChat: (state, action) => {
      state.chats = [action.payload, ...state.chats];
      state.selectedChatId = action.payload._id;
    },
    setSelectedChatId: (state, action) => {
      state.selectedChatId = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setNewMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setChats,
  setSelectedChatId,
  setNewChat,
  setMessages,
  setNewMessage,
  setLoading,
} = chatSlice.actions;

export default chatSlice.reducer;
