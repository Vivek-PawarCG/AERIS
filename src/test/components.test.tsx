import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider } from '../context/AppContext';
import { IAQLab } from '../components/IAQLab';
import { DailyRoutineOptimizer } from '../components/DailyRoutineOptimizer';
import { ImpactDashboard } from '../components/ImpactDashboard';

describe('AERIS Core Domain Components', () => {
  it('renders IAQLab with Corsi-Rosenthal calculator and allows adjusting room size', () => {
    render(
      <AppProvider>
        <IAQLab />
      </AppProvider>
    );

    expect(screen.getByText(/Keep Indoor Air Pure & Safe/i)).toBeInTheDocument();
    expect(screen.getByText(/Build a \$60 Super Clean Air Box/i)).toBeInTheDocument();

    const livingRoomBtn = screen.getByRole('button', { name: /Living & Dining Hall/i });
    expect(livingRoomBtn).toBeInTheDocument();
    fireEvent.click(livingRoomBtn);
  });

  it('renders DailyRoutineOptimizer and toggles full plan adoption', () => {
    render(
      <AppProvider>
        <DailyRoutineOptimizer />
      </AppProvider>
    );

    expect(screen.getByText(/Today's Clean Air Schedule/i)).toBeInTheDocument();
    expect(screen.getByText(/Morning Commute & School Transit/i)).toBeInTheDocument();

    const adoptBtn = screen.getByRole('button', { name: /Adopt/i });
    expect(adoptBtn).toBeInTheDocument();
    fireEvent.click(adoptBtn);
  });

  it('renders ImpactDashboard with clean air breathing statistics', () => {
    render(
      <AppProvider>
        <ImpactDashboard />
      </AppProvider>
    );

    expect(screen.getByText(/Clean Air Breathing Tracker/i)).toBeInTheDocument();
    expect(screen.getByText(/Smog Dust Avoided/i)).toBeInTheDocument();
    expect(screen.getByText(/Clean Air Breathed/i)).toBeInTheDocument();
  });
});
