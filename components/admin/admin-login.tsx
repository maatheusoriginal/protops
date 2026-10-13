"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FirebaseError } from "firebase/app";
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { ArrowLeft, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { firebaseAuth, firebaseDb } from "@/lib/firebase/client";

function authMessage(error: unknown) {
  if (!(error instanceof FirebaseError)) return "Não foi possível entrar. Tente novamente.";
  if (["auth/invalid-credential", "auth/user-not-found", "auth/wrong-password"].includes(error.code)) return "E-mail ou senha incorretos.";
  if (error.code === "auth/too-many-requests") return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
  if (error.code === "auth/operation-not-allowed") return "Ative o provedor E-mail/senha no Firebase Authentication.";
  if (error.code === "auth/network-request-failed") return "Falha de conexão. Verifique a internet e tente novamente.";
  return "Não foi possível entrar. Confira a configuração do Firebase.";
}

export function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");

  useEffect(() => onAuthStateChanged(firebaseAuth, async (user) => {
    if (!user) return;
    const admin = await getDoc(doc(firebaseDb, "admins", user.uid)).catch(() => null);
    if (admin?.exists() && admin.data().active === true && admin.data().role === "admin") router.replace("/admin");
  }), [router]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const credential = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
      const admin = await getDoc(doc(firebaseDb, "admins", credential.user.uid));
      if (!admin.exists() || admin.data().active !== true || admin.data().role !== "admin") {
        await signOut(firebaseAuth);
        setMessage(`Conta autenticada, mas sem acesso ao painel. Cadastre o UID ${credential.user.uid} na coleção admins.`);
        return;
      }
      router.replace("/admin");
    } catch (error) {
      setMessageType("error");
      setMessage(authMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword() {
    if (!email.trim()) {
      setMessageType("error");
      setMessage("Digite seu e-mail primeiro para receber o link de redefinição.");
      return;
    }
    setBusy(true);
    try {
      await sendPasswordResetEmail(firebaseAuth, email.trim());
      setMessageType("success");
      setMessage("Link de redefinição enviado para o seu e-mail.");
    } catch (error) {
      setMessageType("error");
      setMessage(authMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return <main className="admin-login-page"><div className="admin-login-visual"><img src="/media/golden-village.webp" alt="Vista aérea de empreendimento Pro-Tops" /><div /><Link href="/"><ArrowLeft /> Voltar para o site</Link><blockquote><p>Gestão centralizada de cidades, empreendimentos, traduções e acervo visual.</p><span>Pro-Tops · Painel 2026</span></blockquote></div><section className="admin-login-panel"><div className="admin-login-box"><img src="/media/logo-protops.png" alt="Pro-Tops" /><p className="eyebrow">Área administrativa</p><h1>Bem-vindo de volta.</h1><p className="admin-login-intro">Entre com o usuário autorizado no Firebase para gerenciar o portfólio.</p><form onSubmit={submit}><label><span>E-mail</span><div><Mail /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nome@protops.com" autoComplete="email" required /></div></label><label><span>Senha</span><div><LockKeyhole /><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Sua senha" autoComplete="current-password" required /><button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? <EyeOff /> : <Eye />}</button></div></label>{message && <p className={`admin-auth-message ${messageType}`}>{message}</p>}<Button type="submit" disabled={busy} className="admin-primary admin-login-submit">{busy ? <LoaderCircle className="admin-spin" /> : <LockKeyhole />} Entrar no painel</Button><button className="admin-reset-button" type="button" disabled={busy} onClick={resetPassword}>Esqueci minha senha</button></form><small>Ambiente protegido com Firebase Authentication.</small></div></section></main>;
}

