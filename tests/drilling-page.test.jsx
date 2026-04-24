import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect } from 'vitest';
import { DrillingProgressPage } from '../src/pages/DrillingProgressPage';

test('updates drilling results when depth changes', async () => {
  const user = userEvent.setup();
  render(<DrillingProgressPage />);

  const depthInput = screen.getByLabelText('当前实测孔深 (m)');
  await user.click(depthInput);
  await user.keyboard('{Control>}a{/Control}30');

  expect(screen.getByText('Reached design toe level')).toBeInTheDocument();
  expect(screen.getByText('100.00%')).toBeInTheDocument();
});
