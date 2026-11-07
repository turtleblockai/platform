#!/usr/bin/env node
// Prerenders each SPA route in public/index.html into real static HTML at its
// own path (public/<route>/index.html), with its own title, description,
// canonical, and Open Graph tags. The page JavaScript still boots and takes
// over navigation, so this is progressive enhancement over the same `pages`
// template strings.
//
//   npm run build:static          regenerate files
//   npm run validate:static-pages  fail if generated files are stale
//
// public/index.html is both the source template and the generated home page.
// Generated regions are fenced by <!--route-head--> and <!--prerender--> markers
// and are reset before rendering, so the script is idempotent.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import jsdom from "jsdom";
const { JSDOM, VirtualConsole } = jsdom;

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const ORIGIN = "https://turtleblockai.com";
const CHECK = process.argv.includes("--check");
const SHARE_IMAGE = `${ORIGIN}/assets/turtleblock-share-card.jpg`;

// route -> description (titles come from the page's own go() names map)
export const ROUTES = {
  home: "TurtleBlock AI helps learners turn ideas into worlds they can build, explore, question, and change, starting with Minecraft and keeping the learner in control.",
  about: "TurtleBlock AI, from the Logo turtle in 1983 to a Minecraft world-building collaborator in 2026. A Culver City Studio Works project led by Dr. Bryan P. Sanders.",
  worldspec: "WorldSpec preserves learner meaning as a persistent, inspectable representation that moves between dialogue, Minecraft construction, experience, and revision.",
  charter: "The Turtle Charter keeps the learner in control: Turtle may collaborate, question, suggest, and build, but meaning and judgment remain human.",
  build: "The TurtleBlock AI Build Log: working infrastructure, reversals, research decisions, and the next edge, built in public.",
  steamhamlet: "STEAMHAMLET is the earlier room of possibilities behind TurtleBlock AI, where ideas become objects learners can move, combine, and rebuild.",
  reeducation: "RE/EDUCATION is where TurtleBlock AI is field-tested in live teaching, research, school design, and technical experimentation.",
  privacy: "How the TurtleBlock AI Playground handles conversations: private by default, with explicit consent, provenance, redaction, and intentional publication.",
  disclaimer: "TurtleBlock AI is experimental software: outputs can be wrong, integrations can fail, and consequential decisions still require human judgment.",
  try: "Talk with Turtle: describe a place you want to make in Minecraft and shape it through conversation into a WorldSpec you can build, explore, and revise."
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const routeUrl = (route) => `${ORIGIN}${route === "home" ? "/" : `/${route}/`}`;
const outFile = (route) => path.join(PUBLIC, route === "home" ? "index.html" : path.join(route, "index.html"));

function resetTemplate(html) {
  return html
    .replace(/<!--prerender-->[\s\S]*?<!--\/prerender-->/, "<!--prerender--><!--/prerender-->")
    .replace(/<a class="navcard active"/g, '<a class="navcard"');
}

function headFor(route, title) {
  const url = routeUrl(route);
  const desc = ROUTES[route];
  const ogTitle = route === "home" ? "TurtleBlock AI — Building, exploring, and thinking together." : title;
  return `  <!--route-head-->
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${url}" data-turtleblock-social="v1">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="TurtleBlock AI">
  <meta property="og:locale" content="en_US">
  <meta property="og:title" content="${esc(ogTitle)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SHARE_IMAGE}">
  <meta property="og:image:secure_url" content="${SHARE_IMAGE}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="600">
  <meta property="og:image:height" content="315">
  <meta property="og:image:alt" content="TurtleBlock AI — Building, exploring, and thinking together.">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(ogTitle)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta name="twitter:image" content="${SHARE_IMAGE}">
  <meta name="twitter:image:alt" content="TurtleBlock AI — Building, exploring, and thinking together.">
  <meta itemprop="name" content="${esc(ogTitle)}">
  <meta itemprop="description" content="${esc(desc)}">
  <meta itemprop="image" content="${SHARE_IMAGE}">
  <!--/route-head-->`;
}

// Inline same-origin scripts (site-runtime.js) so the prerender sees exactly
// what the browser sees, without any network or subresource loading.
async function inlineScripts(html) {
  const re = /<script src="(\/assets\/[^"?]+\.js)(?:\?[^"]*)?"><\/script>/g;
  let out = html;
  for (const m of html.matchAll(re)) {
    const code = await readFile(path.join(PUBLIC, m[1]), "utf8");
    out = out.replace(m[0], () => `<script>${code.replace(/<\/script/gi, "<\\/script")}</script>`);
  }
  return out;
}

async function render(template, route) {
  const virtualConsole = new VirtualConsole(); // swallow jsdom "not implemented" noise
  const dom = new JSDOM(await inlineScripts(template), {
    url: routeUrl(route),
    runScripts: "dangerously",
    pretendToBeVisual: true,
    virtualConsole,
    beforeParse(window) {
      window.scrollTo = () => {};
      window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
      window.fetch = () => Promise.reject(new Error("offline prerender"));
    }
  });
  await new Promise((resolve) => dom.window.addEventListener("load", resolve));
  await new Promise((resolve) => setTimeout(resolve, 150));
  const doc = dom.window.document;
  const content = doc.getElementById("content").innerHTML.trim();
  const title = doc.title || "TurtleBlock AI";
  const status = doc.querySelector(".railstatus,.status")?.textContent?.trim() || "";
  dom.window.close();
  if (!content || content.length < 200) throw new Error(`route ${route} rendered no content`);
  return { content, title, status };
}

function compose(template, route, { content, title, status }) {
  let html = template
    .replace(/  <!--route-head-->[\s\S]*?<!--\/route-head-->/, headFor(route, title))
    .replace("<!--prerender--><!--/prerender-->", `<!--prerender-->${content}<!--/prerender-->`)
    .replace(`<a class="navcard" href="/${route}/" data-route="${route}">`, `<a class="navcard active" href="/${route}/" data-route="${route}">`);
  if (status) html = html.replace(/<div class="status">[\s\S]*?<\/div>/, `<div class="status">${esc(status).replace(/&quot;/g, '"')}</div>`);
  return html;
}

async function main() {
  const source = await readFile(path.join(PUBLIC, "index.html"), "utf8");
  if (!source.includes("<!--route-head-->") || !source.includes("<!--prerender-->")) throw new Error("public/index.html is missing prerender markers");
  const template = resetTemplate(source);
  const stale = [];
  for (const route of Object.keys(ROUTES)) {
    const rendered = await render(template, route);
    const html = compose(template, route, rendered);
    const file = outFile(route);
    const current = existsSync(file) ? await readFile(file, "utf8") : "";
    if (current === html) continue;
    if (CHECK) { stale.push(path.relative(ROOT, file)); continue; }
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, html);
    console.log(`wrote ${path.relative(ROOT, file)} · ${rendered.title}`);
  }
  if (CHECK && stale.length) {
    console.error(`Static pages are stale; run npm run build:static:\n  ${stale.join("\n  ")}`);
    process.exit(1);
  }
  if (CHECK) console.log("Static route pages are up to date.");
}

main().catch((error) => { console.error(error); process.exit(1); });
