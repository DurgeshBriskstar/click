import { createSlice } from '@reduxjs/toolkit';
import secureAxiosInstance from 'lib/secureAxiosInstance';

const initialState = {
    count: 0,
    users: [],
    userRecord: null,
    activeStores: [],
    isLoading: false,
};

const slice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
        },

        resetLoader(state) {
            state.isLoading = false;
        },

        setUsers(state, action) {
            state.isLoading = false;
            state.users = action.payload;
        },

        setUsersCount(state, action) {
            state.isLoading = false;
            state.count = action.payload;
        },

        setUserRecord(state, action) {
            state.isLoading = false;
            state.userRecord = action.payload;
        },

        setActiveStores(state, action) {
            state.isLoading = false;
            state.activeStores = action.payload;
        },

        resetUserRecord(state) {
            state.isLoading = false;
            state.userRecord = null;
        }
    }
});

export const { resetUserRecord } = slice.actions;

export default slice.reducer;

export function getUsers(params) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.get(`/users`, { params });
            const responseData = response?.data;
            if (responseData?.success) {
                dispatch(slice.actions.setUsers(responseData?.data));
                dispatch(slice.actions.setUsersCount(responseData?.count || 0));
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

export function getUser(recordId) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.get(`/users/${recordId}`);
            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setUserRecord(responseData?.data));
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

export function storeUser(payload) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.post(`/users`, payload);

            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setUserRecord(responseData?.data));
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

export function updateUser(recordId, payload) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.put(`/users/${recordId}`, payload);

            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setUserRecord(responseData?.data));
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

export function deleteUser(recordId) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.delete(`/users/${recordId}`);
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

export function getActiveStores() {
    return async (dispatch) => {
        try {
            const response = await secureAxiosInstance.get(`/stores`, {
                params: {
                    status: 1,
                    page: 1,
                    rowsPerPage: 1000
                }
            });
            const responseData = response?.data;
            if (responseData?.success) {
                dispatch(slice.actions.setActiveStores(responseData?.data));
                return Promise.resolve(responseData?.data);
            }
            return Promise.reject(responseData);

        } catch (error) {
            const errData = error?.response?.data;
            return Promise.reject(errData);
        }
    };
}
