"use client";

import { BlogBannerSection, BlogListingSection } from "./sections";

export default function BlogListPage({ blogs, pagination, search }) {
  return (
    <div className="blog-list-page">
      <BlogBannerSection />
      <BlogListingSection blogs={blogs} pagination={pagination} initialSearch={search} />
    </div>
  );
}

