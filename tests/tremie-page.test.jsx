import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect } from 'vitest';
import { TremiePlacementPage } from '../src/pages/TremiePlacementPage';

test('adds tremie segments and updates embedment status', async () => {
  const user = userEvent.setup();
  render(<TremiePlacementPage />);

  await user.click(screen.getByRole('button', { name: '新增导管节段' }));

  expect(screen.getAllByLabelText(/导管节段长度/)).toHaveLength(6);
  expect(screen.getByText(/Embedment/)).toBeInTheDocument();
});
