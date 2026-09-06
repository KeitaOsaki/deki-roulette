import { MAX_LABEL_LENGTH } from "./config";
import type { Item } from "./types";

export function createId() {
  // randomUUID は secure context 限定なので、http 経由のプレビュー用に退避先を持つ
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function normalizeLabel(raw: string) {
  return raw.replace(/\s+/g, " ").trim().slice(0, MAX_LABEL_LENGTH);
}

export function makeItems(labels: readonly string[]): Item[] {
  return labels.map((label) => ({ id: createId(), label }));
}
