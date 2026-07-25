// ══════════════════════════════════════════════════════════════
// FILE: components/dashboard/TaskWidget.tsx
// PURPOSE: Reusable task list component for employee dashboard
//          Shows tasks assigned to the logged-in employee
//          Employee can update status: pending → in_progress → completed
// ══════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList, Clock, CheckCircle, Loader2,
  ChevronDown, ChevronUp, AlertTriangle, Circle,
  PlayCircle, CheckCircle2
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────
interface Task {
  _id         : string;
  title       : string;
  description : string;
  priority    : "low" | "medium" | "high" | "urgent";
  status      : "pending" | "in_progress" | "completed" | "overdue";
  category    : string;
  deadline    : string;
  completedAt : string | null;
  assignedBy  : { name: string; email: string } | null;
  linkedTripId: { tripName: string; tripId: string } | null;
}

// ── Helpers ───────────────────────────────────────────────────
const PRIORITY_CONFIG: Record<string, {
  dot: string; badge: string; label: string;
}> = {
  urgent : { dot:"bg-red-500",    badge:"bg-red-100 text-red-700 border-red-200",    label:"🔴 URGENT"  },
  high   : { dot:"bg-orange-500", badge:"bg-orange-100 text-orange-700 border-orange-200", label:"🟠 HIGH" },
  medium : { dot:"bg-amber-500",  badge:"bg-amber-100 text-amber-700 border-amber-200",  label:"🟡 MEDIUM" },
  low    : { dot:"bg-green-500",  badge:"bg-green-100 text-green-700 border-green-200",  label:"🟢 LOW"   },
};

const CATEGORY_ICON: Record<string, string> = {
  follow_up  : "📞",
  document   : "📄",
  client     : "👤",
  operations : "✈️",
  other      : "📋",
};

const daysUntil = (dateStr: string): number => {
  const d     = new Date(dateStr);
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.ceil((d.getTime() - today.getTime()) / 86400000);
};

