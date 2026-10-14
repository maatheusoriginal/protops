import { jsonError, requireAdmin } from "@/lib/server/admin-auth";
import { getExchangeRates } from "@/lib/server/exchange-rates";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    return Response.json({ rates: await getExchangeRates() });
  } catch (error) {
    return jsonError(error);
  }
}
