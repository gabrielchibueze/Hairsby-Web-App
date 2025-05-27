import { Metadata } from "next";
import ProviderDetailsComponent from "./providerDetails";
import { userGetProviderById } from "@/lib/api/accounts/provider";
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const provider = await userGetProviderById(params.id);

  return {
    title: `${provider.businessName || provider.firstName} | Hairsby Professional`,
    description:
      provider.bio ||
      `Book ${provider.name} for ${provider.specialty} services at ${provider.businessName || "their location"}`,
    keywords: [
      `${provider.businessName || provider.firstName} ${provider?.specialty}`,
      `book ${provider.name}`,
      `${provider.location} hairstylist`,
      `${provider.specialty || "service specialist provider"} specialist`,
      `${provider.name} reviews`,
      `${provider.businessName} services`,
      `best ${provider.specialty || "service specialist provider"} near me`,
      `${provider.name} portfolio`,
      `award-winning ${provider?.specialty || "service specialist provider"}`,
      `${provider.businessName} pricing`,
    ],
    openGraph: {
      title: `${provider.businessName || provider.firstName} | Hairsby Professional`,
      description: `${provider.businessName || provider.firstName} - ${provider.specialty || "service specialist provider"} at ${provider.businessName || "their studio"} in ${provider.location}`,
      images: [provider.photo || "/og-hairsby-default.png"],
      url: `https://hairsby.com/providers/${params.id}`,
    },
    alternates: {
      canonical: `https://hairsby.com/providers/${params.id}`,
    },
  };
}
export default function ProviderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return <ProviderDetailsComponent params={params} />;
}
