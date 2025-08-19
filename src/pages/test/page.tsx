
import { useState, useEffect } from 'react';

interface Question {
  id: number;
  text: string;
  options: string[];
  domain: string;
}

export default function Test() {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string>('');

  // Sample questions
  const questions: Question[] = [
    {
      id: 1,
      text: "When working on a group project, I prefer to:",
      options: [
        "Take the lead and organize everyone",
        "Contribute ideas when asked",
        "Focus on my assigned part independently",
        "Help others with their tasks",
        "Research and gather information"
      ],
      domain: "Personality Traits"
    },
    {
      id: 2,
      text: "If 5x + 3 = 18, what is the value of x?",
      options: [
        "x = 2",
        "x = 3",
        "x = 4",
        "x = 5"
      ],
      domain: "Numerical Ability"
    },
    {
      id: 3,
      text: "Which word is most similar in meaning to 'Eloquent'?",
      options: [
        "Silent",
        "Articulate",
        "Confused",
        "Boring"
      ],
      domain: "Verbal Ability"
    }
  ];

  const currentQuestionData = questions.find(q => q.id === currentQuestion) || questions[0];
  const totalQuestions = 60;

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto-submit test when time runs out
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Prevent browser back navigation
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.pathname);
      return false;
    };

    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (selectedOption) {
      setAnswers({ ...answers, [currentQuestion]: selectedOption });
    }
    
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(answers[currentQuestion + 1] || '');
    } else {
      handleSubmitTest();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[currentQuestion - 1] || '');
    }
  };

  const handleSubmitTest = () => {
    // Save current answer if selected
    const finalAnswers = selectedOption ? 
      { ...answers, [currentQuestion]: selectedOption } : 
      answers;
    
    // Navigate to payment page
    window.REACT_APP_NAVIGATE('/payment');
  };

  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900" style={{fontFamily: "Pacifico, serif"}}>
            Vijna X
          </h1>
          
          {/* Timer */}
          <div className="flex items-center bg-red-50 border border-red-200 px-4 py-2 rounded-full">
            <i className="ri-time-line w-5 h-5 flex items-center justify-center text-red-600 mr-2"></i>
            <span className="font-mono text-lg font-bold text-red-600">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestion} of {totalQuestions}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          {/* Domain Badge */}
          <div className="mb-6">
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
              {currentQuestionData.domain}
            </span>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 leading-relaxed mb-6">
              {currentQuestion}. {currentQuestionData.text}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {currentQuestionData.options.map((option, index) => (
              <label 
                key={index}
                className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 cursor-pointer"
              >
                <input
                  type="radio"
                  name="option"
                  value={option}
                  checked={selectedOption === option}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="w-5 h-5 text-blue-600 mr-4"
                />
                <span className="text-gray-800 text-lg">
                  {String.fromCharCode(65 + index)}. {option}
                </span>
              </label>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 1}
              className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
            >
              <i className="ri-arrow-left-line w-5 h-5 flex items-center justify-center mr-2"></i>
              Previous
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">
                {Object.keys(answers).length} of {totalQuestions} answered
              </p>
              <div className="flex space-x-1">
                {[...Array(Math.min(10, totalQuestions))].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < currentQuestion - 1 
                        ? 'bg-green-500' 
                        : i === currentQuestion - 1 
                        ? 'bg-blue-500' 
                        : 'bg-gray-300'
                    }`}
                  ></div>
                ))}
                {totalQuestions > 10 && <span className="text-gray-400">...</span>}
              </div>
            </div>

            {currentQuestion === totalQuestions ? (
              <button
                onClick={handleSubmitTest}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 whitespace-nowrap cursor-pointer"
              >
                Submit Test
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!selectedOption}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:transform-none whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
              >
                Next
                <i className="ri-arrow-right-line w-5 h-5 flex items-center justify-center ml-2"></i>
              </button>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <p className="text-yellow-800 mb-2">
            <i className="ri-question-line w-5 h-5 flex items-center justify-center mr-2 inline-block"></i>
            Need help? Call us at <strong>+91 98765 43210</strong>
          </p>
          <p className="text-yellow-700 text-sm">
            Our support team is available to assist you during the test
          </p>
        </div>
      </div>
    </div>
  );
}
