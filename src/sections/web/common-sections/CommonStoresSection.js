"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Container } from "react-bootstrap";
import { ROUTES } from "utils/routes";
import { getFileFullPath } from "utils/formats";

const geocodeCache = new Map();

const normalizeAddress = (address) => {
  if (!address) return "";

  let cleaned = address;

  // Only remove suite/unit/apartment patterns - keep abbreviations as-is
  // Geocoding services like Nominatim handle standard abbreviations (W, E, N, S, Rd, St, Ave, etc.) well
  // Expanding them can actually confuse the geocoder
  const patternsToRemove = [
    /,?\s*(suite|ste\.?|unit|apt\.?|apartment|bldg\.?|building|floor|fl\.?)\s*#?\s*[\w\-]+/gi,
    /,?\s*#\s*[\w\-]+/gi,
  ];

  patternsToRemove.forEach((pattern) => {
    cleaned = cleaned.replace(pattern, "");
  });

  // Clean up whitespace and extra commas
  cleaned = cleaned
    .replace(/\s+/g, " ")
    .replace(/,\s*,/g, ",")
    .replace(/^\s*,\s*/, "")
    .replace(/\s*,\s*$/, "")
    .trim();

  return cleaned;
};

const tryGeocode = async (address) => {
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

const geocodeAddress = async (address) => {
  if (!address) return null;

  if (geocodeCache.has(address)) {
    return geocodeCache.get(address);
  }

  const normalizedAddress = normalizeAddress(address);

  let result = await tryGeocode(normalizedAddress);

  if (!result) {
    const cityStateMatch = address.match(/([A-Za-z\s]+),\s*([A-Za-z\s]+),?\s*(\d{5})?/);
    if (cityStateMatch) {
      const fallbackAddress = cityStateMatch[0];
      result = await tryGeocode(fallbackAddress);
    }
  }

  if (result) {
    geocodeCache.set(address, result);
  }

  return result;
};

const getStoreCoordinates = async (store) => {
  if (store?.lat && store?.lng) {
    return { lat: store?.lat, lng: store?.lng };
  }

  if (store?.contact_us?.store_address) {
    return await geocodeAddress(store?.contact_us?.store_address);
  }

  return null;
};

export default function StoresSection({ data, stores }) {
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [geocodedStores, setGeocodedStores] = useState([]);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const popupRef = useRef(null);

  if (!data) return null;
  const storeData = stores?.data || [];

  useEffect(() => {
    const geocodeAllStores = async () => {
      if (storeData.length === 0) return;

      setIsGeocoding(true);

      const geocodedResults = await Promise.all(
        storeData.map(async (store, index) => {
          if (index > 0) {
            await new Promise((resolve) => setTimeout(resolve, 1100));
          }

          const coords = await getStoreCoordinates(store);
          return {
            ...store,
            lat: coords?.lat || store?.lat,
            lng: coords?.lng || store?.lng,
          };
        })
      );

      setGeocodedStores(geocodedResults);
      setIsGeocoding(false);
    };

    geocodeAllStores();
  }, [storeData]);

  const effectiveStoreData = geocodedStores.length > 0 ? geocodedStores : storeData;

  // Filter stores based on search query
  const filteredStores = searchQuery.trim()
    ? effectiveStoreData.filter((store) => {
      const query = searchQuery.toLowerCase();
      return (
        store?.store_name?.toLowerCase().includes(query) ||
        store?.contact_us?.store_address?.toLowerCase().includes(query)
      );
    })
    : effectiveStoreData;

  // Sort filtered stores
  const sortedStores = [...filteredStores].sort((a, b) => {
    const query = searchQuery.toLowerCase();

    if (selectedStoreId === a.id) return -1;
    if (selectedStoreId === b.id) return 1;

    if (!query) return 0;

    const aMatches =
      a?.store_name?.toLowerCase().includes(query) ||
      a?.contact_us?.store_address?.toLowerCase().includes(query);
    const bMatches =
      b?.store_name?.toLowerCase().includes(query) ||
      b?.contact_us?.store_address?.toLowerCase().includes(query);

    if (aMatches && !bMatches) return -1;
    if (!aMatches && bMatches) return 1;

    return 0;
  });

  const handleStoreSelect = useCallback(
    (storeId) => {
      setSelectedStoreId(storeId);
    },
    [effectiveStoreData]
  );

  const showMapPopup = useCallback((store, L) => {
    if (!mapInstanceRef.current || !store?.lat || !store?.lng || !L) return;

    if (popupRef.current) {
      mapInstanceRef.current.closePopup(popupRef.current);
    }

    const popupContent = `
      <div style="min-width: 200px;">
        <h4 style="margin: 0 0 10px 0; font-weight: 600; font-size: 14px; line-height: 1.5;">${store?.store_name
      }</h4>
        <p style="margin: 0 0 5px 0; font-size: 12px; line-height: 1.5;">${store?.contact_us?.store_address}</p>
        <a href="${store?.store_slug ? `${ROUTES?.STORES}/${store?.store_slug}` : "#"}" style="margin: 0 0 5px 0; font-size: 12px; color: var(--primary-light); text-decoration: none; line-height: 1.5;">Learn More</a>
        ${store?.image
        ? `<img src="${getFileFullPath(store?.image)}" alt="${store?.store_name}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 10px; margin-top: 8px; display: block;">`
        : ""
      }
      </div>
    `;

    popupRef.current = L.popup({
      closeButton: true,
      className: "stores-map-popup",
    })
      .setLatLng([store?.lat, store?.lng])
      .setContent(popupContent)
      .openOn(mapInstanceRef.current);
  }, []);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !mapRef.current ||
      effectiveStoreData.length === 0 ||
      isGeocoding
    )
      return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      markersRef.current = {};
      popupRef.current = null;
    }

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

        if (mapRef.current && mapRef.current._leaflet_id) {
          mapRef.current._leaflet_id = null;
        }

        const map = L.map(mapRef.current, {
          center: [39.8283, -98.5795],
          zoom: 4,
          zoomControl: true,
          scrollWheelZoom: true,
        });


        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        const customIcon = L.divIcon({
          className: "stores-custom-div-icon",
          html: `<svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 0C6.72 0 0 6.72 0 15C0 26.25 15 40 15 40C15 40 30 26.25 30 15C30 6.72 23.28 0 15 0Z" fill="#003D7A"/>
            <circle cx="15" cy="14" r="6" fill="white"/>
          </svg>`,
          iconSize: [30, 40],
          iconAnchor: [15, 40],
          popupAnchor: [0, -40],
        });

        effectiveStoreData.forEach((store) => {
          if (store?.lat && store?.lng) {
            const marker = L.marker([store?.lat, store?.lng], {
              icon: customIcon,
            }).addTo(map);

            marker.on("click", () => {
              handleStoreSelect(store?.id);
            });

            markersRef.current[store?.id] = marker;
          }
        });

        mapInstanceRef.current = map;

        setTimeout(() => {
          if (selectedStoreId) {
            const selectedStore = effectiveStoreData.find((s) => s.id === selectedStoreId);
            if (selectedStore && selectedStore.lat && selectedStore.lng) {
              map.flyTo([selectedStore.lat, selectedStore.lng], 6, {
                duration: 1.5,
                animate: true,
              });
              setTimeout(() => {
                showMapPopup(selectedStore, L);
              }, 1600);
            }
          }
        }, 500);
      } catch (error) {
        console.error("Error loading Leaflet:", error);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = {};
        popupRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveStoreData, isGeocoding]);

  useEffect(() => {
    if (!mapInstanceRef.current || !selectedStoreId || !effectiveStoreData.length) return;

    const updateMap = async () => {
      try {
        const L = await import("leaflet");
        const selectedStore = effectiveStoreData.find((s) => s.id === selectedStoreId);
        if (selectedStore && selectedStore.lat && selectedStore.lng) {
          mapInstanceRef.current.flyTo(
            [selectedStore.lat, selectedStore.lng],
            6,
            {
              duration: 1.5,
              animate: true,
            }
          );

          setSearchQuery("");
          setTimeout(() => {
            showMapPopup(selectedStore, L);
          }, 1600);
        }
      } catch (error) {
        console.error("Error updating map:", error);
      }
    };

    updateMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStoreId, effectiveStoreData]);

  const handleGeolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          let nearestStore = effectiveStoreData[0];
          let minDistance = Infinity;

          effectiveStoreData.forEach((store) => {
            if (store?.lat && store?.lng) {
              const distance = getDistance(
                userLat,
                userLng,
                store?.lat,
                store?.lng
              );
              if (distance < minDistance) {
                minDistance = distance;
                nearestStore = store;
              }
            }
          });

          if (nearestStore) {
            handleStoreSelect(nearestStore.id);
          }
        },
        (error) => {
          console.warn("Geolocation error:", error);
          alert("Unable to get your location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const selectedStore = effectiveStoreData.find((s) => s.id === selectedStoreId);

  return (
    <section className="section gray-bg">
      <Container>
        <div className="stores-content">
          <div className="stores-map-container" data-aos="fade-up" data-aos-delay="200">
            <div className="text-left">
              <div className="insights-section" data-aos="fade-up">
                <h2 className="insights-section-title">
                  {data?.title || ""}
                  <img src="/images/icons/title-underline.svg" alt="Title underline" fill="true" className="insights-underline" />
                </h2>
              </div>
              <p data-aos="fade-right" data-aos-delay="200">{data?.subtitle}</p>
            </div>
            <div id="stores-map" ref={mapRef} className="stores-map">
              {isGeocoding && (
                <div className="stores-map-loading">
                  <div className="stores-map-loading-spinner"></div>
                  <span>Loading store locations...</span>
                </div>
              )}
            </div>
          </div>

          <aside className="stores-sidebar" data-aos="fade-up" data-aos-delay="300">
            <div className="stores-search-box">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5044 12.4809L15.75 15.75M14.25 8.25C14.25 11.5637 11.5637 14.25 8.25 14.25C4.93629 14.25 2.25 11.5637 2.25 8.25C2.25 4.93629 4.93629 2.25 8.25 2.25C11.5637 2.25 14.25 4.93629 14.25 8.25Z" stroke="#0C0E11" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                type="text"
                className="stores-search-input"
                id="storesSearchInput"
                placeholder={selectedStore?.store_name || "Search location..."}
                value={searchQuery}
                onChange={(e) => {
                  setSelectedStoreId(null);
                  setSearchQuery(e.target.value);
                }}
                onFocus={(e) => {
                  const currentValue = e.target.value;
                  const isLocationName = effectiveStoreData.some(
                    (store) => store?.store_name === currentValue
                  );
                  if (isLocationName) {
                    e.target.select();
                  }
                }}
              />
              <svg className="stores-location-icon" id="storesGeolocateBtn" width="20" height="24" viewBox="0 0 20 24" fill="none" onClick={handleGeolocate} style={{ cursor: "pointer" }}>
                <path d="M10 0C4.48 0 0 4.48 0 10C0 17.5 10 24 10 24C10 24 20 17.5 20 10C20 4.48 15.52 0 10 0ZM10 13C8.34 13 7 11.66 7 10C7 8.34 8.34 7 10 7C11.66 7 13 8.34 13 10C13 11.66 11.66 13 10 13Z" fill="#00489A" />
              </svg>
            </div>

            <div className="stores-location-list" id="storesLocationList">
              {sortedStores.length === 0
                ? (
                  <div className="stores-no-results">
                    {searchQuery.trim()
                      ? `No results found for "${searchQuery}"`
                      : "No locations found"
                    }
                  </div>
                )
                : (
                  sortedStores.map((store) => {
                    const isActive = selectedStoreId === store?.id;
                    const query = searchQuery.toLowerCase();
                    const isMatching = query && (
                      store?.store_name?.toLowerCase().includes(query) ||
                      store?.contact_us?.store_address?.toLowerCase().includes(query)
                    );
                    return (
                      <div key={store?.id} className={`stores-location-card ${isActive ? "active" : ""} ${isMatching ? "matching" : ""}`} onClick={() => handleStoreSelect(store?.id)}>
                        <div className="stores-location-name">{store?.store_name}</div>
                        <div className="stores-location-address-wrapper">
                          <svg className="stores-location-icon" id="storesGeolocateBtn" width="16" height="20" viewBox="0 0 20 24" fill="none" onClick={handleGeolocate} style={{ cursor: "pointer" }}>
                            <path d="M10 0C4.48 0 0 4.48 0 10C0 17.5 10 24 10 24C10 24 20 17.5 20 10C20 4.48 15.52 0 10 0ZM10 13C8.34 13 7 11.66 7 10C7 8.34 8.34 7 10 7C11.66 7 13 8.34 13 10C13 11.66 11.66 13 10 13Z" fill="#78829d" />
                          </svg>
                          <div className="stores-location-address">
                            {store?.contact_us?.store_address}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
