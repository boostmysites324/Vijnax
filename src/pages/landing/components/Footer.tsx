
export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url(https://readdy.ai/api/search-image?query=Subtle%20geometric%20pattern%20with%20educational%20icons%2C%20books%2C%20graduation%20caps%2C%20and%20academic%20symbols%2C%20minimalist%20white%20line%20art%20on%20transparent%20background%20for%20footer%20design&width=1920&height=600&seq=footer-bg-1&orientation=landscape)`
      }}></div>
      
      <div className="relative z-10">
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400" style={{fontFamily: "Pacifico, serif"}}>
                  Vijna X
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                  Empowering Indian students to make confident decisions about their future through scientifically validated psychometric assessments and AI-powered career guidance.
                </p>
              </div>
              
              {/* Social Media */}
              <div>
                <h4 className="font-semibold mb-4 text-blue-300">Connect With Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="group w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center hover:from-blue-500 hover:to-indigo-500 transform hover:scale-110 transition-all duration-300 cursor-pointer">
                    <i className="ri-facebook-fill w-5 h-5 flex items-center justify-center group-hover:scale-110 transition-transform"></i>
                  </a>
                  <a href="#" className="group w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center hover:from-blue-400 hover:to-cyan-400 transform hover:scale-110 transition-all duration-300 cursor-pointer">
                    <i className="ri-twitter-fill w-5 h-5 flex items-center justify-center group-hover:scale-110 transition-transform"></i>
                  </a>
                  <a href="#" className="group w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center hover:from-pink-400 hover:to-rose-400 transform hover:scale-110 transition-all duration-300 cursor-pointer">
                    <i className="ri-instagram-fill w-5 h-5 flex items-center justify-center group-hover:scale-110 transition-transform"></i>
                  </a>
                  <a href="#" className="group w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center hover:from-blue-500 hover:to-blue-700 transform hover:scale-110 transition-all duration-300 cursor-pointer">
                    <i className="ri-linkedin-fill w-5 h-5 flex items-center justify-center group-hover:scale-110 transition-transform"></i>
                  </a>
                </div>
              </div>
              
              {/* Newsletter */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h4 className="font-semibold mb-3 text-blue-300">Stay Updated</h4>
                <p className="text-gray-400 text-sm mb-4">Get career tips and educational insights</p>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-l-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  />
                  <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-r-xl font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-semibold mb-6 text-blue-300">Quick Links</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-2 transform transition-all duration-300 cursor-pointer flex items-center">
                  <i className="ri-arrow-right-s-line w-4 h-4 flex items-center justify-center mr-2 opacity-0 group-hover:opacity-100"></i>
                  About Vijna X
                </a></li>
                <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-2 transform transition-all duration-300 cursor-pointer flex items-center">
                  <i className="ri-arrow-right-s-line w-4 h-4 flex items-center justify-center mr-2 opacity-0 group-hover:opacity-100"></i>
                  How It Works
                </a></li>
                <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-2 transform transition-all duration-300 cursor-pointer flex items-center">
                  <i className="ri-arrow-right-s-line w-4 h-4 flex items-center justify-center mr-2 opacity-0 group-hover:opacity-100"></i>
                  Sample Report
                </a></li>
                <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-2 transform transition-all duration-300 cursor-pointer flex items-center">
                  <i className="ri-arrow-right-s-line w-4 h-4 flex items-center justify-center mr-2 opacity-0 group-hover:opacity-100"></i>
                  Success Stories
                </a></li>
                <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-2 transform transition-all duration-300 cursor-pointer flex items-center">
                  <i className="ri-arrow-right-s-line w-4 h-4 flex items-center justify-center mr-2 opacity-0 group-hover:opacity-100"></i>
                  Pricing
                </a></li>
                <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-2 transform transition-all duration-300 cursor-pointer flex items-center">
                  <i className="ri-arrow-right-s-line w-4 h-4 flex items-center justify-center mr-2 opacity-0 group-hover:opacity-100"></i>
                  FAQ
                </a></li>
              </ul>
            </div>
            
            {/* Support & Contact */}
            <div>
              <h4 className="text-xl font-semibold mb-6 text-blue-300">Support</h4>
              <ul className="space-y-4 mb-8">
                <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-2 transform transition-all duration-300 cursor-pointer flex items-center">
                  <i className="ri-arrow-right-s-line w-4 h-4 flex items-center justify-center mr-2 opacity-0 group-hover:opacity-100"></i>
                  Help Center
                </a></li>
                <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-2 transform transition-all duration-300 cursor-pointer flex items-center">
                  <i className="ri-arrow-right-s-line w-4 h-4 flex items-center justify-center mr-2 opacity-0 group-hover:opacity-100"></i>
                  Contact Us
                </a></li>
                <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-2 transform transition-all duration-300 cursor-pointer flex items-center">
                  <i className="ri-arrow-right-s-line w-4 h-4 flex items-center justify-center mr-2 opacity-0 group-hover:opacity-100"></i>
                  Privacy Policy
                </a></li>
                <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-2 transform transition-all duration-300 cursor-pointer flex items-center">
                  <i className="ri-arrow-right-s-line w-4 h-4 flex items-center justify-center mr-2 opacity-0 group-hover:opacity-100"></i>
                  Terms of Service
                </a></li>
              </ul>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <i className="ri-phone-line w-5 h-5 flex items-center justify-center text-blue-400 mr-3"></i>
                  <span className="text-sm">+91 98765 43210</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <i className="ri-mail-line w-5 h-5 flex items-center justify-center text-blue-400 mr-3"></i>
                  <span className="text-sm">support@vijnax.com</span>
                </div>
                <div className="flex items-start text-gray-300">
                  <i className="ri-map-pin-line w-5 h-5 flex items-center justify-center text-blue-400 mr-3 mt-0.5"></i>
                  <span className="text-sm">Bangalore, Karnataka<br />India</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6">
                <p className="text-gray-400 text-sm">
                  © 2024 Vijna X. All rights reserved.
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Made with ❤️ for Indian Students</span>
                </div>
              </div>
              
              {/* Security badges */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-xs">
                  <i className="ri-shield-check-line w-3 h-3 flex items-center justify-center mr-1"></i>
                  SSL Secured
                </div>
                <div className="flex items-center px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs">
                  <i className="ri-verified-badge-line w-3 h-3 flex items-center justify-center mr-1"></i>
                  ISO 27001
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
