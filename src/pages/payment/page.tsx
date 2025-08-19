
import { useState } from 'react';

export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'qr' | 'mobile'>('upi');
  const [upiId, setUpiId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    setLoading(true);
    
    // Simulate payment process
    setTimeout(() => {
      setLoading(false);
      window.REACT_APP_NAVIGATE('/payment-success');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{fontFamily: "Pacifico, serif"}}>
            Vijna X
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800">
            Unlock Your Personalized Report
          </h2>
          <p className="text-gray-600 mt-2">
            Get detailed insights about your personality, strengths, and career recommendations
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Price Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
            <div className="mb-4">
              <span className="text-4xl font-bold">₹199</span>
              <span className="text-blue-200 line-through ml-2">₹499</span>
            </div>
            <p className="text-blue-100 mb-4">Limited Time Offer - 60% Off!</p>
            <div className="bg-white/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">What you'll get:</h3>
              <ul className="text-sm space-y-1">
                <li>• Detailed Personality Analysis</li>
                <li>• Career Recommendations</li>
                <li>• Subject Selection Guide</li>
                <li>• Learning Style Assessment</li>
                <li>• Future Planning Roadmap</li>
              </ul>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Choose Payment Method</h3>
            
            {/* Payment Method Tabs */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                  paymentMethod === 'upi' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                UPI ID
              </button>
              <button
                onClick={() => setPaymentMethod('qr')}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                  paymentMethod === 'qr' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                QR Code
              </button>
              <button
                onClick={() => setPaymentMethod('mobile')}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                  paymentMethod === 'mobile' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Mobile
              </button>
            </div>

            {/* Payment Forms */}
            {paymentMethod === 'upi' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter UPI ID
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="example@paytm"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg"
                />
              </div>
            )}

            {paymentMethod === 'qr' && (
              <div className="text-center">
                <div className="bg-gray-100 p-8 rounded-2xl inline-block">
                  <img 
                    src="https://readdy.ai/api/search-image?query=QR%20code%20payment%20interface%20for%20UPI%20transaction%2C%20clean%20white%20background%20with%20blue%20accent%20colors%2C%20modern%20payment%20gateway%20design%2C%20Indian%20payment%20system%20QR%20code%20scanner&width=200&height=200&seq=qr-code-1&orientation=squarish"
                    alt="QR Code"
                    className="w-48 h-48 object-contain mx-auto"
                  />
                </div>
                <p className="text-gray-600 mt-4">
                  Scan this QR code with any UPI app to pay ₹199
                </p>
                <div className="flex justify-center space-x-4 mt-4">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Google%20Pay%20logo%20icon%2C%20clean%20vector%20style%20payment%20app%20logo&width=40&height=40&seq=gpay-logo-1&orientation=squarish"
                    alt="Google Pay" 
                    className="w-10 h-10 object-contain"
                  />
                  <img 
                    src="https://readdy.ai/api/search-image?query=PhonePe%20logo%20icon%2C%20clean%20vector%20style%20payment%20app%20logo&width=40&height=40&seq=phonepe-logo-1&orientation=squarish"
                    alt="PhonePe" 
                    className="w-10 h-10 object-contain"
                  />
                  <img 
                    src="https://readdy.ai/api/search-image?query=Paytm%20logo%20icon%2C%20clean%20vector%20style%20payment%20app%20logo&width=40&height=40&seq=paytm-logo-1&orientation=squarish"
                    alt="Paytm" 
                    className="w-10 h-10 object-contain"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'mobile' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">+91</span>
                  </div>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setMobileNumber(value);
                    }}
                    placeholder="98765 43210"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg"
                    maxLength={10}
                  />
                </div>
              </div>
            )}

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 mt-8 disabled:transform-none whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Processing Payment...
                </div>
              ) : (
                'Pay ₹199 and Download Report'
              )}
            </button>

            {/* Security Note */}
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center text-green-800">
                <i className="ri-shield-check-line w-5 h-5 flex items-center justify-center mr-2"></i>
                <span className="font-semibold">Secure Payment</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                Your payment is secured with bank-level encryption. We don't store your payment details.
              </p>
            </div>

            {/* Powered by */}
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm mb-2">Powered by</p>
              <div className="flex justify-center items-center space-x-6">
                <span className="text-blue-600 font-bold">Razorpay</span>
                <span className="text-gray-400">•</span>
                <span className="text-purple-600 font-bold">PayU</span>
              </div>
            </div>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg text-center">
          <i className="ri-refund-2-line w-12 h-12 flex items-center justify-center text-green-600 mx-auto mb-3 text-3xl"></i>
          <h3 className="font-semibold text-gray-900 mb-2">100% Money Back Guarantee</h3>
          <p className="text-gray-600 text-sm">
            Not satisfied with your report? Get a full refund within 7 days, no questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}
