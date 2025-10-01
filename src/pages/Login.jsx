import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Users, GraduationCap, UserCog } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    department: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      const result = login(formData.email, formData.password, role);
      if (result.success) {
        toast({
          title: 'Login Successful',
          description: 'Welcome back!'
        });
        navigate(role === 'student' ? '/student' : role === 'faculty' ? '/faculty' : '/hod');
      } else {
        toast({
          title: 'Login Failed',
          description: result.error,
          variant: 'destructive'
        });
      }
    } else {
      const result = signup({ ...formData, role });
      if (result.success) {
        toast({
          title: 'Signup Successful',
          description: 'Account created successfully!'
        });
        navigate(role === 'student' ? '/student' : role === 'faculty' ? '/faculty' : '/hod');
      } else {
        toast({
          title: 'Signup Failed',
          description: result.error,
          variant: 'destructive'
        });
      }
    }
  };

  const roleIcons = {
    student: GraduationCap,
    faculty: Users,
    hod: UserCog
  };

  const RoleIcon = roleIcons[role];

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--gradient-primary)' }}>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <RoleIcon className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Club Management System</CardTitle>
          <CardDescription>
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={isLogin ? 'login' : 'signup'} onValueChange={(v) => setIsLogin(v === 'login')} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-3 gap-2 mb-6">
            {['student', 'faculty', 'hod'].map((r) => (
              <Button
                key={r}
                type="button"
                variant={role === r ? 'default' : 'outline'}
                onClick={() => setRole(r)}
                className="capitalize"
              >
                {r === 'hod' ? 'HOD' : r}
              </Button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            {!isLogin && role !== 'student' && (
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                />
              </div>
            )}

            <Button type="submit" className="w-full">
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
