import { notificationCompo } from "src/types/notificationComponent";

export const orderUpdatesItems: notificationCompo[] =[
    {
        linkToPage: "#",
        title: "Order Completed",
        description: "Payment for order has been confirmed and we've notified the seller. Kindly wait for your shipment.",
        mainImage: "https://placehold.co/400",
        timestamp: new Date("2025-01-01T10:00:00Z"),
    },
    {
        linkToPage: "#",
        title: "Order Cancelled",
        description: "Order has been cancelled as your payment could not be verified.s",
        mainImage: "https://placehold.co/400",
        timestamp: new Date("2025-01-01T17:00:00Z"),
    },
]

export const promotionItems: notificationCompo[] =[
    {
        linkToPage: "#",
        title: "Free Delivery",
        description: "Free delivery yes yes",
        mainImage: "https://placehold.co/400",
        timestamp: new Date("2025-01-01T17:00:00Z"),
    },
      {
    linkToPage: "#",
    title: "New Year Sale",
    description: "Enjoy discounts up to 50% on selected items.",
    mainImage: "https://placehold.co/400",
    additionalImage: ["https://placehold.co/200", "https://placehold.co/100"],
    timestamp: new Date("2025-01-02T09:00:00Z"),
  },
  {
    linkToPage: "#",
    title: "Flash Deal",
    description: "Limited-time flash deal is live. Don’t miss it.",
    mainImage: "https://placehold.co/400",
    timestamp: new Date("2025-01-03T12:30:00Z"),
  },
  {
    linkToPage: "#",
    title: "Voucher Available",
    description: "A new voucher has been added to your account.",
    mainImage: "https://placehold.co/400",
    timestamp: new Date("2025-01-04T15:45:00Z"),
  },
  {
    linkToPage: "#",
    title: "Special Promotion",
    description: "Exclusive promotion just for you. Check it out now.",
    mainImage: "https://placehold.co/400",
    timestamp: new Date("2025-01-05T20:00:00Z"),
  }
]

export const financeItems: notificationCompo[] = [
    {
        linkToPage: "#",
        title: "Only you! get discount 5%",
        description: "I don't know but this is fire yes yes yes FIREEEEEEEEEEEE",
        mainImage: "https://placehold.co/400",
        timestamp: new Date("2025-01-05T20:00:00Z"),
    }
]

export const NebulaUpdateItems: notificationCompo[] = [
  {
    linkToPage: "#",
    title: "New UI Improvements",
    description:
      "We’ve updated the interface to improve readability, navigation, and overall user experience.",
    mainImage: "https://placehold.co/400",
    timestamp: new Date("2025-01-08T09:00:00Z"),
  },
  {
    linkToPage: "#",
    title: "Performance Optimization",
    description:
      "The web app now loads faster and runs more smoothly thanks to backend and frontend optimizations.",
    mainImage: "https://placehold.co/400",
    timestamp: new Date("2025-01-09T18:20:00Z"),
  },
]