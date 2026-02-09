import BlogDetailPage from "sections/web/blogs/detail";
import { getActiveBlogRecords, getBlogRecordBySlug } from "server/services/blog.service";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogRecordBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Not Found | ClickITCo Support",
      description: "The requested blog could not be found.",
    };
  }

  return {
    title: `${blog?.title} | ClickITCo Support`,
    description: blog?.excerpt || `Read ${blog?.title} on ClickITCo Support.`,
    keywords: ["ClickITCo", "blog", blog?.title, blog?.excerpt],
    authors: [{
      name: "ClickITCo Team",
      url: "https://clickitco.com"
    }],
  };
}

export default async function BlogDetailPageRoute({ params }) {
  const { slug } = await params;
  const blog = await getBlogRecordBySlug(slug);

  if (!blog) {
    notFound();
  }

  const blogsData = await getActiveBlogRecords({
    page: 1,
    order: "desc",
    orderBy: "created_at",
    rowsPerPage: 100
  });

  return (
    <BlogDetailPage blog={blog} blogs={blogsData?.data || []} />
  );
}