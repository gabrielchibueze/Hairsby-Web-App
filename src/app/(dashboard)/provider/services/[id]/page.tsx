import ProviderServiceDetails from "../../components/services/ProviderServiceDetails";

export default function ProdviderServiceDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return <ProviderServiceDetails id={params.id} />;
}
