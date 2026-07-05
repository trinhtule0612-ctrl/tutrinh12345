'use client';

import React, { useState, useEffect } from 'react';
import {
  Employee,
  EvaluationPeriod,
  AIReport,
  AIReportData,
  AI_REPORT_STATUS_LABELS,
  AIReportStatus,
} from '@/lib/types';
import {
  getEmployees,
  getEvaluationPeriods,
  getEvaluationsByEmployee,
  getAIReportsByEmployee,
  addAIReport,
  updateAIReport,
  getPositions,
  getPositionCompetencies,
  getCompetencies,
  getIDPByEmployee,
} from '@/lib/db';
import {
  Brain,
  Sparkles,
  RefreshCw,
  Save,
  FileDown,
  Mail,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Target,
  BookOpen,
  Shield,
  Clock,
  Edit3,
  History,
  Loader2,
} from 'lucide-react';

export default function AIReportModule() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [periods, setPeriods] = useState<EvaluationPeriod[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<AIReport | null>(null);
  const [reportHistory, setReportHistory] = useState<AIReport[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<AIReportData | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadInitial();
  }, []);

  const loadInitial = async () => {
    const [emps, pers] = await Promise.all([getEmployees(), getEvaluationPeriods()]);
    setEmployees(emps);
    setPeriods(pers);
    if (pers.length > 0) setSelectedPeriod(pers[0].id);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedEmployee) {
      loadReports();
    }
  }, [selectedEmployee]);

  const loadReports = async () => {
    const reports = await getAIReportsByEmployee(selectedEmployee);
    setReportHistory(reports);
    if (reports.length > 0) {
      const latest = reports[reports.length - 1];
      setReport(latest);
      setEditData(latest.reportData);
    } else {
      setReport(null);
      setEditData(null);
    }
  };

  const generateReport = async () => {
    if (!selectedEmployee || !selectedPeriod) return;
    setGenerating(true);
    setError('');

    try {
      // Gather all employee data
      const employee = employees.find((e) => e.id === selectedEmployee);
      if (!employee) throw new Error('Employee not found');

      const positions = await getPositions();
      const position = positions.find((p) => p.id === employee.positionId);
      const evaluations = await getEvaluationsByEmployee(selectedEmployee);
      const posComps = await getPositionCompetencies(employee.positionId);
      const allComps = await getCompetencies();
      const idpItems = await getIDPByEmployee(selectedEmployee);

      // Build competency data
      const competencyData = posComps.map((pc) => {
        const comp = allComps.find((c) => c.id === pc.competencyId);
        const eval_ = evaluations.find((ev) => ev.status === 'completed' || ev.status === 'approved');
        const score = eval_?.competencyScores.find((cs) => cs.competencyId === pc.competencyId);
        return {
          name: comp?.name || '',
          askGroup: comp?.askGroup || 'skill',
          requiredLevel: pc.requiredLevel,
          selfScore: score?.selfScore || null,
          managerScore: score?.managerScore || null,
          finalScore: score?.finalScore || 0,
          gap: score?.gap || 0,
          evidence: score?.evidence || '',
        };
      });

      // Try to call the API route
      const payload = {
        employee: {
          name: employee.fullName,
          code: employee.code,
          position: position?.name || '',
          level: employee.level,
        },
        competencyData,
        idpItems: idpItems.map((i) => ({
          competency: i.competencyName,
          goal: i.developmentGoal,
          status: i.status,
        })),
      };

      let reportData: AIReportData;

      try {
        const res = await fetch('/api/ai/competency-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          reportData = data.report;
        } else {
          // Fallback to mock data if API fails
          reportData = generateMockReport(employee, competencyData);
        }
      } catch {
        // API not available, use mock data
        reportData = generateMockReport(employee, competencyData);
      }

      const newReport: AIReport = {
        id: 'air-' + Date.now(),
        employeeId: selectedEmployee,
        periodId: selectedPeriod,
        status: 'draft',
        reportData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: (reportHistory.length || 0) + 1,
      };

      await addAIReport(newReport);
      setReport(newReport);
      setEditData(newReport.reportData);
      await loadReports();
    } catch (err) {
      setError('Có lỗi xảy ra khi tạo báo cáo. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const generateMockReport = (
    employee: Employee,
    competencyData: { name: string; askGroup: string; gap: number; finalScore: number; requiredLevel: number }[]
  ): AIReportData => {
    const strengths = competencyData.filter((c) => c.gap >= 0).map((c) => c.name);
    const weaknesses = competencyData.filter((c) => c.gap < 0).map((c) => c.name);
    const knowledgeComps = competencyData.filter((c) => c.askGroup === 'knowledge');
    const skillComps = competencyData.filter((c) => c.askGroup === 'skill');
    const attitudeComps = competencyData.filter((c) => c.askGroup === 'attitude');

    const avgGap = competencyData.length > 0
      ? competencyData.reduce((sum, c) => sum + c.gap, 0) / competencyData.length
      : 0;

    return {
      summary: `${employee.fullName} thể hiện năng lực ở mức khá với điểm trung bình đạt ${(competencyData.reduce((s, c) => s + c.finalScore, 0) / (competencyData.length || 1)).toFixed(1)}/5. Nhân viên có ${strengths.length} năng lực đạt/vượt yêu cầu và ${weaknesses.length} năng lực cần cải thiện. Khoảng cách năng lực trung bình là ${avgGap.toFixed(1)} điểm.`,
      strengths: strengths.length > 0
        ? strengths.slice(0, 4).map((s) => `${s}: Đạt hoặc vượt mức yêu cầu, thể hiện sự thành thạo trong lĩnh vực này`)
        : ['Nhân viên cần nỗ lực phát triển toàn diện hơn'],
      developmentAreas: weaknesses.length > 0
        ? weaknesses.slice(0, 4).map((w) => `${w}: Cần được đào tạo và phát triển thêm để đạt mức yêu cầu`)
        : ['Không có năng lực nào cần cải thiện đáng kể'],
      askAnalysis: {
        knowledge: knowledgeComps.length > 0
          ? `Nhóm Kiến thức: Điểm trung bình ${(knowledgeComps.reduce((s, c) => s + c.finalScore, 0) / knowledgeComps.length).toFixed(1)}/5. ${knowledgeComps.some((c) => c.gap < 0) ? 'Cần bổ sung kiến thức chuyên môn nghiệp vụ.' : 'Kiến thức nền tảng đáp ứng tốt yêu cầu.'}`
          : 'Không có dữ liệu đánh giá nhóm Kiến thức.',
        skill: skillComps.length > 0
          ? `Nhóm Kỹ năng: Điểm trung bình ${(skillComps.reduce((s, c) => s + c.finalScore, 0) / skillComps.length).toFixed(1)}/5. ${skillComps.filter((c) => c.gap < 0).length > 2 ? 'Nhiều kỹ năng cần phát triển, đặc biệt là kỹ năng mềm.' : 'Các kỹ năng cơ bản đã được trang bị tốt.'}`
          : 'Không có dữ liệu đánh giá nhóm Kỹ năng.',
        attitude: attitudeComps.length > 0
          ? `Nhóm Thái độ: Điểm trung bình ${(attitudeComps.reduce((s, c) => s + c.finalScore, 0) / attitudeComps.length).toFixed(1)}/5. ${attitudeComps.some((c) => c.gap < -1) ? 'Cần chú ý cải thiện thái độ và phẩm chất nghề nghiệp.' : 'Thái độ làm việc tích cực, phù hợp với văn hóa tổ chức.'}`
          : 'Không có dữ liệu đánh giá nhóm Thái độ.',
      },
      roleFit: avgGap >= -0.5
        ? 'Nhân viên phù hợp tốt với vị trí hiện tại. Năng lực tổng thể đáp ứng yêu cầu công việc.'
        : avgGap >= -1.5
        ? 'Nhân viên cơ bản phù hợp với vị trí nhưng cần cải thiện một số năng lực để đáp ứng đầy đủ yêu cầu.'
        : 'Nhân viên cần được hỗ trợ đáng kể để đáp ứng yêu cầu vị trí hiện tại. Cân nhắc kế hoạch phát triển tập trung.',
      risks: weaknesses.length > 3
        ? [
            'Số lượng năng lực thiếu hụt nhiều có thể ảnh hưởng đến hiệu suất công việc',
            'Cần theo dõi sát tiến độ phát triển, tránh tụt hậu so với yêu cầu vị trí',
            'Rủi ro mất động lực nếu không có kế hoạch hỗ trợ kịp thời',
          ]
        : [
            'Cần duy trì và phát triển liên tục để không bị tụt lại',
            'Theo dõi các năng lực có khoảng cách để cải thiện kịp thời',
          ],
      developmentPlan30Days: [
        'Hoàn thành khóa đào tạo nội bộ về các kỹ năng thiếu hụt',
        'Xác định mentor/coach cho từng năng lực cần phát triển',
        'Thiết lập mục tiêu SMART cho giai đoạn 30 ngày đầu',
      ],
      developmentPlan60Days: [
        'Áp dụng kiến thức đã học vào dự án thực tế',
        'Tham gia ít nhất 2 workshop chuyên môn',
        'Đánh giá tiến độ giữa kỳ với quản lý trực tiếp',
      ],
      developmentPlan90Days: [
        'Hoàn thành đánh giá lại năng lực để đo lường tiến bộ',
        'Chia sẻ kinh nghiệm học hỏi với đồng nghiệp',
        'Thiết lập mục tiêu phát triển cho giai đoạn tiếp theo',
      ],
      trainingSuggestions: [
        'Khóa học kỹ năng giao tiếp chuyên nghiệp',
        'Workshop quản lý thời gian và năng suất cá nhân',
        'Chương trình mentoring 1-1 với senior leader',
        'Khóa học trực tuyến trên Coursera/Udemy về chuyên môn',
      ],
      careerPathSuggestion:
        avgGap >= -0.5
          ? 'Với năng lực hiện tại, nhân viên có tiềm năng phát triển lên vị trí cao hơn trong 12-18 tháng tới. Đề xuất chuẩn bị cho vai trò Senior/Lead.'
          : 'Nhân viên nên tập trung củng cố năng lực tại vị trí hiện tại trong 6-12 tháng trước khi xem xét thăng tiến.',
      managerNotes:
        'Quản lý nên tổ chức buổi trao đổi 1-1 hàng tuần để theo dõi tiến độ phát triển. Tạo cơ hội thực hành cho nhân viên trong các dự án thực tế. Ghi nhận và khen thưởng kịp thời khi có tiến bộ.',
      conclusion: `Tổng kết: ${employee.fullName} là nhân viên có tiềm năng phát triển. Với kế hoạch hành động cụ thể và sự hỗ trợ của tổ chức, nhân viên hoàn toàn có thể thu hẹp khoảng cách năng lực và phát triển tốt trong vai trò hiện tại.`,
    };
  };

  const handleSaveReport = async () => {
    if (!report || !editData) return;
    const updated: AIReport = {
      ...report,
      reportData: editData,
      updatedAt: new Date().toISOString(),
    };
    await updateAIReport(updated);
    setReport(updated);
    setEditMode(false);
    await loadReports();
  };

  const handleStatusChange = async (status: AIReportStatus) => {
    if (!report) return;
    const updated: AIReport = { ...report, status, updatedAt: new Date().toISOString() };
    await updateAIReport(updated);
    setReport(updated);
    await loadReports();
  };

  const handleExportPDF = () => {
    window.print();
  };

  const statusBadge = (s: AIReportStatus) => {
    const colors: Record<AIReportStatus, string> = {
      draft: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      reviewed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      approved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      sent: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    };
    return colors[s];
  };

  const selectedEmp = employees.find((e) => e.id === selectedEmployee);

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
            <Brain className="w-7 h-7 text-violet-400" />
            Báo cáo AI Năng lực
          </h1>
          <p className="text-slate-400 mt-1">
            Tạo báo cáo phân tích năng lực tự động bằng Gemini AI
          </p>
        </div>
      </div>

      {/* Selection */}
      <div className="glass-card rounded-2xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Chọn nhân viên</label>
            <div className="relative">
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
              >
                <option value="">-- Chọn nhân viên --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName} ({emp.code})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Kỳ đánh giá</label>
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
              >
                {periods.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={generateReport}
              disabled={!selectedEmployee || generating}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
            >
              {generating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              {generating ? 'Đang tạo...' : 'Tạo báo cáo AI'}
            </button>
            {report && (
              <button
                onClick={generateReport}
                disabled={generating}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all"
                title="Tạo lại báo cáo"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        {error && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Report Content */}
      {report && editData && (
        <div className="space-y-4 print:space-y-2" id="ai-report-content">
          {/* Report Header */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Báo cáo năng lực: {selectedEmp?.fullName}
                </h2>
                <p className="text-sm text-slate-400">
                  Phiên bản {report.version} • Tạo lúc{' '}
                  {new Date(report.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${statusBadge(report.status)}`}
                >
                  {AI_REPORT_STATUS_LABELS[report.status]}
                </span>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`p-2 rounded-lg transition-all ${editMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                  title={editMode ? 'Tắt chỉnh sửa' : 'Chỉnh sửa'}
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-all"
                  title="Lịch sử"
                >
                  <History className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-700/30">
              {editMode && (
                <button
                  onClick={handleSaveReport}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-all"
                >
                  <Save className="w-4 h-4" /> Lưu báo cáo
                </button>
              )}
              <button
                onClick={() => handleStatusChange('reviewed')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-all"
              >
                <CheckCircle className="w-4 h-4" /> Đã xem xét
              </button>
              <button
                onClick={() => handleStatusChange('approved')}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-all"
              >
                <Shield className="w-4 h-4" /> Phê duyệt
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-all"
              >
                <FileDown className="w-4 h-4" /> Xuất PDF
              </button>
              <button
                onClick={() => handleStatusChange('sent')}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-all"
              >
                <Mail className="w-4 h-4" /> Gửi email cho nhân viên
              </button>
            </div>
          </div>

          {/* History Panel */}
          {showHistory && reportHistory.length > 0 && (
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <History className="w-5 h-5 text-slate-400" /> Lịch sử báo cáo
              </h3>
              <div className="space-y-2">
                {reportHistory.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      setReport(r);
                      setEditData(r.reportData);
                    }}
                    className={`p-3 rounded-xl cursor-pointer transition-all ${r.id === report.id ? 'bg-indigo-500/20 border border-indigo-500/30' : 'bg-slate-800/50 hover:bg-slate-800'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm font-medium">
                        Phiên bản {r.version}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${statusBadge(r.status)}`}>
                        {AI_REPORT_STATUS_LABELS[r.status]}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(r.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Report Sections */}
          <ReportSection
            icon={<BookOpen className="w-5 h-5 text-blue-400" />}
            title="Tóm tắt tổng quan"
            editMode={editMode}
          >
            {editMode ? (
              <textarea
                value={editData.summary}
                onChange={(e) => setEditData({ ...editData, summary: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
              />
            ) : (
              <p className="text-slate-300 leading-relaxed">{editData.summary}</p>
            )}
          </ReportSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ReportSection
              icon={<CheckCircle className="w-5 h-5 text-emerald-400" />}
              title="Điểm mạnh nổi bật"
              editMode={editMode}
            >
              <ul className="space-y-2">
                {editData.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                    {editMode ? (
                      <input
                        type="text"
                        value={s}
                        onChange={(e) => {
                          const newArr = [...editData.strengths];
                          newArr[i] = e.target.value;
                          setEditData({ ...editData, strengths: newArr });
                        }}
                        className="flex-1 px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    ) : (
                      <span className="text-slate-300 text-sm">{s}</span>
                    )}
                  </li>
                ))}
              </ul>
            </ReportSection>

            <ReportSection
              icon={<AlertTriangle className="w-5 h-5 text-yellow-400" />}
              title="Năng lực cần phát triển"
              editMode={editMode}
            >
              <ul className="space-y-2">
                {editData.developmentAreas.map((d, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-yellow-400 shrink-0"></span>
                    {editMode ? (
                      <input
                        type="text"
                        value={d}
                        onChange={(e) => {
                          const newArr = [...editData.developmentAreas];
                          newArr[i] = e.target.value;
                          setEditData({ ...editData, developmentAreas: newArr });
                        }}
                        className="flex-1 px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    ) : (
                      <span className="text-slate-300 text-sm">{d}</span>
                    )}
                  </li>
                ))}
              </ul>
            </ReportSection>
          </div>

          {/* ASK Analysis */}
          <ReportSection
            icon={<TrendingUp className="w-5 h-5 text-indigo-400" />}
            title="Phân tích theo mô hình ASK"
            editMode={editMode}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['knowledge', 'skill', 'attitude'] as const).map((key) => {
                const labels = { knowledge: 'Knowledge (Kiến thức)', skill: 'Skill (Kỹ năng)', attitude: 'Attitude (Thái độ)' };
                const colors = { knowledge: 'blue', skill: 'emerald', attitude: 'violet' };
                const color = colors[key];
                return (
                  <div key={key} className={`p-4 rounded-xl bg-${color}-500/5 border border-${color}-500/20`}>
                    <h4 className={`text-sm font-semibold text-${color}-400 mb-2`}>{labels[key]}</h4>
                    {editMode ? (
                      <textarea
                        value={editData.askAnalysis[key]}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            askAnalysis: { ...editData.askAnalysis, [key]: e.target.value },
                          })
                        }
                        rows={3}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                      />
                    ) : (
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {editData.askAnalysis[key]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </ReportSection>

          {/* Role Fit */}
          <ReportSection
            icon={<Target className="w-5 h-5 text-cyan-400" />}
            title="Mức độ phù hợp với vị trí"
            editMode={editMode}
          >
            {editMode ? (
              <textarea
                value={editData.roleFit}
                onChange={(e) => setEditData({ ...editData, roleFit: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
              />
            ) : (
              <p className="text-slate-300 leading-relaxed">{editData.roleFit}</p>
            )}
          </ReportSection>

          {/* Development Plan 30/60/90 */}
          <ReportSection
            icon={<Clock className="w-5 h-5 text-orange-400" />}
            title="Kế hoạch phát triển 30/60/90 ngày"
            editMode={editMode}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: 'developmentPlan30Days' as const, label: '30 ngày', color: 'emerald' },
                { key: 'developmentPlan60Days' as const, label: '60 ngày', color: 'blue' },
                { key: 'developmentPlan90Days' as const, label: '90 ngày', color: 'violet' },
              ].map(({ key, label, color }) => (
                <div key={key} className={`p-4 rounded-xl bg-${color}-500/5 border border-${color}-500/20`}>
                  <h4 className={`text-sm font-semibold text-${color}-400 mb-3`}>{label}</h4>
                  <ul className="space-y-2">
                    {editData[key].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-${color}-400 shrink-0`}></span>
                        {editMode ? (
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const newArr = [...editData[key]];
                              newArr[i] = e.target.value;
                              setEditData({ ...editData, [key]: newArr });
                            }}
                            className="flex-1 px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                          />
                        ) : (
                          <span className="text-slate-400 text-sm">{item}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ReportSection>

          {/* Training Suggestions + Career Path */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ReportSection
              icon={<BookOpen className="w-5 h-5 text-pink-400" />}
              title="Đề xuất đào tạo"
              editMode={editMode}
            >
              <ul className="space-y-2">
                {editData.trainingSuggestions.map((t, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-pink-400 shrink-0"></span>
                    {editMode ? (
                      <input
                        type="text"
                        value={t}
                        onChange={(e) => {
                          const newArr = [...editData.trainingSuggestions];
                          newArr[i] = e.target.value;
                          setEditData({ ...editData, trainingSuggestions: newArr });
                        }}
                        className="flex-1 px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    ) : (
                      <span className="text-slate-300 text-sm">{t}</span>
                    )}
                  </li>
                ))}
              </ul>
            </ReportSection>

            <ReportSection
              icon={<TrendingUp className="w-5 h-5 text-cyan-400" />}
              title="Gợi ý lộ trình nghề nghiệp"
              editMode={editMode}
            >
              {editMode ? (
                <textarea
                  value={editData.careerPathSuggestion}
                  onChange={(e) =>
                    setEditData({ ...editData, careerPathSuggestion: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                />
              ) : (
                <p className="text-slate-300 leading-relaxed">{editData.careerPathSuggestion}</p>
              )}
            </ReportSection>
          </div>

          {/* Manager Notes + Conclusion */}
          <ReportSection
            icon={<Shield className="w-5 h-5 text-amber-400" />}
            title="Nhận xét dành cho quản lý"
            editMode={editMode}
          >
            {editMode ? (
              <textarea
                value={editData.managerNotes}
                onChange={(e) => setEditData({ ...editData, managerNotes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
              />
            ) : (
              <p className="text-slate-300 leading-relaxed">{editData.managerNotes}</p>
            )}
          </ReportSection>

          <ReportSection
            icon={<CheckCircle className="w-5 h-5 text-emerald-400" />}
            title="Kết luận"
            editMode={editMode}
          >
            {editMode ? (
              <textarea
                value={editData.conclusion}
                onChange={(e) => setEditData({ ...editData, conclusion: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
              />
            ) : (
              <p className="text-slate-300 leading-relaxed font-medium">{editData.conclusion}</p>
            )}
          </ReportSection>
        </div>
      )}

      {/* Empty State */}
      {!report && selectedEmployee && !generating && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Brain className="w-16 h-16 text-violet-400/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Chưa có báo cáo AI
          </h3>
          <p className="text-slate-400 mb-6">
            Nhấn &ldquo;Tạo báo cáo AI&rdquo; để Gemini phân tích năng lực nhân viên
          </p>
        </div>
      )}

      {!selectedEmployee && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Sparkles className="w-16 h-16 text-violet-400/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Chọn nhân viên để bắt đầu
          </h3>
          <p className="text-slate-400">
            Chọn một nhân viên từ danh sách ở trên để tạo hoặc xem báo cáo AI năng lực
          </p>
        </div>
      )}
    </div>
  );
}

function ReportSection({
  icon,
  title,
  editMode,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  editMode: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`glass-card rounded-2xl p-5 transition-all ${editMode ? 'border-indigo-500/30' : ''}`}>
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}
