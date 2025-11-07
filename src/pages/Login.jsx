import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, GraduationCap, UserCog } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, signup } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    department: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (isLogin) {
      // attempt login
      const res = login(formData.email, formData.password, role);
      if (res.success) {
        toast({
          title: "Login Successful!",
          description: "Welcome back!",
          variant: "default",
        });

        navigate(
          role === "student" ? "/student" : role === "faculty" ? "/faculty" : "/hod"
        );
      } else {
        toast({ title: "Login Failed", description: res.error || "Invalid credentials", variant: "destructive" });
      }
    } else {
      // signup
      const payload = { ...formData, role };
      const res = signup(payload);
      if (res.success) {
        toast({
          title: "Signup Successful!",
          description: "Account created!",
          variant: "default",
        });

        navigate(
          role === "student" ? "/student" : role === "faculty" ? "/faculty" : "/hod"
        );
      } else {
        toast({ title: "Signup Failed", description: res.error || "Could not create account", variant: "destructive" });
      }
    }

    setIsLoading(false);
  };

  const roleIcons = { student: GraduationCap, faculty: Users, hod: UserCog };
  const RoleIcon = roleIcons[role];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#1e3a8a]">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl bg-white p-6 text-black">
        <CardHeader className="text-center space-y-3 text-black">
          <div className="mx-auto w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
            <RoleIcon className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-black">
            Club Management System
          </CardTitle>
          <CardDescription className="text-base font-medium text-black">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 space-y-6">
          {/* Login / Sign Up */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className={`py-3 text-lg font-semibold rounded-lg w-full ${
                isLogin ? "bg-blue-300" : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>

            <button
              type="button"
              className={`py-3 text-lg font-semibold rounded-lg w-full ${
                !isLogin ? "bg-blue-300" : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          {/* Roles */}
          <div className="grid grid-cols-3 gap-4">
            {["student", "faculty", "hod"].map((r) => (
              <Button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`capitalize py-3 w-full rounded-lg ${
                  role === r
                    ? "bg-blue-300"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {r === "hod" ? "HOD" : r}
              </Button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <Label>Full Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
            )}

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            {!isLogin && role !== "student" && (
              <div>
                <Label>Department</Label>
                <Input
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  required
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-3 bg-blue-300 font-semibold shadow-md"
              disabled={isLoading}
            >
              {isLoading
                ? isLogin
                  ? "Signing in..."
                  : "Creating..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
