import { Metadata } from "next";
import ForgotPasswordComponent from "./forgottenPassword";
export const metadata: Metadata = {
  title: "Reset Password | Access Your Hairsby Account",
  description:
    "Reset your login details if you have forgotten your hairsby password.",
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
export default function forgottenPasswordPage() {
  return <ForgotPasswordComponent />;
}
