'use client';

import React, { useState, useEffect } from 'react';
import { Employee, EvaluationPeriod, Evaluation, CompetencyEvaluation, ASK_GROUP_LABELS } from '@/lib/types';
import { getEmployees, getEvaluationPeriods, getEvaluationsByEmployee, getPositionCompetencies, getCompetencies, addEvaluation } from '@/lib/db';
import { ClipboardCheck, Save, History, Star, User, Calendar, CheckCircle2 } from 'lucide-react';

export default function EvaluationModule() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [periods, setPeriods] = useState<EvaluationPeriod[]>([]);
  
  const [selectedEmp, setSelectedEmp] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [evalType, setEvalType] = useState<'self' | 'manager' | 'peer' | '360'>('manager');
  
  const [scores, setScores] = useState<CompetencyEvaluation[]>([]);
  const [overallComment, setOverallComment] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadInit = async () => {
      const [emps, per] = await Promise.all([getEmployees(), getEvaluationPeriods()]);
      setEmployees(emps);
      setPeriods(per);
      setLoading(false);
    };
    loadInit();
  }, []);

  useEffect(() => {
    if (selectedEmp) {
      loadEmployeeFramework(selectedEmp);
    } else {
      setScores([]);
    }
  }, [selectedEmp]);

  const loadEmployeeFramework = async (empId: string) => {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    
    const [framework, comps] = await Promise.all([
      getPositionCompetencies(emp.positionId),
      getCompetencies()
    ]);
    
    const initialScores: CompetencyEvaluation[] = framework.map(fw => {
      const comp = comps.find(c => c.id === fw.competencyId)!;
      return {
        competencyId: fw.competencyId,
        competencyName: comp.name,
        askGroup: comp.askGroup,
        requiredLevel: fw.requiredLevel,
        weight: fw.weight,
        selfScore: 0,
        managerScore: 0,
        peerScore: null,
        finalScore: 0,
        gap: -fw.requiredLevel,
        gapClassification: 'critical_gap',
        evidence: '',
        evaluatorComment: ''
      };
    });
    setScores(initialScores);
  };

  const handleScoreChange = (compId: string, score: number) => {
    setScores(scores.map(s => {
      if (s.competencyId !== compId) return s;
      
      const newS = { ...s };
      if (evalType === 'self') newS.selfScore = score;
      if (evalType === 'manager') newS.managerScore = score;
      if (evalType === 'peer') newS.peerScore = score;
      
      // Calculate final score (simplified for demo: just use the current evaluator's score as final)
      newS.finalScore = score;
      newS.gap = newS.finalScore - newS.requiredLevel;
      
      if (newS.gap >= 0) newS.gapClassification = 'met';
      else if (newS.gap === -1) newS.gapClassification = 'needs_improvement';
      else newS.gapClassification = 'critical_gap';
      
      return newS;
    }));
  };

  const calculateWeightedTotal = () => {
    if (scores.length === 0) return '0';
    const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0);
    const weightedSum = scores.reduce((sum, s) => sum + (s.finalScore * s.weight), 0);
    return (weightedSum / totalWeight).toFixed(2);
  };

  const handleSave = async () => {
    if (!selectedEmp || !selectedPeriod) return;
    setSaving(true);
    
    const newEval: Evaluation = {
      id: `eval-${Date.now()}`,
      employeeId: selectedEmp,
      periodId: selectedPeriod,
      type: evalType,
      evaluatorId: 'current-user', // Mock
      competencyScores: scores,
      weightedTotalScore: parseFloat(calculateWeightedTotal()),
      overallComment,
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await addEvaluation(newEval);
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (loading) return <div className="animate-pulse h-32 bg-slate-800 rounded-xl"></div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <ClipboardCheck className="w-7 h-7 text-indigo-400" />
          Đánh giá Năng lực
        </h1>
        <p className="text-slate-400 mt-1">Thực hiện đánh giá định kỳ theo khung năng lực</p>
      </div>

      {/* Header Form */}
      <div className="glass-card rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" /> Nhân viên
            </label>
            <select
              value={selectedEmp}
              onChange={e => setSelectedEmp(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
            >
              <option value="">-- Chọn nhân viên --</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.fullName} ({e.code})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Kỳ đánh giá
            </label>
            <select
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
            >
              <option value="">-- Chọn kỳ đánh giá --</option>
              {periods.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
              <Star className="w-4 h-4" /> Loại đánh giá
            </label>
            <select
              value={evalType}
              onChange={e => setEvalType(e.target.value as any)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
            >
              <option value="self">Tự đánh giá</option>
              <option value="manager">Quản lý đánh giá</option>
              <option value="peer">Đồng nghiệp đánh giá</option>
            </select>
          </div>
        </div>
      </div>

      {/* Evaluation Form */}
      {selectedEmp && selectedPeriod && (
        <div className="glass-card rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-800/50">
            <h2 className="text-lg font-bold text-white">Bảng đánh giá năng lực</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/30 text-slate-400 text-sm">
                <tr>
                  <th className="px-6 py-4 font-semibold w-1/4">Năng lực</th>
                  <th className="px-6 py-4 font-semibold text-center w-24">Yêu cầu</th>
                  <th className="px-6 py-4 font-semibold text-center">Đánh giá (1-5)</th>
                  <th className="px-6 py-4 font-semibold text-center w-24">Gap</th>
                  <th className="px-6 py-4 font-semibold w-1/3">Minh chứng / Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm">
                {scores.map((s) => (
                  <tr key={s.competencyId} className="hover:bg-slate-800/20">
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{s.competencyName}</div>
                      <div className="text-xs text-slate-500 mt-1">{ASK_GROUP_LABELS[s.askGroup]}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">
                        {s.requiredLevel}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {[1, 2, 3, 4, 5].map(lvl => {
                          const currentScore = evalType === 'self' ? s.selfScore : evalType === 'manager' ? s.managerScore : s.peerScore;
                          const isSelected = currentScore === lvl;
                          return (
                            <button
                              key={lvl}
                              onClick={() => handleScoreChange(s.competencyId, lvl)}
                              className={`w-10 h-10 rounded-xl font-bold transition-all ${
                                isSelected
                                  ? 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/20 scale-110'
                                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                              }`}
                            >
                              {lvl}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                        s.finalScore === 0 ? 'bg-slate-800 text-slate-500' :
                        s.gap >= 0 ? 'bg-emerald-500/20 text-emerald-400' :
                        s.gap === -1 ? 'bg-amber-500/20 text-amber-400' :
                        'bg-rose-500/20 text-rose-400'
                      }`}>
                        {s.finalScore === 0 ? '-' : s.gap > 0 ? `+${s.gap}` : s.gap}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <textarea
                        value={s.evidence}
                        onChange={(e) => setScores(scores.map(sc => sc.competencyId === s.competencyId ? {...sc, evidence: e.target.value} : sc))}
                        placeholder="Nhập minh chứng..."
                        className="w-full h-12 bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white text-xs resize-none focus:outline-none focus:border-indigo-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-slate-900/50 border-t border-slate-800/50">
            <div className="mb-4 flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-400">Nhận xét chung</label>
              <div className="text-right">
                <div className="text-xs text-slate-500">Điểm trung bình (có trọng số)</div>
                <div className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
                  {calculateWeightedTotal()}
                </div>
              </div>
            </div>
            <textarea
              value={overallComment}
              onChange={(e) => setOverallComment(e.target.value)}
              placeholder="Nhận xét tổng quan về hiệu suất và năng lực..."
              className="w-full h-24 bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none mb-6"
            />
            <div className="flex justify-end items-center gap-4">
              {success && (
                <div className="text-emerald-400 flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5" /> Đã lưu thành công
                </div>
              )}
              <button
                onClick={handleSave}
                disabled={saving || scores.some(s => s.finalScore === 0)}
                className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white px-8 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Đang lưu...' : 'Lưu Đánh Giá'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
