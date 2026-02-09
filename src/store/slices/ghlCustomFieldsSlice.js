import { createSlice } from '@reduxjs/toolkit';
import secureAxiosInstance from 'lib/secureAxiosInstance';

const initialState = {
    isLoading: false,
    success: false,
    message: null,
};

const slice = createSlice({
    name: 'ghlCustomFields',
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
            state.success = false;
            state.message = null;
        },

        resetLoader(state) {
            state.isLoading = false;
        },

        setSyncSuccess(state, action) {
            state.isLoading = false;
            state.success = true;
            state.message = action.payload ?? null;
        },

        setSyncFailure(state, action) {
            state.isLoading = false;
            state.success = false;
            state.message = action.payload ?? null;
        },

        resetSyncState(state) {
            state.isLoading = false;
            state.success = false;
            state.message = null;
        }
    }
});

export const { resetSyncState } = slice.actions;

export default slice.reducer;

export function syncGhlCustomFields() {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.post(`/ghl/sync-custom-fields`);
            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setSyncSuccess(responseData?.message));
                return Promise.resolve(responseData);
            }

            dispatch(slice.actions.setSyncFailure(responseData?.message));
            return Promise.reject(responseData);

        } catch (error) {
            const errData = error?.response?.data;
            dispatch(slice.actions.setSyncFailure(errData?.message || 'Something went wrong!'));
            return Promise.reject(errData);
        }
    };
}
