import { Achievement, EmpireStage, MilitaryRank } from '../types';

export const EMPIRE_STAGES: EmpireStage[] = [
  {
    stage: 1,
    name: 'Spartan Camp',
    minProgress: 0,
    minXp: 0,
    description: 'A modest war encampment on the outskirts of Laconia. Campfires burn as raw recruits assemble for initial drill.',
    defenseBuff: '+5% Focus on Foundation Lectures'
  },
  {
    stage: 2,
    name: 'Military Outpost',
    minProgress: 12,
    minXp: 3500,
    description: 'Stockades, training grounds, and bronze armories established. Hoplite disciplines take firm hold.',
    defenseBuff: '+10% Speed in Note-Making'
  },
  {
    stage: 3,
    name: 'Stone Fortress',
    minProgress: 25,
    minXp: 9000,
    description: 'Imposing stone ramparts and watchtowers crowned with burning torches overlook the mountain passes.',
    defenseBuff: '+15% Active Recall Retention'
  },
  {
    stage: 4,
    name: 'Walled City',
    minProgress: 45,
    minXp: 20000,
    description: 'A fortified polis with barracks, archives, agora of debate, and fortified bastions.',
    defenseBuff: '+20% Answer-Writing Precision'
  },
  {
    stage: 5,
    name: 'Royal Citadel',
    minProgress: 65,
    minXp: 38000,
    description: 'An impenetrable Acropolis commanding the Peloponnese. Council of Generals coordinates multi-front offensives.',
    defenseBuff: '+25% MCQ Tactical Accuracy'
  },
  {
    stage: 6,
    name: 'Spartan Empire',
    minProgress: 85,
    minXp: 65000,
    description: 'An empire forged in blood, iron, and unrelenting intellectual stamina. Terrifying to any competitor.',
    defenseBuff: '+30% Mastery over All Syllabi'
  },
  {
    stage: 7,
    name: 'Throne of Knowledge',
    minProgress: 100,
    minXp: 95000,
    description: 'The Golden Throne of the Civil Services. The ultimate intellectual phalanx has achieved total victory.',
    defenseBuff: 'Civil Servant of the Indian Republic'
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    title: 'First Blood',
    description: 'Complete your first battle lecture.',
    category: 'lectures',
    xpReward: 250,
    icon: 'Sword',
    targetProgress: 1
  },
  {
    id: 'note_keeper',
    title: 'Note Keeper',
    description: 'Complete comprehensive notes for 25 lectures.',
    category: 'notes',
    xpReward: 500,
    icon: 'Scroll',
    targetProgress: 25
  },
  {
    id: 'iron_discipline',
    title: 'Iron Discipline',
    description: 'Maintain an unbroken 7-day battle streak.',
    category: 'streak',
    xpReward: 600,
    icon: 'Flame',
    targetProgress: 7
  },
  {
    id: 'hundred_battles',
    title: 'Hundred Battles',
    description: 'Conquer 100 lecture campaigns.',
    category: 'lectures',
    xpReward: 1500,
    icon: 'Shield',
    targetProgress: 100
  },
  {
    id: 'master_strategist',
    title: 'Master Strategist',
    description: 'Conquer all lectures of any one subject.',
    category: 'empire',
    xpReward: 1000,
    icon: 'Crown',
    targetProgress: 1
  },
  {
    id: 'spartan_mind',
    title: 'Spartan Mind',
    description: 'Execute 100 active recall sessions.',
    category: 'recall',
    xpReward: 2000,
    icon: 'Brain',
    targetProgress: 100
  },
  {
    id: 'sword_of_knowledge',
    title: 'Sword of Knowledge',
    description: 'Forge 100 Mains answer writing exercises.',
    category: 'answers',
    xpReward: 2500,
    icon: 'PenTool',
    targetProgress: 100
  },
  {
    id: 'mcq_sharpshooter',
    title: 'Thermopylae Arrow',
    description: 'Achieve 85%+ accuracy in an MCQ session of 30+ questions.',
    category: 'mcq',
    xpReward: 800,
    icon: 'Target',
    targetProgress: 1
  },
  {
    id: 'five_hundred_battles',
    title: 'King Leonidas Stance',
    description: 'Conquer 500 total lectures across the syllabus.',
    category: 'lectures',
    xpReward: 5000,
    icon: 'Swords',
    targetProgress: 500
  },
  {
    id: 'empire_builder',
    title: 'Empire Builder',
    description: 'Conquer the entire lecture workload of the syllabus.',
    category: 'empire',
    xpReward: 10000,
    icon: 'Trophy',
    targetProgress: 979
  }
];

export function getMilitaryRank(percentage: number): MilitaryRank {
  if (percentage >= 100) return 'Emperor of Knowledge';
  if (percentage >= 86) return 'Conqueror';
  if (percentage >= 71) return 'Warlord';
  if (percentage >= 56) return 'Spartan General';
  if (percentage >= 41) return 'Commander';
  if (percentage >= 26) return 'Warrior';
  if (percentage >= 11) return 'Spartan Initiate';
  return 'Recruit';
}

export function getWarriorLevel(xp: number): { level: number; currentXp: number; nextLevelXp: number; progress: number } {
  // Level curve: Base 500 XP, scaling 1.15
  let level = 1;
  let accumulatedXp = 0;
  let step = 500;

  while (accumulatedXp + step <= xp && level < 100) {
    accumulatedXp += step;
    level++;
    step = Math.round(step * 1.12);
  }

  const currentLevelXp = xp - accumulatedXp;
  const progress = Math.min(100, Math.round((currentLevelXp / step) * 100));

  return {
    level,
    currentXp: currentLevelXp,
    nextLevelXp: step,
    progress
  };
}
