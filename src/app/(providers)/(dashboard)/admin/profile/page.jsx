import UserProfile from "sections/dashboard/common/profile";

export const metadata = {
  title: "Admin Profile | ClickITCo",
  description: "Update admin account details, security options, and notification preferences for ClickITCo.",
  authors: [{
    name: "ClickITCo Team",
    url: "https://clickitco.com"
  }],
  keywords: ["ClickITCo admin", "profile", "account", "security", "notifications"]
};

export default async function ProfilePage() {

  return <UserProfile />;
}