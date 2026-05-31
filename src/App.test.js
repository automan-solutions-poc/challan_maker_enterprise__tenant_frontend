import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';

test('renders login page by default', () => {
  render(
    <ThemeProvider>
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    </ThemeProvider>
  );
  const loginElement = screen.getAllByText(/Login/i);
  expect(loginElement.length).toBeGreaterThan(0);
});
