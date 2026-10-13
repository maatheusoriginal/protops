"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { LockKeyhole, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { firebaseAuth, firebaseDb } from "@/lib/firebase/client";

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "denied">("loading");

  useEffect(() => onAuthStateChanged(firebaseAuth, async (currentUser) => {
    if (!currentUser) {
      router.replace("/admin/login");
      return;
    }
    setUser(currentUser);
    try {
      const admin = await getDoc(doc(firebaseDb, "admins", currentUser.uid));
      if (admin.exists() && admin.data().active === true && admin.data().role === "admin") {
        setStatus("ready");
      } else {
        setStatus("denied");
      }
    } catch {
      setStatus("denied");
    }
  }), [router]);

  if (status === "ready") return children;

  if (status === "denied") {
    return <main className="admin-auth-shell"><section className="admin-auth-card admin-access-card"><span className="admin-auth-icon"><LockKeyhole /></span><p className="eyebrow">Acesso protegido</p><h1>Usuário sem permissão administrativa.</h1><p>O login existe, mas o UID ainda não está cadastrado em <code>admins</code> no Firestore.</p><div className="admin-auth-actions"><Button onClick={async () => { await signOut(firebaseAuth); router.replace("/admin/login"); }} className="admin-primary"><LogOut /> Sair e tentar outra conta</Button></div>{user?.uid && <small>UID: <code>{user.uid}</code></small>}</section></main>;
  }

  return <main className="admin-auth-shell"><section className="admin-auth-loading"><span /><p>Verificando acesso seguro…</p></section></main>;
}

