'use client';

import React, { useState, useEffect } from 'react';
import { DashboardStats, GAP_COLORS, GapClassification } from '@/lib/types';
import { getDashboardStats } from '@/lib/db';
import {
  Building2,
  Users,
  Briefcase,
  BookOpen,
  Target,
  ArrowUpRight,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await getDashboardStats();
      setStats(data);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Phòng ban / Nhóm', value: `${stats.totalDepartments} / ${stats.totalTeams}`, icon: <Building2 className="w-5 h-5" />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Vị trí công việc', value: stats.totalPositions, icon: <Briefcase className="w-5 h-5" />, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Tổng nhân viên', value: stats.totalEmployees, icon: <Users className="w-5 h-5" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Từ điển năng lực', value: stats.totalCompetencies, icon: <BookOpen className="w-5 h-5" />, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Nhân viên cần IDP', value: stats.employeesNeedingIDP, icon: <Target className="w-5 h-5" />, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  ];

  const pieData = [
    { name: 'Đã hoàn thành', value: stats.evaluationCompletionRate },
    { name: 'Chưa hoàn thành', value: 100 - stats.evaluationCompletionRate },
  ];
  const pieColors = ['#10b981', '#334155'];

  // Custom tooltips for recharts to fit dark theme
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-white font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Tổng quan</h1>
        <p className="text-slate-400 mt-1">Báo cáo tóm tắt hiện trạng năng lực tổ chức</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card, index) => (
          <div key={index} className="glass-card rounded-2xl p-5 hover:border-slate-600 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-2">{card.label}</p>
                <h3 className="text-2xl font-bold text-white">{card.value}</h3>
              </div>
              <div className={`p-2 rounded-xl ${card.bg} ${card.color}`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Khoảng cách năng lực theo phòng ban</h3>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-medium text-slate-300">
              Gap trung bình
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.departmentGaps} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="department" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avgGap" name="Gap" radius={[4, 4, 0, 0]}>
                  {stats.departmentGaps.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.avgGap < -1 ? GAP_COLORS.critical_gap : entry.avgGap < 0 ? GAP_COLORS.needs_improvement : GAP_COLORS.met} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Tỷ lệ hoàn thành đánh giá</h3>
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-medium flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              {stats.evaluationCompletionRate.toFixed(1)}%
            </span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute text-center pointer-events-none pb-8">
              <span className="block text-3xl font-bold text-white">{stats.evaluationCompletionRate.toFixed(0)}%</span>
              <span className="block text-xs text-slate-400 mt-1">Hoàn thành</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Panels Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Gap Competencies */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingDown className="w-5 h-5 text-rose-400" />
            <h3 className="text-lg font-bold text-white">Top năng lực thiếu hụt</h3>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-700/50">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Tên năng lực</th>
                  <th className="px-4 py-3 font-semibold text-right">Gap trung bình</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {stats.topGapCompetencies.map((comp, index) => (
                  <tr key={index} className="bg-slate-800/20 hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{comp.name}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="px-2 py-1 rounded bg-rose-500/20 text-rose-400 font-bold inline-block min-w-[3rem] text-center">
                        {comp.avgGap}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Employees Needing IDP */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Cần theo dõi / Lập IDP</h3>
          </div>
          <div className="space-y-3">
            {/* Mock list for dashboard preview */}
            {[1, 2, 3].map((_, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                    NV
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Nhân viên {idx + 1}</p>
                    <p className="text-xs text-slate-400">Thiếu hụt &gt; 2 năng lực cốt lõi</p>
                  </div>
                </div>
                <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-colors">
                  Lập IDP
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
