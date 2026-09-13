import { useState, useEffect, useCallback } from 'react';
import { WelcomeScreen } from '@/screens/WelcomeScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { NavigateScreen } from '@/screens/NavigateScreen';
import { SafetyScreen } from '@/screens/SafetyScreen';
import { MeScreen } from '@/screens/MeScreen';
import { BottomNav } from '@/components/BottomNav';
import { SOSButton } from '@/components/SOSButton';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { NavTab, Location, IncidentReport, DeliveryStatus, LocationPrecision, SafeSpot } from '@/types';
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

  // SOS state
  const [sosActive, setSosActive] = useState(false);
  const [sosDelivery, setSosDelivery] = useState<DeliveryStatus>('sent');
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
    // Simulate delivery status
    setSosDelivery('queued');
    setTimeout(() => setSosDelivery('sent'), 1500);
  }, []);

  const handleSOSDeactivate = useCallback(() => {
    setSosActive(false);
    setSosDelivery('sent');
  }, []);

  const primaryContact = contacts.find((c) => c.primary) ?? contacts[0];

  if (showWelcome) {
    return <WelcomeScreen onStart={() => setShowWelcome(false)} />;
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
        />
      )}

      {/* SOS button — visible on all main tabs */}
      {!sosActive && <BottomNav active={activeTab} onChange={setActiveTab} nightMode={nightMode} />}
      <SOSButton
        onActivate={handleSOSActivate}
        active={sosActive}
        onDeactivate={handleSOSDeactivate}
        primaryContactName={primaryContact?.name ?? 'your trusted contact'}
        delivery={sosDelivery}
        precision={sosPrecision}
        batteryLevel={batteryLevel}
      />
    </div>
  );
}

export default App;
