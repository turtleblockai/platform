import app, { type Env } from "./index";
import { injectBuildLogRuntime } from "./buildLog";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const response = await app.fetch(request, env, ctx);
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) return response;

    const html = injectBuildLogRuntime(await response.text());
    const headers = new Headers(response.headers);
    headers.delete("content-length");
    headers.set("cache-control", "no-store, no-cache, must-revalidate, max-age=0");
    return new Response(html, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
