import React, { useState } from 'react';
import { Lock, ArrowLeft, Clock, ShieldAlert, CheckCircle2, LogOut, Users, Plus, Trash2, Search, X, AlertCircle } from 'lucide-react';
import { CheckInLog } from '../types';

interface AdminDashboardProps {
  logs: CheckInLog[];
  employees: string[];
  onAddEmployee: (name: string) => void;
  onRemoveEmployee: (name: string) => void;
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ logs, employees, onAddEmployee, onRemoveEmployee, onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Management State
  const [activeTab, setActiveTab] = useState<'logs' | 'employees'>('logs');
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [addEmployeeError, setAddEmployeeError] = useState('');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Ongeldig wachtwoord');
      setPassword('');
    }
  };

  const formatName = (name: string) => {
    // Zet alles naar lowercase en maak de eerste letter van elk woord een hoofdletter
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddEmployeeError(''); // Reset error

    const rawName = newEmployeeName.trim();
    
    if (!rawName) return;

    // Validatie: Check of er een spatie is (dus voor- en achternaam)
    if (rawName.indexOf(' ') === -1) {
        setAddEmployeeError('Voer zowel een voor- als achternaam in.');
        return;
    }

    // Format de naam en voeg toe
    const formattedName = formatName(rawName);
    onAddEmployee(formattedName);
    setNewEmployeeName('');
  };

  // Filter employees for management list
  const filteredEmployees = employees.filter(emp => 
    emp.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 w-full max-w-md mx-auto fade-in">
        <button onClick={onBack} className="self-start mb-8 text-slate-700 hover:text-slate-900 flex items-center bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Terug
        </button>

        <div className="bg-white w-full p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 text-center">
          <div className="mx-auto bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Toegang</h2>
          <p className="text-slate-500 mb-8">Beveiligde omgeving</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-slate-700 ml-1">Wachtwoord</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent text-slate-900 placeholder-slate-400 text-lg font-medium transition-all duration-300 ease-out hover:bg-white hover:border-emerald-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
                    placeholder="Voer wachtwoord in"
                    autoFocus
                    />
                </div>
            </div>
            
            {error && (
              <div className="text-red-500 text-sm flex items-center justify-center bg-red-50 py-2 rounded-lg">
                <ShieldAlert className="w-4 h-4 mr-2" /> {error}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
            >
              Inloggen
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <button onClick={onBack} className="text-slate-700 hover:text-slate-900 flex items-center font-medium bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm self-start">
            <ArrowLeft className="w-5 h-5 mr-2" /> Terug naar App
          </button>
          <div className="md:text-right">
            <h1 className="text-2xl font-bold text-slate-900">Beheer Dashboard</h1>
            <p className="text-slate-600 text-sm">Beheer logs en medewerkers</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-white/60 backdrop-blur-md rounded-2xl mb-8 border border-slate-200 shadow-sm w-full md:w-fit">
            <button 
                onClick={() => setActiveTab('logs')}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'logs' 
                    ? 'bg-white text-slate-900 shadow-md shadow-slate-200/50' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                }`}
            >
                <div className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    Logboek
                </div>
            </button>
            <button 
                onClick={() => setActiveTab('employees')}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'employees' 
                    ? 'bg-white text-emerald-700 shadow-md shadow-slate-200/50' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                }`}
            >
                 <div className="flex items-center justify-center gap-2">
                    <Users className="w-4 h-4" />
                    Medewerkers
                </div>
            </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          {/* TAB: LOGS */}
          {activeTab === 'logs' && (
            <>
                {logs.length === 0 ? (
                    <div className="p-16 text-center text-slate-400 flex flex-col items-center">
                        <Clock className="w-12 h-12 mb-4 opacity-20" />
                        <p>Nog geen check-ins geregistreerd in deze sessie.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tijdstip</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Naam</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actie</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-sm font-mono">
                                {log.timestamp.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs mr-3 ${log.action === 'Inchecken' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {log.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium text-slate-900">{log.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    {log.action === 'Inchecken' ? (
                                        <div className="flex items-center text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg text-xs font-medium border border-emerald-100">
                                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                            In
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200">
                                            <LogOut className="w-3.5 h-3.5 mr-1.5" />
                                            Uit
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                log.status === 'success' ? 'text-emerald-600' : 'text-red-600'
                                }`}>
                                {log.status === 'success' ? '● OK' : '● Fout'}
                                </span>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                )}
            </>
          )}

          {/* TAB: EMPLOYEES */}
          {activeTab === 'employees' && (
             <div className="flex flex-col h-full">
                {/* Add New Section */}
                <div className="p-6 bg-slate-50/50 border-b border-slate-100">
                    <form onSubmit={handleAddSubmit} className="flex flex-col gap-3">
                        <div className="flex gap-3 items-stretch">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Users className="h-5 w-5 text-slate-400" />
                                </div>
                                <input 
                                    type="text"
                                    value={newEmployeeName}
                                    onChange={(e) => {
                                        setNewEmployeeName(e.target.value);
                                        if (addEmployeeError) setAddEmployeeError('');
                                    }}
                                    placeholder="Nieuwe medewerker naam..."
                                    className={`block w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-100 border-2 text-slate-900 placeholder-slate-400 text-lg font-medium transition-all duration-300 ease-out hover:bg-white focus:bg-white focus:outline-none ${
                                        addEmployeeError 
                                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
                                        : 'border-transparent hover:border-emerald-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'
                                    }`}
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={!newEmployeeName.trim()}
                                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-2xl font-semibold text-lg flex items-center transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30"
                            >
                                <Plus className="w-6 h-6 mr-1" />
                                <span className="hidden md:inline">Toevoegen</span>
                                <span className="md:hidden">Add</span>
                            </button>
                        </div>
                        {addEmployeeError && (
                            <div className="flex items-center text-red-500 text-sm px-2 animate-in slide-in-from-top-1 fade-in duration-200">
                                <AlertCircle className="w-4 h-4 mr-1.5" />
                                {addEmployeeError}
                            </div>
                        )}
                    </form>
                </div>

                {/* List Header & Search */}
                <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">Huidige lijst ({employees.length})</h3>
                    <div className="relative w-48 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            value={employeeSearch}
                            onChange={(e) => setEmployeeSearch(e.target.value)}
                            placeholder="Zoeken..." 
                            className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                </div>

                {/* List Content */}
                <div className="overflow-y-auto max-h-[60vh]">
                    <ul className="divide-y divide-slate-50">
                        {filteredEmployees.map((emp) => (
                            <li key={emp} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 group transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">
                                        {emp.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-slate-700 font-medium">{emp}</span>
                                </div>
                                
                                {deleteConfirm === emp ? (
                                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                                        <span className="text-xs text-red-600 font-medium hidden md:inline">Zeker weten?</span>
                                        <button 
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onRemoveEmployee(emp);
                                                setDeleteConfirm(null);
                                            }}
                                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors shadow-sm"
                                            title="Ja, verwijderen"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteConfirm(null);
                                            }}
                                            className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition-colors shadow-sm"
                                            title="Annuleren"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteConfirm(emp);
                                        }}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                        title="Verwijderen"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                    {filteredEmployees.length === 0 && (
                        <div className="p-8 text-center text-slate-400 italic text-sm">
                            Geen medewerkers gevonden.
                        </div>
                    )}
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;