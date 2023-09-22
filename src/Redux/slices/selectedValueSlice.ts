import { createSlice } from '@reduxjs/toolkit';

const selectedValueSlice = createSlice({
  name: 'selectedValue',
  initialState: 2,
  reducers: {
    setSelectedValue: (_state, action) => {
      return action.payload;
    },
  },
});

export const { setSelectedValue } = selectedValueSlice.actions;
export default selectedValueSlice.reducer;
