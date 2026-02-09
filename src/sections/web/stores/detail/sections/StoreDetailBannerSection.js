"use client";

import { Container } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "utils/routes";
import { getFileFullPath } from "utils/formats";

export default function StoreDetailBannerSection({ data, store }) {
  if (!data || !store) return null;

  // Check if image is from backend-assets (use regular img) or static (use Next.js Image)
  const isBackendAsset = store?.image?.startsWith("/backend-assets");

  return (
    <section className="store-detail-banner-section">
      <div className="store-detail-banner-wrapper position-relative">
        <div className="store-detail-banner-bg">
          {store?.image ? (
            isBackendAsset ? (
              <img
                src={getFileFullPath(store.image)}
                alt={store.store_name || "Store Banner"}
                className="object-fit-cover"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Image
                src={store.image}
                alt={store.store_name || "Store Banner"}
                fill
                className="object-fit-cover"
                priority
              />
            )
          ) : (
            <Image
              src="/images/sections/stores/stores-banner.jpg"
              alt="Store Banner"
              fill
              className="object-fit-cover"
              priority
            /> 
          )}
        </div>

        <Container className="position-relative">
          <div className="store-detail-banner-content">
            <div className="store-detail-banner-title">
              <h1 className="text-white mb-0">{store?.store_name || data?.title}</h1>
              {data?.subtitle && (
                <p className="text-white mb-0 mt-2">{data.subtitle}</p>
              )}
            </div>
            <nav aria-label="breadcrumb" className="store-breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/" className="">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_1483_2717)">
                        <path
                          d="M9.00119 4.72925L2.58157 10.0215C2.58157 10.029 2.5797 10.04 2.57594 10.055C2.57227 10.0698 2.57031 10.0806 2.57031 10.0883V15.4473C2.57031 15.6408 2.64105 15.8085 2.7825 15.9497C2.9239 16.091 3.09135 16.1621 3.28488 16.1621H7.57197V11.8747H10.4304V16.1622H14.7175C14.911 16.1622 15.0787 16.0913 15.2199 15.9497C15.3613 15.8086 15.4323 15.6408 15.4323 15.4473V10.0883C15.4323 10.0586 15.4282 10.0361 15.421 10.0215L9.00119 4.72925Z"
                          fill="white"
                        />
                        <path
                          d="M17.8758 8.81573L15.4309 6.78375V2.2285C15.4309 2.12437 15.3974 2.03873 15.3302 1.9717C15.2636 1.90475 15.178 1.87128 15.0736 1.87128H12.93C12.8258 1.87128 12.7401 1.90475 12.6731 1.9717C12.6062 2.03873 12.5727 2.1244 12.5727 2.2285V4.40561L9.8486 2.12792C9.61069 1.93439 9.3278 1.83765 9.00026 1.83765C8.67275 1.83765 8.3899 1.93439 8.15175 2.12792L0.124063 8.81573C0.0496462 8.87517 0.00885955 8.95518 0.00127316 9.05568C-0.00627412 9.1561 0.0197308 9.24382 0.079366 9.31819L0.771565 10.1444C0.831201 10.2114 0.909254 10.2523 1.00604 10.2673C1.09539 10.2748 1.18475 10.2487 1.27411 10.1891L9.00002 3.74688L16.726 10.1891C16.7857 10.241 16.8637 10.267 16.9605 10.267H16.994C17.0907 10.2523 17.1686 10.211 17.2285 10.1443L17.9208 9.31816C17.9803 9.24362 18.0064 9.15606 17.9987 9.05553C17.991 8.9553 17.9501 8.87529 17.8758 8.81573Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1483_2717">
                          <rect width="18" height="18" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    <span>Home</span>
                  </Link>
                </li>
                <li className="breadcrumb-separator">/</li>
                <li className="breadcrumb-item">
                  <Link href={ROUTES?.STORES || "/stores"}>Stores</Link>
                </li>
                <li className="breadcrumb-separator">/</li>
                <li className="breadcrumb-item active" aria-current="page">
                  {store?.store_name}
                </li>
              </ol>
            </nav>
            {data?.buttonText && (
              <div className="store-detail-banner-cta mt-4">
                <Link href={data?.buttonLink || ROUTES?.APPOINTMENT} className="btn-click btn btn-secondary">
                  {data.buttonText}
                  <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="35" height="35" rx="17.5" fill="#F58027" />
                    <path d="M13.5 21.5L21.5 13.5M21.5 13.5H14.3M21.5 13.5V20.7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            )}
            <a href={ROUTES?.APPOINTMENT} className="btn-click">
            Book Your Appointment Now
            <svg
              width="35"
              height="35"
              viewBox="0 0 35 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="35" height="35" rx="17.5" fill="#F58027" />
              <path
                d="M13.5 21.5L21.5 13.5M21.5 13.5H14.3M21.5 13.5V20.7"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          </div>
        </Container>
      </div>
    </section>
  );
}

