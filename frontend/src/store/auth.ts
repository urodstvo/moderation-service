import { AuthStatus, iAuthState } from '@/interfaces';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'





// Define the initial state using that type
const initialState: iAuthState = {
  status: AuthStatus.None,
  isAuth: false,
}

export const signIn = createAsyncThunk(
  'signIn',
  async ({username, password}: {username: string, password: string}, thunkAPI) => {
      const response = await fetch("http://127.0.0.1:8000/auth/signin", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          body: JSON.stringify(
              {
                  login: username,
                  password: password
              }
          )
      })
      if (response.ok)
            return response.json();
      else 
            thunkAPI.rejectWithValue("error");
    }
)

export const signUp = createAsyncThunk(
  'signUp',
  async ({email, username, password}: {email: string, username: string, password: string}, thunkAPI) => {
      const response = await fetch("http://127.0.0.1:8000/auth/signup", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          body: JSON.stringify(
              { 
                email,
                username,
                password
              }
          )
      })
      if (response.ok)
            return response.json();
      else 
            thunkAPI.rejectWithValue("error");
    }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logOut: () => {
      localStorage.removeItem('auth_data');
      return initialState
    },
    fetchDataFromStorage: () => {
      const user = localStorage.getItem('auth_data');
      if (user)
            return JSON.parse(user);
      else 
            console.log("No Auth Data in local storage")
    }
  },
  extraReducers(builder) {
      builder.addCase(signIn.pending, (state) => {
        state.status = AuthStatus.Loading;
        state.isAuth = false;
      }),
      builder.addCase(signIn.rejected, (state) => {
        state.status = AuthStatus.Error;
        state.isAuth = false;
      }),
      builder.addCase(signIn.fulfilled, (state, {payload}) => {
        state.status = AuthStatus.Success;
        state.isAuth = true;
        state.user = payload.user
        state.token = payload.token.type + ' ' + payload.token.token
        localStorage.setItem("auth_data", JSON.stringify(state))
      })

      builder.addCase(signUp.pending, (state) => {
        state.status = AuthStatus.Loading;
        state.isAuth = false;
      }),
      builder.addCase(signUp.rejected, (state) => {
        state.status = AuthStatus.Error;
        state.isAuth = false;
      }),
      builder.addCase(signUp.fulfilled, (state, {payload}) => {
        state.status = AuthStatus.Success;
        state.isAuth = true;
        state.user = payload.user
        state.token = payload.token.type + ' ' + payload.token.token
        localStorage.setItem("auth_data", JSON.stringify(state))
      })
  },
})

export const { logOut, fetchDataFromStorage } = authSlice.actions

export default authSlice.reducer