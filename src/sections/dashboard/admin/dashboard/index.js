import Grid from "@mui/material/Grid";
import StatCard from "./sections/StatCard";
import WelcomeCard from "./sections/WelcomeCard";
import InquiryStatCard from "./sections/InquiryStatCard";
import RecentInquiriesTable from "./sections/RecentInquiriesTable";
import QuickBooksStatCard from "./sections/QuickBooksStatCard";

export default async function AdminDashboard() {
    return (
        <div className="pt-2 pb-2">
            <Grid container spacing={3}>
                <Grid size={{ md: 6, xs: 12 }}>
                    <WelcomeCard />
                </Grid>

                <Grid container spacing={3} size={{ md: 6, xs: 12 }}>
                    {/* Contact Inquiries Card */}
                    <Grid size={{ sm: 6, xs: 12 }}>
                        <InquiryStatCard type="contact" />
                    </Grid>

                    {/* Appointments Card */}
                    <Grid size={{ sm: 6, xs: 12 }}>
                        <InquiryStatCard type="appointment" />
                    </Grid>

                    {/* QuickBooks Stats Cards */}
                    <Grid size={{ sm: 6, xs: 12 }}>
                        <QuickBooksStatCard type="revenue" />
                    </Grid>
                    <Grid size={{ sm: 6, xs: 12 }}>
                        <QuickBooksStatCard type="expenses" />
                    </Grid>
                </Grid>

                {/* RECENT INQUIRIES TABLES */}
                <Grid size={{ md: 6, xs: 12 }}>
                    <RecentInquiriesTable type="contact" />
                </Grid>
                <Grid size={{ md: 6, xs: 12 }}>
                    <RecentInquiriesTable type="appointment" />
                </Grid>
            </Grid>
        </div>
    );
}