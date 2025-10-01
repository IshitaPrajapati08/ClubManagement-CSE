import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Check, X, Users, Calendar, TrendingUp, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HODDashboard = () => {
  const { user, logout } = useAuth();
  const { clubs, events, updateEvent } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();

  const pendingEvents = events.filter(e => e.status === 'pending');
  const approvedEvents = events.filter(e => e.status === 'approved');
  const totalStudents = new Set(clubs.flatMap(c => c.members?.map(m => m.id) || [])).size;
  const totalFaculty = new Set(clubs.map(c => c.facultyId)).size;

  const handleEventAction = (eventId, status) => {
    updateEvent(eventId, { status });
    toast({
      title: status === 'approved' ? 'Event Approved' : 'Event Rejected',
      description: `Event has been ${status}`
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
              <h1 className="text-3xl font-bold text-primary-foreground">HOD Dashboard</h1>
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
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Clubs</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{clubs.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active clubs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Faculty Members</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalFaculty}</div>
              <p className="text-xs text-muted-foreground mt-1">Managing clubs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">In all clubs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{events.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {pendingEvents.length} pending approval
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="events">Pending Events ({pendingEvents.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved Events ({approvedEvents.length})</TabsTrigger>
            <TabsTrigger value="clubs">All Clubs ({clubs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Events Pending Approval</CardTitle>
                <CardDescription>Review and approve/reject events created by faculty</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingEvents.map(event => {
                    const club = clubs.find(c => c.id === event.clubId);
                    return (
                      <div key={event.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                          </div>
                          <Badge variant="secondary">Pending</Badge>
                        </div>
                        <div className="grid gap-2 text-sm mb-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>Club: {club?.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>Faculty: {event.facultyName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEventAction(event.id, 'approved')}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleEventAction(event.id, 'rejected')}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {pendingEvents.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No events pending approval
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {approvedEvents.map(event => {
                const club = clubs.find(c => c.id === event.clubId);
                return (
                  <Card key={event.id}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start">
                        <span>{event.title}</span>
                        <Badge>Approved</Badge>
                      </CardTitle>
                      <CardDescription>{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4" />
                          <span>{club?.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {event.participants?.length || 0} participants registered
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="clubs" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {clubs.map(club => (
                <Card key={club.id}>
                  <CardHeader>
                    <CardTitle>{club.name}</CardTitle>
                    <CardDescription>{club.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Faculty:</span> {club.facultyName}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Members:</span> {club.members?.length || 0}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Department:</span> {club.department}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {club.activities?.map((activity, idx) => (
                          <Badge key={idx} variant="secondary">{activity}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default HODDashboard;
