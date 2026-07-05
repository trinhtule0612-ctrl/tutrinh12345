'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Competency,
  ASKGroup,
  CompetencyType,
  CompetencyStatus,
  ASK_GROUP_LABELS,
  COMPETENCY_TYPE_LABELS,
  COMPETENCY_STATUS_LABELS,
  LevelDescription,
} from '@/lib/types';
import { getCompetencies, addCompetency, updateCompetency, deleteCompetency } from '@/lib/db';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  ChevronDown,
  Filter,
  BookOpen,
  Eye,
} from 'lucide-react';

export default function CompetencyDictionary() {
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterASK, setFilterASK] = useState<ASKGroup | 'all'>('all');
  const [filterType, setFilterType] = useState<CompetencyType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<CompetencyStatus | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingCompetency, setEditingCompetency] = useState<Competency | null>(null);
  const [detailCompetency, setDetailCompetency] = useState<Competency | null>(null);

  const defaultLevelDescriptions: LevelDescription[] = Array.from({ length: 5 }, (_, i) => ({
    level: i + 1,
    description: '',
    behaviors: [''],
  }));

  const emptyForm: Omit<Competency, 'id' | 'createdAt' | 'updatedAt'> = {
    code: '',
    name: '',
    askGroup: 'skill',
    type: 'core',
    definition: '',
    observableBehaviors: [''],
    levelDescriptions: defaultLevelDescriptions,
    weight: 2,
    status: 'draft',
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getCompetencies();
    setCompetencies(data);
    setLoading(false);
  };

  const filtered = useMemo(() => {
    return competencies.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchASK = filterASK === 'all' || c.askGroup === filterASK;
      const matchType = filterType === 'all' || c.type === filterType;
      const matchStatus = filterStatus === 'all' || c.status === filterStatus;
      return matchSearch && matchASK && matchType && matchStatus;
    });
  }, [competencies, searchTerm, filterASK, filterType, filterStatus]);

  const handleOpenAdd = () => {
    setEditingCompetency(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const handleOpenEdit = (c: Competency) => {
    setEditingCompetency(c);
    setForm({
      code: c.code,
      name: c.name,
      askGroup: c.askGroup,
      type: c.type,
      definition: c.definition,
      observableBehaviors: c.observableBehaviors.length > 0 ? c.observableBehaviors : [''],
      levelDescriptions:
        c.levelDescriptions.length === 5 ? c.levelDescriptions : defaultLevelDescriptions,
      weight: c.weight,
      status: c.status,
    });
    setShowModal(true);
  };

  const handleViewDetail = (c: Competency) => {
    setDetailCompetency(c);
    setShowDetailModal(true);
  };

  const handleSave = async () => {
    if (!form.code || !form.name) return;
    if (editingCompetency) {
      const updated: Competency = {
        ...editingCompetency,
        ...form,
        updatedAt: new Date().toISOString(),
      };
      await updateCompetency(updated);
    } else {
      const newComp: Competency = {
        ...form,
        id: 'comp-' + Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await addCompetency(newComp);
    }
    await loadData();
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa năng lực này?')) {
      await deleteCompetency(id);
      await loadData();
    }
  };

  const askBadgeColor = (g: ASKGroup) => {
    switch (g) {
      case 'knowledge':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'skill':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'attitude':
        return 'bg-violet-500/20 text-violet-400 border-violet-500/30';
    }
  };

  const statusBadgeColor = (s: CompetencyStatus) => {
    switch (s) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'inactive':
        return 'bg-red-500/20 text-red-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-indigo-400" />
            Từ điển Năng lực
          </h1>
          <p className="text-slate-400 mt-1">
            Quản lý danh mục năng lực theo mô hình ASK (Knowledge - Skill - Attitude)
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02]"
        >
          <Plus className="w-5 h-5" />
          Thêm năng lực
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã hoặc tên năng lực..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={filterASK}
                onChange={(e) => setFilterASK(e.target.value as ASKGroup | 'all')}
                className="pl-9 pr-8 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              >
                <option value="all">Tất cả nhóm ASK</option>
                <option value="knowledge">Knowledge</option>
                <option value="skill">Skill</option>
                <option value="attitude">Attitude</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as CompetencyType | 'all')}
                className="pl-4 pr-8 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              >
                <option value="all">Tất cả loại</option>
                <option value="core">Cốt lõi</option>
                <option value="functional">Chuyên môn</option>
                <option value="management">Quản lý</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as CompetencyStatus | 'all')}
                className="pl-4 pr-8 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang áp dụng</option>
                <option value="draft">Nháp</option>
                <option value="inactive">Ngưng áp dụng</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{competencies.length}</div>
          <div className="text-sm text-slate-400">Tổng năng lực</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {competencies.filter((c) => c.askGroup === 'knowledge').length}
          </div>
          <div className="text-sm text-slate-400">Knowledge</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">
            {competencies.filter((c) => c.askGroup === 'skill').length}
          </div>
          <div className="text-sm text-slate-400">Skill</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-violet-400">
            {competencies.filter((c) => c.askGroup === 'attitude').length}
          </div>
          <div className="text-sm text-slate-400">Attitude</div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Mã
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Tên năng lực
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Nhóm ASK
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Loại
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Trọng số
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, index) => (
                <tr
                  key={c.id}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors duration-150"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-indigo-400">{c.code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">{c.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {c.definition}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${askBadgeColor(c.askGroup)}`}
                    >
                      {ASK_GROUP_LABELS[c.askGroup]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-300">{COMPETENCY_TYPE_LABELS[c.type]}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map((w) => (
                        <div
                          key={w}
                          className={`w-2 h-5 rounded-sm ${w <= c.weight ? 'bg-indigo-500' : 'bg-slate-700'}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${statusBadgeColor(c.status)}`}
                    >
                      {COMPETENCY_STATUS_LABELS[c.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewDetail(c)}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                        title="Chỉnh sửa"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            Không tìm thấy năng lực nào phù hợp với bộ lọc.
          </div>
        )}
        <div className="px-6 py-3 border-t border-slate-700/50 text-sm text-slate-500">
          Hiển thị {filtered.length} / {competencies.length} năng lực
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && detailCompetency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{detailCompetency.name}</h2>
                <span className="text-sm text-indigo-400 font-mono">{detailCompetency.code}</span>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex gap-3 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-lg text-sm font-medium border ${askBadgeColor(detailCompetency.askGroup)}`}
                >
                  {ASK_GROUP_LABELS[detailCompetency.askGroup]}
                </span>
                <span className="px-3 py-1 rounded-lg text-sm font-medium bg-slate-700/50 text-slate-300">
                  {COMPETENCY_TYPE_LABELS[detailCompetency.type]}
                </span>
                <span
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${statusBadgeColor(detailCompetency.status)}`}
                >
                  {COMPETENCY_STATUS_LABELS[detailCompetency.status]}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase mb-2">Định nghĩa</h3>
                <p className="text-slate-300 leading-relaxed">{detailCompetency.definition}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase mb-2">
                  Hành vi quan sát được
                </h3>
                <ul className="space-y-1.5">
                  {detailCompetency.observableBehaviors.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300">
                      <span className="text-indigo-400 mt-1">•</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase mb-3">
                  Mô tả cấp độ (1-5)
                </h3>
                <div className="space-y-3">
                  {detailCompetency.levelDescriptions.map((ld) => (
                    <div
                      key={ld.level}
                      className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                          {ld.level}
                        </span>
                        <span className="text-white font-medium">{ld.description}</span>
                      </div>
                      <ul className="ml-11 space-y-1">
                        {ld.behaviors.map((b, j) => (
                          <li key={j} className="text-sm text-slate-400">
                            - {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-white">
                {editingCompetency ? 'Chỉnh sửa năng lực' : 'Thêm năng lực mới'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">
                    Mã năng lực *
                  </label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    placeholder="VD: S01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">
                    Tên năng lực *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    placeholder="VD: Kỹ năng giao tiếp"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">
                    Nhóm ASK
                  </label>
                  <select
                    value={form.askGroup}
                    onChange={(e) => setForm({ ...form, askGroup: e.target.value as ASKGroup })}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  >
                    <option value="knowledge">Knowledge</option>
                    <option value="skill">Skill</option>
                    <option value="attitude">Attitude</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">
                    Loại năng lực
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as CompetencyType })}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  >
                    <option value="core">Cốt lõi</option>
                    <option value="functional">Chuyên môn</option>
                    <option value="management">Quản lý</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">
                    Trọng số (1-3)
                  </label>
                  <select
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  >
                    <option value={1}>1 - Thấp</option>
                    <option value={2}>2 - Trung bình</option>
                    <option value={3}>3 - Cao</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Định nghĩa</label>
                <textarea
                  value={form.definition}
                  onChange={(e) => setForm({ ...form, definition: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                  placeholder="Mô tả chi tiết về năng lực..."
                />
              </div>

              {/* Observable Behaviors */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">
                  Hành vi quan sát được
                </label>
                {form.observableBehaviors.map((b, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={b}
                      onChange={(e) => {
                        const newBehaviors = [...form.observableBehaviors];
                        newBehaviors[i] = e.target.value;
                        setForm({ ...form, observableBehaviors: newBehaviors });
                      }}
                      className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
                      placeholder={`Hành vi ${i + 1}`}
                    />
                    {form.observableBehaviors.length > 1 && (
                      <button
                        onClick={() => {
                          const newBehaviors = form.observableBehaviors.filter((_, j) => j !== i);
                          setForm({ ...form, observableBehaviors: newBehaviors });
                        }}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() =>
                    setForm({
                      ...form,
                      observableBehaviors: [...form.observableBehaviors, ''],
                    })
                  }
                  className="text-sm text-indigo-400 hover:text-indigo-300 mt-1"
                >
                  + Thêm hành vi
                </button>
              </div>

              {/* Level Descriptions */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Mô tả cấp độ (1-5)
                </label>
                <div className="space-y-3">
                  {form.levelDescriptions.map((ld, i) => (
                    <div key={i} className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                          {ld.level}
                        </span>
                        <input
                          type="text"
                          value={ld.description}
                          onChange={(e) => {
                            const newLevels = [...form.levelDescriptions];
                            newLevels[i] = { ...newLevels[i], description: e.target.value };
                            setForm({ ...form, levelDescriptions: newLevels });
                          }}
                          className="flex-1 px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                          placeholder={`Mô tả cấp độ ${ld.level}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Trạng thái</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as CompetencyStatus })}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                >
                  <option value="draft">Nháp</option>
                  <option value="active">Đang áp dụng</option>
                  <option value="inactive">Ngưng áp dụng</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700/50 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/25"
              >
                {editingCompetency ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
