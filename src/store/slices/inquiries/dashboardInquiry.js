import { createSlice } from '@reduxjs/toolkit';
import secureAxiosInstance from 'lib/secureAxiosInstance';
import { startOfMonth, endOfMonth } from "date-fns";

const initialState = {
    contactInquiryCount: 0,
    appointmentInquiryCount: 0,
    isLoading: false,
    startDate: startOfMonth(new Date()).toISOString(),
    endDate: endOfMonth(new Date()).toISOString(),
};

const slice = createSlice({
    name: 'dashboardInquiry',
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
        },

        resetLoader(state) {
            state.isLoading = false;
        },

        setContactInquiryCount(state, action) {
            state.contactInquiryCount = action.payload;
        },

        setAppointmentInquiryCount(state, action) {
            state.appointmentInquiryCount = action.payload;
        },

        setStartDate(state, action) {
            state.startDate = action.payload;
        },

        setEndDate(state, action) {
            state.endDate = action.payload;
        },

        resetCounts(state) {
            state.isLoading = false;
            state.contactInquiryCount = 0;
            state.appointmentInquiryCount = 0;
        }
    }
});

export const { resetCounts, setStartDate, setEndDate } = slice.actions;

export default slice.reducer;

export function getContactInquiryCount(params) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.get(`/inquiries/contact-us`, { params: { ...params, limit: 1 } });
            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setContactInquiryCount(responseData?.data?.meta?.total || 0));
                dispatch(slice.actions.resetLoader());
                return Promise.resolve(responseData?.data?.meta?.total || 0);
            }

            dispatch(slice.actions.resetLoader());
            return Promise.resolve(0);

        } catch (error) {
            dispatch(slice.actions.resetLoader());
            return Promise.resolve(0);
        }
    };
}

export function getAppointmentInquiryCount(params) {
    return async (dispatch) => {
        try {
            const response = await secureAxiosInstance.get(`/inquiries/appointments`, { params: { ...params, limit: 1 } });
            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setAppointmentInquiryCount(responseData?.data?.meta?.total || 0));
                dispatch(slice.actions.resetLoader());
                return Promise.resolve(responseData?.data?.meta?.total || 0);
            }

            dispatch(slice.actions.resetLoader());
            return Promise.resolve(0);

        } catch (error) {
            dispatch(slice.actions.resetLoader());
            return Promise.resolve(0);
        }
    };
}

