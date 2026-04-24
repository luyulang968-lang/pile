import { roundToTwo } from './format';

export const drillingDefaults = {
  pileDiameter: 1.2,
  platformElevation: 12,
  casingTopElevation: 12.8,
  pileTopElevation: 8,
  pileToeElevation: -18,
  currentDepth: 20,
};

export function calculateDrillingMetrics(input) {
  const platformElevation = Number(input.platformElevation) || 0;
  const pileToeElevation = Number(input.pileToeElevation) || 0;
  const designDepth = Math.max(platformElevation - pileToeElevation, 0);
  const drilledDepth = Math.max(Number(input.currentDepth) || 0, 0);
  const remainingDepth = Math.max(designDepth - drilledDepth, 0);
  const currentBottomElevation = platformElevation - drilledDepth;
  const progressPercent = designDepth > 0 ? Math.min((drilledDepth / designDepth) * 100, 999) : 0;

  let status = 'drilling';
  if (drilledDepth > designDepth) {
    status = 'over_drilled';
  } else if (Math.abs(drilledDepth - designDepth) < 0.0001) {
    status = 'toe_reached';
  }

  return {
    currentBottomElevation: roundToTwo(currentBottomElevation),
    designDepth: roundToTwo(designDepth),
    drilledDepth: roundToTwo(drilledDepth),
    remainingDepth: roundToTwo(remainingDepth),
    progressPercent: roundToTwo(progressPercent),
    status,
  };
}
