import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Calendar, Users, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { clubs, events, joinRequests, eventRegistrations, requestJoinClub, registerForEvent } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();

  const myClubs = clubs.filter(club => 
    club.members?.some(m => m.id === user.id)
  );

  const myRequests = joinRequests.filter(r => r.studentId === user.id);
  const myEvents = eventRegistrations.filter(r => r.studentId === user.id);
  const approvedEvents = events.filter(e => e.status === 'approved');

  const handleJoinClub = (clubId) => {
    const alreadyRequested = joinRequests.some(
      r => r.clubId === clubId && r.studentId === user.id && r.status === 'pending'
    );
    
    if (alreadyRequested) {
      toast({
        title: 'Already Requested',
        description: 'You have already requested to join this club',
        variant: 'destructive'
      });
      return;
    }

    const alreadyMember = clubs.find(c => c.id === clubId)?.members?.some(m => m.id === user.id);
    if (alreadyMember) {
      toast({
        title: 'Already a Member',
        description: 'You are already a member of this club',
        variant: 'destructive'
      });
      return;
    }

    requestJoinClub(clubId);
    toast({
      title: 'Request Sent',
      description: 'Your join request has been sent to the faculty'
    });
  };

  const handleRegisterEvent = (eventId) => {
    const alreadyRegistered = eventRegistrations.some(
      r => r.eventId === eventId && r.studentId === user.id
    );

    if (alreadyRegistered) {
      toast({
        title: 'Already Registered',
        description: 'You are already registered for this event',
        variant: 'destructive'
      });
      return;
    }

    registerForEvent(eventId);
    toast({
      title: 'Registration Successful',
      description: 'You have been registered for the event'
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b" style={{ background: 'var(--gradient-primary)' }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground">Student Dashboard</h1>
              <p className="text-primary-foreground/80">Welcome, {user.name}!</p>
            </div>
            <Button variant="secondary" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="clubs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="clubs">All Clubs</TabsTrigger>
            <TabsTrigger value="my-clubs">My Clubs ({myClubs.length})</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="requests">My Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="clubs" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {clubs.map(club => (
                <Card key={club.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{club.name}</CardTitle>
                    <CardDescription>{club.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>Faculty: {club.facultyName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{club.members?.length || 0} members</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {club.activities?.map((activity, idx) => (
                          <Badge key={idx} variant="secondary">{activity}</Badge>
                        ))}
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => handleJoinClub(club.id)}
                        disabled={myClubs.some(c => c.id === club.id)}
                      >
                        {myClubs.some(c => c.id === club.id) ? 'Already Joined' : 'Request to Join'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-clubs" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myClubs.map(club => (
                <Card key={club.id} className="border-primary/50">
                  <CardHeader>
                    <CardTitle>{club.name}</CardTitle>
                    <CardDescription>{club.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Badge variant="default">Member</Badge>
                      <div className="text-sm text-muted-foreground">
                        Faculty: {club.facultyName}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {club.activities?.map((activity, idx) => (
                          <Badge key={idx} variant="secondary">{activity}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {myClubs.length === 0 && (
              <Card>
                <CardContent className="text-center py-8 text-muted-foreground">
                  You haven't joined any clubs yet
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {approvedEvents.map(event => {
                const club = clubs.find(c => c.id === event.clubId);
                const isRegistered = myEvents.some(r => r.eventId === event.id);
                return (
                  <Card key={event.id}>
                    <CardHeader>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4" />
                          <span>{club?.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {event.participants?.length || 0} participants
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => handleRegisterEvent(event.id)}
                          disabled={isRegistered}
                        >
                          {isRegistered ? 'Already Registered' : 'Register'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Join Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {myRequests.map(request => {
                    const club = clubs.find(c => c.id === request.clubId);
                    return (
                      <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">{club?.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge variant={
                          request.status === 'approved' ? 'default' : 
                          request.status === 'rejected' ? 'destructive' : 
                          'secondary'
                        }>
                          {request.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                          {request.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {request.status}
                        </Badge>
                      </div>
                    );
                  })}
                  {myRequests.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No join requests yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentDashboard;
