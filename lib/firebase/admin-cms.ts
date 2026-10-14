"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import {
  seedCmsCities,
  seedCmsProjects,
  type CmsCity,
  type CmsCityTranslation,
  type CmsProject,
  type CmsProjectTranslation,
} from "@/lib/cms-model";
import { firebaseAuth, firebaseDb } from "@/lib/firebase/client";
import type { Locale } from "@/lib/i18n";
import type { ExchangeRates } from "@/lib/project-commercial";

export type AddressSearchResult = {
  id: string;
  displayName: string;
  latitude: number;
  longitude: number;
};

const MAX_IMAGE_SIZE = 15 * 1024 * 1024;
const translatedLocales: Exclude<Locale, "pt">[] = ["en", "es", "fr", "de", "zh"];

function requireUserId() {
  const uid = firebaseAuth.currentUser?.uid;
  if (!uid) throw new Error("Sua sessão expirou. Entre novamente no painel.");
  return uid;
}

function asIsoDate(value: unknown, fallback: string) {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }
  if (typeof value === "string") return value;
  return fallback;
}

function projectFromSnapshot(snapshot: QueryDocumentSnapshot<DocumentData>): CmsProject {
  const data = snapshot.data();
  const now = new Date().toISOString();
  return {
    id: snapshot.id,
    slug: data.slug ?? "",
    citySlug: data.citySlug ?? "",
    category: data.category ?? "",
    status: data.status ?? "draft",
    featured: Boolean(data.featured),
    heroImage: data.heroImage ?? "",
    gallery: Array.isArray(data.gallery) ? data.gallery : [],
    videoUrl: data.videoUrl ?? "",
    address: data.address ?? "",
    mapUrl: data.mapUrl ?? "",
    priceLabel: data.priceLabel ?? "",
    lotSize: data.lotSize ?? "",
    features: Array.isArray(data.features) ? data.features : [],
    translations: data.translations ?? {},
    createdAt: asIsoDate(data.createdAt, now),
    updatedAt: asIsoDate(data.updatedAt, now),
    updatedBy: data.updatedBy,
  };
}

function cityFromSnapshot(snapshot: QueryDocumentSnapshot<DocumentData>): CmsCity {
  const data = snapshot.data();
  const now = new Date().toISOString();
  return {
    id: snapshot.id,
    slug: data.slug ?? snapshot.id,
    name: data.name ?? "",
    state: data.state ?? "",
    heroImage: data.heroImage ?? "",
    intro: data.intro ?? "",
    statement: data.statement ?? "",
    translations: data.translations ?? {},
    active: Boolean(data.active),
    createdAt: asIsoDate(data.createdAt, now),
    updatedAt: asIsoDate(data.updatedAt, now),
    updatedBy: data.updatedBy,
  };
}

function projectPayload(project: CmsProject, uid: string, createdAt: unknown) {
  return {
    id: project.id,
    slug: project.slug,
    citySlug: project.citySlug,
    category: project.category,
    status: project.status,
    featured: project.featured,
    heroImage: project.heroImage,
    gallery: project.gallery,
    videoUrl: project.videoUrl,
    address: project.address,
    mapUrl: project.mapUrl,
    priceLabel: project.priceLabel,
    lotSize: project.lotSize,
    features: project.features,
    translations: project.translations,
    createdAt,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  };
}

function cityPayload(city: CmsCity, uid: string, createdAt: unknown) {
  const pt = city.translations.pt;
  return {
    id: city.id,
    slug: city.slug,
    name: pt?.name || city.name,
    state: city.state,
    heroImage: city.heroImage,
    intro: pt?.intro || city.intro,
    statement: pt?.statement || city.statement,
    translations: city.translations,
    active: city.active,
    createdAt,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  };
}

