/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EmpireProvider } from './context/EmpireContext';
import { Navigation, ActiveTab } from './components/Navigation';
import { CommandCenter } from './components/CommandCenter';
import { BattlefieldMap } from './components/BattlefieldMap';
import { Phase1Foundation } from './components/Phase1Foundation';
import { Phase2Mastery } from './components/Phase2Mastery';
import { DailyBattleOrders } from './components/DailyBattleOrders';
import { WarRoomAnalytics } from './components/WarRoomAnalytics';
import { AchievementHall } from './components/AchievementHall';
import { EmpireProfile } from './components/EmpireProfile';
import { Settings } from './components/Settings';
import { QuickBattleOrderModal } from './components/QuickBattleOrderModal';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('command_center');
  const [selectedSubjectIdForPhase1, setSelectedSubjectIdForPhase1] = useState<string | undefined>(undefined);
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);

  const handleSelectSubjectForPhase1 = (subjectId: string) => {
    setSelectedSubjectIdForPhase1(subjectId);
    setActiveTab('phase1_foundation');
  };

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-100 flex flex-col selection:bg-amber-600/30 selection:text-amber-200">
      {/* Top Spartan Navigation Header */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickBattleOrder={() => setIsQuickOrderOpen(true)}
      />

      {/* Main Campaign Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {activeTab === 'command_center' && (
          <CommandCenter
            setActiveTab={setActiveTab}
            onOpenQuickBattleOrder={() => setIsQuickOrderOpen(true)}
          />
        )}

        {activeTab === 'battlefield_map' && (
          <BattlefieldMap
            setActiveTab={setActiveTab}
            onSelectSubjectForPhase1={handleSelectSubjectForPhase1}
          />
        )}

        {activeTab === 'phase1_foundation' && (
          <Phase1Foundation
            selectedSubjectId={selectedSubjectIdForPhase1}
            onSelectSubject={setSelectedSubjectIdForPhase1}
          />
        )}

        {activeTab === 'phase2_mastery' && <Phase2Mastery />}

        {activeTab === 'daily_orders' && <DailyBattleOrders />}

        {activeTab === 'war_room' && <WarRoomAnalytics />}

        {activeTab === 'achievements' && <AchievementHall />}

        {activeTab === 'profile' && <EmpireProfile />}

        {activeTab === 'settings' && <Settings />}
      </main>

      {/* Spartan Footer */}
      <footer className="border-t border-stone-900 bg-stone-950/90 py-6 text-xs text-stone-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-stone-400">
            <span className="font-cinzel font-bold text-amber-500">THE EMPIRE OF IAS</span>
            <span>·</span>
            <span>Rise of the Warrior</span>
          </div>
          <div className="text-[11px] text-stone-500">
            "One Lecture. One Battle. One Step Closer to the Throne."
          </div>
          <div className="font-mono text-[10px] text-stone-400">
            979 Syllabus Battlefield Modules · Persistent Offline Storage
          </div>
        </div>
      </footer>

      {/* Global Quick Battle Order Modal */}
      <QuickBattleOrderModal
        isOpen={isQuickOrderOpen}
        onClose={() => setIsQuickOrderOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <EmpireProvider>
      <AppContent />
    </EmpireProvider>
  );
}
