
import { useState } from 'react';
import AdminLayout from '../layout/AdminLayout';

interface Tag {
  id: string;
  name: string;
  category: string;
  weight: number;
  streamMapping: {
    science: number;
    commerce: number;
    arts: number;
  };
  description: string;
  isActive: boolean;
}

interface ScoringRule {
  id: string;
  name: string;
  condition: string;
  recommendation: string;
  priority: number;
  isActive: boolean;
}

export default function TagsAndScoring() {
  const [activeTab, setActiveTab] = useState<'tags' | 'scoring'>('tags');
  
  const [tags] = useState<Tag[]>([
    {
      id: 'tag-1',
      name: 'Mathematical Reasoning',
      category: 'Aptitude',
      weight: 0.8,
      streamMapping: { science: 0.9, commerce: 0.6, arts: 0.2 },
      description: 'Ability to work with numbers, solve mathematical problems, and think logically',
      isActive: true
    },
    {
      id: 'tag-2',
      name: 'Creative Thinking',
      category: 'Personality',
      weight: 0.7,
      streamMapping: { science: 0.4, commerce: 0.5, arts: 0.9 },
      description: 'Tendency to think outside the box and generate innovative solutions',
      isActive: true
    },
    {
      id: 'tag-3',
      name: 'Business Acumen',
      category: 'Interest',
      weight: 0.6,
      streamMapping: { science: 0.3, commerce: 0.9, arts: 0.4 },
      description: 'Interest in business operations, entrepreneurship, and commercial activities',
      isActive: true
    },
    {
      id: 'tag-4',
      name: 'Scientific Curiosity',
      category: 'Interest',
      weight: 0.75,
      streamMapping: { science: 0.95, commerce: 0.2, arts: 0.3 },
      description: 'Strong interest in scientific phenomena and research-based learning',
      isActive: true
    }
  ]);

  const [scoringRules] = useState<ScoringRule[]>([
    {
      id: 'rule-1',
      name: 'High Science Aptitude',
      condition: 'Mathematical Reasoning > 0.7 AND Scientific Curiosity > 0.6',
      recommendation: 'Science Stream with focus on Physics/Mathematics',
      priority: 1,
      isActive: true
    },
    {
      id: 'rule-2',
      name: 'Business Oriented',
      condition: 'Business Acumen > 0.7 AND Mathematical Reasoning > 0.5',
      recommendation: 'Commerce Stream with focus on Economics/Accounts',
      priority: 2,
      isActive: true
    },
    {
      id: 'rule-3',
      name: 'Creative Arts Inclination',
      condition: 'Creative Thinking > 0.8 AND Business Acumen < 0.5',
      recommendation: 'Arts Stream with focus on Literature/Fine Arts',
      priority: 3,
      isActive: true
    }
  ]);

  const [showTagModal, setShowTagModal] = useState(false);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editingRule, setEditingRule] = useState<ScoringRule | null>(null);

  const [newTag, setNewTag] = useState({
    name: '',
    category: 'Aptitude',
    weight: 0.5,
    streamMapping: { science: 0.5, commerce: 0.5, arts: 0.5 },
    description: ''
  });

  const [newRule, setNewRule] = useState({
    name: '',
    condition: '',
    recommendation: '',
    priority: 1
  });

  const categories = ['Aptitude', 'Personality', 'Interest', 'Values', 'Skills'];

  const handleAddTag = () => {
    console.log('Adding new tag:', newTag);
    setShowTagModal(false);
    setNewTag({
      name: '',
      category: 'Aptitude',
      weight: 0.5,
      streamMapping: { science: 0.5, commerce: 0.5, arts: 0.5 },
      description: ''
    });
  };

  const handleAddRule = () => {
    console.log('Adding new rule:', newRule);
    setShowRuleModal(false);
    setNewRule({
      name: '',
      condition: '',
      recommendation: '',
      priority: 1
    });
  };

  const getWeightColor = (weight: number) => {
    if (weight >= 0.8) return 'bg-green-100 text-green-800';
    if (weight >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStreamColor = (stream: string) => {
    switch (stream) {
      case 'science': return 'bg-blue-500';
      case 'commerce': return 'bg-green-500';
      case 'arts': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <AdminLayout title="Tags & Scoring">
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex bg-gray-100 rounded-2xl p-1">
          <button
            onClick={() => setActiveTab('tags')}
            className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tags'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <i className="ri-price-tag-3-line w-5 h-5 flex items-center justify-center mr-2 inline-block"></i>
            Tag Management
          </button>
          <button
            onClick={() => setActiveTab('scoring')}
            className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'scoring'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <i className="ri-calculator-line w-5 h-5 flex items-center justify-center mr-2 inline-block"></i>
            Scoring Rules
          </button>
        </div>

        {activeTab === 'tags' ? (
          <div className="space-y-6">
            {/* Tags Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Tag Management</h2>
                <p className="text-gray-500 text-sm">Configure tags and their weights for stream recommendations</p>
              </div>
              <button
                onClick={() => {
                  setEditingTag(null);
                  setShowTagModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                <i className="ri-add-line w-5 h-5 flex items-center justify-center mr-2 inline-block"></i>
                Add Tag
              </button>
            </div>

            {/* Tags Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tags.map((tag) => (
                <div key={tag.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{tag.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getWeightColor(tag.weight)}`}>
                          Weight: {tag.weight}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{tag.description}</p>
                      <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                        {tag.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingTag(tag);
                          setNewTag({
                            name: tag.name,
                            category: tag.category,
                            weight: tag.weight,
                            streamMapping: tag.streamMapping,
                            description: tag.description
                          });
                          setShowTagModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        <i className="ri-edit-line w-5 h-5 flex items-center justify-center"></i>
                      </button>
                      <button className="text-red-600 hover:text-red-800 cursor-pointer">
                        <i className="ri-delete-bin-line w-5 h-5 flex items-center justify-center"></i>
                      </button>
                    </div>
                  </div>

                  {/* Stream Mapping */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Stream Mapping</h4>
                    <div className="space-y-3">
                      {Object.entries(tag.streamMapping).map(([stream, value]) => (
                        <div key={stream} className="flex items-center">
                          <div className="w-20 text-sm font-medium text-gray-700 capitalize">{stream}:</div>
                          <div className="flex-1 mx-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getStreamColor(stream)}`}
                                style={{ width: `${value * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="w-12 text-sm font-semibold text-gray-900 text-right">
                            {(value * 100).toFixed(0)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Scoring Rules Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Scoring Rules</h2>
                <p className="text-gray-500 text-sm">Configure logic for stream recommendations</p>
              </div>
              <button
                onClick={() => {
                  setEditingRule(null);
                  setShowRuleModal(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                <i className="ri-add-line w-5 h-5 flex items-center justify-center mr-2 inline-block"></i>
                Add Rule
              </button>
            </div>

            {/* Scoring Rules Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Priority</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Rule Name</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Condition</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Recommendation</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {scoringRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            #{rule.priority}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-medium text-gray-900">{rule.name}</td>
                        <td className="py-4 px-6">
                          <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                            {rule.condition}
                          </code>
                        </td>
                        <td className="py-4 px-6 text-gray-600 text-sm max-w-xs">
                          {rule.recommendation}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => {
                                setEditingRule(rule);
                                setNewRule({
                                  name: rule.name,
                                  condition: rule.condition,
                                  recommendation: rule.recommendation,
                                  priority: rule.priority
                                });
                                setShowRuleModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 cursor-pointer"
                            >
                              <i className="ri-edit-line w-5 h-5 flex items-center justify-center"></i>
                            </button>
                            <button className="text-red-600 hover:text-red-800 cursor-pointer">
                              <i className="ri-delete-bin-line w-5 h-5 flex items-center justify-center"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rule Testing */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Scoring Logic</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sample Input Values</label>
                  <div className="space-y-3">
                    {tags.slice(0, 4).map((tag) => (
                      <div key={tag.id} className="flex items-center">
                        <span className="w-40 text-sm text-gray-600">{tag.name}:</span>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          defaultValue="0.5"
                          className="flex-1 mx-3"
                        />
                        <span className="w-12 text-sm font-mono text-gray-900">0.5</span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold cursor-pointer whitespace-nowrap">
                    Test Rules
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Predicted Outcome</label>
                  <div className="bg-gray-50 rounded-xl p-4 min-h-48">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg">
                        <span className="font-medium text-green-800">Science Stream</span>
                        <span className="text-green-600 font-bold">85%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-100 rounded-lg">
                        <span className="font-medium text-yellow-800">Commerce Stream</span>
                        <span className="text-yellow-600 font-bold">60%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-100 rounded-lg">
                        <span className="font-medium text-purple-800">Arts Stream</span>
                        <span className="text-purple-600 font-bold">45%</span>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <strong>Recommendation:</strong> Science Stream with focus on Physics/Mathematics
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Tag Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingTag ? 'Edit Tag' : 'Add New Tag'}
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tag Name</label>
                  <input
                    type="text"
                    value={newTag.name}
                    onChange={(e) => setNewTag({...newTag, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter tag name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newTag.category}
                    onChange={(e) => setNewTag({...newTag, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white cursor-pointer pr-8"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newTag.description}
                  onChange={(e) => setNewTag({...newTag, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Describe what this tag measures..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tag Weight: {newTag.weight}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={newTag.weight}
                  onChange={(e) => setNewTag({...newTag, weight: parseFloat(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low Impact</span>
                  <span>High Impact</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Stream Mapping</label>
                <div className="space-y-4">
                  {Object.entries(newTag.streamMapping).map(([stream, value]) => (
                    <div key={stream}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="capitalize font-medium text-gray-700">{stream} Stream</span>
                        <span className="text-sm text-gray-600">{(value * 100).toFixed(0)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={value}
                        onChange={(e) => setNewTag({
                          ...newTag,
                          streamMapping: {
                            ...newTag.streamMapping,
                            [stream]: parseFloat(e.target.value)
                          }
                        })}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end space-x-4">
              <button
                onClick={() => setShowTagModal(false)}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTag}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold cursor-pointer whitespace-nowrap"
              >
                {editingTag ? 'Update Tag' : 'Add Tag'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Rule Modal */}
      {showRuleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingRule ? 'Edit Rule' : 'Add New Rule'}
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name</label>
                  <input
                    type="text"
                    value={newRule.name}
                    onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter rule name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newRule.priority}
                    onChange={(e) => setNewRule({...newRule, priority: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <textarea
                  value={newRule.condition}
                  onChange={(e) => setNewRule({...newRule, condition: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none font-mono text-sm"
                  placeholder="e.g., Mathematical Reasoning > 0.7 AND Scientific Curiosity > 0.6"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recommendation</label>
                <textarea
                  value={newRule.recommendation}
                  onChange={(e) => setNewRule({...newRule, recommendation: e.target.value})}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Enter the recommendation for students matching this condition"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end space-x-4">
              <button
                onClick={() => setShowRuleModal(false)}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRule}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold cursor-pointer whitespace-nowrap"
              >
                {editingRule ? 'Update Rule' : 'Add Rule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
