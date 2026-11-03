import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Subject,
  Lecture,
  LectureStatus,
  NotesStatus,
  BattleOrder,
  ActiveRecallSession,
  AnswerWritingSession,
  MCQSession,
  RevisionRecord,
  Achievement,
  WarriorProfile,
  MilitaryRank,
  EmpireStage
} from '../types';
import { CORE_SUBJECTS, EXTENSION_SUBJECTS, generateAllInitialLectures, generateLecturesForSubject } from '../data/initialSubjects';
import { INITIAL_ACHIEVEMENTS, EMPIRE_STAGES, getMilitaryRank, getWarriorLevel } from '../data/achievements';
import { spartanSound } from '../utils/audio';

const STORAGE_KEY = 'THE_EMPIRE_OF_IAS_PROGRESS_V1';

export interface EmpireContextType {
  subjects: Subject[];
  lectures: Record<string, Lecture[]>;
  battleOrders: BattleOrder[];
  activeRecallSessions: ActiveRecallSession[];
  answerWritingSessions: AnswerWritingSession[];
  mcqSessions: MCQSession[];
  revisionRecords: RevisionRecord[];
  achievements: Achievement[];
  profile: WarriorProfile;
  totalXp: number;
  streakDays: number;
  claimedRewardIds: string[];
  includeExtendedModules: boolean;

  // Computed stats
  totalLectures: number;
  completedLecturesCount: number;
  remainingLecturesCount: number;
  totalStudyHours: number;
  completedLectureHours: number;
  remainingLectureHours: number;
  overallPercentage: number;
  notesCompletedCount: number;
  notesRemainingCount: number;
  notesPercentage: number;
  militaryRank: MilitaryRank;
  warriorLevelData: { level: number; currentXp: number; nextLevelXp: number; progress: number };
  currentEmpireStage: EmpireStage;
  totalBattlesWon: number;

  // Actions
  toggleLectureStatus: (subjectId: string, lectureId: string) => void;
  updateLecture: (subjectId: string, lectureId: string, updates: Partial<Lecture>) => void;
  bulkCompleteLectures: (subjectId: string, count: number) => void;
  bulkCompleteNotes: (subjectId: string, count: number) => void;
  
  // Battle Orders
  addBattleOrder: (order: Omit<BattleOrder, 'id'>) => void;
  updateBattleOrder: (orderId: string, updates: Partial<BattleOrder>) => void;
  toggleBattleOrder: (orderId: string) => void;
  deleteBattleOrder: (orderId: string) => void;

  // Phase 2 actions
  addActiveRecallSession: (session: Omit<ActiveRecallSession, 'id' | 'createdAt'>) => void;
  deleteActiveRecallSession: (id: string) => void;

  addAnswerWritingSession: (session: Omit<AnswerWritingSession, 'id' | 'createdAt'>) => void;
  deleteAnswerWritingSession: (id: string) => void;

  addMCQSession: (session: Omit<MCQSession, 'id' | 'createdAt' | 'accuracy'>) => void;
  deleteMCQSession: (id: string) => void;

  addOrUpdateRevisionRecord: (record: Omit<RevisionRecord, 'id'> & { id?: string }) => void;
  deleteRevisionRecord: (id: string) => void;

  // Profile & System
  updateProfile: (updates: Partial<WarriorProfile>) => void;
  toggleExtendedModules: () => void;
  exportDataJson: () => void;
  importDataJson: (jsonString: string) => boolean;
  resetAllProgress: () => void;
}

const EmpireContext = createContext<EmpireContextType | undefined>(undefined);

