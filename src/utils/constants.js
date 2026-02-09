export const layoutConstant = {
  topbarHeight: 40,
  headerHeight: 80,
  mobileNavHeight: 64,
  containerWidth: 1200,
  mobileHeaderHeight: 64,
  grocerySidenavWidth: 280
};

export const STATUS_ACTIVE = 1;
export const STATUS_INACTIVE = 0;
export const STATUS_DELETED = 2;

export const userStatus = {
  "active": STATUS_ACTIVE,
  "in_active": STATUS_INACTIVE,
}

// User Roles (DB values)
export const SUPER_ADMIN_ROLE = "super_admin";
export const STORE_ADMIN_ROLE = "store_admin";

// Role options for dropdowns
export const roleOptions = [
  { label: "Super Admin", value: SUPER_ADMIN_ROLE },
  { label: "Store Admin", value: STORE_ADMIN_ROLE },
];

export const cmsPageStatusOptions = [
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" }
];

export const cmsPagesOptions = [
  { label: "Home Page", value: "homepage" },
  { label: "About Us Page", value: "aboutpage" },
  { label: "Service List Page", value: "servicelistpage" },
  { label: "Blog List Page", value: "bloglistpage" },
  { label: "Contact Us Page", value: "contactpage" },
  { label: "Franchise Page", value: "franchisepage" },
  { label: "Store / Locations Page", value: "locationpage" },
  { label: "Appointment Booking Page", value: "appointmentpage" },
  { label: "Privacy Policy Page", value: "privacypage" },
  { label: "Terms & Conditions Page", value: "termspage" },
];

export const moduleStatusOptions = [
  { label: "Active", value: STATUS_ACTIVE },
  { label: "Inactive", value: STATUS_INACTIVE }
];