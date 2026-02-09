import ResetPasswordForm from "sections/auth/ResetPasswordForm";

export const metadata = {
    title: "Reset Password | ClickITCo",
    description: "Securely reset your ClickITCo account password and regain access to your dashboard.",
    authors: [{
        name: "ClickITCo Team",
        url: "https://clickitco.com"
    }],
    keywords: ["ClickITCo", "reset password", "account security", "authentication", "login help"]
};

export default function ResetPassword() {
    return <ResetPasswordForm />;
}

