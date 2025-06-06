import { createSlice } from '@reduxjs/toolkit'

const initialState = null 

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

    login:(state,actions) =>{
        return actions.payload
        //thong tin nguoi dung
    },
    logout:() => {
        return initialState
    }
  },
})

// Action creators are generated for each case reducer function
export const {login, logout} = userSlice.actions

export default userSlice.reducer