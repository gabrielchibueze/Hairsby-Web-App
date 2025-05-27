import { Metadata } from "next";
import SignupComponent from "./singnup";

export const metadata: Metadata = {
  title: "Sign Up for Hairsby | Create Your Account",
  description:
    "Join Hairsby to book professional services with service specialists, save favorites, and manage appointments.",
  keywords: [
    "create Hairsby account",
    "professional service registration",
    "sign up for business bookings",
    "client profile creation",
    "specialist account setup",
    "business registration service",
    "free professional service account",
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
