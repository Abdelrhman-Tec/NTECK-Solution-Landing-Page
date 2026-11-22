const originalFetch = globalThis.fetch;

globalThis.fetch = (input, init) => {
  const url = new URL(input instanceof Request ? input.url : input);
  if (url.hostname === "fixture.upstash.io") return Promise.resolve(Response.json({ result: 1 }));
  if (url.hostname === "api.resend.com") return Promise.resolve(Response.json({ id: "fixture-email" }));
  if (url.hostname.endsWith(".upstash.io")) throw new Error("Live Redis is disabled in the browser tests");
  return originalFetch(input, init);
};
