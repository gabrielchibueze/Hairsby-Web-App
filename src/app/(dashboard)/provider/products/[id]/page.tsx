import ProviderProductDetails from "../../components/products/ProviderProductDetails";

export default function ProdviderProductDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return <ProviderProductDetails id={params.id} />;
}