export const EmpireProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [includeExtendedModules, setIncludeExtendedModules] = useState<boolean>(true);
  const [profile, setProfile] = useState<WarriorProfile>({
    warriorName: 'Leonidas of Delhi',
    targetYear: 'UPSC CSE 2026',
    optionalSubject: 'Anthropology',
    motto: 'With your shield, or on it.',
    avatarId: 'spartan_commander',
    soundEnabled: true
  });

  const subjects = useMemo(() => {
    return includeExtendedModules
      ? [...CORE_SUBJECTS, ...EXTENSION_SUBJECTS]
      : CORE_SUBJECTS;
  }, [includeExtendedModules]);

  const [lectures, setLectures] = useState<Record<string, Lecture[]>>(() => {
    return generateAllInitialLectures([...CORE_SUBJECTS, ...EXTENSION_SUBJECTS]);
  });

  const [battleOrders, setBattleOrders] = useState<BattleOrder[]>([
    {
      id: 'bo_today_1',
      date: new Date().toISOString().split('T')[0],
      title: 'Polity: Preamble & Constitutional Features',
      type: 'lecture',
      subjectId: 'polity',
      targetCount: 1,
      completedCount: 0,
      isCompleted: false,
      priority: 'urgent',
      notes: 'Watch lecture attentively and draft high-yield bullet notes.'
    },
    {
      id: 'bo_today_2',
      date: new Date().toISOString().split('T')[0],
      title: 'Economy: Inflation & RBI Repo Rate Concepts',
      type: 'notes',
      subjectId: 'economy',
      targetCount: 1,
      completedCount: 0,
      isCompleted: false,
      priority: 'high',
      notes: 'Summarize core formulas and monetary transmission channels.'
    },
    {
      id: 'bo_today_3',
      date: new Date().toISOString().split('T')[0],
      title: 'GS2 Answer Writing: Judicial Review & Separation of Powers',
      type: 'answer',
      subjectId: 'polity',
      targetCount: 1,
      completedCount: 0,
      isCompleted: false,
      priority: 'normal',
      notes: '15 marks / 250 words timed in 11 minutes.'
    },
    {
      id: 'bo_today_4',
      date: new Date().toISOString().split('T')[0],
      title: 'Environment: 25 Prelims PYQs on National Parks',
      type: 'mcq',
      subjectId: 'environment',
      targetCount: 25,
      completedCount: 0,
      isCompleted: false,
      priority: 'normal'
    }
  ]);

  const [activeRecallSessions, setActiveRecallSessions] = useState<ActiveRecallSession[]>([]);
  const [answerWritingSessions, setAnswerWritingSessions] = useState<AnswerWritingSession[]>([]);
  const [mcqSessions, setMcqSessions] = useState<MCQSession[]>([]);
  const [revisionRecords, setRevisionRecords] = useState<RevisionRecord[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [totalXp, setTotalXp] = useState<number>(0);
  const [claimedRewardIds, setClaimedRewardIds] = useState<string[]>([]);
  const [streakDays, setStreakDays] = useState<number>(1);
  const [lastActivityDate, setLastActivityDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Load from LocalStorage once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lectures) setLectures(parsed.lectures);
        if (parsed.battleOrders) setBattleOrders(parsed.battleOrders);
        if (parsed.activeRecallSessions) setActiveRecallSessions(parsed.activeRecallSessions);
        if (parsed.answerWritingSessions) setAnswerWritingSessions(parsed.answerWritingSessions);
        if (parsed.mcqSessions) setMcqSessions(parsed.mcqSessions);
        if (parsed.revisionRecords) setRevisionRecords(parsed.revisionRecords);
        if (parsed.achievements) setAchievements(parsed.achievements);
        if (typeof parsed.totalXp === 'number') setTotalXp(parsed.totalXp);
        if (Array.isArray(parsed.claimedRewardIds)) setClaimedRewardIds(parsed.claimedRewardIds);
        if (typeof parsed.streakDays === 'number') setStreakDays(parsed.streakDays);
        if (parsed.profile) setProfile(parsed.profile);
        if (typeof parsed.includeExtendedModules === 'boolean') {
          setIncludeExtendedModules(parsed.includeExtendedModules);
        }
        if (parsed.lastActivityDate) setLastActivityDate(parsed.lastActivityDate);
      }
    } catch (e) {
      console.error('Error loading saved Spartan empire state:', e);
    }
  }, []);

  // Save to LocalStorage whenever critical state changes
  useEffect(() => {
    try {
      const stateToSave = {
        lectures,
        battleOrders,
        activeRecallSessions,
        answerWritingSessions,
        mcqSessions,
        revisionRecords,
        achievements,
        totalXp,
        claimedRewardIds,
        streakDays,
        profile,
        includeExtendedModules,
        lastActivityDate
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [
    lectures,
    battleOrders,
    activeRecallSessions,
    answerWritingSessions,
    mcqSessions,
    revisionRecords,
    achievements,
    totalXp,
    claimedRewardIds,
    streakDays,
    profile,
    includeExtendedModules,
    lastActivityDate
  ]);

  // Sound sync with profile
  useEffect(() => {
    spartanSound.setEnabled(profile.soundEnabled);
  }, [profile.soundEnabled]);

  // Helper to grant XP safely without farming duplicates
  const grantRewardXp = useCallback((rewardId: string, xpAmount: number) => {
    setClaimedRewardIds(prev => {
      if (prev.includes(rewardId)) return prev; // Already claimed! No duplicate reward!
      setTotalXp(oldXp => oldXp + xpAmount);
      return [...prev, rewardId];
    });
  }, []);

  // Check activity streak updates
  const registerActivityForStreak = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    if (lastActivityDate !== today) {
      const last = new Date(lastActivityDate);
      const curr = new Date(today);
      const diffDays = Math.round((curr.getTime() - last.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        setStreakDays(prev => {
          const next = prev + 1;
          if (next === 7) {
            grantRewardXp('streak_7_days', 300);
          }
          return next;
        });
      } else if (diffDays > 1) {
        setStreakDays(1);
      }
      setLastActivityDate(today);
    }
  }, [lastActivityDate, grantRewardXp]);

  // Total lecture calculations
  const {
    totalLectures,
    completedLecturesCount,
    remainingLecturesCount,
    totalStudyHours,
    completedLectureHours,
    remainingLectureHours,
    overallPercentage,
    notesCompletedCount,
    notesRemainingCount,
    notesPercentage
  } = useMemo(() => {
    let totLectures = 0;
    let compLectures = 0;
    let compNotes = 0;

    for (const sub of subjects) {
      const subLectures = lectures[sub.id] || [];
      totLectures += sub.totalLectures;
      for (const lec of subLectures) {
        if (lec.status === 'completed') {
          compLectures++;
        }
        if (lec.notesStatus === 'completed') {
          compNotes++;
        }
      }
    }

    const remLectures = Math.max(0, totLectures - compLectures);
    const totHours = totLectures * 2.5;
    const compHours = compLectures * 2.5;
    const remHours = remLectures * 2.5;
    const overallPct = totLectures > 0 ? (compLectures / totLectures) * 100 : 0;
    const remNotes = Math.max(0, totLectures - compNotes);
    const notesPct = totLectures > 0 ? (compNotes / totLectures) * 100 : 0;

    return {
      totalLectures: totLectures,
      completedLecturesCount: compLectures,
      remainingLecturesCount: remLectures,
      totalStudyHours: totHours,
      completedLectureHours: compHours,
      remainingLectureHours: remHours,
      overallPercentage: Math.round(overallPct * 10) / 10,
      notesCompletedCount: compNotes,
      notesRemainingCount: remNotes,
      notesPercentage: Math.round(notesPct * 10) / 10
    };
  }, [subjects, lectures]);

  const militaryRank = useMemo(() => {
    return getMilitaryRank(overallPercentage);
  }, [overallPercentage]);

  const warriorLevelData = useMemo(() => {
    return getWarriorLevel(totalXp);
  }, [totalXp]);

  const currentEmpireStage = useMemo(() => {
    // Find highest stage where both or either criteria satisfied
    for (let i = EMPIRE_STAGES.length - 1; i >= 0; i--) {
      const s = EMPIRE_STAGES[i];
      if (overallPercentage >= s.minProgress || totalXp >= s.minXp) {
        return s;
      }
    }
    return EMPIRE_STAGES[0];
  }, [overallPercentage, totalXp]);

  const totalBattlesWon = useMemo(() => {
    return (
      completedLecturesCount +
      notesCompletedCount +
      activeRecallSessions.length +
      answerWritingSessions.length +
      mcqSessions.length
    );
  }, [completedLecturesCount, notesCompletedCount, activeRecallSessions, answerWritingSessions, mcqSessions]);

  // Check achievements after state updates
  useEffect(() => {
    setAchievements(prevAchievements => {
      let changed = false;
      const updated = prevAchievements.map(ach => {
        if (ach.unlockedAt) return ach;

        let shouldUnlock = false;
        if (ach.id === 'first_blood' && completedLecturesCount >= 1) shouldUnlock = true;
        if (ach.id === 'note_keeper' && notesCompletedCount >= 25) shouldUnlock = true;
        if (ach.id === 'iron_discipline' && streakDays >= 7) shouldUnlock = true;
        if (ach.id === 'hundred_battles' && completedLecturesCount >= 100) shouldUnlock = true;
        if (ach.id === 'five_hundred_battles' && completedLecturesCount >= 500) shouldUnlock = true;
        if (ach.id === 'empire_builder' && completedLecturesCount >= totalLectures && totalLectures > 0) shouldUnlock = true;
        if (ach.id === 'spartan_mind' && activeRecallSessions.length >= 100) shouldUnlock = true;
        if (ach.id === 'sword_of_knowledge' && answerWritingSessions.length >= 100) shouldUnlock = true;
        
        // Subject conquest check
        if (ach.id === 'master_strategist') {
          for (const s of subjects) {
            const list = lectures[s.id] || [];
            if (list.length > 0 && list.every(l => l.status === 'completed')) {
              shouldUnlock = true;
              break;
            }
          }
        }

        if (shouldUnlock) {
          changed = true;
          grantRewardXp(`achievement_${ach.id}`, ach.xpReward);
          spartanSound.playWarHorn();
          return {
            ...ach,
            unlockedAt: new Date().toISOString()
          };
        }
        return ach;
      });
      return changed ? updated : prevAchievements;
    });
  }, [
    completedLecturesCount,
    notesCompletedCount,
    streakDays,
    totalLectures,
    activeRecallSessions.length,
    answerWritingSessions.length,
    subjects,
    lectures,
    grantRewardXp
  ]);

  // Toggle Lecture Status
  const toggleLectureStatus = useCallback((subjectId: string, lectureId: string) => {
    setLectures(prev => {
      const subjectList = prev[subjectId] || [];
      const updatedList = subjectList.map(lec => {
        if (lec.id === lectureId) {
          const nextStatus: LectureStatus = lec.status === 'completed' ? 'not_started' : 'completed';
          const today = new Date().toISOString().split('T')[0];

          if (nextStatus === 'completed') {
            // Lecture completed: +100 XP (anti-exploit check)
            grantRewardXp(`lec_${lec.id}`, 100);
            spartanSound.playSwordClash();
            registerActivityForStreak();
          } else {
            spartanSound.playShieldClick();
          }

          return {
            ...lec,
            status: nextStatus,
            completedDate: nextStatus === 'completed' ? today : undefined
          };
        }
        return lec;
      });

      // Check if entire subject is now conquered: +1000 XP
      const allCompleted = updatedList.length > 0 && updatedList.every(l => l.status === 'completed');
      if (allCompleted) {
        grantRewardXp(`subject_conquered_${subjectId}`, 1000);
        spartanSound.playWarHorn();
      }

      return {
        ...prev,
        [subjectId]: updatedList
      };
    });
  }, [grantRewardXp, registerActivityForStreak]);

  // Update specific lecture fields (title, notes status, remarks, duration)
  const updateLecture = useCallback((subjectId: string, lectureId: string, updates: Partial<Lecture>) => {
    setLectures(prev => {
      const subjectList = prev[subjectId] || [];
      const updatedList = subjectList.map(lec => {
        if (lec.id === lectureId) {
          const merged = { ...lec, ...updates };

          // Notes completed reward: +50 XP
          if (updates.notesStatus === 'completed' && lec.notesStatus !== 'completed') {
            grantRewardXp(`notes_${lec.id}`, 50);
            spartanSound.playSwordClash();
            registerActivityForStreak();
            merged.notesCompletedDate = new Date().toISOString().split('T')[0];
          }

          // If status was changed directly in updates
          if (updates.status === 'completed' && lec.status !== 'completed') {
            grantRewardXp(`lec_${lec.id}`, 100);
            spartanSound.playSwordClash();
            registerActivityForStreak();
            merged.completedDate = new Date().toISOString().split('T')[0];
          }

          return merged;
        }
        return lec;
      });

      return {
        ...prev,
        [subjectId]: updatedList
      };
    });
  }, [grantRewardXp, registerActivityForStreak]);

  // Bulk complete lectures in a subject
  const bulkCompleteLectures = useCallback((subjectId: string, count: number) => {
    setLectures(prev => {
      const subjectList = prev[subjectId] || [];
      let completedInThisBatch = 0;
      const today = new Date().toISOString().split('T')[0];

      const updated = subjectList.map(lec => {
        if (lec.status !== 'completed' && completedInThisBatch < count) {
          completedInThisBatch++;
          grantRewardXp(`lec_${lec.id}`, 100);
          return {
            ...lec,
            status: 'completed' as const,
            completedDate: today
          };
        }
        return lec;
      });

      if (completedInThisBatch > 0) {
        spartanSound.playSwordClash();
        registerActivityForStreak();
      }

      const allCompleted = updated.length > 0 && updated.every(l => l.status === 'completed');
      if (allCompleted) {
        grantRewardXp(`subject_conquered_${subjectId}`, 1000);
        spartanSound.playWarHorn();
      }

      return {
        ...prev,
        [subjectId]: updated
      };
    });
  }, [grantRewardXp, registerActivityForStreak]);

  // Bulk complete notes in a subject
  const bulkCompleteNotes = useCallback((subjectId: string, count: number) => {
    setLectures(prev => {
      const subjectList = prev[subjectId] || [];
      let notesCompletedInBatch = 0;
      const today = new Date().toISOString().split('T')[0];

      const updated = subjectList.map(lec => {
        if (lec.notesStatus !== 'completed' && notesCompletedInBatch < count) {
          notesCompletedInBatch++;
          grantRewardXp(`notes_${lec.id}`, 50);
          return {
            ...lec,
            notesStatus: 'completed' as const,
            notesCompletedDate: today
          };
        }
        return lec;
      });

      if (notesCompletedInBatch > 0) {
        spartanSound.playShieldClick();
        registerActivityForStreak();
      }

      return {
        ...prev,
        [subjectId]: updated
      };
    });
  }, [grantRewardXp, registerActivityForStreak]);

  // Battle Orders CRUD
  const addBattleOrder = useCallback((order: Omit<BattleOrder, 'id'>) => {
    const newOrder: BattleOrder = {
      ...order,
      id: `bo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    };
    setBattleOrders(prev => [newOrder, ...prev]);
    spartanSound.playShieldClick();
  }, []);

  const updateBattleOrder = useCallback((orderId: string, updates: Partial<BattleOrder>) => {
    setBattleOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates } : o));
  }, []);

  const toggleBattleOrder = useCallback((orderId: string) => {
    setBattleOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const next = !o.isCompleted;
        if (next) {
          grantRewardXp(`battle_order_${orderId}`, 30);
          spartanSound.playSwordClash();
          registerActivityForStreak();
        } else {
          spartanSound.playShieldClick();
        }
        return { ...o, isCompleted: next };
      }
      return o;
    }));
  }, [grantRewardXp, registerActivityForStreak]);

  const deleteBattleOrder = useCallback((orderId: string) => {
    setBattleOrders(prev => prev.filter(o => o.id !== orderId));
    spartanSound.playShieldClick();
  }, []);

  // Phase 2: Active Recall
  const addActiveRecallSession = useCallback((session: Omit<ActiveRecallSession, 'id' | 'createdAt'>) => {
    const newSession: ActiveRecallSession = {
      ...session,
      id: `recall_${Date.now()}`,
      createdAt: Date.now()
    };
    setActiveRecallSessions(prev => [newSession, ...prev]);
    // Active recall reward: +75 XP
    grantRewardXp(`recall_${newSession.id}`, 75);
    spartanSound.playSwordClash();
    registerActivityForStreak();
  }, [grantRewardXp, registerActivityForStreak]);

  const deleteActiveRecallSession = useCallback((id: string) => {
    setActiveRecallSessions(prev => prev.filter(s => s.id !== id));
  }, []);

  // Phase 2: Answer Writing
  const addAnswerWritingSession = useCallback((session: Omit<AnswerWritingSession, 'id' | 'createdAt'>) => {
    const newSession: AnswerWritingSession = {
      ...session,
      id: `ans_${Date.now()}`,
      createdAt: Date.now()
    };
    setAnswerWritingSessions(prev => [newSession, ...prev]);
    // Answer writing reward: +100 XP
    grantRewardXp(`ans_${newSession.id}`, 100);
    spartanSound.playSwordClash();
    registerActivityForStreak();
  }, [grantRewardXp, registerActivityForStreak]);

  const deleteAnswerWritingSession = useCallback((id: string) => {
    setAnswerWritingSessions(prev => prev.filter(s => s.id !== id));
  }, []);

  // Phase 2: MCQ Session
  const addMCQSession = useCallback((session: Omit<MCQSession, 'id' | 'createdAt' | 'accuracy'>) => {
    const total = session.totalQuestions;
    const accuracy = total > 0 ? Math.round((session.correctAnswers / total) * 1000) / 10 : 0;
    const newSession: MCQSession = {
      ...session,
      id: `mcq_${Date.now()}`,
      accuracy,
      createdAt: Date.now()
    };
    setMcqSessions(prev => [newSession, ...prev]);

    // +50 XP per 20 questions completed
    const baseReward = Math.max(25, Math.floor((total / 20) * 50));
    let bonusXp = 0;
    // Score > 80% bonus: +50 XP
    if (accuracy >= 80) {
      bonusXp += 50;
    }

    grantRewardXp(`mcq_${newSession.id}`, baseReward + bonusXp);

    if (total >= 30 && accuracy >= 85) {
      grantRewardXp('achievement_mcq_sharpshooter', 800);
    }

    spartanSound.playSwordClash();
    registerActivityForStreak();
  }, [grantRewardXp, registerActivityForStreak]);

  const deleteMCQSession = useCallback((id: string) => {
    setMcqSessions(prev => prev.filter(s => s.id !== id));
  }, []);

  // Phase 2: Revision Records
  const addOrUpdateRevisionRecord = useCallback((record: Omit<RevisionRecord, 'id'> & { id?: string }) => {
    setRevisionRecords(prev => {
      const recId = record.id || `rev_${Date.now()}`;
      const existing = prev.find(r => r.id === recId);
      if (existing) {
        return prev.map(r => r.id === recId ? { ...r, ...record, id: recId } : r);
      }
      return [{ ...record, id: recId }, ...prev];
    });
    grantRewardXp(`rev_${Date.now()}`, 40);
    spartanSound.playShieldClick();
    registerActivityForStreak();
  }, [grantRewardXp, registerActivityForStreak]);

  const deleteRevisionRecord = useCallback((id: string) => {
    setRevisionRecords(prev => prev.filter(r => r.id !== id));
  }, []);

  // Profile
  const updateProfile = useCallback((updates: Partial<WarriorProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    spartanSound.playShieldClick();
  }, []);

  const toggleExtendedModules = useCallback(() => {
    setIncludeExtendedModules(prev => {
      const next = !prev;
      // ensure lectures are initialized if toggled on
      if (next) {
        setLectures(curr => {
          const copy = { ...curr };
          for (const s of EXTENSION_SUBJECTS) {
            if (!copy[s.id]) {
              copy[s.id] = generateLecturesForSubject(s);
            }
          }
          return copy;
        });
      }
      return next;
    });
  }, []);

  // Export JSON
  const exportDataJson = useCallback(() => {
    const data = {
      version: 1,
      appName: 'The Empire of IAS — Rise of the Warrior',
      exportTimestamp: new Date().toISOString(),
      profile,
      includeExtendedModules,
      totalXp,
      claimedRewardIds,
      streakDays,
      lectures,
      battleOrders,
      activeRecallSessions,
      answerWritingSessions,
      mcqSessions,
      revisionRecords,
      achievements
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Empire_of_IAS_Progress_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    spartanSound.playWarHorn();
  }, [
    profile,
    includeExtendedModules,
    totalXp,
    claimedRewardIds,
    streakDays,
    lectures,
    battleOrders,
    activeRecallSessions,
    answerWritingSessions,
    mcqSessions,
    revisionRecords,
    achievements
  ]);

  // Import JSON
  const importDataJson = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') return false;

      if (parsed.lectures) setLectures(parsed.lectures);
      if (parsed.battleOrders) setBattleOrders(parsed.battleOrders);
      if (parsed.activeRecallSessions) setActiveRecallSessions(parsed.activeRecallSessions);
      if (parsed.answerWritingSessions) setAnswerWritingSessions(parsed.answerWritingSessions);
      if (parsed.mcqSessions) setMcqSessions(parsed.mcqSessions);
      if (parsed.revisionRecords) setRevisionRecords(parsed.revisionRecords);
      if (parsed.achievements) setAchievements(parsed.achievements);
      if (typeof parsed.totalXp === 'number') setTotalXp(parsed.totalXp);
      if (Array.isArray(parsed.claimedRewardIds)) setClaimedRewardIds(parsed.claimedRewardIds);
      if (typeof parsed.streakDays === 'number') setStreakDays(parsed.streakDays);
      if (parsed.profile) setProfile(parsed.profile);
      if (typeof parsed.includeExtendedModules === 'boolean') {
        setIncludeExtendedModules(parsed.includeExtendedModules);
      }

      spartanSound.playWarHorn();
      return true;
    } catch (e) {
      console.error('Failed to parse import data:', e);
      return false;
    }
  }, []);

  // Reset progress with confirmation
  const resetAllProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setLectures(generateAllInitialLectures([...CORE_SUBJECTS, ...EXTENSION_SUBJECTS]));
    setBattleOrders([]);
    setActiveRecallSessions([]);
    setAnswerWritingSessions([]);
    setMcqSessions([]);
    setRevisionRecords([]);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setTotalXp(0);
    setClaimedRewardIds([]);
    setStreakDays(1);
    setLastActivityDate(new Date().toISOString().split('T')[0]);
    spartanSound.playShieldClick();
  }, []);

  return (
    <EmpireContext.Provider
      value={{
        subjects,
        lectures,
        battleOrders,
        activeRecallSessions,
        answerWritingSessions,
        mcqSessions,
        revisionRecords,
        achievements,
        profile,
        totalXp,
        streakDays,
        claimedRewardIds,
        includeExtendedModules,

        totalLectures,
        completedLecturesCount,
        remainingLecturesCount,
        totalStudyHours,
        completedLectureHours,
        remainingLectureHours,
        overallPercentage,
        notesCompletedCount,
        notesRemainingCount,
        notesPercentage,
        militaryRank,
        warriorLevelData,
        currentEmpireStage,
        totalBattlesWon,

        toggleLectureStatus,
        updateLecture,
        bulkCompleteLectures,
        bulkCompleteNotes,

        addBattleOrder,
        updateBattleOrder,
        toggleBattleOrder,
        deleteBattleOrder,

        addActiveRecallSession,
        deleteActiveRecallSession,

        addAnswerWritingSession,
        deleteAnswerWritingSession,

        addMCQSession,
        deleteMCQSession,

        addOrUpdateRevisionRecord,
        deleteRevisionRecord,

        updateProfile,
        toggleExtendedModules,
        exportDataJson,
        importDataJson,
        resetAllProgress
      }}
    >
      {children}
    </EmpireContext.Provider>
  );
};

export const useEmpire = (): EmpireContextType => {
  const ctx = useContext(EmpireContext);
  if (!ctx) {
    throw new Error('useEmpire must be used within an EmpireProvider');
  }
  return ctx;
};
