'use client';

import React, { useState, useEffect } from 'react';
import { Department, Team, Position, Competency, PositionCompetency, ASK_GROUP_LABELS } from '@/lib/types';
import { getDepartments, getTeams, getPositions, getCompetencies, getPositionCompetencies, setPositionCompetencies } from '@/lib/db';
import { Grid3x3, Plus, Trash2, Save, AlertCircle } from 'lucide-react';

export default function CompetencyFramework() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  
  const [framework, setFramework] = useState<PositionCompetency[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadBaseData();
  }, []);

  useEffect(() => {
    if (selectedPosition) {
      loadFramework(selectedPosition);
    } else {
      setFramework([]);
    }
  }, [selectedPosition]);

  const loadBaseData = async () => {
    const [depts, tms, pos, comps] = await Promise.all([
      getDepartments(), getTeams(), getPositions(), getCompetencies()
    ]);
    setDepartments(depts);
    setTeams(tms);
    setPositions(pos);
    setCompetencies(comps);
    setLoading(false);
  };

  const loadFramework = async (posId: string) => {
    const data = await getPositionCompetencies(posId);
    setFramework(data);
  };

  const filteredTeams = teams.filter(t => t.departmentId === selectedDept);
  const filteredPositions = positions.filter(p => p.teamId === selectedTeam);
  const unassignedCompetencies = competencies.filter(c => !framework.find(f => f.competencyId === c.id));

  const handleAddCompetency = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const compId = e.target.value;
    if (!compId || !selectedPosition) return;
    
    const newPc: PositionCompetency = {
      id: `pc-${Date.now()}`,
      positionId: selectedPosition,
      competencyId: compId,
      requiredLevel: 3,
      weight: 1
    };
    setFramework([...framework, newPc]);
    e.target.value = ''; // Reset select
  };

  const handleRemoveCompetency = (id: string) => {
    setFramework(framework.filter(f => f.id !== id));
  };

  const handleUpdateLevel = (id: string, level: number) => {
    setFramework(framework.map(f => f.id === id ? { ...f, requiredLevel: level } : f));
  };

  const handleUpdateWeight = (id: string, weight: number) => {
    setFramework(framework.map(f => f.id === id ? { ...f, weight } : f));
  };

  const handleSave = async () => {
    if (!selectedPosition) return;
    setSaving(true);
    try {
      await setPositionCompetencies(selectedPosition, framework);
      setMessage({ type: 'success', text: 'Đã lưu khung năng lực thành công.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Lỗi khi lưu khung năng lực.' });
    }
    setSaving(false);
  };

  if (loading) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-slate-800 rounded w-3/4"></div></div></div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Grid3x3 className="w-7 h-7 text-indigo-400" />
          Quản lý Khung năng lực
        </h1>
        <p className="text-slate-400 mt-1">
          Định nghĩa yêu cầu năng lực cho từng vị trí công việc
        </p>
      </div>

      {/* Selectors */}
      <div className="glass-card rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Phòng ban</label>
            <select
              value={selectedDept}
              onChange={(e) => { setSelectedDept(e.target.value); setSelectedTeam(''); setSelectedPosition(''); }}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
            >
              <option value="">-- Chọn phòng ban --</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Nhóm / Team</label>
            <select
              value={selectedTeam}
              onChange={(e) => { setSelectedTeam(e.target.value); setSelectedPosition(''); }}
              disabled={!selectedDept}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none disabled:opacity-50"
            >
              <option value="">-- Chọn nhóm --</option>
              {filteredTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Vị trí</label>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              disabled={!selectedTeam}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none disabled:opacity-50"
            >
              <option value="">-- Chọn vị trí --</option>
              {filteredPositions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Framework Editor */}
      {selectedPosition && (
        <div className="glass-card rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Khung năng lực yêu cầu</h2>
              <p className="text-sm text-slate-400">
                {positions.find(p => p.id === selectedPosition)?.name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                onChange={handleAddCompetency}
                className="bg-slate-800/80 border border-slate-700/50 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none w-64"
                defaultValue=""
              >
                <option value="" disabled>+ Thêm năng lực...</option>
                {unassignedCompetencies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Đang lưu...' : 'Lưu khung'}
              </button>
            </div>
          </div>

          {message && (
            <div className={`mx-6 mt-4 p-3 rounded-lg flex items-center gap-2 text-sm ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              <AlertCircle className="w-4 h-4" />
              {message.text}
            </div>
          )}

          <div className="p-0 overflow-x-auto">
            {framework.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                Chưa có năng lực nào được gán cho vị trí này. Vui lòng thêm năng lực.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-800/30 text-slate-400 text-sm">
                  <tr>
                    <th className="px-6 py-4 font-semibold w-1/3">Năng lực</th>
                    <th className="px-6 py-4 font-semibold text-center w-32">Mức yêu cầu</th>
                    <th className="px-6 py-4 font-semibold text-center w-32">Trọng số</th>
                    <th className="px-6 py-4 font-semibold text-right w-24">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {framework.map(pc => {
                    const comp = competencies.find(c => c.id === pc.competencyId);
                    if (!comp) return null;
                    return (
                      <tr key={pc.id} className="hover:bg-slate-800/20 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="text-white font-medium">{comp.name}</div>
                          <div className="text-xs text-slate-500 mt-1">{ASK_GROUP_LABELS[comp.askGroup]}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <select
                            value={pc.requiredLevel}
                            onChange={(e) => handleUpdateLevel(pc.id, Number(e.target.value))}
                            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                          >
                            {[1, 2, 3, 4, 5].map(lvl => (
                              <option key={lvl} value={lvl}>Mức {lvl}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <select
                            value={pc.weight}
                            onChange={(e) => handleUpdateWeight(pc.id, Number(e.target.value))}
                            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                          >
                            {[1, 2, 3].map(w => (
                              <option key={w} value={w}>x{w}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleRemoveCompetency(pc.id)}
                            className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
