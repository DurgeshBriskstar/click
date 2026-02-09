"use client";

import { useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import { getFileFullPath } from "utils/formats";

const geocodeAddress = async (address) => {
  if (!address) return null;

  const encodedAddress = encodeURIComponent(address);

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
      {
        headers: {
          "User-Agent": "ClickITCo-StoreLocator/1.0",
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }

  return null;
};

export default function StoreMapSection({ data, store }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current || !store) return;

    const initMap = async () => {
      try {
        const L = await import("leaflet");
        await import("leaflet/dist/leaflet.css");

        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
          markerRef.current = null;
        }

        if (mapRef.current && mapRef.current._leaflet_id) {
          mapRef.current._leaflet_id = null;
        }

        // Get coordinates
        let coords = null;
        if (store?.lat && store?.lng) {
          coords = { lat: store.lat, lng: store.lng };
        } else if (store?.contact_us?.store_address) {
          coords = await geocodeAddress(store?.contact_us?.store_address);
        }

        // Default center if no coordinates
        const center = coords || [39.8283, -98.5795];
        const zoom = coords ? 13 : 4;

        const map = L.map(mapRef.current, {
          center: center,
          zoom: zoom,
          zoomControl: true,
          scrollWheelZoom: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        // Add marker if coordinates are available
        if (coords) {
          const customIcon = L.divIcon({
            className: "store-map-custom-div-icon",
            html: `<svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 0C6.72 0 0 6.72 0 15C0 26.25 15 40 15 40C15 40 30 26.25 30 15C30 6.72 23.28 0 15 0Z" fill="#F58027"/>
              <circle cx="15" cy="14" r="6" fill="white"/>
            </svg>`,
            iconSize: [30, 40],
            iconAnchor: [15, 40],
            popupAnchor: [0, -40],
          });

          const marker = L.marker([coords.lat, coords.lng], {
            icon: customIcon,
          }).addTo(map);

          const popupContent = `
      <div style="min-width: 200px;">
        <h4 style="margin: 0 0 5px 0; font-weight: 600; color: #1F2937; font-size: 14px; line-height: 1.5;">${store?.store_name}</h4>
        <p style="margin: 0 0 10px 0; font-size: 12px; color: #6B7280; line-height: 1.5;">${store?.contact_us?.store_address}</p>
        ${store?.image
              ? `<img src="${getFileFullPath(store?.image)}" alt="${store?.store_name}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 10px; margin-top: 8px; display: block;">`
              : ""
            }
      </div>
    `;

          marker.bindPopup(popupContent).openPopup();

          markerRef.current = marker;
        }

        mapInstanceRef.current = map;
      } catch (error) {
        console.error("Error loading Leaflet:", error);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [store]);

  if (!data) return null;

  return (
    <section className="section p-0">
      <Container>
        {data?.title && (
          <div className="text-left mb-4" data-aos="fade-up">
            <div className="insights-section">
              <h2 className="insights-section-title">
                {data.title}
                <img
                  src="/images/icons/title-underline.svg"
                  alt="Title underline"
                  fill="true"
                  className="insights-underline"
                />
              </h2>
            </div>
          </div>
        )}
        {data?.subtitle && (
          <p className="mb-4" data-aos="fade-up" data-aos-delay="200">
            {data.subtitle}
          </p>
        )}
        <div
          id="store-detail-map"
          ref={mapRef}
          className="store-detail-map"
          data-aos="fade-up"
          data-aos-delay="300"
        />
      </Container>
    </section>
  );
}

