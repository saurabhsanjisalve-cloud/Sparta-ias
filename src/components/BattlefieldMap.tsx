import React, { useState, useMemo } from 'react';
import { useEmpire } from '../context/EmpireContext';
import { SPARTAN_ASSETS } from '../data/assets';
import { Subject } from '../types';
import { ActiveTab } from './Navigation';
import {
  MapPin,
  Shield,
  Flag,
  Sword,
  CheckCircle,
  Clock,
  Filter,
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';

interface BattlefieldMapProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSelectSubjectForPhase1: (subjectId: string) => void;
}

export const BattlefieldMap: React.FC<BattlefieldMapProps> = ({
  setActiveTab,
  onSelectSubjectForPhase1
}) => {
  const { subjects, lectures } = useEmpire();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeModalSubject, setActiveModalSubject] = useState<Subject | null>(null);

  // Compute status for each territory
  const territories = useMemo(() => {
    return subjects.map(sub => {
      const list = lectures[sub.id] || [];
      const completed = list.filter(l => l.status === 'completed').length;
      const notesCompleted = list.filter(l => l.notesStatus === 'completed').length;
      const remaining = Math.max(0, sub.totalLectures - completed);
      const percentage = sub.totalLectures > 0 ? Math.round((completed / sub.totalLectures) * 1000) / 10 : 0;

      let statusType: 'unexplored' | 'under_conquest' | 'fortified' | 'conquered' = 'unexplored';
      let statusLabel = 'Unexplored Territory';

      if (percentage >= 100) {
        statusType = 'conquered';
        statusLabel = 'Conquered & Secured';
      } else if (percentage >= 50) {
        statusType = 'fortified';
        statusLabel = 'Fortified Territory';
      } else if (percentage > 0) {
        statusType = 'under_conquest';
        statusLabel = 'Under Conquest';
      }

      return {
        ...sub,
        completed,
        remaining,
        notesCompleted,
        percentage,
        statusType,
        statusLabel
      };
    });
  }, [subjects, lectures]);

  const filteredTerritories = useMemo(() => {
    if (selectedCategory === 'ALL') return territories;
    return territories.filter(t => t.category === selectedCategory);
  }, [territories, selectedCategory]);

  const categories = ['ALL', 'GS1', 'GS2', 'GS3', 'GS4', 'OPTIONAL', 'CSAT', 'ESSAY'];

  const stats = useMemo(() => {
    const conquered = territories.filter(t => t.statusType === 'conquered').length;
    const fortified = territories.filter(t => t.statusType === 'fortified').length;
    const underConquest = territories.filter(t => t.statusType === 'under_conquest').length;
    const unexplored = territories.filter(t => t.statusType === 'unexplored').length;
    return { conquered, fortified, underConquest, unexplored };
  }, [territories]);

  return (
    <div className="space-y-8 pb-16">
      {/* Battlefield Header Banner */}
      <section className="relative rounded-xl overflow-hidden border border-amber-900/40 p-6 sm:p-8 bg-stone-950">
        <div className="absolute inset-0">
          <img
            src={SPARTAN_ASSETS.ancientMap}
            alt="Ancient Spartan Campaign Map"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-30 mix-blend-luminosity filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-stone-950/40" />
        </div>

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-950/80 border border-amber-700/50 text-amber-300 text-xs font-cinzel font-bold">
            <Flag className="w-3.5 h-3.5 text-amber-400" />
            <span>TERRITORIAL WAR COUNCIL</span>
          </div>

          <h1 className="font-cinzel text-2xl sm:text-4xl font-black text-amber-100 tracking-tight">
            THE BATTLEFIELD OF THE 19 PROVINCES
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Every UPSC subject is a sovereign province. Unexplored territories lie in darkness; as you conquer lectures, stone ramparts rise, fortifications emerge, and golden Spartan victory flags are planted.
          </p>

          {/* Territory Status Legend Counter */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded bg-stone-900/90 border border-emerald-900/40 flex items-center gap-2">
              <Flag className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="block text-[10px] text-stone-400 uppercase">Conquered</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{stats.conquered}</span>
              </div>
            </div>
            <div className="p-2.5 rounded bg-stone-900/90 border border-amber-900/40 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="block text-[10px] text-stone-400 uppercase">Fortified (50%+)</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{stats.fortified}</span>
              </div>
            </div>
            <div className="p-2.5 rounded bg-stone-900/90 border border-red-900/40 flex items-center gap-2">
              <Sword className="w-4 h-4 text-red-400 shrink-0" />
              <div>
                <span className="block text-[10px] text-stone-400 uppercase">Under Conquest</span>
                <span className="font-mono font-bold text-red-400 text-sm">{stats.underConquest}</span>
              </div>
            </div>
            <div className="p-2.5 rounded bg-stone-900/90 border border-stone-800 flex items-center gap-2">
              <Lock className="w-4 h-4 text-stone-500 shrink-0" />
              <div>
                <span className="block text-[10px] text-stone-400 uppercase">Unexplored</span>
                <span className="font-mono font-bold text-stone-400 text-sm">{stats.unexplored}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-stone-900/80 rounded-lg border border-stone-800 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-cinzel font-medium rounded transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-amber-950/70 text-amber-300 border border-amber-600/40 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {cat === 'ALL' ? 'All Fronts' : cat}
            </button>
          ))}
        </div>

        <span className="text-xs text-stone-400">
          Showing <strong className="text-stone-200 font-mono">{filteredTerritories.length}</strong> Territories
        </span>
      </div>

      {/* Territories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTerritories.map(t => {
          // Visual styling depending on territory evolution stage
          const isConquered = t.statusType === 'conquered';
          const isFortified = t.statusType === 'fortified';
          const isUnderConquest = t.statusType === 'under_conquest';
          const isUnexplored = t.statusType === 'unexplored';

          let borderClass = 'border-stone-800/80';
          let bgClass = 'bg-stone-950/70';
          let bannerBadgeClass = 'text-stone-400 bg-stone-900/80 border-stone-800';

          if (isConquered) {
            borderClass = 'border-amber-500/60 shadow-lg shadow-amber-950/40';
            bgClass = 'bg-gradient-to-br from-amber-950/40 via-stone-900/90 to-stone-950';
            bannerBadgeClass = 'text-amber-300 bg-amber-950/80 border-amber-600/60';
          } else if (isFortified) {
            borderClass = 'border-amber-700/50 shadow-md shadow-stone-950';
            bgClass = 'bg-stone-900/80';
            bannerBadgeClass = 'text-amber-400 bg-amber-950/60 border-amber-700/40';
          } else if (isUnderConquest) {
            borderClass = 'border-red-900/60';
            bgClass = 'bg-gradient-to-b from-stone-900/90 to-stone-950';
            bannerBadgeClass = 'text-red-400 bg-red-950/60 border-red-800/40';
          }

          return (
            <div
              key={t.id}
              onClick={() => setActiveModalSubject(t)}
              className={`rounded-lg border p-5 space-y-4 transition-all duration-200 hover:-translate-y-1 cursor-pointer ${borderClass} ${bgClass}`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-stone-400 px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800">
                      {t.category}
                    </span>
                    <span className="text-xs text-amber-500 font-cinzel font-semibold">
                      {t.territoryName}
                    </span>
                  </div>
                  <h3 className="font-cinzel text-base font-bold text-stone-100 tracking-wide">
                    {t.name}
                  </h3>
                </div>

                {/* Status Crest */}
                <div className={`p-2 rounded-lg border shrink-0 ${bannerBadgeClass}`}>
                  {isConquered ? (
                    <Flag className="w-5 h-5 text-amber-400 animate-bounce" />
                  ) : isFortified ? (
                    <Shield className="w-5 h-5 text-amber-400" />
                  ) : isUnderConquest ? (
                    <Sword className="w-5 h-5 text-red-400" />
                  ) : (
                    <Lock className="w-5 h-5 text-stone-600" />
                  )}
                </div>
              </div>

              {/* Status Badge Text */}
              <div className="flex items-center justify-between text-xs">
                <span className={`font-cinzel text-[11px] font-semibold ${
                  isConquered ? 'text-amber-400' : isFortified ? 'text-amber-500' : isUnderConquest ? 'text-red-400' : 'text-stone-400'
                }`}>
                  {t.statusLabel}
                </span>
                <span className="font-mono text-stone-300 font-bold">{t.percentage}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-stone-950 rounded-full overflow-hidden border border-stone-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isConquered
                      ? 'spartan-gold-gradient'
                      : isFortified
                      ? 'bg-amber-600'
                      : isUnderConquest
                      ? 'bg-red-600'
                      : 'bg-stone-800'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(isUnexplored ? 0 : 4, t.percentage))}%` }}
                />
              </div>

              {/* Stats Footer */}
              <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                <div>
                  <span className="font-mono text-stone-200 font-semibold">{t.completed}</span> / {t.totalLectures} Lecs
                </div>
                <div className="font-mono text-[11px]">
                  {t.remaining} Left
                </div>
              </div>

              {/* Direct Action Link */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSubjectForPhase1(t.id);
                  setActiveTab('phase1_foundation');
                }}
                className="w-full py-1.5 px-3 rounded bg-stone-900 hover:bg-amber-950/60 text-amber-300 hover:text-amber-200 text-xs font-cinzel font-semibold border border-stone-800 hover:border-amber-700/50 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Conquer Phase 1 Lectures</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal / Territory Detail Drawer */}
      {activeModalSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="bg-stone-950 border border-amber-700/50 rounded-xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-cinzel font-bold text-amber-500 uppercase tracking-widest">
                  Territorial War Dossier
                </span>
                <h3 className="font-cinzel text-xl font-bold text-amber-100">
                  {activeModalSubject.name}
                </h3>
                <span className="text-xs text-stone-400">
                  Province: {activeModalSubject.territoryName} ({activeModalSubject.category})
                </span>
              </div>
              <button
                onClick={() => setActiveModalSubject(null)}
                className="p-1 rounded text-stone-400 hover:text-stone-200 bg-stone-900 border border-stone-800"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              {activeModalSubject.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded bg-stone-900/90 border border-stone-800">
                <span className="text-stone-400 block text-[11px]">Total Workload</span>
                <span className="font-mono text-base font-bold text-amber-400">
                  {activeModalSubject.totalLectures} Lectures
                </span>
                <span className="text-[10px] text-stone-500 block font-mono">
                  {(activeModalSubject.totalLectures * 2.5).toFixed(1)} Hours
                </span>
              </div>
              <div className="p-3 rounded bg-stone-900/90 border border-stone-800">
                <span className="text-stone-400 block text-[11px]">Duration Per Unit</span>
                <span className="font-mono text-base font-bold text-stone-200">
                  2h 30m
                </span>
                <span className="text-[10px] text-stone-500 block">
                  Standard Spartan Block
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  onSelectSubjectForPhase1(activeModalSubject.id);
                  setActiveTab('phase1_foundation');
                  setActiveModalSubject(null);
                }}
                className="flex-1 py-2.5 px-4 rounded bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-700 hover:to-amber-600 text-amber-100 font-cinzel font-bold text-xs uppercase tracking-wider transition-all border border-amber-600/40"
              >
                Deploy into Lectures
              </button>
              <button
                onClick={() => setActiveModalSubject(null)}
                className="py-2.5 px-4 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold border border-stone-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
