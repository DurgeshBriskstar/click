import RegisterForm from "sections/auth/RegisterForm";
export const metadata = {
  title: "Create Account | ClickITCo",
  description: "Sign up for your ClickITCo account to manage services, orders, and store settings.",
  authors: [{
    name: "ClickITCo Team",
    url: "https://clickitco.com"
  }],
  keywords: ["ClickITCo", "register", "sign up", "account creation", "onboarding"]
};
export default function Register() {
  return <RegisterForm />;
}