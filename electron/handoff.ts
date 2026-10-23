import fs from "node:fs";
import net from "node:net";
import path from "node:path";

export interface HandoffRequest {
  execPath: string;
  version: string;
}

export function handoffSocketPath(userData: string, platform: NodeJS.Platform) {
  if (platform === "win32") return "\\\\.\\pipe\\orion-companion-handoff";
  return path.join(userData, "orion-handoff.sock");
}

export function encodeHandoff(request: HandoffRequest) {
  return `${JSON.stringify({
    execPath: request.execPath.slice(0, 400),
    version: request.version.slice(0, 40),
  })}\n`;
}

export function parseHandoff(raw: string): HandoffRequest | null {
  const text = raw.trim().slice(0, 500);
  if (!text) return null;
  try {
    const value = JSON.parse(text) as { execPath?: unknown; version?: unknown };
    if (typeof value.execPath !== "string" || typeof value.version !== "string") return null;
    const execPath = value.execPath.trim();
    const version = value.version.trim();
    if (!execPath || !version) return null;
    return { execPath, version };
  } catch {
    return null;
  }
}

export function handoffAnswer(running: HandoffRequest, raw: string) {
  const incoming = parseHandoff(raw);
  if (!incoming) return "stay" as const;
  if (incoming.execPath !== running.execPath || incoming.version !== running.version) return "bye" as const;
  return "stay" as const;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function claimInstance(options: {
  socketPath: string;
  platform: NodeJS.Platform;
  incoming: HandoffRequest;
  onReplace: () => void;
  onFocus: () => void;
  onOwned?: (close: () => Promise<void>) => void;
}): Promise<"owner" | "visible" | "blocked"> {
  if (options.platform !== "win32") fs.mkdirSync(path.dirname(options.socketPath), { recursive: true });
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const server = await listen(options);
    if (server) {
      options.onOwned?.(() => closeServer(server, options.socketPath, options.platform));
      return "owner";
    }
    const answer = await requestHandoff(options.socketPath, options.incoming);
    if (answer === "stay") return "visible";
    if (answer === "absent" && options.platform !== "win32") {
      try {
        fs.unlinkSync(options.socketPath);
      } catch {
        // The running app still holds the socket.
      }
    }
    await delay(250);
  }
  return "blocked";
}

function listen(options: {
  socketPath: string;
  platform: NodeJS.Platform;
  incoming: HandoffRequest;
  onReplace: () => void;
  onFocus: () => void;
}) {
  return new Promise<net.Server | null>((resolve) => {
    const server = net.createServer((socket) => {
      let raw = "";
      socket.on("data", (chunk) => {
        raw += chunk.toString("utf8");
        if (!raw.includes("\n") && raw.length < 600) return;
        const answer = handoffAnswer(options.incoming, raw.slice(0, 600));
        socket.end(answer, () => {
          if (answer === "bye") options.onReplace();
          else options.onFocus();
        });
      });
    });
    const fail = (error: NodeJS.ErrnoException) => {
      server.close();
      resolve(error.code === "EADDRINUSE" ? null : null);
    };
    server.once("error", fail);
    server.listen(options.socketPath, () => {
      server.off("error", fail);
      if (options.platform !== "win32") {
        try {
          fs.chmodSync(options.socketPath, 0o600);
        } catch {
          // The socket still accepts the local handoff.
        }
      }
      resolve(server);
    });
  });
}

function requestHandoff(socketPath: string, incoming: HandoffRequest) {
  return new Promise<"stay" | "bye" | "absent">((resolve) => {
    const socket = net.connect(socketPath);
    let answer = "";
    let settled = false;
    const finish = (value: "stay" | "bye" | "absent") => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      socket.destroy();
      resolve(value);
    };
    const timer = setTimeout(() => finish("absent"), 1500);
    socket.on("connect", () => socket.end(encodeHandoff(incoming)));
    socket.on("data", (chunk) => {
      answer += chunk.toString("utf8");
    });
    socket.on("close", () => finish(answer.includes("bye") ? "bye" : answer.includes("stay") ? "stay" : "absent"));
    socket.on("error", () => finish("absent"));
  });
}

function closeServer(server: net.Server, socketPath: string, platform: NodeJS.Platform) {
  return new Promise<void>((resolve) => {
    server.close(() => {
      if (platform !== "win32") {
        try {
          fs.unlinkSync(socketPath);
        } catch {
          // Already removed.
        }
      }
      resolve();
    });
  });
}
