
export default function Hero() {
  const handleStartTest = () => {
    window.REACT_APP_NAVIGATE('/otp-login');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden pt-16">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 bg-cover bg-center opacity-5" style={{
        backgroundImage: `url(https://readdy.ai/api/search-image?query=Abstract%20geometric%20patterns%20with%20educational%20elements%2C%20books%2C%20atoms%2C%20mathematical%20formulas%20floating%20in%20space%2C%20sophisticated%20gradient%20background%20in%20deep%20blue%20and%20purple%20tones%2C%20modern%20minimalist%20design%20for%20premium%20educational%20platform&width=1920&height=1080&seq=hero-bg-enhanced&orientation=landscape)`
      }}></div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-20 w-16 h-16 bg-indigo-200/20 rounded-full blur-xl animate-pulse delay-500"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[85vh]">
          {/* Left Content - Enhanced */}
          <div className="text-center lg:text-left space-y-8">
            {/* Logo and Brand */}
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-100 shadow-sm">
                <span className="text-blue-600 font-semibold text-sm">🎯 India's #1 Psychometric Platform</span>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 leading-tight" style={{fontFamily: "Pacifico, serif"}}>
                Vijna X
              </h1>
              
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                  Discover Your
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Future</span>
                </h2>
                <p className="text-xl lg:text-2xl text-gray-600 font-medium">
                  Advanced Psychometric Assessment for Class 9 & 10 Students
                </p>
                <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
                  Unlock your hidden potential with our scientifically designed assessment. Get personalized career guidance, understand your learning style, and make confident decisions about your future.
                </p>
              </div>
            </div>
            
            {/* CTA Section */}
            <div className="space-y-6">
              <button 
                onClick={handleStartTest}
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-xl font-bold shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 whitespace-nowrap cursor-pointer"
              >
                <span className="relative z-10">Start Free Assessment</span>
                <i className="ri-arrow-right-line w-5 h-5 flex items-center justify-center ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 text-sm">
                <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                  <i className="ri-time-line w-5 h-5 flex items-center justify-center text-blue-600 mr-2"></i>
                  <span className="font-semibold text-gray-700">60 Minutes</span>
                </div>
                <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                  <i className="ri-question-line w-5 h-5 flex items-center justify-center text-blue-600 mr-2"></i>
                  <span className="font-semibold text-gray-700">60 Questions</span>
                </div>
                <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                  <i className="ri-gift-line w-5 h-5 flex items-center justify-center text-green-600 mr-2"></i>
                  <span className="font-semibold text-gray-700">100% Free</span>
                </div>
              </div>
            </div>
            
            {/* Social proof */}
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center lg:justify-start space-x-4">
                <div className="flex -space-x-2">
                  <img src="https://readdy.ai/api/search-image?query=Portrait%20of%20happy%20Indian%20student%2C%20professional%20headshot%20with%20warm%20smile&width=40&height=40&seq=student-avatar-1&orientation=squarish" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="Student" />
                  <img src="https://readdy.ai/api/search-image?query=Portrait%20of%20confident%20Indian%20student%20girl%2C%20professional%20headshot%20with%20bright%20expression&width=40&height=40&seq=student-avatar-2&orientation=squarish" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="Student" />
                  <img src="https://readdy.ai/api/search-image?query=Portrait%20of%20cheerful%20Indian%20student%20boy%20with%20glasses%2C%20professional%20headshot&width=40&height=40&seq=student-avatar-3&orientation=squarish" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="Student" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800">10,000+ students tested</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="ri-star-fill w-3 h-3 flex items-center justify-center text-yellow-400"></i>
                    ))}
                    <span className="text-xs text-gray-600 ml-1">4.9/5 rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Image - Enhanced */}
          <div className="relative">
            <div className="relative z-10">
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-2 transform hover:scale-105 transition-all duration-500">
                <img 
                  src="https://readdy.ai/api/search-image?query=Premium%20educational%20scene%20with%20diverse%20group%20of%20Indian%20Class%209-10%20students%20in%20modern%20classroom%20setting%2C%20students%20engaged%20with%20tablets%20and%20books%2C%20contemporary%20school%20environment%20with%20natural%20lighting%2C%20professional%20photography%20style%2C%20inspirational%20and%20aspirational%20mood&width=600&height=500&seq=hero-students-premium&orientation=landscape"
                  alt="Students engaging with modern education"
                  className="w-full h-96 object-cover rounded-2xl"
                />
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                ✨ FREE Assessment
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-green-400 to-blue-400 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                🏆 Trusted by 10k+ Students
              </div>
            </div>
            
            {/* Background decorative circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
      
      {/* Enhanced scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center animate-bounce">
          <span className="text-sm text-gray-500 mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-blue-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-blue-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
