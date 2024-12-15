import { createSlice } from '@reduxjs/toolkit';

const clickCounterSlice = createSlice({
  name: 'clickCounter',
  initialState: {
    clickCount: 0,
  },
  reducers: {
    incrementClickCount: (state) => {
      state.clickCount += 1;
    },
  },
});

export const { incrementClickCount } = clickCounterSlice.actions;

export default clickCounterSlice.reducer;
