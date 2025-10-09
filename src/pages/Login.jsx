import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
        toast({ title: 'Login Successful', description: 'Welcome back!' });
        navigate(role === 'student' ? '/student' : role === 'faculty' ? '/faculty' : '/hod');
      } else {
        toast({ title: 'Login Failed', description: result.error, variant: 'destructive' });
      }
    } else {
      const result = signup({ ...formData, role });
      if (result.success) {
        toast({ title: 'Signup Successful', description: 'Account created successfully!' });
        navigate(role === 'student' ? '/student' : role === 'faculty' ? '/faculty' : '/hod');
      } else {
        toast({ title: 'Signup Failed', description: result.error, variant: 'destructive' });
      }
    }
  };

  const roleIcons = { student: GraduationCap, faculty: Users, hod: UserCog };
  const RoleIcon = roleIcons[role];

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#1e3a8a' }}>
      <Card className="w-full max-w-md shadow-2xl rounded-xl">
        <CardHeader className="text-center pb-0">
          <div className="mx-auto w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center mb-4">
            <RoleIcon className="w-10 h-10 text-black" />
          </div>
          <CardTitle className="text-2xl font-bold text-black">Club Management System</CardTitle>
          <CardDescription className="text-black/90 mb-6">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Login / Sign Up Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`py-3 text-lg font-semibold rounded-lg w-full transition-all duration-200 ${
                isLogin
                  ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-black shadow-lg'
                  : 'bg-white/20 text-black hover:bg-white/30'
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`py-3 text-lg font-semibold rounded-lg w-full transition-all duration-200 ${
                !isLogin
                  ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-black shadow-lg'
                  : 'bg-white/20 text-black '
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {['student', 'faculty', 'hod'].map((r) => (
              <Button
                key={r}
                type="button"
                variant={role === r ? 'default' : 'outline'}
                onClick={() => setRole(r)}
                className={`capitalize py-3 font-medium rounded-lg w-full ${
                  role === r
                    ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-black shadow-md'
                    : 'border border-black/30 text-black'
                }`}
              >
                {r === 'hod' ? 'HOD' : r}
              </Button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-black font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="py-3 text-black"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-black font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                className="py-3 text-black"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-black font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                className="py-3 text-black"
                required
              />
            </div>

            {!isLogin && role !== 'student' && (
              <div className="space-y-2">
                <Label htmlFor="department" className="text-black font-medium">
                  Department
                </Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Enter your department"
                  className="py-3 text-black"
                  required
                />
              </div>
            )}

            {/* Perfect Gradient Button */}
            <Button
              type="submit"
              className="
                w-full 
                py-4 
                text-lg 
                font-semibold 
                text-black 
                rounded-xl 
                bg-gradient-to-r from-blue-500 to-blue-700 
                shadow-lg 
                hover:from-blue-600 hover:to-blue-800 
                active:scale-95 
                transition-all 
                duration-200
                mt-4
              "
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
