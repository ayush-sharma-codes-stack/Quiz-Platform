import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { XPProgressBar } from '../components/XPProgressBar';

describe('XPProgressBar Component', () => {
  it('renders level correctly', () => {
    const { container } = render(
      <XPProgressBar xp={120} level={2} progressPercentage={50} showDetails={true} />
    );

    expect(container.textContent).toContain('L2');
  });

  it('renders XP text when showDetails is true', () => {
    render(<XPProgressBar xp={120} level={2} progressPercentage={50} showDetails={true} />);

    expect(screen.getByText(/120/i)).toBeInTheDocument();
  });
});
