import { Container, Row, Col } from "react-bootstrap";
import { getFileFullPath } from "utils/formats";

export default function BlogDetailContentSection({ blog }) {
  if (!blog) return null;

  return (
    <section className="section blog-detail-content-section">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <div className="blog-detail-content" data-aos="fade-up">
              {blog?.image && (
                <div className="blog-detail-image mb-5" data-aos="fade-up" data-aos-delay="200">
                  <div className="blog-detail-image-wrapper position-relative">
                    <img 
                      src={getFileFullPath(blog.image)} 
                      alt={blog.title} 
                      className="img-fluid rounded" 
                      style={{ objectFit: "cover", width: "100%", height: "auto" }} 
                    />
                  </div>
                </div>
              )}

              {blog?.content && (
                <div
                  className="blog-detail-body"
                  data-aos="fade-up"
                  data-aos-delay="300"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

