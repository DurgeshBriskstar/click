import duotone from "icons/duotone";
import { ROUTES } from "utils/routes";

export const AdminNavigation = [
  {
    type: "label",
    label: "Super Admin",
  },
  {
    name: "Dashboard",
    icon: duotone.Dashboard,
    path: ROUTES?.ADMIN?.DASHBOARD,
  },
  {
    name: "Services",
    path: ROUTES?.ADMIN?.SERVICE?.LIST,
    icon: duotone.ElementHub,
  },
  {
    name: "User Management",
    path: ROUTES?.ADMIN?.USER?.LIST,
    icon: duotone.Customers,
  },
  {
    name: "Store Management",
    path: ROUTES?.ADMIN?.STORE?.LIST,
    icon: duotone.Seller,
  },
  {
    name: "Blog Management",
    path: ROUTES?.ADMIN?.BLOGS?.LIST,
    icon: duotone.Pages,
  },
  {
    name: "Website Management",
    icon: duotone.SiteSetting,
    children: [
      {
        name: "Site Settings",
        path: ROUTES?.ADMIN?.CMS?.SITESETTING
      },
      {
        name: "CMS Pages",
        path: ROUTES?.ADMIN?.CMS?.PAGE?.LIST
      },
      {
        name: "Our Partners",
        path: ROUTES?.ADMIN?.PARTNER?.LIST
      }
    ]
  },
  {
    name: "Website Inquiries",
    icon: duotone.ContactSupport,
    children: [
      {
        name: "Contact Us",
        path: ROUTES?.ADMIN?.INQUIRIES?.CONTACT?.LIST,
      },
      {
        name: "Appointments",
        path: ROUTES?.ADMIN?.INQUIRIES?.APPOINTMENT?.LIST,
      },
      {
        name: "Franchise Requests",
        path: ROUTES?.ADMIN?.INQUIRIES?.FRANCHISE?.LIST,
      },
    ]
  },
  {
    name: "Support & Feedback",
    icon: duotone.Review,
    children: [
      {
        name: "FAQ Management",
        path: ROUTES?.ADMIN?.SUPPORT?.FAQ?.LIST
      }
    ]
  },
  {
    name: "Quickbook Data",
    icon: duotone.DataTable,
    children: [
      {
        name: "Customers",
        path: ROUTES?.ADMIN?.QUICKBOOKS?.CUSTOMERS?.LIST,
      },
      {
        name: "Products",
        path: ROUTES?.ADMIN?.QUICKBOOKS?.PRODUCTS?.LIST,
      },
    ]
  },
];

export const storeNavigation = [
  {
    type: "label",
    label: "Store Admin",
  },
  {
    name: "Dashboard",
    icon: duotone.Dashboard,
    path: ROUTES?.STORE?.DASHBOARD,
  },
  {
    name: "Store web page",
    icon: duotone.Seller,
    path: ROUTES?.STORE?.STORE_WEB_PAGE,
  },
  {
    name: "Website Inquiries",
    icon: duotone.ContactSupport,
    children: [
      {
        name: "Contact Us",
        path: ROUTES?.STORE?.INQUIRIES?.CONTACT?.LIST,
      },
      {
        name: "Appointments",
        path: ROUTES?.STORE?.INQUIRIES?.APPOINTMENT?.LIST,
      },
    ]
  },
];