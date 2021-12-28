import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';
import Login from './Login';

test('renders login page', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const signInBtn = screen.getByText(/Sign in with Google/i);
  expect(signInBtn).toBeInTheDocument();
});
