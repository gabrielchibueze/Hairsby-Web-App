// src/app/safety-guidelines/page.tsx
import { Metadata } from "next";
import SafetyGuidelines from "./safetyGuidelines";
export const metadata: Metadata = {
  title: "Safety Guidelines | Hairsby",
  description:
    "Learn about Hairsby's commitment to safety for clients and professionals",
  keywords:
    "service platform safety, professional service security, business booking protection",
};

export default function SafetyGuidelinesPage() {
  return <SafetyGuidelines />;
}
