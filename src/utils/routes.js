export const ROUTES = {
    // WEB
    HOMEPAGE: "/",
    LOGIN: "/login",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    APPOINTMENT: "/appointment",
    SERVICES: "/services",
    STORES: "/stores",
    ABOUT: "/about",
    CONTACT: "/contact",
    FRANCHISE: "/franchise",
    BLOGS: "/blogs",
    PRIVACY: "/privacy",
    TERMS: "/terms",

    // ADMIN
    ADMIN: {
        DASHBOARD: "/admin/dashboard",
        PROFILE: "/admin/profile",
        CMS: {
            PAGE: {
                LIST: "/admin/cms/pages",
                ADD: "/admin/cms/pages/create",
                EDIT: (id) => `/admin/cms/pages/${id}`,
            },
            SITESETTING: "/admin/cms/site-settings",
        },
        SUPPORT: {
            FAQ: {
                LIST: "/admin/support/faqs",
                ADD: "/admin/support/faqs/create",
                EDIT: (id) => `/admin/support/faqs/${id}`,
            },
        },
        SERVICE:
        {
            LIST: "/admin/services",
            ADD: "/admin/services/create",
            EDIT: (id) => `/admin/services/${id}`,
        },
        STORE: {
            LIST: "/admin/stores",
            ADD: "/admin/stores/create",
            EDIT: (id) => `/admin/stores/${id}`,
        },
        BLOGS: {
            LIST: "/admin/blogs",
            ADD: "/admin/blogs/create",
            EDIT: (id) => `/admin/blogs/${id}`,
        },
        PARTNER: {
            LIST: "/admin/partners",
            ADD: "/admin/partners/create",
            EDIT: (id) => `/admin/partners/${id}`,
        },
        USER: {
            LIST: "/admin/users",
            ADD: "/admin/users/create",
            EDIT: (id) => `/admin/users/${id}`,
        },
        INQUIRIES: {
            CONTACT: {
                LIST: "/admin/inquiries/contact-us",
            },
            APPOINTMENT: {
                LIST: "/admin/inquiries/appointments",
            },
            FRANCHISE: {
                LIST: "/admin/inquiries/franchise-requests",
            },
        },
        QUICKBOOKS: {
            CUSTOMERS: {
                LIST: "/admin/quickbooks/customers",
            },
            PRODUCTS: {
                LIST: "/admin/quickbooks/products",
            },
        },
    },

    STORE: {
        DASHBOARD: "/store/dashboard",
        PROFILE: "/store/profile",
        STORE_WEB_PAGE: "/store/store-web-page",
        INQUIRIES: {
            CONTACT: {
                LIST: "/store/inquiries/contact-us",
            },
            APPOINTMENT: {
                LIST: "/store/inquiries/appointments",
            },
        },
    }
}