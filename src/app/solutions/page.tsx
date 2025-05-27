import SolutionsForClients from "./solutionsForClient";

export const metadata = {
  title: "Hairsby Solutions - For Clients, Professionals, Salons & Businesses",
  description:
    "Discover how Hairsby provides tailored solutions for service clients, independent professionals, salons, and enterprise businesses.",
  keywords:
    "service enterprise software, business franchise software, service API, white label service platform, enterprise wellness solutions service professionals, hairstylist platform, business software, grow service business, specialist app service appointments, hair specialists, book business, service professionals, hairstyling booking",
  openGraph: {
    title: "Enterprise Service Solutions | Hairsby for Businesses",
    description: "Scalable service and wellness solutions for enterprises.",
    images: [
      {
        url: "/og-hairsby-default.png",
        width: 1200,
        height: 630,
        alt: "Hairsby Enterprise Platform",
      },
    ],
  },
};

export default function SolutionsPageForClient() {
  return <SolutionsForClients />;
}
