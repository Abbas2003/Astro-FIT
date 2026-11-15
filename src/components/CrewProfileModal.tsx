import React, { useEffect, useState } from 'react';
import {
  Check,
  Pencil,
  Plus,
  Trash2,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import {
  MISSION_SCENARIOS,
  ScenarioId,
} from '../lib/hrpEngine';
import {
  CrewProfile,
  formatCrewMedicalId,
} from '../lib/crewProfiles';

interface CrewProfileModalProps {
  isOpen: boolean;
  roster: CrewProfile[];
  activeCrewId: string;
  onClose: () => void;
  onSelectCrew: (crewId: string) => void;
  onCreateCrew: (profile: CrewProfile) => void;
  onUpdateCrew: (profile: CrewProfile) => void;
  onDeleteCrew: (crewId: string) => void;
}

type EditorMode = 'roster' | 'create' | 'edit';

export const CrewProfileModal: React.FC<CrewProfileModalProps> = ({
  isOpen,
  roster,
  activeCrewId,
  onClose,
  onSelectCrew,
  onCreateCrew,
  onUpdateCrew,
  onDeleteCrew,
}) => {
  const [mode, setMode] = useState<EditorMode>('roster');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [rank, setRank] = useState('MS');
  const [name, setName] = useState('');
  const [bioId, setBioId] = useState('BIO-ID 24');
  const [roleTitle, setRoleTitle] = useState('Mission Specialist');
  const [defaultScenarioId, setDefaultScenarioId] = useState<ScenarioId>('nominal_iss');
  const [defaultStreakDays, setDefaultStreakDays] = useState(7);

  useEffect(() => {
    if (isOpen) {
      setMode('roster');
      setEditingId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const openCreateForm = () => {
    const nextNum = roster.length + 21;
    setEditingId(null);
    setRank('MS');
    setName('');
    setBioId(`BIO-ID ${String(nextNum).padStart(2, '0')}`);
    setRoleTitle('Mission Specialist');
    setDefaultScenarioId('nominal_iss');
    setDefaultStreakDays(7);
    setMode('create');
  };

  const openEditForm = (profile: CrewProfile) => {
    setEditingId(profile.id);
    setRank(profile.rank);
    setName(profile.name);
    setBioId(profile.bioId);
    setRoleTitle(profile.roleTitle);
    setDefaultScenarioId(profile.defaultScenarioId);
    setDefaultStreakDays(profile.defaultStreakDays);
    setMode('edit');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim().toUpperCase();
    const cleanRank = rank.trim().toUpperCase().replace(/\.+$/, '') || 'AST';
    const cleanBioId = bioId.trim().toUpperCase() || 'BIO-ID 01';
    const cleanRole = roleTitle.trim() || 'Flight Crew';
    if (!cleanName) return;

    if (mode === 'create') {
      const newProfile: CrewProfile = {
        id: `crew-custom-${Date.now()}`,
        rank: cleanRank,
        name: cleanName,
        bioId: cleanBioId,
        roleTitle: cleanRole,
        defaultScenarioId,
        defaultStreakDays: Math.max(0, Math.min(365, Number(defaultStreakDays) || 0)),
        isCustom: true,
      };
      onCreateCrew(newProfile);
      setMode('roster');
      onClose();
    } else if (mode === 'edit' && editingId) {
      const existing = roster.find((c) => c.id === editingId);
      if (existing) {
        onUpdateCrew({
          ...existing,
          rank: cleanRank,
          name: cleanName,
          bioId: cleanBioId,
          roleTitle: cleanRole,
          defaultScenarioId,
          defaultStreakDays: Math.max(0, Math.min(365, Number(defaultStreakDays) || 0)),
        });
      }
      setMode('roster');
    }
  };

  const previewLabel = `${(rank.trim().toUpperCase().replace(/\.+$/, '') || 'AST')}. ${
    name.trim().toUpperCase() || 'CREW NAME'
  } // ${bioId.trim().toUpperCase() || 'BIO-ID 00'}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crew-profile-modal-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] sm:max-h-[85vh] w-full max-w-xl flex-col rounded-t-[6px] sm:rounded-[6px] border border-[#232734] bg-[#11131A] text-[#E5E7EB]"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-[#232734] px-4 py-3 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <div className="flight-micro-label truncate">
              Crew Manifest · Isolated Biomedical Profiles
            </div>
            <h2
              id="crew-profile-modal-title"
              className="mt-0.5 flex items-center gap-2 text-sm sm:text-base font-semibold text-white truncate"
            >
              <Users className="h-4 w-4 text-[#2B7FFF] shrink-0" aria-hidden="true" />
              <span>Crew Medical ID &amp; Roster</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[4px] border border-[#232734] bg-[#0D0F15] p-1.5 text-[#8E96AA] hover:border-[#2B7FFF] hover:text-white shrink-0"
            aria-label="Close Crew Medical ID modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Mode Bar */}
        <div className="flex items-center justify-between gap-2 border-b border-[#232734] bg-[#0D0F15] px-4 py-2.5 sm:px-6">
          <span className="font-mono-tabular text-[11px] text-[#8E96AA]">
            {mode === 'roster'
              ? `${roster.length} REGISTERED ASTRONAUT${roster.length > 1 ? 'S' : ''}`
              : mode === 'create'
              ? 'REGISTER NEW CREW BIO-PROFILE'
              : 'EDIT CREW BIO-PROFILE'}
          </span>
          {mode === 'roster' ? (
            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#2B7FFF] bg-[#2B7FFF]/15 px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2B7FFF]/25 whitespace-nowrap"
            >
              <Plus className="h-3.5 w-3.5 text-[#2B7FFF]" aria-hidden="true" />
              <span>Add Custom Crew</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMode('roster')}
              className="rounded-[4px] border border-[#232734] bg-[#11131A] px-3 py-1.5 text-xs font-medium text-[#8E96AA] hover:text-white"
            >
              Back to Roster
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-[#090A0F] px-4 py-4 sm:px-6">
          {mode === 'roster' ? (
            <div className="space-y-2.5">
              <p className="text-xs text-[#8E96AA]">
                Each crew profile maintains separate biomarker vitals, daily routine streaks, ultrasound scans, and IndexedDB telemetry logs.
              </p>

              {roster.map((profile) => {
                const isActive = profile.id === activeCrewId;
                const sc = MISSION_SCENARIOS[profile.defaultScenarioId];
                return (
                  <div
                    key={profile.id}
                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-[4px] border p-3.5 transition-colors ${
                      isActive
                        ? 'border-[#2B7FFF] bg-[#161A24]'
                        : 'border-[#232734] bg-[#11131A] hover:border-[#3B4254]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCrew(profile.id);
                        onClose();
                      }}
                      className="flex-1 min-w-0 text-left focus-visible:outline-none"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono-tabular text-xs font-semibold text-white">
                          {formatCrewMedicalId(profile)}
                        </span>
                        {isActive && (
                          <span className="inline-flex items-center gap-1 rounded-[2px] border border-[#10B981]/50 bg-[#10B981]/15 px-1.5 py-0.5 font-mono-tabular text-[10px] font-semibold text-[#10B981]">
                            <UserCheck className="h-3 w-3" aria-hidden="true" />
                            ACTIVE
                          </span>
                        )}
                        {profile.isCustom && (
                          <span className="rounded-[2px] border border-[#232734] bg-[#0D0F15] px-1.5 py-0.5 font-mono-tabular text-[9px] text-[#8E96AA]">
                            CUSTOM
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-[#8E96AA]">
                        <span className="text-[#E5E7EB]">{profile.roleTitle}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-tabular">{sc?.code ?? 'DEFAULT'}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-tabular text-[#F59E0B]">
                          {profile.defaultStreakDays}D BASE STREAK
                        </span>
                      </div>
                    </button>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => openEditForm(profile)}
                        className="inline-flex items-center gap-1 rounded-[4px] border border-[#232734] bg-[#0D0F15] px-2.5 py-1.5 text-[11px] font-medium text-[#E5E7EB] hover:border-[#2B7FFF]"
                        aria-label={`Edit ${profile.name}`}
                      >
                        <Pencil className="h-3 w-3" aria-hidden="true" />
                        <span>Edit</span>
                      </button>

                      {profile.isCustom && roster.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onDeleteCrew(profile.id)}
                          className="inline-flex items-center justify-center rounded-[4px] border border-[#232734] bg-[#0D0F15] p-1.5 text-[#8E96AA] hover:border-[#EF4444] hover:text-[#EF4444]"
                          aria-label={`Delete ${profile.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded-[4px] border border-[#232734] bg-[#11131A] p-3">
                <div className="flight-micro-label">Console Readout Preview</div>
                <div className="mt-1 font-mono-tabular text-sm font-semibold text-[#2B7FFF]">
                  {previewLabel}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="crew-rank" className="block flight-micro-label">
                    Rank / Callsign
                  </label>
                  <input
                    id="crew-rank"
                    type="text"
                    required
                    maxLength={8}
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    placeholder="CDR, PLT, CMO, MS"
                    className="mt-1.5 w-full rounded-[4px] border border-[#232734] bg-[#11131A] px-3 py-2 font-mono-tabular text-xs text-white focus:border-[#2B7FFF] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="crew-bio-id" className="block flight-micro-label">
                    Biometric ID Tag
                  </label>
                  <input
                    id="crew-bio-id"
                    type="text"
                    required
                    maxLength={14}
                    value={bioId}
                    onChange={(e) => setBioId(e.target.value)}
                    placeholder="BIO-ID 24"
                    className="mt-1.5 w-full rounded-[4px] border border-[#232734] bg-[#11131A] px-3 py-2 font-mono-tabular text-xs text-white focus:border-[#2B7FFF] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="crew-name" className="block flight-micro-label">
                    Astronaut Name
                  </label>
                  <input
                    id="crew-name"
                    type="text"
                    required
                    maxLength={28}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. S. CHAWLA"
                    className="mt-1.5 w-full rounded-[4px] border border-[#232734] bg-[#11131A] px-3 py-2 font-mono-tabular text-xs text-white focus:border-[#2B7FFF] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="crew-role" className="block flight-micro-label">
                    Flight Role / Specialty
                  </label>
                  <input
                    id="crew-role"
                    type="text"
                    maxLength={40}
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="e.g. Payload & EVA Specialist"
                    className="mt-1.5 w-full rounded-[4px] border border-[#232734] bg-[#11131A] px-3 py-2 text-xs text-white focus:border-[#2B7FFF] focus:outline-none"
                  />
                </div>

                {mode === 'create' && (
                  <>
                    <div>
                      <label htmlFor="crew-scenario" className="block flight-micro-label">
                        Initial Telemetry Baseline
                      </label>
                      <select
                        id="crew-scenario"
                        value={defaultScenarioId}
                        onChange={(e) => setDefaultScenarioId(e.target.value as ScenarioId)}
                        className="mt-1.5 w-full rounded-[4px] border border-[#232734] bg-[#11131A] px-2.5 py-2 font-mono-tabular text-xs text-white focus:border-[#2B7FFF] focus:outline-none"
                      >
                        {(Object.keys(MISSION_SCENARIOS) as ScenarioId[]).map((id) => (
                          <option key={id} value={id}>
                            {MISSION_SCENARIOS[id].name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="crew-streak" className="block flight-micro-label">
                        Initial Health Streak (Days)
                      </label>
                      <input
                        id="crew-streak"
                        type="number"
                        min={0}
                        max={365}
                        value={defaultStreakDays}
                        onChange={(e) => setDefaultStreakDays(Number(e.target.value))}
                        className="mt-1.5 w-full rounded-[4px] border border-[#232734] bg-[#11131A] px-3 py-2 font-mono-tabular text-xs text-white focus:border-[#2B7FFF] focus:outline-none"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 border-t border-[#232734] pt-4">
                <button
                  type="button"
                  onClick={() => setMode('roster')}
                  className="rounded-[4px] border border-[#232734] bg-[#11131A] px-4 py-2 text-xs font-medium text-[#8E96AA] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#2B7FFF] bg-[#2B7FFF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E6AE5]"
                >
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{mode === 'create' ? 'Create & Activate Crew' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
