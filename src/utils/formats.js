import { formatDistanceStrict } from "date-fns/formatDistanceStrict";

/**
 * GET THE DIFFERENCE DATE FORMAT
 * @param  DATE | NUMBER | STRING
 * @returns FORMATTED DATE STRING
 */

export function getDateDifference(date) {
  const distance = formatDistanceStrict(new Date(), new Date(date));
  return distance + " ago";
}

/**
 * RENDER THE PRODUCT PAGINATION INFO
 * @param page - CURRENT PAGE NUMBER
 * @param perPageProduct - PER PAGE PRODUCT LIST
 * @param totalProduct - TOTAL PRODUCT NUMBER
 * @returns
 */

export function renderProductCount(page, perPageProduct, totalProduct) {
  let startNumber = (page - 1) * perPageProduct;
  let endNumber = page * perPageProduct;
  if (endNumber > totalProduct) {
    endNumber = totalProduct;
  }
  return `Showing ${startNumber + 1}-${endNumber} of ${totalProduct} products`;
}

/**
 * CALCULATE PRICE WITH PRODUCT DISCOUNT THEN RETURN NEW PRODUCT PRICES
 * @param  price - PRODUCT PRICE
 * @param  discount - DISCOUNT PERCENT
 * @returns - RETURN NEW PRICE
 */

export function calculateDiscount(price, discount) {
  const afterDiscount = Number((price - price * (discount / 100)).toFixed(2));
  return currency(afterDiscount);
}

/**
 * CHANGE THE CURRENCY FORMAT
 * @param  price - PRODUCT PRICE
 * @param  fraction - HOW MANY FRACTION WANT TO SHOW
 * @returns - RETURN PRICE WITH CURRENCY
 */

export function currency(price, fraction = 2) {
  return Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
    maximumFractionDigits: fraction
  }).format(price);
}



// CUSTOM

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

export function formatPhoneNumber(value) {
  if (!value) return "";

  // keep digits only
  let digits = value.replace(/\D/g, "");

  // remove US country code if present
  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  }

  if (digits.length !== 10) return value;

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function getFullName(user) {
  if (user) {
    const { first_name, last_name } = user;
    return `${first_name || ''} ${last_name || ''}`.trim();
  }
  return "";
}

export function getCodeName(user) {
  if (user?.first_name) {
    const { first_name, last_name } = user;
    return `${first_name[0] || ''}${last_name[0] || ''}`.trim();
  }
  return "";
}

export function liveSlug(slugValue) {
  if (slugValue) {
    const formatted = slugValue
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");

    return formatted;
  }
  return null;
}

export function getFileFullPath(pathString = "") {
  if (!pathString) return "";

  // Already a full URL
  if (pathString.startsWith("http://") || pathString.startsWith("https://")) {
    return pathString;
  }

  // Ensure leading slash
  const cleanPath = pathString.startsWith("/") ? pathString : `/${pathString}`;

  // For backend-assets, extract filename and use it as cache key
  // Since each upload creates a unique filename (with timestamp), the filename itself is the cache key
  // This way, when a new image is uploaded, it gets a new filename, and the browser will fetch it
  // We don't need to add a query parameter since the filename already changes
  let finalPath = cleanPath;

  // For backend-assets, the rewrite rule handles it, so just return the path
  // The BASE_URL is only needed for external URLs
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

  // If BASE_URL is set, use it; otherwise return the path as-is (rewrite rule will handle it)
  return BASE_URL ? `${BASE_URL}${finalPath}` : finalPath;
}

export function formatDate(timestamp) {
  const date = new Date(timestamp);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

export function formatDateTime(timestamp) {
  const date = new Date(timestamp);

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export const SOCIAL_CONFIG = {
  facebook_link: {
    icon: "/images/icons/facebook.svg",
    alt: "Facebook",
  },
  twitter_link: {
    icon: "/images/icons/twitter.svg",
    alt: "Twitter",
  },
  linkedin_link: {
    icon: "/images/icons/linkedin.svg",
    alt: "LinkedIn",
  },
  instagram_link: {
    icon: "/images/icons/instagram.svg",
    alt: "Instagram",
  },
  location_link: {
    icon: "/images/icons/map.svg",
    alt: "Map",
  },
  google_plus_link: {
    icon: "/images/icons/google.svg",
    alt: "Google",
  },
  email_address: {
    icon: "/images/icons/envelope.svg",
    alt: "Email",
    isEmail: true,
  },
  youtube_link: {
    icon: "/images/icons/youtube.svg",
    alt: "YouTube",
  },
};

export function highlightTextFormat(text = '') {
  return text.split(/{(.*?)}/g).map((part, index) => {
    if (index % 2 === 1) {
      return (
        <span key={index} className="highlightTextOnly">
          {part}
        </span>
      );
    }
    return part;
  });
}
