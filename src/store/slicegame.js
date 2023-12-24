import { createSlice } from "@reduxjs/toolkit";


const sliceGame = createSlice({
  name: "game",
  initialState: {
    gameRegime: false,
    openCardItem: null,
    gameNumber: null,
    handleProzrenie: false,
    handleAlohomoa: false,
  },
  reducers: {
    toggleGameRegime(state) {
      state.gameRegime = !state.gameRegime;
    },
    setOpenCardItem(state, action) {
      state.openCardItem = action.payload;
    },
    setGameNumber(state, action) {
      state.gameNumber = action.payload;
    },
    setPower(state, action) {
      const { power, value } = action.payload;
      if (power === 'handleProzrenie') {
        state.handleProzrenie = value;
      } else if (power === 'handleAlohomoa') {
        state.handleAlohomoa = value;
      }
      
    },
    
  },
});

// Экспорт сгенерированных действий
export const {
  toggleGameRegime,
  setOpenCardItem,
  setGameNumber,
  setPower,
} = sliceGame.actions;

// Стандартный экспорт редьюсера для данного слайса
export default sliceGame.reducer;
