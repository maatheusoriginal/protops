"use client";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFirebaseApp } from "@/lib/firebase/config";

export const firebaseApp = getFirebaseApp();
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDb = getFirestore(firebaseApp);

