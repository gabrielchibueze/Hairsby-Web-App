// src/app/cookies-policy/page.tsx
import { Metadata } from "next";
import CookiesPolicy from "./cookiesPolicy";

export const metadata: Metadata = {
  title: "Cookies Policy | Hairsby",
  description:
    "Learn about how Hairsby uses cookies to enhance your experience",
  keywords:
    "service platform cookies, professional service tracking, business booking cookies",
};

export default function CookiesPolicyPage() {
  return <CookiesPolicy />;
}
