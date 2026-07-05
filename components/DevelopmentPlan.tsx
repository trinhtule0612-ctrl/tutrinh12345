'use client';

import React, { useState, useEffect } from 'react';
import { Employee, IDPItem } from '@/lib/types';
import { getEmployees, getIDPByEmployee, addIDPItem, updateIDPItem, deleteIDPItem } from '@/lib/db';
import { Target, Plus, Edit3, Trash2, Clock, CheckCircle2, User, ChevronRight } from 'lucide-react';

export default function DevelopmentPlan() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmp, setSelectedEmp] = useState<string>('');
  const [idpItems, setIdpItems] = useState<IDPItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<IDPItem | null>(null);
  const [formData, setFormData] = useState<Partial<IDPItem>>({ status: 'not_started' });

  useEffect(() => {
    const loadInit = async () => {
      const emps = await getEmployees();
      setEmployees(emps);
      setLoading(false);
    };
    loadInit();
  }, []);

  useEffect(() => {
    if (selectedEmp) {
      loadIDP(selectedEmp);
    } else {
      setIdpItems([]);
    }
  }, [selectedEmp]);

  const loadIDP = async (empId: string) => {
    const items = await getIDPByEmployee(empId);
    setIdpItems(items);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp || !formData.competencyName) return;

    if (editingItem) {
      const updated = { ...editingItem, ...formData, updatedAt: new Date().toISOString() } as IDPItem;
      await updateIDPItem(updated);
    } else {
      const newItem: IDPItem = {
        id: `idp-${Date.now()}`,
        employeeId: selectedEmp,
        competencyId: formData.competencyId || 'custom',
        competencyName: formData.competencyName,
        developmentGoal: formData.developmentGoal || '',
        trainingActions: formData.trainingActions || '',
        responsiblePerson: formData.responsiblePerson || '',
        deadline: formData.deadline || '',
        status: formData.status || 'not_started',
        progressNotes: formData.progressNotes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await addIDPItem(newItem);
    }
    
    setShowForm(false);
    setEditingItem(null);
    setFormData({ status: 'not_started' });
    loadIDP(selectedEmp);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Xác nhận xóa mục IDP này?')) {
      await deleteIDPItem(id);
      loadIDP(selectedEmp);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'not_started': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'overdue': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'not_started': return 'Chưa bắt đầu';
      case 'in_progress': return 'Đang thực hiện';
      case 'completed': return 'Hoàn thành';
      case 'overdue': return 'Quá hạn';
      default: return status;
    }
  };

  if (loading) return <div className="animate-pulse h-64 bg-slate-800 rounded-2xl"></div>;

  const completedCount = idpItems.filter(i => i.status === 'completed').length;
  const progressPercent = idpItems.length > 0 ? Math.round((completedCount / idpItems.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Target className="w-7 h-7 text-indigo-400" />
            Kế hoạch phát triển cá nhân (IDP)
          </h1>
          <p className="text-slate-400 mt-1">Lên kế hoạch và theo dõi đào tạo, cải thiện năng lực</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex-1 max-w-md">
            <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" /> Chọn nhân viên
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
          
          {selectedEmp && (
            <div className="flex-1 max-w-xs text-right">
              <div className="text-sm text-slate-400 mb-2">Tiến độ hoàn thành</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <div className="text-lg font-bold text-white w-12">{progressPercent}%</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedEmp && !showForm && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Danh sách mục tiêu ({idpItems.length})</h2>
            <button
              onClick={() => { setEditingItem(null); setFormData({ status: 'not_started' }); setShowForm(true); }}
              className="bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" /> Thêm mục tiêu mới
            </button>
          </div>

          {idpItems.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Target className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300">Chưa có kế hoạch nào</h3>
              <p className="text-slate-500 mt-1">Nhân viên này chưa có kế hoạch phát triển nào. Hãy tạo mới.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {idpItems.map(item => (
                <div key={item.id} className="glass-card rounded-2xl p-5 hover:border-slate-600 transition-colors group relative">
                  <div className="absolute top-5 right-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingItem(item); setFormData(item); setShowForm(true); }} className="p-1.5 bg-slate-800 rounded-md text-slate-400 hover:text-indigo-400"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-slate-800 rounded-md text-slate-400 hover:text-rose-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  
                  <div className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold mb-3 border ${getStatusColor(item.status)}`}>
                    {getStatusLabel(item.status)}
                  </div>
                  
                  <h3 className="text-base font-bold text-white mb-2">{item.competencyName}</h3>
                  
                  <div className="space-y-2 mt-4 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-slate-500 shrink-0 w-24">Mục tiêu:</span>
                      <span className="text-slate-300 font-medium">{item.developmentGoal}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-slate-500 shrink-0 w-24">Hành động:</span>
                      <span className="text-slate-300">{item.trainingActions}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800/50">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-400">Hạn: <span className="text-slate-200">{item.deadline || 'Chưa có'}</span></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Form Modal / Section */}
      {showForm && (
        <div className="glass-card rounded-2xl p-6 border-indigo-500/30">
          <h2 className="text-lg font-bold text-white mb-6">
            {editingItem ? 'Cập nhật mục tiêu IDP' : 'Thêm mục tiêu IDP mới'}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-1">Năng lực cần phát triển *</label>
                <input required type="text" value={formData.competencyName || ''} onChange={e => setFormData({...formData, competencyName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="VD: Tiếng Anh giao tiếp, Kỹ năng lãnh đạo..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-1">Mục tiêu phát triển *</label>
                <input required type="text" value={formData.developmentGoal || ''} onChange={e => setFormData({...formData, developmentGoal: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-1">Hành động / Chương trình đào tạo *</label>
                <textarea required value={formData.trainingActions || ''} onChange={e => setFormData({...formData, trainingActions: e.target.value})} className="w-full h-20 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Người hỗ trợ/Đánh giá</label>
                <input type="text" value={formData.responsiblePerson || ''} onChange={e => setFormData({...formData, responsiblePerson: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Hạn chót</label>
                <input type="date" value={formData.deadline || ''} onChange={e => setFormData({...formData, deadline: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-1">Trạng thái</label>
                <select value={formData.status || 'not_started'} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="not_started">Chưa bắt đầu</option>
                  <option value="in_progress">Đang thực hiện</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="overdue">Quá hạn</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/50 mt-6">
              <button type="button" onClick={() => { setShowForm(false); setEditingItem(null); }} className="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors">Hủy</button>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">Lưu mục tiêu</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
