/**
 * Astro FIT — Core NASA Human Research Program (HRP) Clinical Rule Engine
 *
 * Models telemetry, environmental baselines, deterministic clinical evaluation,
 * autonomous deep-space countermeasures, plain-English space physiology explanations,
 * self-exam instructions, and 14-day mission scenario time-series datasets aligned
 * with NASA's 5 Hazards of Human Spaceflight.
 */

export type MissionEnvironmentId =
  | 'iss_orbit'
  | 'mars_transit'
  | 'lunar_base'
  | 'pressurized_rover';

export type ClinicalStatus = 'NOMINAL' | 'CAUTION' | 'CRITICAL';

export type NasaHazard =
  | 'Space Radiation'
  | 'Isolation & Confinement'
  | 'Distance from Earth'
  | 'Gravity Fields'
  | 'Hostile Closed Environments';

export type BodySystemId =
  | 'neuro_behavioral'
  | 'cardiovascular'
  | 'musculoskeletal'
  | 'radiation_immune';

export type BiomarkerKey =
  | 'heartRate'
  | 'systolicBP'
  | 'diastolicBP'
  | 'bloodGlucose'
  | 'bodyTemp'
  | 'sleepHours'
  | 'cumulativeRadiation'
  | 'boneDensityIndex'
  | 'moodCognitiveScore';

export interface BiomarkerReading {
  heartRate: number; // bpm
  systolicBP: number; // mmHg
  diastolicBP: number; // mmHg
  bloodGlucose: number; // mg/dL
  bodyTemp: number; // °C
  sleepHours: number; // hrs / 24h
  cumulativeRadiation: number; // mSv
  boneDensityIndex: number; // DXA T-score proxy
  moodCognitiveScore: number; // 1-10 composite cognitive/mood index
}

export interface ThresholdRange {
  nominalMin: number;
  nominalMax: number;
  cautionMin: number;
  cautionMax: number;
  unit: string;
  label: string;
  precision: number;
}

export interface MissionEnvironmentProfile {
  id: MissionEnvironmentId;
  name: string;
  shortName: string;
  orbitOrLocation: string;
  gravityG: number;
  gravityLabel: string;
  earthDelaySeconds: number;
  earthDelayLabel: string;
  autonomousModeRequired: boolean;
  cabinAtmosphere: string;
  primaryHazards: NasaHazard[];
  baselines: Record<BiomarkerKey, ThresholdRange>;
}

export interface BiomarkerEvaluation {
  key: BiomarkerKey;
  label: string;
  value: number;
  unit: string;
  precision: number;
  status: ClinicalStatus;
  nominalRangeText: string;
  deltaFromNominalCenter: number;
  systemId: BodySystemId;
  linkedHazards: NasaHazard[];
  spacePhysiologySummary: string;
}

export interface CountermeasureAction {
  id: string;
  title: string;
  priority: 'ROUTINE' | 'ELEVATED' | 'IMMEDIATE';
  category:
    | 'Exercise & Loading'
    | 'Circadian & Behavioral'
    | 'Radiation Shielding'
    | 'Hydration & Metabolic'
    | 'Medical Officer Escalation';
  protocolCode: string;
  instruction: string;
  targetDurationOrDose: string;
  autonomousExecutionNote: string;
}

export interface SelfExamStep {
  stepNumber: number;
  title: string;
  instruction: string;
  hardwareRequired: string;
}

export interface BodySystemEvaluation {
  systemId: BodySystemId;
  displayName: string;
  anatomicalRegionLabel: string;
  status: ClinicalStatus;
  primaryHazards: NasaHazard[];
  biomarkers: BiomarkerEvaluation[];
  whyItMattersInSpace: string;
  clinicalFindingSummary: string;
  selfExamProtocolName: string;
  selfExamSteps: SelfExamStep[];
  countermeasures: CountermeasureAction[];
}

export interface MissionEvaluationReport {
  environment: MissionEnvironmentProfile;
  reading: BiomarkerReading;
  overallStatus: ClinicalStatus;
  autonomousModeActive: boolean;
  earthCommsStatusLabel: string;
  biomarkerEvaluations: Record<BiomarkerKey, BiomarkerEvaluation>;
  systemEvaluations: Record<BodySystemId, BodySystemEvaluation>;
  prioritizedCountermeasures: CountermeasureAction[];
  activeHazardCount: number;
  evaluatedAtIso: string;
}

export interface DailyTelemetryPoint {
  day: number;
  missionDayLabel: string;
  timestampIso: string;
  readings: BiomarkerReading;
  eventNote?: string;
}

export type ScenarioId =
  | 'nominal_iss'
  | 'mars_spe'
  | 'lunar_eva_strain'
  | 'day_180_confinement';

export interface MissionScenarioPreset {
  id: ScenarioId;
  code: string;
  name: string;
  subtitle: string;
  recommendedEnvironment: MissionEnvironmentId;
  missionElapsedTimeStart: string;
  description: string;
  triggerReading: BiomarkerReading;
  timeSeries14Day: DailyTelemetryPoint[];
}

export const BIOMARKER_TO_SYSTEM: Record<BiomarkerKey, BodySystemId> = {
  sleepHours: 'neuro_behavioral',
  moodCognitiveScore: 'neuro_behavioral',
  heartRate: 'cardiovascular',
  systolicBP: 'cardiovascular',
  diastolicBP: 'cardiovascular',
  boneDensityIndex: 'musculoskeletal',
  cumulativeRadiation: 'radiation_immune',
  bodyTemp: 'radiation_immune',
  bloodGlucose: 'cardiovascular',
};

export const BIOMARKER_HAZARD_MAP: Record<BiomarkerKey, NasaHazard[]> = {
  heartRate: ['Gravity Fields', 'Hostile Closed Environments', 'Distance from Earth'],
  systolicBP: ['Gravity Fields', 'Hostile Closed Environments'],
  diastolicBP: ['Gravity Fields', 'Hostile Closed Environments'],
  bloodGlucose: ['Hostile Closed Environments', 'Isolation & Confinement'],
  bodyTemp: ['Hostile Closed Environments', 'Space Radiation'],
  sleepHours: ['Isolation & Confinement', 'Hostile Closed Environments', 'Distance from Earth'],
  cumulativeRadiation: ['Space Radiation', 'Distance from Earth'],
  boneDensityIndex: ['Gravity Fields', 'Space Radiation'],
  moodCognitiveScore: ['Isolation & Confinement', 'Distance from Earth'],
};

export const BIOMARKER_SPACE_EXPLANATIONS: Record<BiomarkerKey, string> = {
  heartRate:
    'In low or zero gravity, your heart does not have to pump as hard against gravity, which slowly weakens heart fitness and can make your pulse race during spacewalks or exercise.',
  systolicBP:
    'Without gravity pulling blood down, fluids shift toward your head and chest and overall blood volume drops 10–15%. This can cause dizzy spells or blood pressure swings.',
  diastolicBP:
    'Resting blood vessel pressure shifts as your body adjusts to weightlessness. Higher readings can point to stress, dehydration, or stale cabin air (high CO2).',
  bloodGlucose:
    'Living in weightlessness changes how your body handles sugar and insulin. Unsteady blood sugar can drain your energy and focus during long spacewalks.',
  bodyTemp:
    'Because sweat does not drip or evaporate well in zero gravity, body heat builds up quickly inside spacesuits and can hide early signs of fever or overheating.',
  sleepHours:
    'With 16 sunrises a day or total deep-space darkness—plus noisy fans and shifting schedules—astronauts easily lose sleep, which hurts focus and reaction speed.',
  cumulativeRadiation:
    'Outside Earth’s magnetic shield, solar flares and cosmic rays pass through ship walls and slowly raise lifetime radiation dose, stressing blood and immune cells.',
  boneDensityIndex:
    'Without gravity pushing on your legs and spine, bones lose 1% to 1.5% of their strength each month unless you do daily heavy resistance workouts.',
  moodCognitiveScore:
    'Months inside a small cabin far from Earth—with up to 20-minute message delays—can cause stress, boredom, low mood, and slower decision-making.',
};

