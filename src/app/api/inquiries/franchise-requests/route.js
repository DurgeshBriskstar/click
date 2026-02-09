import { FranchiseInquiryController } from "server/controllers/franchiseInquiry.controller";

export async function GET(req) {
    return FranchiseInquiryController.getInquiries(req);
}

