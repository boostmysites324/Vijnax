
export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Quick Registration',
      description: 'Simple mobile verification to secure your assessment',
      icon: 'ri-smartphone-line',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      step: '02',
      title: 'Smart Assessment',
      description: '60 scientifically designed questions across multiple domains',
      icon: 'ri-brain-line',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      step: '03',
      title: 'Detailed Insights',
      description: 'Comprehensive report with personalized career recommendations',
      icon: 'ri-file-chart-line',
      gradient: 'from-green-400 to-blue-500'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url(https://readdy.ai/api/search-image?query=Abstract%20geometric%20pattern%20with%20interconnected%20lines%20and%20nodes%2C%20technology%20network%20visualization%2C%20subtle%20white%20lines%20on%20transparent%20background%2C%20modern%20digital%20design%20for%20educational%20technology%20platform&width=1920&height=1080&seq=pattern-bg-1&orientation=landscape)`
      }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
            🚀 Simple Process
          </div>
          <h2 className="text-5xl font-extrabold mb-6">
            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Works</span>
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Three simple steps to unlock your potential and discover your ideal career path
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Enhanced connection lines */}
          <div className="hidden md:block absolute top-1/2 left-1/3 w-1/3 h-1 bg-gradient-to-r from-blue-400 to-purple-400 transform -translate-y-1/2 rounded-full"></div>
          <div className="hidden md:block absolute top-1/2 right-1/3 w-1/3 h-1 bg-gradient-to-r from-purple-400 to-green-400 transform -translate-y-1/2 rounded-full"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-500 hover:-translate-y-4 cursor-pointer">
                {/* Step number with enhanced design */}
                <div className={`relative w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl font-bold text-white">{step.step}</span>
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-ping group-hover:animate-none"></div>
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                  <i className={`${step.icon} w-8 h-8 flex items-center justify-center text-white text-2xl`}></i>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 group-hover:text-yellow-300 transition-colors">
                  {step.title}
                </h3>
                <p className="text-blue-100 leading-relaxed group-hover:text-white transition-colors">
                  {step.description}
                </p>
                
                {/* Progress indicator */}
                <div className="mt-6 w-full bg-white/20 rounded-full h-2">
                  <div 
                    className={`h-2 bg-gradient-to-r ${step.gradient} rounded-full transition-all duration-1000 group-hover:w-full`}
                    style={{ width: `${(index + 1) * 33.33}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
            <p className="text-blue-100 mb-6">Join thousands of students who have already discovered their potential</p>
            <button 
              onClick={() => window.REACT_APP_NAVIGATE('/otp-login')}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-2xl text-lg font-bold shadow-2xl hover:shadow-yellow-500/25 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 whitespace-nowrap cursor-pointer"
            >
              Begin Assessment Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
