import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

const INITIAL_CLUBS = [
  {
    id: '1',
    name: 'Coding Club',
    description: 'Learn programming and build amazing projects',
    facultyId: 'faculty1',
    facultyName: 'Dr. Smith',
    department: 'Computer Science',
    activities: ['Hackathons', 'Workshops', 'Code Reviews'],
    members: []
  },
  {
    id: '2',
    name: 'Robotics Club',
    description: 'Design and build robots for competitions',
    facultyId: 'faculty2',
    facultyName: 'Prof. Johnson',
    department: 'Computer Science',
    activities: ['Robot Building', 'Competitions', 'Arduino Projects'],
    members: []
  }
];

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [eventRegistrations, setEventRegistrations] = useState([]);

  useEffect(() => {
    const storedClubs = localStorage.getItem('clubs');
    if (storedClubs) {
      setClubs(JSON.parse(storedClubs));
    } else {
      setClubs(INITIAL_CLUBS);
      localStorage.setItem('clubs', JSON.stringify(INITIAL_CLUBS));
    }

    const storedEvents = localStorage.getItem('events');
    if (storedEvents) setEvents(JSON.parse(storedEvents));

    const storedRequests = localStorage.getItem('joinRequests');
    if (storedRequests) setJoinRequests(JSON.parse(storedRequests));

    const storedRegistrations = localStorage.getItem('eventRegistrations');
    if (storedRegistrations) setEventRegistrations(JSON.parse(storedRegistrations));
  }, []);

  const saveToStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const createClub = (clubData) => {
    const newClub = {
      id: Date.now().toString(),
      ...clubData,
      members: [],
      createdAt: new Date().toISOString()
    };
    const updated = [...clubs, newClub];
    setClubs(updated);
    saveToStorage('clubs', updated);
    return newClub;
  };

  const updateClub = (clubId, updates) => {
    const updated = clubs.map(c => c.id === clubId ? { ...c, ...updates } : c);
    setClubs(updated);
    saveToStorage('clubs', updated);
  };

  const deleteClub = (clubId) => {
    const updated = clubs.filter(c => c.id !== clubId);
    setClubs(updated);
    saveToStorage('clubs', updated);
  };

  const createEvent = (eventData) => {
    const newEvent = {
      id: Date.now().toString(),
      ...eventData,
      status: user?.role === 'hod' ? 'approved' : 'pending',
      participants: [],
      createdAt: new Date().toISOString()
    };
    const updated = [...events, newEvent];
    setEvents(updated);
    saveToStorage('events', updated);
    return newEvent;
  };

  const updateEvent = (eventId, updates) => {
    const updated = events.map(e => e.id === eventId ? { ...e, ...updates } : e);
    setEvents(updated);
    saveToStorage('events', updated);
  };

  const deleteEvent = (eventId) => {
    const updated = events.filter(e => e.id !== eventId);
    setEvents(updated);
    saveToStorage('events', updated);
  };

  const requestJoinClub = (clubId) => {
    const newRequest = {
      id: Date.now().toString(),
      clubId,
      studentId: user.id,
      studentName: user.name,
      studentEmail: user.email,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const updated = [...joinRequests, newRequest];
    setJoinRequests(updated);
    saveToStorage('joinRequests', updated);
  };

  const updateJoinRequest = (requestId, status) => {
    const request = joinRequests.find(r => r.id === requestId);
    if (status === 'approved' && request) {
      const clubIndex = clubs.findIndex(c => c.id === request.clubId);
      if (clubIndex !== -1) {
        const updatedClubs = [...clubs];
        updatedClubs[clubIndex].members = [
          ...(updatedClubs[clubIndex].members || []),
          { id: request.studentId, name: request.studentName, email: request.studentEmail }
        ];
        setClubs(updatedClubs);
        saveToStorage('clubs', updatedClubs);
      }
    }

    const updated = joinRequests.map(r =>
      r.id === requestId ? { ...r, status, updatedAt: new Date().toISOString() } : r
    );
    setJoinRequests(updated);
    saveToStorage('joinRequests', updated);
  };

  const registerForEvent = (eventId) => {
    const newRegistration = {
      id: Date.now().toString(),
      eventId,
      studentId: user.id,
      studentName: user.name,
      studentEmail: user.email,
      createdAt: new Date().toISOString()
    };
    const updated = [...eventRegistrations, newRegistration];
    setEventRegistrations(updated);
    saveToStorage('eventRegistrations', updated);

    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
      const updatedEvents = [...events];
      updatedEvents[eventIndex].participants = [
        ...(updatedEvents[eventIndex].participants || []),
        { id: user.id, name: user.name, email: user.email }
      ];
      setEvents(updatedEvents);
      saveToStorage('events', updatedEvents);
    }
  };

  return (
    <DataContext.Provider
      value={{
        clubs,
        events,
        joinRequests,
        eventRegistrations,
        createClub,
        updateClub,
        deleteClub,
        createEvent,
        updateEvent,
        deleteEvent,
        requestJoinClub,
        updateJoinRequest,
        registerForEvent
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
