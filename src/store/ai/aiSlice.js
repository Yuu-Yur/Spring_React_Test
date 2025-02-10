import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stockData: [],
  predictions: { RNN: '', LSTM: '', GRU: '' },
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
    fetchStockDataRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStockDataSuccess: (state, action) => {
      state.stockData = action.payload;
      state.loading = false;
    },
    fetchStockDataFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    predictRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    predictSuccess: (state, action) => {
      const { model, prediction } = action.payload;
      state.predictions[model] = prediction;
      state.loading = false;
    },
    predictFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  uploadImageRequest,
  uploadImageSuccess,
  uploadImageFailure,
  fetchStockDataRequest,
  fetchStockDataSuccess,
  fetchStockDataFailure,
  predictRequest,
  predictSuccess,
  predictFailure,
} = aiSlice.actions;
export default aiSlice.reducer;
