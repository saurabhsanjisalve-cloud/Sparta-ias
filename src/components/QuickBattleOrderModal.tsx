import React, { useState } from 'react';
import { useEmpire } from '../context/EmpireContext';
import { BattleOrderType } from '../types';
import { Plus, X, Shield, Sword, Target, BookOpen, FileText, Brain } from 'lucide-react';

interface QuickBattleOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickBattleOrderModal: React.FC<QuickBattleOrderModalProps> = ({
  isOpen,
  onClose
}) => {
  const { subjects, addBattleOrder } = useEmpire();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<BattleOrderType>('lecture');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || 'polity');
  const [targetCount, setTargetCount] = useState<number>(1);
  const [priority, setPriority] = useState<'urgent' | 'high' | 'normal'>('high');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addBattleOrder({
      date: new Date().toISOString().split('T')[0],
      title: title.trim(),
      type,
      subjectId,
      targetCount,
      completedCount: 0,
      isCompleted: false,
      priority,
      notes: notes.trim() || undefined
    });

    setTitle('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-sm">
      <div className="bg-stone-950 border border-amber-700/60 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl relative animate-in fade-in duration-150">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" />
            <h3 className="font-cinzel text-lg font-bold text-amber-200">
              DISPATCH BATTLE ORDER
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-stone-400 hover:text-stone-200 hover:bg-stone-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-stone-400 mb-1">Mission Mandate</label>
            <input
              type="text"
              required
              placeholder="E.g., Complete 2 Lectures on Modern History..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-stone-900 border border-stone-700 rounded p-2.5 text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-400 mb-1">Mission Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as BattleOrderType)}
                className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200"
              >
                <option value="lecture">Lecture Study</option>
                <option value="notes">Note-Making</option>
                <option value="recall">Active Recall</option>
                <option value="answer">Mains Answer</option>
                <option value="mcq">MCQ Practice</option>
                <option value="custom">General Duty</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-400 mb-1">Target Units</label>
              <input
                type="number"
                min="1"
                value={targetCount}
                onChange={e => setTargetCount(parseInt(e.target.value) || 1)}
                className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-400 mb-1">Subject Front</label>
              <select
                value={subjectId}
                onChange={e => setSubjectId(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 truncate"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-stone-400 mb-1">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-stone-400 mb-1">Tactical Notes (Optional)</label>
            <textarea
              rows={2}
              placeholder="Reference books, questions, or specific chapters..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 placeholder:text-stone-600 focus:outline-none"
            />
          </div>

          <div className="flex gap-2 pt-2 border-t border-stone-800">
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 py-2.5 px-4 rounded bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-700 hover:to-amber-600 text-amber-100 font-cinzel font-bold text-xs uppercase tracking-wider transition-all border border-amber-600/40 disabled:opacity-40"
            >
              Issue Order (+30 XP)
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs border border-stone-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
