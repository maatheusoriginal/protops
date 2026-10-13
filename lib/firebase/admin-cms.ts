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
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  seedCmsCities,
  seedCmsProjects,
  type CmsCity,
  type CmsProject,
} from "@/lib/cms-model";
import { firebaseAuth, firebaseDb, firebaseStorage } from "@/lib/firebase/client";

const MAX_IMAGE_SIZE = 15 * 1024 * 1024;

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
  return Promise.all(files.map(async (file) => {
    if (!file.type.startsWith("image/")) throw new Error(`${file.name} não é uma imagem válida.`);
    if (file.size > MAX_IMAGE_SIZE) throw new Error(`${file.name} ultrapassa o limite de 15 MB.`);
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    const storageRef = ref(firebaseStorage, `projects/${projectId}/images/${crypto.randomUUID()}-${safeName}`);
    const result = await uploadBytes(storageRef, file, { contentType: file.type });
    return getDownloadURL(result.ref);
  }));
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

