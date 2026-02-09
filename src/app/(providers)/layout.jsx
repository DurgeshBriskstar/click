import "overlayscrollbars/overlayscrollbars.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../assets/swal.css";
import "i18n";
import { getRecordBySiteKey } from "server/services/site.service";
import { getActivePrimaryStore } from "server/services/store.service";
import ThemeProvider from "theme/theme-provider";
import ReduxProvider from "store/Provider";
import SettingsProvider from "contexts/SettingContext";
import RTL from "components/rtl";
import SnackbarClient from "components/custom/common/SnackbarClient";
import { SiteProvider } from "contexts/SiteContext";

const SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY || "clickitco";

export async function generateMetadata() {
    let faviconUrl = "/favicon.ico";

    const settings = await getRecordBySiteKey(SITE_KEY);

    faviconUrl = settings?.site_favicon || "/favicon.ico";

    return {
        icons: {
            icon: faviconUrl
        }
    };
}

// Disable caching to ensure fresh site settings and data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProviderLayout({ children, modal }) {
    let siteSettings = null;
    try {
        siteSettings = await getRecordBySiteKey(SITE_KEY);
        const primaryStore = await getActivePrimaryStore();

        if (primaryStore && primaryStore?.id) {
            siteSettings = {
                ...siteSettings,
                phone: primaryStore?.contact_us?.store_phone || "",
                email: primaryStore?.contact_us?.store_email || "",
                address: primaryStore?.contact_us?.store_address || "",
                ...primaryStore?.social_links
            }
        }
    } catch (error) {
        console.log("Failed to fetch site settings:", error);
    }

    return (
        <ThemeProvider>
            <SiteProvider siteSettings={siteSettings}>
                <ReduxProvider>
                    <SettingsProvider>
                        <SnackbarClient>
                            <RTL>
                                {modal}
                                {children}
                            </RTL>
                        </SnackbarClient>
                    </SettingsProvider>
                </ReduxProvider>
            </SiteProvider>
        </ThemeProvider>
    );
}
