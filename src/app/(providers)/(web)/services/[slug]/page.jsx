import { Container } from "react-bootstrap";
import ServiceLayoutOne from "sections/web/services/detail/layout-one";
import ServiceLayoutThree from "sections/web/services/detail/layout-three";
import ServiceLayoutTwo from "sections/web/services/detail/layout-two";
import { getActiveFAQsRecords } from "server/services/faq.service";
import { getActivePartnersRecords } from "server/services/partner.service";
import { getActiveServicesRecords, getServiceRecordBySlug } from "server/services/service.service";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = await getServiceRecordBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found | ClickITCo Support",
      description: "The requested service could not be found.",
    };
  }

  return {
    title: `${service?.service_name} | ClickITCo Support`,
    description: service?.short_description || `Read ${service?.service_name} on ClickITCo Support.`,
    keywords: ["ClickITCo", "service", service?.service_name, service?.short_description],
    authors: [{
      name: "ClickITCo Team",
      url: "https://clickitco.com"
    }],
  };
}

function ServiceLayoutNotFound({ serviceName }) {
  return (
    <section className="section">
      <Container>
        <div className="alert alert-warning d-flex align-items-center justify-content-center" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-3" viewBox="0 0 16 16">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </svg>
          <div>
            <strong>Detail page not available!</strong> The detail page layout for "<strong>{serviceName}</strong>" service has not been configured yet.
          </div>
        </div>
      </Container>
    </section>
  );
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;

  const service = await getServiceRecordBySlug(slug);

  if (!service) {
    notFound();
  }

  const serviceData = await getActiveServicesRecords();
  const partnerData = await getActivePartnersRecords();
  const faqData = await getActiveFAQsRecords();

  const LAYOUT_CODE = service?.layout_code || null;
  const sections = LAYOUT_CODE ? service?.sections[LAYOUT_CODE] : null;

  return (
    LAYOUT_CODE === "LAYOUT_1" ? <ServiceLayoutOne serviceData={service} sections={sections} services={serviceData || []} partners={partnerData || []} faqs={faqData || []} />
      : LAYOUT_CODE === "LAYOUT_2" ? <ServiceLayoutTwo serviceData={service} sections={sections} services={serviceData || []} partners={partnerData || []} faqs={faqData || []} />
        : LAYOUT_CODE === "LAYOUT_3" ? <ServiceLayoutThree serviceData={service} sections={sections} services={serviceData || []} partners={partnerData || []} faqs={faqData || []} />
          : <ServiceLayoutNotFound serviceName={service?.service_name} />
  );
}