import React, { useEffect, useState } from 'react';
import { ArrowLeft, Users, Clock, Loader2, Search, Circle } from 'lucide-react';
import { getAttendees } from '../services/attendanceService';
import { Attendee } from '../types';

interface PresenceScreenProps {
  onBack: () => void;
  localAttendees?: Attendee[];
  employees: string[];
}

interface EmployeeStatus {
    name: string;
    isPresent: boolean;
    time?: string;
}

const PresenceScreen: React.FC<PresenceScreenProps> = ({ onBack, localAttendees = [], employees }) => {
  const [employeeStatuses, setEmployeeStatuses] = useState<EmployeeStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // 1. Haal alle check-ins op (remote + lokaal)
      const remoteData = await getAttendees();
      
      // Map maken van aanwezigen voor snelle lookup (case insensitive)
      const presentMap = new Map<string, string>();
      
      // Voeg lokale toe (voorrang voor instant feedback)
      localAttendees.forEach(a => presentMap.set(a.naam.toLowerCase(), a.tijdstip));
      
      // Voeg remote toe (als ze er nog niet in staan of om aan te vullen)
      remoteData.forEach(a => {
        if (!presentMap.has(a.naam.toLowerCase())) {
            presentMap.set(a.naam.toLowerCase(), a.tijdstip);
        }
      });

      // 2. Bouw de statuslijst en SORTEER deze direct
      const statuses: EmployeeStatus[] = employees.map(empName => {
        const time = presentMap.get(empName.toLowerCase());
        return {
            name: empName,
            isPresent: !!time,
            time: time
        };
      }).sort((a, b) => {
        // Primaire sortering: Aanwezigheid (Aanwezig komt eerst/bovenaan)
        if (a.isPresent && !b.isPresent) return -1;
        if (!a.isPresent && b.isPresent) return 1;
        
        // Secundaire sortering: Als status gelijk is, behoud originele volgorde (op achternaam)
        // De employees prop is al gesorteerd op achternaam in App.tsx of constants,
        // dus we kunnen vertrouwen op de index map als ze gelijk zijn, of hier expliciet sorteren.
        // Omdat de .map() de originele volgorde behoudt, is return 0 voldoende.
        return 0;
      });

      setEmployeeStatuses(statuses);
      setLoading(false);
    };
    loadData();
  }, [localAttendees, employees]);

  // Filter op zoekterm
  const filteredList = employeeStatuses.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const presentCount = employeeStatuses.filter(e => e.isPresent).length;

  return (
    <div className="flex flex-col min-h-screen p-6 md:p-12 fade-in">
      <div className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack} 
            className="group flex items-center text-slate-700 hover:text-emerald-800 transition-colors font-medium bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-8 border-b border-slate-50 bg-gradient-to-br from-white to-slate-50/50">
                <div className="flex items-center gap-4 mb-2">
                    <div className="bg-emerald-100 p-3 rounded-2xl">
                        <Users className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Personeelslijst</h1>
                        <p className="text-slate-500 text-sm">Status overzicht ({presentCount} aanwezig)</p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="px-8 py-4 border-b border-slate-50 shrink-0">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Zoek in lijst..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder-slate-400"
                    />
                 </div>
            </div>

            <div className="overflow-y-auto grow">
                {loading ? (
                    <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-3 text-emerald-500" />
                        <span className="text-sm">Gegevens ophalen...</span>
                    </div>
                ) : filteredList.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <p>Geen medewerker gevonden.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-50">
                        {filteredList.map((emp, index) => (
                            <li key={index} className="p-4 px-8 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shadow-inner ${emp.isPresent ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                        {emp.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className={`font-semibold ${emp.isPresent ? 'text-slate-900' : 'text-slate-500'}`}>{emp.name}</p>
                                        <div className={`flex items-center text-xs font-medium mt-0.5 ${emp.isPresent ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            {emp.isPresent ? (
                                                <>
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                                                    Aanwezig
                                                </>
                                            ) : (
                                                <>
                                                    <span className="w-2 h-2 rounded-full bg-slate-300 mr-2"></span>
                                                    Afwezig
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {emp.isPresent ? (
                                    <div className="text-xs text-slate-500 font-medium flex items-center bg-white px-2 py-1 rounded-lg border border-slate-100 group-hover:border-slate-200 transition-colors">
                                        <Clock className="w-3 h-3 mr-1.5 text-emerald-500" />
                                        {new Date(emp.time!).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                ) : (
                                    <div className="text-xs text-slate-300 font-medium px-2 py-1">
                                        --:--
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
            <div className="bg-slate-50 p-4 px-8 border-t border-slate-100 shrink-0">
                <p className="text-xs text-center text-slate-400">
                    Totaal medewerkers in lijst: {employees.length}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PresenceScreen;