function createBaselines(overrides: Partial<Record<BiomarkerKey, Partial<ThresholdRange>>>): Record<BiomarkerKey, ThresholdRange> {
  const defaults: Record<BiomarkerKey, ThresholdRange> = {
    heartRate: {
      label: 'Heart Rate',
      unit: 'bpm',
      precision: 0,
      nominalMin: 52,
      nominalMax: 88,
      cautionMin: 45,
      cautionMax: 102,
    },
    systolicBP: {
      label: 'Blood Pressure (Top)',
      unit: 'mmHg',
      precision: 0,
      nominalMin: 98,
      nominalMax: 128,
      cautionMin: 90,
      cautionMax: 142,
    },
    diastolicBP: {
      label: 'Blood Pressure (Bottom)',
      unit: 'mmHg',
      precision: 0,
      nominalMin: 60,
      nominalMax: 82,
      cautionMin: 52,
      cautionMax: 90,
    },
    bloodGlucose: {
      label: 'Blood Sugar',
      unit: 'mg/dL',
      precision: 0,
      nominalMin: 74,
      nominalMax: 118,
      cautionMin: 64,
      cautionMax: 142,
    },
    bodyTemp: {
      label: 'Body Temperature',
      unit: '°C',
      precision: 1,
      nominalMin: 36.2,
      nominalMax: 37.3,
      cautionMin: 35.6,
      cautionMax: 37.9,
    },
    sleepHours: {
      label: 'Daily Sleep',
      unit: 'hrs',
      precision: 1,
      nominalMin: 6.5,
      nominalMax: 8.8,
      cautionMin: 5.2,
      cautionMax: 9.8,
    },
    cumulativeRadiation: {
      label: 'Total Radiation Dose',
      unit: 'mSv',
      precision: 1,
      nominalMin: 0,
      nominalMax: 50,
      cautionMin: 0,
      cautionMax: 120,
    },
    boneDensityIndex: {
      label: 'Bone Strength Score',
      unit: 'T-score',
      precision: 2,
      nominalMin: -0.8,
      nominalMax: 2.0,
      cautionMin: -1.5,
      cautionMax: 2.5,
    },
    moodCognitiveScore: {
      label: 'Mood & Focus Score',
      unit: '/10',
      precision: 1,
      nominalMin: 7.0,
      nominalMax: 10.0,
      cautionMin: 5.0,
      cautionMax: 10.0,
    },
  };

  const result = { ...defaults };
  (Object.keys(overrides) as BiomarkerKey[]).forEach((key) => {
    const patch = overrides[key];
    if (patch) {
      result[key] = { ...defaults[key], ...patch };
    }
  });
  return result;
}

export const MISSION_ENVIRONMENTS: Record<MissionEnvironmentId, MissionEnvironmentProfile> = {
  iss_orbit: {
    id: 'iss_orbit',
    name: 'ISS Space Station',
    shortName: 'ISS Orbit',
    orbitOrLocation: 'Orbiting Earth · 408 km up',
    gravityG: 0.0,
    gravityLabel: '0.00 g (Weightless)',
    earthDelaySeconds: 0.4,
    earthDelayLabel: '0.4s Live Link',
    autonomousModeRequired: false,
    cabinAtmosphere: 'Earth-normal air · 21% O2 · Clean CO2',
    primaryHazards: ['Gravity Fields', 'Hostile Closed Environments', 'Space Radiation'],
    baselines: createBaselines({
      cumulativeRadiation: { nominalMax: 45, cautionMax: 100 },
      boneDensityIndex: { nominalMin: -0.7, cautionMin: -1.4 },
    }),
  },
  mars_transit: {
    id: 'mars_transit',
    name: 'Mars Deep-Space Ship',
    shortName: 'Mars Transit',
    orbitOrLocation: 'Deep Space Cruise · Far from Earth',
    gravityG: 0.0,
    gravityLabel: '0.00 g (Weightless)',
    earthDelaySeconds: 1122, // 18m 42s one-way light delay
    earthDelayLabel: '18m 42s Delay',
    autonomousModeRequired: true,
    cabinAtmosphere: 'Cabin air · 26.5% O2 · Slightly higher CO2',
    primaryHazards: [
      'Distance from Earth',
      'Space Radiation',
      'Isolation & Confinement',
      'Gravity Fields',
      'Hostile Closed Environments',
    ],
    baselines: createBaselines({
      heartRate: { nominalMin: 54, nominalMax: 90, cautionMin: 46, cautionMax: 104 },
      cumulativeRadiation: { nominalMax: 85, cautionMax: 145 },
      boneDensityIndex: { nominalMin: -0.9, cautionMin: -1.6 },
      sleepHours: { nominalMin: 6.3, cautionMin: 5.0 },
    }),
  },
  lunar_base: {
    id: 'lunar_base',
    name: 'Moon Surface Base',
    shortName: 'Lunar Base',
    orbitOrLocation: 'Moon South Pole · Shackleton Crater',
    gravityG: 0.16,
    gravityLabel: '0.16 g (Moon Gravity)',
    earthDelaySeconds: 1.3,
    earthDelayLabel: '1.3s Fast Link',
    autonomousModeRequired: false,
    cabinAtmosphere: 'Base air · 34% O2 · Moon Dust Filters On',
    primaryHazards: ['Gravity Fields', 'Space Radiation', 'Hostile Closed Environments'],
    baselines: createBaselines({
      heartRate: { nominalMin: 55, nominalMax: 96, cautionMin: 48, cautionMax: 112 },
      systolicBP: { nominalMin: 100, nominalMax: 132, cautionMin: 90, cautionMax: 144 },
      bloodGlucose: { nominalMin: 72, nominalMax: 122, cautionMin: 65, cautionMax: 145 },
      cumulativeRadiation: { nominalMax: 60, cautionMax: 120 },
    }),
  },
  pressurized_rover: {
    id: 'pressurized_rover',
    name: 'Moon / Mars Rover',
    shortName: 'Pressurized Rover',
    orbitOrLocation: 'Mobile Surface Drive · Exploration Zone',
    gravityG: 0.16,
    gravityLabel: '0.16 g (Rover Drive)',
    earthDelaySeconds: 3.8,
    earthDelayLabel: '3.8s Relay Link',
    autonomousModeRequired: true,
    cabinAtmosphere: 'Compact rover air · 32% O2 · Recycled Air',
    primaryHazards: ['Hostile Closed Environments', 'Isolation & Confinement', 'Space Radiation', 'Gravity Fields'],
    baselines: createBaselines({
      heartRate: { nominalMin: 56, nominalMax: 98, cautionMin: 48, cautionMax: 114 },
      sleepHours: { nominalMin: 6.0, cautionMin: 4.8 },
      cumulativeRadiation: { nominalMax: 65, cautionMax: 125 },
      moodCognitiveScore: { nominalMin: 6.8, cautionMin: 4.8 },
    }),
  },
};

export function classifyBiomarker(value: number, range: ThresholdRange): ClinicalStatus {
  if (value >= range.nominalMin && value <= range.nominalMax) {
    return 'NOMINAL';
  }
  if (value >= range.cautionMin && value <= range.cautionMax) {
    return 'CAUTION';
  }
  return 'CRITICAL';
}

