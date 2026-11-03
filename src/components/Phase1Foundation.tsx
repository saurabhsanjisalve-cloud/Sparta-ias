import React, { useState, useMemo } from 'react';
import { useEmpire } from '../context/EmpireContext';
import { Lecture, Subject, LectureStatus, NotesStatus } from '../types';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Edit2,
  Calendar,
  Layers,
  ArrowRight,
  CheckCheck,
  AlertCircle
} from 'lucide-react';

interface Phase1FoundationProps {
  selectedSubjectId?: string;
  onSelectSubject?: (subjectId: string) => void;
}

export const Phase1Foundation: React.FC<Phase1FoundationProps> = ({
  selectedSubjectId: initialSubjectId
}) => {
  const {
    subjects,
    lectures,
    completedLecturesCount,
    remainingLecturesCount,
    totalLectures,
    overallPercentage,
    notesCompletedCount,
    notesRemainingCount,
    notesPercentage,
    toggleLectureStatus,
    updateLecture,
    bulkCompleteLectures,
    bulkCompleteNotes
  } = useEmpire();

  const [activeSubjectId, setActiveSubjectId] = useState<string>(
    initialSubjectId || subjects[0]?.id || 'economy'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'not_started' | 'in_progress' | 'completed' | 'notes_pending'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  // Modal for editing lecture remarks & metadata
  const [editingLecture, setEditingLecture] = useState<{ subjectId: string; lecture: Lecture } | null>(null);

  const activeSubject = useMemo(() => {
    return subjects.find(s => s.id === activeSubjectId) || subjects[0];
  }, [subjects, activeSubjectId]);

  const subjectLectures = useMemo(() => {
    return lectures[activeSubjectId] || [];
  }, [lectures, activeSubjectId]);

  // Subject specific stats
  const activeSubjectStats = useMemo(() => {
    const list = subjectLectures;
    const completed = list.filter(l => l.status === 'completed').length;
    const notesCompleted = list.filter(l => l.notesStatus === 'completed').length;
    const inProgress = list.filter(l => l.status === 'in_progress').length;
    const total = activeSubject ? activeSubject.totalLectures : list.length;
    const lecturePct = total > 0 ? Math.round((completed / total) * 1000) / 10 : 0;
    const notesPct = total > 0 ? Math.round((notesCompleted / total) * 1000) / 10 : 0;
    return { completed, notesCompleted, inProgress, total, lecturePct, notesPct };
  }, [subjectLectures, activeSubject]);

  // Filtered lectures for current subject
  const filteredLectures = useMemo(() => {
    return subjectLectures.filter(lec => {
      // Search filter
      const matchesSearch =
        lec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lec.lectureNumber.toString().includes(searchQuery) ||
        lec.remarks.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Status filter
      if (statusFilter === 'all') return true;
      if (statusFilter === 'notes_pending') {
        return lec.status === 'completed' && lec.notesStatus !== 'completed';
      }
      return lec.status === statusFilter;
    });
  }, [subjectLectures, searchQuery, statusFilter]);

  // Paginated list
  const totalPages = Math.max(1, Math.ceil(filteredLectures.length / pageSize));
  const paginatedLectures = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLectures.slice(start, start + pageSize);
  }, [filteredLectures, currentPage]);

  return (
    <div className="space-y-8 pb-16">
      {/* Phase 1 Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-900/40 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-amber-950/70 border border-amber-700/50 text-amber-300 text-[11px] font-cinzel font-bold">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>CAMPAIGN PHASE 1: FOUNDATION DRILL</span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-amber-100">
            LECTURE SYLLABUS & INTEL ARCHIVES
          </h1>
          <p className="text-xs text-stone-400">
            Master the core syllabus. Every lecture watched and note created constructs the bedrock of your empire.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400">
            Workload: <strong className="font-mono text-amber-400">{totalLectures}</strong> Lectures
          </span>
        </div>
      </div>

      {/* PHASE 1 DASHBOARD METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Lectures Completed */}
        <div className="spartan-card p-4 space-y-2 border-amber-900/40">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="uppercase text-[11px]">Lectures Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-black text-stone-100 tabular-nums">
            {completedLecturesCount} <span className="text-xs text-stone-400 font-normal">/ {totalLectures}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
            <span>Remaining:</span>
            <span className="font-mono text-stone-300 font-semibold">{remainingLecturesCount} left</span>
          </div>
          <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full spartan-gold-gradient rounded-full"
              style={{ width: `${Math.min(100, Math.max(3, overallPercentage))}%` }}
            />
          </div>
        </div>

        {/* Lecture Completion Rate */}
        <div className="spartan-card p-4 space-y-2 border-amber-900/40">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="uppercase text-[11px]">Lecture Progress</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono text-2xl font-black text-amber-400 tabular-nums">
            {overallPercentage}%
          </div>
          <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
            <span>Workload Invested:</span>
            <span className="font-mono text-stone-300 font-semibold">{(completedLecturesCount * 2.5).toFixed(1)}h</span>
          </div>
          <div className="text-[10px] text-stone-400 font-mono">
            {((totalLectures - completedLecturesCount) * 2.5).toFixed(1)}h remaining
          </div>
        </div>

        {/* Notes Completed */}
        <div className="spartan-card p-4 space-y-2 border-amber-900/40">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="uppercase text-[11px]">Notes Conquered</span>
            <FileText className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-mono text-2xl font-black text-stone-100 tabular-nums">
            {notesCompletedCount} <span className="text-xs text-stone-400 font-normal">/ {totalLectures}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
            <span>Notes Pending:</span>
            <span className="font-mono text-stone-300 font-semibold">{notesRemainingCount} left</span>
          </div>
          <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-600 rounded-full"
              style={{ width: `${Math.min(100, Math.max(3, notesPercentage))}%` }}
            />
          </div>
        </div>

        {/* Note-Making Percentage */}
        <div className="spartan-card p-4 space-y-2 border-amber-900/40">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="uppercase text-[11px]">Note-Making Rate</span>
            <Layers className="w-4 h-4 text-red-400" />
          </div>
          <div className="font-mono text-2xl font-black text-amber-300 tabular-nums">
            {notesPercentage}%
          </div>
          <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
            <span>Notes Lag:</span>
            <span className="font-mono text-amber-400/90 font-semibold">
              {Math.max(0, completedLecturesCount - notesCompletedCount)} pending
            </span>
          </div>
          <div className="text-[10px] text-stone-400">
            Independent notes tracking enforced
          </div>
        </div>
      </div>

      {/* Main Subject Lecture Management Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Subject Selector List (4 cols) */}
        <div className="lg:col-span-4 spartan-card p-4 border-amber-900/40 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <h3 className="font-cinzel text-xs font-bold text-amber-300 uppercase tracking-wider">
              SELECT CAMPAIGN SUBJECT
            </h3>
            <span className="text-[11px] text-stone-400 font-mono">{subjects.length} Subjects</span>
          </div>

          <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
            {subjects.map(s => {
              const list = lectures[s.id] || [];
              const completed = list.filter(l => l.status === 'completed').length;
              const pct = s.totalLectures > 0 ? Math.round((completed / s.totalLectures) * 100) : 0;
              const isSelected = s.id === activeSubjectId;

              return (
                <div
                  key={s.id}
                  onClick={() => {
                    setActiveSubjectId(s.id);
                    setCurrentPage(1);
                  }}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-amber-950/60 border-amber-600/60 shadow-md shadow-amber-950/30'
                      : 'bg-stone-900/60 border-stone-800/80 hover:bg-stone-900 hover:border-stone-700'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-stone-400 uppercase">
                        {s.category}
                      </span>
                      <span className="text-xs font-cinzel font-bold text-stone-200 truncate">
                        {s.name}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-400 font-mono">
                      {completed}/{s.totalLectures} Lectures · {pct}%
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-8 h-8 rounded-full border border-stone-700 flex items-center justify-center text-[10px] font-mono font-bold text-amber-400 bg-stone-950">
                      {pct}%
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-stone-600'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Lecture Tracking for Active Subject (8 cols) */}
        <div className="lg:col-span-8 spartan-card p-5 border-amber-900/40 space-y-5">
          {/* Active Subject Banner & Bulk Operations */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-400">
                  {activeSubject.category}
                </span>
                <span className="text-xs text-amber-500 font-cinzel font-semibold">
                  {activeSubject.territoryName}
                </span>
              </div>
              <h2 className="font-cinzel text-xl font-black text-amber-200 mt-1">
                {activeSubject.name}
              </h2>
              <div className="flex items-center gap-3 text-xs text-stone-400 mt-1">
                <span>Conquered: <strong className="text-stone-200 font-mono">{activeSubjectStats.completed}</strong> / {activeSubjectStats.total}</span>
                <span>·</span>
                <span>Notes: <strong className="text-amber-400 font-mono">{activeSubjectStats.notesCompleted}</strong> / {activeSubjectStats.total}</span>
              </div>
            </div>

            {/* Bulk Actions Button Group */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => bulkCompleteLectures(activeSubject.id, 5)}
                className="px-2.5 py-1.5 text-xs font-cinzel font-bold bg-amber-950/60 text-amber-300 border border-amber-700/50 rounded hover:bg-amber-900/60 transition-colors cursor-pointer"
                title="Mark next 5 incomplete lectures as completed (+500 XP)"
              >
                +5 Lectures
              </button>
              <button
                type="button"
                onClick={() => bulkCompleteNotes(activeSubject.id, 5)}
                className="px-2.5 py-1.5 text-xs font-cinzel font-bold bg-stone-900 text-stone-300 border border-stone-700 rounded hover:bg-stone-800 transition-colors cursor-pointer"
                title="Mark next 5 incomplete notes as completed (+250 XP)"
              >
                +5 Notes
              </button>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search lectures by topic or lecture #..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-stone-950/80 border border-stone-800 rounded-lg pl-9 pr-4 py-2 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-600/60"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto p-1 bg-stone-950/80 rounded-lg border border-stone-800 text-xs">
              {(['all', 'not_started', 'in_progress', 'completed', 'notes_pending'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => {
                    setStatusFilter(f);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded capitalize whitespace-nowrap transition-colors ${
                    statusFilter === f
                      ? 'bg-amber-900/60 text-amber-300 font-semibold'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {f === 'notes_pending' ? 'Notes Pending' : f.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Lectures List */}
          <div className="space-y-2">
            {paginatedLectures.length === 0 ? (
              <div className="p-8 text-center text-stone-400 text-xs space-y-2 border border-dashed border-stone-800 rounded-lg">
                <AlertCircle className="w-6 h-6 text-stone-600 mx-auto" />
                <p>No lectures match your search or filter criteria.</p>
              </div>
            ) : (
              paginatedLectures.map(lec => {
                const isLecCompleted = lec.status === 'completed';
                const isNotesCompleted = lec.notesStatus === 'completed';

                return (
                  <div
                    key={lec.id}
                    className={`p-3.5 rounded-lg border transition-all ${
                      isLecCompleted
                        ? 'bg-stone-950/70 border-amber-900/40'
                        : 'bg-stone-900/70 border-stone-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Left: Checkbox + Lecture Info */}
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Lecture completion checkbox */}
                        <button
                          type="button"
                          onClick={() => toggleLectureStatus(activeSubject.id, lec.id)}
                          className="mt-0.5 text-stone-400 hover:text-amber-400 transition-colors shrink-0"
                          title={isLecCompleted ? 'Mark as Not Completed' : 'Mark as Completed (+100 XP)'}
                        >
                          {isLecCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-stone-600 hover:text-amber-500" />
                          )}
                        </button>

                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-amber-400">
                              #{lec.lectureNumber}
                            </span>
                            <span className={`text-xs sm:text-sm font-semibold truncate ${
                              isLecCompleted ? 'text-stone-200' : 'text-stone-300'
                            }`}>
                              {lec.title}
                            </span>
                          </div>

                          {/* Remarks Preview */}
                          {lec.remarks && (
                            <div className="text-[11px] text-stone-400 italic">
                              "{lec.remarks}"
                            </div>
                          )}

                          {/* Metadata row */}
                          <div className="flex items-center gap-3 text-[11px] text-stone-500 flex-wrap">
                            <span className="font-mono">
                              Duration: {Math.floor(lec.durationMinutes / 60)}h {lec.durationMinutes % 60}m
                            </span>
                            {lec.completedDate && (
                              <>
                                <span>·</span>
                                <span className="font-mono text-emerald-500/80">
                                  Done: {lec.completedDate}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Notes Status & Edit Controls */}
                      <div className="flex items-center gap-2 sm:self-center shrink-0">
                        {/* Notes Making Status Button / Toggle */}
                        <button
                          type="button"
                          onClick={() => {
                            const nextStatus: NotesStatus =
                              lec.notesStatus === 'completed'
                                ? 'not_started'
                                : lec.notesStatus === 'in_progress'
                                ? 'completed'
                                : 'in_progress';
                            updateLecture(activeSubject.id, lec.id, { notesStatus: nextStatus });
                          }}
                          className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-colors flex items-center gap-1.5 ${
                            isNotesCompleted
                              ? 'bg-amber-950/80 border-amber-600/60 text-amber-300'
                              : lec.notesStatus === 'in_progress'
                              ? 'bg-blue-950/60 border-blue-700/60 text-blue-300'
                              : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                          }`}
                          title="Click to cycle: Not Started → In Progress → Completed"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Notes: {lec.notesStatus.replace('_', ' ')}</span>
                        </button>

                        {/* Edit remarks & title modal button */}
                        <button
                          type="button"
                          onClick={() => setEditingLecture({ subjectId: activeSubject.id, lecture: lec })}
                          className="p-1.5 rounded bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-amber-400 border border-stone-800"
                          title="Edit lecture title, duration, notes date, or remarks"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-stone-800 pt-4 text-xs">
              <span className="text-stone-400 font-mono">
                Page {currentPage} of {totalPages} ({filteredLectures.length} Total)
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded bg-stone-900 text-stone-300 disabled:opacity-30 border border-stone-800"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 rounded bg-stone-900 text-stone-300 disabled:opacity-30 border border-stone-800"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Lecture Modal */}
      {editingLecture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-sm">
          <div className="bg-stone-950 border border-amber-700/60 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-cinzel text-lg font-bold text-amber-200">
                Lecture #{editingLecture.lecture.lectureNumber} Intelligence Dossier
              </h3>
              <button
                onClick={() => setEditingLecture(null)}
                className="text-stone-400 hover:text-stone-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Lecture Title / Topic Name</label>
                <input
                  type="text"
                  value={editingLecture.lecture.title}
                  onChange={e => {
                    const nextVal = e.target.value;
                    setEditingLecture(prev => prev ? {
                      ...prev,
                      lecture: { ...prev.lecture, title: nextVal }
                    } : null);
                  }}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={editingLecture.lecture.durationMinutes}
                    onChange={e => {
                      const mins = parseInt(e.target.value) || 0;
                      setEditingLecture(prev => prev ? {
                        ...prev,
                        lecture: { ...prev.lecture, durationMinutes: mins }
                      } : null);
                    }}
                    className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Lecture Completion Status</label>
                  <select
                    value={editingLecture.lecture.status}
                    onChange={e => {
                      const st = e.target.value as LectureStatus;
                      setEditingLecture(prev => prev ? {
                        ...prev,
                        lecture: { ...prev.lecture, status: st }
                      } : null);
                    }}
                    className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Notes-Making Status</label>
                  <select
                    value={editingLecture.lecture.notesStatus}
                    onChange={e => {
                      const st = e.target.value as NotesStatus;
                      setEditingLecture(prev => prev ? {
                        ...prev,
                        lecture: { ...prev.lecture, notesStatus: st }
                      } : null);
                    }}
                    className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Completion Date</label>
                  <input
                    type="date"
                    value={editingLecture.lecture.completedDate || ''}
                    onChange={e => {
                      const val = e.target.value;
                      setEditingLecture(prev => prev ? {
                        ...prev,
                        lecture: { ...prev.lecture, completedDate: val }
                      } : null);
                    }}
                    className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Personal Tactical Remarks / Key Formulas</label>
                <textarea
                  rows={3}
                  value={editingLecture.lecture.remarks}
                  placeholder="E.g., Revise Article 21 exceptions; focus on Kesavananda Bharati case timeline..."
                  onChange={e => {
                    const val = e.target.value;
                    setEditingLecture(prev => prev ? {
                      ...prev,
                      lecture: { ...prev.lecture, remarks: val }
                    } : null);
                  }}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setEditingLecture(null)}
                className="px-4 py-2 rounded bg-stone-900 text-stone-300 text-xs hover:bg-stone-800 border border-stone-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (editingLecture) {
                    updateLecture(editingLecture.subjectId, editingLecture.lecture.id, editingLecture.lecture);
                    setEditingLecture(null);
                  }
                }}
                className="px-5 py-2 rounded bg-amber-700 hover:bg-amber-600 text-stone-950 font-cinzel font-bold text-xs uppercase"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
