import StoreDetailPage from "sections/web/stores/detail";
import { getRecordByPageKey } from "server/services/cms.service";
import { getRecordBySlug } from "server/services/store.service";
import { getActiveServicesRecords } from "server/services/service.service";
import { getActivePartnersRecords } from "server/services/partner.service";
import { getActiveFAQsRecords } from "server/services/faq.service";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const store = await getRecordBySlug(slug);

  if (!store) {
    return {
      title: "Store Not Found | ClickITCo Support",
      description: "The requested store could not be found.",
    };
  }

  return {
    title: `${store.store_name} | ClickITCo Support`,
    description: `Visit ${store.store_name} - Your local technology partner. ${store?.contact_us?.store_address || ''}`,
    keywords: ["ClickITCo", "store", "location", store.store_name, store?.contact_us?.store_address],
    authors: [{
      name: "ClickITCo Team",
      url: "https://clickitco.com"
    }],
  };
}

export default async function StoreDetailPageRoute({ params }) {
  const { slug } = await params;
  const store = await getRecordBySlug(slug);

  if (!store) {
    notFound();
  }
  const pageData = store.sections
    ? { sections: store.sections }
    : await getRecordByPageKey("locationpage");

  const serviceData = await getActiveServicesRecords();
  const partnerData = await getActivePartnersRecords();
  const faqData = await getActiveFAQsRecords();

  return (
    <StoreDetailPage
      data={pageData || {}}
      store={store}
      services={serviceData || []}
      partners={partnerData || []}
      faqs={faqData || []}
    />
  );
}
