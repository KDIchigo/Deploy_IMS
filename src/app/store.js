import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./feature/user/UserSlice";

export const store = configureStore({
  reducer: combineReducers({
    user: userReducer,
  }),
});
