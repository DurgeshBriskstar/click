import { createSlice } from '@reduxjs/toolkit';
import secureAxiosInstance from 'lib/secureAxiosInstance';

const initialState = {
    count: 0,
    inquiries: [],
    meta: null,
    fieldLabels: {},
    isLoading: false,
};

const slice = createSlice({
    name: 'franchiseInquiry',
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
        },

        resetLoader(state) {
            state.isLoading = false;
        },

        setInquiries(state, action) {
            state.isLoading = false;
            state.inquiries = action.payload;
        },

        setInquiriesCount(state, action) {
            state.isLoading = false;
            state.count = action.payload;
        },

        setMeta(state, action) {
            state.isLoading = false;
            state.meta = action.payload;
        },

        setFieldLabels(state, action) {
            state.fieldLabels = action.payload || {};
        },

        resetInquiries(state) {
            state.isLoading = false;
            state.inquiries = [];
            state.count = 0;
            state.meta = null;
            state.fieldLabels = {};
        }
    }
});

export const { resetInquiries } = slice.actions;

export default slice.reducer;

export function getInquiries(params) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.get(`/inquiries/franchise-requests`, { params });
            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setInquiries(responseData?.data?.submissions || []));
                dispatch(slice.actions.setInquiriesCount(responseData?.data?.meta?.total || 0));
                dispatch(slice.actions.setMeta(responseData?.data?.meta || null));
                dispatch(slice.actions.setFieldLabels(responseData?.data?.fieldLabels || {}));
                return Promise.resolve(responseData?.data);
            }

            dispatch(slice.actions.resetLoader());
            return Promise.reject(responseData);

        } catch (error) {
            const errData = error?.response?.data;
            dispatch(slice.actions.resetLoader());
            return Promise.reject(errData);
        }
    };
}

