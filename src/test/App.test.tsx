import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../App';

describe('AERIS Responsive Application Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('aeris_onboarding_completed', 'true');
  });

  it('renders both desktop navigation and mobile bottom bar', () => {
    render(<App />);
    const desktopNav = screen.getByRole('navigation', { name: /Desktop Main Navigation/i });
    const mobileNav = screen.getByRole('navigation', { name: /Mobile Navigation Bar/i });

    expect(desktopNav).toBeInTheDocument();
    expect(mobileNav).toBeInTheDocument();

    expect(within(desktopNav).getByRole('button', { name: /Air Today/i })).toBeInTheDocument();
    expect(within(mobileNav).getByRole('button', { name: /Air Today/i })).toBeInTheDocument();
  });

  it('displays the Air Today view initially with family recommendations', () => {
    render(<App />);
    expect(screen.getByText(/At a Glance for Your Family/i)).toBeInTheDocument();
    expect(screen.getByText(/Hourly Smog Guide/i)).toBeInTheDocument();
    expect(screen.getByText(/Why is Smog Trapped Near the Ground\?/i)).toBeInTheDocument();
  });

  it('allows navigating across main views via desktop tabs', () => {
    render(<App />);
    const desktopNav = screen.getByRole('navigation', { name: /Desktop Main Navigation/i });

    // Click Daily Plan tab
    const planTab = within(desktopNav).getByRole('button', { name: /Daily Plan/i });
    fireEvent.click(planTab);
    expect(screen.getByText(/Today's Clean Air Schedule/i)).toBeInTheDocument();

    // Click Home Hacks tab
    const hacksTab = within(desktopNav).getByRole('button', { name: /Home Hacks/i });
    fireEvent.click(hacksTab);
    expect(screen.getByText(/Keep Indoor Air Pure & Safe/i)).toBeInTheDocument();
    expect(screen.getByText(/Build a \$60 Super Clean Air Box/i)).toBeInTheDocument();

    // Click Impact tab
    const impactTab = within(desktopNav).getByRole('button', { name: /Impact/i });
    fireEvent.click(impactTab);
    expect(screen.getByText(/Clean Air Breathing Tracker/i)).toBeInTheDocument();

    // Click AI Helper tab
    const helperTab = within(desktopNav).getByRole('button', { name: /AI Helper/i });
    fireEvent.click(helperTab);
    expect(screen.getByText(/AI Clean Air Helper/i)).toBeInTheDocument();
  });

  it('opens and closes the Household Profiler modal from the top bar', () => {
    render(<App />);

    const profileBtn = screen.getByRole('button', { name: /Household Profile Settings/i });
    fireEvent.click(profileBtn);

    expect(screen.getByText(/Household & Family Protection Profile/i)).toBeInTheDocument();

    const doneBtn = screen.getByRole('button', { name: /Done/i });
    fireEvent.click(doneBtn);

    expect(screen.queryByText(/Household & Family Protection Profile/i)).not.toBeInTheDocument();
  });

  it('shows beginner onboarding tutorial for first-time visitors and completes setup', async () => {
    localStorage.removeItem('aeris_onboarding_completed');
    render(<App />);

    // Step 1: Welcome & Smog Trap
    expect(screen.getByText(/Welcome to AERIS/i)).toBeInTheDocument();
    expect(screen.getByText(/Why Winter Smog is Different/i)).toBeInTheDocument();

    const nextBtn = screen.getByRole('button', { name: /Set Up Your Location/i });
    fireEvent.click(nextBtn);

    // Step 2: Location
    expect(screen.getByText(/Where Does Your Family Live\?/i)).toBeInTheDocument();
    const cityInput = screen.getByPlaceholderText(/e\.g\. New Delhi, Salt Lake City/i);
    fireEvent.change(cityInput, { target: { value: 'London' } });
    const searchBtn = screen.getByRole('button', { name: /Search/i });
    fireEvent.click(searchBtn);

    // Click Next to Family Setup
    const toFamilyBtn = screen.getByRole('button', { name: /Next: Family Setup/i });
    fireEvent.click(toFamilyBtn);

    // Step 3: Family preset
    expect(screen.getByText(/Who Are We Protecting\?/i)).toBeInTheDocument();
    const familyPresetBtn = screen.getByText(/Young Family with Kids/i);
    fireEvent.click(familyPresetBtn);

    // Step 4: Completion
    expect(screen.getByText(/Your Live Clean Air System is Ready/i)).toBeInTheDocument();
    const enterBtn = screen.getByRole('button', { name: /Enter My Live Dashboard/i });
    fireEvent.click(enterBtn);

    // Wizard is now dismissed and dashboard is visible
    expect(screen.queryByText(/Welcome to AERIS/i)).not.toBeInTheDocument();
    expect(screen.getByText(/At a Glance for Your Family/i)).toBeInTheDocument();
  });
});
