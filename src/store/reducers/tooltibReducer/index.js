import { createSlice } from "@reduxjs/toolkit";
let initialState = {
  visible: false,
};
const tootTibSlice = createSlice({
  initialState,
  name: "toggleTooltib",
  reducers: {
    toogleTooltib: (state) => {
      state.visible = !state.visible;
    },
    showToogleTooltib: (state) => {
      state.visible = true;
    },
    hideToogleTooltib: (state) => {
      state.visible = false;
    },
  },
});

export const { toogleTooltib, showToogleTooltib, hideToogleTooltib } =
  tootTibSlice.actions;
export default tootTibSlice.reducer;
