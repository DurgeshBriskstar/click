"use client";

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import cmsReducer from "./slices/cmsSlice";
import siteSettingReducer from "./slices/siteSettingSlice";
import serviceReducer from "./slices/serviceSlice";
import storeReducer from "./slices/storeSlice";
import blogReducer from "./slices/blogSlice";
import partnerReducer from "./slices/partnerSlice";
import faqReducer from "./slices/faqSlice";
import contactInquiryReducer from "./slices/inquiries/contactInquiry";
import appointmentInquiryReducer from "./slices/inquiries/appointmentInquiry";
import franchiseInquiryReducer from "./slices/inquiries/franchiseInquiry";
import dashboardInquiryReducer from "./slices/inquiries/dashboardInquiry";
import quickbooksCustomerReducer from "./slices/quickbooksCustomerSlice";
import quickbooksProductReducer from "./slices/quickbooksProductSlice";
import ghlCustomFieldsReducer from "./slices/ghlCustomFieldsSlice";

import dataReducer from "./slices/dataSlice"; //temp

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        cms: cmsReducer,
        siteSetting: siteSettingReducer,
        service: serviceReducer,
        store: storeReducer,
        blog: blogReducer,
        partner: partnerReducer,
        faq: faqReducer,
        contactInquiry: contactInquiryReducer,
        appointmentInquiry: appointmentInquiryReducer,
        franchiseInquiry: franchiseInquiryReducer,
        dashboardInquiry: dashboardInquiryReducer,
        quickbooksCustomer: quickbooksCustomerReducer,
        quickbooksProduct: quickbooksProductReducer,
        ghlCustomFields: ghlCustomFieldsReducer,

        data: dataReducer, //temp
    },
});
