// src/app/privacy-policy/page.tsx
import { Metadata } from "next";
import PrivacyPolicy from "./privacy";
export const metadata: Metadata = {
  title: "Privacy Policy | Hairsby",
  description:
    "Learn how Hairsby collects, uses, and protects your personal information",
  keywords:
    "beauty platform privacy, hair service data policy, salon booking privacy",
};

export default function PrivaPolicyPage() {
  return <PrivacyPolicy />;
}
