import { useState, useEffect, useCallback } from 'react';
import { WelcomeScreen } from '@/screens/WelcomeScreen';
import { Onboarding } from '@/components/Onboarding';
import { HomeScreen } from '@/screens/HomeScreen';
import { NavigateScreen } from '@/screens/NavigateScreen';
import { SafetyScreen } from '@/screens/SafetyScreen';
import { MeScreen } from '@/screens/MeScreen';
import { BottomNav } from '@/components/BottomNav';
import { SOSButton, type ContactDelivery } from '@/components/SOSButton';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { NavTab, Location, IncidentReport, DeliveryStatus, LocationPrecision, SafeSpot, TrustedContact } from '@/types';
import { trustedContacts, routes, safeSpots, currentLocation } from '@/data/mockData';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [destination, setDestination] = useState<Location | null>(null);
  const [nightMode, setNightMode] = useLocalStorage<boolean>('veya-night', false);
  const [offline, setOffline] = useLocalStorage<boolean>('veya-offline', false);
  const [batteryLevel, setBatteryLevel] = useLocalStorage<number>('veya-battery', 45);
  const [incidents, setIncidents] = useLocalStorage<IncidentReport[]>('veya-incidents', []);
  const [savedSpots, setSavedSpots] = useLocalStorage<SafeSpot[]>('veya-saved-spots', []);
  const [contacts, setContacts] = useLocalStorage('veya-contacts', trustedContacts);
  const [userName] = useLocalStorage<string>('veya-username', 'Girl');
  const [onboardingDone, setOnboardingDone] = useLocalStorage<boolean>('veya-onboarding-done', false);

  // SOS state
  const [sosActive, setSosActive] = useState(false);
  const [sosDeliveries, setSosDeliveries] = useState<ContactDelivery[]>([]);
  const [sosPrecision, setSosPrecision] = useState<LocationPrecision>('precise');

  // Cache route/risk/safe-spot data for offline use
  useEffect(() => {
    if (!offline) return;
    const cached = { routes, safeSpots, currentLocation, timestamp: Date.now() };
    try {
      localStorage.setItem('veya-cached-map', JSON.stringify(cached));
    } catch {
      // storage full
    }
  }, [offline]);

  const handleSelectDestination = (dest: Location) => {
    setDestination(dest);
  };

  const handleReportIncident = (report: IncidentReport) => {
    setIncidents([...incidents, report]);
  };

  const handleSOSActivate = useCallback(() => {
    setSosActive(true);
    const initial: ContactDelivery[] = contacts.map((c) => ({ contactId: c.id, status: 'queued' as DeliveryStatus }));
    setSosDeliveries(initial);
    contacts.forEach((c, i) => {
      setTimeout(() => {
        setSosDeliveries((prev) => prev.map((d) => d.contactId === c.id ? { ...d, status: 'sent' as DeliveryStatus } : d));
      }, 1000 + i * 500);
    });
  }, [contacts]);

  const handleSOSDeactivate = useCallback(() => {
    setSosActive(false);
    setSosDeliveries([]);
  }, []);

  const handleSOSBackHome = useCallback(() => {
    setSosActive(false);
    setSosDeliveries([]);
    setActiveTab('home');
  }, []);

  if (showWelcome) {
    return <WelcomeScreen onStart={() => setShowWelcome(false)} />;
  }

  if (!onboardingDone) {
    return <Onboarding onComplete={() => setOnboardingDone(true)} />;
  }

  return (
    <div className={`min-h-screen ${nightMode ? 'bg-[#050508]' : 'bg-veya-bg'}`}>
      {activeTab === 'home' && (
        <HomeScreen
          onNavigate={() => setActiveTab('navigate')}
          nightMode={nightMode}
          onToggleNight={setNightMode}
          offline={offline}
          onToggleOffline={setOffline}
          batteryLevel={batteryLevel}
          onSelectDestination={handleSelectDestination}
          cachedRoutes={null}
          userName={userName}
        />
      )}

      {activeTab === 'navigate' && (
        <NavigateScreen
          destination={destination}
          nightMode={nightMode}
          offline={offline}
          onToggleOffline={setOffline}
          batteryLevel={batteryLevel}
          incidents={incidents}
          onReportIncident={handleReportIncident}
          onBack={() => setActiveTab('home')}
        />
      )}

      {activeTab === 'safety' && (
        <SafetyScreen
          offline={offline}
          savedSpots={savedSpots}
          onSaveSpots={setSavedSpots}
          onSOS={handleSOSActivate}
        />
      )}

      {activeTab === 'me' && (
        <MeScreen
          nightMode={nightMode}
          onToggleNight={setNightMode}
          offline={offline}
          onToggleOffline={setOffline}
          batteryLevel={batteryLevel}
          onSetBattery={setBatteryLevel}
          userName={userName}
        />
      )}

      {/* SOS button — visible on all main tabs */}
      {!sosActive && <BottomNav active={activeTab} onChange={setActiveTab} nightMode={nightMode} />}
      <SOSButton
        onActivate={handleSOSActivate}
        active={sosActive}
        onDeactivate={handleSOSDeactivate}
        onBackHome={handleSOSBackHome}
        contacts={contacts as TrustedContact[]}
        deliveries={sosDeliveries}
        precision={sosPrecision}
        batteryLevel={batteryLevel}
        locationName={`${currentLocation.name}, ${currentLocation.area}`}
      />
    </div>
  );
}

export default App;
