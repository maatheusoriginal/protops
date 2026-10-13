import { HomePage } from "@/components/pages/home-page";
import { homeMetadata } from "@/lib/site-metadata";

export const metadata = homeMetadata("pt");

export default function Home() {
  return <HomePage locale="pt" />;
}
