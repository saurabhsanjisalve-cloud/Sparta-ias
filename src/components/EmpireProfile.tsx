import React, { useState } from 'react';
import { useEmpire } from '../context/EmpireContext';
import { SPARTAN_ASSETS } from '../data/assets';
import {
  User,
  Shield,
  Award,
  Flame,
  Clock,
  BookOpen,
  Sword,
  Target,
  Edit2,
  Check,
  RotateCcw
} from 'lucide-react';

export const EmpireProfile: React.FC = () => {
  const {
    profile,
    updateProfile,
    totalXp,
    warriorLevelData,
    militaryRank,
    streakDays,
    totalBattlesWon,
    completedLecturesCount,
    totalLectures,
    overallPercentage,
    notesCompletedCount,
    notesPercentage
  } = useEmpire();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.warriorName);
  const [year, setYear] = useState(profile.targetYear);
  const [optional, setOptional] = useState(profile.optionalSubject);
  const [motto, setMotto] = useState(profile.motto);

  const handleSave = () => {
    updateProfile({
      warriorName: name.trim() || 'Leonidas',
      targetYear: year.trim() || 'UPSC CSE 2026',
      optionalSubject: optional.trim() || 'Anthropology',
      motto: motto.trim() || 'With your shield, or on it.'
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-amber-900/40 pb-5">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-red-950/70 border border-red-700/50 text-red-300 text-[11px] font-cinzel font-bold mb-2">
          <User className="w-3.5 h-3.5 text-red-400" />
          <span>WARRIOR DOSSIER & SERVICE RECORD</span>
        </div>
        <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-amber-100">
          SPARTAN COMMANDER DOSSIER
        </h1>
        <p className="text-xs text-stone-400">
          Official military service credentials, rank insignia, and personal code of honor.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Warrior Card & Motto (5 cols) */}
        <div className="lg:col-span-5 spartan-card p-6 border-amber-900/40 space-y-6 text-center">
          <div className="relative mx-auto w-36 h-36 rounded-full spartan-gold-gradient p-1 shadow-2xl shadow-amber-950/80">
            <img
              src={SPARTAN_ASSETS.warriorAvatar}
              alt="Spartan Warrior"
              referrerPolicy="no-referrer"
              className="w-full h-full rounded-full object-cover border-2 border-stone-900"
            />
            <div className="absolute -bottom-2 inset-x-0 mx-auto w-max px-3 py-0.5 rounded-full bg-stone-950 border border-amber-500 text-amber-400 font-cinzel font-black text-xs">
              LVL {warriorLevelData.level}
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="font-cinzel text-xl font-black text-amber-200">
              {profile.warriorName}
            </h2>
            <div className="font-cinzel text-xs font-bold text-amber-500 uppercase tracking-widest">
              {militaryRank}
            </div>
            <p className="text-xs text-stone-400 italic pt-1">
              "{profile.motto}"
            </p>
          </div>

          <div className="p-3 rounded-lg bg-stone-900/80 border border-stone-800 text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-stone-400">Campaign Target:</span>
              <span className="font-semibold text-stone-200">{profile.targetYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Optional Battle Front:</span>
              <span className="font-semibold text-amber-400">{profile.optionalSubject}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Active Discipline Streak:</span>
              <span className="font-mono text-red-400 font-bold">{streakDays} Days</span>
            </div>
          </div>

          {/* Edit Profile Button / Form */}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-2.5 px-4 rounded bg-stone-900 hover:bg-stone-800 text-stone-200 font-cinzel font-semibold text-xs border border-stone-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Customize Warrior Dossier</span>
            </button>
          ) : (
            <div className="space-y-3 text-left text-xs bg-stone-900/90 p-4 rounded-lg border border-amber-700/50">
              <div>
                <label className="block text-stone-400 mb-1">Warrior Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-200"
                />
              </div>
              <div>
                <label className="block text-stone-400 mb-1">Target Exam Year</label>
                <input
                  type="text"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-200"
                />
              </div>
              <div>
                <label className="block text-stone-400 mb-1">Optional Subject</label>
                <input
                  type="text"
                  value={optional}
                  onChange={e => setOptional(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-200"
                />
              </div>
              <div>
                <label className="block text-stone-400 mb-1">Battle Motto / War Cry</label>
                <input
                  type="text"
                  value={motto}
                  onChange={e => setMotto(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-200"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 py-2 px-3 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-cinzel font-bold text-xs"
                >
                  Save Dossier
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="py-2 px-3 rounded bg-stone-800 text-stone-300 text-xs hover:bg-stone-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Service Record & Military Virtues (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="spartan-card p-6 border-amber-900/40 space-y-5">
            <h3 className="font-cinzel text-base font-bold text-amber-200 flex items-center gap-2 border-b border-stone-800 pb-3">
              <Shield className="w-5 h-5 text-amber-500" />
              <span>OFFICIAL SERVICE RECORD & ACADEMIC CONQUESTS</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-stone-900/80 border border-stone-800">
                <span className="text-stone-400 block text-[11px]">Cumulative XP</span>
                <span className="font-mono text-xl font-black text-amber-400">
                  {totalXp.toLocaleString()}
                </span>
                <span className="text-[10px] text-stone-500 block pt-0.5">
                  XP gained without duplicates
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-stone-900/80 border border-stone-800">
                <span className="text-stone-400 block text-[11px]">Total Battles Won</span>
                <span className="font-mono text-xl font-black text-stone-100">
                  {totalBattlesWon}
                </span>
                <span className="text-[10px] text-stone-500 block pt-0.5">
                  Lectures, notes & tests
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-stone-900/80 border border-stone-800">
                <span className="text-stone-400 block text-[11px]">Lectures Conquered</span>
                <span className="font-mono text-xl font-black text-emerald-400">
                  {completedLecturesCount} <span className="text-xs text-stone-500">/ {totalLectures}</span>
                </span>
                <span className="text-[10px] text-stone-500 block pt-0.5">
                  {(completedLecturesCount * 2.5).toFixed(1)} Hours invested
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-stone-900/80 border border-stone-800">
                <span className="text-stone-400 block text-[11px]">Notes Conquered</span>
                <span className="font-mono text-xl font-black text-amber-300">
                  {notesCompletedCount} <span className="text-xs text-stone-500">/ {totalLectures}</span>
                </span>
                <span className="text-[10px] text-stone-500 block pt-0.5">
                  {notesPercentage}% Syllabus coverage
                </span>
              </div>
            </div>

            {/* The Spartan Oath */}
            <div className="p-4 rounded-lg bg-stone-950/80 border border-red-900/40 text-stone-300 text-xs space-y-2">
              <span className="font-cinzel text-amber-400 font-bold block uppercase tracking-wider text-[11px]">
                The Spartan Oath of Knowledge
              </span>
              <p className="italic leading-relaxed text-stone-400">
                "I am a warrior building an empire through knowledge. Every lecture completed, note created, revision session, answer written, and MCQ solved contributes to the growth of my empire. No distraction shall breach our phalanx. Tonight, we fight. Tomorrow, we conquer."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
