
import { useState, useEffect } from 'react';

interface ApiOption {
  text: string;
}
interface ApiQuestionGeneric {
  questionId: string;
  questionNumber?: number;
  text: string;
  options?: ApiOption[];
}
interface Question {
  id: number;
  text: string;
  options: string[];
  domain: string; // Section label
}

export default function Test() {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);

  // Utilities
  const authHeaders = () => {
    const isDev = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
    const token = localStorage.getItem('token') || (isDev ? 'demo-token-123' : '');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    } as HeadersInit;
  };

  const mapToLocal = (section: string, list: ApiQuestionGeneric[] | undefined, startIndex: number) => {
    const arr = list || [];
    return arr.map((q, i) => ({
      id: startIndex + i,
      text: q.text,
      options: (q.options || []).map(o => o.text),
      domain: section
    }));
  };

  // Load A–G questions sequentially from section endpoints
  useEffect(() => {
    const loadPhased = async () => {
      try {
        let assembled: Question[] = [];
        let idx = 1;

        // A — Aptitude (12)
        {
          const res = await fetch('/api/aptitude/generate-test', { method: 'POST', headers: authHeaders(), body: JSON.stringify({}) });
          const json = await res.json();
          const list: ApiQuestionGeneric[] = json?.data?.questions || [];
          const mapped = mapToLocal('Aptitude', list, idx);
          assembled = assembled.concat(mapped);
          idx += mapped.length;
        }

        // B — RIASEC (10)
        {
          const res = await fetch('/api/riasec/generate-section-b', { method: 'POST', headers: authHeaders(), body: JSON.stringify({}) });
          const json = await res.json();
          const list: ApiQuestionGeneric[] = json?.data?.questions || [];
          const mapped = mapToLocal('RIASEC', list, idx);
          assembled = assembled.concat(mapped);
          idx += mapped.length;
        }

        // C — Big Five (10)
        {
          const res = await fetch('/api/personality/generate-section-c', { method: 'POST', headers: authHeaders(), body: JSON.stringify({}) });
          const json = await res.json();
          const list: ApiQuestionGeneric[] = json?.data?.questions || [];
          const mapped = mapToLocal('BigFive', list, idx);
          assembled = assembled.concat(mapped);
          idx += mapped.length;
        }

        // D — Decision (8)
        {
          const res = await fetch('/api/decision/generate-section-d', { method: 'POST', headers: authHeaders(), body: JSON.stringify({}) });
          const json = await res.json();
          const list: ApiQuestionGeneric[] = json?.data?.questions || [];
          const mapped = mapToLocal('Decision', list, idx);
          assembled = assembled.concat(mapped);
          idx += mapped.length;
        }

        // E — Learning (8)
        {
          const res = await fetch('/api/learning/generate-section-e', { method: 'POST', headers: authHeaders(), body: JSON.stringify({}) });
          const json = await res.json();
          const list: ApiQuestionGeneric[] = json?.data?.questions || [];
          const mapped = mapToLocal('Learning', list, idx);
          assembled = assembled.concat(mapped);
          idx += mapped.length;
        }

        // F — ESI (6)
        {
          const res = await fetch('/api/esi/generate-section-f', { method: 'POST', headers: authHeaders(), body: JSON.stringify({}) });
          const json = await res.json();
          const list: ApiQuestionGeneric[] = json?.data?.questions || [];
          const mapped = mapToLocal('ESI', list, idx);
          assembled = assembled.concat(mapped);
          idx += mapped.length;
        }

        // G — Work Values (6): explicit counts
        {
          const body = {
            subthemes: [
              'Achievement Orientation','Stability & Structure','Creativity & Freedom','Helping & Service','Leadership & Influence'
            ],
            total: 6,
            perSubthemeCounts: {
              'Achievement Orientation': 2,
              'Stability & Structure': 1,
              'Creativity & Freedom': 1,
              'Helping & Service': 1,
              'Leadership & Influence': 1
            }
          };
          const res = await fetch('/api/values-work/generate', { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) });
          const json = await res.json();
          const list: ApiQuestionGeneric[] = json?.data?.questions || [];
          const mapped = mapToLocal('WorkValues', list, idx);
          assembled = assembled.concat(mapped);
          idx += mapped.length;
        }

        setQuestions(assembled);
      } catch (e) {
        console.error('Failed to load phased A–G test.', e);
        setQuestions([]);
      }
    };

    loadPhased();
  }, []);

  const currentQuestionData = questions.find(q => q.id === currentQuestion) || questions[0];
  const totalQuestions = questions.length || 60;

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
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
    return () => { window.removeEventListener('popstate', handlePopState); };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (selectedOption) setAnswers({ ...answers, [currentQuestion]: selectedOption });
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
    const finalAnswers = selectedOption ? { ...answers, [currentQuestion]: selectedOption } : answers;
    window.REACT_APP_NAVIGATE && window.REACT_APP_NAVIGATE('/payment');
  };

  const progress = (currentQuestion / (totalQuestions || 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900" style={{fontFamily: "Pacifico, serif"}}>
            Career Compass
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
              {currentQuestionData?.domain || 'Loading...'}
            </span>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 leading-relaxed mb-6">
              {currentQuestion}. {currentQuestionData?.text || 'Loading questions...'}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {(currentQuestionData?.options || []).map((option, index) => (
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
                {[...Array(Math.min(10, totalQuestions || 0))].map((_, i) => (
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
