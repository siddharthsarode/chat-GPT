import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [],
  selectedChatId: null,
  messages: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
  },
});

export const { setChats } = chatSlice.actions;

export default chatSlice.reducer;
