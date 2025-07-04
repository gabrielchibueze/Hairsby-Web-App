// app/provider/management/services/[id]/page.tsx

import ProviderServiceDetails from "../../../components/services/ProviderServiceDetails";

export default function BusinessEmployeeServiceDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return <ProviderServiceDetails id={params.id} />;
}
