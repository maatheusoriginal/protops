import { HomePage } from "@/components/pages/home-page";
import { homeMetadata } from "@/lib/site-metadata";
export const metadata = homeMetadata("fr");
export default function Page() { return <HomePage locale="fr" />; }
