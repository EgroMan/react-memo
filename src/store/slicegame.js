import { createSlice } from "@reduxjs/toolkit";

const sliceGame = createSlice({
    name: "game",
    initialState: {
        gameRegime: false,
        openCardItem: null,
        gameNumber: null,
        powerA: false,
        powerB: false,
    },
    reducers: {
        toggleGameRegime(state, action) {
            state.gameRegime = !state.gameRegime;
        },
        setOpenCardItem(state, action) {
            state.openCardItem = action.payload.card;
        },
        setGameNumber(state, action) {
            state.gameNumber = action.payload;
        },
        setPower(state, action) {
            const { power, value } = action.payload;
            statepower = !statepower ? statepower = value : !statepower;
        },
    },
});

export const {
    toggleGameRegime,
    setOpenCardItem,
    setGameNumber,
    setPowerA,
    setPowerB,
} = sliceGame.actions;

export default sliceGame.reducer;