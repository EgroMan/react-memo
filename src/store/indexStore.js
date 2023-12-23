import { configureStore } from "@reduxjs/toolkit";
import sliceGameReducer from "./sliceGame";
export default configureStore({
    reducer:{
        game: sliceGameReducer
    }
})

