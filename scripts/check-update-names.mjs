import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export function updateFileUrls(yaml) {
  return [...yaml.matchAll(/^[ \t]*(?:- )?url:[ \t]*['"]?([^'"\s]+)['"]?[ \t]*$/gm)].map((match) => match[1]);
}

export function missingUpdateFiles(releaseDir) {
  const names = new Set(fs.readdirSync(releaseDir));
  const manifests = [...names].filter((name) => name.endsWith(".yml") && name !== "builder-debug.yml");
  if (manifests.length === 0) return ["release folder has no update manifest"];
  const missing = [];
  for (const name of manifests) {
    const yaml = fs.readFileSync(path.join(releaseDir, name), "utf8");
    for (const url of updateFileUrls(yaml)) {
      if (!names.has(url)) missing.push(`${name} names ${url}, which is not in the release folder`);
    }
  }
  return missing;
}

export function assetsToRemove(assetNames, manifests) {
  const keep = new Set(manifests.map((manifest) => manifest.name));
  for (const manifest of manifests) {
    for (const url of updateFileUrls(manifest.yaml)) {
      keep.add(url);
      keep.add(`${url}.blockmap`);
    }
  }
  return assetNames.filter((name) => !keep.has(name));
}

function runCheck(releaseDir) {
  const missing = missingUpdateFiles(releaseDir);
  if (missing.length === 0) return;
  console.error(missing.join("\n"));
  process.exit(1);
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) runCheck(process.argv[2] || "release");
