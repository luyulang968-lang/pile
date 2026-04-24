import { describe, expect, it } from 'vitest';
import { getRouteDefinitions } from '../src/router';

describe('router setup', () => {
  it('defines both engineering pages', () => {
    const routes = getRouteDefinitions();
    const childPaths = routes[0].children.map((route) => route.path ?? '/');
    expect(childPaths).toContain('/');
    expect(childPaths).toContain('/drilling-progress');
    expect(childPaths).toContain('/tremie-placement');
  });
});
