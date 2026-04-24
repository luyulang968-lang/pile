import { roundToTwo, sanitizePositiveArray } from './format';

export const tremieDefaults = {
  pileDiameter: 1.2,
  boreDepth: 32,
  platformElevation: 6,
  tremieSegments: [1, 3, 3, 2, 0.5],
  bottomOffset: 0.4,
  concreteVolume: 18,
  liftHeight: 1.5,
};

export function calculateTremieMetrics(input) {
  const tremieSegments = sanitizePositiveArray(input.tremieSegments);
  const pileDiameter = Number(input.pileDiameter) || 0;
  const boreDepth = Number(input.boreDepth) || 0;
  const platformElevation = Number(input.platformElevation) || 0;
  const bottomOffset = Number(input.bottomOffset) || 0;
  const concreteVolume = Number(input.concreteVolume) || 0;
  const liftHeight = Number(input.liftHeight) || 0;
  const radius = pileDiameter / 2;
  const pileArea = Math.PI * radius * radius;
  const concreteHeight = pileArea > 0 ? concreteVolume / pileArea : 0;
  const concreteElevation = platformElevation - boreDepth + concreteHeight;
  const tremieLength = tremieSegments.reduce((sum, item) => sum + item, 0);
  const tremieTopElevation = platformElevation + liftHeight;
  const tremieTipElevation = tremieTopElevation - tremieLength;
  const tremieTipDepth = platformElevation - tremieTipElevation;
  const currentBottomOffset = boreDepth - tremieTipDepth;
  const embedmentDepth = concreteElevation - tremieTipElevation;

  let embedmentStatus = 'acceptable';
  if (embedmentDepth <= 0) {
    embedmentStatus = 'out_of_concrete';
  } else if (embedmentDepth < 2) {
    embedmentStatus = 'insufficient';
  } else if (embedmentDepth > 6) {
    embedmentStatus = 'too_deep';
  }

  return {
    tremieSegments,
    referenceBottomOffset: roundToTwo(bottomOffset),
    tremieLength: roundToTwo(tremieLength),
    concreteHeight: roundToTwo(concreteHeight),
    concreteElevation: roundToTwo(concreteElevation),
    tremieTopElevation: roundToTwo(tremieTopElevation),
    tremieTipDepth: roundToTwo(tremieTipDepth),
    tremieTipElevation: roundToTwo(tremieTipElevation),
    currentBottomOffset: roundToTwo(currentBottomOffset),
    embedmentDepth: roundToTwo(embedmentDepth),
    embedmentStatus,
  };
}
