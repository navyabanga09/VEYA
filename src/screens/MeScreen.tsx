import { useState, useMemo } from 'react';
import { User, Plus, MapPin, Heart, Check, Trash2, Camera, Battery, Settings, Shield, Moon, WifiOff, X } from 'lucide-react';
import { trustedContacts } from '@/data/mockData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useHaptic } from '@/hooks/useHaptic';
import { Toggle } from '@/components/Toggle';
import type { TrustedContact, EvidenceItem } from '@/types';

interface MeScreenProps {
  nightMode: boolean;
  onToggleNight: (v: boolean) => void;
  offline: boolean;
  onToggleOffline: (v: boolean) => void;
  batteryLevel: number;
  onSetBattery: (v: number) => void;
  userName: string;
}

export function MeScreen({ nightMode, onToggleNight, offline, onToggleOffline, batteryLevel, onSetBattery, userName }: MeScreenProps) {
  const [contacts, setContacts] = useLocalStorage<TrustedContact[]>('veya-contacts', trustedContacts);
  const [evidence, setEvidence] = useLocalStorage<EvidenceItem[]>('veya-evidence', []);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [noteText, setNoteText] = useState('');
  const [imSafeToast, setImSafeToast] = useState(false);
  const [sharing, setSharing] = useState(false);
  const haptic = useHaptic();

  const primaryContact = contacts.find((c) => c.primary) ?? contacts[0];

  const handleAddContact = () => {
    if (!newName.trim()) return;
    const newContact: TrustedContact = {
      id: `c-${Date.now()}`,
      name: newName.trim(),
      phone: newPhone.trim() || '+91 98xxx xxxxx',
      primary: false,
      avatar: newName.trim()[0].toUpperCase(),
    };
    setContacts([...contacts, newContact]);
    setNewName('');
    setNewPhone('');
    setAddContactOpen(false);
    haptic('success');
  };

  const handleSetPrimary = (id: string) => {
    setContacts(contacts.map((c) => ({ ...c, primary: c.id === id })));
    haptic('light');
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
    haptic('warning');
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    const item: EvidenceItem = {
      id: `ev-${Date.now()}`,
      type: 'note',
      text: noteText.trim(),
      timestamp: Date.now(),
    };
    setEvidence([item, ...evidence]);
    setNoteText('');
    haptic('success');
  };

  const handleAddPhoto = () => {
    const item: EvidenceItem = {
      id: `ev-${Date.now()}`,
      type: 'photo',
      text: 'Photo captured',
      photoData: '',
      timestamp: Date.now(),
    };
    setEvidence([item, ...evidence]);
    haptic('success');
  };

  const handleDeleteEvidence = (id: string) => {
    setEvidence(evidence.filter((e) => e.id !== id));
    haptic('warning');
  };

  const handleImSafe = () => {
    setImSafeToast(true);
    haptic('success');
    setTimeout(() => setImSafeToast(false), 2500);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-veya-bg pb-24 safe-top">
      <div className="sticky top-0 z-20 glass border-b border-veya-border px-5 py-4">
        <h1 className="text-xl font-extrabold font-display">Me</h1>
        <p className="text-xs text-veya-text-dim">Your circle, evidence & settings</p>
      </div>

      {/* Profile */}
      <div className="px-5 mt-4">
        <div className="flex items-center gap-3 rounded-2xl border border-veya-border bg-gradient-to-br from-veya-surface to-veya-surface-2 p-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-veya-lavender-bright/20 border border-veya-lavender-bright/30">
            <User size={24} className="text-veya-lavender-bright" />
          </div>
          <div>
            <p className="text-base font-bold font-display">Hey, {userName}.</p>
            <p className="text-xs text-veya-text-dim">Demo profile · No account needed</p>
          </div>
        </div>
      </div>

      {/* My Circle */}
      <div className="px-5 mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-wide">MY CIRCLE</h2>
          <button
            onClick={() => setAddContactOpen(true)}
            className="flex items-center gap-1 text-xs font-semibold text-veya-lavender-bright"
          >
            <Plus size={14} /> ADD
          </button>
        </div>

        {/* Live sharing status */}
        <div className={`mb-3 flex items-center gap-3 rounded-xl border p-3.5 transition-colors ${
          sharing ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-veya-border bg-veya-surface'
        }`}>
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${sharing ? 'bg-emerald-500/15' : 'bg-veya-bg/50'}`}>
            <MapPin size={16} className={sharing ? 'text-emerald-400' : 'text-veya-text-dim'} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-veya-text">LIVE LOCATION SHARING</p>
            <p className="text-[11px] text-veya-text-dim">
              {sharing ? 'Sharing with your circle · Visible to trusted contacts' : 'Not sharing right now'}
            </p>
          </div>
          <Toggle checked={sharing} onChange={(v) => { setSharing(v); haptic(v ? 'medium' : 'light'); }} label="Toggle live location sharing" />
        </div>

        {/* Contacts */}
        <div className="space-y-2">
          {contacts.map((contact) => (
            <div key={contact.id} className="flex items-center gap-3 rounded-xl border border-veya-border bg-veya-surface p-3.5">
              <div className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ${
                contact.primary ? 'bg-veya-lavender-bright/20 text-veya-lavender-bright border border-veya-lavender-bright/30' : 'bg-veya-bg/50 text-veya-text-dim'
              }`}>
                {contact.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-veya-text">{contact.name}</p>
                  {contact.primary && (
                    <span className="flex items-center gap-0.5 rounded-full bg-veya-lavender-bright/15 px-1.5 py-0.5 text-[9px] font-bold text-veya-lavender-bright">
                      <Star size={8} /> PRIMARY
                    </span>
                  )}
                </div>
                <p className="text-xs text-veya-text-dim">{contact.phone}</p>
              </div>
              <div className="flex gap-1">
                {!contact.primary && (
                  <button onClick={() => handleSetPrimary(contact.id)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-veya-bg/50 text-veya-text-dim active:scale-90" aria-label="Set as primary">
                    <Star size={14} />
                  </button>
                )}
                <button onClick={() => handleDeleteContact(contact.id)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400 active:scale-90" aria-label="Delete contact">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* I'm Safe button */}
        <button
          onClick={handleImSafe}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 py-3.5 text-sm font-bold text-emerald-400 active:scale-[0.98]"
        >
          <Heart size={16} />
          I'M SAFE
        </button>
      </div>

      {/* Local Evidence Log */}
      <div className="px-5 mt-5">
        <h2 className="mb-3 text-sm font-bold tracking-wide">LOCAL EVIDENCE LOG</h2>
        <div className="flex gap-2">
          <input
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write a quick note..."
            className="flex-1 rounded-xl border border-veya-border bg-veya-surface px-4 py-3 text-sm text-veya-text placeholder:text-veya-text-dim/40 focus:border-veya-lavender-bright/40 focus:outline-none"
          />
          <button onClick={handleAddNote} className="flex items-center justify-center rounded-xl bg-veya-lavender-bright px-4 text-sm font-bold text-veya-bg active:scale-95" aria-label="Save note">
            <Plus size={18} />
          </button>
          <button onClick={handleAddPhoto} className="flex items-center justify-center rounded-xl border border-veya-border bg-veya-surface px-4 text-veya-text-dim active:scale-95" aria-label="Add photo placeholder">
            <Camera size={18} />
          </button>
        </div>
        <p className="mt-1.5 text-[10px] text-veya-text-dim/50">Stored locally on your device only.</p>

        {evidence.length > 0 && (
          <div className="mt-3 space-y-2">
            {evidence.map((item) => (
              <div key={item.id} className="flex items-start gap-3 rounded-xl border border-veya-border bg-veya-surface p-3.5 animate-slide-up">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-veya-bg/50 shrink-0">
                  {item.type === 'photo' ? <Camera size={14} className="text-veya-lavender-bright" /> : <Check size={14} className="text-veya-lavender-bright" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-veya-text">{item.text}</p>
                  <p className="mt-0.5 text-[10px] text-veya-text-dim/50">{formatTime(item.timestamp)}</p>
                </div>
                <button onClick={() => handleDeleteEvidence(item.id)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400 active:scale-90 shrink-0" aria-label="Delete evidence">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="px-5 mt-5">
        <h2 className="mb-3 text-sm font-bold tracking-wide">SETTINGS</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-3 rounded-xl border border-veya-border bg-veya-surface p-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-veya-bg/50">
              <Moon size={16} className="text-veya-lavender-bright" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-veya-text">Night Mode</p>
              <p className="text-[11px] text-veya-text-dim">Reduced brightness, clear controls</p>
            </div>
            <Toggle checked={nightMode} onChange={onToggleNight} label="Night mode" />
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-veya-border bg-veya-surface p-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-veya-bg/50">
              <WifiOff size={16} className="text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-veya-text">Offline / Low-data Mode</p>
              <p className="text-[11px] text-veya-text-dim">Text-only view, cached data</p>
            </div>
            <Toggle checked={offline} onChange={onToggleOffline} label="Offline mode" />
          </div>

          {/* Battery simulator */}
          <div className="rounded-xl border border-veya-border bg-veya-surface p-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-veya-bg/50">
                <Battery size={16} className={batteryLevel < 20 ? 'text-red-400' : 'text-veya-lavender-bright'} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-veya-text">Battery (Simulated)</p>
                <p className="text-[11px] text-veya-text-dim">For demo purposes — not real battery</p>
              </div>
              <span className={`text-sm font-bold font-display ${batteryLevel < 20 ? 'text-red-400' : 'text-veya-text'}`}>{batteryLevel}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={batteryLevel}
              onChange={(e) => onSetBattery(Number(e.target.value))}
              className="mt-3 w-full accent-veya-lavender-bright"
              aria-label="Simulated battery level"
            />
            {batteryLevel < 20 && (
              <p className="mt-1.5 text-[10px] text-amber-300">Low battery — carry a charger or power bank.</p>
            )}
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="px-5 mt-5">
        <div className="rounded-xl border border-veya-border bg-veya-surface/50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Shield size={14} className="text-veya-lavender-bright" />
            <p className="text-xs font-bold text-veya-text">HOW SHARING WORKS</p>
          </div>
          <ul className="space-y-1.5 text-[11px] leading-relaxed text-veya-text-dim">
            <li>• Location is used only while the app is open.</li>
            <li>• No one can see your location unless you start live sharing or activate SOS.</li>
            <li>• Live sharing can be stopped at any time.</li>
            <li>• SOS shares your location and battery with trusted contacts only.</li>
            <li>• Evidence log is stored locally on your device. Delete anytime.</li>
          </ul>
        </div>
      </div>

      <p className="px-5 mt-4 text-center text-[10px] text-veya-text-dim/40">
        Veya · Demo Prototype · Mock Data
      </p>

      {/* Add contact modal */}
      {addContactOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setAddContactOpen(false)}>
          <div className="w-full rounded-t-3xl border-t border-veya-border bg-veya-surface p-6 animate-sheet-up safe-bottom" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold font-display">Add trusted contact</h3>
              <button onClick={() => setAddContactOpen(false)} aria-label="Close">
                <X size={20} className="text-veya-text-dim" />
              </button>
            </div>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name"
              className="w-full rounded-xl border border-veya-border bg-veya-bg/50 px-4 py-3 text-sm text-veya-text placeholder:text-veya-text-dim/40 focus:border-veya-lavender-bright/40 focus:outline-none"
            />
            <input
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="Phone (optional)"
              className="mt-3 w-full rounded-xl border border-veya-border bg-veya-bg/50 px-4 py-3 text-sm text-veya-text placeholder:text-veya-text-dim/40 focus:border-veya-lavender-bright/40 focus:outline-none"
            />
            <button
              onClick={handleAddContact}
              className="mt-4 w-full rounded-xl bg-veya-lavender-bright py-3.5 text-sm font-bold text-veya-bg active:scale-95"
            >
              ADD CONTACT
            </button>
          </div>
        </div>
      )}

      {/* I'm Safe toast */}
      {imSafeToast && (
        <div className="fixed bottom-28 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-5 py-3 text-sm font-bold text-emerald-300 animate-slide-up">
          <Check size={16} className="inline mr-1" /> You're safe. Notified your circle.
        </div>
      )}
    </div>
  );
}

function Star({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
