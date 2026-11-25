import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider } from '../context/AppContext';
import { AtmosphericTelemetry } from '../components/AtmosphericTelemetry';
import { HouseholdProfilerModal } from '../components/HouseholdProfiler';
import { ApiKeyModal } from '../components/ApiKeyModal';
import { BottomNav } from '../components/BottomNav';

describe('AERIS Navigation, Profile & Telemetry Components', () => {
  it('renders AtmosphericTelemetry with inversion mixing height and weather dynamics', () => {
    render(
      <AppProvider>
        <AtmosphericTelemetry />
      </AppProvider>
    );

    expect(screen.getByText(/At a Glance for Your Family/i)).toBeInTheDocument();
    expect(screen.getByText(/Hourly Smog Guide/i)).toBeInTheDocument();
    expect(screen.getByText(/Why is Smog Trapped Near the Ground\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Temperature/i)).toBeInTheDocument();
  });

  it('renders and updates HouseholdProfilerModal inputs', () => {
    const handleClose = vi.fn();
    render(
      <AppProvider>
        <HouseholdProfilerModal isOpen={true} onClose={handleClose} />
      </AppProvider>
    );

    expect(screen.getByText(/Household & Family Protection Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/1-Tap Quick Setups/i)).toBeInTheDocument();

    const doneBtn = screen.getByRole('button', { name: /Done/i });
    fireEvent.click(doneBtn);
    expect(handleClose).toHaveBeenCalled();
  });

  it('renders ApiKeyModal and handles key inputs and close events', () => {
    const handleClose = vi.fn();
    const handleSave = vi.fn();

    render(
      <ApiKeyModal
        isOpen={true}
        onClose={handleClose}
        apiKey=""
        onSaveKey={handleSave}
      />
    );

    expect(screen.getByText(/Google Gemini API Configuration/i)).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/AQ\.Ab8R\.\.\. or AIzaSy\.\.\./i);
    fireEvent.change(input, { target: { value: 'AQ.TestKey12345' } });

    const saveBtn = screen.getByRole('button', { name: /Save Key/i });
    fireEvent.click(saveBtn);
    expect(handleSave).toHaveBeenCalledWith('AQ.TestKey12345');
  });

  it('renders BottomNav and allows tab switching', () => {
    const handleSelectTab = vi.fn();

    render(
      <BottomNav activeTab="telemetry" setActiveTab={handleSelectTab} />
    );

    const planBtn = screen.getByRole('button', { name: /Daily Plan/i });
    fireEvent.click(planBtn);
    expect(handleSelectTab).toHaveBeenCalledWith('routines');
  });
});
