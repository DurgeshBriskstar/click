import Grid from "@mui/material/Grid";
import StatCard from "../../admin/dashboard/sections/StatCard";
import WelcomeCard from "../../admin/dashboard/sections/WelcomeCard";
import InquiryStatCard from "../../admin/dashboard/sections/InquiryStatCard";
import RecentInquiriesTable from "../../admin/dashboard/sections/RecentInquiriesTable";

// DATA TYPES - Static cards (Gross Sale and Total Shipping Cost)
const staticCardList = [{
    id: 3,
    title: "Upcoming Stat A",
    amount1: "$12,460.25",
    amount2: "Total"
}, {
    id: 4,
    title: "Upcoming Stat B",
    amount1: "$6,240",
    amount2: "Total"
}];

export default async function StoreDashboard() {
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

                    {/* Static Cards */}
                    {staticCardList.map(item => (
                        <Grid size={{ sm: 6, xs: 12 }} key={item.id}>
                            <StatCard title={item.title} amount1={item.amount1} amount2={item.amount2} />
                        </Grid>
                    ))}
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