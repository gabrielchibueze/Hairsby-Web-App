import { Metadata } from "next";

export const bookingMetadata: Metadata = {
  title: "My Bookings | Hairsby",
  description: "Manage your upcoming and past service appointments",
  openGraph: {
    title: "My Bookings | Hairsby",
    description: "Manage your upcoming and past service appointments",
    url: "https://hairsby.com/dashboard/bookings",
    images: [
      {
        url: "/og-hairsby-default.png",
        width: 1200,
        height: 630,
        alt: "Hairsby Bookings",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Bookings | Hairsby",
    description: "Manage your upcoming and past service appointments",
    images: ["/og-hairsby-default.png"],
  },
};

export const bookingDetailMetadata: Metadata = {
  title: "Booking Details | Hairsby",
  description: "View and manage your booking details",
  openGraph: {
    title: "Booking Details | Hairsby",
    description: "View and manage your booking details",
    url: "https://hairsby.com/dashboard/bookings/[id]",
    images: [
      {
        url: "/og-hairsby-default.png",
        width: 1200,
        height: 630,
        alt: "Hairsby Booking Details",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Booking Details | Hairsby",
    description: "View and manage your booking details",
    images: ["/og-hairsby-default.png"],
  },
};

export const orderMetadata: Metadata = {
  title: "My Orders | Hairsby",
  description: "Manage your service product purchases and orders",
  openGraph: {
    title: "My Orders | Hairsby",
    description: "Manage your service product purchases and orders",
    url: "https://hairsby.com/dashboard/orders",
    images: [
      {
        url: "/og-hairsby-default.png",
        width: 1200,
        height: 630,
        alt: "Hairsby Orders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Orders | Hairsby",
    description: "Manage your service product purchases and orders",
    images: ["/og-hairsby-default.png"],
  },
};

export const orderDetailMetadata: Metadata = {
  title: "Order Details | Hairsby",
  description: "View and manage your order details",
  openGraph: {
    title: "Order Details | Hairsby",
    description: "View and manage your order details",
    url: "https://hairsby.com/orders/[id]",
    images: [
      {
        url: "/og-hairsby-default.png",
        width: 1200,
        height: 630,
        alt: "Hairsby Order Details",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Order Details | Hairsby",
    description: "View and manage your order details",
    images: ["/og-hairsby-default.png"],
  },
};
