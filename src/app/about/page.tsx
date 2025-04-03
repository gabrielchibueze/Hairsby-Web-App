// "use client";

// import { motion } from "framer-motion";
// import Image from "next/image";
// import { Card, CardContent } from "@/components/ui/card";
// import { Heart, Target, Users } from "lucide-react";
// import { Button } from "@/components/ui/button";

// const teamMembers = [
//   {
//     name: "Sarah Johnson",
//     role: "CEO & Founder",
//     photo:
//       "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
//     bio: "With over 15 years in the beauty industry, Sarah founded Hairsby to revolutionize how people discover and book beauty services.",
//   },
//   {
//     name: "Michael Chen",
//     role: "CTO",
//     photo:
//       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
//     bio: "A tech veteran with a passion for creating seamless digital experiences that connect beauty professionals with clients.",
//   },
//   {
//     name: "Emma Davis",
//     role: "Head of Operations",
//     photo:
//       "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1974&auto=format&fit=crop",
//     bio: "Emma ensures that every interaction on Hairsby meets our high standards of quality and customer satisfaction.",
//   },
// ];

// const values = [
//   {
//     icon: Target,
//     title: "Innovation",
//     description:
//       "Continuously pushing boundaries to create better solutions for customers, salons, businesses and beauty professionals.",
//   },
//   {
//     icon: Users,
//     title: "Community",
//     description:
//       "Building meaningful connections and fostering collaboration between local beauty professionals and customers..",
//   },
//   {
//     icon: Heart,
//     title: "Customer Success",
//     description:
//       "Dedicated to helping our customers achieve great beauty excellence, in product and services.",
//   },
// ];

// const milestones = [
//   {
//     year: "2024",
//     title: "Company Founded",
//     description:
//       "Hairsby was founded in the United Kingdom with a vision to revolutionize salon management and booking of beauty services.",
//   },
//   {
//     year: "2024",
//     title: "Product Catalogue Integration",
//     description:
//       "Integration of Product Catalogue to empower professionals and businesses to sell beauty products and tools to each other and to customers.",
//   },
//   // {
//   //   year: "2024",
//   //   title: "Series A Funding",
//   //   description:
//   //     "$10M raised to accelerate product development and market expansion.",
//   // },
//   {
//     year: "2025",
//     title: "Global Expansion",
//     description:
//       "Launched operations in 2 countries with support present in the countries.",
//   },
// ];

// export default function AboutPage() {
//   return (
//     <div className="min-h-screen">
//       {/* Hero Section */}
//       <section className="relative overflow-hidden bg-background py-20">
//         <div className="container relative z-10">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="mx-auto max-w-3xl text-center"
//           >
//             <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
//               Our Mission
//             </h1>
//             <p className="mt-6 text-lg leading-8 text-muted-foreground">
//               We're on a mission to transform the beauty industry by connecting
//               talented professionals with clients seeking exceptional beauty
//               services. Our platform makes it easy to discover, book, and
//               experience the best in beauty care.
//             </p>
//           </motion.div>
//         </div>
//       </section>

