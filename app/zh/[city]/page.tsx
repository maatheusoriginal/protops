import type { Metadata } from "next";
import { CityPage } from "@/components/pages/city-page";
import { cities } from "@/lib/site-data";
import { cityMetadata } from "@/lib/site-metadata";
export function generateStaticParams() { return cities.map((city) => ({ city: city.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> { const { city } = await params; return cityMetadata("zh", city); }
export default async function Page({ params }: { params: Promise<{ city: string }> }) { const { city } = await params; return <CityPage locale="zh" citySlug={city} />; }
