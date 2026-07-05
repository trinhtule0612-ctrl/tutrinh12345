'use client';

import React, { useState, useEffect } from 'react';
import {
  Employee,
  Competency,
  Department,
  Evaluation,
  ASK_GROUP_LABELS,
  ASKGroup,
} from '@/lib/types';
import {
  getEmployees,
  getCompetencies,
  getDepartments,
  getTeams,
  getPositions,
  getEvaluations,
  getPositionCompetencies,
} from '@/lib/db';
import {
  FileText,
  Download,
  User,
  Building2,
  Briefcase,
  Layers,
  UserPlus,
  GraduationCap,
  ChevronDown,
  FileSpreadsheet,
} from 'lucide-react';

type ReportType =
  | 'individual'
  | 'department-gap'
  | 'position'
  | 'ask-group'
  | 'recruitment'
  | 'training';

const REPORT_TYPES: { key: ReportType; label: string; icon: React.ReactNode; description: string }[] = [
  {
    key: 'individual',
    label: 'Hồ sơ năng lực cá nhân',
    icon: <User className="w-5 h-5" />,
    description: 'Báo cáo chi tiết năng lực của từng nhân viên',
  },
  {
    key: 'department-gap',
    label: 'Khoảng cách năng lực theo phòng ban',
    icon: <Building2 className="w-5 h-5" />,
    description: 'So sánh năng lực thực tế với yêu cầu theo phòng ban',
  },
  {
    key: 'position',
    label: 'Năng lực theo vị trí',
    icon: <Briefcase className="w-5 h-5" />,
    description: 'Phân tích năng lực trung bình theo từng vị trí',
  },
  {
    key: 'ask-group',
    label: 'Năng lực theo nhóm ASK',
    icon: <Layers className="w-5 h-5" />,
    description: 'Phân tích theo Knowledge, Skill, Attitude',
  },
  {
    key: 'recruitment',
    label: 'Phục vụ tuyển dụng',
    icon: <UserPlus className="w-5 h-5" />,
    description: 'Vị trí cần tuyển dựa trên gap năng lực',
  },
  {
    key: 'training',
    label: 'Phục vụ đào tạo',
    icon: <GraduationCap className="w-5 h-5" />,
    description: 'Đề xuất chương trình đào tạo dựa trên nhu cầu',
  },
];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [emps, comps, depts, evals] = await Promise.all([
      getEmployees(),
      getCompetencies(),
      getDepartments(),
      getEvaluations(),
    ]);
    setEmployees(emps);
    setCompetencies(comps);
    setDepartments(depts);
    setEvaluations(evals);
    setLoading(false);
  };

  const exportCSV = (data: string[][], filename: string) => {
    const BOM = '\uFEFF';
    const csv = BOM + data.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportIndividual = () => {
    const emp = employees.find((e) => e.id === selectedEmployee);
    if (!emp) return;
    const eval_ = evaluations.find(
      (ev) => ev.employeeId === emp.id && (ev.status === 'completed' || ev.status === 'approved')
    );
    const rows: string[][] = [
      ['Báo cáo Hồ sơ Năng lực Cá nhân'],
      ['Nhân viên:', emp.fullName, 'Mã NV:', emp.code],
      ['Email:', emp.email],
      [],
      ['Năng lực', 'Nhóm ASK', 'Mức yêu cầu', 'Điểm tự đánh giá', 'Điểm quản lý', 'Điểm cuối', 'Khoảng cách'],
    ];
    if (eval_) {
      eval_.competencyScores.forEach((cs) => {
        rows.push([
          cs.competencyName,
          ASK_GROUP_LABELS[cs.askGroup],
          cs.requiredLevel.toString(),
          (cs.selfScore || 0).toString(),
          (cs.managerScore || 0).toString(),
          cs.finalScore.toString(),
          cs.gap.toString(),
        ]);
      });
    }
    exportCSV(rows, `nangluc_${emp.code}_${new Date().toISOString().slice(0, 10)}`);
  };

  const handleExportDeptGap = () => {
    const deptEmps = selectedDept
      ? employees.filter((e) => e.departmentId === selectedDept)
      : employees;
    const rows: string[][] = [
      ['Báo cáo Khoảng cách Năng lực theo Phòng ban'],
      [],
      ['Nhân viên', 'Mã NV', 'Vị trí', 'Số NL đạt', 'Số NL cần cải thiện', 'Số NL thiếu hụt', 'Gap TB'],
    ];
    deptEmps.forEach((emp) => {
      const eval_ = evaluations.find(
        (ev) => ev.employeeId === emp.id && (ev.status === 'completed' || ev.status === 'approved')
      );
      if (eval_) {
        const met = eval_.competencyScores.filter((cs) => cs.gap >= 0).length;
        const needs = eval_.competencyScores.filter((cs) => cs.gap < 0 && cs.gap >= -1).length;
        const critical = eval_.competencyScores.filter((cs) => cs.gap < -1).length;
        const avgGap =
          eval_.competencyScores.length > 0
            ? (eval_.competencyScores.reduce((s, c) => s + c.gap, 0) / eval_.competencyScores.length).toFixed(1)
            : '0';
        rows.push([emp.fullName, emp.code, emp.positionId, met.toString(), needs.toString(), critical.toString(), avgGap]);
      }
    });
    exportCSV(rows, `gap_phongban_${new Date().toISOString().slice(0, 10)}`);
  };

  const handleExportASK = () => {
    const rows: string[][] = [
      ['Báo cáo Năng lực theo Nhóm ASK'],
      [],
      ['Nhóm', 'Năng lực', 'Số NV được đánh giá', 'Điểm TB', 'Mức yêu cầu TB', 'Gap TB'],
    ];
    (['knowledge', 'skill', 'attitude'] as ASKGroup[]).forEach((group) => {
      const groupComps = competencies.filter((c) => c.askGroup === group);
      groupComps.forEach((comp) => {
        let totalScore = 0;
        let totalRequired = 0;
        let count = 0;
        evaluations.forEach((ev) => {
          const cs = ev.competencyScores.find((s) => s.competencyId === comp.id);
          if (cs) {
            totalScore += cs.finalScore;
            totalRequired += cs.requiredLevel;
            count++;
          }
        });
        if (count > 0) {
          rows.push([
            ASK_GROUP_LABELS[group],
            comp.name,
            count.toString(),
            (totalScore / count).toFixed(1),
            (totalRequired / count).toFixed(1),
            ((totalScore - totalRequired) / count).toFixed(1),
          ]);
        }
      });
    });
    exportCSV(rows, `ask_analysis_${new Date().toISOString().slice(0, 10)}`);
  };

  const handleExportTraining = () => {
    const rows: string[][] = [
      ['Báo cáo Phục vụ Đào tạo'],
      [],
      ['Năng lực', 'Nhóm ASK', 'Số NV thiếu hụt', 'Gap TB', 'Mức độ ưu tiên'],
    ];
    const compGaps: Record<string, { name: string; group: ASKGroup; count: number; totalGap: number }> = {};
    evaluations.forEach((ev) => {
      ev.competencyScores.forEach((cs) => {
        if (cs.gap < 0) {
          if (!compGaps[cs.competencyId]) {
            compGaps[cs.competencyId] = { name: cs.competencyName, group: cs.askGroup, count: 0, totalGap: 0 };
          }
          compGaps[cs.competencyId].count++;
          compGaps[cs.competencyId].totalGap += cs.gap;
        }
      });
    });
    Object.values(compGaps)
      .sort((a, b) => a.totalGap / a.count - b.totalGap / b.count)
      .forEach((cg) => {
        const avgGap = (cg.totalGap / cg.count).toFixed(1);
        const priority = cg.totalGap / cg.count < -1.5 ? 'Cao' : cg.totalGap / cg.count < -0.5 ? 'Trung bình' : 'Thấp';
        rows.push([cg.name, ASK_GROUP_LABELS[cg.group], cg.count.toString(), avgGap, priority]);
      });
    exportCSV(rows, `daotao_${new Date().toISOString().slice(0, 10)}`);
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
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <FileText className="w-7 h-7 text-indigo-400" />
          Báo cáo
        </h1>
        <p className="text-slate-400 mt-1">
          Tạo và xuất các báo cáo phân tích năng lực nhân sự
        </p>
      </div>

      {/* Report Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORT_TYPES.map((rt) => (
          <button
            key={rt.key}
            onClick={() => setSelectedReport(rt.key)}
            className={`glass-card rounded-2xl p-5 text-left transition-all duration-300 hover:scale-[1.02] group ${
              selectedReport === rt.key
                ? 'border-indigo-500/50 bg-indigo-500/5'
                : 'hover:border-slate-600'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                selectedReport === rt.key
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'bg-slate-800 text-slate-400 group-hover:text-indigo-400'
              }`}
            >
              {rt.icon}
            </div>
            <h3 className="font-semibold text-white mb-1">{rt.label}</h3>
            <p className="text-sm text-slate-500">{rt.description}</p>
          </button>
        ))}
      </div>

      {/* Report Content */}
      {selectedReport && (
        <div className="glass-card rounded-2xl p-6 space-y-4">
          {/* Individual Report */}
          {selectedReport === 'individual' && (
            <>
              <h3 className="text-lg font-semibold text-white">Hồ sơ năng lực cá nhân</h3>
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-sm text-slate-400 mb-1.5">Chọn nhân viên</label>
                  <div className="relative">
                    <select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                      <option value="">-- Chọn --</option>
                      {employees.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.fullName} ({e.code})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <button
                  onClick={handleExportIndividual}
                  disabled={!selectedEmployee}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-medium transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Xuất Excel
                </button>
              </div>

              {/* Preview */}
              {selectedEmployee && (() => {
                const emp = employees.find((e) => e.id === selectedEmployee);
                const eval_ = evaluations.find(
                  (ev) => ev.employeeId === selectedEmployee && (ev.status === 'completed' || ev.status === 'approved')
                );
                if (!emp) return null;
                return (
                  <div className="mt-4">
                    <div className="bg-slate-800/30 rounded-xl p-4 mb-4">
                      <p className="text-white font-medium">{emp.fullName}</p>
                      <p className="text-sm text-slate-400">Mã NV: {emp.code} • Email: {emp.email}</p>
                    </div>
                    {eval_ ? (
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-700/50">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Năng lực</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Nhóm</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase">YC</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Điểm</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Gap</th>
                          </tr>
                        </thead>
                        <tbody>
                          {eval_.competencyScores.map((cs, i) => (
                            <tr key={i} className="border-b border-slate-800/50">
                              <td className="px-4 py-3 text-sm text-white">{cs.competencyName}</td>
                              <td className="px-4 py-3 text-sm text-slate-400">
                                {ASK_GROUP_LABELS[cs.askGroup]}
                              </td>
                              <td className="px-4 py-3 text-sm text-center text-slate-300">{cs.requiredLevel}</td>
                              <td className="px-4 py-3 text-sm text-center text-white font-medium">{cs.finalScore}</td>
                              <td className="px-4 py-3 text-sm text-center">
                                <span
                                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                                    cs.gap >= 0
                                      ? 'bg-emerald-500/20 text-emerald-400'
                                      : cs.gap >= -1
                                      ? 'bg-yellow-500/20 text-yellow-400'
                                      : 'bg-red-500/20 text-red-400'
                                  }`}
                                >
                                  {cs.gap > 0 ? '+' : ''}{cs.gap}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-slate-500 text-center py-8">Chưa có dữ liệu đánh giá</p>
                    )}
                  </div>
                );
              })()}
            </>
          )}

          {/* Department Gap Report */}
          {selectedReport === 'department-gap' && (
            <>
              <h3 className="text-lg font-semibold text-white">Khoảng cách năng lực theo phòng ban</h3>
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-sm text-slate-400 mb-1.5">Chọn phòng ban</label>
                  <div className="relative">
                    <select
                      value={selectedDept}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                      <option value="">Tất cả phòng ban</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <button
                  onClick={handleExportDeptGap}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Xuất Excel
                </button>
              </div>
            </>
          )}

          {/* ASK Group Report */}
          {selectedReport === 'ask-group' && (
            <>
              <h3 className="text-lg font-semibold text-white">Năng lực theo nhóm ASK</h3>
              <button
                onClick={handleExportASK}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all"
              >
                <FileSpreadsheet className="w-4 h-4" /> Xuất Excel
              </button>
            </>
          )}

          {/* Training Report */}
          {selectedReport === 'training' && (
            <>
              <h3 className="text-lg font-semibold text-white">Báo cáo phục vụ đào tạo</h3>
              <p className="text-slate-400 text-sm">
                Danh sách năng lực thiếu hụt nhiều nhất, sắp xếp theo mức độ ưu tiên đào tạo
              </p>
              <button
                onClick={handleExportTraining}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all"
              >
                <FileSpreadsheet className="w-4 h-4" /> Xuất Excel
              </button>
            </>
          )}

          {/* Position & Recruitment Reports */}
          {(selectedReport === 'position' || selectedReport === 'recruitment') && (
            <>
              <h3 className="text-lg font-semibold text-white">
                {selectedReport === 'position'
                  ? 'Năng lực theo vị trí'
                  : 'Báo cáo phục vụ tuyển dụng'}
              </h3>
              <p className="text-slate-400 text-sm">
                {selectedReport === 'position'
                  ? 'Phân tích năng lực trung bình của nhân viên theo từng vị trí'
                  : 'Xác định vị trí có khoảng cách năng lực lớn nhất, cần bổ sung nhân sự'}
              </p>
              <button
                onClick={() => {
                  const rows: string[][] = [
                    [selectedReport === 'position' ? 'Báo cáo Năng lực theo Vị trí' : 'Báo cáo Tuyển dụng'],
                    [],
                    ['Thông tin đang được chuẩn bị...'],
                  ];
                  exportCSV(rows, `${selectedReport}_${new Date().toISOString().slice(0, 10)}`);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all"
              >
                <FileSpreadsheet className="w-4 h-4" /> Xuất Excel
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
