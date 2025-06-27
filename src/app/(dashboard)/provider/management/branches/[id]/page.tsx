// @/app/provider/management/branches/[id]/page.tsx

import BusinessBranchDetailsComponent from "../components/businessBranchDetailsComponent";

export default function BusinessBranchDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return <BusinessBranchDetailsComponent id={params?.id as string} />;
}
