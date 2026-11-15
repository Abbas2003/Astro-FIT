import React, { useEffect, useState } from 'react';
import { Activity, Check, ChevronRight } from 'lucide-react';

interface BootLoadingScreenProps {
  isHydrated: boolean;
  onComplete: () => void;
}

interface BootStep {
  id: string;
  code: string;
  label: string;
  threshold: number;
}

const BOOT_STEPS: BootStep[] = [
  {
    id: 'db',
    code: '01',
    label: 'MOUNTING INDEXEDDB SNAPSHOT STORE',
    threshold: 25,
  },
  {
    id: 'hrp',
    code: '02',
    label: 'CALIBRATING NASA HRP 5-HAZARDS ENGINE',
    threshold: 55,
  },
  {
    id: 'cad',
    code: '03',
    label: 'INITIALIZING CAD BIOMEDICAL SCHEMATIC',
    threshold: 80,
  },
  {
    id: 'surgeon',
    code: '04',
    label: 'LINKING FLIGHT SURGEON DECISION SUPPORT',
    threshold: 100,
  },
];

export const BootLoadingScreen: React.FC<BootLoadingScreenProps> = ({
  isHydrated,
  onComplete,
}) => {
  const [progress, setProgress] = useState(8);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setProgress(100);
      return;
    }

    const startTime = performance.now();
    const minBootDurationMs = 1750;
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const ratio = Math.min(1, elapsed / minBootDurationMs);
      // Ease-out curve capped at 92% until IndexedDB hydration settles
      const eased = 1 - Math.pow(1 - ratio, 2.2);
      const maxCap = isHydrated ? 100 : 92;
      const nextValue = Math.min(maxCap, Math.round(8 + eased * 92));
      setProgress(nextValue);

      if (nextValue < 100 || !isHydrated) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [isHydrated]);

  useEffect(() => {
    if (progress < 100 || !isHydrated || isExiting) return;
    const holdTimer = window.setTimeout(() => {
      setIsExiting(true);
    }, 220);
    return () => window.clearTimeout(holdTimer);
  }, [progress, isHydrated, isExiting]);

  useEffect(() => {
    if (!isExiting) return;
    const doneTimer = window.setTimeout(() => {
      onComplete();
    }, 260);
    return () => window.clearTimeout(doneTimer);
  }, [isExiting, onComplete]);

  const handleBypass = () => {
    setProgress(100);
    setIsExiting(true);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Initializing Astro FIT Flight Console"
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-[#090A0F] cad-grid-bg p-3 sm:p-6 transition-opacity duration-250 ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-full max-w-lg rounded-[6px] border border-[#232734] bg-[#11131A]">
        {/* Top Console Initialization Header */}
        <div className="flex items-center justify-between gap-3 border-b border-[#232734] bg-[#0D0F15] px-4 py-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <Activity className="h-3.5 w-3.5 text-[#2B7FFF] shrink-0" aria-hidden="true" />
            <span className="flight-micro-label text-white truncate">
              Astro FIT // Flight-Deck Telemetry Boot
            </span>
          </div>
          <span className="font-mono-tabular text-[10px] font-semibold text-[#2B7FFF] shrink-0">
            SEQ HRP-INIT
          </span>
        </div>

        {/* Emblem & System Status Body */}
        <div className="p-5 sm:p-6">
          <div className="flex flex-col items-center text-center">
            {/* Corner-Reticle Framed NASA Space Apps Challenge Emblem */}
            <div className="relative rounded-[6px] border border-[#232734] bg-[#090A0F] p-2">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-px -left-px h-3 w-3 border-t-2 border-l-2 border-[#2B7FFF]"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-px -right-px h-3 w-3 border-t-2 border-r-2 border-[#2B7FFF]"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 border-[#2B7FFF]"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 border-[#2B7FFF]"
              />

              <div className="h-36 w-36 sm:h-44 sm:w-44 overflow-hidden rounded-[4px] border border-[#1C202B] bg-[#040B24]">
                <img
                  src="/assets/aistudio/image_954bb082.png"
                  alt="NASA International Space Apps Challenge Emblem"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="mt-4">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Astro FIT
              </h1>
              <p className="mt-1 font-mono-tabular text-[11px] uppercase tracking-[0.08em] text-[#8E96AA]">
                Autonomous Deep-Space Biomedical Telemetry Console
              </p>
            </div>
          </div>

          {/* Subsystem Boot Checklist */}
          <div className="mt-5 rounded-[4px] border border-[#232734] bg-[#0D0F15] p-3 space-y-2">
            {BOOT_STEPS.map((step) => {
              const isDone = progress >= step.threshold;
              const isActive =
                !isDone &&
                progress >= step.threshold - 30;
              return (
                <div
                  key={step.id}
                  className="flex items-center justify-between gap-2 font-mono-tabular text-[11px]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[#8E96AA] shrink-0">{step.code} //</span>
                    <span
                      className={`truncate ${
                        isDone
                          ? 'text-[#E5E7EB]'
                          : isActive
                          ? 'text-white'
                          : 'text-[#8E96AA]/70'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  <span className="shrink-0 font-semibold">
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 text-[#10B981]">
                        <Check className="h-3 w-3" aria-hidden="true" />
                        OK
                      </span>
                    ) : isActive ? (
                      <span className="text-[#2B7FFF]">SYNC</span>
                    ) : (
                      <span className="text-[#3B4254]">WAIT</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar & Bypass Action */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between gap-2 font-mono-tabular text-[11px]">
              <span className="flight-micro-label">Telemetry Initialization</span>
              <span className="font-semibold text-white">{progress}%</span>
            </div>

            <div
              className="h-1.5 w-full overflow-hidden rounded-[2px] border border-[#232734] bg-[#090A0F]"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div
                className="h-full bg-[#2B7FFF] transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="font-mono-tabular text-[10px] text-[#8E96AA]">
                NASA HRP 5-HAZARDS // OFFLINE PWA READY
              </span>
              <button
                type="button"
                onClick={handleBypass}
                className="inline-flex items-center gap-1 rounded-[4px] border border-[#232734] bg-[#0D0F15] px-2.5 py-1 font-mono-tabular text-[10px] font-medium text-[#8E96AA] hover:border-[#2B7FFF] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2B7FFF]"
              >
                <span>ENTER CONSOLE</span>
                <ChevronRight className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
