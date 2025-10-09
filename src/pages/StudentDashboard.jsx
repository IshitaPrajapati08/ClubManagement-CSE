import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Calendar, Users, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { clubs, events, joinRequests, eventRegistrations, requestJoinClub, registerForEvent } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();

  const myClubs = clubs.filter(club => club.members?.some(m => m.id === user.id));
  const myRequests = joinRequests.filter(r => r.studentId === user.id);
  const myEvents = eventRegistrations.filter(r => r.studentId === user.id);
  const approvedEvents = events.filter(e => e.status === 'approved');

  const handleJoinClub = (clubId) => {
    const alreadyRequested = joinRequests.some(
      r => r.clubId === clubId && r.studentId === user.id && r.status === 'pending'
    );

    if (alreadyRequested) {
      toast({ title: 'Already Requested', description: 'You have already requested to join this club', variant: 'destructive' });
      return;
    }

    const alreadyMember = clubs.find(c => c.id === clubId)?.members?.some(m => m.id === user.id);
    if (alreadyMember) {
      toast({ title: 'Already a Member', description: 'You are already a member of this club', variant: 'destructive' });
      return;
    }

    requestJoinClub(clubId);
    toast({ title: 'Request Sent', description: 'Your join request has been sent to the faculty' });
  };

  const handleRegisterEvent = (eventId) => {
    const alreadyRegistered = eventRegistrations.some(
      r => r.eventId === eventId && r.studentId === user.id
    );

    if (alreadyRegistered) {
      toast({ title: 'Already Registered', description: 'You are already registered for this event', variant: 'destructive' });
      return;
    }

    registerForEvent(eventId);
    toast({ title: 'Registration Successful', description: 'You have been registered for the event' });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-400 text-black">
      {/* Header */}
      <header className="border-b border-blue-500">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">Student Dashboard</h1>
            <p className="text-black/80 mt-1">Welcome, {user.name}!</p>
          </div>
          <Button 
            variant="secondary" 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white text-black hover:bg-gray-200"
          >
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {['All Clubs', `My Clubs (${myClubs.length})`, 'Events', 'My Requests'].map((tab, idx) => (
            <Button
              key={tab}
              variant="outline"
              className="flex-1 py-3 font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-black hover:from-blue-600 hover:to-blue-800"
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* All Clubs */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {clubs.map(club => (
            <Card key={club.id} className="hover:shadow-2xl transition-shadow rounded-xl">
              <CardHeader>
                <CardTitle className="text-black font-bold">{club.name}</CardTitle>
                <CardDescription className="text-black/80">{club.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-black/70">
                    <Users className="w-4 h-4" /> Faculty: {club.facultyName}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black/70">
                    <Users className="w-4 h-4" /> {club.members?.length || 0} members
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {club.activities?.map((activity, idx) => (
                      <Badge key={idx} variant="secondary">{activity}</Badge>
                    ))}
                  </div>
                  <Button
                    className={`w-full py-2 rounded-xl font-semibold ${
                      myClubs.some(c => c.id === club.id)
                        ? 'bg-gray-300 text-black cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-black'
                    }`}
                    disabled={myClubs.some(c => c.id === club.id)}
                    onClick={() => handleJoinClub(club.id)}
                  >
                    {myClubs.some(c => c.id === club.id) ? 'Already Joined' : 'Request to Join'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Events */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {approvedEvents.map(event => {
            const club = clubs.find(c => c.id === event.clubId);
            const isRegistered = myEvents.some(r => r.eventId === event.id);

            return (
              <Card key={event.id} className="hover:shadow-2xl rounded-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-black font-bold">{event.title}</CardTitle>
                  <CardDescription className="text-black/80">{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-black/70">
                      <Users className="w-4 h-4" /> {club?.name}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-black/70">
                      <Calendar className="w-4 h-4" /> {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-black/70">{event.participants?.length || 0} participants</div>
                    <Button
                      className={`w-full py-2 rounded-xl font-semibold ${
                        isRegistered
                          ? 'bg-gray-300 text-black cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-black'
                      }`}
                      disabled={isRegistered}
                      onClick={() => handleRegisterEvent(event.id)}
                    >
                      {isRegistered ? 'Already Registered' : 'Register'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Join Requests */}
        <div className="space-y-4">
          {myRequests.length > 0 ? myRequests.map(request => {
            const club = clubs.find(c => c.id === request.clubId);
            return (
              <Card key={request.id} className="rounded-xl shadow-md">
                <CardContent className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-black">{club?.name}</div>
                    <div className="text-sm text-black/70">{new Date(request.createdAt).toLocaleDateString()}</div>
                  </div>
                  <Badge
                    variant={
                      request.status === 'approved' ? 'default' :
                      request.status === 'rejected' ? 'destructive' :
                      'secondary'
                    }
                    className="flex items-center gap-1 px-3 py-1 rounded-full"
                  >
                    {request.status === 'pending' && <Clock className="w-3 h-3" />}
                    {request.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                    {request.status}
                  </Badge>
                </CardContent>
              </Card>
            );
          }) : (
            <Card className="text-center py-8 rounded-xl">
              No join requests yet
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
