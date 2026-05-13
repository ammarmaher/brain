/*** Smoke test - shell renders, sidebar has 10 nav links ***/
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppShell from '../components/layout/AppShell';
import { routeMap } from '../routes';

function renderShell() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppShell>
          <div data-testid="content">hello</div>
        </AppShell>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('AppShell smoke', () => {
  it('renders shell scaffolding', () => {
    renderShell();
    expect(screen.getByTestId('app-shell')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('app-main')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toHaveTextContent('hello');
  });

  it('sidebar exposes 10 navigation links (9 domains + Settings)', () => {
    renderShell();
    const sidebar = screen.getByTestId('sidebar');
    const links = within(sidebar).getAllByRole('link');
    expect(links).toHaveLength(10);
    const labels = links.map((a) => a.textContent?.trim());
    for (const r of routeMap) {
      expect(labels).toContain(r.label);
    }
  });

  it('route map covers exactly 10 screens', () => {
    expect(routeMap).toHaveLength(10);
  });
});