// ── Main Component ────────────────────────────────────────────
export default function TaskWidget() {
  const [tasks,         setTasks]         = useState<Task[]>([]);
  const [isLoading,     setIsLoading]     = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const [updating,      setUpdating]      = useState<string | null>(null);

  // ── Fetch tasks on mount ────────────────────────────────────
  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    setIsLoading(true);
    try {
      const res  = await fetch("/api/tasks");
      const json = await res.json();
      if (json.success) setTasks(json.data);
    } catch (e) {
      console.error("Failed to load tasks:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Update task status ──────────────────────────────────────
  const updateStatus = async (taskId: string, newStatus: string) => {
    setUpdating(taskId);
    try {
      const res  = await fetch(`/api/tasks/${taskId}`, {
        method  : "PUT",
        headers : { "Content-Type": "application/json" },
        body    : JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setTasks(prev => prev.map(t => t._id === taskId ? json.data : t));
      }
    } catch (e) {
      console.error("Failed to update task:", e);
    } finally {
      setUpdating(null);
    }
  };

  // ── Derived lists ───────────────────────────────────────────
  const activeTasks    = tasks.filter(t => t.status !== "completed")
    .sort((a, b) => {
      // Sort: overdue → urgent → high → medium → low → deadline
      const order: Record<string,number> = {
        overdue:5, urgent:4, high:3, medium:2, low:1
      };
      const ap = a.status === "overdue" ? 5 : order[a.priority] ?? 0;
      const bp = b.status === "overdue" ? 5 : order[b.priority] ?? 0;
      if (bp !== ap) return bp - ap;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });

  const completedTasks = tasks.filter(t => t.status === "completed");
  const urgentCount    = activeTasks.filter(t =>
    t.priority === "urgent" || t.status === "overdue"
  ).length;

  // ─────────────────────────────────────────────────────────────
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl shadow-lg shadow-blue-900/5 overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/40">
        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <ClipboardList size={15} className="text-blue-600"/>
          My Tasks
        </h3>
        <div className="flex items-center gap-2">
          {urgentCount > 0 && (
            <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
              {urgentCount}
            </span>
          )}
          {activeTasks.length > 0 && (
            <span className="text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">
              {activeTasks.length} active
            </span>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-4">

        {/* Loading state */}
        {isLoading ? (
          <div className="flex items-center justify-center py-10 gap-2 text-slate-400">
            <Loader2 size={16} className="animate-spin text-blue-500"/>
            <span className="text-xs font-semibold">Loading tasks...</span>
          </div>
        ) : activeTasks.length === 0 && completedTasks.length === 0 ? (

          /* Empty state */
          <div className="flex flex-col items-center py-10 gap-2 text-slate-400">
            <CheckCircle2 size={32} className="opacity-30"/>
            <p className="text-xs font-semibold text-center">
              No tasks assigned yet
            </p>
            <p className="text-[11px] text-slate-400 text-center">
              Your admin will assign tasks here
            </p>
          </div>

        ) : (
          <div className="space-y-3">

            {/* ── Active Task Cards ── */}
            {activeTasks.length === 0 ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <CheckCircle size={15} className="text-emerald-500"/>
                <p className="text-xs font-bold text-emerald-700">
                  All caught up! No pending tasks.
                </p>
              </div>
            ) : (
              activeTasks.map((task, idx) => {
                const du        = daysUntil(task.deadline);
                const isOverdue = task.status === "overdue" || du < 0;
                const config    = PRIORITY_CONFIG[task.priority];
                const isUpdating= updating === task._id;

                return (
                  <motion.div key={task._id}
                    initial={{ opacity:0, y:8 }}
                    animate={{ opacity:1, y:0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`rounded-xl border p-3.5 space-y-3 ${
                      isOverdue
                        ? "bg-red-50/80 border-red-200"
                        : task.status === "in_progress"
                        ? "bg-blue-50/60 border-blue-100"
                        : "bg-white/80 border-slate-100"
                    }`}
                  >
                    {/* Task title row */}
                    <div className="flex items-start gap-2.5">
                      {/* Priority dot */}
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                        isOverdue ? "bg-red-500 animate-pulse" : config?.dot ?? "bg-slate-400"
                      }`}/>

                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-black leading-tight ${
                          isOverdue ? "text-red-800" : "text-slate-800"
                        }`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Priority */}
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full border ${
                        isOverdue
                          ? "bg-red-100 text-red-700 border-red-200"
                          : config?.badge
                      }`}>
                        {isOverdue ? "⚡ OVERDUE" : config?.label}
                      </span>

                      {/* Category */}
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {CATEGORY_ICON[task.category] ?? "📋"}
                        {" "}{task.category.replace("_"," ")}
                      </span>

                      {/* Assigned by */}
                      {task.assignedBy && (
                        <span className="text-[10px] text-slate-400 font-semibold ml-auto">
                          by {task.assignedBy.name}
                        </span>
                      )}
                    </div>

                    {/* Deadline */}
                    <div className={`flex items-center gap-1.5 text-[11px] font-bold ${
                      isOverdue ? "text-red-600"
                      : du === 0  ? "text-orange-600"
                      : du === 1  ? "text-amber-600"
                      : "text-slate-500"
                    }`}>
                      <Clock size={11} className="flex-shrink-0"/>
                      {isOverdue
                        ? `Overdue by ${Math.abs(du)} day${Math.abs(du) !== 1 ? "s":""}`
                        : du === 0 ? "Due TODAY"
                        : du === 1 ? "Due TOMORROW"
                        : `Due in ${du} days`
                      }
                      {" · "}
                      {new Date(task.deadline).toLocaleDateString("en-US",{
                        month:"short", day:"numeric"
                      })}
                    </div>

                    {/* Linked trip */}
                    {task.linkedTripId && (
                      <div className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                        ✈️ {task.linkedTripId.tripName?.slice(0,30) || "Linked Trip"}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-0.5">
                      {task.status === "pending" && (
                        <motion.button
                          whileHover={{ scale:1.03 }} whileTap={{ scale:0.96 }}
                          onClick={() => updateStatus(task._id, "in_progress")}
                          disabled={isUpdating}
                          className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-60 flex-1 justify-center"
                        >
                          {isUpdating
                            ? <Loader2 size={11} className="animate-spin"/>
                            : <PlayCircle size={11}/>
                          }
                          Start Task
                        </motion.button>
                      )}

                      {task.status === "in_progress" && (
                        <motion.button
                          whileHover={{ scale:1.03 }} whileTap={{ scale:0.96 }}
                          onClick={() => updateStatus(task._id, "completed")}
                          disabled={isUpdating}
                          className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-60 flex-1 justify-center"
                        >
                          {isUpdating
                            ? <Loader2 size={11} className="animate-spin"/>
                            : <CheckCircle2 size={11}/>
                          }
                          Mark Done
                        </motion.button>
                      )}

                      {task.status === "overdue" && (
                        <>
                          <motion.button
                            whileHover={{ scale:1.03 }} whileTap={{ scale:0.96 }}
                            onClick={() => updateStatus(task._id, "in_progress")}
                            disabled={isUpdating}
                            className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-60 flex-1 justify-center"
                          >
                            <PlayCircle size={11}/> Start
                          </motion.button>
                          <motion.button
                            whileHover={{ scale:1.03 }} whileTap={{ scale:0.96 }}
                            onClick={() => updateStatus(task._id, "completed")}
                            disabled={isUpdating}
                            className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-60 flex-1 justify-center"
                          >
                            <CheckCircle2 size={11}/> Done
                          </motion.button>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}

            {/* ── Completed Tasks (collapsible) ── */}
            {completedTasks.length > 0 && (
              <div className="pt-1">
                <button
                  onClick={() => setShowCompleted(p => !p)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-50/80 hover:bg-slate-100/80 rounded-xl border border-slate-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle size={13} className="text-emerald-500"/>
                    Completed ({completedTasks.length})
                  </span>
                  {showCompleted
                    ? <ChevronUp size={13}/>
                    : <ChevronDown size={13}/>
                  }
                </button>

                <AnimatePresence>
                  {showCompleted && (
                    <motion.div
                      initial={{ opacity:0, height:0 }}
                      animate={{ opacity:1, height:"auto" }}
                      exit={{ opacity:0, height:0 }}
                      transition={{ duration:0.2 }}
                      className="space-y-2 mt-2 overflow-hidden"
                    >
                      {completedTasks.map(task => (
                        <div key={task._id}
                          className="flex items-center justify-between p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <CheckCircle size={13} className="text-emerald-500 flex-shrink-0"/>
                            <p className="text-[11px] font-semibold text-slate-400 line-through truncate">
                              {task.title}
                            </p>
                          </div>
                          <span className="text-[10px] text-emerald-600 font-bold flex-shrink-0 ml-2">
                            {task.completedAt
                              ? new Date(task.completedAt).toLocaleDateString("en-US",{
                                  month:"short", day:"numeric"
                                })
                              : "Done"
                            }
                          </span>
                        </div>
                      ))}

                      {/* Undo last completed */}
                      <p className="text-[10px] text-center text-slate-400 font-semibold py-1">
                        Contact your admin to reopen completed tasks
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}