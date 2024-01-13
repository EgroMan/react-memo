import { configureStore } from "@reduxjs/toolkit";

import sliceReducer from "./slice";
export default configureStore({
    reducer:{
        game: sliceReducer
    }
})

