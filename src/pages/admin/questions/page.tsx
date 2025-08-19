
import { useState } from 'react';
import AdminLayout from '../layout/AdminLayout';

interface Question {
  id: string;
  text: string;
  domain: string;
  type: string;
  options: string[];
  status: 'active' | 'draft';
  createdDate: string;
}

export default function QuestionManager() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'Q001',
      text: 'I enjoy working with numbers and mathematical problems',
      domain: 'Aptitude',
      type: 'Likert Scale',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      status: 'active',
      createdDate: '2024-01-10'
    },
    {
      id: 'Q002',
      text: 'I prefer working in a team rather than working alone',
      domain: 'Personality',
      type: 'Likert Scale',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      status: 'active',
      createdDate: '2024-01-12'
    },
    {
      id: 'Q003',
      text: 'Which subject interests you the most?',
      domain: 'Interest',
      type: 'Multiple Choice',
      options: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Literature'],
      status: 'draft',
      createdDate: '2024-01-15'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [filterDomain, setFilterDomain] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newQuestion, setNewQuestion] = useState({
    text: '',
    domain: 'Aptitude',
    type: 'Likert Scale',
    options: ['']
  });

  const domains = ['Aptitude', 'Personality', 'Interest', 'Values', 'Skills'];
  const questionTypes = ['Likert Scale', 'Multiple Choice', 'Yes/No', 'Open Text'];

  const filteredQuestions = questions.filter(q => {
    const matchesDomain = filterDomain === 'all' || q.domain === filterDomain;
    const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const handleAddQuestion = () => {
    const question: Question = {
      id: `Q${String(questions.length + 1).padStart(3, '0')}`,
      text: newQuestion.text,
      domain: newQuestion.domain,
      type: newQuestion.type,
      options: newQuestion.options.filter(opt => opt.trim() !== ''),
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setQuestions([...questions, question]);
    setShowAddModal(false);
    setNewQuestion({ text: '', domain: 'Aptitude', type: 'Likert Scale', options: [''] });
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setNewQuestion({
      text: question.text,
      domain: question.domain,
      type: question.type,
      options: [...question.options]
    });
    setShowAddModal(true);
  };

  const handleUpdateQuestion = () => {
    if (!editingQuestion) return;

    const updatedQuestions = questions.map(q =>
      q.id === editingQuestion.id
        ? {
            ...q,
            text: newQuestion.text,
            domain: newQuestion.domain,
            type: newQuestion.type,
            options: newQuestion.options.filter(opt => opt.trim() !== '')
          }
        : q
    );

    setQuestions(updatedQuestions);
    setShowAddModal(false);
    setEditingQuestion(null);
    setNewQuestion({ text: '', domain: 'Aptitude', type: 'Likert Scale', options: [''] });
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const toggleStatus = (id: string) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, status: q.status === 'active' ? 'draft' : 'active' } : q
    ));
  };

  const addOption = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, '']
    });
  };

  const updateOption = (index: number, value: string) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({
      ...newQuestion,
      options: updatedOptions
    });
  };

  const removeOption = (index: number) => {
    setNewQuestion({
      ...newQuestion,
      options: newQuestion.options.filter((_, i) => i !== index)
    });
  };

  return (
    <AdminLayout title="Question Manager">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Question Bank</h2>
            <p className="text-gray-500 text-sm">Manage psychometric test questions and domains</p>
          </div>
          <button
            onClick={() => {
              setEditingQuestion(null);
              setNewQuestion({ text: '', domain: 'Aptitude', type: 'Likert Scale', options: [''] });
              setShowAddModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line w-5 h-5 flex items-center justify-center mr-2 inline-block"></i>
            Add New Question
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Questions</label>
              <div className="relative">
                <i className="ri-search-line w-5 h-5 flex items-center justify-center absolute left-3 top-3 text-gray-400"></i>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by question text or ID..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Domain</label>
              <select
                value={filterDomain}
                onChange={(e) => setFilterDomain(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white cursor-pointer pr-8"
              >
                <option value="all">All Domains</option>
                {domains.map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Questions Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Question</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Domain</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Type</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredQuestions.map((question) => (
                  <tr key={question.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 font-mono text-sm text-blue-600">{question.id}</td>
                    <td className="py-4 px-6">
                      <div className="max-w-md">
                        <p className="font-medium text-gray-900 line-clamp-2">{question.text}</p>
                        <p className="text-sm text-gray-500 mt-1">{question.options.length} options</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        question.domain === 'Aptitude' ? 'bg-blue-100 text-blue-800' :
                        question.domain === 'Personality' ? 'bg-purple-100 text-purple-800' :
                        question.domain === 'Interest' ? 'bg-green-100 text-green-800' :
                        question.domain === 'Values' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {question.domain}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm">{question.type}</td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => toggleStatus(question.id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap ${
                          question.status === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {question.status}
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEditQuestion(question)}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                          title="Edit Question"
                        >
                          <i className="ri-edit-line w-5 h-5 flex items-center justify-center"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="text-red-600 hover:text-red-800 cursor-pointer"
                          title="Delete Question"
                        >
                          <i className="ri-delete-bin-line w-5 h-5 flex items-center justify-center"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredQuestions.length === 0 && (
            <div className="text-center py-12">
              <i className="ri-question-line w-16 h-16 flex items-center justify-center text-gray-300 mx-auto mb-4 text-5xl"></i>
              <p className="text-gray-500">No questions found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                <textarea
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                  placeholder="Enter the question text..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
                  <select
                    value={newQuestion.domain}
                    onChange={(e) => setNewQuestion({...newQuestion, domain: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white cursor-pointer pr-8"
                  >
                    {domains.map(domain => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                  <select
                    value={newQuestion.type}
                    onChange={(e) => setNewQuestion({...newQuestion, type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white cursor-pointer pr-8"
                  >
                    {questionTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {(newQuestion.type === 'Multiple Choice' || newQuestion.type === 'Likert Scale') && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">Answer Options</label>
                    <button
                      onClick={addOption}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-add-line w-4 h-4 flex items-center justify-center mr-1 inline-block"></i>
                      Add Option
                    </button>
                  </div>
                  <div className="space-y-3">
                    {newQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                        {newQuestion.options.length > 1 && (
                          <button
                            onClick={() => removeOption(index)}
                            className="text-red-600 hover:text-red-800 cursor-pointer"
                          >
                            <i className="ri-delete-bin-line w-5 h-5 flex items-center justify-center"></i>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingQuestion(null);
                  setNewQuestion({ text: '', domain: 'Aptitude', type: 'Likert Scale', options: [''] });
                }}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={editingQuestion ? handleUpdateQuestion : handleAddQuestion}
                disabled={!newQuestion.text.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold cursor-pointer whitespace-nowrap disabled:cursor-not-allowed"
              >
                {editingQuestion ? 'Update Question' : 'Add Question'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
