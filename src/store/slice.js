import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "game",
  initialState: {
    gameRegime: false,
    openCardItem: null,
    gameNumber: null,
    handleProzrenie: false,
    handleAlohomoa: false,
  },
  reducers: {
    gameRegimeReducer(state, action) {
      state.gameRegime = !state.gameRegime;
    },
    setOpenCardItem(state, action) {
      state.openCardItem = action.payload.card;
    },
    setGameNumber(state, action) {
      state.gameNumber = action.payload;
    },
    sethandleProzrenie(state, action) {
      state.handleProzrenie = action.payload;
    },
    sethandleAlohomoa(state, action) {
      state.handleAlohomoa = action.payload;
    },
  },
});

export const { 
  gameRegimeReducer, 
  setOpenCardItem, 
  setGameNumber, 
  sethandleProzrenie, 
  sethandleAlohomoa } = slice.actions;

export default slice.reducer;
