import { createSlice } from '@reduxjs/toolkit';
import secureAxiosInstance from 'lib/secureAxiosInstance';

const initialState = {
    count: 0,
    stores: [],
    store: null,
    selectedStoreId: null,
    isLoading: false,
};

const slice = createSlice({
    name: 'store',
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
        },

        resetLoader(state) {
            state.isLoading = false;
        },

        setStores(state, action) {
            state.isLoading = false;
            state.stores = action.payload;
        },

        setStoresCount(state, action) {
            state.isLoading = false;
            state.count = action.payload;
        },

        setStore(state, action) {
            state.isLoading = false;
            state.store = action.payload;
        },

        setSelectedStoreId(state, action) {
            state.selectedStoreId = action.payload;
        },

        resetStore(state) {
            state.isLoading = false;
            state.store = null;
        }
    }
});

export const { resetStore, setSelectedStoreId } = slice.actions;

export default slice.reducer;

export function getStores(params) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.get(`/stores`, { params });
            const responseData = response?.data;
            if (responseData?.success) {
                dispatch(slice.actions.setStores(responseData?.data));
                dispatch(slice.actions.setStoresCount(responseData?.count || 0));
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

export function getStore(recordId) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.get(`/stores/${recordId}`);
            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setStore(responseData?.data));
                return Promise.resolve(responseData);
            }
            dispatch(slice.actions.resetLoader());
            return Promise.reject(response);

        } catch (error) {
            const errData = error?.response?.data;
            dispatch(slice.actions.resetLoader());
            return Promise.reject(errData);
        }
    };
}

export function storeStore(payload) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.post(`/stores`, payload);

            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setStore(responseData?.data));
                return Promise.resolve(responseData);
            }

            dispatch(slice.actions.resetLoader());
            return Promise.reject(response);

        } catch (error) {
            const errData = error?.response?.data;
            dispatch(slice.actions.resetLoader());
            return Promise.reject(errData);
        }
    };
}

export function updateStore(recordId, payload) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.put(`/stores/${recordId}`, payload);

            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setStore(responseData?.data));
                return Promise.resolve(responseData);
            }

            dispatch(slice.actions.resetLoader());
            return Promise.reject(response);

        } catch (error) {
            const errData = error?.response?.data;
            dispatch(slice.actions.resetLoader());
            return Promise.reject(errData);
        }
    };
}

export function deleteStore(recordId) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.delete(`/stores/${recordId}`);
            const responseData = response?.data;

            if (responseData?.success) {
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

export function cloneStore(recordId) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.post(`/stores/${recordId}/clone`);
            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.resetLoader());
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

export function makePrimaryStore(recordId) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.post(`/stores/${recordId}/make-primary`);
            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.resetLoader());
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

export function checkPrimaryStore() {
    return async (dispatch) => {
        try {
            const response = await secureAxiosInstance.get(`/stores/check-primary`);
            const responseData = response?.data;

            if (responseData?.success) {
                return Promise.resolve(responseData);
            }

            return Promise.reject(responseData);

        } catch (error) {
            const errData = error?.response?.data;
            return Promise.reject(errData);
        }
    };
}