//       {/* Story Section */}
//       <section className="py-20">
//         <div className="container">
//           <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5 }}
//               className="relative aspect-square overflow-hidden rounded-2xl"
//             >
//               <Image
//                 src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1974&auto=format&fit=crop"
//                 alt="Our story"
//                 fill
//                 className="object-cover"
//               />
//             </motion.div>
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="flex flex-col justify-center"
//             >
//               <h2 className="text-3xl font-bold tracking-tight">Our Story</h2>
//               <p className="mt-6 text-lg text-muted-foreground">
//                 Founded in 2023, Hairsby emerged from a simple observation:
//                 booking beauty services should be as easy as ordering food or
//                 booking a ride. We've built a platform that not only simplifies
//                 the booking process but also empowers beauty professionals to
//                 grow their business and reach more clients.
//               </p>
//               <p className="mt-4 text-lg text-muted-foreground">
//                 Today, we're proud to serve thousands of customers and partner
//                 with top beauty professionals across the country. Our commitment
//                 to quality, convenience, and customer satisfaction drives
//                 everything we do.
//               </p>
//             </motion.div>
//           </div>
//         </div>
//       </section>
//       {/* Values Section */}
//       <section className="py-20 bg-muted/50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             // className="mx-auto max-w-3xl text-center"
//           >
//             <div className="text-center mb-16">
//               <h2 className="text-3xl font-bold">Our Values</h2>
//               <p className="mt-4 text-lg text-muted-foreground">
//                 The principles that guide everything we do
//               </p>
//             </div>
//           </motion.div>
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             // className="mx-auto max-w-3xl text-center"
//           >
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               {values.map((value, index) => (
//                 <Card key={index}>
//                   <CardContent className="pt-6">
//                     <value.icon className="h-12 w-12 text-primary mb-4" />
//                     <h3 className="text-xl font-semibold mb-2">
//                       {value.title}
//                     </h3>
//                     <p className="text-muted-foreground">{value.description}</p>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Team Section */}
//       <section className="bg-muted py-20">
//         <div className="container">
//           <div className="text-center">
//             <h2 className="text-3xl font-bold tracking-tight">Meet Our Team</h2>
//             <p className="mt-4 text-lg text-muted-foreground">
//               The passionate people behind Hairsby
//             </p>
//           </div>
//           <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
//             {teamMembers.map((member, index) => (
//               <motion.div
//                 key={member.name}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: index * 0.1 }}
//               >
//                 <div className="relative mx-auto mb-6 h-48 w-48 overflow-hidden rounded-full">
//                   <Image
//                     src={member.photo}
//                     alt={member.name}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//                 <div className="text-center">
//                   <h3 className="text-xl font-semibold">{member.name}</h3>
//                   <p className="text-muted-foreground">{member.role}</p>
//                   <p className="mt-4 text-muted-foreground">{member.bio}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Milestones Section */}
//       <section className="py-20 bg-muted/50 ">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             // className="mx-auto max-w-3xl text-center"
//           >
//             <div className="text-center mb-16">
//               <h2 className="text-3xl font-bold">Our Journey</h2>
//               <p className="mt-4 text-lg text-muted-foreground">
//                 Key milestones in our mission to transform event management
//               </p>
//             </div>
//           </motion.div>
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             // className="mx-auto max-w-3xl text-center"
//           >
//             <div className="space-y-8 ">
//               {milestones.map((milestone, index) => (
//                 <div key={index} className="flex items-start space-x-4">
//                   <div className="flex-shrink-0 w-24 pt-1">
//                     <div className="text-xl font-bold text-primary">
//                       {milestone.year}
//                     </div>
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-semibold mb-2">
//                       {milestone.title}
//                     </h3>
//                     <p className="text-muted-foreground">
//                       {milestone.description}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       {/* <section className="py-20 bg-primary text-primary-foreground">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="mx-auto max-w-3xl text-center"
//           >
//             <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
//             <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
//               We're always looking for talented people who share our passion for
//               transforming the events industry.
//             </p>
//             <Button variant="secondary" size="lg" asChild>
//               <a href="/careers">View Open Positions</a>
//             </Button>
//           </motion.div>
//         </div>
//       </section> */}
//       {/* CTA Section */}
//       <section className="py-20 bg-primary text-primary-foreground">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="mx-auto max-w-3xl text-center"
//           >
//             <h2 className="text-3xl font-bold mb-4">Book or Get Booked</h2>
//             <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
//               Looking to sell services or products or just a regular customer
//               looking for local beauty shops?
//             </p>
//             <Button variant="secondary" size="lg" asChild>
//               <a href="/auth/signup">Get Started</a>
//             </Button>
//           </motion.div>
//         </div>
//       </section>
//     </div>
//   );
// }

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, Target, Users, Globe, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "10,000+", label: "Beauty Professionals" },
  { value: "500K+", label: "Happy Clients" },
  { value: "200+", label: "Cities Served" },
  { value: "98%", label: "Satisfaction Rate" },
];

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We set the highest standards in beauty service delivery",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building connections between professionals and clients",
  },
  {
    icon: Heart,
    title: "Passion",
    description: "Driven by our love for the beauty industry",
  },
];

const milestones = [
  {
    year: "2024",
    title: "Company Founded",
    description:
      "Launched in the UK with a vision to transform beauty services",
  },
  {
    year: "2024",
    title: "Platform Launch",
    description: "Released our booking and e-commerce platform",
  },
  {
    year: "2025",
    title: "Global Expansion",
    description: "Expanded operations to multiple countries",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-hairsby-dark text-white overflow-hidden">
        <div className="container relative z-10 py-28">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            >
              Redefining Beauty Experiences
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-lg text-gray-300"
            >
              Hairsby connects clients with top beauty professionals, making
              premium services accessible to everyone.
            </motion.p>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-[length:200px_200px] opacity-10"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-hairsby-orange sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-xl overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2070&auto=format&fit=crop"
              alt="Our story"
              fill
              className="object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
            <p className="mt-6 text-gray-600">
              Founded in 2024, Hairsby emerged from a simple idea: beauty
              services should be accessible, reliable, and exceptional. We
              noticed the challenges both clients and professionals faced in
              connecting and delivering quality experiences.
            </p>
            <p className="mt-4 text-gray-600">
              Today, we're proud to be the UK's fastest-growing beauty platform,
              serving thousands of clients and empowering beauty professionals
              to thrive in their craft.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900">
              Our Core Values
            </h2>
            <p className="mt-4 text-gray-600">
              The principles that guide every decision we make
            </p>
          </div>
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-8 rounded-xl"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-hairsby-orange/10 text-hairsby-orange">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  {value.title}
                </h3>
                <p className="mt-2 text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Our Journey
          </h2>
          <div className="mt-16 relative">
            <div className="absolute left-8 top-0 h-full w-0.5 bg-gray-200 md:left-1/2 md:-ml-1"></div>
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative mb-12 flex flex-col md:flex-row items-start ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex-1 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-hairsby-orange text-white font-bold text-xl">
                    {milestone.year}
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-gray-900">
                    {milestone.title}
                  </h3>
                  <p className="mt-2 text-gray-600">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {/* <section className="py-20 bg-hairsby-dark text-white"> */}
      <section className="py-20 bg-gradient-to-br from-hairsby-dark to-hairsby-dark/90 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold">Join the Beauty Revolution</h2>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
            Whether you're a beauty professional or seeking services, we have
            the perfect solution for you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-hairsby-orange hover:bg-amber-500"
              asChild
            >
              <a href="/signup">Get Started</a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-gray-900 border-white hover:bg-white/10 hover:text-gray-50"
              asChild
            >
              <a href="/contact">Contact Us</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
