import { createSlice } from '@reduxjs/toolkit';
import secureAxiosInstance from 'lib/secureAxiosInstance';
import axiosInstance from 'lib/axiosInstance';

const initialState = {
    count: 0,
    services: [],
    service: null,
    isLoading: false,
};

const slice = createSlice({
    name: 'service',
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
        },

        resetLoader(state) {
            state.isLoading = false;
        },

        setServices(state, action) {
            state.isLoading = false;
            state.services = action.payload;
        },

        setServicesCount(state, action) {
            state.isLoading = false;
            state.count = action.payload;
        },

        setService(state, action) {
            state.isLoading = false;
            state.service = action.payload;
        },

        resetService(state, action) {
            state.isLoading = false;
            state.service = null;
        }
    }
});

// Export reducers
export const { resetService } = slice.actions;

// Export reducer
export default slice.reducer;

export function getServices(params) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.get(`/services`, { params });
            const responseData = response?.data;
            if (responseData?.success) {
                dispatch(slice.actions.setServices(responseData?.data));
                dispatch(slice.actions.setServicesCount(responseData?.count || 0));
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

export function getService(recordId) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.get(`/services/${recordId}`);
            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setService(responseData?.data));
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

export function storeService(payload) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.post(`/services`, payload);

            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setService(responseData?.data));
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

export function updateService(recordId, payload) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.put(`/services/${recordId}`, payload);

            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setService(responseData?.data));
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

export function deleteService(recordId) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.delete(`/services/${recordId}`);
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

