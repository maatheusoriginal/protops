import type { Metadata } from "next";
import { ProjectPage } from "@/components/pages/project-page";
import { projects } from "@/lib/site-data";
import { projectMetadata } from "@/lib/site-metadata";
export function generateStaticParams() { return projects.map((project) => ({ city: project.city, project: project.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ city: string; project: string }> }): Promise<Metadata> { const route = await params; return projectMetadata("en", route.city, route.project); }
export default async function Page({ params }: { params: Promise<{ city: string; project: string }> }) { const route = await params; return <ProjectPage locale="en" citySlug={route.city} projectSlug={route.project} />; }
