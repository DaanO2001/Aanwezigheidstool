import React, { useEffect, useState, useRef } from 'react';
import { Loader2, UserCheck, ArrowRight, Users, LogOut, Search, ChevronDown } from 'lucide-react';

interface WelcomeScreenProps {
  employees: string[];
  onCheckIn: (name: string, action: 'Inchecken' | 'Uitchecken') => Promise<void>;
  onGoToAdmin: () => void;
  onViewPresence: () => void;
  isSubmitting: boolean;
  activeUsers: Map<string, string>;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ employees, onCheckIn, onGoToAdmin, onViewPresence, isSubmitting, activeUsers }) => {
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('Welkom');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter employees based on search input
  const filteredEmployees = employees.filter(emp => 
    emp.toLowerCase().includes(name.toLowerCase())
  );

  // Check if the current name is in the activeUsers map
  const isAlreadyCheckedIn = name.trim().length > 0 && activeUsers.has(name.trim().toLowerCase());

  useEffect(() => {
    // Check URL parameters for ?naam=Jan
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get('naam');
    
    if (nameParam) {
      setName(nameParam);
      setGreeting(`Hoi ${nameParam}`);
    } else {
      const hours = new Date().getHours();
      if (hours < 12) setGreeting('Goedemorgen');
      else if (hours < 18) setGreeting('Goedemiddag');
      else setGreeting('Goedenavond');
    }

    // Click outside handler to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && !isAlreadyCheckedIn) {
      onCheckIn(name, 'Inchecken');
    }
  };

  const handleCheckOut = () => {
    if (name.trim()) {
      onCheckIn(name, 'Uitchecken');
    }
  };

  const handleSelectName = (selectedName: string) => {
    setName(selectedName);
    setIsDropdownOpen(false);
    setGreeting(`Hoi ${selectedName.split(' ')[0]}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 w-full max-w-md mx-auto fade-in">
      <div className="w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <UserCheck className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {greeting}!
          </h1>
          <p className="text-slate-500">
            Klaar om aan de slag te gaan?<br />Meld je hieronder aan of af.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 relative">
          
          {/* Searchable Dropdown */}
          <div className="space-y-2 relative" ref={dropdownRef}>
            <label htmlFor="name" className="text-sm font-medium text-slate-700 ml-1">
              Zoek je naam
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setIsDropdownOpen(true);
                  if (e.target.value === '') setGreeting('Welkom');
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Typ om te zoeken..."
                autoComplete="off"
                className="block w-full pl-11 pr-10 py-5 rounded-2xl bg-slate-100 border-2 border-transparent text-slate-900 placeholder-slate-400 text-lg font-medium transition-all duration-300 ease-out hover:bg-white hover:border-emerald-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none disabled:opacity-50"
                disabled={isSubmitting}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                 <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 max-h-60 overflow-y-auto overflow-x-hidden scrollbar-thin">
                {filteredEmployees.length > 0 ? (
                  <ul className="py-2">
                    {filteredEmployees.map((emp) => (
                      <li 
                        key={emp}
                        onClick={() => handleSelectName(emp)}
                        className="px-4 py-3 hover:bg-emerald-50 cursor-pointer text-slate-700 hover:text-emerald-700 font-medium transition-colors flex items-center justify-between group"
                      >
                        {emp}
                        {activeUsers.has(emp.toLowerCase()) && (
                          <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full">Aanwezig</span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-4 text-slate-400 text-center text-sm">
                    Geen medewerkers gevonden.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3">
            {/* INCHECKEN KNOP */}
            <button
              type="submit"
              disabled={!name.trim() || isSubmitting || isAlreadyCheckedIn}
              className={`
                group relative w-full flex justify-center py-4 px-4 border border-transparent 
                text-lg font-semibold rounded-xl text-white transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
                ${!name.trim() || isSubmitting || isAlreadyCheckedIn 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200' 
                    : 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transform hover:-translate-y-0.5'
                }
              `}
            >
              {isSubmitting && !isAlreadyCheckedIn ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Even geduld...
                </span>
              ) : isAlreadyCheckedIn ? (
                <span className="flex items-center">
                  <UserCheck className="mr-2 h-5 w-5 opacity-50" />
                  Reeds aanwezig
                </span>
              ) : (
                <span className="flex items-center">
                  Meld mij aanwezig
                  <ArrowRight className="ml-2 h-5 w-5 opacity-70 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>

            {/* UITCHECKEN KNOP */}
            <button
              type="button"
              onClick={handleCheckOut}
              disabled={!name.trim() || isSubmitting || !isAlreadyCheckedIn}
              className={`
                group w-full flex justify-center py-3.5 px-4 border-2 
                text-base font-semibold rounded-xl transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                ${!isAlreadyCheckedIn 
                  ? 'border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50' 
                  : 'border-red-100 text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-200 hover:shadow-md'
                }
              `}
            >
              {isSubmitting && isAlreadyCheckedIn ? (
                <span className="flex items-center">
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Even geduld...
                </span>
              ) : (
                <span className="flex items-center">
                    <LogOut className={`mr-2 h-5 w-5 ${!isAlreadyCheckedIn ? 'opacity-30' : 'opacity-100'}`} />
                    Meld mij af
                </span>
              )}
            </button>
          </div>
          
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink-0 mx-4 text-slate-300 text-xs uppercase">Of</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <button
            type="button"
            onClick={onViewPresence}
            className="w-full flex justify-center py-3 px-4 border border-slate-200 text-base font-medium rounded-xl text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
          >
            <Users className="mr-2 h-5 w-5 text-slate-500" />
            Wie is er aanwezig?
          </button>
        </form>

        {/* Footer Admin Link */}
        <div className="pt-2 text-center">
          <button 
            onClick={onGoToAdmin}
            className="text-xs text-slate-400 hover:text-emerald-600 transition-colors font-medium"
          >
            Admin Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;