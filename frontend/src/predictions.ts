export type Prediction = { timestampMs: number; activity: string; confidence: number; receivedAt: Date };

export function parsePrediction(line: string): Prediction | null {
  const match = /^# pred t=(\d+) class=([^\s]+) p=(\d+(?:\.\d+)?)\s*$/.exec(line.trim());
  if (!match) return null;
  const timestampMs = Number(match[1]);
  const confidence = Number(match[3]);
  if (!Number.isSafeInteger(timestampMs) || confidence < 0 || confidence > 1) return null;
  return { timestampMs, activity: match[2], confidence, receivedAt: new Date() };
}

