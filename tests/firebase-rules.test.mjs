import fs from "node:fs/promises";
import test from "node:test";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
const projectId = "demo-protops";
const firestoreRules = await fs.readFile(new URL("../firestore.rules", import.meta.url), "utf8");

const environment = await initializeTestEnvironment({
  projectId,
  firestore: { host: "127.0.0.1", port: 8080, rules: firestoreRules },
});

const translations = Object.fromEntries(["pt", "en", "es", "fr", "de", "zh"].map((locale) => [locale, {
  name: `Projeto ${locale}`,
  summary: `Resumo ${locale}`,
  description: `Descrição ${locale}`,
}]));

const project = (id, status = "published") => ({
  id,
  slug: id.replace("city__", ""),
  citySlug: "city",
  category: "Loteamento residencial",
  status,
  featured: false,
  heroImage: "https://example.com/hero.webp",
  gallery: ["https://example.com/1.webp"],
  videoUrl: "",
  address: "",
  mapUrl: "",
  priceLabel: "Sob consulta",
  lotSize: "",
  features: ["Infraestrutura completa"],
  translations,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  updatedBy: "admin-1",
});

await environment.withSecurityRulesDisabled(async (context) => {
  const db = context.firestore();
  await setDoc(doc(db, "admins", "admin-1"), { active: true, role: "admin" });
  await setDoc(doc(db, "admins", "inactive-admin"), { active: false, role: "admin" });
  await setDoc(doc(db, "projects", "city__published"), project("city__published"));
  await setDoc(doc(db, "projects", "city__draft"), project("city__draft", "draft"));
  await setDoc(doc(db, "cities", "city"), {
    id: "city", slug: "city", name: "Cidade", state: "MG", heroImage: "", intro: "", statement: "",
    translations: { pt: { name: "Cidade", intro: "", statement: "" } }, active: true,
    createdAt: Timestamp.now(), updatedAt: Timestamp.now(), updatedBy: "admin-1",
  });
  await setDoc(doc(db, "cities", "hidden"), {
    id: "hidden", slug: "hidden", name: "Oculta", state: "MG", heroImage: "", intro: "", statement: "",
    translations: { pt: { name: "Oculta", intro: "", statement: "" } }, active: false,
    createdAt: Timestamp.now(), updatedAt: Timestamp.now(), updatedBy: "admin-1",
  });
});

test("public access only exposes active and published content", async () => {
  const db = environment.unauthenticatedContext().firestore();
  await assertSucceeds(getDoc(doc(db, "projects", "city__published")));
  await assertFails(getDoc(doc(db, "projects", "city__draft")));
  await assertSucceeds(getDoc(doc(db, "cities", "city")));
  await assertFails(getDoc(doc(db, "cities", "hidden")));
  await assertSucceeds(getDocs(query(collection(db, "projects"), where("status", "==", "published"))));
  await assertFails(getDocs(collection(db, "projects")));
});

test("ordinary and inactive users cannot write or promote themselves", async () => {
  const ordinary = environment.authenticatedContext("user-1").firestore();
  const inactive = environment.authenticatedContext("inactive-admin").firestore();
  await assertFails(setDoc(doc(ordinary, "projects", "city__attack"), { ...project("city__attack"), createdAt: serverTimestamp(), updatedAt: serverTimestamp(), updatedBy: "user-1" }));
  await assertFails(setDoc(doc(inactive, "projects", "city__inactive"), { ...project("city__inactive"), createdAt: serverTimestamp(), updatedAt: serverTimestamp(), updatedBy: "inactive-admin" }));
  await assertFails(setDoc(doc(ordinary, "admins", "user-1"), { active: true, role: "admin" }));
});

test("active admin can write valid data but cannot smuggle fields", async () => {
  const db = environment.authenticatedContext("admin-1").firestore();
  const valid = { ...project("city__valid"), createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  await assertSucceeds(setDoc(doc(db, "projects", "city__valid"), valid));
  await assertSucceeds(setDoc(doc(db, "projects", "city__empty-media"), {
    ...project("city__empty-media", "draft"),
    heroImage: "",
    gallery: [],
    features: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }));
  await assertFails(setDoc(doc(db, "projects", "city__invalid"), {
    ...project("city__invalid"),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    injectedRole: "admin",
  }));
});

test.after(async () => {
  await environment.cleanup();
});
