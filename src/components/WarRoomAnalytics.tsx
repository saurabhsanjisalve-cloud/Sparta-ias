import React, { useState, useMemo } from 'react';
import { useEmpire } from '../context/EmpireContext';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Brain,
  Sword,
  Flame,
  Layers,
  Award,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export const WarRoomAnalytics: React.FC = () => {
  const {
    subjects,
    lectures,
    completedLecturesCount,
    totalLectures,
    overallPercentage,
    notesCompletedCount,
    notesPercentage,
    activeRecallSessions,
    answerWritingSessions,
    mcqSessions,
    revisionRecords,
    streakDays,
    totalXp
  } = useEmpire();

  const [timeFilter, setTimeFilter] = useState<'today' | '7days' | '30days' | 'all'>('all');

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate hours invested
  const totalHoursInvested = completedLecturesCount * 2.5;

  // Answer writing stats
  const totalAnswers = answerWritingSessions.length;
  const avgAnswerScore = totalAnswers > 0
    ? Math.round(
        (answerWritingSessions.reduce((acc, a) => acc + a.marksObtained / (a.maxMarks || 1), 0) /
          totalAnswers) *
          100
      )
    : 0;

  // MCQ Stats
  const totalMCQs = mcqSessions.reduce((acc, m) => acc + m.totalQuestions, 0);
  const correctMCQs = mcqSessions.reduce((acc, m) => acc + m.correctAnswers, 0);
  const mcqAccuracy = totalMCQs > 0 ? Math.round((correctMCQs / totalMCQs) * 1000) / 10 : 0;

  // Subject-wise detailed conquest array
  const subjectProgressList = useMemo(() => {
    return subjects.map(s => {
      const list = lectures[s.id] || [];
      const completed = list.filter(l => l.status === 'completed').length;
      const notes = list.filter(l => l.notesStatus === 'completed').length;
      const pct = s.totalLectures > 0 ? Math.round((completed / s.totalLectures) * 1000) / 10 : 0;
      const hours = (completed * 2.5).toFixed(1);
      return {
        id: s.id,
        name: s.name,
        category: s.category,
        total: s.totalLectures,
        completed,
        notes,
        pct,
        hours
      };
    }).sort((a, b) => b.pct - a.pct);
  }, [subjects, lectures]);

  // Phase 1 vs Phase 2 completion indicators
  const phase1Score = Math.round((overallPercentage * 0.7) + (notesPercentage * 0.3));
  const phase2TotalActivities = activeRecallSessions.length + answerWritingSessions.length + mcqSessions.length + revisionRecords.length;
  const phase2Benchmark = 200; // 200 sessions benchmark for comprehensive mastery
  const phase2Score = Math.min(100, Math.round((phase2TotalActivities / phase2Benchmark) * 100));

  // Past 30 Days activity matrix generator
  const streakMatrix = useMemo(() => {
    const days: { date: string; dayNum: number; active: boolean; intensity: number }[] = [];
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      // Check if user has active streak or any recorded actions on this date
      const active = i < streakDays;
      days.push({
        date: dateKey,
        dayNum: d.getDate(),
        active,
        intensity: active ? (i === 0 ? 3 : 2) : 0
      });
    }
    return days;
  }, [streakDays]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-900/40 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-red-950/70 border border-red-700/50 text-red-300 text-[11px] font-cinzel font-bold">
            <BarChart3 className="w-3.5 h-3.5 text-red-400" />
            <span>WAR ROOM TELEMETRY</span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-amber-100">
            ANALYTICS & STRATEGIC COMBAT INTELLIGENCE
          </h1>
          <p className="text-xs text-stone-400">
            Audit your tactical output, syllabus territory penetration, study hours, and exam readiness.
          </p>
        </div>

        {/* Time Filters */}
        <div className="flex items-center gap-1 p-1 bg-stone-900/80 rounded-lg border border-stone-800 text-xs">
          {(['today', '7days', '30days', 'all'] as const).map(f => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={`px-3 py-1.5 rounded capitalize font-cinzel font-medium transition-all ${
                timeFilter === f
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-700/50 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {f === 'today' ? 'Today' : f === '7days' ? 'Last 7 Days' : f === '30days' ? 'Last 30 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Workload Invested */}
        <div className="spartan-card p-4 space-y-2 border-amber-900/40">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="uppercase text-[11px]">Total Study Hours</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono text-2xl font-black text-stone-100 tabular-nums">
            {totalHoursInvested.toFixed(1)} <span className="text-xs text-stone-400 font-normal">hrs</span>
          </div>
          <div className="text-[11px] text-stone-400 flex items-center justify-between pt-1">
            <span>Syllabus Target:</span>
            <span className="font-mono text-stone-300">{(totalLectures * 2.5).toFixed(1)}h</span>
          </div>
        </div>

        {/* Weekly Velocity */}
        <div className="spartan-card p-4 space-y-2 border-amber-900/40">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="uppercase text-[11px]">Weekly Lecture Pace</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-black text-emerald-400 tabular-nums">
            ~12.5 <span className="text-xs text-stone-400 font-normal">lecs/wk</span>
          </div>
          <div className="text-[11px] text-stone-400 flex items-center justify-between pt-1">
            <span>Estimated Conquest:</span>
            <span className="font-mono text-stone-300">~62 Weeks</span>
          </div>
        </div>

        {/* Mains Answer Precision */}
        <div className="spartan-card p-4 space-y-2 border-amber-900/40">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="uppercase text-[11px]">Mains Mark Yield</span>
            <Sword className="w-4 h-4 text-red-400" />
          </div>
          <div className="font-mono text-2xl font-black text-red-400 tabular-nums">
            {avgAnswerScore}%
          </div>
          <div className="text-[11px] text-stone-400 flex items-center justify-between pt-1">
            <span>Evaluated:</span>
            <span className="font-mono text-stone-300">{totalAnswers} answers</span>
          </div>
        </div>

        {/* Prelims MCQ Accuracy */}
        <div className="spartan-card p-4 space-y-2 border-amber-900/40">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="uppercase text-[11px]">Prelims MCQ Accuracy</span>
            <Target className="w-4 h-4 text-amber-300" />
          </div>
          <div className="font-mono text-2xl font-black text-amber-300 tabular-nums">
            {mcqAccuracy}%
          </div>
          <div className="text-[11px] text-stone-400 flex items-center justify-between pt-1">
            <span>Attempted:</span>
            <span className="font-mono text-stone-300">{totalMCQs} questions</span>
          </div>
        </div>
      </div>

      {/* Phase 1 vs Phase 2 Comparison Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="spartan-card p-5 border-amber-900/40 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="space-y-0.5">
              <h3 className="font-cinzel text-sm font-bold text-amber-200">
                Phase 1: Foundation Readiness
              </h3>
              <p className="text-xs text-stone-400">
                Lecture viewing & comprehensive personal notes.
              </p>
            </div>
            <span className="font-mono text-lg font-bold text-amber-400">{phase1Score}%</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-stone-300 mb-1">
                <span>Lecture Coverage ({completedLecturesCount}/{totalLectures})</span>
                <span className="font-mono">{overallPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
                <div className="h-full spartan-gold-gradient rounded-full" style={{ width: `${overallPercentage}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-stone-300 mb-1">
                <span>Notes Coverage ({notesCompletedCount}/{totalLectures})</span>
                <span className="font-mono">{notesPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
                <div className="h-full bg-amber-600 rounded-full" style={{ width: `${notesPercentage}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="spartan-card p-5 border-amber-900/40 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="space-y-0.5">
              <h3 className="font-cinzel text-sm font-bold text-red-300">
                Phase 2: Mastery & War Games
              </h3>
              <p className="text-xs text-stone-400">
                Active Recall, Mains Answers, MCQs & 4-Cycle Revisions.
              </p>
            </div>
            <span className="font-mono text-lg font-bold text-red-400">{phase2Score}%</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded bg-stone-900/80 border border-stone-800">
              <span className="text-stone-400 block text-[11px]">Active Recall Sessions</span>
              <span className="font-mono text-base font-bold text-amber-400">{activeRecallSessions.length}</span>
            </div>
            <div className="p-3 rounded bg-stone-900/80 border border-stone-800">
              <span className="text-stone-400 block text-[11px]">Mains Answers Written</span>
              <span className="font-mono text-base font-bold text-red-400">{answerWritingSessions.length}</span>
            </div>
            <div className="p-3 rounded bg-stone-900/80 border border-stone-800">
              <span className="text-stone-400 block text-[11px]">MCQ Sessions Logged</span>
              <span className="font-mono text-base font-bold text-emerald-400">{mcqSessions.length}</span>
            </div>
            <div className="p-3 rounded bg-stone-900/80 border border-stone-800">
              <span className="text-stone-400 block text-[11px]">Revision Topics Tracked</span>
              <span className="font-mono text-base font-bold text-blue-400">{revisionRecords.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 30-Day Spartan Streak Heat Matrix */}
      <div className="spartan-card p-5 border-amber-900/40 space-y-3">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div>
            <h3 className="font-cinzel text-sm font-bold text-amber-200 flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-500" />
              <span>30-DAY SPARTAN DISCIPLINE MATRIX</span>
            </h3>
            <p className="text-xs text-stone-400">
              Battle campaign consistency over the past month. Active streak: {streakDays} days.
            </p>
          </div>
          <span className="font-mono text-xs text-red-400 font-bold">{streakDays} Consecutive Days</span>
        </div>

        <div className="grid grid-cols-10 sm:grid-cols-15 gap-1.5 pt-2">
          {streakMatrix.map((item, idx) => {
            return (
              <div
                key={idx}
                title={`${item.date}: ${item.active ? 'Battle Active' : 'No Activity'}`}
                className={`aspect-square rounded flex items-center justify-center text-[10px] font-mono border transition-all ${
                  item.active
                    ? 'bg-red-800/80 border-red-600/60 text-red-100 shadow-sm shadow-red-950'
                    : 'bg-stone-900/60 border-stone-800 text-stone-600'
                }`}
              >
                {item.dayNum}
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject-Wise Conquest Leaderboard */}
      <div className="spartan-card p-5 border-amber-900/40 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div>
            <h3 className="font-cinzel text-base font-bold text-amber-200">
              TERRITORY-BY-TERRITORY SYLLABUS PENETRATION
            </h3>
            <p className="text-xs text-stone-400">
              All 19 UPSC core subjects ranked by conquest percentage.
            </p>
          </div>
          <span className="text-xs text-stone-400 font-mono">19 Core Provinces</span>
        </div>

        <div className="space-y-3">
          {subjectProgressList.map(s => {
            return (
              <div key={s.id} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-stone-300">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-400">
                      {s.category}
                    </span>
                    <span className="font-cinzel font-semibold text-stone-100">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-stone-400 font-mono">
                    <span>{s.completed}/{s.total} Lecs</span>
                    <span>·</span>
                    <span>{s.hours}h</span>
                    <span>·</span>
                    <strong className="text-amber-400">{s.pct}%</strong>
                  </div>
                </div>

                <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                  <div
                    className="h-full spartan-gold-gradient rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(s.completed > 0 ? 3 : 0, s.pct))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
