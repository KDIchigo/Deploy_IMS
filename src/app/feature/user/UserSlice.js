import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedIn: {
    user_id: "",
    email: "",
    fullname: "",
    role: "",
    avatar: "",
    exp: 0,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoggedInUser(state, action) {
      state.loggedIn = action.payload;
    },
    getLoggedInUser() {
      return initialState.loggedIn;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLoggedInUser, getLoggedInUser } = userSlice.actions;

const userReducer = userSlice.reducer;
export { userReducer };
