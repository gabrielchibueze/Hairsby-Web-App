// app/provider/management/organisations/[id]/page.tsx

import BusinessEmployeeDetailsComponent from "../../components/businessEmployeeDetailsComponent";

export default function SpecialistDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return <BusinessEmployeeDetailsComponent id={params?.id as string} />;
}
