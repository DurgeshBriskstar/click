import { createSlice } from '@reduxjs/toolkit';
import secureAxiosInstance from 'lib/secureAxiosInstance';
import axiosInstance from 'lib/axiosInstance';

const initialState = {
    count: 0,
    pages: [],
    page: null,
    isLoading: false,
};

const slice = createSlice({
    name: 'cms',
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
        },

        resetLoader(state) {
            state.isLoading = false;
        },

        setPages(state, action) {
            state.isLoading = false;
            state.pages = action.payload;
        },

        setPagesCount(state, action) {
            state.isLoading = false;
            state.count = action.payload;
        },

        setPage(state, action) {
            state.isLoading = false;
            state.page = action.payload;
        },

        resetPage(state, action) {
            state.isLoading = false;
            state.page = null;
        }
    }
});

// Export reducers
export const { resetPage } = slice.actions;

// Export reducer
export default slice.reducer;

export function getPages(params) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.get(`/cms/pages`, { params });
            const responseData = response?.data;
            if (responseData?.success) {
                dispatch(slice.actions.setPages(responseData?.data));
                dispatch(slice.actions.setPagesCount(responseData?.count || 0));
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

export function getPage(recordId) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.get(`/cms/pages/${recordId}`);
            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setPage(responseData?.data));
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

export function storePage(payload) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.post(`/cms/pages`, payload);

            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setPage(responseData?.data));
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

export function updatePage(recordId, payload) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.put(`/cms/pages/${recordId}`, payload);

            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setPage(responseData?.data));
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

export function deletePage(recordId) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.delete(`/cms/pages/${recordId}`);
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


// Public

export function getPageByKey(page_key) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await axiosInstance.get(`/public/cms/pages/${page_key}`);
            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setPage(responseData?.data));
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
