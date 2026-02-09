import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchPageData = createAsyncThunk(
  "data/fetchPageData",
  async (pageName) => {
    try {
      const response = await import(`../../data/${pageName}.json`);
      return response.default;
    } catch (error) {
      throw new Error(`Failed to load data for ${pageName}`);
    }
  }
);

const initialState = {
  pages: {},
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    clearPageData: (state, action) => {
      delete state.pages[action.payload];
    },
    resetData: (state) => {
      state.pages = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPageData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPageData.fulfilled, (state, action) => {
        state.loading = false;
        state.pages[action.meta.arg] = action.payload;
      })
      .addCase(fetchPageData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearPageData, resetData } = dataSlice.actions;
export default dataSlice.reducer;
