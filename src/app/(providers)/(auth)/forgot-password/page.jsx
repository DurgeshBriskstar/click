import ForgotPasswordForm from "sections/auth/ForgotPasswordForm";

export const metadata = {
    title: "Forgot Password | ClickITCo",
    description: "Reset your ClickITCo account password by requesting a password reset link.",
    authors: [{
        name: "ClickITCo Team",
        url: "https://clickitco.com"
    }],
    keywords: ["ClickITCo", "forgot password", "password reset", "account recovery", "authentication"]
};

export default function ForgotPassword() {
    return <ForgotPasswordForm />;
}

