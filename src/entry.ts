import app, { type Env } from "./index";
import { injectBuildLogRuntime } from "./buildLog";
import { applySiteChrome } from "./siteChrome";

function applyTerrariaLanguage(html: string) {
  let next = html.replace(/Turtle Lab/g, "Turtle Terraria");
  next = next.replace(/Public artifacts\./g, "Multiple habitats.");
  next = next.replace(
    '<p class="lede">The public research edge of TurtleBlock AI: build notes, learner-approved projects, WorldSpec artifacts, experiments, reflections, and documented lessons from implementation.</p>',
    '<p class="lede">Bounded habitats for observing what emerges when people and computers construct, question, reflect, and revise together — and what happens when human-made computational agents recursively do the same with one another.</p><div class="gallery"><div class="project"><strong>🧑‍💻🐢 Human + Turtle Terrarium</strong><p class="muted">A person drives inquiry. Turtle contributes interpretations, questions, alternatives, technical assistance, and construction while human purpose, correction, reflection, and judgment remain human-authored evidence.</p></div><div class="project"><strong>🐢🐢 Recursive Turtle Terrarium</strong><p class="muted">Synthetic Turtle roles construct, critique, test, and revise one another\'s representations. These traces are explicitly synthetic, never learner evidence, and have no authority to promote themselves directly into production.</p></div></div><div class="card loop">cohabitation without provenance collapse: human meaning ≠ Turtle interpretation ≠ synthetic self-play ≠ scholarly source</div>'
  );
  next = next.replace(
    '🐢 Turtle Terraria is the opt-in public artifact layer; raw conversations stay private by default.',
    '🐢 Turtle Terraria contains multiple research habitats; human, machine, synthetic, world, and scholarly traces may cohabitate without losing provenance.'
  );
  next = next.replace(
    '<h2>Research lineage in practice</h2>',
    '<h2>Research lineage in practice</h2><p>The seven established Critical Techno Constructivism domains remain the primary operational frame, while the database now preserves observations that do not fit them cleanly so possible eighth, ninth, or later domains can emerge from evidence rather than being invented in advance.</p>'
  );
  return next;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const originalUrl = new URL(request.url);

    // /lab/ was the original public research page. Keep old links working while
    // making /terraria/ the canonical public habitat URL.
    if (originalUrl.pathname === "/lab" || originalUrl.pathname === "/lab/") {
      const target = new URL("/terraria/", originalUrl.origin);
      return Response.redirect(target.toString(), 301);
    }

    let internalRequest = request;
    if (originalUrl.pathname === "/terraria" || originalUrl.pathname === "/terraria/") {
      const internalUrl = new URL(request.url);
      internalUrl.pathname = "/lab/";
      internalRequest = new Request(internalUrl.toString(), request);
    }

    const response = await app.fetch(internalRequest, env, ctx);
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) return response;

    let html = applyTerrariaLanguage(await response.text());
    html = injectBuildLogRuntime(html);
    html = applySiteChrome(html, originalUrl.pathname);

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
