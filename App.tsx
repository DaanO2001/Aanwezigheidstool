import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import SuccessScreen from './components/SuccessScreen';
import AdminDashboard from './components/AdminDashboard';
import PresenceScreen from './components/PresenceScreen';
import { sendCheckIn } from './services/attendanceService';
import { CheckInLog, ScreenState, Attendee } from './types';
import { EMPLOYEES as DEFAULT_EMPLOYEES } from './constants';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('welcome');
  const [logs, setLogs] = useState<CheckInLog[]>([]);
  
  // Medewerkers State met LocalStorage persistence
  const [employees, setEmployees] = useState<string[]>(() => {
    const saved = localStorage.getItem('employees');
    return saved ? JSON.parse(saved) : DEFAULT_EMPLOYEES;
  });

  // We gebruiken een Map om de actieve status bij te houden (Naam -> Tijdstip)
  const [activeUsers, setActiveUsers] = useState<Map<string, string>>(new Map());
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastAction, setLastAction] = useState<'Inchecken' | 'Uitchecken'>('Inchecken');

  // Update LocalStorage als employees wijzigt
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  // Functies voor medewerker beheer
  const handleAddEmployee = (name: string) => {
    if (!employees.includes(name)) {
        const newList = [...employees, name].sort((a, b) => {
            const lastNameA = a.split(' ').slice(-1)[0];
            const lastNameB = b.split(' ').slice(-1)[0];
            return lastNameA.localeCompare(lastNameB);
        });
        setEmployees(newList);
    }
  };

  const handleRemoveEmployee = (name: string) => {
    setEmployees(prev => prev.filter(emp => emp !== name));
    // Ook verwijderen uit actieve sessies als ze daar in staan
    setActiveUsers(prev => {
        const newMap = new Map(prev);
        if (newMap.has(name.toLowerCase())) {
            newMap.delete(name.toLowerCase());
        }
        return newMap;
    });
  };

  const handleAttendance = async (name: string, action: 'Inchecken' | 'Uitchecken') => {
    setIsSubmitting(true);
    setLastAction(action);
    
    // Call the service to send data to Google Sheets
    const success = await sendCheckIn(name, action);
    
    const timestamp = new Date();

    // Update local logs for Admin Dashboard
    const newLog: CheckInLog = {
      id: Date.now().toString(),
      name,
      timestamp: timestamp,
      status: success ? 'success' : 'error',
      action: action
    };
    setLogs(prev => [newLog, ...prev]);

    // Update Active Users list
    if (success || !success) { 
        setActiveUsers(prev => {
            const newMap = new Map(prev);
            if (action === 'Inchecken') {
                newMap.set(name.toLowerCase(), timestamp.toISOString());
            } else {
                newMap.delete(name.toLowerCase());
            }
            return newMap;
        });
    }

    setIsSubmitting(false);
    setCurrentScreen('success');
  };

  const getLocalAttendees = (): Attendee[] => {
    const attendees: Attendee[] = [];
    activeUsers.forEach((tijdstip, naamKey) => {
        const originalName = logs.find(l => l.name.toLowerCase() === naamKey)?.name || naamKey;
        attendees.push({ naam: originalName, tijdstip });
    });
    return attendees;
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen 
            employees={employees}
            onCheckIn={handleAttendance} 
            onGoToAdmin={() => setCurrentScreen('admin')}
            onViewPresence={() => setCurrentScreen('presence')}
            isSubmitting={isSubmitting}
            activeUsers={activeUsers}
          />
        );
      case 'success':
        return (
          <SuccessScreen 
            onReset={() => setCurrentScreen('welcome')} 
            action={lastAction}
          />
        );
      case 'admin':
        return (
            <AdminDashboard 
                logs={logs} 
                employees={employees}
                onAddEmployee={handleAddEmployee}
                onRemoveEmployee={handleRemoveEmployee}
                onBack={() => setCurrentScreen('welcome')} 
            />
        );
      case 'presence':
        return (
          <PresenceScreen 
            employees={employees}
            onBack={() => setCurrentScreen('welcome')} 
            localAttendees={getLocalAttendees()}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen transition-colors duration-500">
      {renderScreen()}
    </div>
  );
};

export default App;