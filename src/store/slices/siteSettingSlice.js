import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'lib/axiosInstance';
import secureAxiosInstance from 'lib/secureAxiosInstance';

const initialState = {
    count: 0,
    sites: [],
    site: null,
    isLoading: false,
};

const slice = createSlice({
    name: 'siteSetting',
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
        },

        resetLoader(state) {
            state.isLoading = false;
        },

        setSites(state, action) {
            state.isLoading = false;
            state.sites = action.payload;
        },

        setSitesCount(state, action) {
            state.isLoading = false;
            state.count = action.payload;
        },

        setSite(state, action) {
            state.isLoading = false;
            state.site = action.payload;
        },

        resetSite(state, action) {
            state.isLoading = false;
            state.site = null;
        }
    }
});

// Export reducers
export const { resetSite } = slice.actions;

// Export reducer
export default slice.reducer;

export function getSites(params) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.get(`/cms/sites`, { params });
            const responseData = response?.data;
            if (responseData?.success) {
                dispatch(slice.actions.setSites(responseData?.data));
                dispatch(slice.actions.setSitesCount(responseData?.count || 0));
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

export function getSite(recordId) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.get(`/cms/sites/${recordId}`);
            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setSite(responseData?.data));
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

export function getSiteByKey(site_key) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.get(`/cms/sites?site_key=${site_key}`);
            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setSite(responseData?.data));
                return Promise.resolve(responseData);
            }
            dispatch(slice.actions.resetLoader());
            return Promise.reject(response);

        } catch (error) {
            dispatch(slice.actions.resetLoader());
            return Promise.reject(error);
        }
    };
}

export function storeSite(payload) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.post(`/cms/sites`, payload);

            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setSite(responseData?.data));
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

export function updateSite(recordId, payload) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.put(`/cms/sites/${recordId}`, payload);

            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setSite(responseData?.data));
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

export function deleteSite(recordId) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.delete(`/cms/sites/${recordId}`);
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

