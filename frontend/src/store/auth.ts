import { StateStatus, iAuthState } from '@/interfaces';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// Define the initial state using that type
const initialState: iAuthState = {
  status: StateStatus.None,
  isAuth: false,
}

export const authVerify = createAsyncThunk(
  'authVerify',
  async ({token}: {token: string}, thunkAPI) => {
      const response = await fetch("http://127.0.0.1:8000/auth/verify", {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: token
            },
          })
      if (response.ok) return response.json();
      else return thunkAPI.rejectWithValue("");
    }
)

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
      if (response.status === 200) return response.json();
      else return thunkAPI.rejectWithValue('')
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
      if (response.ok) return response.json();
      else return thunkAPI.rejectWithValue("error");
    }
)

export const sendVerificationCode = async ({token}: {token: string}) => {
      await fetch("http://127.0.0.1:8000/email/request", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: token
            },
      })
    }

export const verifyEmail = createAsyncThunk(
  'verifyEmail',
  async ({code, token}: {code: string, token: string}, thunkAPI) => {
      const response = await fetch(`http://127.0.0.1:8000/email/verify?code=${code}`, {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: token
            },
      })
      if (response.ok) return "ok";
      else return thunkAPI.rejectWithValue("");
    }
)

export const generateAPIToken = createAsyncThunk(
  'genAPIToken',
  async ({token}: {token: string}, thunkAPI) => {
    const response = await fetch("http://localhost:8000/api/token",{
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token as string
      }})
      if (response.ok) return response.json();
      else return thunkAPI.rejectWithValue("");
    }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRole: (state, {payload}) => {
      state.user!.role = payload.role
    },
    logOut: () => {
      localStorage.removeItem('token');
      return initialState
    },
  },
  extraReducers(builder) {
      builder.addCase(signIn.pending, (state) => {
        state.status = StateStatus.Loading;
        state.isAuth = false;
      }),
      builder.addCase(signIn.rejected, (state) => {
        logOut();
        state.status = StateStatus.Error;
      }),
      builder.addCase(signIn.fulfilled, (state, {payload}) => {
        state.status = StateStatus.Success;
        state.isAuth = true;
        state.user = payload.user
        state.token = payload.token.type + ' ' + payload.token.token
        localStorage.setItem("token", state.token)
      })

      builder.addCase(signUp.pending, (state) => {
        state.status = StateStatus.Loading;
        state.isAuth = false;
      }),
      builder.addCase(signUp.rejected, (state) => {
        logOut()
        state.status = StateStatus.Error;
   
      }),
      builder.addCase(signUp.fulfilled, (state, {payload}) => {
        state.status = StateStatus.Success;
        state.isAuth = true;
        state.user = payload.user
        state.token = payload.token.type + ' ' + payload.token.token
        localStorage.setItem("token", state.token)
      }),

      builder.addCase(verifyEmail.pending, (state) => {
        state.status = StateStatus.Loading;
      }),
      builder.addCase(verifyEmail.rejected, (state) => {
        logOut()
        state.status = StateStatus.Error;
      }),
      builder.addCase(verifyEmail.fulfilled, (state) => {
        state.status = StateStatus.Verified;
        state.user!.is_verified = true
      })

      builder.addCase(authVerify.pending, (state) => {
        state.status = StateStatus.Loading;
      }),
      builder.addCase(authVerify.rejected, (state) => {
        logOut();
        state.status = StateStatus.Error;
      }),
      builder.addCase(authVerify.fulfilled, (state, {payload}) => {
        state.status = StateStatus.Verified;
        state.isAuth = true;
        state.user = payload.user;
        state.token = payload.token.type + ' ' + payload.token.token;
        localStorage.setItem("token", state.token);
      })

      builder.addCase(generateAPIToken.fulfilled, (state, {payload}) => {
        state.status = StateStatus.Success;
        state.user!.api_token = payload.api_token

      })
  },
})

export const { logOut, setRole } = authSlice.actions

export default authSlice.reducer