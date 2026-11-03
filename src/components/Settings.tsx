import React, { useState, useRef } from 'react';
import { useEmpire } from '../context/EmpireContext';
import { spartanSound } from '../utils/audio';
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  RotateCcw,
  Volume2,
  VolumeX,
  Shield,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Database
} from 'lucide-react';

export const Settings: React.FC = () => {
  const {
    profile,
    updateProfile,
    includeExtendedModules,
    toggleExtendedModules,
    totalLectures,
    exportDataJson,
    importDataJson,
    resetAllProgress,
    totalXp,
    claimedRewardIds
  } = useEmpire();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataJson(content);
        if (success) {
          setImportStatus('Battle archive imported successfully! Glory restored.');
        } else {
          setImportStatus('Failed to parse battle archive. Invalid JSON format.');
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-amber-900/40 pb-5">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-amber-950/70 border border-amber-700/50 text-amber-300 text-[11px] font-cinzel font-bold mb-2">
          <SettingsIcon className="w-3.5 h-3.5 text-amber-400" />
          <span>EMPIRE CONFIGURATION & ARCHIVES</span>
        </div>
        <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-amber-100">
          WAR ROOM CONFIGURATION & DATA BACKUP
        </h1>
        <p className="text-xs text-stone-400">
          Manage local backups, import/export study progress, and tune audio/tactical settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup & Restore Section */}
        <div className="spartan-card p-6 border-amber-900/40 space-y-4">
          <h3 className="font-cinzel text-base font-bold text-amber-200 flex items-center gap-2 border-b border-stone-800 pb-3">
            <Database className="w-5 h-5 text-amber-500" />
            <span>DATA PERSISTENCE & PORTABILITY</span>
          </h3>

          <p className="text-xs text-stone-400 leading-relaxed">
            All your conquered lectures, notes, answer writings, and streak records are saved permanently in your browser. Export a JSON backup to transfer your progress between computers or safeguard your campaign.
          </p>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={exportDataJson}
              className="w-full py-2.5 px-4 rounded bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-700/50 text-xs font-cinzel font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Study Progress (JSON)</span>
            </button>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="w-full py-2.5 px-4 rounded bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs font-cinzel font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Import Study Progress</span>
              </label>
            </div>

            {importStatus && (
              <div className="p-3 rounded bg-stone-900 text-xs text-amber-300 font-mono border border-stone-800">
                {importStatus}
              </div>
            )}
          </div>
        </div>

        {/* Workload & Audio Configuration */}
        <div className="spartan-card p-6 border-amber-900/40 space-y-5">
          <h3 className="font-cinzel text-base font-bold text-amber-200 flex items-center gap-2 border-b border-stone-800 pb-3">
            <Layers className="w-5 h-5 text-red-400" />
            <span>SYLLABUS & AUDIO SETTINGS</span>
          </h3>

          {/* Workload module toggle */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-stone-200 block">
                  Full 979-Lecture Workload Mode
                </span>
                <span className="text-stone-400 text-[11px]">
                  Includes Essay & Mains Current Affairs extensions (2,447.5 total study hours).
                </span>
              </div>
              <button
                type="button"
                onClick={toggleExtendedModules}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  includeExtendedModules ? 'bg-amber-600' : 'bg-stone-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-stone-100 shadow ring-0 transition duration-200 ease-in-out ${
                    includeExtendedModules ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <div className="text-[10px] text-stone-500 font-mono">
              Active workload: {totalLectures} lectures ({(totalLectures * 2.5).toFixed(1)} hours)
            </div>
          </div>

          {/* Procedural Audio Toggle */}
          <div className="space-y-2 text-xs pt-3 border-t border-stone-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-stone-200 block">
                  Spartan Web Audio Synthesizer
                </span>
                <span className="text-stone-400 text-[11px]">
                  Tactile procedural sound effects: shield strikes, sword clashes, and victory horns.
                </span>
              </div>
              <button
                type="button"
                onClick={() => updateProfile({ soundEnabled: !profile.soundEnabled })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  profile.soundEnabled ? 'bg-red-700' : 'bg-stone-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-stone-100 shadow ring-0 transition duration-200 ease-in-out ${
                    profile.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => spartanSound.playShieldClick()}
                className="px-2.5 py-1 rounded bg-stone-900 border border-stone-700 text-stone-300 text-[11px] hover:text-amber-400"
              >
                Test Shield Strike
              </button>
              <button
                type="button"
                onClick={() => spartanSound.playSwordClash()}
                className="px-2.5 py-1 rounded bg-stone-900 border border-stone-700 text-stone-300 text-[11px] hover:text-amber-400"
              >
                Test Sword Clash
              </button>
              <button
                type="button"
                onClick={() => spartanSound.playWarHorn()}
                className="px-2.5 py-1 rounded bg-stone-900 border border-stone-700 text-stone-300 text-[11px] hover:text-amber-400"
              >
                Test War Horn
              </button>
            </div>
          </div>

          {/* Anti-Duplicate Exploit Verification */}
          <div className="p-3 rounded bg-stone-950/80 border border-stone-800/80 text-[11px] text-stone-400 space-y-1">
            <span className="text-stone-300 font-semibold block flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Anti-Duplicate XP Engine Active
            </span>
            <p>
              Rewards are tracked cryptographically via {claimedRewardIds.length} claimed action keys. Toggling completed status off and on cannot repeatedly farm XP.
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset Campaign Data */}
      <div className="spartan-card p-6 border-red-900/40 bg-stone-950/90 space-y-3">
        <h3 className="font-cinzel text-base font-bold text-red-400 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <span>DANGER ZONE: RESET EMPIRE PROGRESS</span>
        </h3>
        <p className="text-xs text-stone-400">
          This operation permanently resets all lecture progress, battle orders, and XP records to blank recruit status. Make sure to export your backup before proceeding.
        </p>

        {!confirmResetOpen ? (
          <button
            type="button"
            onClick={() => setConfirmResetOpen(true)}
            className="px-4 py-2 rounded bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-cinzel font-bold uppercase transition-colors"
          >
            Reset Campaign Data
          </button>
        ) : (
          <div className="p-4 rounded bg-red-950/80 border border-red-600 space-y-3 max-w-md">
            <p className="text-xs text-stone-200 font-bold">
              Are you sure, Spartan Commander? All conquered lectures will be wiped.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  resetAllProgress();
                  setConfirmResetOpen(false);
                }}
                className="px-4 py-1.5 rounded bg-red-700 hover:bg-red-600 text-stone-100 font-bold text-xs"
              >
                Yes, Reset All Progress
              </button>
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="px-4 py-1.5 rounded bg-stone-800 text-stone-300 text-xs hover:bg-stone-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
