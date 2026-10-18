const BACKUP_KEYS = [
  "focus-companion-storage",
  "focus-companion-tasks",
  "focus-companion-settings",
  "focus-companion-achievements-v2",
  "focus-companion-notes",
  "reminder-storage",
  "focus-companion-events",
  "focus-companion-projects",
  "ai-companion-storage",
];

interface BackupFile {
  version: 1;
  exportedAt: string;
  data: Record<string, string>;
}

export function exportBackup() {
  const data: Record<string, string> = {};
  BACKUP_KEYS.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value) data[key] = value;
  });

  const payload: BackupFile = {
    version: 1,
    exportedAt: new Date().toISOString(),
    data,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `orion-companion-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function importBackup(raw: string): { ok: true } | { ok: false; message: string } {
  let parsed: BackupFile;
  try {
    parsed = JSON.parse(raw) as BackupFile;
  } catch {
    return { ok: false, message: "That file is not valid JSON." };
  }

  if (parsed.version !== 1 || !parsed.data || typeof parsed.data !== "object") {
    return { ok: false, message: "That file is not an Orion Companion backup." };
  }

  Object.entries(parsed.data).forEach(([key, value]) => {
    if (!BACKUP_KEYS.includes(key) || typeof value !== "string" || value.length > 1_500_000) return;
    try {
      const stored = JSON.parse(value) as unknown;
      if (!stored || typeof stored !== "object" || Array.isArray(stored)) return;
    } catch {
      return;
    }
    localStorage.setItem(key, value);
  });

  window.location.reload();
  return { ok: true };
}
