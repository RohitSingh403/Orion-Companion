import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { assetsToRemove, missingUpdateFiles, updateFileUrls } from "../../scripts/check-update-names.mjs";

describe("update file names", () => {
  it("reads the file urls from an update manifest", () => {
    const yaml = "files:\n  - url: Orion-Companion-1.0.2-x64.exe\n    sha512: abc\npath: Orion-Companion-1.0.2-x64.exe\n";
    expect(updateFileUrls(yaml)).toEqual(["Orion-Companion-1.0.2-x64.exe"]);
  });

  it("requires every named update file to sit in the release folder", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "orion-release-"));
    fs.writeFileSync(path.join(dir, "latest.yml"), "files:\n  - url: Orion-Companion-1.0.2-x64.exe\n");
    expect(missingUpdateFiles(dir)).toEqual([
      "latest.yml names Orion-Companion-1.0.2-x64.exe, which is not in the release folder",
    ]);
    fs.writeFileSync(path.join(dir, "Orion-Companion-1.0.2-x64.exe"), "");
    expect(missingUpdateFiles(dir)).toEqual([]);
  });

  it("keeps the manifest, the packages it names, and their blockmaps", () => {
    const remove = assetsToRemove(
      [
        "latest.yml",
        "Orion-Companion-1.0.2-x64.exe",
        "Orion-Companion-1.0.2-x64.exe.blockmap",
        "Orion.Companion.Setup.1.0.1.exe",
      ],
      [{ name: "latest.yml", yaml: "files:\n  - url: Orion-Companion-1.0.2-x64.exe\n" }]
    );
    expect(remove).toEqual(["Orion.Companion.Setup.1.0.1.exe"]);
  });

  it("uses a GitHub-safe installer name in the build config", () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
      build: { artifactName: string };
    };
    expect(pkg.build.artifactName).toBe("Orion-Companion-${version}-${arch}.${ext}");
    expect(pkg.build.artifactName.includes(" ")).toBe(false);
  });
});
