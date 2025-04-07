import { Metadata } from "next";
import LoginComponent from "./login";
export const metadata: Metadata = {
  title: "Login to Hairsby | Access Your Account",
  description:
    "Sign in to your Hairsby account to book services, manage appointments, and more.",
  keywords: [
    "Hairsby account login",
    "access beauty bookings",
    "client portal sign in",
    "beauty professional login",
    "password recovery beauty",
    "two-factor authentication",
    "manage appointments login",
    "beauty platform account",
    "stylist dashboard login",
    "book services account",
  ],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Login to Hairsby",
    images: ["/og-hairsby-default.png"],
    url: "https://hairsby.com/login",
  },
};
export default function LoginPage() {
  return <LoginComponent />;
}
