import { fileURLToPath } from "node:url";
import path from "node:path";

export function isAllowedNavigation(url: string, rendererDist: string, devServerUrl?: string) {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  if (parsed.protocol === "app:") return parsed.hostname === "orion";

  if (parsed.protocol === "file:") {
    let filePath: string;
    try {
      filePath = fileURLToPath(parsed);
    } catch {
      return false;
    }
    const root = path.resolve(rendererDist);
    const target = path.resolve(filePath);
    return target === root || target.startsWith(`${root}${path.sep}`);
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
  if (!devServerUrl) return false;
  try {
    return parsed.origin === new URL(devServerUrl).origin;
  } catch {
    return false;
  }
}
