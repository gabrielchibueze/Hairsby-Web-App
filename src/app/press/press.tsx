"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";

const pressReleases = [
  {
    id: "1",
    title: "Hairsby Raises $10M Series A to Transform Beauty Services Booking",
    date: "February 25, 2025",
    excerpt:
      "Leading beauty services platform secures funding to expand operations and enhance technology.",
    source: "TechCrunch",
    link: "#",
  },
  {
    id: "2",
    title: "Hairsby Launches Revolutionary AI-Powered Style Matching",
    date: "February 15, 2025",
    excerpt:
      "New feature uses artificial intelligence to help customers find their perfect look.",
    source: "Beauty Weekly",
    link: "#",
  },
  {
    id: "3",
    title: "Hairsby Partners with Leading Beauty Brands",
    date: "February 1, 2025",
    excerpt:
      "Strategic partnerships set to enhance product offerings and customer experience.",
    source: "Beauty Industry News",
    link: "#",
  },
];

const mediaFeatures = [
  {
    id: "1",
    title: "The Future of Beauty Services",
    publication: "Forbes",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Forbes_logo.svg/2560px-Forbes_logo.svg.png",
    date: "February 20, 2025",
    link: "#",
  },
  {
    id: "2",
    title: "How Hairsby is Revolutionizing Beauty Bookings",
    publication: "Business Insider",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Business_Insider_Logo.svg/2560px-Business_Insider_Logo.svg.png",
    date: "February 10, 2025",
    link: "#",
  },
  {
    id: "3",
    title: "Beauty Tech's Rising Star",
    publication: "Bloomberg",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Bloomberg_Business_Logo.svg/2560px-Bloomberg_Business_Logo.svg.png",
    date: "February 5, 2025",
    link: "#",
  },
];

export default function PressComponent() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-muted py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold tracking-tight">
                Press & Media
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Latest news, press releases, and media coverage about Hairsby
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold">Press Releases</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {pressReleases.map((release, index) => (
              <motion.div
                key={release.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="rounded-lg border bg-card p-6">
                  <div className="flex items-center gap-2">
                    <Newspaper className="h-5 w-5 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {release.source}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">
                    {release.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {release.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {release.date}
                    </span>
                    <Button variant="link" asChild>
                      <a href={release.link}>Read More</a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="bg-muted py-20">
        <div className="container">
          <h2 className="text-3xl font-bold">Media Coverage</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {mediaFeatures.map((feature, index) => (
              <motion.a
                key={feature.id}
                href={feature.link}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group rounded-lg border bg-card p-6"
              >
                <div className="relative h-12">
                  <Image
                    src={feature.logo}
                    alt={feature.publication}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="mt-4 text-xl font-semibold group-hover:text-primary">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.date}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Media Kit</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Download our media kit for logos, brand guidelines, and
              high-resolution images
            </p>
            <Button className="mt-8" size="lg">
              Download Media Kit
            </Button>
          </div>
        </div>
      </section>

      {/* Media Contact */}
      <section className="bg-muted py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Media Contact</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              For press inquiries, please contact our media relations team
            </p>
            <div className="mt-8 space-y-2">
              <p className="font-medium">Press Team</p>
              <p className="text-muted-foreground">press@hairsby.com</p>
              <p className="text-muted-foreground">+44 20 1234 5678</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
