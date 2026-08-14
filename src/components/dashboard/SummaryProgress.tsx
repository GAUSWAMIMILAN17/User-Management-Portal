import { CheckCircle2, ListTodo, TrendingUp, Layers } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { MetricCard } from '../compound/MetricCard';
import { SummarySkeleton } from '../common/Skeleton';

export function SummaryProgress() {
  const { overallStats, projects, loading } = useProjects();

  if (loading) return <SummarySkeleton />;

  return (
    <div className="space-y-4">
      {/* Top Banner Row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Operations Overview
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time warehouse task completion and project metrics
          </p>
        </div>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <MetricCard>
          <MetricCard.Header
            title="Total Projects"
            icon={<Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          />
          <MetricCard.Value value={projects.length} />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Active warehouse initiatives
          </p>
        </MetricCard>

        {/* Total Tasks */}
        <MetricCard>
          <MetricCard.Header
            title="Total Tasks"
            icon={<ListTodo className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
          />
          <MetricCard.Value value={overallStats.totalTasks} />
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2">
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              {overallStats.inProgressTasks} In-Progress
            </span>
            <span>•</span>
            <span className="text-slate-400">{overallStats.pendingTasks} Pending</span>
          </div>
        </MetricCard>

        {/* Completed Tasks */}
        <MetricCard>
          <MetricCard.Header
            title="Completed Tasks"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          />
          <MetricCard.Value
            value={`${overallStats.completedTasks} / ${overallStats.totalTasks}`}
            badge={
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Done
              </span>
            }
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Verified completed work items
          </p>
        </MetricCard>

        {/* Overall Completion Rate (Calculated with useMemo) */}
        <MetricCard className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white border-indigo-800/50 shadow-indigo-950/50">
          <MetricCard.Header
            title="Overall Progress Rate"
            icon={<TrendingUp className="w-5 h-5 text-indigo-300" />}
            className="[&_p]:text-indigo-200"
          />
          <MetricCard.Value
            value={`${overallStats.progressPercent}%`}
            className="[&_span]:text-white"
          />
          <MetricCard.ProgressBar percent={overallStats.progressPercent} className="[&_span]:text-indigo-200" />
        </MetricCard>
      </div>
    </div>
  );
}
