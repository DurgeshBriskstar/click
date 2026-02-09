import SiteSettings from "sections/dashboard/admin/cms/site-settings";

export const metadata = {
  title: "Site Settings | ClickITCo CMS",
  description: "Configure branding, SEO, integrations, and storefront preferences for ClickITCo.",
  authors: [{
    name: "ClickITCo Team",
    url: "https://clickitco.com"
  }],
  keywords: ["ClickITCo", "site settings", "cms", "branding", "seo"]
};

export default async function SettingPage() {

  return <SiteSettings />;
}