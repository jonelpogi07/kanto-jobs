import { createFileRoute } from "@tanstack/react-router";
import { KantoApp } from "@/components/kanto-app";
export const Route = createFileRoute("/")({
 head: () => ({ meta: [
  { title: "KantoJobs — Your barangay, your next gig" },
  { name: "description", content: "Find local side hustles, offer a helping hand and discover trusted neighbors in your Philippine barangay." },
  { property: "og:title", content: "KantoJobs — Your next side hustle is around the kanto" },
  { property: "og:description", content: "Local people, fair pay, and community-powered micro-jobs. Explore the KantoJobs interactive demo." },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
 ] }),
 component: KantoApp,
});
