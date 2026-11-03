import React, { useState } from 'react';
import { useEmpire } from '../context/EmpireContext';
import { SPARTAN_ASSETS } from '../data/assets';
import {
  Shield,
  Map as MapIcon,
  BookOpen,
  Sword,
  CheckSquare,
  BarChart3,
  Trophy,
  User,
  Settings,
  Volume2,
  VolumeX,
  Menu,
  X,
  Flame,
  Plus
} from 'lucide-react';

export type ActiveTab =
  | 'command_center'
  | 'battlefield_map'
  | 'phase1_foundation'
  | 'phase2_mastery'
  | 'daily_orders'
  | 'war_room'
  | 'achievements'
  | 'profile'
  | 'settings';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenQuickBattleOrder: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickBattleOrder
}) => {
  const {
    profile,
    updateProfile,
    warriorLevelData,
    militaryRank,
    streakDays,
    totalXp,
    overallPercentage
  } = useEmpire();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'command_center', label: 'Command Center', icon: <Shield className="w-4 h-4" /> },
    { id: 'battlefield_map', label: 'Battlefield Map', icon: <MapIcon className="w-4 h-4" /> },
    { id: 'phase1_foundation', label: 'Phase 1: Foundation', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'phase2_mastery', label: 'Phase 2: Mastery', icon: <Sword className="w-4 h-4" /> },
    { id: 'daily_orders', label: 'Daily Battle Orders', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'war_room', label: 'War Room', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'achievements', label: 'Achievement Hall', icon: <Trophy className="w-4 h-4" /> },
    { id: 'profile', label: 'Empire Profile', icon: <User className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-amber-900/30 text-stone-100">
      {/* Top Bar Contract (Brand - Stats - Primary CTA) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
        {/* Zone 1: Brand Wordmark with Spartan Lambda Shield */}
        <div 
          onClick={() => { setActiveTab('command_center'); }} 
          className="flex items-center gap-3 cursor-pointer shrink-0 select-none group"
        >
          <div className="w-10 h-10 rounded-full spartan-gold-gradient p-[1.5px] shadow-lg shadow-amber-950/40">
            <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center border border-amber-600/40 group-hover:border-amber-400 transition-colors">
              <span className="font-cinzel text-lg font-black text-amber-400 tracking-tighter">Λ</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-cinzel text-base md:text-lg font-black tracking-wider text-amber-100 group-hover:text-amber-300 transition-colors">
              EMPIRE OF IAS
            </span>
            <span className="text-[10px] uppercase tracking-widest text-amber-500/80 font-medium">
              Rise of the Warrior
            </span>
          </div>
        </div>

        {/* Zone 2: Spartan Warrior Quick Telemetry Strip */}
        <div className="hidden lg:flex items-center gap-5 text-xs text-stone-300">
          {/* Level & Rank */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-stone-900/80 border border-stone-800">
            <div className="w-6 h-6 rounded-full bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold text-[11px] border border-amber-600/40 font-mono">
              {warriorLevelData.level}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-stone-200 leading-tight">{militaryRank}</span>
              <span className="text-[10px] text-stone-400 font-mono">{totalXp.toLocaleString()} XP</span>
            </div>
          </div>

          {/* Streak Flame */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-stone-900/80 border border-red-900/40 text-red-400 font-mono">
            <Flame className="w-4 h-4 fill-red-500 text-red-500 animate-pulse" />
            <span className="font-bold text-xs">{streakDays}</span>
            <span className="text-[10px] text-stone-400 uppercase font-sans">Days</span>
          </div>

          {/* Conquered Syllabus Meter */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-stone-900/80 border border-stone-800">
            <span className="text-stone-400 text-[11px]">Conquered:</span>
            <span className="font-mono font-bold text-amber-400">{overallPercentage}%</span>
            <div className="w-16 h-1.5 rounded-full bg-stone-800 overflow-hidden">
              <div 
                className="h-full spartan-gold-gradient rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(3, overallPercentage))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Zone 3: Actions & Quick Battle Order */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Sound Synthesizer Toggle */}
          <button
            onClick={() => updateProfile({ soundEnabled: !profile.soundEnabled })}
            title={profile.soundEnabled ? 'Mute Spartan Audio' : 'Enable Spartan Audio'}
            className="p-2 rounded border border-stone-800 bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-amber-400 transition-colors"
          >
            {profile.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
          </button>

          {/* Add Daily Order CTA */}
          <button
            onClick={onOpenQuickBattleOrder}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold font-cinzel rounded bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-700 hover:to-amber-600 text-amber-100 shadow-md shadow-red-950/60 transition-all border border-amber-600/30 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Battle Order</span>
            <span className="sm:hidden">Order</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded border border-stone-800 bg-stone-900 text-stone-300 hover:text-amber-400"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Primary Sub-Nav Strip (Desktop) */}
      <nav className="hidden lg:flex items-center justify-center border-t border-stone-900 bg-stone-950/90 px-4 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 py-1.5 max-w-7xl w-full">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-amber-950/40 text-amber-300 border border-amber-700/50 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60 border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-amber-400' : 'text-stone-500'}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-950 border-b border-amber-900/40 px-4 py-3 space-y-1">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-800 text-xs">
            <span className="text-stone-400">{profile.warriorName}</span>
            <span className="font-mono text-amber-400 font-bold">{militaryRank} · Lvl {warriorLevelData.level}</span>
          </div>
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded transition-all text-left ${
                  isActive
                    ? 'bg-amber-950/60 text-amber-300 border border-amber-700/50'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
                }`}
              >
                <span className={isActive ? 'text-amber-400' : 'text-stone-500'}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
