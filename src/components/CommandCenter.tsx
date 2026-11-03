import React from 'react';
import { useEmpire } from '../context/EmpireContext';
import { SPARTAN_ASSETS } from '../data/assets';
import { ActiveTab } from './Navigation';
import {
  Shield,
  Flame,
  Award,
  Clock,
  BookOpen,
  Sword,
  Target,
  ArrowRight,
  CheckCircle2,
  Circle,
  Flag,
  Compass,
  Zap,
  TrendingUp,
  AlertTriangle,
  Trophy,
  Map as MapIcon
} from 'lucide-react';

interface CommandCenterProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenQuickBattleOrder: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  setActiveTab,
  onOpenQuickBattleOrder
}) => {
  const {
    profile,
    subjects,
    lectures,
    battleOrders,
    toggleBattleOrder,
    totalLectures,
    completedLecturesCount,
    remainingLecturesCount,
    totalStudyHours,
    completedLectureHours,
    remainingLectureHours,
    overallPercentage,
    notesCompletedCount,
    notesPercentage,
    militaryRank,
    warriorLevelData,
    currentEmpireStage,
    totalBattlesWon,
    streakDays,
    totalXp
  } = useEmpire();

  // Find next in-progress or next uncompleted subject to recommend
  const recommendedSubject = subjects.find(s => {
    const list = lectures[s.id] || [];
    const completed = list.filter(l => l.status === 'completed').length;
    return completed < s.totalLectures;
  }) || subjects[0];

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysOrders = battleOrders.filter(o => o.date === todayStr || !o.isCompleted);

  // Ranks threshold scale for visual bar
  const ranksList = [
    { label: 'Recruit', min: 0, max: 10 },
    { label: 'Spartan Initiate', min: 11, max: 25 },
    { label: 'Warrior', min: 26, max: 40 },
    { label: 'Commander', min: 41, max: 55 },
    { label: 'Spartan General', min: 56, max: 70 },
    { label: 'Warlord', min: 71, max: 85 },
    { label: 'Conqueror', min: 86, max: 99 },
    { label: 'Emperor of Knowledge', min: 100, max: 100 }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Cinematic Hero War Room Banner */}
      <section className="relative rounded-xl overflow-hidden border border-amber-900/40 shadow-2xl bg-stone-950">
        <div className="absolute inset-0">
          <img
            src={SPARTAN_ASSETS.heroWarroom}
            alt="Spartan War Council Room"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-45 mix-blend-luminosity filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-stone-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-4xl space-y-4">
          {/* Warrior war cry */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-950/70 border border-red-700/50 text-red-300 text-xs font-cinzel font-bold tracking-widest uppercase">
            <Sword className="w-3.5 h-3.5 text-red-400" />
            <span>TONIGHT, WE FIGHT. TOMORROW, WE CONQUER.</span>
          </div>

          <div className="space-y-2">
            <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-black text-amber-100 tracking-tight leading-tight">
              THIS IS SPARTA — YOUR EMPIRE AWAITS
            </h1>
            <p className="text-stone-300 text-sm sm:text-base font-medium max-w-2xl">
              One Lecture. One Battle. One Step Closer to the Throne.
            </p>
          </div>

          {/* Quick Call to Action Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setActiveTab('phase1_foundation')}
              className="flex items-center gap-2 px-5 py-3 rounded bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-stone-950 font-cinzel font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-amber-950/50 border border-amber-400/40 transition-all cursor-pointer group"
            >
              <span>Continue Preparation</span>
              <ArrowRight className="w-4 h-4 text-stone-950 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setActiveTab('battlefield_map')}
              className="flex items-center gap-2 px-4 py-3 rounded bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-amber-900/40 text-xs sm:text-sm font-medium transition-all"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Inspect Battlefield Map</span>
            </button>
          </div>
        </div>
      </section>

      {/* A. EMPIRE STATUS GRID */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-cinzel text-lg font-bold text-amber-200 tracking-wide flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" />
            <span>EMPIRE STATUS & COMBAT VITALS</span>
          </h2>
          <span className="text-xs text-stone-400">
            Workload: <strong className="text-stone-200 font-mono">{totalLectures}</strong> Lectures ({totalStudyHours.toLocaleString()} hrs)
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Warrior Level & Rank */}
          <div className="spartan-card p-4 space-y-2 border-amber-900/40">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="uppercase tracking-wider text-[11px]">Rank & Level</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <div className="font-cinzel text-lg sm:text-xl font-bold text-amber-300 truncate">
                {militaryRank}
              </div>
              <div className="text-xs text-stone-400 flex items-center justify-between pt-1">
                <span className="font-mono">Level {warriorLevelData.level}</span>
                <span className="font-mono text-amber-400/90">{totalXp.toLocaleString()} XP</span>
              </div>
            </div>
            {/* Level progress bar */}
            <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full spartan-gold-gradient rounded-full transition-all duration-300"
                style={{ width: `${warriorLevelData.progress}%` }}
              />
            </div>
          </div>

          {/* Battles Won & Streak */}
          <div className="spartan-card p-4 space-y-2 border-amber-900/40">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="uppercase tracking-wider text-[11px]">Battles Won & Streak</span>
              <Flame className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <div className="font-mono text-2xl font-black text-stone-100 tabular-nums">
                {totalBattlesWon.toLocaleString()}
              </div>
              <div className="text-xs text-stone-400 flex items-center justify-between pt-1">
                <span>Active Streak:</span>
                <span className="font-mono text-red-400 font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-red-500" /> {streakDays} Days
                </span>
              </div>
            </div>
            <div className="text-[11px] text-stone-400">
              <span>{notesCompletedCount} Notes · {completedLecturesCount} Lectures</span>
            </div>
          </div>

          {/* Lectures Conquered */}
          <div className="spartan-card p-4 space-y-2 border-amber-900/40">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="uppercase tracking-wider text-[11px]">Lectures Conquered</span>
              <BookOpen className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="font-mono text-2xl font-black text-amber-400 tabular-nums">
                {completedLecturesCount} <span className="text-xs text-stone-400 font-normal">/ {totalLectures}</span>
              </div>
              <div className="text-xs text-stone-400 flex items-center justify-between pt-1">
                <span>Remaining:</span>
                <span className="font-mono text-stone-300 font-semibold">{remainingLecturesCount} left</span>
              </div>
            </div>
            <div className="text-[11px] text-stone-400 font-mono">
              {completedLectureHours.toFixed(1)}h done · {remainingLectureHours.toFixed(1)}h remaining
            </div>
          </div>

          {/* Syllabus Conquered % */}
          <div className="spartan-card p-4 space-y-2 border-amber-900/40">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="uppercase tracking-wider text-[11px]">Overall Conquest</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="font-mono text-2xl font-black text-amber-300 tabular-nums">
                {overallPercentage}%
              </div>
              <div className="text-xs text-stone-400 flex items-center justify-between pt-1">
                <span>Notes Coverage:</span>
                <span className="font-mono text-amber-400/90 font-semibold">{notesPercentage}%</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(3, overallPercentage))}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* B. EMPIRE PROGRESS BAR (MILITARY RANKS SCALE) */}
      <section className="spartan-card p-5 sm:p-6 space-y-4 border-amber-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-cinzel text-base font-bold text-amber-200 uppercase tracking-wider flex items-center gap-2">
              <Flag className="w-4 h-4 text-amber-400" />
              <span>EMPIRE SYLLABUS CONQUEST PROGRESSION</span>
            </h3>
            <p className="text-xs text-stone-400">
              Your ascent from Spartan Recruit to the Emperor of Knowledge.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs uppercase text-stone-400 tracking-wider">Current Designation: </span>
            <span className="font-cinzel text-sm font-bold text-amber-400">{militaryRank}</span>
          </div>
        </div>

        {/* Master Progress Bar */}
        <div className="space-y-2">
          <div className="relative w-full h-4 sm:h-5 bg-stone-950 rounded-full border border-amber-800/40 p-0.5 overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full spartan-gold-gradient transition-all duration-700 relative"
              style={{ width: `${Math.min(100, Math.max(2, overallPercentage))}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/40 blur-xs animate-pulse" />
            </div>
          </div>

          {/* Ranks Milestone Indicator */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 pt-1 text-[10px] text-stone-400 text-center font-cinzel">
            {ranksList.map(r => {
              const reached = overallPercentage >= r.min;
              const isCurrent = militaryRank === r.label;
              return (
                <div
                  key={r.label}
                  className={`p-1 rounded transition-colors ${
                    isCurrent
                      ? 'bg-amber-950/80 text-amber-300 font-bold border border-amber-600/40'
                      : reached
                      ? 'text-stone-300'
                      : 'text-stone-600'
                  }`}
                >
                  <div className="truncate font-semibold">{r.label}</div>
                  <div className="font-mono text-[9px] text-stone-400">{r.min}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Split Section: Warrior & Empire Evolution + Daily Battle Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Central Warrior & Fortress Progression (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="spartan-card overflow-hidden border-amber-900/40 space-y-4 p-5">
            <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
              <div>
                <span className="text-[10px] uppercase font-cinzel text-amber-500 font-bold tracking-widest">
                  Stage {currentEmpireStage.stage} of 7
                </span>
                <h3 className="font-cinzel text-lg font-bold text-amber-200">
                  {currentEmpireStage.name}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded bg-stone-900 text-amber-400 text-xs font-mono border border-stone-700">
                {currentEmpireStage.defenseBuff}
              </span>
            </div>

            {/* Fortress & Warrior Visual Presentation */}
            <div className="relative rounded-lg overflow-hidden border border-amber-900/30 aspect-16/10 bg-stone-950">
              <img
                src={SPARTAN_ASSETS.fortressCitadel}
                alt="Spartan Citadel Fortress"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
              
              {/* Warrior character inset */}
              <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-stone-950/90 p-2 rounded-lg border border-amber-700/40 shadow-xl backdrop-blur-sm">
                <img
                  src={SPARTAN_ASSETS.warriorAvatar}
                  alt={profile.warriorName}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full border border-amber-500/80 object-cover"
                />
                <div className="text-xs">
                  <div className="font-cinzel font-bold text-amber-200">{profile.warriorName}</div>
                  <div className="text-[11px] text-stone-400 italic">"{profile.motto}"</div>
                </div>
              </div>

              <div className="absolute top-3 right-3 px-2 py-1 rounded bg-stone-950/80 text-[10px] text-amber-400 font-mono border border-stone-700">
                Target: {profile.targetYear}
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              {currentEmpireStage.description}
            </p>

            <button
              onClick={() => setActiveTab('achievements')}
              className="w-full py-2 px-3 text-xs font-medium text-amber-400 bg-amber-950/30 hover:bg-amber-950/50 rounded border border-amber-800/40 text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Inspect All 7 Empire Evolution Stages</span>
            </button>
          </div>

          {/* Recommended Next Campaign */}
          <div className="spartan-card p-5 border-amber-900/40 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-cinzel text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Active War Front
              </span>
              <span className="text-stone-400 text-[11px] font-mono">{recommendedSubject.category}</span>
            </div>
            <div>
              <h4 className="font-cinzel text-base font-bold text-stone-100">
                {recommendedSubject.name}
              </h4>
              <p className="text-xs text-stone-400 mt-0.5 line-clamp-2">
                {recommendedSubject.description}
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-stone-800/80 text-xs">
              <span className="text-stone-400">
                Territory: <strong className="text-stone-200">{recommendedSubject.territoryName}</strong>
              </span>
              <button
                onClick={() => setActiveTab('phase1_foundation')}
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Conquer Lectures</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: C. DAILY BATTLE ORDERS (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="spartan-card p-5 sm:p-6 border-amber-900/40 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
              <div className="space-y-0.5">
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-amber-200 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-red-500" />
                  <span>DAILY BATTLE ORDERS</span>
                </h3>
                <p className="text-xs text-stone-400">
                  Target mandates for today's campaign offensive.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenQuickBattleOrder}
                  className="px-3 py-1.5 rounded bg-red-900/60 hover:bg-red-800 text-amber-200 text-xs font-semibold font-cinzel border border-red-700/50 transition-colors"
                >
                  + Add Mission
                </button>
                <button
                  onClick={() => setActiveTab('daily_orders')}
                  className="text-xs text-stone-400 hover:text-amber-400 transition-colors"
                >
                  View All ({battleOrders.length})
                </button>
              </div>
            </div>

            {/* List of battle orders */}
            {todaysOrders.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <Shield className="w-10 h-10 text-stone-600 mx-auto" />
                <p className="text-sm text-stone-400">All battle orders completed or none assigned for today.</p>
                <button
                  onClick={onOpenQuickBattleOrder}
                  className="px-4 py-2 text-xs font-cinzel font-bold bg-amber-950/60 text-amber-300 border border-amber-700/50 rounded hover:bg-amber-900/60 transition-colors"
                >
                  Dispatch New Battle Order
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {todaysOrders.map(order => {
                  return (
                    <div
                      key={order.id}
                      onClick={() => toggleBattleOrder(order.id)}
                      className={`group flex items-start justify-between gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                        order.isCompleted
                          ? 'bg-stone-900/40 border-stone-800/60 text-stone-500'
                          : 'bg-stone-900/80 border-stone-800 hover:border-amber-700/60 text-stone-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          className="mt-0.5 text-stone-400 group-hover:text-amber-400 transition-colors shrink-0"
                        >
                          {order.isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-stone-500" />
                          )}
                        </button>
                        <div className="space-y-1">
                          <div className={`text-xs sm:text-sm font-medium ${order.isCompleted ? 'line-through text-stone-500' : 'text-stone-100'}`}>
                            {order.title}
                          </div>
                          {order.notes && (
                            <div className="text-[11px] text-stone-400 line-clamp-1">
                              {order.notes}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-[10px] text-stone-400">
                            <span className="uppercase text-amber-500 font-semibold">{order.type}</span>
                            <span>·</span>
                            <span>Target: {order.targetCount} unit{order.targetCount > 1 ? 's' : ''}</span>
                            {order.priority === 'urgent' && (
                              <>
                                <span>·</span>
                                <span className="text-red-400 font-semibold uppercase">Urgent</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className={`text-[11px] font-mono font-semibold ${order.isCompleted ? 'text-emerald-500' : 'text-amber-400'}`}>
                          {order.isCompleted ? 'VICTORY' : '+30 XP'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick XP Cheat Sheet / Battle Rewards Info */}
            <div className="pt-3 border-t border-stone-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px] text-stone-400">
              <div className="p-2 rounded bg-stone-950/60 border border-stone-800/60">
                <span className="block font-bold text-amber-400 font-mono">+100 XP</span>
                <span>Lecture Won</span>
              </div>
              <div className="p-2 rounded bg-stone-950/60 border border-stone-800/60">
                <span className="block font-bold text-amber-400 font-mono">+50 XP</span>
                <span>Notes Completed</span>
              </div>
              <div className="p-2 rounded bg-stone-950/60 border border-stone-800/60">
                <span className="block font-bold text-amber-400 font-mono">+75 XP</span>
                <span>Active Recall</span>
              </div>
              <div className="p-2 rounded bg-stone-950/60 border border-stone-800/60">
                <span className="block font-bold text-amber-400 font-mono">+100 XP</span>
                <span>Mains Answer</span>
              </div>
            </div>
          </div>

          {/* Quick Battlefield Map Preview Link */}
          <div className="spartan-card p-4 border-amber-900/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded bg-amber-950/60 text-amber-400 border border-amber-700/40">
                <MapIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-cinzel text-sm font-bold text-amber-200">
                  Empire Territories (19 Subject Fronts)
                </h4>
                <p className="text-xs text-stone-400">
                  Track how each province evolves from unexplored to fortified & conquered.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('battlefield_map')}
              className="px-3.5 py-2 text-xs font-cinzel font-bold text-amber-400 hover:text-amber-300 bg-stone-900 hover:bg-stone-800 rounded border border-stone-700 transition-colors"
            >
              Open Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
