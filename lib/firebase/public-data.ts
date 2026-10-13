import { cache } from "react";
import type { CmsCity, CmsProject } from "@/lib/cms-model";
import { firebaseConfig } from "@/lib/firebase/config";

type FirestoreValue = {
  nullValue?: null;
  booleanValue?: boolean;
  integerValue?: string;
  doubleValue?: number;
  timestampValue?: string;
  stringValue?: string;
  arrayValue?: { values?: FirestoreValue[] };
  mapValue?: { fields?: Record<string, FirestoreValue> };
};

type FirestoreDocument = {
  name: string;
  fields?: Record<string, FirestoreValue>;
};

const projectId = String(firebaseConfig.projectId);
const apiKey = String(firebaseConfig.apiKey);
const documentsUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

function fromValue(value: FirestoreValue): unknown {
  if ("nullValue" in value) return null;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("timestampValue" in value) return value.timestampValue;
  if ("stringValue" in value) return value.stringValue;
  if (value.arrayValue) return (value.arrayValue.values ?? []).map(fromValue);
  if (value.mapValue) return Object.fromEntries(Object.entries(value.mapValue.fields ?? {}).map(([key, nested]) => [key, fromValue(nested)]));
  return undefined;
}

function documentData(document: FirestoreDocument) {
  const data = Object.fromEntries(Object.entries(document.fields ?? {}).map(([key, value]) => [key, fromValue(value)]));
  return { ...data, id: document.name.split("/").at(-1) } as Record<string, unknown>;
}

async function runQuery(collectionId: string, filters: Array<[string, "EQUAL", FirestoreValue]>, limit = 500) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const fieldFilters = filters.map(([fieldPath, op, value]) => ({ fieldFilter: { field: { fieldPath }, op, value } }));
    const where = fieldFilters.length === 1 ? fieldFilters[0] : { compositeFilter: { op: "AND", filters: fieldFilters } };
    const response = await fetch(`${documentsUrl}:runQuery?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ structuredQuery: { from: [{ collectionId }], where, limit } }),
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) return undefined;
    const payload = await response.json() as Array<{ document?: FirestoreDocument }>;
    return payload.flatMap((item) => item.document ? [documentData(item.document)] : []);
  } catch {
    return undefined;
  } finally {
    clearTimeout(timeout);
  }
}

const stringValue = (value: string): FirestoreValue => ({ stringValue: value });
const booleanValue = (value: boolean): FirestoreValue => ({ booleanValue: value });
const getActiveCities = cache(() => runQuery("cities", [["active", "EQUAL", booleanValue(true)]]));
const getPublishedProjects = cache(() => runQuery("projects", [["status", "EQUAL", stringValue("published")]]));

export async function getPublicCmsCities(): Promise<CmsCity[] | undefined> {
  return await getActiveCities() as unknown as CmsCity[] | undefined;
}

export async function getPublicCmsCity(slug: string): Promise<CmsCity | null | undefined> {
  const cities = await getActiveCities();
  if (cities === undefined) return undefined;
  return (cities.find((city) => city.slug === slug) as unknown as CmsCity | undefined) ?? null;
}

export async function getPublicCmsProjectsByCity(citySlug: string): Promise<CmsProject[] | undefined> {
  const projects = await getPublishedProjects();
  return projects?.filter((project) => project.citySlug === citySlug) as unknown as CmsProject[] | undefined;
}

export async function getPublicCmsFeaturedProjects(): Promise<CmsProject[] | undefined> {
  const projects = await getPublishedProjects();
  return projects?.filter((project) => project.featured).slice(0, 8) as unknown as CmsProject[] | undefined;
}

export async function getPublicCmsProject(citySlug: string, slug: string): Promise<CmsProject | null | undefined> {
  const projects = await getPublishedProjects();
  if (projects === undefined) return undefined;
  return (projects.find((project) => project.citySlug === citySlug && project.slug === slug) as unknown as CmsProject | undefined) ?? null;
}