export function subscribeCmsData(
  onProjects: (projects: CmsProject[]) => void,
  onCities: (cities: CmsCity[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const unsubscribeProjects = onSnapshot(collection(firebaseDb, "projects"), (snapshot) => {
    const projects = snapshot.docs.map(projectFromSnapshot).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    onProjects(projects);
  }, onError);

  const unsubscribeCities = onSnapshot(collection(firebaseDb, "cities"), (snapshot) => {
    const cities = snapshot.docs.map(cityFromSnapshot).sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    onCities(cities);
  }, onError);

  return () => {
    unsubscribeProjects();
    unsubscribeCities();
  };
}

export async function saveCmsProject(project: CmsProject) {
  const uid = requireUserId();
  const id = project.id || `${project.citySlug}__${project.slug}`;
  const documentRef = doc(firebaseDb, "projects", id);
  const current = await getDoc(documentRef);
  const next = { ...project, id };
  await setDoc(documentRef, projectPayload(next, uid, current.exists() ? current.data().createdAt : serverTimestamp()));
  return next;
}

export async function removeCmsProject(id: string) {
  requireUserId();
  await deleteDoc(doc(firebaseDb, "projects", id));
}

export async function saveCmsCity(city: CmsCity) {
  const uid = requireUserId();
  const id = city.id || city.slug;
  const documentRef = doc(firebaseDb, "cities", id);
  const current = await getDoc(documentRef);
  const next = { ...city, id };
  await setDoc(documentRef, cityPayload(next, uid, current.exists() ? current.data().createdAt : serverTimestamp()));
  return next;
}

export async function uploadProjectImages(project: Pick<CmsProject, "id" | "citySlug" | "slug">, files: File[]) {
  requireUserId();
  const projectId = project.id || `${project.citySlug}__${project.slug || "novo"}`;
  const token = await firebaseAuth.currentUser!.getIdToken();
  const signatureResponse = await fetch("/api/admin/cloudinary-signature", {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ projectId }),
  });
  const signatureData = await signatureResponse.json() as {
    error?: string;
    cloudName?: string;
    apiKey?: string;
    folder?: string;
    timestamp?: number;
    signature?: string;
  };
  if (!signatureResponse.ok || !signatureData.cloudName || !signatureData.apiKey || !signatureData.folder || !signatureData.timestamp || !signatureData.signature) {
    throw new Error(signatureData.error || "Não foi possível iniciar o envio para a Cloudinary.");
  }

  return Promise.all(files.map(async (file) => {
    if (!file.type.startsWith("image/")) throw new Error(`${file.name} não é uma imagem válida.`);
    if (file.size > MAX_IMAGE_SIZE) throw new Error(`${file.name} ultrapassa o limite de 15 MB.`);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signatureData.apiKey!);
    formData.append("timestamp", String(signatureData.timestamp));
    formData.append("signature", signatureData.signature!);
    formData.append("folder", signatureData.folder!);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(signatureData.cloudName!)}/image/upload`,
      { method: "POST", body: formData },
    );
    const result = await response.json() as { secure_url?: string; error?: { message?: string } };
    if (!response.ok || !result.secure_url) {
      throw new Error(result.error?.message || `Não foi possível enviar ${file.name}.`);
    }
    return result.secure_url.replace(
      "/image/upload/",
      "/image/upload/f_auto,q_auto:good,c_limit,w_2400/",
    );
  }));
}

async function requestAutomaticTranslations<T extends CmsProjectTranslation | CmsCityTranslation>(
  kind: "project" | "city",
  source: T,
) {
  requireUserId();
  const token = await firebaseAuth.currentUser!.getIdToken();
  const response = await fetch("/api/admin/translate", {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ kind, source }),
  });
  const result = await response.json() as {
    error?: string;
    translations?: Partial<Record<Exclude<Locale, "pt">, T>>;
  };
  if (!response.ok || !result.translations) {
    throw new Error(result.error || "Não foi possível gerar as traduções.");
  }

  for (const locale of translatedLocales) {
    if (!result.translations[locale]) {
      throw new Error(`A tradução para ${locale.toUpperCase()} não foi concluída.`);
    }
  }
  return result.translations;
}

export function translateProjectContent(source: CmsProjectTranslation) {
  return requestAutomaticTranslations<CmsProjectTranslation>("project", source);
}

export function translateCityContent(source: CmsCityTranslation) {
  return requestAutomaticTranslations<CmsCityTranslation>("city", source);
}

export async function getAdminExchangeRates() {
  requireUserId();
  const token = await firebaseAuth.currentUser!.getIdToken();
  const response = await fetch("/api/admin/exchange-rates", {
    headers: { authorization: `Bearer ${token}` },
  });
  const result = await response.json() as { error?: string; rates?: ExchangeRates };
  if (!response.ok || !result.rates) {
    throw new Error(result.error || "Não foi possível consultar as cotações.");
  }
  return result.rates;
}

export async function searchAdminAddresses(query: string) {
  requireUserId();
  const token = await firebaseAuth.currentUser!.getIdToken();
  const response = await fetch("/api/admin/geocode", {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  const result = await response.json() as { error?: string; results?: AddressSearchResult[] };
  if (!response.ok || !result.results) {
    throw new Error(result.error || "Não foi possível localizar esse endereço.");
  }
  return result.results;
}

export async function ensureSeedCmsData() {
  const uid = requireUserId();
  const markerRef = doc(firebaseDb, "settings", "cms");
  const marker = await getDoc(markerRef);
  if (marker.exists()) return false;

  const [someProjects, someCities] = await Promise.all([
    getDocs(query(collection(firebaseDb, "projects"), limit(1))),
    getDocs(query(collection(firebaseDb, "cities"), limit(1))),
  ]);
  const batch = writeBatch(firebaseDb);

  if (someProjects.empty && someCities.empty) {
    seedCmsCities.forEach((city) => {
      batch.set(doc(firebaseDb, "cities", city.id), cityPayload(city, uid, serverTimestamp()));
    });
    seedCmsProjects.forEach((project) => {
      batch.set(doc(firebaseDb, "projects", project.id), projectPayload(project, uid, serverTimestamp()));
    });
  }

  batch.set(markerRef, {
    initialized: true,
    initializedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  });
  await batch.commit();
  return someProjects.empty && someCities.empty;
}

