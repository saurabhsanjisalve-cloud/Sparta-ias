import React, { useState, useMemo } from 'react';
import { useEmpire } from '../context/EmpireContext';
import {
  ActiveRecallSession,
  AnswerWritingSession,
  MCQSession,
  RevisionRecord
} from '../types';
import {
  Brain,
  Sword,
  Target,
  RotateCcw,
  Plus,
  Trash2,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  FileText
} from 'lucide-react';

export const Phase2Mastery: React.FC = () => {
  const {
    subjects,
    activeRecallSessions,
    addActiveRecallSession,
    deleteActiveRecallSession,
    answerWritingSessions,
    addAnswerWritingSession,
    deleteAnswerWritingSession,
    mcqSessions,
    addMCQSession,
    deleteMCQSession,
    revisionRecords,
    addOrUpdateRevisionRecord,
    deleteRevisionRecord
  } = useEmpire();

  const [activeSubTab, setActiveSubTab] = useState<'recall' | 'answer' | 'mcq' | 'revision'>('recall');

  // Form states for Active Recall
  const [recallSubjectId, setRecallSubjectId] = useState(subjects[0]?.id || 'economy');
  const [recallTopic, setRecallTopic] = useState('');
  const [recallScore, setRecallScore] = useState<number>(4);
  const [recallWeakAreas, setRecallWeakAreas] = useState('');
  const [recallRevRequired, setRecallRevRequired] = useState(false);

  // Form states for Answer Writing
  const [ansSubjectId, setAnsSubjectId] = useState(subjects[0]?.id || 'polity');
  const [ansTopic, setAnsTopic] = useState('');
  const [ansMarks, setAnsMarks] = useState<number>(9);
  const [ansMaxMarks, setAnsMaxMarks] = useState<number>(15);
  const [ansEvalStatus, setAnsEvalStatus] = useState<'self' | 'peer' | 'mentor' | 'pending'>('self');
  const [ansNotes, setAnsNotes] = useState('');

  // Form states for MCQ Practice
  const [mcqSubjectId, setMcqSubjectId] = useState(subjects[0]?.id || 'environment');
  const [mcqTopic, setMcqTopic] = useState('');
  const [mcqTotal, setMcqTotal] = useState<number>(25);
  const [mcqCorrect, setMcqCorrect] = useState<number>(21);
  const [mcqScore, setMcqScore] = useState<number>(42);

  // Form states for Revision Tracker
  const [revSubjectId, setRevSubjectId] = useState(subjects[0]?.id || 'economy');
  const [revTopic, setRevTopic] = useState('');

  // Performance calculations
  const totalRecall = activeRecallSessions.length;
  const avgRecallScore = totalRecall > 0
    ? (activeRecallSessions.reduce((acc, s) => acc + s.qualityScore, 0) / totalRecall).toFixed(1)
    : '0.0';

  const totalAnswers = answerWritingSessions.length;
  const avgAnswerPct = totalAnswers > 0
    ? Math.round((answerWritingSessions.reduce((acc, a) => acc + (a.marksObtained / (a.maxMarks || 1)), 0) / totalAnswers) * 100)
    : 0;

  const totalMCQsAttempted = mcqSessions.reduce((acc, m) => acc + m.totalQuestions, 0);
  const totalMCQsCorrect = mcqSessions.reduce((acc, m) => acc + m.correctAnswers, 0);
  const overallMCQAccuracy = totalMCQsAttempted > 0
    ? Math.round((totalMCQsCorrect / totalMCQsAttempted) * 1000) / 10
    : 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Phase 2 Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-900/40 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-red-950/70 border border-red-700/50 text-red-300 text-[11px] font-cinzel font-bold">
            <Sword className="w-3.5 h-3.5 text-red-400" />
            <span>CAMPAIGN PHASE 2: REVISION & COMBAT MASTERY</span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-amber-100">
            WAR GAMES, RETENTION & EXAMINATION TRIAL
          </h1>
          <p className="text-xs text-stone-400">
            Transform knowledge into examination performance via Active Recall, Timed Answer Writing, Prelims MCQs, and Multi-Cycle Revisions.
          </p>
        </div>
      </div>

      {/* PHASE 2 PERFORMANCE DASHBOARD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Active Recall Summary */}
        <div className="spartan-card p-4 space-y-2 border-amber-900/40">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="uppercase text-[11px]">Active Recall Drills</span>
            <Brain className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono text-2xl font-black text-stone-100 tabular-nums">
            {totalRecall} <span className="text-xs text-stone-400 font-normal">sessions</span>
          </div>
          <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
            <span>Avg Quality:</span>
            <span className="font-mono text-amber-400 font-semibold">{avgRecallScore} / 5</span>
          </div>
          <div className="text-[10px] text-stone-400">
            +75 XP per session completed
          </div>
        </div>

        {/* Answer Writing Performance */}
        <div className="spartan-card p-4 space-y-2 border-amber-900/40">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="uppercase text-[11px]">Mains Answers</span>
            <Sword className="w-4 h-4 text-red-400" />
          </div>
          <div className="font-mono text-2xl font-black text-stone-100 tabular-nums">
            {totalAnswers} <span className="text-xs text-stone-400 font-normal">evaluated</span>
          </div>
          <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
            <span>Avg Mark Yield:</span>
            <span className="font-mono text-red-400 font-semibold">{avgAnswerPct}%</span>
          </div>
          <div className="text-[10px] text-stone-400">
            +100 XP per answer forged
          </div>
        </div>

        {/* MCQ Accuracy */}
        <div className="spartan-card p-4 space-y-2 border-amber-900/40">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="uppercase text-[11px]">MCQ Practice</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-black text-emerald-400 tabular-nums">
            {overallMCQAccuracy}%
          </div>
          <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
            <span>Attempted:</span>
            <span className="font-mono text-stone-300 font-semibold">{totalMCQsAttempted} Questions</span>
          </div>
          <div className="text-[10px] text-stone-400">
            {totalMCQsCorrect} Correct · Accuracy = (Correct/Total)×100
          </div>
        </div>

        {/* Revision Records */}
        <div className="spartan-card p-4 space-y-2 border-amber-900/40">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="uppercase text-[11px]">Revision Cycles</span>
            <RotateCcw className="w-4 h-4 text-blue-400" />
          </div>
          <div className="font-mono text-2xl font-black text-stone-100 tabular-nums">
            {revisionRecords.length} <span className="text-xs text-stone-400 font-normal">topics</span>
          </div>
          <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
            <span>Cycle Depth:</span>
            <span className="font-mono text-blue-400 font-semibold">1st to 4th Cycle</span>
          </div>
          <div className="text-[10px] text-stone-400">
            Multi-pass spaced repetition
          </div>
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex items-center gap-2 p-1 bg-stone-900/80 rounded-lg border border-stone-800 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('recall')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-cinzel font-bold rounded transition-all whitespace-nowrap ${
            activeSubTab === 'recall'
              ? 'bg-amber-950/70 text-amber-300 border border-amber-600/50 shadow'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Active Recall ({activeRecallSessions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('answer')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-cinzel font-bold rounded transition-all whitespace-nowrap ${
            activeSubTab === 'answer'
              ? 'bg-amber-950/70 text-amber-300 border border-amber-600/50 shadow'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Sword className="w-4 h-4" />
          <span>Answer Writing ({answerWritingSessions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('mcq')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-cinzel font-bold rounded transition-all whitespace-nowrap ${
            activeSubTab === 'mcq'
              ? 'bg-amber-950/70 text-amber-300 border border-amber-600/50 shadow'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>MCQ Practice ({mcqSessions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('revision')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-cinzel font-bold rounded transition-all whitespace-nowrap ${
            activeSubTab === 'revision'
              ? 'bg-amber-950/70 text-amber-300 border border-amber-600/50 shadow'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Revision Cycles ({revisionRecords.length})</span>
        </button>
      </div>

      {/* SUB-TAB A: ACTIVE RECALL */}
      {activeSubTab === 'recall' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Logger Form */}
          <div className="lg:col-span-4 spartan-card p-5 border-amber-900/40 space-y-4">
            <h3 className="font-cinzel text-sm font-bold text-amber-200 flex items-center gap-2">
              <Brain className="w-4 h-4 text-amber-400" />
              <span>Log Active Recall Session</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Subject</label>
                <select
                  value={recallSubjectId}
                  onChange={e => setRecallSubjectId(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Topic Name</label>
                <input
                  type="text"
                  placeholder="E.g., Monetary Policy transmission channels..."
                  value={recallTopic}
                  onChange={e => setRecallTopic(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 placeholder:text-stone-600"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Quality Score (1 to 5 Spartan Swords)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(score => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setRecallScore(score)}
                      className={`w-9 h-9 rounded font-mono font-bold border transition-colors ${
                        recallScore === score
                          ? 'bg-amber-600 text-stone-950 border-amber-400'
                          : 'bg-stone-900 text-stone-400 border-stone-700 hover:border-amber-600'
                      }`}
                    >
                      {score}★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Weak Areas Identified</label>
                <textarea
                  rows={2}
                  placeholder="Key provisions or data points forgotten..."
                  value={recallWeakAreas}
                  onChange={e => setRecallWeakAreas(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 placeholder:text-stone-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="revRequired"
                  checked={recallRevRequired}
                  onChange={e => setRecallRevRequired(e.target.checked)}
                  className="rounded border-stone-700 bg-stone-900 text-amber-500 w-4 h-4"
                />
                <label htmlFor="revRequired" className="text-stone-300 cursor-pointer">
                  Mark as Revision Required (Flag for follow-up)
                </label>
              </div>

              <button
                type="button"
                disabled={!recallTopic.trim()}
                onClick={() => {
                  addActiveRecallSession({
                    date: new Date().toISOString().split('T')[0],
                    subjectId: recallSubjectId,
                    topicName: recallTopic.trim(),
                    qualityScore: recallScore,
                    weakAreas: recallWeakAreas.trim(),
                    revisionRequired: recallRevRequired
                  });
                  setRecallTopic('');
                  setRecallWeakAreas('');
                  setRecallRevRequired(false);
                }}
                className="w-full py-2.5 px-4 rounded bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-700 hover:to-amber-600 text-amber-100 font-cinzel font-bold text-xs uppercase tracking-wider transition-all border border-amber-600/40 disabled:opacity-40"
              >
                Record Recall (+75 XP)
              </button>
            </div>
          </div>

          {/* Sessions List */}
          <div className="lg:col-span-8 spartan-card p-5 border-amber-900/40 space-y-4">
            <h3 className="font-cinzel text-sm font-bold text-amber-200">
              Active Recall Battle Archive ({activeRecallSessions.length})
            </h3>

            {activeRecallSessions.length === 0 ? (
              <div className="py-12 text-center text-stone-500 text-xs border border-dashed border-stone-800 rounded-lg space-y-2">
                <Brain className="w-8 h-8 mx-auto text-stone-700" />
                <p>No active recall sessions logged yet. Test your memory on a topic today.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {activeRecallSessions.map(session => {
                  const sub = subjects.find(s => s.id === session.subjectId);
                  return (
                    <div
                      key={session.id}
                      className="p-3.5 rounded-lg bg-stone-900/70 border border-stone-800 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-cinzel font-bold text-amber-400">
                            {sub?.name || session.subjectId}
                          </span>
                          <span>·</span>
                          <span className="text-stone-200 font-medium">{session.topicName}</span>
                          {session.revisionRequired && (
                            <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-400 font-mono text-[10px] border border-red-800">
                              Revision Needed
                            </span>
                          )}
                        </div>
                        {session.weakAreas && (
                          <div className="text-[11px] text-stone-400">
                            Weak points: <span className="text-stone-300">{session.weakAreas}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-[10px] text-stone-500">
                          <span className="font-mono">Date: {session.date}</span>
                          <span>·</span>
                          <span className="font-mono text-amber-500">Score: {session.qualityScore} / 5</span>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteActiveRecallSession(session.id)}
                        className="p-1 rounded text-stone-500 hover:text-red-400"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB B: ANSWER WRITING */}
      {activeSubTab === 'answer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Logger Form */}
          <div className="lg:col-span-4 spartan-card p-5 border-amber-900/40 space-y-4">
            <h3 className="font-cinzel text-sm font-bold text-amber-200 flex items-center gap-2">
              <Sword className="w-4 h-4 text-red-400" />
              <span>Log Mains Answer Writing</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Subject</label>
                <select
                  value={ansSubjectId}
                  onChange={e => setAnsSubjectId(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Question / Mains Topic</label>
                <input
                  type="text"
                  placeholder="E.g., Critically evaluate the role of the Governor..."
                  value={ansTopic}
                  onChange={e => setAnsTopic(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 placeholder:text-stone-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Marks Obtained</label>
                  <input
                    type="number"
                    step="0.5"
                    value={ansMarks}
                    onChange={e => setAnsMarks(parseFloat(e.target.value) || 0)}
                    className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Maximum Marks</label>
                  <input
                    type="number"
                    value={ansMaxMarks}
                    onChange={e => setAnsMaxMarks(parseInt(e.target.value) || 1)}
                    className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Evaluation Status</label>
                <select
                  value={ansEvalStatus}
                  onChange={e => setAnsEvalStatus(e.target.value as any)}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 capitalize"
                >
                  <option value="self">Self-Evaluated</option>
                  <option value="peer">Peer Review</option>
                  <option value="mentor">Mentor / Institute</option>
                  <option value="pending">Pending Evaluation</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Improvement Notes / Feedback</label>
                <textarea
                  rows={2}
                  placeholder="E.g., Add Supreme Court judgments; structure with flowcharts..."
                  value={ansNotes}
                  onChange={e => setAnsNotes(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 placeholder:text-stone-600"
                />
              </div>

              <button
                type="button"
                disabled={!ansTopic.trim()}
                onClick={() => {
                  addAnswerWritingSession({
                    date: new Date().toISOString().split('T')[0],
                    subjectId: ansSubjectId,
                    questionTopic: ansTopic.trim(),
                    marksObtained: ansMarks,
                    maxMarks: ansMaxMarks,
                    evaluationStatus: ansEvalStatus,
                    improvementNotes: ansNotes.trim()
                  });
                  setAnsTopic('');
                  setAnsNotes('');
                }}
                className="w-full py-2.5 px-4 rounded bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-700 hover:to-amber-600 text-amber-100 font-cinzel font-bold text-xs uppercase tracking-wider transition-all border border-amber-600/40 disabled:opacity-40"
              >
                Log Answer (+100 XP)
              </button>
            </div>
          </div>

          {/* Answers List */}
          <div className="lg:col-span-8 spartan-card p-5 border-amber-900/40 space-y-4">
            <h3 className="font-cinzel text-sm font-bold text-amber-200">
              Answer Writing Campaign Log ({answerWritingSessions.length})
            </h3>

            {answerWritingSessions.length === 0 ? (
              <div className="py-12 text-center text-stone-500 text-xs border border-dashed border-stone-800 rounded-lg space-y-2">
                <Sword className="w-8 h-8 mx-auto text-stone-700" />
                <p>No answers recorded yet. Write your first Mains answer and log your marks.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {answerWritingSessions.map(session => {
                  const sub = subjects.find(s => s.id === session.subjectId);
                  const pct = Math.round((session.marksObtained / session.maxMarks) * 100);

                  return (
                    <div
                      key={session.id}
                      className="p-3.5 rounded-lg bg-stone-900/70 border border-stone-800 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-cinzel font-bold text-red-400">
                            {sub?.name || session.subjectId}
                          </span>
                          <span>·</span>
                          <span className="text-stone-200 font-medium">{session.questionTopic}</span>
                        </div>
                        {session.improvementNotes && (
                          <div className="text-[11px] text-stone-400">
                            Notes: <span className="text-stone-300">{session.improvementNotes}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-[10px] text-stone-500">
                          <span className="font-mono">Date: {session.date}</span>
                          <span>·</span>
                          <span className="font-mono text-amber-400">
                            Score: {session.marksObtained}/{session.maxMarks} ({pct}%)
                          </span>
                          <span>·</span>
                          <span className="capitalize text-stone-400">Eval: {session.evaluationStatus}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteAnswerWritingSession(session.id)}
                        className="p-1 rounded text-stone-500 hover:text-red-400"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB C: MCQ PRACTICE */}
      {activeSubTab === 'mcq' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Logger Form */}
          <div className="lg:col-span-4 spartan-card p-5 border-amber-900/40 space-y-4">
            <h3 className="font-cinzel text-sm font-bold text-amber-200 flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Log MCQ Practice Battle</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Subject</label>
                <select
                  value={mcqSubjectId}
                  onChange={e => setMcqSubjectId(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Topic / Test Name (Optional)</label>
                <input
                  type="text"
                  placeholder="E.g., Prelims Test 3 - Environment & Ecology..."
                  value={mcqTopic}
                  onChange={e => setMcqTopic(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 placeholder:text-stone-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Total Attempted</label>
                  <input
                    type="number"
                    value={mcqTotal}
                    onChange={e => {
                      const tot = parseInt(e.target.value) || 0;
                      setMcqTotal(tot);
                    }}
                    className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Correct Answers</label>
                  <input
                    type="number"
                    value={mcqCorrect}
                    onChange={e => {
                      const cor = parseInt(e.target.value) || 0;
                      setMcqCorrect(cor);
                    }}
                    className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 font-mono"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded bg-stone-900 border border-stone-800 text-xs flex items-center justify-between">
                <span className="text-stone-400">Automatic Accuracy:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {mcqTotal > 0 ? ((mcqCorrect / mcqTotal) * 100).toFixed(1) : 0}%
                </span>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Raw Test Score (Marks)</label>
                <input
                  type="number"
                  step="0.33"
                  value={mcqScore}
                  onChange={e => setMcqScore(parseFloat(e.target.value) || 0)}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 font-mono"
                />
              </div>

              <button
                type="button"
                disabled={mcqTotal <= 0}
                onClick={() => {
                  const incorrect = Math.max(0, mcqTotal - mcqCorrect);
                  addMCQSession({
                    date: new Date().toISOString().split('T')[0],
                    subjectId: mcqSubjectId,
                    topicName: mcqTopic.trim() || undefined,
                    totalQuestions: mcqTotal,
                    correctAnswers: mcqCorrect,
                    incorrectAnswers: incorrect,
                    testScore: mcqScore
                  });
                  setMcqTopic('');
                }}
                className="w-full py-2.5 px-4 rounded bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-700 hover:to-amber-600 text-amber-100 font-cinzel font-bold text-xs uppercase tracking-wider transition-all border border-amber-600/40 disabled:opacity-40"
              >
                Log Test (+50 XP + Bonus)
              </button>
            </div>
          </div>

          {/* MCQ Sessions List */}
          <div className="lg:col-span-8 spartan-card p-5 border-amber-900/40 space-y-4">
            <h3 className="font-cinzel text-sm font-bold text-amber-200">
              MCQ Combat Records ({mcqSessions.length})
            </h3>

            {mcqSessions.length === 0 ? (
              <div className="py-12 text-center text-stone-500 text-xs border border-dashed border-stone-800 rounded-lg space-y-2">
                <Target className="w-8 h-8 mx-auto text-stone-700" />
                <p>No MCQ tests logged yet. Practice 20 questions to unlock XP and calculate accuracy.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {mcqSessions.map(session => {
                  const sub = subjects.find(s => s.id === session.subjectId);

                  return (
                    <div
                      key={session.id}
                      className="p-3.5 rounded-lg bg-stone-900/70 border border-stone-800 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-cinzel font-bold text-emerald-400">
                            {sub?.name || session.subjectId}
                          </span>
                          {session.topicName && (
                            <>
                              <span>·</span>
                              <span className="text-stone-200">{session.topicName}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-stone-400">
                          <span>Attempted: <strong className="font-mono text-stone-200">{session.totalQuestions}</strong></span>
                          <span>·</span>
                          <span className="text-emerald-400 font-mono font-semibold">{session.correctAnswers} Correct</span>
                          <span>·</span>
                          <span className="text-red-400 font-mono">{session.incorrectAnswers} Incorrect</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-stone-500">
                          <span className="font-mono">Date: {session.date}</span>
                          <span>·</span>
                          <span className="font-mono text-amber-400">Accuracy: {session.accuracy}%</span>
                          <span>·</span>
                          <span className="font-mono">Score: {session.testScore}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteMCQSession(session.id)}
                        className="p-1 rounded text-stone-500 hover:text-red-400"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB D: 4-CYCLE REVISION TRACKER */}
      {activeSubTab === 'revision' && (
        <div className="spartan-card p-5 sm:p-6 border-amber-900/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
            <div>
              <h3 className="font-cinzel text-base font-bold text-amber-200 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-blue-400" />
                <span>4-CYCLE SPARTAN REVISION TRACKER</span>
              </h3>
              <p className="text-xs text-stone-400">
                Track 1st, 2nd, 3rd, and 4th spaced repetition cycles across key subject topics.
              </p>
            </div>

            {/* Quick Add Topic form */}
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={revSubjectId}
                onChange={e => setRevSubjectId(e.target.value)}
                className="bg-stone-900 border border-stone-700 rounded p-2 text-xs text-stone-200"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Topic name..."
                value={revTopic}
                onChange={e => setRevTopic(e.target.value)}
                className="bg-stone-900 border border-stone-700 rounded p-2 text-xs text-stone-200 placeholder:text-stone-600"
              />
              <button
                type="button"
                disabled={!revTopic.trim()}
                onClick={() => {
                  addOrUpdateRevisionRecord({
                    subjectId: revSubjectId,
                    topicName: revTopic.trim()
                  });
                  setRevTopic('');
                }}
                className="px-3.5 py-2 rounded bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-700 text-xs font-cinzel font-bold disabled:opacity-40"
              >
                + Add Topic
              </button>
            </div>
          </div>

          {/* Revision Topics Table */}
          {revisionRecords.length === 0 ? (
            <div className="py-12 text-center text-stone-500 text-xs border border-dashed border-stone-800 rounded-lg space-y-2">
              <RotateCcw className="w-8 h-8 mx-auto text-stone-700" />
              <p>No revision topics registered. Add a critical UPSC topic above to track 4 revision cycles.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-900/90 text-stone-400 uppercase font-cinzel border-b border-stone-800">
                  <tr>
                    <th className="py-3 px-4">Subject & Topic</th>
                    <th className="py-3 px-3 text-center">1st Cycle</th>
                    <th className="py-3 px-3 text-center">2nd Cycle</th>
                    <th className="py-3 px-3 text-center">3rd Cycle</th>
                    <th className="py-3 px-3 text-center">4th Cycle</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 font-sans">
                  {revisionRecords.map(rec => {
                    const sub = subjects.find(s => s.id === rec.subjectId);
                    const today = new Date().toISOString().split('T')[0];

                    return (
                      <tr key={rec.id} className="hover:bg-stone-900/40">
                        <td className="py-3 px-4">
                          <span className="font-cinzel text-amber-400 font-bold block text-[11px]">
                            {sub?.name || rec.subjectId}
                          </span>
                          <span className="font-semibold text-stone-100">{rec.topicName}</span>
                        </td>

                        {/* Cycle 1 */}
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              addOrUpdateRevisionRecord({
                                ...rec,
                                cycle1Date: rec.cycle1Date ? undefined : today
                              });
                            }}
                            className={`px-2 py-1 rounded font-mono text-[11px] border transition-colors ${
                              rec.cycle1Date
                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                                : 'bg-stone-900 text-stone-500 border-stone-800 hover:border-stone-600'
                            }`}
                          >
                            {rec.cycle1Date || 'Not Done'}
                          </button>
                        </td>

                        {/* Cycle 2 */}
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              addOrUpdateRevisionRecord({
                                ...rec,
                                cycle2Date: rec.cycle2Date ? undefined : today
                              });
                            }}
                            className={`px-2 py-1 rounded font-mono text-[11px] border transition-colors ${
                              rec.cycle2Date
                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                                : 'bg-stone-900 text-stone-500 border-stone-800 hover:border-stone-600'
                            }`}
                          >
                            {rec.cycle2Date || 'Not Done'}
                          </button>
                        </td>

                        {/* Cycle 3 */}
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              addOrUpdateRevisionRecord({
                                ...rec,
                                cycle3Date: rec.cycle3Date ? undefined : today
                              });
                            }}
                            className={`px-2 py-1 rounded font-mono text-[11px] border transition-colors ${
                              rec.cycle3Date
                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                                : 'bg-stone-900 text-stone-500 border-stone-800 hover:border-stone-600'
                            }`}
                          >
                            {rec.cycle3Date || 'Not Done'}
                          </button>
                        </td>

                        {/* Cycle 4 */}
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              addOrUpdateRevisionRecord({
                                ...rec,
                                cycle4Date: rec.cycle4Date ? undefined : today
                              });
                            }}
                            className={`px-2 py-1 rounded font-mono text-[11px] border transition-colors ${
                              rec.cycle4Date
                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                                : 'bg-stone-900 text-stone-500 border-stone-800 hover:border-stone-600'
                            }`}
                          >
                            {rec.cycle4Date || 'Not Done'}
                          </button>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => deleteRevisionRecord(rec.id)}
                            className="p-1 rounded text-stone-500 hover:text-red-400"
                            title="Delete topic"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
