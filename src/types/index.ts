export type LectureStatus = 'not_started' | 'in_progress' | 'completed';
export type NotesStatus = 'not_started' | 'in_progress' | 'completed';

export interface Lecture {
  id: string;
  subjectId: string;
  lectureNumber: number;
  title: string;
  status: LectureStatus;
  completedDate?: string;
  durationMinutes: number; // default 150 (2h 30m)
  notesStatus: NotesStatus;
  notesCompletedDate?: string;
  remarks: string;
}

export interface Subject {
  id: string;
  name: string;
  category: 'GS1' | 'GS2' | 'GS3' | 'GS4' | 'OPTIONAL' | 'CSAT' | 'ESSAY';
  totalLectures: number;
  description: string;
  territoryName: string; // Greek military territory name e.g. "Spartan Laconia", "Attica Plains"
  icon: string;
}

export type BattleOrderType = 'lecture' | 'notes' | 'recall' | 'answer' | 'mcq' | 'custom';

export interface BattleOrder {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: BattleOrderType;
  subjectId?: string;
  targetCount: number;
  completedCount: number;
  isCompleted: boolean;
  priority: 'urgent' | 'high' | 'normal';
  notes?: string;
}

export interface ActiveRecallSession {
  id: string;
  date: string;
  subjectId: string;
  topicName: string;
  qualityScore: number; // 1 to 5
  weakAreas: string;
  revisionRequired: boolean;
  createdAt: number;
}

export interface AnswerWritingSession {
  id: string;
  date: string;
  subjectId: string;
  questionTopic: string;
  marksObtained: number;
  maxMarks: number;
  evaluationStatus: 'self' | 'peer' | 'mentor' | 'pending';
  improvementNotes: string;
  createdAt: number;
}

export interface MCQSession {
  id: string;
  date: string;
  subjectId: string;
  topicName?: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number; // percentage
  testScore: number;
  createdAt: number;
}

export interface RevisionRecord {
  id: string;
  subjectId: string;
  topicName: string;
  cycle1Date?: string;
  cycle2Date?: string;
  cycle3Date?: string;
  cycle4Date?: string;
  notes?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'lectures' | 'notes' | 'streak' | 'recall' | 'answers' | 'mcq' | 'empire';
  xpReward: number;
  icon: string;
  unlockedAt?: string;
  targetProgress: number;
}

export interface WarriorProfile {
  warriorName: string;
  targetYear: string;
  optionalSubject: string;
  motto: string;
  avatarId: string;
  soundEnabled: boolean;
}

export type MilitaryRank =
  | 'Recruit'
  | 'Spartan Initiate'
  | 'Warrior'
  | 'Commander'
  | 'Spartan General'
  | 'Warlord'
  | 'Conqueror'
  | 'Emperor of Knowledge';

export interface EmpireStage {
  stage: number;
  name: string;
  minProgress: number; // percentage
  minXp: number;
  description: string;
  defenseBuff: string;
}
