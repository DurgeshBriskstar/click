import { ContactInquiryController } from "server/controllers/contactInquiry.controller";

export async function GET(req) {
    return ContactInquiryController.getInquiries(req);
}

