import { createSlice } from '@reduxjs/toolkit';
import secureAxiosInstance from 'lib/secureAxiosInstance';

const initialState = {
    count: 0,
    customers: [],
    isLoading: false,
};

const slice = createSlice({
    name: 'quickbooksCustomer',
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
        },

        resetLoader(state) {
            state.isLoading = false;
        },

        setCustomers(state, action) {
            state.isLoading = false;
            state.customers = action.payload;
        },

        setCustomersCount(state, action) {
            state.isLoading = false;
            state.count = action.payload;
        },

        resetCustomers(state) {
            state.isLoading = false;
            state.customers = [];
            state.count = 0;
        }
    }
});

export const { resetCustomers } = slice.actions;

export default slice.reducer;

export function getQuickBooksCustomers(params = {}) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.get(`/quickbooks/customers`, { params: { ...params, minorversion: params.minorversion || 65 } });
            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setCustomers(responseData?.data || []));
                dispatch(slice.actions.setCustomersCount(responseData?.count ?? 0));
                return Promise.resolve(responseData);
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
