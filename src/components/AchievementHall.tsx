import React from 'react';
import { useEmpire } from '../context/EmpireContext';
import { EMPIRE_STAGES } from '../data/achievements';
import { SPARTAN_ASSETS } from '../data/assets';
import {
  Trophy,
  Award,
  Shield,
  Sword,
  Flame,
  CheckCircle2,
  Lock,
  Crown,
  Sparkles,
  Zap
} from 'lucide-react';

export const AchievementHall: React.FC = () => {
  const {
    achievements,
    totalXp,
    overallPercentage,
    currentEmpireStage,
    warriorLevelData,
    militaryRank,
    subjects,
    lectures,
    streakDays
  } = useEmpire();

  // Check conquered subjects
  const conqueredSubjects = subjects.filter(s => {
    const list = lectures[s.id] || [];
    return list.length > 0 && list.every(l => l.status === 'completed');
  });

  // Warrior Armory Equipment items unlocked by stage/level
  const armoryItems = [
    {
      name: 'Iron Recruit Xiphos',
      slot: 'Sidearm',
      unlockRequirement: 'Level 1 (Recruit)',
      isUnlocked: true,
      desc: 'Standard-issue Spartan iron short sword for close-quarters study sessions.'
    },
    {
      name: 'Bronze Hoplite Aspis',
      slot: 'Shield',
      unlockRequirement: 'Level 5 (Spartan Initiate)',
      isUnlocked: warriorLevelData.level >= 5,
      desc: 'Heavy bronze shield emblazoned with the Spartan Lambda (Λ). Deflects exam anxiety.'
    },
    {
      name: 'Corinthian Crested Helmet',
      slot: 'Headgear',
      unlockRequirement: 'Level 10 (Warrior)',
      isUnlocked: warriorLevelData.level >= 10,
      desc: 'Hammered bronze with towering crimson horsehair crest. Enhances intense focus.'
    },
    {
      name: 'Muscled Bronze Cuirass',
      slot: 'Armor',
      unlockRequirement: 'Level 20 (Commander)',
      isUnlocked: warriorLevelData.level >= 20,
      desc: 'Forged in Greek mountain kilns. Endures 10+ hour marathon battle study sessions.'
    },
    {
      name: 'Dory War Spear',
      slot: 'Primary Weapon',
      unlockRequirement: 'Level 35 (General)',
      isUnlocked: warriorLevelData.level >= 35,
      desc: 'Ash-wood shaft with iron leaf-shaped spearhead. Pierces the most complex Mains questions.'
    },
    {
      name: 'Imperial Golden Laurel',
      slot: 'Regalia',
      unlockRequirement: 'Level 50 (Emperor of Knowledge)',
      isUnlocked: warriorLevelData.level >= 50,
      desc: 'Golden laurel wreath crowned upon the conqueror of the entire Civil Services Examination.'
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-900/40 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-amber-950/70 border border-amber-700/50 text-amber-300 text-[11px] font-cinzel font-bold">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>HALL OF GLORY & EMPIRE ASCENT</span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-amber-100">
            EMPIRE STAGES & COMBAT COMMENDATIONS
          </h1>
          <p className="text-xs text-stone-400">
            Evolve through 7 Spartan empire stages, unlock battle armory relics, and collect medals for syllabus conquests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-400">
            Rank: <strong className="font-cinzel text-amber-400">{militaryRank}</strong>
          </span>
          <span className="text-xs text-stone-400">
            Total XP: <strong className="font-mono text-amber-300">{totalXp.toLocaleString()}</strong>
          </span>
        </div>
      </div>

      {/* SECTION 7: EMPIRE BUILDING VISUALIZATION (7 STAGES) */}
      <div className="spartan-card p-5 sm:p-6 border-amber-900/40 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
          <div>
            <h2 className="font-cinzel text-lg font-bold text-amber-200 flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <span>THE 7 ARCHITECTURAL STAGES OF THE EMPIRE</span>
            </h2>
            <p className="text-xs text-stone-400">
              Each stage expands your fortress and unlocks permanent mental resilience buffs.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-stone-400">Current Evolution: </span>
            <span className="font-cinzel text-sm font-bold text-amber-400">
              Stage {currentEmpireStage.stage} — {currentEmpireStage.name}
            </span>
          </div>
        </div>

        {/* 7 Stages Linear Progression Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {EMPIRE_STAGES.map(stage => {
            const isUnlocked = overallPercentage >= stage.minProgress || totalXp >= stage.minXp;
            const isCurrent = currentEmpireStage.stage === stage.stage;

            return (
              <div
                key={stage.stage}
                className={`p-3.5 rounded-lg border flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'bg-amber-950/70 border-amber-500/80 shadow-lg shadow-amber-950/60 ring-1 ring-amber-500/40'
                    : isUnlocked
                    ? 'bg-stone-900/80 border-stone-700/80 text-stone-300'
                    : 'bg-stone-950/50 border-stone-900 text-stone-600 opacity-60'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-amber-500">
                      STAGE {stage.stage}
                    </span>
                    {isUnlocked ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-stone-600" />
                    )}
                  </div>
                  <h4 className="font-cinzel text-xs font-bold text-stone-100 truncate">
                    {stage.name}
                  </h4>
                  <p className="text-[10px] text-stone-400 line-clamp-3">
                    {stage.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-800/80 mt-2 space-y-1">
                  <span className="block text-[9px] font-mono text-amber-400/90 font-semibold truncate">
                    {stage.defenseBuff}
                  </span>
                  <span className="block text-[9px] text-stone-500 font-mono">
                    Req: {stage.minProgress}% or {stage.minXp.toLocaleString()} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Central Spartan Warrior Evolution & Armory Relics */}
      <div className="spartan-card p-5 sm:p-6 border-amber-900/40 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div>
            <h2 className="font-cinzel text-lg font-bold text-amber-200 flex items-center gap-2">
              <Sword className="w-5 h-5 text-red-400" />
              <span>SPARTAN ARMORY & CHARACTER EQUIPMENT</span>
            </h2>
            <p className="text-xs text-stone-400">
              Equipment forged and unlocked as your warrior level and exam discipline advance.
            </p>
          </div>
          <span className="font-mono text-xs text-amber-400 font-semibold">
            Level {warriorLevelData.level} Warrior
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {armoryItems.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border transition-all ${
                item.isUnlocked
                  ? 'bg-stone-900/70 border-amber-800/40'
                  : 'bg-stone-950/40 border-stone-900 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[10px] font-mono uppercase text-amber-500 font-bold">
                  {item.slot}
                </span>
                {item.isUnlocked ? (
                  <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Equipped
                  </span>
                ) : (
                  <span className="text-[10px] text-stone-500 font-mono flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Locked
                  </span>
                )}
              </div>

              <h4 className="font-cinzel text-sm font-bold text-stone-100">
                {item.name}
              </h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                {item.desc}
              </p>
              <div className="text-[10px] font-mono text-stone-500 mt-2 pt-2 border-t border-stone-800">
                Unlock: {item.unlockRequirement}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Badges Grid */}
      <div className="spartan-card p-5 sm:p-6 border-amber-900/40 space-y-5">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div>
            <h2 className="font-cinzel text-lg font-bold text-amber-200 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>MEDALS OF VALOR & BATTLE ACHIEVEMENTS</span>
            </h2>
            <p className="text-xs text-stone-400">
              Claim legendary honors by completing core study milestones.
            </p>
          </div>
          <span className="font-mono text-xs text-stone-300">
            {achievements.filter(a => !!a.unlockedAt).length} of {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(ach => {
            const isUnlocked = !!ach.unlockedAt;

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-lg border transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-amber-950/40 border-amber-600/50 shadow-md shadow-amber-950/30'
                    : 'bg-stone-900/50 border-stone-800 opacity-60'
                }`}
              >
                <div className={`p-2.5 rounded-lg border shrink-0 ${
                  isUnlocked
                    ? 'bg-amber-900/70 border-amber-500 text-amber-300'
                    : 'bg-stone-900 border-stone-800 text-stone-600'
                }`}>
                  {isUnlocked ? <Trophy className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-cinzel text-xs font-bold text-stone-100 truncate">
                      {ach.title}
                    </h4>
                    <span className="font-mono text-[10px] text-amber-400 font-bold shrink-0">
                      +{ach.xpReward} XP
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-tight">
                    {ach.description}
                  </p>
                  {isUnlocked && (
                    <div className="text-[10px] text-emerald-400 font-mono pt-1">
                      Conquered: {ach.unlockedAt?.split('T')[0]}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject Conquest Trophies */}
      <div className="spartan-card p-5 border-amber-900/40 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div>
            <h3 className="font-cinzel text-base font-bold text-amber-200">
              PROVINCIAL CONQUEST TROPHIES
            </h3>
            <p className="text-xs text-stone-400">
              Earned exclusively when 100% of a subject's lectures are conquered (+1,000 Bonus XP each).
            </p>
          </div>
          <span className="font-mono text-xs text-amber-400 font-bold">
            {conqueredSubjects.length} of {subjects.length} Conquered
          </span>
        </div>

        {conqueredSubjects.length === 0 ? (
          <div className="py-8 text-center text-stone-500 text-xs border border-dashed border-stone-800 rounded-lg">
            No provinces fully conquered yet. Finish all lectures in any subject to raise the Golden Spartan Flag!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {conqueredSubjects.map(s => (
              <div key={s.id} className="p-3 rounded-lg bg-amber-950/60 border border-amber-600/60 text-center space-y-1">
                <Crown className="w-5 h-5 text-amber-400 mx-auto" />
                <span className="font-cinzel text-xs font-bold text-stone-100 block truncate">{s.name}</span>
                <span className="text-[10px] text-amber-400 font-mono">100% SECURED</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
