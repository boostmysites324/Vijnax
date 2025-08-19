
export default function Testimonials() {
  const testimonials = [
    {
      name: 'Rahul Sharma',
      grade: 'Class 10, Delhi',
      text: 'Vijna X completely changed my perspective! The assessment revealed my natural aptitude for engineering, and now I\'m confidently pursuing Science stream. The detailed report helped me understand my strengths better.',
      image: 'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20confident%20Indian%20teenage%20boy%20student%2C%20Class%2010%20student%20with%20bright%20smile%20wearing%20school%20uniform%2C%20clean%20educational%20background%2C%20high-quality%20headshot%20photography&width=150&height=150&seq=testimonial-student-1&orientation=squarish',
      rating: 5,
      achievement: 'Chose Science Stream'
    },
    {
      name: 'Priya Patel',
      grade: 'Class 9, Mumbai',
      text: 'I was confused about my future, but Vijna X made everything clear. The personality insights were spot-on, and I discovered my passion for creative fields. My parents now support my decision to pursue arts!',
      image: 'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20cheerful%20Indian%20teenage%20girl%20student%2C%20Class%209%20student%20with%20confident%20expression%20wearing%20school%20uniform%2C%20modern%20educational%20setting%20background%2C%20high-quality%20headshot%20photography&width=150&height=150&seq=testimonial-student-2&orientation=squarish',
      rating: 5,
      achievement: 'Found Creative Passion'
    },
    {
      name: 'Arjun Kumar',
      grade: 'Class 10, Bangalore',
      text: 'The career recommendations were incredibly accurate! Vijna X suggested computer science careers, and after exploring the field, I\'m now certain about my path. The assessment saved me years of confusion.',
      image: 'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20intelligent%20Indian%20teenage%20boy%20student%20with%20glasses%2C%20Class%2010%20student%20with%20thoughtful%20expression%20wearing%20school%20uniform%2C%20contemporary%20educational%20background%2C%20high-quality%20headshot%20photography&width=150&height=150&seq=testimonial-student-3&orientation=squarish',
      rating: 5,
      achievement: 'Discovered Tech Interest'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-2xl opacity-60"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-br from-indigo-100 to-pink-100 rounded-full blur-2xl opacity-60"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-6">
            💬 Success Stories
          </div>
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            What Students <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Real experiences from students who transformed their futures with Vijna X
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="group bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-500 hover:-translate-y-4 cursor-pointer relative overflow-hidden"
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/50 group-hover:to-indigo-50/50 transition-all duration-500 rounded-3xl"></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Student info */}
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <img 
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Achievement badge */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <i className="ri-check-line w-4 h-4 flex items-center justify-center text-white text-sm"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.grade}</p>
                    <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold mt-1">
                      {testimonial.achievement}
                    </div>
                  </div>
                </div>
                
                {/* Rating */}
                <div className="flex mb-4 group-hover:scale-110 transition-transform duration-300">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <i key={i} className="ri-star-fill w-5 h-5 flex items-center justify-center text-yellow-400"></i>
                  ))}
                </div>
                
                {/* Quote */}
                <div className="relative">
                  <i className="ri-double-quotes-l w-8 h-8 flex items-center justify-center text-blue-200 absolute -top-4 -left-2"></i>
                  <p className="text-gray-700 leading-relaxed italic pl-6 group-hover:text-gray-800 transition-colors">
                    {testimonial.text}
                  </p>
                  <i className="ri-double-quotes-r w-6 h-6 flex items-center justify-center text-blue-200 float-right mt-2"></i>
                </div>
                
                {/* Verified badge */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-green-600">
                    <i className="ri-verified-badge-fill w-4 h-4 flex items-center justify-center mr-1"></i>
                    <span className="text-xs font-semibold">Verified Student</span>
                  </div>
                  <span className="text-xs text-gray-400">{index === 0 ? '2 weeks ago' : index === 1 ? '3 weeks ago' : '1 month ago'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Statistics section */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-8">Join Our Success Community</h3>
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">10,000+</div>
                  <p className="text-blue-100">Happy Students</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">95%</div>
                  <p className="text-blue-100">Satisfaction Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">4.9★</div>
                  <p className="text-blue-100">Average Rating</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">500+</div>
                  <p className="text-blue-100">Schools Trust Us</p>
                </div>
              </div>
              <button 
                onClick={() => window.REACT_APP_NAVIGATE('/otp-login')}
                className="mt-8 bg-white text-blue-600 px-8 py-4 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 whitespace-nowrap cursor-pointer"
              >
                Start Your Success Story
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
