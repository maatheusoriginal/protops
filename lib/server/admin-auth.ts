import "server-only";

const firebaseApiKey =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??
  "AIzaSyC22OFKBd1wVD0DOCVcNvaBXshArQ4YO8s";
const firebaseProjectId =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "protops-uberlandia";

type FirebaseTokenPayload = {
  sub?: string;
  user_id?: string;
};

function readBearerToken(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  const [scheme, token] = authorization.split(" ");
  if (scheme !== "Bearer" || !token) {
    throw Response.json({ error: "Sessão administrativa ausente." }, { status: 401 });
  }
  return token;
}

function readUidFromToken(token: string) {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return "";
    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(
      Buffer.from(normalized, "base64").toString("utf8"),
    ) as FirebaseTokenPayload;
    return payload.sub ?? payload.user_id ?? "";
  } catch {
    return "";
  }
}

export async function requireAdmin(request: Request) {
  const token = readBearerToken(request);
  const uid = readUidFromToken(token);
  if (!uid) throw Response.json({ error: "Sessão administrativa inválida." }, { status: 401 });

  // Firestore validates the Firebase ID token and applies the deployed rules.
  // The rules only allow a user to read their own admins/{uid} document.
  const adminUrl = new URL(
    `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/admins/${encodeURIComponent(uid)}`,
  );
  adminUrl.searchParams.set("key", firebaseApiKey);

  const response = await fetch(adminUrl, {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw Response.json({ error: "Seu usuário não possui acesso administrativo." }, {
      status: response.status === 401 ? 401 : 403,
    });
  }

  const document = (await response.json()) as {
    fields?: {
      active?: { booleanValue?: boolean };
      role?: { stringValue?: string };
    };
  };
  const active = document.fields?.active?.booleanValue === true;
  const role = document.fields?.role?.stringValue;

  if (!active || role !== "admin") {
    throw Response.json({ error: "Seu usuário não possui acesso administrativo." }, {
      status: 403,
    });
  }

  return { uid, token };
}

export function jsonError(error: unknown) {
  if (error instanceof Response) return error;
  console.error(error);
  return Response.json(
    { error: "Não foi possível concluir esta operação." },
    { status: 500 },
  );
}
