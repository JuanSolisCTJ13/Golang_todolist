import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn((url, options) => {
    if (options?.method === 'POST') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          id: 1,
          text: 'Comprar leche',
          startDate: '2026-06-09',
          endDate: '',
          status: 'todo',
        }),
      });
    }

    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('creates a new task with a POST request', async () => {
  render(<App />);

  const input = await screen.findByPlaceholderText('Nueva tarea...');
  await userEvent.type(input, 'Comprar leche');
  await userEvent.click(screen.getByRole('button', { name: /agregar tarea/i }));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/tasks',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
