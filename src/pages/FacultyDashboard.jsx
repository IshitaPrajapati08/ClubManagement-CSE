import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Plus, Check, X, Users, Calendar, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FacultyDashboard = () => {
  const { user, logout } = useAuth();
  // Added createClub here
  const {
    clubs,
    events,
    joinRequests,
    createEvent,
    updateEvent,
    deleteEvent,
    updateClub,
    updateJoinRequest,
    createClub
  } = useData();

  const { toast } = useToast();
  const navigate = useNavigate();

  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isClubDialogOpen, setIsClubDialogOpen] = useState(false); // new
  const [editingClub, setEditingClub] = useState(null);

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    clubId: ''
  });

  const [clubForm, setClubForm] = useState({
    name: '',
    description: '',
    activities: ''
  }); // new

  const myClubs = clubs.filter(c => c.facultyId === user.id);
  const myEvents = events.filter(e => myClubs.some(c => c.id === e.clubId));
  const pendingRequests = joinRequests.filter(r =>
    myClubs.some(c => c.id === r.clubId) && r.status === 'pending'
  );
  const acceptedRequests = joinRequests.filter(r =>
    myClubs.some(c => c.id === r.clubId) && r.status === 'approved'
  );

  const handleCreateEvent = (e) => {
    e.preventDefault();
    createEvent({
      ...eventForm,
      facultyId: user.id,
      facultyName: user.name
    });
    toast({
      title: 'Event Created',
      description: 'Event submitted for HOD approval'
    });
    setIsEventDialogOpen(false);
    setEventForm({ title: '', description: '', date: '', clubId: '' });
  };

  const handleCreateClub = (e) => {
    e.preventDefault();

    // prepare activities array from comma-separated input
    const activitiesArray = clubForm.activities
      ? clubForm.activities.split(',').map(a => a.trim()).filter(Boolean)
      : [];

    createClub({
      name: clubForm.name,
      description: clubForm.description,
      activities: activitiesArray,
      facultyId: user.id,
      facultyName: user.name
    });

    toast({
      title: 'Club Created',
      description: 'Club added successfully and visible to students'
    });

    setIsClubDialogOpen(false);
    setClubForm({ name: '', description: '', activities: '' });
  };

  const handleUpdateClub = (clubId, updates) => {
    updateClub(clubId, updates);
    toast({
      title: 'Club Updated',
      description: 'Club details updated successfully'
    });
    setEditingClub(null);
  };

  const handleDeleteEvent = (eventId) => {
    deleteEvent(eventId);
    toast({
      title: 'Event Deleted',
      description: 'Event has been removed'
    });
  };

  const handleRequestAction = (requestId, status) => {
    updateJoinRequest(requestId, status);
    toast({
      title: status === 'approved' ? 'Request Approved' : 'Request Rejected',
      description: `Student join request has been ${status}`
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
              <h1 className="text-3xl font-bold text-primary-foreground">Faculty Dashboard</h1>
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="clubs">My Clubs ({myClubs.length})</TabsTrigger>
            <TabsTrigger value="events">Events ({myEvents.length})</TabsTrigger>
            <TabsTrigger value="requests">Requests ({pendingRequests.length})</TabsTrigger>
          </TabsList>

          {/* -------------------- CLUBS TAB (with Create Club) -------------------- */}
          <TabsContent value="clubs" className="space-y-4">
            {/* Create Club Button */}
            <div className="flex justify-end mb-4">
              <Dialog open={isClubDialogOpen} onOpenChange={setIsClubDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Club
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Club</DialogTitle>
                    <DialogDescription>Add a new club under your faculty supervision</DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleCreateClub} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="clubName">Club Name</Label>
                      <Input
                        id="clubName"
                        value={clubForm.name}
                        onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clubDescription">Description</Label>
                      <Textarea
                        id="clubDescription"
                        value={clubForm.description}
                        onChange={(e) =>
                          setClubForm({ ...clubForm, description: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Activities (comma separated)</Label>
                      <Input
                        placeholder="e.g. Workshops, Meetings, Competitions"
                        value={clubForm.activities}
                        onChange={(e) =>
                          setClubForm({ ...clubForm, activities: e.target.value })
                        }
                      />
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 text-white">Create Club</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {myClubs.map(club => (
                <Card key={club.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      {club.name}
                      <Button variant="ghost" size="icon" onClick={() => setEditingClub(club)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                    <CardDescription>{club.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4" />
                        <span>{club.members?.length || 0} members</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {club.activities?.map((activity, idx) => (
                          <Badge key={idx} variant="secondary">{activity}</Badge>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Members:</div>
                        {club.members?.map(member => (
                          <div key={member.id} className="text-sm text-muted-foreground">
                            {member.name} ({member.email})
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* -------------------- EVENTS TAB -------------------- */}
          <TabsContent value="events" className="space-y-4">
            <div className="flex justify-end mb-4">
              <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>Event will be sent to HOD for approval</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateEvent} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Club</Label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={eventForm.clubId}
                        onChange={(e) => setEventForm({ ...eventForm, clubId: e.target.value })}
                        required
                      >
                        <option value="">Select a club</option>
                        {myClubs.map(club => (
                          <option key={club.id} value={club.id}>{club.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Event Title</Label>
                      <Input
                        id="title"
                        value={eventForm.title}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={eventForm.date}
                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">Create Event</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {myEvents.map(event => {
                const club = clubs.find(c => c.id === event.clubId);
                return (
                  <Card key={event.id}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start">
                        <span>{event.title}</span>
                        <div className="flex gap-2">
                          <Badge variant={
                            event.status === 'approved' ? 'default' :
                              event.status === 'rejected' ? 'destructive' :
                                'secondary'
                          }>
                            {event.status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
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
                          {event.participants?.length || 0} participants
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* -------------------- REQUESTS TAB -------------------- */}
          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Join Requests</CardTitle>
                <CardDescription>Review and respond to student requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingRequests.map(request => {
                    const club = clubs.find(c => c.id === request.clubId);
                    return (
                      <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">{request.studentName}</div>
                          <div className="text-sm text-muted-foreground">{request.studentEmail}</div>
                          <div className="text-sm text-muted-foreground">Club: {club?.name}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleRequestAction(request.id, 'approved')}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRequestAction(request.id, 'rejected')}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {pendingRequests.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No pending requests
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accepted Requests</CardTitle>
                <CardDescription>Students you have approved</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {acceptedRequests.map(request => {
                    const club = clubs.find(c => c.id === request.clubId);
                    return (
                      <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">{request.studentName}</div>
                          <div className="text-sm text-muted-foreground">{request.studentEmail}</div>
                          <div className="text-sm text-muted-foreground">Club: {club?.name}</div>
                          <div className="text-xs text-muted-foreground">Approved on: {request.updatedAt ? new Date(request.updatedAt).toLocaleDateString() : ''}</div>
                        </div>
                        <div>
                          <Badge variant="secondary">Approved</Badge>
                        </div>
                      </div>
                    );
                  })}
                  {acceptedRequests.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No accepted requests yet
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

export default FacultyDashboard;
