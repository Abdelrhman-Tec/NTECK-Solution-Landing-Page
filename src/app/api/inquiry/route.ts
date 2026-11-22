import { handleInquiry } from "@/lib/inquiry/server";
import { site } from "@/config/site";

export const runtime = "nodejs";

export function POST(request: Request) {
  return handleInquiry(request, undefined, undefined, site.origin);
}
