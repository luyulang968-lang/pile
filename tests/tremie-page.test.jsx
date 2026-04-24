import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect } from 'vitest';
import { TremiePlacementPage } from '../src/pages/TremiePlacementPage';

test('adds tremie segments and updates the displayed tremie length', async () => {
  const user = userEvent.setup();
  render(<TremiePlacementPage />);

  await user.click(screen.getByRole('button', { name: '新增导管节段' }));

  expect(screen.getAllByLabelText(/导管节段长度/)).toHaveLength(6);
  expect(screen.getByText('10.50 m')).toBeInTheDocument();
});

test('pull operation raises the tremie and updates lift height', async () => {
  const user = userEvent.setup();
  render(<TremiePlacementPage />);

  const [liftHeightInput] = screen.getAllByLabelText('提管高度 (m)');
  expect(liftHeightInput).toHaveValue('1.5');

  const [pullButton] = screen.getAllByRole('button', { name: '提管 1.0 m' });
  await user.click(pullButton);

  expect(liftHeightInput).toHaveValue('2.50');
});

test('changing tremie length updates the tip elevation metric', async () => {
  const user = userEvent.setup();
  render(<TremiePlacementPage />);

  const [firstSegmentInput] = screen.getAllByLabelText('导管节段长度 1 (m)');
  expect(screen.getAllByText('-2.00 m')[0]).toBeInTheDocument();

  await user.clear(firstSegmentInput);
  await user.type(firstSegmentInput, '2');

  expect(screen.getAllByText('-1.00 m')[0]).toBeInTheDocument();
});
