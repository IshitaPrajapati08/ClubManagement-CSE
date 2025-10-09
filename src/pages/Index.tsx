import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, UserCog, Calendar } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === 'student') navigate('/student');
      else if (user.role === 'faculty') navigate('/faculty');
      else if (user.role === 'hod') navigate('/hod');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: GraduationCap,
      title: 'For Students',
      description: 'Browse clubs, join activities, and register for events',
      role: 'student'
    },
    {
      icon: Users,
      title: 'For Faculty',
      description: 'Manage your clubs, create events, and handle student requests',
      role: 'faculty'
    },
    {
      icon: UserCog,
      title: 'For HOD',
      description: 'Overview all clubs, approve events, and view statistics',
      role: 'hod'
    }
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', // gradient blue
      }}
    >
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Club Management System
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Connect, collaborate, and grow with our comprehensive club management platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.role} className="text-center hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <Card className="max-w-md mx-auto shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Get Started</CardTitle>
            <CardDescription>Login or create an account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full text-lg py-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"
              onClick={() => navigate('/login')}
            >
              Login / Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
