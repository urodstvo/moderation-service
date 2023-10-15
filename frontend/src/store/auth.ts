import { authAPI } from '@/api/authAPI';
import { AlertError, AlertSuccess } from '@/components/ui/Alert';
import { iAuthState } from '@/interfaces';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'


// Define the initial state using that type
const initialState: iAuthState = {
  isAuth: false,
}

// export const baseUrl = "https://srg9fnqj-8000.euw.devtunnels.ms"
export const baseUrl = "http://127.0.0.1:8000"

export const generateAPIToken = createAsyncThunk(
  'genAPIToken',
  async ({token}: {token: string}, thunkAPI) => {
    const response = await fetch(baseUrl + "/api/token",{
      method: "GET",
      mode: "cors",
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
    verify: (state) => {
      if (state.user) state.user.is_verified = true
    },
    setRole: (state, {payload}) => {
      if (state.user) state.user.role = payload.role
    },
    logOut: () => {
      localStorage.removeItem('token');
      return initialState
    },
    setKey: (state, {payload}) => {
      if (state.user) state.user.api_token = payload.api_token
    }
  },


  extraReducers(builder) {
      builder.addCase(generateAPIToken.fulfilled, (state, {payload}) => {
        state.user!.api_token = payload.api_token
      }),

      builder.addMatcher(
        authAPI.endpoints.verify.matchFulfilled, (state, { payload }) => {
          console.log('verifying')
          state.isAuth = true
          state.user = payload.user
        }
      ),

      builder.addMatcher(authAPI.endpoints.signup.matchFulfilled, 
        (_, { payload }) => {
          const token = payload.token.type + ' ' + payload.token.token
          localStorage.setItem("token", token)
          AlertSuccess(`Welcome to our platform!`)
        },
      )
      .addMatcher(authAPI.endpoints.signup.matchRejected, 
        (_, payload) => { 
          // @ts-ignore
          AlertError(payload.payload.data.detail); 
          return initialState 
        }
      ),

      builder.addMatcher(authAPI.endpoints.login.matchFulfilled, 
        (_, { payload }) => {
          console.log('logining')
          const token = payload.token.type + ' ' + payload.token.token
          localStorage.setItem("token", token)
          AlertSuccess(`Welcome to our platform!`)
        },
      )
      .addMatcher(authAPI.endpoints.login.matchRejected, 
        (_, payload ) => { 
          // @ts-ignore
          AlertError(payload.payload.data.detail); 
          return initialState }
      )
  },
})

export const { logOut, setRole, verify, setKey } = authSlice.actions

export default authSlice.reducer