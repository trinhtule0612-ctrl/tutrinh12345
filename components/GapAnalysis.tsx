'use client';

import React, { useState, useEffect } from 'react';
import { Department, Employee, Evaluation, Competency, ASKGroup, ASK_GROUP_LABELS } from '@/lib/types';
import { getDepartments, getEmployees, getEvaluations, getCompetencies } from '@/lib/db';
import { BarChart3, User, Layers, Info } from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell
} from 'recharts';

export default function GapAnalysis() {
  const [activeTab, setActiveTab] = useState<'heatmap' | 'radar' | 'ask'>('radar');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [selectedEmp, setSelectedEmp] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [depts, emps, evals, comps] = await Promise.all([
        getDepartments(), getEmployees(), getEvaluations(), getCompetencies()
      ]);
      setDepartments(depts);
      setEmployees(emps);
      setEvaluations(evals);
      setCompetencies(comps);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <div className="animate-pulse h-64 bg-slate-800 rounded-2xl"></div>;

  // Radar Data Prep
  const renderRadarChart = () => {
    if (!selectedEmp) return <div className="text-center p-12 text-slate-500">Vui lòng chọn nhân viên</div>;
    const empEval = evaluations.find(e => e.employeeId === selectedEmp && (e.status === 'completed' || e.status === 'approved'));
    if (!empEval) return <div className="text-center p-12 text-slate-500">Nhân viên này chưa có dữ liệu đánh giá hoàn chỉnh</div>;

    const radarData = empEval.competencyScores.map(cs => ({
      subject: cs.competencyName.length > 20 ? cs.competencyName.substring(0, 20) + '...' : cs.competencyName,
      required: cs.requiredLevel,
      actual: cs.finalScore,
      fullMark: 5,
    }));

    const met = empEval.competencyScores.filter(c => c.gap >= 0).length;
    const warn = empEval.competencyScores.filter(c => c.gap === -1).length;
    const critical = empEval.competencyScores.filter(c => c.gap < -1).length;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[500px] glass-card rounded-2xl p-6">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#64748b' }} axisLine={false} />
              <Radar name="Mức yêu cầu" dataKey="required" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
              <Radar name="Thực tế" dataKey="actual" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
              <Legend wrapperStyle={{ color: '#cbd5e1' }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-4">
          <div className="glass-card p-5 rounded-2xl">
            <h3 className="text-slate-400 text-sm mb-1">Tổng quan</h3>
            <div className="text-3xl font-bold text-white mb-4">{empEval.weightedTotalScore} <span className="text-lg text-slate-500">/ 5.0</span></div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-emerald-400">Đạt yêu cầu</span>
                <span className="text-white font-bold">{met}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${(met/radarData.length)*100}%` }}></div>
              </div>
              
              <div className="flex justify-between text-sm mt-4">
                <span className="text-amber-400">Cần cải thiện (Gap -1)</span>
                <span className="text-white font-bold">{warn}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${(warn/radarData.length)*100}%` }}></div>
              </div>

              <div className="flex justify-between text-sm mt-4">
                <span className="text-rose-400">Thiếu hụt (Gap &lt; -1)</span>
                <span className="text-white font-bold">{critical}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500" style={{ width: `${(critical/radarData.length)*100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderASKReport = () => {
    const askData = ['knowledge', 'skill', 'attitude'].map((group) => {
      let totalReq = 0, totalAct = 0, count = 0;
      evaluations.forEach(ev => {
        ev.competencyScores.filter(cs => cs.askGroup === group).forEach(cs => {
          totalReq += cs.requiredLevel;
          totalAct += cs.finalScore;
          count++;
        });
      });
      return {
        name: ASK_GROUP_LABELS[group as ASKGroup],
        required: count ? (totalReq / count).toFixed(2) : 0,
        actual: count ? (totalAct / count).toFixed(2) : 0,
      };
    });

    return (
      <div className="glass-card rounded-2xl p-6 h-[500px]">
        <h3 className="text-lg font-bold text-white mb-6">Mức độ đáp ứng theo nhóm ASK (Toàn công ty)</h3>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={askData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} />
            <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
            <Legend />
            <Bar dataKey="required" name="TB Yêu cầu" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" name="TB Thực tế" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-indigo-400" />
          Phân tích Gap (Gap Analysis)
        </h1>
        <p className="text-slate-400 mt-1">Phân tích khoảng cách năng lực qua biểu đồ trực quan</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900/50 p-1 rounded-xl w-fit border border-slate-800/50">
        <button
          onClick={() => setActiveTab('radar')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'radar' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <User className="w-4 h-4" /> Cá nhân (Radar)
        </button>
        <button
          onClick={() => setActiveTab('ask')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'ask' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4" /> Báo cáo ASK
        </button>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'radar' && (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-4 flex gap-4 items-center">
              <label className="text-sm font-medium text-slate-300">Chọn nhân viên:</label>
              <select
                value={selectedEmp}
                onChange={e => setSelectedEmp(e.target.value)}
                className="w-64 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">-- Chọn nhân viên --</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.fullName}</option>)}
              </select>
            </div>
            {renderRadarChart()}
          </div>
        )}

        {activeTab === 'ask' && renderASKReport()}
      </div>
    </div>
  );
}
