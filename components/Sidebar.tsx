import React from 'react';
import { ModuleType } from '../types';
import { LayoutDashboard, Stethoscope, Landmark, Pill, FileText, Settings, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  currentModule: ModuleType;
  onNavigate: (module: ModuleType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentModule, onNavigate }) => {
  
  const navItems = [
    { id: ModuleType.DASHBOARD, label: 'Executive Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: ModuleType.EHR, label: 'Patient Records (EHR)', icon: <Stethoscope size={20} /> },
    { id: ModuleType.FINANCE, label: 'Core Finance', icon: <Landmark size={20} /> },
    { id: ModuleType.INVENTORY, label: 'Pharmacy & Inventory', icon: <Pill size={20} /> },
    { id: ModuleType.BILLING, label: 'Claims & Billing', icon: <FileText size={20} /> },
  ];

  return (
    <aside className="w-72 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-50 shadow-2xl transition-all duration-300">
      <div className="p-6 border-b border-slate-700">
        <h1 className="font-serif text-2xl font-bold tracking-wider text-primary-100 flex items-center gap-2">
          <ShieldCheck className="text-accent-gold" />
          AETHERIA
        </h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Hospital ERP OS v2.0</p>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group
              ${currentModule === item.id 
                ? 'bg-primary-800 text-white shadow-lg border-l-4 border-accent-gold' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <span className={`${currentModule === item.id ? 'text-accent-gold' : 'group-hover:text-primary-300'}`}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors w-full px-4 py-2">
          <Settings size={18} />
          <span className="text-sm">System Configuration</span>
        </button>
        <div className="mt-4 px-4 py-2 bg-slate-800 rounded text-xs text-slate-400">
          <div className="flex justify-between mb-1">
            <span>Server Status</span>
            <span className="text-green-400">Online</span>
          </div>
          <div className="flex justify-between">
            <span>Vertex AI</span>
            <span className="text-accent-gold">Connected</span>
          </div>
        </div>
      </div>
    </aside>
  );
};