export function formatDelayDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs.toString().padStart(2, '0')}s`;
}

function worstStatus(statuses: ClinicalStatus[]): ClinicalStatus {
  if (statuses.includes('CRITICAL')) return 'CRITICAL';
  if (statuses.includes('CAUTION')) return 'CAUTION';
  return 'NOMINAL';
}

function buildSystemCountermeasures(
  systemId: BodySystemId,
  status: ClinicalStatus,
  env: MissionEnvironmentProfile,
  evals: Record<BiomarkerKey, BiomarkerEvaluation>
): CountermeasureAction[] {
  const actions: CountermeasureAction[] = [];
  const autonomousNote = env.autonomousModeRequired
    ? `Start right away without waiting for Earth (${env.earthDelayLabel} signal delay).`
    : `Log completion to health records and share with Earth doctors (${env.earthDelayLabel}).`;

  if (systemId === 'neuro_behavioral') {
    const sleep = evals.sleepHours;
    const mood = evals.moodCognitiveScore;

    if (sleep.status !== 'NOMINAL') {
      actions.push({
        id: 'nb-circadian-light',
        title: 'Morning Blue Light Therapy & Sleep Reset',
        priority: sleep.status === 'CRITICAL' ? 'IMMEDIATE' : 'ELEVATED',
        category: 'Circadian & Behavioral',
        protocolCode: 'SLEEP-04',
        instruction:
          'Sit in bright blue-enriched cabin light for 45 minutes when waking up. Dim sleep quarters 2 hours before bed and make sure cabin CO2 is low.',
        targetDurationOrDose: '45 min morning light · dim room at night',
        autonomousExecutionNote: autonomousNote,
      });
    }

    if (mood.status !== 'NOMINAL') {
      actions.push({
        id: 'nb-pvt-decompression',
        title: 'Lighter Schedule & Family Check-In',
        priority: mood.status === 'CRITICAL' ? 'IMMEDIATE' : 'ELEVATED',
        category: 'Circadian & Behavioral',
        protocolCode: 'MIND-12',
        instruction:
          'Pause non-urgent science tasks for 24 hours. Take the 15-second Focus Test and record a private video message to send home to family.',
        targetDurationOrDose: '24h lighter workload · 1x Focus Test',
        autonomousExecutionNote: autonomousNote,
      });
    }

    if (status === 'CRITICAL') {
      actions.push({
        id: 'nb-cmo-neuro',
        title: 'Pause Spacewalks & Alert Crew Medical Officer',
        priority: 'IMMEDIATE',
        category: 'Medical Officer Escalation',
        protocolCode: 'MED-NEURO-01',
        instruction:
          'Hold off on rover driving or spacewalks until sleep reaches 6.5+ hours and focus test speed recovers. Have a crewmate check in every 6 hours.',
        targetDurationOrDose: 'Pause spacewalks until rested',
        autonomousExecutionNote: autonomousNote,
      });
    }

    if (actions.length === 0) {
      actions.push({
        id: 'nb-routine',
        title: 'Keep Regular Sleep Schedule & Weekly Focus Check',
        priority: 'ROUTINE',
        category: 'Circadian & Behavioral',
        protocolCode: 'SLEEP-01',
        instruction:
          'Stick to normal day/night cabin lighting and keep sleeping quarters cool (about 19.5°C).',
        targetDurationOrDose: '7.5 hrs nightly sleep goal',
        autonomousExecutionNote: autonomousNote,
      });
    }
  }

  if (systemId === 'cardiovascular') {
    const hr = evals.heartRate;
    const sbp = evals.systolicBP;
    const dbp = evals.diastolicBP;
    const glu = evals.bloodGlucose;

    if (hr.status !== 'NOMINAL' || sbp.status !== 'NOMINAL' || dbp.status !== 'NOMINAL') {
      actions.push({
        id: 'cv-hydration-electrolyte',
        title: 'Drink Electrolyte Hydration Mix & Rest',
        priority: status === 'CRITICAL' ? 'IMMEDIATE' : 'ELEVATED',
        category: 'Hydration & Metabolic',
        protocolCode: 'HEART-07',
        instruction:
          'Slowly drink 750 mL of electrolyte water over 45 minutes. Pause heavy spacewalk work and re-check blood pressure after 30 minutes of rest.',
        targetDurationOrDose: '750 mL electrolyte drink',
        autonomousExecutionNote: autonomousNote,
      });
    }

    if (glu.status !== 'NOMINAL') {
      actions.push({
        id: 'cv-glycemic-stabilization',
        title:
          glu.value < 74
            ? 'Quick Sugar Boost for Low Blood Sugar'
            : 'Balanced Meal & Light Exercise for High Sugar',
        priority: glu.status === 'CRITICAL' ? 'IMMEDIATE' : 'ELEVATED',
        category: 'Hydration & Metabolic',
        protocolCode: 'SUGAR-03',
        instruction:
          glu.value < 74
            ? 'Take 20 g of fast sugar gel plus a snack bar, then re-test blood sugar in 15 minutes.'
            : 'Choose low-sugar meals for your next two rations and ride the exercise bike for 30 minutes if you feel well.',
        targetDurationOrDose: glu.value < 74 ? '20 g sugar gel + 15m re-test' : '30 min exercise bike',
        autonomousExecutionNote: autonomousNote,
      });
    }

    if (env.gravityG === 0 && status !== 'NOMINAL') {
      actions.push({
        id: 'cv-lbnp-conditioning',
        title: 'Lower-Body Suction Suit (Fluid Balance)',
        priority: 'ELEVATED',
        category: 'Exercise & Loading',
        protocolCode: 'HEART-11',
        instruction:
          'Use the Chibis leg suction suit for 20 minutes to gently pull blood back toward your legs while watching your heart rate and blood pressure.',
        targetDurationOrDose: '20 min gentle leg suction',
        autonomousExecutionNote: autonomousNote,
      });
    }

    if (actions.length === 0) {
      actions.push({
        id: 'cv-routine',
        title: 'Daily Cardio Bike or Treadmill Workout',
        priority: 'ROUTINE',
        category: 'Exercise & Loading',
        protocolCode: 'HEART-01',
        instruction:
          'Do 30–45 minutes of moderate cardio on the space station bike or treadmill and drink at least 2.5 L of water today.',
        targetDurationOrDose: '35 min cardio · 2.5 L water',
        autonomousExecutionNote: autonomousNote,
      });
    }
  }

  if (systemId === 'musculoskeletal') {
    const bone = evals.boneDensityIndex;

    if (bone.status !== 'NOMINAL' || env.gravityG < 0.2) {
      actions.push({
        id: 'ms-ared-protocol',
        title: 'Heavy Resistance Workout (ARED Weight Machine)',
        priority: bone.status === 'CRITICAL' ? 'IMMEDIATE' : bone.status === 'CAUTION' ? 'ELEVATED' : 'ROUTINE',
        category: 'Exercise & Loading',
        protocolCode: 'BONE-09',
        instruction:
          'Use the onboard ARED resistance machine for squats, deadlifts, and heel raises to put healthy weight on your spine and leg bones.',
        targetDurationOrDose: '60 min strength · 6 days/week',
        autonomousExecutionNote: autonomousNote,
      });
    }

    if (bone.status !== 'NOMINAL') {
      actions.push({
        id: 'ms-calcium-vitd',
        title: 'Take Vitamin D3, Calcium & Extra Water',
        priority: bone.status === 'CRITICAL' ? 'IMMEDIATE' : 'ELEVATED',
        category: 'Hydration & Metabolic',
        protocolCode: 'BONE-14',
        instruction:
          'Take daily Vitamin D3 (1,000 IU) and Calcium (1,200 mg) supplements, and drink plenty of water to protect kidneys from calcium buildup.',
        targetDurationOrDose: 'Vit D3 + Calcium + 2.8 L water',
        autonomousExecutionNote: autonomousNote,
      });
    }

    if (bone.status === 'CRITICAL') {
      actions.push({
        id: 'ms-cmo-bone',
        title: 'Avoid Heavy Lifting & Run Heel Bone Scan',
        priority: 'IMMEDIATE',
        category: 'Medical Officer Escalation',
        protocolCode: 'MED-BONE-02',
        instruction:
          'Pause heavy lifting during spacewalks. Run an ultrasound heel bone scan and send the result to the Crew Medical Officer and Earth doctors.',
        targetDurationOrDose: 'Immediate heel scan + doctor review',
        autonomousExecutionNote: autonomousNote,
      });
    }
  }

  if (systemId === 'radiation_immune') {
    const rad = evals.cumulativeRadiation;
    const temp = evals.bodyTemp;

    if (rad.status !== 'NOMINAL') {
      actions.push({
        id: 'ri-spe-shelter',
        title: 'Move to Radiation Storm Shelter Area',
        priority: rad.status === 'CRITICAL' ? 'IMMEDIATE' : 'ELEVATED',
        category: 'Radiation Shielding',
        protocolCode: 'RAD-01',
        instruction:
          'Move the crew into the water-lined storm shelter at the center of the ship. Cancel all outside spacewalks until solar storm levels drop.',
        targetDurationOrDose: 'Stay sheltered ~12–36 hrs',
        autonomousExecutionNote: autonomousNote,
      });
    }

    if (temp.status !== 'NOMINAL') {
      actions.push({
        id: 'ri-febrile-immune',
        title: 'Cool Down & Run Rapid Infection Swab',
        priority: temp.status === 'CRITICAL' ? 'IMMEDIATE' : 'ELEVATED',
        category: 'Medical Officer Escalation',
        protocolCode: 'IMMUNE-06',
        instruction:
          'Take a quick saliva swab and fingerstick blood check to look for infection or stress-triggered viruses. Take fever medicine if above 38.0°C.',
        targetDurationOrDose: '1x blood check + temp every 2 hrs',
        autonomousExecutionNote: autonomousNote,
      });
    }

    if (rad.status === 'CRITICAL') {
      actions.push({
        id: 'ri-cmo-hematology',
        title: 'Track Radiation Badge & Blood Cell Counts',
        priority: 'IMMEDIATE',
        category: 'Medical Officer Escalation',
        protocolCode: 'MED-RAD-05',
        instruction:
          'Compare your personal radiation badge with the ship sensor. Check white blood cell counts every 12 hours and alert the Crew Medical Officer.',
        targetDurationOrDose: '12-hour blood count checks',
        autonomousExecutionNote: autonomousNote,
      });
    }

    if (actions.length === 0) {
      actions.push({
        id: 'ri-routine',
        title: 'Wear Radiation Badge & Check Air Filters',
        priority: 'ROUTINE',
        category: 'Radiation Shielding',
        protocolCode: 'RAD-00',
        instruction:
          'Keep wearing your personal radiation badge and verify cabin HEPA air filters are running smoothly.',
        targetDurationOrDose: 'Always on · daily check',
        autonomousExecutionNote: autonomousNote,
      });
    }
  }

  return actions;
}

const SYSTEM_METADATA: Record<
  BodySystemId,
  {
    displayName: string;
    anatomicalRegionLabel: string;
    whyItMattersInSpace: string;
    selfExamProtocolName: string;
    selfExamSteps: SelfExamStep[];
  }
> = {
  neuro_behavioral: {
    displayName: 'Brain, Sleep & Mood',
    anatomicalRegionLabel: 'Head, Eyes & Focus',
    whyItMattersInSpace:
      'Fluid shifting toward the head can press on the eyes and blur vision, while 16 sunrises a day and living in a small crew cabin hurt sleep, mood, and reaction time.',
    selfExamProtocolName: '3-Step Focus, Vision & Sleep Check',
    selfExamSteps: [
      {
        stepNumber: 1,
        title: 'Check Cabin Air & Eyesight',
        hardwareRequired: 'Air Monitor · Eye Grid Card',
        instruction:
          'Make sure cabin CO2 is safe, then look at the eye grid card to check for blurry spots or wavy lines.',
      },
      {
        stepNumber: 2,
        title: 'Take the 15-Second Focus Test',
        hardwareRequired: 'Astro FIT Tablet',
        instruction:
          'Tap the screen as fast as you can when the blue box appears. Slower taps mean your brain is getting tired.',
      },
      {
        stepNumber: 3,
        title: 'Log Last Night’s Sleep & Mood',
        hardwareRequired: 'Sleep Watch · Mood Rating',
        instruction:
          'Record your hours slept from your wrist tracker and pick an honest 1–10 score for how sharp and rested you feel.',
      },
    ],
  },
  cardiovascular: {
    displayName: 'Heart & Blood Flow',
    anatomicalRegionLabel: 'Chest & Circulation',
    whyItMattersInSpace:
      'Without gravity pulling blood down to your legs, extra fluid moves into your chest and head. Blood volume drops, which can cause dizziness when landing on the Moon or Mars.',
    selfExamProtocolName: '3-Step Heart, Blood Pressure & Sugar Check',
    selfExamSteps: [
      {
        stepNumber: 1,
        title: 'Measure Blood Pressure',
        hardwareRequired: 'Wireless Arm Cuff · Foot Strap',
        instruction:
          'Hook your feet into a floor strap so you stay still, wrap the cuff snugly around your upper arm at heart level, and relax for 60 seconds.',
      },
      {
        stepNumber: 2,
        title: 'Quick Heart Ultrasound',
        hardwareRequired: 'Handheld Ultrasound Probe · Gel',
        instruction:
          'Put warm gel on the probe and hold it against the left side of your chest to see your heart pumping cleanly.',
      },
      {
        stepNumber: 3,
        title: 'Check Blood Sugar',
        hardwareRequired: 'Fingerstick Meter · Alcohol Wipe',
        instruction:
          'Wipe your fingertip, prick lightly, and touch the test strip to the blood drop to log your energy sugar level.',
      },
    ],
  },
  musculoskeletal: {
    displayName: 'Bones & Muscles',
    anatomicalRegionLabel: 'Spine, Hips & Legs',
    whyItMattersInSpace:
      'Floating all day means your leg and back bones do not carry weight. Astronauts lose 1%–1.5% of bone strength every month unless they lift weights daily.',
    selfExamProtocolName: '3-Step Bone Strength & Workout Check',
    selfExamSteps: [
      {
        stepNumber: 1,
        title: 'Run Heel Ultrasound Bone Scan',
        hardwareRequired: 'Portable Heel Bone Scanner',
        instruction:
          'Place your right heel into the padded ultrasound cup for 45 seconds to measure current bone strength.',
      },
      {
        stepNumber: 2,
        title: 'Check Back & Hip Flexibility',
        hardwareRequired: 'Wall Handhold',
        instruction:
          'Hold a wall bar and gently stretch your lower back and bend each knee, noting any stiffness or sharp soreness.',
      },
      {
        stepNumber: 3,
        title: 'Check ARED Workout Weights',
        hardwareRequired: 'ARED Weight Machine',
        instruction:
          'Make sure the resistance machine resistance setting matches your daily strength workout target.',
      },
    ],
  },
  radiation_immune: {
    displayName: 'Radiation & Immune Shield',
    anatomicalRegionLabel: 'Full-Body Protection & Fever',
    whyItMattersInSpace:
      'Outside Earth’s atmosphere, cosmic rays and solar storms pass through spacecraft walls. Over time this weakens immune defenses and raises cancer risk.',
    selfExamProtocolName: '3-Step Radiation Badge & Fever Check',
    selfExamSteps: [
      {
        stepNumber: 1,
        title: 'Check Personal Radiation Badge',
        hardwareRequired: 'Chest Radiation Badge · Ship Sensor',
        instruction:
          'Read your cumulative mSv badge number and confirm it matches the ship’s wall radiation monitor.',
      },
      {
        stepNumber: 2,
        title: 'Take Forehead Temperature',
        hardwareRequired: 'Digital Forehead Thermometer',
        instruction:
          'Scan your forehead twice (30 seconds apart) away from air vents to make sure you do not have a fever.',
      },
      {
        stepNumber: 3,
        title: 'Check Neck & Skin',
        hardwareRequired: 'Cabin Mirror · Flashlight',
        instruction:
          'Check your neck for swollen glands and inspect your skin for rashes or irritation from recycled cabin air.',
      },
    ],
  },
};

export interface DiagnosticScanFinding {
  scanType: 'ocular_sans' | 'musculoskeletal_qus' | 'cardiac_echo';
  scanLabel: string;
  targetSystem: BodySystemId;
  severity: ClinicalStatus;
  summary: string;
  capturedAtIso: string;
  uploadedFileName?: string;
}

export interface EvaluationOptions {
  completedRoutineIds?: string[];
  completedCountermeasures?: string[];
  scanFinding?: DiagnosticScanFinding | null;
}

export interface DailyRoutineTask {
  id: string;
  title: string;
  targetSystem: BodySystemId;
  durationLabel: string;
  readinessPoints: number;
  description: string;
}

export const DAILY_ROUTINE_TASKS: DailyRoutineTask[] = [
  {
    id: 'routine-cv-check',
    title: 'Morning Heart & Blood Pressure Check',
    targetSystem: 'cardiovascular',
    durationLabel: '10 min',
    readinessPoints: 6,
    description: 'Check resting pulse and blood pressure, plus drink 500 mL of hydration mix.',
  },
  {
    id: 'routine-ared-workout',
    title: '2-Hour Strength & Cardio Workout',
    targetSystem: 'musculoskeletal',
    durationLabel: '120 min',
    readinessPoints: 8,
    description: 'Do squats, deadlifts, and treadmill running to keep bones and muscles strong.',
  },
  {
    id: 'routine-rad-sync',
    title: 'Daily Radiation Badge Check',
    targetSystem: 'radiation_immune',
    durationLabel: '5 min',
    readinessPoints: 5,
    description: 'Compare your wearable badge against cabin sensors and check storm shelter readiness.',
  },
  {
    id: 'routine-circadian-mood',
    title: 'Evening Sleep & Mood Check-In',
    targetSystem: 'neuro_behavioral',
    durationLabel: '15 min',
    readinessPoints: 6,
    description: 'Dim cabin lights before sleep, check air quality, and log your mood & focus.',
  },
];

export function evaluateMissionTelemetry(
  environmentId: MissionEnvironmentId,
  reading: BiomarkerReading,
  options: EvaluationOptions = {}
): MissionEvaluationReport {
  const {
    completedRoutineIds = [],
    completedCountermeasures = [],
    scanFinding = null,
  } = options;
  const environment = MISSION_ENVIRONMENTS[environmentId];
  const biomarkerEvaluations = {} as Record<BiomarkerKey, BiomarkerEvaluation>;

  (Object.keys(reading) as BiomarkerKey[]).forEach((key) => {
    const range = environment.baselines[key];
    const value = reading[key];
    const status = classifyBiomarker(value, range);
    const nominalCenter = (range.nominalMin + range.nominalMax) / 2;

    biomarkerEvaluations[key] = {
      key,
      label: range.label,
      value,
      unit: range.unit,
      precision: range.precision,
      status,
      nominalRangeText: `${range.nominalMin.toFixed(range.precision)}–${range.nominalMax.toFixed(range.precision)} ${range.unit}`,
      deltaFromNominalCenter: Number((value - nominalCenter).toFixed(2)),
      systemId: BIOMARKER_TO_SYSTEM[key],
      linkedHazards: BIOMARKER_HAZARD_MAP[key],
      spacePhysiologySummary: BIOMARKER_SPACE_EXPLANATIONS[key],
    };
  });

  const systemIds: BodySystemId[] = [
    'neuro_behavioral',
    'cardiovascular',
    'musculoskeletal',
    'radiation_immune',
  ];

  const systemPrefixMap: Record<BodySystemId, string> = {
    neuro_behavioral: 'nb-',
    cardiovascular: 'cv-',
    musculoskeletal: 'ms-',
    radiation_immune: 'ri-',
  };

  const systemEvaluations = {} as Record<BodySystemId, BodySystemEvaluation>;
  const allCountermeasures: CountermeasureAction[] = [];
  const activeHazards = new Set<NasaHazard>();

  systemIds.forEach((sysId) => {
    const meta = SYSTEM_METADATA[sysId];
    const sysBiomarkers = (Object.values(biomarkerEvaluations) as BiomarkerEvaluation[]).filter(
      (b) => b.systemId === sysId
    );
    let sysStatus = worstStatus(sysBiomarkers.map((b) => b.status));

    // Compound NASA HRP multi-system escalation rules:
    if (
      sysId === 'radiation_immune' &&
      biomarkerEvaluations.cumulativeRadiation.status === 'CAUTION' &&
      biomarkerEvaluations.sleepHours.status !== 'NOMINAL' &&
      biomarkerEvaluations.heartRate.status !== 'NOMINAL'
    ) {
      sysStatus = 'CRITICAL';
    }

    // Apply diagnostic scan finding if it targets this body system and is more severe
    if (scanFinding && scanFinding.targetSystem === sysId) {
      if (scanFinding.severity === 'CRITICAL') {
        sysStatus = 'CRITICAL';
      } else if (scanFinding.severity === 'CAUTION' && sysStatus === 'NOMINAL') {
        sysStatus = 'CAUTION';
      }
    }

    const countermeasures = buildSystemCountermeasures(
      sysId,
      sysStatus,
      environment,
      biomarkerEvaluations
    );

    const matchingRoutineDone = DAILY_ROUTINE_TASKS.some(
      (task) => task.targetSystem === sysId && completedRoutineIds.includes(task.id)
    );
    const matchingCountermeasureDone = countermeasures.some((cm) =>
      completedCountermeasures.includes(cm.id)
    );
    const prefixDone = completedCountermeasures.some((id) =>
      id.startsWith(systemPrefixMap[sysId])
    );

    let resolvedViaCountermeasure = false;
    if (
      sysStatus === 'CAUTION' &&
      (matchingRoutineDone || matchingCountermeasureDone || prefixDone)
    ) {
      sysStatus = 'NOMINAL';
      resolvedViaCountermeasure = true;
    }

    const sysHazards = Array.from(
      new Set(sysBiomarkers.flatMap((b) => b.linkedHazards))
    );

    if (sysStatus !== 'NOMINAL') {
      sysBiomarkers.forEach((b) => {
        if (b.status !== 'NOMINAL') {
          b.linkedHazards.forEach((h) => activeHazards.add(h));
        }
      });
    }

    const abnormalList = sysBiomarkers.filter((b) => b.status !== 'NOMINAL');
    let clinicalFindingSummary =
      abnormalList.length === 0
        ? `All ${meta.displayName.toLowerCase()} readings are within safe ${environment.shortName} limits.`
        : `${abnormalList.map((b) => `${b.label} (${b.value.toFixed(b.precision)} ${b.unit} · ${b.status})`).join('; ')} outside the safe ${environment.shortName} range.`;

    if (scanFinding && scanFinding.targetSystem === sysId) {
      clinicalFindingSummary = `${scanFinding.scanLabel}: ${scanFinding.summary} ${clinicalFindingSummary}`;
    }

    if (resolvedViaCountermeasure) {
      clinicalFindingSummary = `Warning cleared after completing daily health or recovery step. ${clinicalFindingSummary}`;
    }

    countermeasures.forEach((cm) => allCountermeasures.push(cm));

    systemEvaluations[sysId] = {
      systemId: sysId,
      displayName: meta.displayName,
      anatomicalRegionLabel: meta.anatomicalRegionLabel,
      status: sysStatus,
      primaryHazards: sysHazards,
      biomarkers: sysBiomarkers,
      whyItMattersInSpace: meta.whyItMattersInSpace,
      clinicalFindingSummary,
      selfExamProtocolName: meta.selfExamProtocolName,
      selfExamSteps: meta.selfExamSteps,
      countermeasures,
    };
  });

  const overallStatus = worstStatus(systemIds.map((id) => systemEvaluations[id].status));

  const priorityRank: Record<CountermeasureAction['priority'], number> = {
    IMMEDIATE: 0,
    ELEVATED: 1,
    ROUTINE: 2,
  };

  const prioritizedCountermeasures = [...allCountermeasures].sort(
    (a, b) => priorityRank[a.priority] - priorityRank[b.priority]
  );

  const earthCommsStatusLabel = environment.autonomousModeRequired
    ? `${environment.earthDelayLabel} — Onboard Self-Care Active`
    : `${environment.earthDelayLabel} — Live Earth Doctor Link`;

  return {
    environment,
    reading,
    overallStatus,
    autonomousModeActive: environment.autonomousModeRequired,
    earthCommsStatusLabel,
    biomarkerEvaluations,
    systemEvaluations,
    prioritizedCountermeasures,
    activeHazardCount: activeHazards.size,
    evaluatedAtIso: new Date().toISOString(),
  };
}

function build14DaySeries(
  startDayOffset: number,
  generator: (dayIdx: number) => { readings: BiomarkerReading; eventNote?: string }
): DailyTelemetryPoint[] {
  const baseDate = new Date('2026-11-01T08:00:00Z').getTime();
  return Array.from({ length: 14 }, (_, idx) => {
    const dayNumber = idx + 1;
    const missionSol = startDayOffset + idx;
    const { readings, eventNote } = generator(idx);
    return {
      day: dayNumber,
      missionDayLabel: `MD ${missionSol}`,
      timestampIso: new Date(baseDate + idx * 86400_000).toISOString(),
      readings,
      eventNote,
    };
  });
}

export const MISSION_SCENARIOS: Record<ScenarioId, MissionScenarioPreset> = {
  nominal_iss: {
    id: 'nominal_iss',
    code: 'SCN-A',
    name: 'Scenario A: Healthy ISS Orbit',
    subtitle: 'Normal day in orbit · All body systems healthy',
    recommendedEnvironment: 'iss_orbit',
    missionElapsedTimeStart: 'DAY 042 · 14:22:09',
    description:
      'Normal day aboard the International Space Station with regular workouts, steady sleep, and live Earth communication.',
    triggerReading: {
      heartRate: 68,
      systolicBP: 118,
      diastolicBP: 74,
      bloodGlucose: 92,
      bodyTemp: 36.7,
      sleepHours: 7.4,
      cumulativeRadiation: 14.2,
      boneDensityIndex: -0.22,
      moodCognitiveScore: 8.6,
    },
    timeSeries14Day: build14DaySeries(29, (i) => ({
      readings: {
        heartRate: Math.round(66 + Math.sin(i * 0.7) * 3),
        systolicBP: Math.round(116 + Math.cos(i * 0.5) * 4),
        diastolicBP: Math.round(73 + Math.sin(i * 0.6) * 3),
        bloodGlucose: Math.round(90 + Math.sin(i * 0.9) * 5),
        bodyTemp: Number((36.6 + Math.sin(i * 0.4) * 0.15).toFixed(1)),
        sleepHours: Number((7.3 + Math.cos(i * 0.8) * 0.35).toFixed(1)),
        cumulativeRadiation: Number((10.3 + i * 0.3).toFixed(1)),
        boneDensityIndex: Number((-0.2 - i * 0.001).toFixed(2)),
        moodCognitiveScore: Number((8.5 + Math.sin(i * 0.5) * 0.3).toFixed(1)),
      },
      eventNote: i === 6 ? 'Weekly exercise fitness check' : i === 13 ? 'All readings healthy' : undefined,
    })),
  },

  mars_spe: {
    id: 'mars_spe',
    code: 'SCN-B',
    name: 'Scenario B: Mars Trip — Solar Storm',
    subtitle: 'High radiation spike, poor sleep & fast heart rate with 18m 42s Earth delay',
    recommendedEnvironment: 'mars_transit',
    missionElapsedTimeStart: 'DAY 118 · 07:45:18',
    description:
      'A strong solar flare sends a wave of radiation toward the Mars ship. Because messages to Earth take 18+ minutes, the crew must take shelter right away.',
    triggerReading: {
      heartRate: 109,
      systolicBP: 146,
      diastolicBP: 92,
      bloodGlucose: 136,
      bodyTemp: 37.8,
      sleepHours: 4.1,
      cumulativeRadiation: 168.5,
      boneDensityIndex: -0.82,
      moodCognitiveScore: 4.6,
    },
    timeSeries14Day: build14DaySeries(105, (i) => {
      const speOnset = i >= 10;
      const ramp = speOnset ? i - 9 : 0; // 1..4
      return {
        readings: {
          heartRate: Math.round(72 + (speOnset ? ramp * 9.2 : Math.sin(i) * 3)),
          systolicBP: Math.round(122 + (speOnset ? ramp * 6 : Math.cos(i) * 3)),
          diastolicBP: Math.round(77 + (speOnset ? ramp * 3.8 : 0)),
          bloodGlucose: Math.round(98 + (speOnset ? ramp * 9.5 : 2)),
          bodyTemp: Number((36.8 + (speOnset ? ramp * 0.25 : 0)).toFixed(1)),
          sleepHours: Number((7.0 - (speOnset ? ramp * 0.72 : 0)).toFixed(1)),
          cumulativeRadiation: Number((58.0 + i * 1.4 + (speOnset ? ramp * 22.8 : 0)).toFixed(1)),
          boneDensityIndex: Number((-0.72 - i * 0.008).toFixed(2)),
          moodCognitiveScore: Number((7.8 - (speOnset ? ramp * 0.8 : 0)).toFixed(1)),
        },
        eventNote:
          i === 10
            ? 'Solar Flare Alert detected'
            : i === 13
            ? 'Peak solar storm · Crew in shelter'
            : undefined,
      };
    }),
  },

  lunar_eva_strain: {
    id: 'lunar_eva_strain',
    code: 'SCN-C',
    name: 'Scenario C: Moon Walk — Heat & Dehydration',
    subtitle: 'High pulse, low blood sugar & mild fever after long Moonwalk',
    recommendedEnvironment: 'lunar_base',
    missionElapsedTimeStart: 'DAY 019 · 19:08:52',
    description:
      'After a tiring 6.5-hour Moonwalk at the South Pole crater, body temperature and heart rate rise while fluids and blood sugar run low.',
    triggerReading: {
      heartRate: 116,
      systolicBP: 145,
      diastolicBP: 93,
      bloodGlucose: 63,
      bodyTemp: 37.8,
      sleepHours: 5.7,
      cumulativeRadiation: 38.4,
      boneDensityIndex: -0.45,
      moodCognitiveScore: 6.4,
    },
    timeSeries14Day: build14DaySeries(6, (i) => {
      const evaPush = i >= 11;
      const delta = evaPush ? i - 10 : 0;
      return {
        readings: {
          heartRate: Math.round(74 + (evaPush ? delta * 14 : Math.sin(i) * 4)),
          systolicBP: Math.round(121 + (evaPush ? delta * 8 : 2)),
          diastolicBP: Math.round(78 + (evaPush ? delta * 5 : 1)),
          bloodGlucose: Math.round(91 - (evaPush ? delta * 9.3 : Math.sin(i) * 3)),
          bodyTemp: Number((36.8 + (evaPush ? delta * 0.33 : 0.1)).toFixed(1)),
          sleepHours: Number((6.9 - (evaPush ? delta * 0.4 : 0)).toFixed(1)),
          cumulativeRadiation: Number((26.0 + i * 0.95).toFixed(1)),
          boneDensityIndex: Number((-0.42 - i * 0.002).toFixed(2)),
          moodCognitiveScore: Number((7.9 - (evaPush ? delta * 0.5 : 0)).toFixed(1)),
        },
        eventNote:
          i === 11
            ? 'Long Moonwalk started'
            : i === 13
            ? 'Fast pulse & low sugar after walk'
            : undefined,
      };
    }),
  },

  day_180_confinement: {
    id: 'day_180_confinement',
    code: 'SCN-D',
    name: 'Scenario D: Day 180 — Isolation & Bone Loss',
    subtitle: '6 months in deep space · Fatigue, poor sleep & weaker bones',
    recommendedEnvironment: 'mars_transit',
    missionElapsedTimeStart: 'DAY 180 · 03:11:44',
    description:
      'Six months into deep space, being far from Earth with broken sleep and zero gravity leads to stress, low mood, and steady bone loss.',
    triggerReading: {
      heartRate: 84,
      systolicBP: 129,
      diastolicBP: 85,
      bloodGlucose: 138,
      bodyTemp: 36.9,
      sleepHours: 4.5,
      cumulativeRadiation: 112.0,
      boneDensityIndex: -1.68,
      moodCognitiveScore: 3.8,
    },
    timeSeries14Day: build14DaySeries(167, (i) => ({
      readings: {
        heartRate: Math.round(74 + i * 0.75),
        systolicBP: Math.round(120 + i * 0.65),
        diastolicBP: Math.round(78 + i * 0.52),
        bloodGlucose: Math.round(106 + i * 2.4),
        bodyTemp: Number((36.7 + (i > 9 ? 0.2 : 0)).toFixed(1)),
        sleepHours: Number((6.1 - i * 0.12).toFixed(1)),
        cumulativeRadiation: Number((99.0 + i * 1.0).toFixed(1)),
        boneDensityIndex: Number((-1.26 - i * 0.032).toFixed(2)),
        moodCognitiveScore: Number((6.4 - i * 0.2).toFixed(1)),
      },
      eventNote:
        i === 7
          ? 'Earth no longer visible as a disc'
          : i === 13
          ? 'Bone strength & focus warning'
          : undefined,
    })),
  },
};

export function generateLiveMicroVariation(base: BiomarkerReading): BiomarkerReading {
  const jitter = (val: number, amplitude: number, decimals = 0) => {
    const offset = (Math.random() - 0.5) * 2 * amplitude;
    return Number((val + offset).toFixed(decimals));
  };
  return {
    ...base,
    heartRate: Math.max(38, Math.round(jitter(base.heartRate, 2, 0))),
    systolicBP: Math.max(75, Math.round(jitter(base.systolicBP, 2, 0))),
    diastolicBP: Math.max(45, Math.round(jitter(base.diastolicBP, 1, 0))),
    bodyTemp: jitter(base.bodyTemp, 0.05, 1),
  };
}

export interface MissionReadinessSummary {
  score: number; // 0-100
  tierLabel: 'Spacewalk Ready' | 'Mission Ready' | 'Watch Closely' | 'Rest Needed';
  routineCompletionRatio: string;
  allRoutineDone: boolean;
}

export function computeMissionReadiness(
  report: MissionEvaluationReport,
  completedRoutineIds: string[],
  completedCountermeasures: string[]
): MissionReadinessSummary {
  // Base physiological score starts at 75; system states adjust +/- and daily routine adds up to +25
  let physScore = 75;
  (Object.values(report.systemEvaluations) as BodySystemEvaluation[]).forEach((sys) => {
    if (sys.status === 'CAUTION') physScore -= 8;
    if (sys.status === 'CRITICAL') physScore -= 18;
  });

  const routinePoints = DAILY_ROUTINE_TASKS.reduce(
    (sum, task) => (completedRoutineIds.includes(task.id) ? sum + task.readinessPoints : sum),
    0
  );

  const countermeasureBonus = Math.min(10, completedCountermeasures.length * 3);
  const rawScore = Math.max(12, Math.min(100, physScore + routinePoints + countermeasureBonus));

  let tierLabel: MissionReadinessSummary['tierLabel'] = 'Watch Closely';
  if (rawScore >= 90 && report.overallStatus === 'NOMINAL') {
    tierLabel = 'Spacewalk Ready';
  } else if (rawScore >= 75 && report.overallStatus !== 'CRITICAL') {
    tierLabel = 'Mission Ready';
  } else if (rawScore < 55 || report.overallStatus === 'CRITICAL') {
    tierLabel = 'Rest Needed';
  }

  return {
    score: rawScore,
    tierLabel,
    routineCompletionRatio: `${completedRoutineIds.length}/${DAILY_ROUTINE_TASKS.length}`,
    allRoutineDone: completedRoutineIds.length === DAILY_ROUTINE_TASKS.length,
  };
}

export function generateLocalFlightSurgeonReply(
  question: string,
  report: MissionEvaluationReport,
  readinessScore: number
): string {
  const q = question.toLowerCase();
  const r = report.reading;
  const env = report.environment;
  const sys = report.systemEvaluations;
  const showStatus = (s: ClinicalStatus) => (s === 'NOMINAL' ? 'NORMAL' : s);

  if (q.includes('heart rate') || q.includes('tachycardia') || q.includes('bp') || q.includes('blood pressure')) {
    return [
      `Heart & Blood Pressure Check (${env.shortName}): Your heart rate is ${r.heartRate} bpm and blood pressure is ${r.systolicBP}/${r.diastolicBP} mmHg (Status: ${showStatus(sys.cardiovascular.status)}).`,
      '',
      'Why This Happens in Space:',
      '• Without gravity pulling blood down, fluids shift toward your head and blood volume drops 10–15%.',
      '• Heavy spacewalks or mild dehydration make your heart beat faster to keep blood moving.',
      '',
      'What To Do Right Now:',
      '• Drink 750 mL of electrolyte water slowly over 45 minutes.',
      '• Hook your feet in floor straps, rest 30 minutes, and re-check your blood pressure.',
      '• Tell the Crew Medical Officer if your resting heart rate stays above 110 bpm or you feel dizzy.',
    ].join('\n');
  }

  if (q.includes('ultrasound') || q.includes('echo') || q.includes('cardiac')) {
    return [
      `Simple Heart Ultrasound Guide (${env.shortName}):`,
      `Current readings: Heart Rate ${r.heartRate} bpm · Blood Pressure ${r.systolicBP}/${r.diastolicBP} mmHg · Health Score ${readinessScore}%.`,
      '',
      'Step-by-Step Guide:',
      '1. Lock your feet in floor straps so pushing the probe does not float you backward.',
      '2. Put warm gel on the handheld probe and place it on the left side of your chest.',
      '3. Record a 5-second video clip showing your heart chambers pumping.',
      '4. Slide the probe just below your ribs to check hydration in the main vein.',
      '5. Save the scan inside "Checkup & Log → Body Scan Check" for onboard review.',
    ].join('\n');
  }

  if (q.includes('radiation') || q.includes('spe') || q.includes('msv') || q.includes('shelter')) {
    return [
      `Radiation & Immune Check (${env.shortName} · ${env.earthDelayLabel}):`,
      `Your total radiation dose is ${r.cumulativeRadiation.toFixed(1)} mSv (Safe limit: ${env.baselines.cumulativeRadiation.nominalMax} mSv · Status: ${showStatus(sys.radiation_immune.status)}). Body temp is ${r.bodyTemp.toFixed(1)}°C.`,
      '',
      'Safety Steps:',
      '• Move inside the water-lined storm shelter in the middle of the ship until solar storm radiation drops.',
      '• Compare your wearable badge reading against the ship’s wall radiation sensor.',
      '• Drink 2.5+ L of water daily and watch for fever or changes in white blood cell counts.',
    ].join('\n');
  }

  if (q.includes('sans') || q.includes('optic') || q.includes('eye') || q.includes('sleep') || q.includes('mood') || q.includes('fatigue')) {
    return [
      `Brain, Sleep & Vision Check (${env.shortName}):`,
      `Sleep is ${r.sleepHours.toFixed(1)} hrs and Mood & Focus score is ${r.moodCognitiveScore.toFixed(1)}/10 (Status: ${showStatus(sys.neuro_behavioral.status)}).`,
      '',
      'Easy Self-Check Steps:',
      '• Look at the eye grid card and run an eye ultrasound if your vision feels blurry.',
      '• Sit in bright blue-enriched morning light for 45 minutes and make sure cabin CO2 is low.',
      '• Take the 15-second Focus Test inside "Checkup & Log" to see how fast you are reacting.',
    ].join('\n');
  }

  if (q.includes('bone') || q.includes('ared') || q.includes('muscle') || q.includes('skeletal')) {
    return [
      `Bones & Muscles Check (${env.shortName}):`,
      `Current Bone Strength Score is ${r.boneDensityIndex.toFixed(2)} T-score (Status: ${showStatus(sys.musculoskeletal.status)}).`,
      '',
      'Daily Recovery Steps:',
      '• Complete your 2-hour strength workout on the ARED weight machine (squats, deadlifts, heel raises).',
      '• Take daily Vitamin D3 (1,000 IU) and Calcium (1,200 mg) with 2.8 L of water.',
      '• Log a Heel Bone Scan in "Checkup & Log" to track weekly bone strength.',
    ].join('\n');
  }

  return [
    `Astro FIT Health Summary (${env.name} · ${env.earthDelayLabel}):`,
    `• Overall Health: ${showStatus(report.overallStatus)} | Health Score: ${readinessScore}%`,
    `• Heart & Blood: ${r.heartRate} bpm · ${r.systolicBP}/${r.diastolicBP} mmHg (${showStatus(sys.cardiovascular.status)})`,
    `• Radiation & Immune: ${r.cumulativeRadiation.toFixed(1)} mSv · ${r.bodyTemp.toFixed(1)}°C (${showStatus(sys.radiation_immune.status)})`,
    `• Brain, Sleep & Mood: ${r.sleepHours.toFixed(1)}h sleep · ${r.moodCognitiveScore.toFixed(1)}/10 focus (${showStatus(sys.neuro_behavioral.status)})`,
    `• Bones & Muscles: ${r.boneDensityIndex.toFixed(2)} T-score (${showStatus(sys.musculoskeletal.status)})`,
    '',
    report.prioritizedCountermeasures[0]
      ? `Top Action Right Now: ${report.prioritizedCountermeasures[0].title} — ${report.prioritizedCountermeasures[0].instruction}`
      : 'All body systems look healthy right now.',
  ].join('\n');
}

export interface PredictiveTrajectoryAlert {
  metricKey: BiomarkerKey;
  chartGroup: 'cardiovascular' | 'radiation' | 'sleep_mood';
  targetSystem: BodySystemId;
  label: string;
  unit: string;
  precision: number;
  currentValue: number;
  dailySlope: number;
  horizonDays: number;
  projectedSeries: number[]; // +1d..+5d forecast values
  severity: 'CAUTION' | 'CRITICAL';
  daysUntilBreach: number; // 0 if already breached & worsening, otherwise 0.1..5.0
  thresholdValue: number;
  headline: string;
  detail: string;
}

export interface TrajectoryForecastBundle {
  horizonDays: number;
  alerts: PredictiveTrajectoryAlert[];
  forecastsByMetric: Record<
    'heartRate' | 'systolicBP' | 'cumulativeRadiation' | 'sleepHours' | 'moodCognitiveScore',
    {
      dailySlope: number;
      projectedSeries: number[];
      severity: ClinicalStatus;
      breachDayOffset: number | null; // 0..5 within horizon
      thresholdValue: number | null;
    }
  >;
}

function computeRecentSlope(values: number[]): number {
  // Linear least-squares slope over the last up to 5 points to capture acute mission ramps
  const window = values.slice(-5);
  const n = window.length;
  if (n < 2) return 0;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += window[i];
    sumXY += i * window[i];
    sumXX += i * i;
  }
  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) return 0;
  return (n * sumXY - sumX * sumY) / denom;
}

export function computePredictiveTrajectoryAlerts(
  series: DailyTelemetryPoint[],
  environment: MissionEnvironmentProfile,
  liveReadings?: BiomarkerReading
): TrajectoryForecastBundle {
  const horizonDays = 5;
  const effectiveSeries = series.map((pt, idx) =>
    liveReadings && idx === series.length - 1 ? liveReadings : pt.readings
  );

  type MonitoredMetric =
    | 'heartRate'
    | 'systolicBP'
    | 'cumulativeRadiation'
    | 'sleepHours'
    | 'moodCognitiveScore';

  const specs: Array<{
    key: MonitoredMetric;
    direction: 'upper' | 'lower';
    chartGroup: PredictiveTrajectoryAlert['chartGroup'];
  }> = [
    { key: 'cumulativeRadiation', direction: 'upper', chartGroup: 'radiation' },
    { key: 'heartRate', direction: 'upper', chartGroup: 'cardiovascular' },
    { key: 'systolicBP', direction: 'upper', chartGroup: 'cardiovascular' },
    { key: 'sleepHours', direction: 'lower', chartGroup: 'sleep_mood' },
    { key: 'moodCognitiveScore', direction: 'lower', chartGroup: 'sleep_mood' },
  ];

  const alerts: PredictiveTrajectoryAlert[] = [];
  const forecastsByMetric = {} as TrajectoryForecastBundle['forecastsByMetric'];

  specs.forEach(({ key, direction, chartGroup }) => {
    const range = environment.baselines[key];
    const values = effectiveSeries.map((r) => r[key]);
    const currentValue = values[values.length - 1] ?? 0;
    const rawSlope = computeRecentSlope(values);
    // For cumulative radiation, slope cannot physically decrease
    const dailySlope = key === 'cumulativeRadiation' ? Math.max(0, rawSlope) : rawSlope;

    const projectedSeries = Array.from({ length: horizonDays }, (_, idx) => {
      const val = currentValue + dailySlope * (idx + 1);
      if (key === 'sleepHours') return Math.max(1.5, Math.min(12, val));
      if (key === 'moodCognitiveScore') return Math.max(1, Math.min(10, val));
      if (key === 'cumulativeRadiation') return Math.max(0, val);
      return Math.max(30, val);
    });

    const cautionLimit = direction === 'upper' ? range.nominalMax : range.nominalMin;
    const criticalLimit = direction === 'upper' ? range.cautionMax : range.cautionMin;

    const isWorsening =
      direction === 'upper' ? dailySlope > 0.05 : dailySlope < -0.04;

    const isCurrentlyCritical =
      direction === 'upper' ? currentValue > criticalLimit : currentValue < criticalLimit;
    const isCurrentlyCaution =
      direction === 'upper' ? currentValue > cautionLimit : currentValue < cautionLimit;

    let severity: ClinicalStatus = 'NOMINAL';
    let breachDayOffset: number | null = null;
    let thresholdValue: number | null = null;

    if (isCurrentlyCritical) {
      severity = 'CRITICAL';
      breachDayOffset = 0;
      thresholdValue = criticalLimit;
    } else if (isWorsening) {
      // Check when trajectory crosses criticalLimit or cautionLimit within +5 days
      const daysToCritical = (criticalLimit - currentValue) / dailySlope;
      const daysToCaution = (cautionLimit - currentValue) / dailySlope;

      if (daysToCritical > 0 && daysToCritical <= horizonDays) {
        severity = 'CRITICAL';
        breachDayOffset = Number(daysToCritical.toFixed(1));
        thresholdValue = criticalLimit;
      } else if (isCurrentlyCaution) {
        severity = 'CAUTION';
        breachDayOffset = 0;
        thresholdValue = cautionLimit;
      } else if (daysToCaution > 0 && daysToCaution <= horizonDays) {
        severity = 'CAUTION';
        breachDayOffset = Number(daysToCaution.toFixed(1));
        thresholdValue = cautionLimit;
      }
    } else if (isCurrentlyCaution) {
      severity = 'CAUTION';
      breachDayOffset = 0;
      thresholdValue = cautionLimit;
    }

    forecastsByMetric[key] = {
      dailySlope,
      projectedSeries,
      severity,
      breachDayOffset,
      thresholdValue,
    };

    // Emit actionable predictive alert whenever trajectory is worsening toward or beyond a limit
    if (severity !== 'NOMINAL' && thresholdValue !== null && (isWorsening || isCurrentlyCritical || isCurrentlyCaution)) {
      const slopeSign = dailySlope >= 0 ? '+' : '';
      const slopeText = `${slopeSign}${dailySlope.toFixed(range.precision === 0 ? 1 : range.precision)} ${range.unit}/day`;
      const endForecast = projectedSeries[projectedSeries.length - 1];

      const headline =
        breachDayOffset === 0
          ? `${range.label} ${severity === 'CRITICAL' ? 'past safe limit' : 'above normal range'} (${slopeText})`
          : `${range.label} could cross ${thresholdValue.toFixed(range.precision)} ${range.unit} in ~${breachDayOffset}d`;

      const detail =
        breachDayOffset === 0
          ? `Now ${currentValue.toFixed(range.precision)} ${range.unit} · 5-day trend reaches ${endForecast.toFixed(range.precision)} ${range.unit}`
          : `At ${slopeText}, it could reach ${endForecast.toFixed(range.precision)} ${range.unit} in ${horizonDays} days (limit: ${thresholdValue.toFixed(range.precision)} ${range.unit}).`;

      alerts.push({
        metricKey: key,
        chartGroup,
        targetSystem: BIOMARKER_TO_SYSTEM[key],
        label: range.label,
        unit: range.unit,
        precision: range.precision,
        currentValue,
        dailySlope,
        horizonDays,
        projectedSeries,
        severity,
        daysUntilBreach: breachDayOffset ?? horizonDays,
        thresholdValue,
        headline,
        detail,
      });
    }
  });

  // Sort CRITICAL first, then soonest breach day
  alerts.sort((a, b) => {
    if (a.severity !== b.severity) {
      return a.severity === 'CRITICAL' ? -1 : 1;
    }
    return a.daysUntilBreach - b.daysUntilBreach;
  });

  return {
    horizonDays,
    alerts,
    forecastsByMetric,
  };
}


