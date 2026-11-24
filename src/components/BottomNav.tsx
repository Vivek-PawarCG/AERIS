import React from 'react';
import { 
  Wind, 
  CalendarCheck, 
  Sparkles, 
  HeartHandshake, 
  MessageSquare
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'telemetry', label: 'Air Today', icon: Wind },
    { id: 'routines', label: 'Daily Plan', icon: CalendarCheck },
    { id: 'iaq', label: 'Home Hacks', icon: Sparkles },
    { id: 'impact', label: 'Impact', icon: HeartHandshake },
    { id: 'assistant', label: 'AI Helper', icon: MessageSquare },
  ];

  return (
    /* Displayed strictly on mobile/tablet viewports; hidden on desktop where Header nav takes over */
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-aeris-surface/95 border-t border-aeris-border backdrop-blur-md px-2 py-1"
      aria-label="Mobile Navigation Bar"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex-1 py-1.5 px-1 flex flex-col items-center justify-center rounded transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aeris-accent ${
                isActive 
                  ? 'text-aeris-accent font-semibold' 
                  : 'text-aeris-muted hover:text-aeris-heading active:scale-95'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={`p-1 rounded-full transition-colors ${isActive ? 'bg-aeris-accent/15' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-aeris-accent' : 'text-aeris-muted'}`} />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight font-medium">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
