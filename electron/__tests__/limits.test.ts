import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { rendererFileForRequest } from "../appProtocol";
import { productionDocumentPolicy } from "../csp";
import { claimInstance, handoffAnswer, parseHandoff } from "../handoff";
import { isAllowedNavigation } from "../navigation";

describe("production page policy", () => {
  it("keeps scripts on this app and leaves inline styles for the components", () => {
    const policy = productionDocumentPolicy(
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
    );
    expect(policy).toContain("script-src 'self'");
    expect(policy).not.toContain("unsafe-eval");
    expect(policy).not.toContain("script-src 'self' 'unsafe-inline'");
    expect(policy).toContain("style-src 'self' 'unsafe-inline'");
  });
});

describe("instance handoff", () => {
  it("replaces a different Orion and keeps the one already open", () => {
    const running = { execPath: "/opt/Orion", version: "1.0.0" };
    expect(handoffAnswer(running, JSON.stringify({ execPath: "/opt/Orion", version: "1.0.1" }))).toBe("bye");
    expect(handoffAnswer(running, JSON.stringify({ execPath: "/tmp/Orion.AppImage", version: "1.0.0" }))).toBe("bye");
    expect(handoffAnswer(running, JSON.stringify(running))).toBe("stay");
    expect(parseHandoff("not json")).toBeNull();
  });

  it("lets a newer launch take the socket and focuses the same launch", async () => {
    const socketPath = path.join(os.tmpdir(), `orion-handoff-${process.pid}.sock`);
    try {
      fs.unlinkSync(socketPath);
    } catch {
      // No previous socket.
    }
    let focused = 0;
    let replaced = 0;
    let closeFirst: (() => Promise<void>) | null = null;
    const first = await claimInstance({
      socketPath,
      platform: "linux",
      incoming: { execPath: "/opt/Orion", version: "1.0.0" },
      onFocus: () => {
        focused += 1;
      },
      onReplace: () => {
        replaced += 1;
        void closeFirst?.();
      },
      onOwned: (close) => {
        closeFirst = close;
      },
    });
    expect(first).toBe("owner");

    const same = await claimInstance({
      socketPath,
      platform: "linux",
      incoming: { execPath: "/opt/Orion", version: "1.0.0" },
      onFocus: () => {},
      onReplace: () => {},
    });
    expect(same).toBe("visible");
    expect(focused).toBe(1);

    const closers: Array<() => Promise<void>> = [];
    const newer = await claimInstance({
      socketPath,
      platform: "linux",
      incoming: { execPath: "/opt/Orion", version: "1.0.1" },
      onFocus: () => {},
      onReplace: () => {},
      onOwned: (close) => {
        closers.push(close);
      },
    });
    expect(newer).toBe("owner");
    expect(replaced).toBe(1);
    await closers[0]?.();
  });
});

describe("packaged navigation", () => {
  const root = path.resolve("/tmp/orion-dist");

  it("allows the app origin and blocks a different one", () => {
    expect(isAllowedNavigation("app://orion/app", root)).toBe(true);
    expect(isAllowedNavigation("app://orion/assets/index.js", root)).toBe(true);
    expect(isAllowedNavigation("app://other/app", root)).toBe(false);
    expect(rendererFileForRequest(root, "app://orion/assets/index.js")).toBe(path.join(root, "assets", "index.js"));
    expect(rendererFileForRequest(root, "app://orion/../../etc/passwd")).toBeNull();
  });
});
