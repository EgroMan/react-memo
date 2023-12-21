import { createSlice } from "@reduxjs/toolkit";
const gameSlice = createSlice({
    name: "game",
    initialState: {
      gameRegime: false,
      openCardItem: null,
      gameNumber: null,
    },
    reducers: {
      gameRegimeReducer(state, action) {
        state.gameRegime = !state.gameRegime; // Переключение между true и false
      },
      setOpenCardItem(state, action) {
        state.openCardItem = action.payload.card;
      },
      setGameNumber(state, action) {
        state.gameNumber = action.payload;
        console.log(state.gameNumber);
      },
    },
  });
  
  export const { gameRegimeReducer, setOpenCardItem, setGameNumber } = gameSlice.actions;
  export default gameSlice.reducer;