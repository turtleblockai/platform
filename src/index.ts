export interface Env {
  ASSETS: Fetcher;
}

const worldSpecSummary = {
  version: "0.1",
  status: "experimental",
  interaction_modes: ["direct", "interpretive", "reflective"],
  core_loop: [
    "learner intent",
    "agent dialogue",
    "WorldSpec",
    "build",
    "inhabit",
    "notice",
    "reflect",
    "revise"
  ],
  principles: [
    "learner is designer and producer",
    "inquiry before predetermined outcome",
    "manual learner edits are preserved",
    "semantic interpretations remain revisable",
    "reflection is first-class state",
    "the agent is collaborator, not authority"
  ],
  repository: "https://github.com/turtleblockai/platform/tree/main/worldspec"
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({
        ok: true,
        service: "turtleblockai-platform",
        message: "TurtleBlock AI is awake."
      });
    }

    if (url.pathname === "/api/worldspec" && request.method === "GET") {
      return Response.json(worldSpecSummary);
    }

    return env.ASSETS.fetch(request);
  }
} satisfies ExportedHandler<Env>;
