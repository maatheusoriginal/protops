import { HomePage } from "@/components/pages/home-page";
import { homeMetadata } from "@/lib/site-metadata";
export const metadata = homeMetadata("zh");
export default function Page() { return <HomePage locale="zh" />; }
