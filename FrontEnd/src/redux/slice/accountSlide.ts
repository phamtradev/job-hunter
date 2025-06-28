import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '@/config/axios-customize';

// First, create the thunk
export const fetchAccount = createAsyncThunk(
    'account/fetchAccount',
    async () => {
        const response = await axios.get('/api/v1/auth/account')
        return response.data;
    }
)

const initialState = {
    // isAuthenticated: false,
    isAuthenticated: true,

    isLoading: true,
    user: {
        userId: "",
        email: "",
        phone: "",
        _id: "",
        // role: "",
        role: "ADMIN",
    },
    activeMenu: 'home'
};


export const accountSlide = createSlice({
    name: 'account',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setActiveMenu: (state, action) => {
            state.activeMenu = action.payload;
        },
        setUserLoginInfo: (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user = {
                ...state.user, ...action.payload
            }
        },
        setLogoutAction: (state, action) => {
            localStorage.removeItem('access_token');
            state.isAuthenticated = false;
            state.user = {
                userId: "",
                email: "",
                phone: "",
                _id: "",
                role: "",
            }
        }

    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchAccount.fulfilled, (state, action) => {
            if (action.payload) {
                state.isAuthenticated = true;
                state.isLoading = false;

                state.user.email = action.payload.email;
                state.user.phone = action.payload.phone;
                state.user._id = action.payload._id;
                state.user.role = action.payload.role;

            }
            // Add user to the state array

            // state.courseOrder = action.payload;
        })
    },

});

export const {
    setActiveMenu, setUserLoginInfo, setLogoutAction
} = accountSlide.actions;

export default accountSlide.reducer;
