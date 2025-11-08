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

// Initial clubs with Srushti as faculty
const INITIAL_CLUBS = [
  {
    id: '1',
    name: 'Coding Club',
    description: 'Learn programming and build amazing projects',
    facultyId: 'faculty1',
    facultyName: 'Srushti',
    department: 'CSE',
    activities: ['Hackathons', 'Workshops', 'Code Reviews'],
    members: []
  },
  {
    id: '2',
    name: 'Robotics Club',
    description: 'Design and build robots for competitions',
    facultyId: 'faculty2',
    facultyName: 'Srushti',
    department: 'CSE',
    activities: ['Robot Building', 'Competitions', 'Arduino Projects'],
    members: []
  }
];

// Sample initial event
const INITIAL_EVENTS = [
  {
    id: '101',
    clubId: '1',
    title: 'Treasure Hunt',
    description: 'A fun and challenging treasure hunt event for all students.',
    date: new Date().toISOString(),
    status: 'approved',
    participants: [],
    createdAt: new Date().toISOString()
  }
];

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [eventRegistrations, setEventRegistrations] = useState([]);

  // Save helper
  const saveToStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    // fetch server data; fall back to local initial data when server unreachable
    const token = localStorage.getItem('token');

    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const fetchAll = async () => {
      try {
        const [clubsRes, eventsRes, joinRes, regsRes] = await Promise.all([
          fetch(`${API_URL}/api/clubs`, { headers }),
          fetch(`${API_URL}/api/events`, { headers }),
          fetch(`${API_URL}/api/join-requests`, { headers }),
          fetch(`${API_URL}/api/registrations`, { headers })
        ]);

        if (clubsRes.ok) {
          const cjson = await clubsRes.json();
          const serverClubs = (cjson.clubs || []).map(c => ({ ...c, id: c._id || c.id }));
          setClubs(serverClubs);
          saveToStorage('clubs', serverClubs);
        } else {
          setClubs(INITIAL_CLUBS);
          saveToStorage('clubs', INITIAL_CLUBS);
        }

        if (eventsRes.ok) {
          const ej = await eventsRes.json();
          const serverEvents = (ej.events || []).map(e => ({ ...e, id: e._id || e.id }));
          setEvents(serverEvents);
          saveToStorage('events', serverEvents);
        } else {
          setEvents(INITIAL_EVENTS);
          saveToStorage('events', INITIAL_EVENTS);
        }

        if (joinRes.ok) {
          const jr = await joinRes.json();
          const serverJR = (jr.joinRequests || []).map(r => ({ ...r, id: r._id || r.id }));
          setJoinRequests(serverJR);
          saveToStorage('joinRequests', serverJR);
        } else {
          const storedRequests = localStorage.getItem('joinRequests');
          if (storedRequests) setJoinRequests(JSON.parse(storedRequests));
        }

        if (regsRes.ok) {
          const rj = await regsRes.json();
          const serverRegs = (rj.registrations || []).map(r => ({ ...r, id: r._id || r.id }));
          setEventRegistrations(serverRegs);
          saveToStorage('eventRegistrations', serverRegs);
        } else {
          const storedRegistrations = localStorage.getItem('eventRegistrations');
          if (storedRegistrations) setEventRegistrations(JSON.parse(storedRegistrations));
        }
      } catch (err) {
        // fallback to local storage / initial data
        setClubs(INITIAL_CLUBS);
        saveToStorage('clubs', INITIAL_CLUBS);
        setEvents(INITIAL_EVENTS);
        saveToStorage('events', INITIAL_EVENTS);

        const storedRequests = localStorage.getItem('joinRequests');
        if (storedRequests) setJoinRequests(JSON.parse(storedRequests));

        const storedRegistrations = localStorage.getItem('eventRegistrations');
        if (storedRegistrations) setEventRegistrations(JSON.parse(storedRegistrations));
      }
    };

    fetchAll();

    // Poll server periodically so other users' actions (faculty approvals) show up
    // for this client without a full page refresh. Polling interval is 5s.
    const interval = setInterval(() => {
      fetchAll();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const createClub = (clubData) => {
    // POST to server if available
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/clubs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : undefined },
          body: JSON.stringify({ ...clubData, members: [] })
        });
        const d = await res.json();
        if (d.success) {
          const created = { ...d.club, id: d.club._id || d.club.id };
          const updated = [...clubs, created];
          setClubs(updated);
          saveToStorage('clubs', updated);
        }
      } catch (err) {
        // fallback
        const newClub = { id: Date.now().toString(), ...clubData, members: [], createdAt: new Date().toISOString() };
        const updated = [...clubs, newClub];
        setClubs(updated);
        saveToStorage('clubs', updated);
      }
    })();
  };

  const updateClub = (clubId, updates) => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/clubs/${clubId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : undefined },
          body: JSON.stringify(updates)
        });
        const d = await res.json();
        if (d.success) {
          const updated = clubs.map(c => (c.id === clubId ? { ...c, ...d.club, id: d.club._id || d.club.id } : c));
          setClubs(updated);
          saveToStorage('clubs', updated);
        }
      } catch (err) {
        const updated = clubs.map(c => c.id === clubId ? { ...c, ...updates } : c);
        setClubs(updated);
        saveToStorage('clubs', updated);
      }
    })();
  };

  const deleteClub = (clubId) => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/api/clubs/${clubId}`, { method: 'DELETE', headers: { Authorization: token ? `Bearer ${token}` : undefined } });
        const updated = clubs.filter(c => c.id !== clubId);
        setClubs(updated);
        saveToStorage('clubs', updated);
      } catch (err) {
        const updated = clubs.filter(c => c.id !== clubId);
        setClubs(updated);
        saveToStorage('clubs', updated);
      }
    })();
  };

  const createEvent = (eventData) => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const payload = { ...eventData, status: user?.role === 'hod' ? 'approved' : 'pending', participants: [], facultyId: user?.id, facultyName: user?.name };
        const res = await fetch(`${API_URL}/api/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : undefined },
          body: JSON.stringify(payload)
        });
        const d = await res.json();
        if (d.success) {
          const created = { ...d.event, id: d.event._id || d.event.id };
          const updated = [...events, created];
          setEvents(updated);
          saveToStorage('events', updated);
        }
      } catch (err) {
        const newEvent = { id: Date.now().toString(), ...eventData, status: user?.role === 'hod' ? 'approved' : 'pending', participants: [], createdAt: new Date().toISOString() };
        const updated = [...events, newEvent];
        setEvents(updated);
        saveToStorage('events', updated);
      }
    })();
  };

  const updateEvent = (eventId, updates) => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/events/${eventId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : undefined },
          body: JSON.stringify(updates)
        });
        const d = await res.json();
        if (d.success) {
          const updated = events.map(ev => (ev.id === eventId ? { ...ev, ...d.event, id: d.event._id || d.event.id } : ev));
          setEvents(updated);
          saveToStorage('events', updated);
        }
      } catch (err) {
        const updated = events.map(e => e.id === eventId ? { ...e, ...updates } : e);
        setEvents(updated);
        saveToStorage('events', updated);
      }
    })();
  };

  const deleteEvent = (eventId) => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/api/events/${eventId}`, { method: 'DELETE', headers: { Authorization: token ? `Bearer ${token}` : undefined } });
        const updated = events.filter(e => e.id !== eventId);
        setEvents(updated);
        saveToStorage('events', updated);
      } catch (err) {
        const updated = events.filter(e => e.id !== eventId);
        setEvents(updated);
        saveToStorage('events', updated);
      }
    })();
  };

  const requestJoinClub = (clubId) => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const payload = { clubId, studentId: user.id, studentName: user.name, studentEmail: user.email };
        const res = await fetch(`${API_URL}/api/join-requests`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : undefined },
          body: JSON.stringify(payload)
        });
        const d = await res.json();
        if (d.success) {
          const created = { ...d.joinRequest, id: d.joinRequest._id || d.joinRequest.id };
          const updated = [...joinRequests, created];
          setJoinRequests(updated);
          saveToStorage('joinRequests', updated);
        }
      } catch (err) {
        const newRequest = { id: Date.now().toString(), clubId, studentId: user.id, studentName: user.name, studentEmail: user.email, status: 'pending', createdAt: new Date().toISOString() };
        const updated = [...joinRequests, newRequest];
        setJoinRequests(updated);
        saveToStorage('joinRequests', updated);
      }
    })();
  };

  const updateJoinRequest = (requestId, status) => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/join-requests/${requestId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : undefined },
          body: JSON.stringify({ status })
        });
        const d = await res.json();
        if (d.success) {
          // normalize returned joinRequest
          const returned = { ...d.joinRequest, id: d.joinRequest._id || d.joinRequest.id };

          // update local joinRequests array
          const updated = joinRequests.map(r => (r.id === requestId || r._id === requestId) ? { ...r, ...returned } : r);
          // if the request wasn't previously present (edge case), ensure it's included
          const exists = updated.some(r => r.id === returned.id);
          const finalJoinRequests = exists ? updated : [...updated, returned];
          setJoinRequests(finalJoinRequests);
          saveToStorage('joinRequests', finalJoinRequests);

          if (status === 'approved') {
            // add to club members locally as well
            const jr = returned;
            // Refresh clubs from server to ensure consistent state (members, ids)
            try {
              const clubsRes = await fetch(`${API_URL}/api/clubs`, { headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : undefined } });
              if (clubsRes.ok) {
                const cj = await clubsRes.json();
                const serverClubs = (cj.clubs || []).map(c => ({ ...c, id: c._id || c.id }));
                setClubs(serverClubs);
                saveToStorage('clubs', serverClubs);
              } else {
                // fallback: try to update locally if server fetch fails
                const clubIndex = clubs.findIndex(c => c.id === returned.clubId || c._id === returned.clubId);
                if (clubIndex !== -1) {
                  const updatedClubs = [...clubs];
                  const members = updatedClubs[clubIndex].members || [];
                  const alreadyMember = members.some(m => m.id === returned.studentId || m.email === returned.studentEmail);
                  if (!alreadyMember) {
                    updatedClubs[clubIndex].members = [...members, { id: returned.studentId, name: returned.studentName, email: returned.studentEmail }];
                    setClubs(updatedClubs);
                    saveToStorage('clubs', updatedClubs);
                  }
                }
              }
            } catch (err) {
              // network or other error -> still attempt local update
              const clubIndex = clubs.findIndex(c => c.id === returned.clubId || c._id === returned.clubId);
              if (clubIndex !== -1) {
                const updatedClubs = [...clubs];
                const members = updatedClubs[clubIndex].members || [];
                const alreadyMember = members.some(m => m.id === returned.studentId || m.email === returned.studentEmail);
                if (!alreadyMember) {
                  updatedClubs[clubIndex].members = [...members, { id: returned.studentId, name: returned.studentName, email: returned.studentEmail }];
                  setClubs(updatedClubs);
                  saveToStorage('clubs', updatedClubs);
                }
              }
            }
          }
        }
      } catch (err) {
  const updated = joinRequests.map(r => r.id === requestId ? { ...r, status, updatedAt: new Date().toISOString() } : r);
  setJoinRequests(updated);
  saveToStorage('joinRequests', updated);
      }
    })();
  };

  const registerForEvent = (eventId) => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const payload = { eventId, studentId: user.id, studentName: user.name, studentEmail: user.email };
        const res = await fetch(`${API_URL}/api/registrations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : undefined },
          body: JSON.stringify(payload)
        });
        const d = await res.json();
        if (d.success) {
          const updated = [...eventRegistrations, d.registration];
          setEventRegistrations(updated);
          saveToStorage('eventRegistrations', updated);

          const eventIndex = events.findIndex(e => e.id === d.registration.eventId || e._id === d.registration.eventId);
          if (eventIndex !== -1) {
            const updatedEvents = [...events];
            updatedEvents[eventIndex].participants = [...(updatedEvents[eventIndex].participants || []), { id: d.registration.studentId, name: d.registration.studentName, email: d.registration.studentEmail }];
            setEvents(updatedEvents);
            saveToStorage('events', updatedEvents);
          }
        }
      } catch (err) {
        const newRegistration = { id: Date.now().toString(), eventId, studentId: user.id, studentName: user.name, studentEmail: user.email, createdAt: new Date().toISOString() };
        const updated = [...eventRegistrations, newRegistration];
        setEventRegistrations(updated);
        saveToStorage('eventRegistrations', updated);

        const eventIndex = events.findIndex(e => e.id === eventId);
        if (eventIndex !== -1) {
          const updatedEvents = [...events];
          updatedEvents[eventIndex].participants = [...(updatedEvents[eventIndex].participants || []), { id: user.id, name: user.name, email: user.email }];
          setEvents(updatedEvents);
          saveToStorage('events', updatedEvents);
        }
      }
    })();
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
