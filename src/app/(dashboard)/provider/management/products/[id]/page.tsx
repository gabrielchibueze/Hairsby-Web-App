import ProviderProductDetails from "../../../components/products/ProviderProductDetails";

export default function BusinessEmployeeProductDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return <ProviderProductDetails id={params.id} />;
}
