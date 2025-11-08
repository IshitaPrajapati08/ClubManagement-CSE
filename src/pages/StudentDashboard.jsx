import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { clubs, events, joinRequests, eventRegistrations, requestJoinClub, registerForEvent } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all');

  const myClubs = clubs.filter(club => club.members?.some(m => String(m.id) === String(user.id)));
  const myRequests = joinRequests.filter(r => r.studentId === user.id);
  const myEvents = eventRegistrations.filter(r => r.studentId === user.id);
  const approvedEvents = events.filter(e => e.status === 'approved');

  const handleJoinClub = (clubId) => {
    const alreadyRequested = joinRequests.some(
      r => r.clubId === clubId && r.studentId === user.id && r.status === 'pending'
    );

    if (alreadyRequested) {
      toast({ title: 'Already Requested', description: 'You already requested to join', variant: 'destructive' });
      return;
    }

    const alreadyMember = clubs.find(c => c.id === clubId)?.members?.some(m => m.id === user.id);
    if (alreadyMember) {
      toast({ title: 'Already a Member', description: 'You are already in this club', variant: 'destructive' });
      return;
    }

    requestJoinClub(clubId);
    toast({ title: 'Request Sent', description: 'Faculty will review your request' });
  };

  const handleRegisterEvent = (eventId) => {
    const alreadyRegistered = myEvents.some(m => m.eventId === eventId);

    if (alreadyRegistered) {
      toast({ title: 'Already Registered', description: 'You are already registered', variant: 'destructive' });
      return;
    }

    registerForEvent(eventId);
    toast({ title: 'Registration Successful', description: 'Enjoy the event!' });
  };

  return (
    <div className="min-h-screen bg-white text-black">
      
      {/* Header */}
      <header className="border-b bg-blue-600 text-white shadow-sm">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-white/80 mt-1">Welcome, {user.name}</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => { logout(); navigate('/'); }}
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
          >
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </header>

      {/* Main Tabs */}
      <main className="container mx-auto px-6 py-8">
        <div className="flex gap-3 mb-8 overflow-auto">
          {[
            { key: 'all', label: 'All Clubs' },
            { key: 'my', label: `My Clubs (${myClubs.length})` },
            { key: 'events', label: 'Events' },
            { key: 'requests', label: 'My Requests' }
          ].map((t) => (
            <Button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                activeTab === t.key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-blue-200'
              }`}
            >
              {t.label}
            </Button>
          ))}
        </div>

        {/* ✅ All Clubs */}
        {activeTab === 'all' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clubs
              .filter(club => !club.members?.some(m => m.id === user.id))
              .map(club => (
              <Card key={club.id} className="shadow-lg rounded-xl border border-blue-100">
                <CardHeader>
                  <CardTitle className="font-bold text-blue-700">{club.name}</CardTitle>
                  <CardDescription>{club.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  
                  {/* Faculty Mentor */}
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Users className="w-4 h-4" /> Faculty Mentor: {club.facultyName}
                  </div>

                  {/* Member Count */}
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Users className="w-4 h-4" /> {club.members?.length || 0} Active Members
                  </div>

                  {/* Activities Tags */}
                  {club.activities?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {club.activities.map((act, index) => (
                        <Badge key={index} className="bg-blue-100 text-blue-700">
                          {act}
                        </Badge>
                      ))}
                    </div>
                  )}

                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost">View</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{club.name}</DialogTitle>
                            <DialogDescription>{club.description}</DialogDescription>
                          </DialogHeader>
                          <div className="mt-4 space-y-3">
                            <div className="text-sm"><strong>Faculty Mentor:</strong> {club.facultyName}</div>
                            <div className="text-sm"><strong>Department:</strong> {club.department || 'N/A'}</div>
                            <div className="text-sm"><strong>Activities:</strong> {club.activities?.join(', ') || 'None'}</div>
                            <div className="text-sm"><strong>Members ({club.members?.length || 0}):</strong>
                              <div className="mt-2 space-y-1">
                                {club.members?.length > 0 ? club.members.map(m => (
                                  <div key={m.id} className="text-sm text-muted-foreground">{m.name} ({m.email})</div>
                                )) : <div className="text-sm text-muted-foreground">No members yet</div>}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Button onClick={() => { handleJoinClub(club.id); }} disabled={myClubs.some(c => c.id === club.id)}>
                              {myClubs.some(c => c.id === club.id) ? 'Joined ✅' : 'Join Club'}
                            </Button>
                            <Button variant="secondary" onClick={() => { /* close handled by Dialog component automatically */ }}>
                              Close
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        onClick={() => handleJoinClub(club.id)}
                        disabled={myClubs.some(c => c.id === club.id)}
                        className={`w-full ${
                          myClubs.some(c => c.id === club.id)
                            ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {myClubs.some(c => c.id === club.id) ? 'Joined ✅' : 'Join Club'}
                      </Button>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ✅ Events */}
  {activeTab === 'events' && (
          <div className="grid gap-6 md:grid-cols-2">
            {approvedEvents.map(event => {
              const club = clubs.find(c => c.id === event.clubId);
              const registered = myEvents.some(m => m.eventId === event.id);

              return (
                <Card key={event.id} className="shadow-lg rounded-xl border border-blue-100">
                  <CardHeader>
                    <CardTitle className="font-bold text-blue-700">{event.title}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-gray-600 text-sm">{club?.name}</p>
                    <p className="text-gray-600 text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> {new Date(event.date).toLocaleDateString()}
                    </p>

                    <Button
                      onClick={() => handleRegisterEvent(event.id)}
                      disabled={registered}
                      className={`w-full ${
                        registered
                          ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {registered ? 'Registered ✅' : 'Register'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* ✅ My Requests */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {myRequests.length > 0 ? myRequests.map(req => {
              const club = clubs.find(c => c.id === req.clubId);
              return (
                <Card key={req.id} className="rounded-xl shadow-md p-4 border border-blue-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-blue-700">{club?.name}</h3>
                    <p className="text-xs text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge className="px-3 py-1 capitalize">
                    {req.status}
                  </Badge>
                </Card>
              );
            }) : (
              <p className="text-gray-500 text-center">No requests yet 🚫</p>
            )}
          </div>
        )}

        {activeTab === 'my' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myClubs.length > 0 ? myClubs.map(club => (
              <Card key={club.id} className="shadow-lg rounded-xl border border-blue-100">
                <CardHeader>
                  <CardTitle className="font-bold text-blue-700">{club.name}</CardTitle>
                  <CardDescription>{club.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Users className="w-4 h-4" /> Faculty Mentor: {club.facultyName}
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Users className="w-4 h-4" /> {club.members?.length || 0} Active Members
                  </div>

                  {club.activities?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {club.activities.map((act, index) => (
                        <Badge key={index} className="bg-blue-100 text-blue-700">{act}</Badge>
                      ))}
                    </div>
                  )}

                  <Button
                    disabled
                    className="w-full mt-3 bg-gray-300 text-gray-700 cursor-not-allowed"
                  >
                    Joined ✅
                  </Button>
                </CardContent>
              </Card>
            )) : (
              <p className="text-gray-500 text-center">No joined clubs yet.</p>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default StudentDashboard;
