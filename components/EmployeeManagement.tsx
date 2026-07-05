'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Employee,
  EmployeeStatus,
  EMPLOYEE_STATUS_LABELS,
  Department,
  Team,
  Position,
} from '@/lib/types';
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getDepartments,
  getTeams,
  getPositions,
} from '@/lib/db';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Users,
  ChevronDown,
  Mail,
  Calendar,
  Building2,
  UserCircle,
} from 'lucide-react';

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterStatus, setFilterStatus] = useState<EmployeeStatus | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const emptyForm: Omit<Employee, 'id'> = {
    code: '',
    fullName: '',
    email: '',
    departmentId: '',
    teamId: '',
    positionId: '',
    level: '',
    managerId: null,
    startDate: '',
    status: 'active',
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [emps, depts, tms, poss] = await Promise.all([
      getEmployees(),
      getDepartments(),
      getTeams(),
      getPositions(),
    ]);
    setEmployees(emps);
    setDepartments(depts);
    setTeams(tms);
    setPositions(poss);
    setLoading(false);
  };

  const getDeptName = (id: string) => departments.find((d) => d.id === id)?.name || '';
  const getTeamName = (id: string) => teams.find((t) => t.id === id)?.name || '';
  const getPositionName = (id: string) => positions.find((p) => p.id === id)?.name || '';
  const getManagerName = (id: string | null) => {
    if (!id) return '—';
    return employees.find((e) => e.id === id)?.fullName || '—';
  };

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const matchSearch =
        e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDept = filterDept === 'all' || e.departmentId === filterDept;
      const matchStatus = filterStatus === 'all' || e.status === filterStatus;
      return matchSearch && matchDept && matchStatus;
    });
  }, [employees, searchTerm, filterDept, filterStatus]);

  const availableTeams = useMemo(() => {
    if (!form.departmentId) return teams;
    return teams.filter((t) => t.departmentId === form.departmentId);
  }, [form.departmentId, teams]);

  const availablePositions = useMemo(() => {
    if (!form.teamId) return positions;
    return positions.filter((p) => p.teamId === form.teamId);
  }, [form.teamId, positions]);

  const handleOpenAdd = () => {
    setEditingEmployee(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const handleOpenEdit = (e: Employee) => {
    setEditingEmployee(e);
    setForm({
      code: e.code,
      fullName: e.fullName,
      email: e.email,
      departmentId: e.departmentId,
      teamId: e.teamId,
      positionId: e.positionId,
      level: e.level,
      managerId: e.managerId,
      startDate: e.startDate,
      status: e.status,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.code || !form.fullName || !form.email) return;
    if (editingEmployee) {
      await updateEmployee({ ...editingEmployee, ...form });
    } else {
      await addEmployee({
        ...form,
        id: 'emp-' + Date.now(),
      });
    }
    await loadData();
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      await deleteEmployee(id);
      await loadData();
    }
  };

  const statusBadge = (s: EmployeeStatus) => {
    const colors: Record<EmployeeStatus, string> = {
      active: 'bg-emerald-500/20 text-emerald-400',
      probation: 'bg-yellow-500/20 text-yellow-400',
      inactive: 'bg-slate-500/20 text-slate-400',
      resigned: 'bg-red-500/20 text-red-400',
    };
    return colors[s];
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
            <Users className="w-7 h-7 text-indigo-400" />
            Quản lý Nhân viên
          </h1>
          <p className="text-slate-400 mt-1">
            Quản lý thông tin nhân sự theo phòng ban và vị trí
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02]"
        >
          <Plus className="w-5 h-5" />
          Thêm nhân viên
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo mã, tên, hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="pl-4 pr-8 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              >
                <option value="all">Tất cả phòng ban</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as EmployeeStatus | 'all')}
                className="pl-4 pr-8 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang làm việc</option>
                <option value="probation">Thử việc</option>
                <option value="inactive">Nghỉ phép dài hạn</option>
                <option value="resigned">Đã nghỉ việc</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((emp, idx) => (
          <div
            key={emp.id}
            className="glass-card rounded-2xl p-5 hover:border-indigo-500/30 transition-all duration-300 group"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
                  {emp.fullName.charAt(emp.fullName.lastIndexOf(' ') + 1)}
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {emp.fullName}
                  </h3>
                  <span className="text-xs text-indigo-400 font-mono">{emp.code}</span>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusBadge(emp.status)}`}>
                {EMPLOYEE_STATUS_LABELS[emp.status]}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{emp.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Building2 className="w-3.5 h-3.5" />
                <span className="truncate">{getDeptName(emp.departmentId)}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <UserCircle className="w-3.5 h-3.5" />
                <span className="truncate">
                  {getPositionName(emp.positionId)} • {getTeamName(emp.teamId)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(emp.startDate).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-700/30">
              <button
                onClick={() => handleOpenEdit(emp)}
                className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                title="Chỉnh sửa"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(emp.id)}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                title="Xóa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500 glass-card rounded-2xl">
          Không tìm thấy nhân viên nào phù hợp.
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-white">
                {editingEmployee ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Mã nhân viên *</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    placeholder="VD: NV001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Họ và tên *</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  placeholder="email@company.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Phòng ban</label>
                  <select
                    value={form.departmentId}
                    onChange={(e) =>
                      setForm({ ...form, departmentId: e.target.value, teamId: '', positionId: '' })
                    }
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  >
                    <option value="">Chọn phòng ban</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">
                    Nhóm chuyên môn
                  </label>
                  <select
                    value={form.teamId}
                    onChange={(e) => setForm({ ...form, teamId: e.target.value, positionId: '' })}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  >
                    <option value="">Chọn nhóm</option>
                    {availableTeams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Vị trí/Chức danh</label>
                  <select
                    value={form.positionId}
                    onChange={(e) => setForm({ ...form, positionId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  >
                    <option value="">Chọn vị trí</option>
                    {availablePositions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Cấp bậc</label>
                  <input
                    type="text"
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    placeholder="VD: Senior, Lead"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">
                    Quản lý trực tiếp
                  </label>
                  <select
                    value={form.managerId || ''}
                    onChange={(e) =>
                      setForm({ ...form, managerId: e.target.value || null })
                    }
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  >
                    <option value="">Không có</option>
                    {employees
                      .filter((e) => e.id !== editingEmployee?.id)
                      .map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.fullName} ({e.code})
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">
                    Ngày vào làm
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Trạng thái</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as EmployeeStatus })}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                >
                  <option value="active">Đang làm việc</option>
                  <option value="probation">Thử việc</option>
                  <option value="inactive">Nghỉ phép dài hạn</option>
                  <option value="resigned">Đã nghỉ việc</option>
                </select>
              </div>
            </div>
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
                {editingEmployee ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
