'use client';

import React from 'react';
import { ActivePage, UserRole, USER_ROLE_LABELS } from '@/lib/types';
import {
  LayoutDashboard,
  BookOpen,
  Grid3x3,
  Users,
  ClipboardCheck,
  BarChart3,
  Target,
  FileText,
  Brain,
  Settings as SettingsIcon,
  ShieldAlert,
} from 'lucide-react';

interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  currentRole: UserRole;
}

export default function Sidebar({ activePage, onNavigate, currentRole }: SidebarProps) {
  const menuItems: { id: ActivePage; label: string; icon: React.ReactNode; roles: UserRole[] }[] = [
    { id: 'dashboard', label: 'Tổng quan', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['admin', 'hr', 'manager'] },
    { id: 'dictionary', label: 'Từ điển năng lực', icon: <BookOpen className="w-5 h-5" />, roles: ['admin', 'hr'] },
    { id: 'framework', label: 'Khung năng lực', icon: <Grid3x3 className="w-5 h-5" />, roles: ['admin', 'hr'] },
    { id: 'employees', label: 'Quản lý nhân viên', icon: <Users className="w-5 h-5" />, roles: ['admin', 'hr', 'manager'] },
    { id: 'evaluation', label: 'Đánh giá năng lực', icon: <ClipboardCheck className="w-5 h-5" />, roles: ['admin', 'hr', 'manager', 'employee'] },
    { id: 'gap-analysis', label: 'Phân tích Gap', icon: <BarChart3 className="w-5 h-5" />, roles: ['admin', 'hr', 'manager', 'employee'] },
    { id: 'idp', label: 'Kế hoạch phát triển', icon: <Target className="w-5 h-5" />, roles: ['admin', 'hr', 'manager', 'employee'] },
    { id: 'reports', label: 'Báo cáo', icon: <FileText className="w-5 h-5" />, roles: ['admin', 'hr', 'manager'] },
    { id: 'ai-report', label: 'Báo cáo AI (Gemini)', icon: <Brain className="w-5 h-5" />, roles: ['admin', 'hr', 'manager'] },
    { id: 'settings', label: 'Cài đặt', icon: <SettingsIcon className="w-5 h-5" />, roles: ['admin'] },
  ];

  return (
    <div className="w-[280px] h-full bg-slate-900 border-r border-slate-800/50 flex flex-col shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              CompetencyOS
            </h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
          Menu chính
        </div>
        
        {menuItems.map((item) => {
          const hasAccess = item.roles.includes(currentRole);
          const isActive = activePage === item.id;
          
          if (!hasAccess && currentRole !== 'admin') return null;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              disabled={!hasAccess}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500/10 to-violet-500/10 text-indigo-400 font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              } ${!hasAccess ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
              )}
              <div className={`${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                {item.icon}
              </div>
              <span className="text-sm">{item.label}</span>
              {!hasAccess && (
                <ShieldAlert className="w-3.5 h-3.5 ml-auto text-slate-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* User Info Bottom */}
      <div className="p-4 border-t border-slate-800/50">
        <div className="glass-card rounded-xl p-3 flex items-center gap-3 bg-slate-800/30 border-slate-700/30">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-slate-300">AD</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-white truncate">Demo User</div>
            <div className="text-xs text-indigo-400 truncate">{USER_ROLE_LABELS[currentRole]}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
