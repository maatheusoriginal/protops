import { createHash } from "node:crypto";
import { jsonError, requireAdmin } from "@/lib/server/admin-auth";

export const runtime = "nodejs";

function safeSegment(value: unknown) {
  return String(value ?? "novo-empreendimento")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100) || "novo-empreendimento";
}

export async function POST(request: Request) {
  try {
    await requireAdmin(request);

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

    if (!cloudName || !apiKey || !apiSecret) {
      return Response.json(
        {
          error:
            "A Cloudinary ainda não está configurada na Vercel. Confira CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET.",
        },
        { status: 503 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as {
      projectId?: string;
    };
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = `protops/empreendimentos/${safeSegment(body.projectId)}`;
    const parameters = `folder=${folder}&timestamp=${timestamp}`;
    const signature = createHash("sha1")
      .update(`${parameters}${apiSecret}`)
      .digest("hex");

    return Response.json({ cloudName, apiKey, folder, timestamp, signature });
  } catch (error) {
    return jsonError(error);
  }
}
