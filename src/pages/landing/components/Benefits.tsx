
export default function Benefits() {
  const benefits = [
    {
      icon: 'ri-lightbulb-line',
      title: 'Discover Hidden Strengths',
      description: 'Uncover your unique talents through scientifically validated psychometric assessment',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      icon: 'ri-compass-line',
      title: 'Personalized Career Path',
      description: 'Get AI-powered career recommendations tailored to your personality and interests',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      icon: 'ri-award-line',
      title: 'Smart Subject Selection',
      description: 'Make confident decisions about stream selection for Class 11 with data-driven insights',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: 'ri-brain-line',
      title: 'Learning Style Analysis',
      description: 'Understand how you learn best and optimize your study strategies',
      gradient: 'from-green-400 to-blue-500'
    },
    {
      icon: 'ri-target-line',
      title: 'Future-Ready Planning',
      description: 'Create a comprehensive roadmap for your academic and professional journey',
      gradient: 'from-red-400 to-pink-500'
    },
    {
      icon: 'ri-shield-check-line',
      title: 'Expert-Validated Results',
      description: 'Reports created by educational psychologists and career counseling experts',
      gradient: 'from-teal-400 to-cyan-600'
    }
  ];

  return (
    <section id="benefits" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-6">
            🌟 Why Students Choose Us
          </div>
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Potential</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our comprehensive assessment combines cutting-edge psychology with AI technology to provide you with actionable insights about your future
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group relative bg-white/70 backdrop-blur-sm p-8 rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 cursor-pointer overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
              
              {/* Icon with gradient background */}
              <div className={`relative w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <i className={`${benefit.icon} w-8 h-8 flex items-center justify-center text-white text-2xl`}></i>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                {benefit.description}
              </p>
              
              {/* Hover effect indicator */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <i className="ri-arrow-right-line w-5 h-5 flex items-center justify-center text-blue-600"></i>
              </div>
            </div>
          ))}
        </div>
        
        {/* Trust section */}
        <div className="mt-20 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                <p className="text-gray-600 font-medium">Students Assessed</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                <p className="text-gray-600 font-medium">Accuracy Rate</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">4.9★</div>
                <p className="text-gray-600 font-medium">Student Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
