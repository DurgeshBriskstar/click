import { createSlice } from '@reduxjs/toolkit';
import secureAxiosInstance from 'lib/secureAxiosInstance';
import axiosInstance from 'lib/axiosInstance';

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
};

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
        },

        resetLoader(state) {
            state.isLoading = false;
        },

        loginSuccess(state, action) {
            state.isLoading = false;
            state.user = action.payload?.data;
            state.isAuthenticated = true;
        },

        userSuccess(state, action) {
            state.isLoading = false;
            state.user = action.payload?.data;
            state.isAuthenticated = true;
        },

        logoutSuccess(state) {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        }
    }
});

// Export reducers
export const { logoutSuccess } = slice.actions;

// Export reducer
export default slice.reducer;

export function loginUser(data) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await axiosInstance.post("/auth/login", data);

            dispatch(slice.actions.loginSuccess(response?.data));
            return Promise.resolve(response?.data);

        } catch (error) {
            dispatch(slice.actions.resetLoader());
            return Promise.reject(error);
        }
    };
}

export function loadUser() {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.get("/auth/me");

            dispatch(slice.actions.userSuccess(response?.data));
            return Promise.resolve(response?.data);

        } catch (error) {
            // Check if user account is inactive
            const errorMessage = error?.response?.data?.message || error?.message || "";
            const isInactiveAccount = error?.response?.status === 403 && 
                (errorMessage.includes("deactivated") || errorMessage.includes("inactive"));

            if (isInactiveAccount && typeof window !== "undefined") {
                // Store message in sessionStorage to show on login page
                sessionStorage.setItem("logoutMessage", errorMessage);
                // Logout user
                dispatch(slice.actions.logoutSuccess());
            }

            dispatch(slice.actions.resetLoader());
            return Promise.reject(error);
        }
    };
}

export function logoutUser() {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            await axiosInstance.get("/auth/logout");

            dispatch(slice.actions.logoutSuccess());
            return Promise.resolve(true);

        } catch (error) {
            dispatch(slice.actions.resetLoader());
            return Promise.reject(error);
        }
    };
}

export function updateAccount(data) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.put("/auth/update-user", data);
            dispatch(slice.actions.userSuccess(response?.data));

            return Promise.resolve(response?.data);
        } catch (error) {
            dispatch(slice.actions.resetLoader());
            const message = error?.response?.data?.message || "Something went wrong!";
            return Promise.reject({ message });
        }
    };
}

// Password Reset Functions

export function forgotPassword(data) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await axiosInstance.post("/auth/forgot-password", data);

            dispatch(slice.actions.resetLoader());
            return Promise.resolve(response?.data);

        } catch (error) {
            dispatch(slice.actions.resetLoader());
            const errData = error?.response?.data;
            return Promise.reject(errData || error);
        }
    };
}

export function verifyResetToken(token) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await axiosInstance.get(`/auth/verify-reset-token?token=${token}`);

            dispatch(slice.actions.resetLoader());
            return Promise.resolve(response?.data);

        } catch (error) {
            dispatch(slice.actions.resetLoader());
            const errData = error?.response?.data;
            return Promise.reject(errData || error);
        }
    };
}

export function resetPassword(data) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await axiosInstance.post("/auth/reset-password", data);

            dispatch(slice.actions.resetLoader());
            return Promise.resolve(response?.data);

        } catch (error) {
            dispatch(slice.actions.resetLoader());
            const errData = error?.response?.data;
            return Promise.reject(errData || error);
        }
    };
}

