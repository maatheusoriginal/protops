import { CapitalPage } from "@/components/pages/capital-page";
import { capitalMetadata } from "@/lib/site-metadata";
export const metadata = capitalMetadata("de");
export default function Page() { return <CapitalPage locale="de" />; }

