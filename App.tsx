import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AIPanel } from './components/AIPanel';
import { ModuleType, Patient, FinancialRecord, InventoryItem } from './types';
import { MOCK_PATIENTS, MOCK_FINANCIALS, MOCK_INVENTORY } from './constants';
import { GeminiService } from './services/geminiService';
import { 
  Users, Activity, DollarSign, AlertTriangle, 
  ArrowUpRight, ArrowDownRight, Package, Calendar,
  CheckCircle, Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// --- Dashboard View ---
const DashboardView = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        { title: 'Occupancy Rate', value: '87%', sub: '+2.4% vs last week', icon: <Users size={20} className="text-blue-600"/>, color: 'bg-blue-50' },
        { title: 'Daily Revenue', value: '$124.5k', sub: 'On track', icon: <DollarSign size={20} className="text-emerald-600"/>, color: 'bg-emerald-50' },
        { title: 'Pending Claims', value: '14', sub: 'Requires Review', icon: <Clock size={20} className="text-amber-600"/>, color: 'bg-amber-50' },
        { title: 'Critical Stock', value: '3 Items', sub: 'Urgent Action', icon: <AlertTriangle size={20} className="text-red-600"/>, color: 'bg-red-50' },
      ].map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>
          </div>
          <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
            {stat.sub.includes('+') ? <ArrowUpRight size={14} className="text-emerald-500"/> : <ArrowDownRight size={14} className="text-slate-400"/>}
            {stat.sub}
          </p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-6">Bed Occupancy Forecast (Vertex AI)</h3>
        <div className="h-64 w-full">
           <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[
              { day: 'Mon', actual: 82, predicted: 84 },
              { day: 'Tue', actual: 85, predicted: 86 },
              { day: 'Wed', actual: 87, predicted: 88 },
              { day: 'Thu', actual: null, predicted: 91 },
              { day: 'Fri', actual: null, predicted: 94 },
              { day: 'Sat', actual: null, predicted: 80 },
              { day: 'Sun', actual: null, predicted: 75 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <RechartsTooltip />
              <Line type="monotone" dataKey="actual" stroke="#0ea5e9" strokeWidth={2} name="Actual" />
              <Line type="monotone" dataKey="predicted" stroke="#d4af37" strokeWidth={2} strokeDasharray="5 5" name="AI Forecast" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-4">Urgent Tasks (Agile Board)</h3>
        <div className="space-y-3">
          {[
            { tag: 'Finance', text: 'Audit high-risk txn #TX-9903', priority: 'High' },
            { tag: 'EHR', text: 'Review discharge summary: Patient p1', priority: 'Medium' },
            { tag: 'Pharmacy', text: 'Approve Amoxicillin Reorder', priority: 'Low' },
          ].map((task, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                 <div>
                   <span className="text-xs font-bold text-slate-400 uppercase">{task.tag}</span>
                   <p className="text-sm font-medium text-slate-700">{task.text}</p>
                 </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded font-medium ${task.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// --- EHR View ---
const EHRView = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      <div className="w-2/3 flex flex-col gap-6">
        {/* Patient List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex-1">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Patient Name</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">MRN</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_PATIENTS.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-slate-900">{p.firstName} {p.lastName}</p>
                    <p className="text-xs text-slate-400">{p.gender} | {p.dob}</p>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{p.mrn}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      p.status === 'Admitted' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => setSelectedPatient(p)}
                      className="text-primary-500 hover:text-primary-700 text-sm font-medium"
                    >
                      View Chart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-1/3">
        <AIPanel 
          title="Clinical Assistant"
          placeholder="Enter unstructured doctor's notes (e.g., 'Pt presenting with chest pain, BP 140/90...')"
          onAnalyze={GeminiService.analyzeClinicalNote}
          resultRenderer={(result) => (
            <div className="space-y-3">
              {result.data ? (
                <>
                  <div className="bg-blue-50 p-2 rounded text-xs text-blue-800 border border-blue-100">
                    <span className="font-bold">Summary:</span> {result.data.summary}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-500">Suggested ICD-10:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {result.data.icdCodes?.map((code: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-slate-100 rounded border border-slate-200 text-xs font-mono">{code}</span>
                      ))}
                    </div>
                  </div>
                </>
              ) : <p className="text-sm text-slate-600">{result.text}</p>}
            </div>
          )}
        />
      </div>
    </div>
  );
};

// --- Finance View ---
const FinanceView = () => {
  const [selectedTx, setSelectedTx] = useState<FinancialRecord | null>(null);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      <div className="w-2/3 flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif font-bold text-xl text-slate-800">General Ledger (Anomaly Detection)</h3>
            <div className="flex gap-2 text-sm text-slate-500">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> High Risk</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Low Risk</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {MOCK_FINANCIALS.map(tx => (
              <div 
                key={tx.id} 
                onClick={() => setSelectedTx(tx)}
                className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                  tx.riskScore > 50 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-100 hover:border-primary-200'
                } ${selectedTx?.id === tx.id ? 'ring-2 ring-primary-500' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${tx.type === 'DEBIT' ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-600'}`}>
                    {tx.type === 'DEBIT' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{tx.description}</p>
                    <p className="text-xs text-slate-500">{tx.date} | {tx.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold font-mono ${tx.type === 'DEBIT' ? 'text-slate-800' : 'text-green-600'}`}>
                    {tx.type === 'DEBIT' ? '-' : '+'}${tx.amount.toLocaleString()}
                  </p>
                  {tx.riskScore > 50 && (
                     <span className="text-xs font-bold text-red-600 flex items-center justify-end gap-1 mt-1">
                       <AlertTriangle size={12} /> Risk Score: {tx.riskScore}
                     </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-1/3">
        <AIPanel 
          title="Audit Intelligence"
          placeholder="Select a transaction to run an audit trail analysis..."
          contextData={selectedTx}
          onAnalyze={() => GeminiService.analyzeTransactionAnomaly(selectedTx)}
          resultRenderer={(result) => (
             <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{result.text}</p>
          )}
        />
      </div>
    </div>
  );
};

// --- Inventory View ---
const InventoryView = () => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
     <div className="p-6 border-b border-slate-100">
        <h3 className="font-serif font-bold text-xl text-slate-800">Smart Pharmacy Inventory (FIM)</h3>
     </div>
     <table className="w-full">
       <thead className="bg-slate-50">
         <tr>
           <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-left">SKU / Item</th>
           <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Stock Level</th>
           <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">AI Predicted Demand</th>
           <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Status</th>
         </tr>
       </thead>
       <tbody className="divide-y divide-slate-100">
         {MOCK_INVENTORY.map(item => (
           <tr key={item.id} className="hover:bg-slate-50">
             <td className="p-4">
               <p className="font-medium text-slate-900">{item.name}</p>
               <p className="text-xs text-slate-500">{item.sku} | Exp: {item.expiryDate}</p>
             </td>
             <td className="p-4 text-center font-mono text-sm">{item.stockLevel}</td>
             <td className="p-4 text-center">
               <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-medium border border-amber-100">
                 <Activity size={12} /> {item.predictedDemand} units
               </span>
             </td>
             <td className="p-4 text-center">
               {item.stockLevel < item.reorderPoint ? (
                  <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 shadow-sm">
                    Auto-Order Created
                  </button>
               ) : (
                 <span className="text-xs text-green-600 font-medium flex items-center justify-center gap-1">
                   <CheckCircle size={12} /> Healthy
                 </span>
               )}
             </td>
           </tr>
         ))}
       </tbody>
     </table>
  </div>
);

// --- Main App Component ---
export default function App() {
  const [currentModule, setCurrentModule] = useState<ModuleType>(ModuleType.DASHBOARD);

  const renderModule = () => {
    switch (currentModule) {
      case ModuleType.DASHBOARD: return <DashboardView />;
      case ModuleType.EHR: return <EHRView />;
      case ModuleType.FINANCE: return <FinanceView />;
      case ModuleType.INVENTORY: return <InventoryView />;
      default: return <div className="p-10 text-center text-slate-400">Module under development</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar currentModule={currentModule} onNavigate={setCurrentModule} />
      
      <div className="flex-1 ml-72">
        <Header />
        
        <main className="mt-16 p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
          <div className="mb-6 flex items-baseline justify-between">
            <div>
              <h2 className="text-2xl font-bold font-serif text-slate-900 capitalize">
                {currentModule.replace('_', ' ').toLowerCase()}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {currentModule === ModuleType.DASHBOARD && "Real-time hospital operational overview."}
                {currentModule === ModuleType.FINANCE && "Core Financials with 3NF integrity and Anomaly Detection."}
                {currentModule === ModuleType.EHR && "Secure Patient Management with Clinical Context AI."}
              </p>
            </div>
            {currentModule === ModuleType.FINANCE && (
               <div className="text-xs font-mono text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded">
                 PostgreSQL Conn: Active (Read-Only Replica)
               </div>
            )}
          </div>

          {renderModule()}
        </main>
      </div>
    </div>
  );
}