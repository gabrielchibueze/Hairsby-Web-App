// src/app/cookies-policy/page.tsx
import { Metadata } from "next";
import CookiesPolicy from "./cookiesPolicy";

export const metadata: Metadata = {
  title: "Cookies Policy | Hairsby",
  description:
    "Learn about how Hairsby uses cookies to enhance your experience",
  keywords:
    "beauty platform cookies, hair service tracking, salon booking cookies",
};

export default function CookiesPolicyPage() {
  return <CookiesPolicy />;
}
