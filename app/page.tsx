'use client';

import React, { useState, useEffect } from 'react';
import { initializeDB } from '@/lib/db';
import { ActivePage, UserRole, USER_ROLE_LABELS } from '@/lib/types';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import CompetencyDictionary from '@/components/CompetencyDictionary';
import CompetencyFramework from '@/components/CompetencyFramework';
import EmployeeManagement from '@/components/EmployeeManagement';
import EvaluationModule from '@/components/EvaluationModule';
import GapAnalysis from '@/components/GapAnalysis';
import DevelopmentPlan from '@/components/DevelopmentPlan';
import Reports from '@/components/Reports';
import AIReport from '@/components/AIReport';
import { Search, Bell, UserCircle, ChevronDown, Settings as SettingsIcon } from 'lucide-react';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');

  useEffect(() => {
    const init = async () => {
      await initializeDB();
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-950 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          <p className="text-slate-400 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'dictionary':
        return <CompetencyDictionary />;
      case 'framework':
        return <CompetencyFramework />;
      case 'employees':
        return <EmployeeManagement />;
      case 'evaluation':
        return <EvaluationModule />;
      case 'gap-analysis':
        return <GapAnalysis />;
      case 'idp':
        return <DevelopmentPlan />;
      case 'reports':
        return <Reports />;
      case 'ai-report':
        return <AIReport />;
      case 'settings':
        return (
          <div className="glass-card rounded-2xl p-8 text-center">
            <SettingsIcon className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Cài đặt hệ thống</h2>
            <p className="text-slate-400">Chức năng đang được phát triển...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = (page: ActivePage) => {
    const titles: Record<ActivePage, string> = {
      dashboard: 'Tổng quan',
      dictionary: 'Từ điển năng lực',
      framework: 'Khung năng lực',
      employees: 'Quản lý nhân viên',
      evaluation: 'Đánh giá năng lực',
      'gap-analysis': 'Phân tích Gap',
      idp: 'Kế hoạch phát triển (IDP)',
      reports: 'Báo cáo',
      'ai-report': 'Báo cáo AI (Gemini)',
      settings: 'Cài đặt',
    };
    return titles[page];
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar activePage={activePage} onNavigate={setActivePage} currentRole={currentRole} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">CompetencyOS</span>
            <span className="text-slate-600">/</span>
            <span className="text-white font-medium">{getPageTitle(activePage)}</span>
          </div>

          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-64 pl-10 pr-4 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-full text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <button className="text-slate-400 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>

            {/* Role Switcher */}
            <div className="flex items-center gap-3 pl-6 border-l border-slate-800">
              <div className="text-right hidden md:block">
                <div className="text-sm font-medium text-white">Demo User</div>
                <div className="text-xs text-indigo-400 flex items-center gap-1 cursor-pointer group">
                  <select
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                    className="appearance-none bg-transparent focus:outline-none hover:text-indigo-300 transition-colors"
                  >
                    <option value="admin">Quản trị viên (Admin)</option>
                    <option value="hr">Nhân sự (HR)</option>
                    <option value="manager">Quản lý (Manager)</option>
                    <option value="employee">Nhân viên (Employee)</option>
                  </select>
                  <ChevronDown className="w-3 h-3 group-hover:text-indigo-300 transition-colors" />
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg">
                <UserCircle className="w-5 h-5" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 z-10 relative">
          <div className="max-w-7xl mx-auto pb-12">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
