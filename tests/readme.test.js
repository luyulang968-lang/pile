import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, test } from 'vitest';

test('readme documents GitHub Pages and Firebase extension', () => {
  const readmePath = path.resolve(process.cwd(), 'README.md');
  const readme = readFileSync(readmePath, 'utf8');
  expect(readme).toContain('GitHub Pages');
  expect(readme).toContain('Firebase Realtime Database');
});
