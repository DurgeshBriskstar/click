import PageNotAvailable from "components/custom/common/PageNotAvailable";
import BlogListPage from "sections/web/blogs";
import { getActiveBlogRecords } from "server/services/blog.service";
import { getRecordByPageKey } from "server/services/cms.service";

export async function generateMetadata() {
  const pageData = await getRecordByPageKey("bloglistpage");
  const meta = pageData?.meta || {};

  return {
    title: meta?.title || "",
    description: meta?.description || "",
    keywords: meta?.keywords || ["Click IT Computers", "Click IT Website Design", "Click IT Secure", "Click IT Phone", "Click IT Email", "Click IT E-marketing", "Click IT Connect", "Click IT Backup", "Click IT Repairs", "Click IT Hosting", "Click IT MSP", "Click IT MPS", "Click IT Chat", "Click IT CRM"],
    authors: [{
      name: "ClickITCo",
      url: "https://clickitco.com"
    }],
  };
}

const ITEMS_PER_PAGE = 9;

export default async function BlogsPage({ searchParams }) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const search = params?.search || "";

  const pageData = await getRecordByPageKey("bloglistpage");

  // Fetch blogs with server-side pagination
  const blogData = await getActiveBlogRecords({
    page: currentPage,
    order: "desc",
    orderBy: "created_at",
    rowsPerPage: ITEMS_PER_PAGE,
    search: search
  });

  const totalPages = Math.ceil((blogData?.count || 0) / ITEMS_PER_PAGE);

  return (
    pageData?.status !== "published"
      ? <PageNotAvailable />
      : <BlogListPage
        blogs={blogData || { data: [], count: 0 }}
        pagination={{ currentPage, totalPages, totalCount: blogData?.count || 0, itemsPerPage: ITEMS_PER_PAGE }}
        search={search}
      />
  )
}
