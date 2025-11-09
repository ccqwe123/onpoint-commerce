import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Card } from '@/Components/ui/logincard';
import { Input } from '@/Components/ui/logininput';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/loginbutton';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Head } from '@inertiajs/react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData('email', e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData('password', e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.email || !data.password) return;

    if (!validateEmail(data.email)) return;

    // Call Laravel Breeze login
    post('/login');
  };

  useEffect(() => {
    document.title = "OnPoint | Login";
  }, []);

  return (
    <>
      <Head title="OnPoint | Login" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full sm:max-w-md p-8 bg-card text-card-foreground shadow-lg bg-white">
          <div className="space-y-6">
              <div className="text-center space-y-2">
              <h1 className="text-2xl font-heading font-semibold text-foreground">Welcome Back</h1>
              <p className="text-muted-foreground">Sign in to your account to continue</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={data.email}
                  onChange={handleEmailChange}
                  className={`bg-background text-foreground border-input focus:border-blue-500 focus:ring-primary ${
                      errors.email ? 'border-destructive' : ''
                  }`}
                  />
                  {errors.email && (
                  <p className="text-sm text-red-500 text-destructive">{errors.email}</p>
                  )}
              </div>

              <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <div className="relative">
                  <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={data.password}
                      onChange={handlePasswordChange}
                      className={`bg-background text-foreground border-input focus:border-blue-500 focus:ring-primary pr-12 ${
                      errors.password ? 'border-destructive' : ''
                      }`}
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  </div>
                  {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                  )}
              </div>

              <Button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-onpoint-dark-blue text-primary-foreground hover:bg-onpoint-blue/90"
              >
                  {processing ? (
                  <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                  </>
                  ) : (
                  'Sign In'
                  )}
              </Button>
              </form>
          </div>
      </Card>
      </div>
    </>
  );
}
