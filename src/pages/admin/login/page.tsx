
import { useState } from 'react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate login process
    setTimeout(() => {
      setLoading(false);
      if (email === 'admin@vijnax.com' && password === 'admin123') {
        window.REACT_APP_NAVIGATE('/admin/dashboard');
      } else {
        setError('Invalid email or password');
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-cover bg-center opacity-5" style={{
        backgroundImage: `url(https://readdy.ai/api/search-image?query=Modern%20corporate%20office%20environment%20with%20clean%20workspace%2C%20laptops%2C%20documents%2C%20charts%20and%20graphs%2C%20professional%20business%20atmosphere%20with%20blue%20and%20white%20color%20scheme%2C%20minimalist%20design%20for%20admin%20login%20background&width=1920&height=1080&seq=admin-login-bg-1&orientation=landscape)`
      }}></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl animate-pulse delay-500"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
              <i className="ri-admin-line w-10 h-10 flex items-center justify-center text-white text-2xl"></i>
            </div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3" style={{fontFamily: "Pacifico, serif"}}>
              Vijna X
            </h1>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Admin Panel
            </h2>
            <p className="text-gray-600">
              Sign in to manage your psychometric platform
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-3">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="ri-mail-line w-5 h-5 flex items-center justify-center text-gray-400"></i>
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl text-lg font-medium focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-gray-50/50"
                  placeholder="admin@vijnax.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-3">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="ri-lock-line w-5 h-5 flex items-center justify-center text-gray-400"></i>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="block w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl text-lg font-medium focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-gray-50/50"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                >
                  <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600`}></i>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-100 rounded-2xl">
                <div className="flex items-center">
                  <i className="ri-error-warning-line w-5 h-5 flex items-center justify-center text-red-500 mr-2"></i>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer whitespace-nowrap"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 whitespace-nowrap cursor-pointer disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Signing in...
                </div>
              ) : (
                <>
                  <i className="ri-login-box-line w-5 h-5 flex items-center justify-center mr-2 inline-block"></i>
                  Sign In to Admin Panel
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
            <div className="flex items-center text-blue-800 mb-2">
              <i className="ri-information-line w-5 h-5 flex items-center justify-center mr-2"></i>
              <span className="font-semibold text-sm">Demo Credentials</span>
            </div>
            <div className="text-blue-700 text-xs space-y-1">
              <p><strong>Email:</strong> admin@vijnax.com</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-green-50/50 border border-green-100 rounded-2xl">
            <div className="flex items-center text-green-800">
              <i className="ri-shield-check-line w-5 h-5 flex items-center justify-center mr-2"></i>
              <span className="font-semibold text-sm">Secure Login</span>
            </div>
            <p className="text-green-700 text-xs mt-1">
              Your session is protected with enterprise-grade security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
