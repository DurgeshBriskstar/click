"use client";

import { createSlice } from '@reduxjs/toolkit';
import secureAxiosInstance from 'lib/secureAxiosInstance';

const initialState = {
    count: 0,
    blogs: [],
    blog: null,
    isLoading: false,
};

const slice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
        },

        resetLoader(state) {
            state.isLoading = false;
        },

        setBlogs(state, action) {
            state.isLoading = false;
            state.blogs = action.payload;
        },

        setBlogsCount(state, action) {
            state.isLoading = false;
            state.count = action.payload;
        },

        setBlog(state, action) {
            state.isLoading = false;
            state.blog = action.payload;
        },

        resetBlog(state) {
            state.isLoading = false;
            state.blog = null;
        }
    }
});

export const { resetBlog } = slice.actions;

export default slice.reducer;

export function getBlogs(params) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.get(`/blogs`, { params });
            const responseData = response?.data;
            if (responseData?.success) {
                dispatch(slice.actions.setBlogs(responseData?.data));
                dispatch(slice.actions.setBlogsCount(responseData?.count || 0));
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

export function getBlog(recordId) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.get(`/blogs/${recordId}`);
            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setBlog(responseData?.data));
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

export function storeBlog(payload) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.post(`/blogs`, payload);

            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setBlog(responseData?.data));
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

export function updateBlog(recordId, payload) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.put(`/blogs/${recordId}`, payload);

            const responseData = response?.data;

            if (responseData?.success) {
                dispatch(slice.actions.setBlog(responseData?.data));
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

export function deleteBlog(recordId) {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.startLoading());

            const response = await secureAxiosInstance.delete(`/blogs/${recordId}`);
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


