/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo, useCallback } from "react";
import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatDate, getFileFullPath } from "utils/formats";
import { ROUTES } from "utils/routes";

export default function BlogListingSection({ blogs, pagination, initialSearch = "" }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const blogData = blogs?.data || [];
  const { currentPage = 1, totalPages = 1, totalCount = 0 } = pagination || {};

  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Handle page change with URL navigation
  const handlePageChange = useCallback((pageNumber) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    router.push(`${ROUTES.BLOGS}?${params.toString()}`, { scroll: true });
  }, [router, searchParams]);

  // Handle search with debounce
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    params.set("page", "1"); // Reset to page 1 on search
    router.push(`${ROUTES.BLOGS}?${params.toString()}`);
  }, [router, searchParams, searchQuery]);

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle Enter key press for search
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.set("page", "1");
    router.push(`${ROUTES.BLOGS}?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <section className="section gray-bg blog-listing-section">
      <Container>
        {/* Search and Filter Bar - Right Aligned */}
        <div className="blog-filters">
          <Form onSubmit={handleSearch}>
            <div className="d-flex gap-2 align-items-center">
              <InputGroup className="blog-search-input">
                <InputGroup.Text className="blog-search-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M17.5 17.5L13.875 13.875" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </InputGroup.Text>
                <Form.Control type="text" placeholder="Search..." value={searchQuery} onChange={handleSearchInputChange} onKeyPress={handleKeyPress} className="blog-search-field" />
                {searchQuery && (
                  <Button variant="link" className="blog-search-clear-btn" onClick={handleClearSearch} type="button" aria-label="Clear search">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4L4 12M4 4L12 12" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Button>
                )}
              </InputGroup>
              <Button variant="primary" type="submit" className="blog-search-btn">
                Search
              </Button>
            </div>
          </Form>
        </div>

        {/* Blog Grid */}
        <Row className="justify-content-center">
          {blogData?.length > 0 ? (
            blogData.map((blog, index) => {
              const imageNumber = String(index + 1).padStart(2, "0");
              const imagePath = blog?.image ? blog?.image.startsWith("/") ? getFileFullPath(blog?.image) : `/images/sections/blog/blog-${imageNumber}.jpg` : `/images/sections/blog/blog-${imageNumber}.jpg`;

              return (
                <Col xs={12} md={6} lg={4} key={blog?.id} data-aos="flip-right" data-aos-delay={index * 150}>
                  <div className="blog-item">
                    <div className="blog-item-img">
                      {imagePath
                        ? (<img src={imagePath} alt={blog?.title} style={{ objectFit: "cover" }} />)
                        : (<div className="w-100 h-100 d-flex align-items-center justify-content-center bg-primary-custom" style={{ color: "#FFFFFF" }}>Blog Image</div>)
                      }
                      <div className="blog-date">
                        <span className="date-dot"></span>
                        <span>
                          {blog?.created_at ? formatDate(blog?.created_at) : ""}
                        </span>
                      </div>
                    </div>
                    <div className="blog-item-content">
                      <h4>{blog?.title}</h4>
                      <div className="d-flex align-items-center gap-2">
                        {blog?.slug ? (
                          <Link href={`${ROUTES?.BLOGS}/${blog?.slug}`} className="btn btn-primary">
                            Read More
                            <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="35" height="35" rx="17.5" fill="var(--text-primary)" />
                              <path d="M13.5 21.5L21.5 13.5M21.5 13.5H14.3M21.5 13.5V20.7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </Link>
                        ) : (
                          <Button variant="primary" className="btn" disabled>
                            Read More
                            <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="35" height="35" rx="17.5" fill="var(--text-primary)" />
                              <path d="M13.5 21.5L21.5 13.5M21.5 13.5H14.3M21.5 13.5V20.7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
              );
            })
          ) : (
            <Col xs={12}>
              <div className="text-center py-5">
                <p className="text-muted">No blogs found matching your criteria.</p>
              </div>
            </Col>
          )}
        </Row>

        {/* Server-Side Pagination */}
        {totalPages > 1 && (
          <div className="blog-pagination-wrapper d-flex justify-content-center align-items-center mt-5">
            <div className="blog-pagination">
              <button className={`blog-pagination-btn blog-pagination-prev ${currentPage === 1 ? "disabled" : ""}`} onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                // Show first page, last page, current page, and pages around current
                if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                  return (
                    <button key={pageNum} className={`blog-pagination-btn blog-pagination-number ${pageNum === currentPage ? "active" : ""}`} onClick={() => handlePageChange(pageNum)}>
                      {String(pageNum).padStart(2, "0")}
                    </button>
                  );
                } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return (
                    <span key={pageNum} className="blog-pagination-ellipsis">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button className={`blog-pagination-btn blog-pagination-next ${currentPage === totalPages ? "disabled" : ""}`} onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 12L12 4M12 4H5.6M12 4V10.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

