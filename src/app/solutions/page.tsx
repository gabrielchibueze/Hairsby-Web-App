import SolutionsForClients from "./solutionsForClient";

export const metadata = {
  title: "Hairsby Solutions - For Clients, Professionals, Salons & Businesses",
  description:
    "Discover how Hairsby provides tailored solutions for beauty clients, independent professionals, salons, and enterprise businesses.",
  keywords:
    "beauty enterprise software, salon franchise software, beauty API, white label beauty platform, enterprise wellness solutions beauty professionals, hairstylist platform, salon software, grow beauty business, stylist app beauty appointments, hair stylists, book salon, beauty professionals, hairstyling booking",
  openGraph: {
    title: "Enterprise Beauty Solutions | Hairsby for Businesses",
    description: "Scalable beauty and wellness solutions for enterprises.",
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
