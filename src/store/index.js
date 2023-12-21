import { configureStore } from "@reduxjs/toolkit";
import sliceGameReducer from "./slicegame";
export default configureStore({
    reducer:{
        game: sliceGameReducer
    }
})