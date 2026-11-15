import { ScenarioId } from './hrpEngine';

export interface CrewProfile {
  id: string;
  rank: string;
  name: string;
  bioId: string;
  roleTitle: string;
  defaultScenarioId: ScenarioId;
  defaultStreakDays: number;
  isCustom?: boolean;
}

export const DEFAULT_CREW_ID = 'crew-abbas';

export const PRESET_CREW_ROSTER: CrewProfile[] = [
  {
    id: 'crew-abbas',
    rank: 'CDR',
    name: 'M. ABBAS',
    bioId: 'BIO-ID 04',
    roleTitle: 'Mission Commander',
    defaultScenarioId: 'mars_spe',
    defaultStreakDays: 13,
  },
  {
    id: 'crew-vance',
    rank: 'CMO',
    name: 'E. VANCE',
    bioId: 'BIO-ID 07',
    roleTitle: 'Crew Medical Officer',
    defaultScenarioId: 'nominal_iss',
    defaultStreakDays: 21,
  },
  {
    id: 'crew-takahashi',
    rank: 'PLT',
    name: 'K. TAKAHASHI',
    bioId: 'BIO-ID 11',
    roleTitle: 'Lunar Surface Pilot',
    defaultScenarioId: 'lunar_eva_strain',
    defaultStreakDays: 9,
  },
  {
    id: 'crew-okafor',
    rank: 'MS-2',
    name: 'N. OKAFOR',
    bioId: 'BIO-ID 19',
    roleTitle: 'Flight Engineer',
    defaultScenarioId: 'day_180_confinement',
    defaultStreakDays: 16,
  },
];

export function formatCrewMedicalId(profile: CrewProfile): string {
  const rankClean = profile.rank.trim().replace(/\.+$/, '');
  const nameClean = profile.name.trim();
  const bioClean = profile.bioId.trim();
  return `${rankClean}. ${nameClean} // ${bioClean}`;
}
