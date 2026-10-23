import path from "node:path";

export function rendererFileForRequest(rendererDist: string, requestUrl: string) {
  let parsed: URL;
  try {
    parsed = new URL(requestUrl);
  } catch {
    return null;
  }
  if (parsed.protocol !== "app:" || parsed.hostname !== "orion") return null;
  if (requestUrl.split(/[?#]/, 1)[0].split("/").includes("..")) return null;
  const root = path.resolve(rendererDist);
  let relative = "";
  try {
    relative = decodeURIComponent(parsed.pathname).replace(/^\/+/, "");
  } catch {
    return null;
  }
  if (relative.includes("\0")) return null;
  const candidate = path.resolve(root, relative);
  if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) return null;
  return candidate;
}
