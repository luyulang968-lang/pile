import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { test, expect } from 'vitest';
import { AppShell } from '../src/components/AppShell';

test('renders the navigation labels', () => {
  render(
    <MemoryRouter>
      <AppShell>
        <div>内容区域</div>
      </AppShell>
    </MemoryRouter>
  );

  expect(screen.getByText('钻孔桩成孔进度')).toBeInTheDocument();
  expect(screen.getByText('导管提管与混凝土灌注模拟')).toBeInTheDocument();
  expect(screen.getByText('内容区域')).toBeInTheDocument();
});
