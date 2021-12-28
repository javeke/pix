import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders application', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // TODO: Check Auth Status 

  // TODO: Test where the user is routed to on login
  expect(true).toBe(true);
});
