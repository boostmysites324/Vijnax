
export default function TestInstructions() {
  const handleStartTest = () => {
    window.REACT_APP_NAVIGATE('/test');
  };

  const instructions = [
    'This test contains 60 multiple-choice questions covering various domains',
    'You have 60 minutes to complete the entire assessment',
    'Each question has 4-5 options. Select the one that best describes you',
    'There are no right or wrong answers - answer honestly',
    'You cannot go back once you proceed to the next question',
    'Ensure stable internet connection throughout the test',
    'Keep your mobile phone nearby for any technical support'
  ];

  const domains = [
    { name: 'Logical Reasoning', questions: 15 },
    { name: 'Numerical Ability', questions: 12 },
    { name: 'Verbal Ability', questions: 10 },
    { name: 'Spatial Intelligence', questions: 8 },
    { name: 'Personality Traits', questions: 10 },
    { name: 'Interest Areas', questions: 5 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{fontFamily: "Pacifico, serif"}}>
            Vijna X
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800">
            Instructions Before You Begin
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          {/* Test Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8 p-6 bg-blue-50 rounded-2xl">
            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-blue-600 text-white rounded-full mx-auto mb-3">
                <i className="ri-time-line w-8 h-8 flex items-center justify-center text-2xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900">Duration</h3>
              <p className="text-blue-600 font-bold">60 Minutes</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-green-600 text-white rounded-full mx-auto mb-3">
                <i className="ri-question-line w-8 h-8 flex items-center justify-center text-2xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900">Questions</h3>
              <p className="text-green-600 font-bold">60 Questions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-purple-600 text-white rounded-full mx-auto mb-3">
                <i className="ri-brain-line w-8 h-8 flex items-center justify-center text-2xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900">Domains</h3>
              <p className="text-purple-600 font-bold">6 Areas</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <i className="ri-information-line w-6 h-6 flex items-center justify-center text-blue-600 mr-2"></i>
              Important Instructions
            </h3>
            <div className="space-y-3">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{instruction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Domains Covered */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <i className="ri-pie-chart-line w-6 h-6 flex items-center justify-center text-blue-600 mr-2"></i>
              Domains Covered
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {domains.map((domain, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-800">{domain.name}</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {domain.questions} Questions
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-2xl">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
              <i className="ri-lightbulb-line w-5 h-5 flex items-center justify-center mr-2"></i>
              Pro Tips
            </h3>
            <ul className="text-yellow-700 space-y-2">
              <li>• Find a quiet place with good lighting</li>
              <li>• Keep water nearby to stay hydrated</li>
              <li>• Trust your first instinct when answering</li>
              <li>• Don't spend too much time on any single question</li>
            </ul>
          </div>

          {/* Technical Requirements */}
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl">
            <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
              <i className="ri-wifi-line w-5 h-5 flex items-center justify-center mr-2"></i>
              Technical Requirements
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-green-700">
              <div className="flex items-center">
                <i className="ri-signal-wifi-3-line w-4 h-4 flex items-center justify-center mr-2"></i>
                Stable internet connection
              </div>
              <div className="flex items-center">
                <i className="ri-computer-line w-4 h-4 flex items-center justify-center mr-2"></i>
                Desktop/Laptop recommended
              </div>
              <div className="flex items-center">
                <i className="ri-chrome-line w-4 h-4 flex items-center justify-center mr-2"></i>
                Updated web browser
              </div>
              <div className="flex items-center">
                <i className="ri-phone-line w-4 h-4 flex items-center justify-center mr-2"></i>
                Mobile for support: +91 98765 43210
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={handleStartTest}
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 whitespace-nowrap cursor-pointer"
            >
              Start Test Now
            </button>
            <p className="mt-4 text-sm text-gray-500">
              By clicking "Start Test", you agree to our terms and conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
