import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { AtmosphericTelemetry } from './components/AtmosphericTelemetry';
import { DailyRoutineOptimizer } from './components/DailyRoutineOptimizer';
import { IAQLab } from './components/IAQLab';
import { ImpactDashboard } from './components/ImpactDashboard';
import { GenAIAssistant } from './components/GenAIAssistant';
import { ApiKeyModal } from './components/ApiKeyModal';
import { HouseholdProfilerModal } from './components/HouseholdProfiler';
import { OnboardingFlow } from './components/OnboardingFlow';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('telemetry');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const { apiKey, setApiKey, hasCompletedOnboarding, completeOnboarding } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-aeris-bg text-aeris-body selection:bg-aeris-accent/20 selection:text-aeris-heading">
      {/* Skip to Main Content Link for Accessibility */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 z-50 px-4 py-2 bg-aeris-accent text-aeris-bg font-semibold rounded-full shadow-lg text-xs"
      >
        Skip to main content
      </a>

      {/* Responsive Top Bar with Desktop Nav + Mobile Status */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area - Expands gracefully on desktop (max-w-6xl) while staying snug on mobile */}
      <main id="main-content" className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-5 pb-24 md:pb-8" role="main">
        {activeTab === 'telemetry' && <AtmosphericTelemetry />}
        {activeTab === 'routines' && <DailyRoutineOptimizer />}
        {activeTab === 'iaq' && <IAQLab />}
        {activeTab === 'impact' && <ImpactDashboard />}
        {activeTab === 'assistant' && <GenAIAssistant />}
      </main>

      {/* Mobile Bottom Navigation Bar (Hidden on desktop) */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modals */}
      <OnboardingFlow
        isOpen={!hasCompletedOnboarding}
        onComplete={completeOnboarding}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveKey={setApiKey}
      />

      <HouseholdProfilerModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
