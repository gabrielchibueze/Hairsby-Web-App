import { Metadata } from "next";
import TermsAndConditions from "./Terms";

export const metadata: Metadata = {
  title: "Terms & Conditions | Hairsby",
  description:
    "Review Hairsby's terms and conditions for using our beauty platform services",
  keywords:
    "beauty platform terms, hair service conditions, salon booking policies",
};

export default function TermsAndConditionsPage() {
  return <TermsAndConditions />;
}
