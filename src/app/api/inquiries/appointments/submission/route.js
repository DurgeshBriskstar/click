import { AppointmentInquiryController } from "server/controllers/appointmentInquiry.controller";

export async function GET(req) {
    return AppointmentInquiryController.getFormSubmission(req);
}

