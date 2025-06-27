import { Metadata } from "next";
import ServiceDetailsComponent from "./serviceDetails";
import { getServiceById } from "@/lib/api/services/service";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const service = await getServiceById(params.id);

  return {
    title: `${service.name} | Hairsby`,
    description: service.description,
    keywords: [
      `${service.name} near me`,
      `book ${service.name} online`,
      `${service.name} pricing`,
      `best ${service.name} professionals`,
      `${service.name} appointment booking`,
      `${service.name} before and after`,
      `how much does ${service.name} cost`,
      `${service.name} benefits`,
      `${service.name} `,
      `${service.name} aftercare`,
    ],
    openGraph: {
      title: `${service.name} | Hairsby`,
      description: service?.description
        ? service?.description.substring(0, 160)!
        : service.name,
      images: [service.images[0]],
      url: `https://hairsby.com/services/${params.id}`,
    },
    alternates: {
      canonical: `https://hairsby.com/services/${params.id}`,
    },
  };
}

export default function ServiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <ServiceDetailsComponent params={params} />;
}
