import { describe, expect, it } from "vitest";
import { safeNoteImage, safeNoteLink } from "../safeUrl";

describe("safe note urls", () => {
  it("keeps ordinary web and mail links", () => {
    expect(safeNoteLink("https://example.com/notes")).toBe("https://example.com/notes");
    expect(safeNoteLink("mailto:me@example.com")).toBe("mailto:me@example.com");
  });

  it("drops script, file, and remote image addresses", () => {
    expect(safeNoteLink("javascript:alert(1)")).toBeUndefined();
    expect(safeNoteLink("file:///etc/passwd")).toBeUndefined();
    expect(safeNoteImage("https://example.com/pixel.png")).toBeUndefined();
    expect(safeNoteImage("file:///etc/passwd")).toBeUndefined();
    expect(safeNoteImage("data:image/svg+xml;base64,PHN2Zy8+")).toBeUndefined();
  });

  it("keeps a local image embedded in the note", () => {
    expect(safeNoteImage("data:image/png;base64,aaaa")).toBe("data:image/png;base64,aaaa");
  });
});
