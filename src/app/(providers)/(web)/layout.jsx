import Script from "next/script";
import "../../assets/web/index.css"
import Header from "sections/web/common/Header/Header";
import Footer from "sections/web/common/Footer/Footer";
import CookieConsent from "sections/web/common/CookieConsent/CookieConsent";
import { getActiveServicesRecords } from "server/services/service.service";
import AosProvider from "components/AosProvider";

export default async function WebLayout({ children }) {

    // Fetch active services for navigation
    let servicesData = null;
    try {
        const servicesResult = await getActiveServicesRecords();
        servicesData = servicesResult?.data || [];
    } catch (error) {
        console.log("Failed to fetch services:", error);
    }

    return (
        <>
            <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
            <Header services={servicesData || []} />
            <AosProvider>
                {children}
            </AosProvider>
            <Footer />
            <CookieConsent />
            <Script src='https://reputationhub.site/reputation/assets/review-widget.js' strategy="afterInteractive" />
            <Script src='https://link.clickitcrm.com/js/form_embed.js' strategy="afterInteractive" />
            <Script src="https://unpkg.com/aos@2.3.1/dist/aos.js" strategy="afterInteractive" />
        </>
    );
}
