import { Metadata } from "next";
import ForgotPasswordComponent from "./forgottenPassword";
import Spinner from "@/components/general/spinner";
import { Suspense } from "react";
export const metadata: Metadata = {
  title: "Reset Password | Access Your Hairsby Account",
  description:
    "Reset your login details if you have forgotten your hairsby password.",
  keywords: [
    "Hairsby account login",
    "access service bookings",
    "client portal sign in",
    "service professional login",
    "password recovery service",
    "two-factor authentication",
    "manage appointments login",
    "service platform account",
    "specialist dashboard login",
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
  return (
    <Suspense fallback={<Spinner plain={false} size="lg" />}>
      <ForgotPasswordComponent />
    </Suspense>
  );
}
