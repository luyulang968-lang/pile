export function roundToTwo(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }

  return Math.round(numeric * 100) / 100;
}

export function formatNumber(value) {
  return roundToTwo(value).toFixed(2);
}

export function sanitizePositiveArray(values, fallback = [1, 3, 3, 2, 0.5]) {
  const cleaned = values
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item) && item > 0);

  return cleaned.length > 0 ? cleaned : fallback;
}
