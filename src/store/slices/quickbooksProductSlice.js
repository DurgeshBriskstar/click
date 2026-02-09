import { createSlice } from '@reduxjs/toolkit';
import secureAxiosInstance from 'lib/secureAxiosInstance';

const initialState = {
    count: 0,
    products: [],
    isLoading: false,
};

const slice = createSlice({
    name: 'quickbooksProduct',
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
        },

        resetLoader(state) {
            state.isLoading = false;
        },

        setProducts(state, action) {
            state.isLoading = false;
            state.products = action.payload;
        },

        setProductsCount(state, action) {
            state.isLoading = false;
            state.count = action.payload;
        },

        resetProducts(state) {
            state.isLoading = false;
            state.products = [];
            state.count = 0;
        }
    }
});

export const { resetProducts } = slice.actions;

export default slice.reducer;

export function getQuickBooksProducts(params = {}) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.get(`/quickbooks/products`, { params: { ...params, minorversion: params.minorversion || 65 } });
            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setProducts(responseData?.data || []));
                dispatch(slice.actions.setProductsCount(responseData?.count ?? 0));
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
