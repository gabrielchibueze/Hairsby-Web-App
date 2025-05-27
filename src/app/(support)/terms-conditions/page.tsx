import { Metadata } from "next";
import TermsAndConditions from "./Terms";

export const metadata: Metadata = {
  title: "Terms & Conditions | Hairsby",
  description:
    "Review Hairsby's terms and conditions for using our service platform services",
  keywords:
    "service platform terms, professional service conditions, business booking policies",
};

export default function TermsAndConditionsPage() {
  return <TermsAndConditions />;
}
