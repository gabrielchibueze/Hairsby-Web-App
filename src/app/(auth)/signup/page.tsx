import { Metadata } from "next";
import SignupComponent from "./singnup";

export const metadata: Metadata = {
  title: "Sign Up for Hairsby | Create Your Account",
  description:
    "Join Hairsby to book beauty services with beauty specialists, save favorites, and manage appointments.",
  keywords: [
    "create Hairsby account",
    "beauty service registration",
    "sign up for salon bookings",
    "client profile creation",
    "stylist account setup",
    "business registration beauty",
    "free beauty service account",
    "quick signup hair app",
    "mobile booking account",
  ],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Sign Up for Hairsby",
    images: ["/og-hairsby-default.png"],
    url: "https://hairsby.com/signup",
  },
};
export default function SignupPage() {
  return <SignupComponent />;
}
