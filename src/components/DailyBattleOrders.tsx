import React, { useState, useMemo } from 'react';
import { useEmpire } from '../context/EmpireContext';
import { BattleOrder, BattleOrderType } from '../types';
import {
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Circle,
  Clock,
  RotateCcw,
  Flag,
  ArrowRight
} from 'lucide-react';

export const DailyBattleOrders: React.FC = () => {
  const {
    subjects,
    battleOrders,
    addBattleOrder,
    updateBattleOrder,
    toggleBattleOrder,
    deleteBattleOrder
  } = useEmpire();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // New order form
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<BattleOrderType>('lecture');
  const [newSubjectId, setNewSubjectId] = useState(subjects[0]?.id || 'polity');
  const [newCount, setNewCount] = useState<number>(1);
  const [newPriority, setNewPriority] = useState<'urgent' | 'high' | 'normal'>('high');
  const [newNotes, setNewNotes] = useState('');

  // Filter orders for selected date
  const dateOrders = useMemo(() => {
    return battleOrders.filter(o => o.date === selectedDate);
  }, [battleOrders, selectedDate]);

  // Incomplete missed orders from earlier dates
  const missedOrders = useMemo(() => {
    return battleOrders.filter(o => o.date < todayStr && !o.isCompleted);
  }, [battleOrders, todayStr]);

  const completedTodayCount = dateOrders.filter(o => o.isCompleted).length;

  const handleRescheduleAllMissed = () => {
    missedOrders.forEach(o => {
      updateBattleOrder(o.id, { date: todayStr });
    });
  };

  const quickPresets = [
    { title: 'Conquer 2 Polity Foundation Lectures', type: 'lecture' as const, count: 2, subject: 'polity' },
    { title: 'Draft Comprehensive Economy Notes', type: 'notes' as const, count: 1, subject: 'economy' },
    { title: '30 Prelims Modern History MCQs', type: 'mcq' as const, count: 30, subject: 'modern_history' },
    { title: 'Write 1 GS2 Governance Answer (15M)', type: 'answer' as const, count: 1, subject: 'governance' },
    { title: 'Active Recall on Ethics Thinkers', type: 'recall' as const, count: 1, subject: 'ethics' }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-900/40 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-red-950/70 border border-red-700/50 text-red-300 text-[11px] font-cinzel font-bold">
            <CheckSquare className="w-3.5 h-3.5 text-red-400" />
            <span>DAILY WAR DIRECTIVES</span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-amber-100">
            BATTLE ORDERS & CAMPAIGN SCHEDULE
          </h1>
          <p className="text-xs text-stone-400">
            Set deliberate tactical targets. Check off completed battles, recover missed orders, and maintain discipline.
          </p>
        </div>

        {/* Date Selector & Navigator */}
        <div className="flex items-center gap-2 bg-stone-900/90 p-1.5 rounded-lg border border-stone-800">
          <button
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() - 1);
              setSelectedDate(d.toISOString().split('T')[0]);
            }}
            className="px-2.5 py-1 text-xs text-stone-400 hover:text-stone-200"
          >
            ←
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="bg-stone-950 border border-stone-700 rounded px-2.5 py-1 text-xs text-amber-400 font-mono focus:outline-none"
          />

          <button
            onClick={() => setSelectedDate(todayStr)}
            className={`px-2.5 py-1 text-xs font-cinzel font-bold rounded ${
              selectedDate === todayStr ? 'bg-amber-900/60 text-amber-300' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Today
          </button>

          <button
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() + 1);
              setSelectedDate(d.toISOString().split('T')[0]);
            }}
            className="px-2.5 py-1 text-xs text-stone-400 hover:text-stone-200"
          >
            →
          </button>
        </div>
      </div>

      {/* Missed Tasks Warning Banner (if any) */}
      {missedOrders.length > 0 && selectedDate === todayStr && (
        <div className="p-4 rounded-lg bg-red-950/40 border border-red-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <span className="font-cinzel font-bold text-red-300 block">
                {missedOrders.length} Unfinished Battle Order{missedOrders.length > 1 ? 's' : ''} from Past Campaigns
              </span>
              <span className="text-stone-400">
                Spartans leave no battlefield task abandoned. Reschedule them into today's battle plan.
              </span>
            </div>
          </div>

          <button
            onClick={handleRescheduleAllMissed}
            className="px-3.5 py-2 rounded bg-red-900 hover:bg-red-800 text-stone-100 font-cinzel font-bold whitespace-nowrap border border-red-700 transition-colors"
          >
            Reschedule All to Today
          </button>
        </div>
      )}

      {/* Main Grid: Form + Orders Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Dispatch New Order Form (5 cols) */}
        <div className="lg:col-span-5 spartan-card p-5 border-amber-900/40 space-y-4">
          <h3 className="font-cinzel text-sm font-bold text-amber-200 flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Dispatch New Battle Order</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-stone-400 mb-1">Mission Description</label>
              <input
                type="text"
                placeholder="E.g., Complete 2 lectures on Fiscal Policy..."
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-400 mb-1">Battle Type</label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value as BattleOrderType)}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 capitalize"
                >
                  <option value="lecture">Lecture Study</option>
                  <option value="notes">Note-Making</option>
                  <option value="recall">Active Recall</option>
                  <option value="answer">Answer Writing</option>
                  <option value="mcq">MCQ Practice</option>
                  <option value="custom">General Duty</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Target Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={newCount}
                  onChange={e => setNewCount(parseInt(e.target.value) || 1)}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-400 mb-1">Related Subject</label>
                <select
                  value={newSubjectId}
                  onChange={e => setNewSubjectId(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 truncate"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Priority Level</label>
                <select
                  value={newPriority}
                  onChange={e => setNewPriority(e.target.value as any)}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 capitalize"
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="normal">Normal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-stone-400 mb-1">Mission Tactical Remarks</label>
              <textarea
                rows={2}
                placeholder="Optional notes or references..."
                value={newNotes}
                onChange={e => setNewNotes(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 placeholder:text-stone-600 focus:outline-none"
              />
            </div>

            <button
              type="button"
              disabled={!newTitle.trim()}
              onClick={() => {
                addBattleOrder({
                  date: selectedDate,
                  title: newTitle.trim(),
                  type: newType,
                  subjectId: newSubjectId,
                  targetCount: newCount,
                  completedCount: 0,
                  isCompleted: false,
                  priority: newPriority,
                  notes: newNotes.trim() || undefined
                });
                setNewTitle('');
                setNewNotes('');
              }}
              className="w-full py-2.5 px-4 rounded bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-700 hover:to-amber-600 text-amber-100 font-cinzel font-bold text-xs uppercase tracking-wider transition-all border border-amber-600/40 disabled:opacity-40"
            >
              Issue Order (+30 XP Upon Completion)
            </button>
          </div>

          {/* Quick Presets */}
          <div className="pt-3 border-t border-stone-800 space-y-2">
            <span className="text-[11px] font-cinzel text-amber-400 font-bold block uppercase tracking-wider">
              Quick Mission Presets
            </span>
            <div className="space-y-1.5">
              {quickPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    addBattleOrder({
                      date: selectedDate,
                      title: preset.title,
                      type: preset.type,
                      subjectId: preset.subject,
                      targetCount: preset.count,
                      completedCount: 0,
                      isCompleted: false,
                      priority: 'high'
                    });
                  }}
                  className="w-full text-left p-2 rounded bg-stone-900/60 hover:bg-stone-900 text-[11px] text-stone-300 border border-stone-800 hover:border-amber-700/50 flex items-center justify-between transition-colors"
                >
                  <span className="truncate">{preset.title}</span>
                  <span className="text-amber-500 font-mono shrink-0">+Add</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Orders List for Selected Date (7 cols) */}
        <div className="lg:col-span-7 spartan-card p-5 border-amber-900/40 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div>
              <h3 className="font-cinzel text-base font-bold text-amber-200">
                Battle Plan for {selectedDate}
              </h3>
              <p className="text-xs text-stone-400">
                {completedTodayCount} of {dateOrders.length} mandates accomplished.
              </p>
            </div>
          </div>

          {dateOrders.length === 0 ? (
            <div className="py-14 text-center text-stone-500 text-xs border border-dashed border-stone-800 rounded-lg space-y-2">
              <Calendar className="w-8 h-8 mx-auto text-stone-700" />
              <p>No battle orders posted for this date.</p>
              <p className="text-stone-400">Select a preset on the left to deploy today's mission.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {dateOrders.map(order => {
                return (
                  <div
                    key={order.id}
                    className={`p-3.5 rounded-lg border transition-all flex items-start justify-between gap-3 text-xs ${
                      order.isCompleted
                        ? 'bg-stone-950/60 border-stone-800/80 text-stone-500'
                        : 'bg-stone-900/80 border-stone-800 hover:border-amber-700/50 text-stone-200'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleBattleOrder(order.id)}
                        className="mt-0.5 text-stone-400 hover:text-amber-400 transition-colors shrink-0"
                      >
                        {order.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-stone-600 hover:text-amber-500" />
                        )}
                      </button>

                      <div className="space-y-1 min-w-0">
                        <div className={`font-semibold ${order.isCompleted ? 'line-through text-stone-500' : 'text-stone-100'}`}>
                          {order.title}
                        </div>
                        {order.notes && (
                          <div className="text-[11px] text-stone-400">
                            {order.notes}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-[10px] text-stone-400 flex-wrap">
                          <span className="uppercase text-amber-500 font-bold">{order.type}</span>
                          <span>·</span>
                          <span className="font-mono">Target: {order.targetCount}</span>
                          {order.priority === 'urgent' && (
                            <>
                              <span>·</span>
                              <span className="text-red-400 font-bold uppercase">Urgent</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {order.date !== todayStr && !order.isCompleted && (
                        <button
                          type="button"
                          onClick={() => updateBattleOrder(order.id, { date: todayStr })}
                          className="px-2 py-1 rounded bg-stone-800 text-[10px] text-amber-400 hover:bg-stone-700"
                          title="Move to today"
                        >
                          Reschedule
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteBattleOrder(order.id)}
                        className="p-1 rounded text-stone-500 hover:text-red-400"
                        title="Delete order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
