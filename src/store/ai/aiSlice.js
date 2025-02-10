import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  result: null,
  error: null,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    uploadImageRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    uploadImageSuccess: (state, action) => {
      state.loading = false;
      state.result = action.payload;
    },
    uploadImageFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { uploadImageRequest, uploadImageSuccess, uploadImageFailure } =
  aiSlice.actions;
export default aiSlice.reducer;
