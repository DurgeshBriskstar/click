"use client";

import { Container } from "react-bootstrap";
import BlogDetailBannerSection from "./sections/BlogDetailBannerSection";
import BlogDetailContentSection from "./sections/BlogDetailContentSection";
import RelatedBlogsSection from "./sections/RelatedBlogsSection";

export default function BlogDetailPage({ blog, blogs }) {
  if (!blog) {
    return (
      <Container className="py-5 text-center">
        <div className="alert alert-warning">Blog not found</div>
      </Container>
    );
  }

  return (
    <div className="blog-detail-page">
      <BlogDetailBannerSection blog={blog} />
      <BlogDetailContentSection blog={blog} />

      {blogs && blogs.length > 0 && (
        <RelatedBlogsSection data={{ title: "Related Blogs" }} blogs={blogs} currentBlogId={blog?.id} />
      )}
    </div>
  );
}

