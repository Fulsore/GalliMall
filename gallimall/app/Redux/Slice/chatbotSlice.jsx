import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Thunk to send message to chatbot API
export const sendMessageToBot = createAsyncThunk(
  'chatbot/sendMessageToBot',
  async (user_text, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth?.token || localStorage.getItem('access_token');

      const response = await axios.post(
        `${API_BASE_URL}/chatbot/`,
        { user_text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data; // Contains { user_text, bot_reply }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { error: 'Server error' });
    }
  }
);

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState: {
    messages: [{ sender: 'bot', text: 'Hello! How can I assist you today?' }],
    loading: false,
    error: null,
  },
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({ sender: 'user', text: action.payload });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageToBot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessageToBot.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({ sender: 'bot', text: action.payload.bot_reply });
      })
      .addCase(sendMessageToBot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Something went wrong';
        state.messages.push({ sender: 'bot', text: 'Sorry, I couldn’t process your message.' });
      });
  },
});

export const { addUserMessage } = chatbotSlice.actions;
export default chatbotSlice.reducer;
