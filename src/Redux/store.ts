import { configureStore } from "@reduxjs/toolkit";
import playstationReducer from "./slices/playstationSlice";
import selectedValueSlice from "./slices/selectedValueSlice";

const store = configureStore({
  reducer: {
    playstation: playstationReducer,
    selectedValue: selectedValueSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
