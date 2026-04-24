import { describe, expect, it } from 'vitest';
import { calculateDrillingMetrics } from '../src/lib/drilling';
import { calculateTremieMetrics } from '../src/lib/tremie';
import { getTremieDiagramGeometry } from '../src/components/TremieDiagram';

describe('calculateDrillingMetrics', () => {
  it('computes toe progress and status', () => {
    const result = calculateDrillingMetrics({
      pileDiameter: 1.2,
      platformElevation: 12,
      casingTopElevation: 12.8,
      pileTopElevation: 8,
      pileToeElevation: -18,
      currentDepth: 20,
    });

    expect(result.currentBottomElevation).toBe(-8);
    expect(result.designDepth).toBe(30);
    expect(result.drilledDepth).toBe(20);
    expect(result.remainingDepth).toBe(10);
    expect(result.progressPercent).toBeCloseTo(66.67, 2);
    expect(result.status).toBe('drilling');
  });

  it('reports toe reached and over-drilling states', () => {
    expect(
      calculateDrillingMetrics({
        pileDiameter: 1,
        platformElevation: 10,
        casingTopElevation: 10.5,
        pileTopElevation: 7,
        pileToeElevation: -20,
        currentDepth: 30,
      }).status
    ).toBe('toe_reached');

    expect(
      calculateDrillingMetrics({
        pileDiameter: 1,
        platformElevation: 10,
        casingTopElevation: 10.5,
        pileTopElevation: 7,
        pileToeElevation: -20,
        currentDepth: 31,
      }).status
    ).toBe('over_drilled');
  });
});

describe('calculateTremieMetrics', () => {
  it('computes tremie position from platform reference and lift height', () => {
    const result = calculateTremieMetrics({
      pileDiameter: 1.2,
      boreDepth: 32,
      platformElevation: 6,
      tremieSegments: [1, 3, 3, 2, 0.5],
      bottomOffset: 0.4,
      concreteVolume: 18,
      liftHeight: 1.5,
    });

    expect(result.tremieLength).toBe(9.5);
    expect(result.concreteHeight).toBeCloseTo(15.92, 2);
    expect(result.concreteElevation).toBeCloseTo(-10.08, 2);
    expect(result.tremieTopElevation).toBeCloseTo(7.5, 2);
    expect(result.tremieTipDepth).toBeCloseTo(8, 2);
    expect(result.tremieTipElevation).toBeCloseTo(-2, 2);
    expect(result.currentBottomOffset).toBeCloseTo(24, 2);
    expect(result.embedmentDepth).toBeCloseTo(-8.08, 2);
    expect(result.embedmentStatus).toBe('out_of_concrete');
  });

  it('classifies insufficient and too-deep states', () => {
    expect(
      calculateTremieMetrics({
        pileDiameter: 1,
        boreDepth: 20,
        platformElevation: 5,
        tremieSegments: [1, 3, 3, 2, 2],
        bottomOffset: 0.4,
        concreteVolume: 8,
        liftHeight: 0,
      }).embedmentStatus
    ).toBe('insufficient');

    expect(
      calculateTremieMetrics({
        pileDiameter: 1,
        boreDepth: 20,
        platformElevation: 5,
        tremieSegments: [1, 3, 3, 3, 3, 2, 2],
        bottomOffset: 0.4,
        concreteVolume: 8,
        liftHeight: 0,
      }).embedmentStatus
    ).toBe('too_deep');
  });

  it('uses the configured tremie length when drawing the diagram', () => {
    const shortInputs = {
      pileDiameter: 1.2,
      boreDepth: 32,
      platformElevation: 6,
      tremieSegments: [1, 3, 3],
      bottomOffset: 0.4,
      concreteVolume: 18,
      liftHeight: 1.5,
    };
    const longInputs = {
      ...shortInputs,
      tremieSegments: [1, 3, 3, 2, 2],
    };

    const shortGeometry = getTremieDiagramGeometry(shortInputs, calculateTremieMetrics(shortInputs));
    const longGeometry = getTremieDiagramGeometry(longInputs, calculateTremieMetrics(longInputs));

    expect(longGeometry.yTremieTop).toBeCloseTo(shortGeometry.yTremieTop, 2);
    expect(longGeometry.yTip).toBeGreaterThan(shortGeometry.yTip);
  });
});
