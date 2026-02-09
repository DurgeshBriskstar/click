import UserProfile from "sections/dashboard/common/profile";

export const metadata = {
  title: "Vendor Profile | ClickITCo Store",
  description: "Manage vendor contact details, payout preferences, and security settings for your ClickITCo store.",
  authors: [{
    name: "ClickITCo Team",
    url: "https://clickitco.com"
  }],
  keywords: ["ClickITCo vendor", "profile", "account", "payouts", "security"]
};

export default async function ProfilePage() {

  return <UserProfile />;
}