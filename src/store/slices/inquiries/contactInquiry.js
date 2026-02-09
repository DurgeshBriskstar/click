import { createSlice } from '@reduxjs/toolkit';
import secureAxiosInstance from 'lib/secureAxiosInstance';

const initialState = {
    count: 0,
    inquiries: [],
    customFields: [],
    meta: null,
    isLoading: false,
};

const slice = createSlice({
    name: 'contactInquiry',
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

        setCustomFields(state, action) {
            state.isLoading = false;
            state.customFields = action.payload;
        },

        setInquiriesCount(state, action) {
            state.isLoading = false;
            state.count = action.payload;
        },

        setMeta(state, action) {
            state.isLoading = false;
            state.meta = action.payload;
        },

        resetInquiries(state) {
            state.isLoading = false;
            state.inquiries = [];
            state.count = 0;
            state.meta = null;
        }
    }
});

export const { resetInquiries } = slice.actions;

export default slice.reducer;

export function getInquiries(params) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.get(`/inquiries/contact-us`, { params });
            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setInquiries(responseData?.data?.submissions || []));
                dispatch(slice.actions.setCustomFields(responseData?.data?.customFields || []));
                dispatch(slice.actions.setInquiriesCount(responseData?.data?.meta?.total || 0));
                dispatch(slice.actions.setMeta(responseData?.data?.meta || null));
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

