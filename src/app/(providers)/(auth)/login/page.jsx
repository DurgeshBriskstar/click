import LoginForm from "sections/auth/LoginForm";

export const metadata = {
  title: "Sign In | ClickITCo",
  description: "Access your ClickITCo dashboard to manage services, enquiries, and customer requests.",
  authors: [{
    name: "ClickITCo Team",
    url: "https://clickitco.com"
  }],
  keywords: ["ClickITCo", "login", "sign in", "dashboard access", "authentication"]
};
export default function Login() {
  return <LoginForm />;
}