// src/app/privacy-policy/page.tsx
import { Metadata } from "next";
import PrivacyPolicy from "./privacy";
export const metadata: Metadata = {
  title: "Privacy Policy | Hairsby",
  description:
    "Learn how Hairsby collects, uses, and protects your personal information",
  keywords:
    "service platform privacy, professional service data policy, business booking privacy",
};

export default function PrivaPolicyPage() {
  return <PrivacyPolicy />;
}
