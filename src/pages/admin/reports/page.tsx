
import { useState } from 'react';
import AdminLayout from '../layout/AdminLayout';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: string[];
  isDefault: boolean;
  createdDate: string;
  lastModified: string;
}

export default function ReportTemplates() {
  const [templates] = useState<ReportTemplate[]>([
    {
      id: 'template-1',
      name: 'Standard Psychometric Report',
      description: 'Comprehensive report covering personality, aptitude, and career recommendations',
      sections: ['Personal Profile', 'Personality Analysis', 'Aptitude Assessment', 'Interest Mapping', 'Career Recommendations', 'Learning Style', 'Action Plan'],
      isDefault: true,
      createdDate: '2024-01-01',
      lastModified: '2024-01-15'
    },
    {
      id: 'template-2',
      name: 'Career Focused Report',
      description: 'Streamlined report focusing primarily on career guidance and stream selection',
      sections: ['Personal Summary', 'Career Aptitude', 'Stream Recommendations', 'Subject Selection', 'Future Roadmap'],
      isDefault: false,
      createdDate: '2024-01-10',
      lastModified: '2024-01-12'
    },
    {
      id: 'template-3',
      name: 'Detailed Academic Report',
      description: 'In-depth analysis for academic planning and skill development',
      sections: ['Academic Strengths', 'Learning Preferences', 'Subject Analysis', 'Skill Development Plan', 'Academic Roadmap', 'Study Strategies'],
      isDefault: false,
      createdDate: '2024-01-08',
      lastModified: '2024-01-14'
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate>(templates[0]);
  const [previewMode, setPreviewMode] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [templateSettings, setTemplateSettings] = useState({
    includeCharts: true,
    includeRecommendations: true,
    includeDetailedAnalysis: true,
    colorScheme: 'blue',
    logoPosition: 'top-center',
    pageOrientation: 'portrait'
  });

  const handleSaveTemplate = () => {
    console.log('Saving template settings...', templateSettings);
    setEditMode(false);
  };

  const handlePreviewReport = () => {
    setPreviewMode(true);
  };

  const handleDuplicateTemplate = (template: ReportTemplate) => {
    const newTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copy)`,
      isDefault: false,
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };
    console.log('Duplicating template:', newTemplate);
  };

  const handleDeleteTemplate = (templateId: string) => {
    console.log('Deleting template:', templateId);
  };

  const colorSchemes = [
    { id: 'blue', name: 'Blue', primary: '#3B82F6', secondary: '#93C5FD' },
    { id: 'green', name: 'Green', primary: '#10B981', secondary: '#86EFAC' },
    { id: 'purple', name: 'Purple', primary: '#8B5CF6', secondary: '#C4B5FD' },
    { id: 'orange', name: 'Orange', primary: '#F97316', secondary: '#FDBA74' }
  ];

  return (
    <AdminLayout title="Report Templates">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Template List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Templates</h3>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer whitespace-nowrap">
                <i className="ri-add-line w-4 h-4 flex items-center justify-center mr-1 inline-block"></i>
                New
              </button>
            </div>

            <div className="space-y-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    selectedTemplate.id === template.id
                      ? 'bg-blue-50 border-2 border-blue-200'
                      : 'border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="font-semibold text-gray-900 text-sm">{template.name}</h4>
                        {template.isDefault && (
                          <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs mt-1 line-clamp-2">{template.description}</p>
                      <p className="text-gray-400 text-xs mt-2">{template.sections.length} sections</p>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateTemplate(template);
                        }}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                        title="Duplicate"
                      >
                        <i className="ri-file-copy-line w-4 h-4 flex items-center justify-center"></i>
                      </button>
                      {!template.isDefault && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTemplate(template.id);
                          }}
                          className="text-gray-400 hover:text-red-600 cursor-pointer"
                          title="Delete"
                        >
                          <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Template Editor */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedTemplate.name}</h3>
                <p className="text-gray-500 text-sm">{selectedTemplate.description}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePreviewReport}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-eye-line w-4 h-4 flex items-center justify-center mr-2 inline-block"></i>
                  Preview
                </button>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`px-4 py-2 rounded-xl font-semibold cursor-pointer whitespace-nowrap ${
                    editMode
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <i className={`${editMode ? 'ri-close-line' : 'ri-edit-line'} w-4 h-4 flex items-center justify-center mr-2 inline-block`}></i>
                  {editMode ? 'Cancel' : 'Edit'}
                </button>
              </div>
            </div>

            {editMode ? (
              <div className="space-y-6">
                {/* Template Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Layout Options */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Layout Settings</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Page Orientation</label>
                        <div className="flex bg-gray-100 rounded-xl p-1">
                          {['portrait', 'landscape'].map((orientation) => (
                            <button
                              key={orientation}
                              onClick={() => setTemplateSettings({...templateSettings, pageOrientation: orientation})}
                              className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer whitespace-nowrap capitalize ${
                                templateSettings.pageOrientation === orientation
                                  ? 'bg-white text-blue-600 shadow-sm'
                                  : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              {orientation}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo Position</label>
                        <select
                          value={templateSettings.logoPosition}
                          onChange={(e) => setTemplateSettings({...templateSettings, logoPosition: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white cursor-pointer pr-8"
                        >
                          <option value="top-left">Top Left</option>
                          <option value="top-center">Top Center</option>
                          <option value="top-right">Top Right</option>
                          <option value="bottom-center">Bottom Center</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Content Options */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Content Options</h4>
                    <div className="space-y-4">
                      {[
                        { key: 'includeCharts', label: 'Include Charts & Graphs' },
                        { key: 'includeRecommendations', label: 'Include Career Recommendations' },
                        { key: 'includeDetailedAnalysis', label: 'Include Detailed Analysis' }
                      ].map((option) => (
                        <label key={option.key} className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={templateSettings[option.key as keyof typeof templateSettings] as boolean}
                            onChange={(e) => setTemplateSettings({
                              ...templateSettings,
                              [option.key]: e.target.checked
                            })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                          />
                          <span className="text-gray-700 text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Color Scheme */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Color Scheme</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {colorSchemes.map((scheme) => (
                      <button
                        key={scheme.id}
                        onClick={() => setTemplateSettings({...templateSettings, colorScheme: scheme.id})}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          templateSettings.colorScheme === scheme.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: scheme.primary }}
                          ></div>
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: scheme.secondary }}
                          ></div>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{scheme.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Report Sections */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Report Sections</h4>
                  <div className="space-y-3">
                    {selectedTemplate.sections.map((section, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                        <div className="flex items-center">
                          <i className="ri-drag-move-line w-5 h-5 flex items-center justify-center text-gray-400 mr-3 cursor-move"></i>
                          <span className="font-medium text-gray-900">{section}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                            <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                          </button>
                          <button className="text-gray-400 hover:text-red-600 cursor-pointer">
                            <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                    <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-all cursor-pointer">
                      <i className="ri-add-line w-5 h-5 flex items-center justify-center mr-2 inline-block"></i>
                      Add Section
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-6 border-t border-gray-100">
                  <button
                    onClick={handleSaveTemplate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer whitespace-nowrap"
                  >
                    Save Template Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Template Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Template Info</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">Created: {selectedTemplate.createdDate}</p>
                      <p className="text-gray-600">Modified: {selectedTemplate.lastModified}</p>
                      <p className="text-gray-600">Sections: {selectedTemplate.sections.length}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Current Settings</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">Color: <span className="capitalize">{templateSettings.colorScheme}</span></p>
                      <p className="text-gray-600">Orientation: <span className="capitalize">{templateSettings.pageOrientation}</span></p>
                      <p className="text-gray-600">Charts: {templateSettings.includeCharts ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Usage Stats</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">Reports Generated: 1,247</p>
                      <p className="text-gray-600">This Month: 89</p>
                      <p className="text-gray-600">Success Rate: 99.2%</p>
                    </div>
                  </div>
                </div>

                {/* Section Preview */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Report Sections</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedTemplate.sections.map((section, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-xl">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-semibold text-sm mr-3">
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-900">{section}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Report Preview</h3>
              <button
                onClick={() => setPreviewMode(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[80vh]">
              <div className="bg-white shadow-lg rounded-lg p-8" style={{ aspectRatio: templateSettings.pageOrientation === 'portrait' ? '210/297' : '297/210' }}>
                {/* Sample Report Preview */}
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-blue-600 mb-2" style={{fontFamily: "Pacifico, serif"}}>Vijna X</h1>
                  <h2 className="text-xl font-semibold text-gray-900">Psychometric Assessment Report</h2>
                  <p className="text-gray-600 mt-2">Student Name: Sample Student</p>
                </div>

                <div className="space-y-6">
                  {selectedTemplate.sections.slice(0, 3).map((section, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{section}</h3>
                      <p className="text-gray-600 text-sm">
                        This section would contain detailed analysis and insights related to {section.toLowerCase()}.
                        The content would be dynamically generated based on the student's responses.
                      </p>
                      {templateSettings.includeCharts && index === 1 && (
                        <div className="mt-4 bg-gray-100 rounded-lg p-4 text-center text-gray-500 text-sm">
                          [Chart/Graph would appear here]
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="text-center text-gray-500 text-sm">
                    ... and {selectedTemplate.sections.length - 3} more sections
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
