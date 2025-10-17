
import { useState } from 'react';
import AdminLayout from '../layout/AdminLayout';

interface GatewayConfig {
  id: string;
  name: string;
  type: 'sms' | 'payment';
  provider: string;
  isEnabled: boolean;
  config: Record<string, any>;
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<'general' | 'sms' | 'payment' | 'admin'>('general');
  const [showApiModal, setShowApiModal] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<GatewayConfig | null>(null);

  const [generalSettings, setGeneralSettings] = useState({
          platformName: 'Career Compass',
          supportEmail: 'support@careercompass.com',
    supportPhone: '+91 98765 43210',
    maintenanceMode: false,
    autoBackup: true,
    maxTestDuration: 45,
    reportValidityDays: 365
  });

  const [smsGateways] = useState<GatewayConfig[]>([
    {
      id: 'twilio',
      name: 'Twilio SMS',
      type: 'sms',
      provider: 'Twilio',
      isEnabled: true,
      config: {
        accountSid: 'AC***************',
        authToken: '***************',
        fromNumber: '+1234567890'
      }
    },
    {
      id: 'textlocal',
      name: 'Textlocal',
      type: 'sms',
      provider: 'Textlocal',
      isEnabled: false,
      config: {
        apiKey: '***************',
        sender: 'CAREER COMPASS'
      }
    }
  ]);

  const [paymentGateways] = useState<GatewayConfig[]>([
    {
      id: 'razorpay',
      name: 'Razorpay',
      type: 'payment',
      provider: 'Razorpay',
      isEnabled: true,
      config: {
        keyId: 'rzp_test_***********',
        keySecret: '***************',
        webhookSecret: '***************'
      }
    },
    {
      id: 'payu',
      name: 'PayU',
      type: 'payment',
      provider: 'PayU',
      isEnabled: false,
      config: {
        merchantId: '***************',
        salt: '***************'
      }
    }
  ]);

  const [adminUsers] = useState([
    {
      id: '1',
      name: 'Super Admin',
              email: 'admin@careercompass.com',
      role: 'Super Admin',
      lastLogin: '2024-01-15 14:30:00',
      status: 'active'
    },
    {
      id: '2',
      name: 'Content Manager',
              email: 'content@careercompass.com',
      role: 'Content Manager',
      lastLogin: '2024-01-14 16:45:00',
      status: 'active'
    }
  ]);

  const handleSaveSettings = () => {
    console.log('Saving general settings:', generalSettings);
  };

  const handleConfigureGateway = (gateway: GatewayConfig) => {
    setSelectedGateway(gateway);
    setShowApiModal(true);
  };

  const handleToggleGateway = (gatewayId: string, type: 'sms' | 'payment') => {
    console.log(`Toggling ${type} gateway:`, gatewayId);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: 'ri-settings-3-line' },
    { id: 'sms', label: 'SMS Gateway', icon: 'ri-message-2-line' },
    { id: 'payment', label: 'Payment Gateway', icon: 'ri-bank-card-line' },
    { id: 'admin', label: 'Admin Users', icon: 'ri-user-settings-line' }
  ];

  return (
    <AdminLayout title="Settings">
      <div className="space-y-6">
        {/* Settings Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-6 py-4 font-medium whitespace-nowrap cursor-pointer transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-200'
                }`}
              >
                <i className={`${tab.icon} w-5 h-5 flex items-center justify-center mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {activeTab === 'general' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                    <input
                      type="text"
                      value={generalSettings.platformName}
                      onChange={(e) => setGeneralSettings({...generalSettings, platformName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                    <input
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={(e) => setGeneralSettings({...generalSettings, supportEmail: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Support Phone</label>
                    <input
                      type="tel"
                      value={generalSettings.supportPhone}
                      onChange={(e) => setGeneralSettings({...generalSettings, supportPhone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Test Duration (minutes)</label>
                    <input
                      type="number"
                      value={generalSettings.maxTestDuration}
                      onChange={(e) => setGeneralSettings({...generalSettings, maxTestDuration: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
                <div className="space-y-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={generalSettings.maintenanceMode}
                      onChange={(e) => setGeneralSettings({...generalSettings, maintenanceMode: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                    />
                    <div>
                      <span className="font-medium text-gray-900">Maintenance Mode</span>
                      <p className="text-sm text-gray-500">Temporarily disable platform access for users</p>
                    </div>
                  </label>

                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={generalSettings.autoBackup}
                      onChange={(e) => setGeneralSettings({...generalSettings, autoBackup: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                    />
                    <div>
                      <span className="font-medium text-gray-900">Auto Backup</span>
                      <p className="text-sm text-gray-500">Automatically backup data daily</p>
                    </div>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Report Validity (days)</label>
                    <input
                      type="number"
                      value={generalSettings.reportValidityDays}
                      onChange={(e) => setGeneralSettings({...generalSettings, reportValidityDays: parseInt(e.target.value)})}
                      className="w-full max-w-xs px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                    <p className="text-sm text-gray-500 mt-1">How long reports remain accessible to students</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <button
                  onClick={handleSaveSettings}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer whitespace-nowrap"
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'sms' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SMS Gateway Configuration</h3>
                <p className="text-gray-600 mb-6">Configure SMS providers for OTP and notifications</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {smsGateways.map((gateway) => (
                  <div key={gateway.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{gateway.name}</h4>
                        <p className="text-sm text-gray-500">{gateway.provider}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        gateway.isEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {gateway.isEnabled ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <button
                          onClick={() => handleToggleGateway(gateway.id, 'sms')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap ${
                            gateway.isEnabled
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {gateway.isEnabled ? 'Disable' : 'Enable'}
                        </button>
                      </div>

                      <button
                        onClick={() => handleConfigureGateway(gateway)}
                        className="w-full bg-blue-50 text-blue-600 py-3 rounded-xl font-medium hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        <i className="ri-settings-line w-4 h-4 flex items-center justify-center mr-2 inline-block"></i>
                        Configure API Settings
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center">
                  <i className="ri-information-line w-5 h-5 flex items-center justify-center text-yellow-600 mr-3"></i>
                  <div>
                    <p className="font-semibold text-yellow-800">SMS Gateway Priority</p>
                    <p className="text-yellow-700 text-sm">Only one SMS gateway can be active at a time. The active gateway will handle all SMS communications.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Gateway Configuration</h3>
                <p className="text-gray-600 mb-6">Configure payment providers for report purchases</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paymentGateways.map((gateway) => (
                  <div key={gateway.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{gateway.name}</h4>
                        <p className="text-sm text-gray-500">{gateway.provider}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        gateway.isEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {gateway.isEnabled ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Transaction Fee:</span>
                          <span className="font-medium">2.3% + ₹2</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span>Settlement:</span>
                          <span className="font-medium">T+2 days</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <span className="text-sm text-gray-600">Status:</span>
                        <button
                          onClick={() => handleToggleGateway(gateway.id, 'payment')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap ${
                            gateway.isEnabled
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {gateway.isEnabled ? 'Disable' : 'Enable'}
                        </button>
                      </div>

                      <button
                        onClick={() => handleConfigureGateway(gateway)}
                        className="w-full bg-blue-50 text-blue-600 py-3 rounded-xl font-medium hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        <i className="ri-settings-line w-4 h-4 flex items-center justify-center mr-2 inline-block"></i>
                        Configure API Settings
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center">
                  <i className="ri-shield-check-line w-5 h-5 flex items-center justify-center text-blue-600 mr-3"></i>
                  <div>
                    <p className="font-semibold text-blue-800">Security Notice</p>
                    <p className="text-blue-700 text-sm">All payment gateways use industry-standard encryption and comply with PCI DSS requirements.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Admin Users</h3>
                  <p className="text-gray-600">Manage admin access and permissions</p>
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold cursor-pointer whitespace-nowrap">
                  <i className="ri-user-add-line w-5 h-5 flex items-center justify-center mr-2 inline-block"></i>
                  Add Admin
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 rounded-xl">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">User</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Role</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Last Login</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {adminUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <img
                              src={`https://readdy.ai/api/search-image?query=Professional%20business%20person%20avatar%20for%20$%7Buser.name%7D%2C%20clean%20corporate%20headshot%20with%20professional%20attire%2C%20neutral%20background&width=40&height=40&seq=admin-user-${user.id}&orientation=squarish`}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover mr-3"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600 text-sm">{user.lastLogin}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <button className="text-blue-600 hover:text-blue-800 cursor-pointer">
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

              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <div className="flex items-center">
                  <i className="ri-alert-line w-5 h-5 flex items-center justify-center text-orange-600 mr-3"></i>
                  <div>
                    <p className="font-semibold text-orange-800">Permission Guidelines</p>
                    <p className="text-orange-700 text-sm">Super Admins have full access. Content Managers can only manage questions and reports.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* API Configuration Modal */}
      {showApiModal && selectedGateway && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">
                Configure {selectedGateway.name}
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center">
                  <i className="ri-information-line w-5 h-5 flex items-center justify-center text-yellow-600 mr-3"></i>
                  <p className="text-yellow-800 text-sm">
                    API credentials are encrypted and stored securely. Never share these credentials.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(selectedGateway.config).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <input
                      type="password"
                      value={value as string}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                      placeholder="Enter your API credential"
                      readOnly
                    />
                  </div>
                ))}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center">
                  <i className="ri-check-line w-5 h-5 flex items-center justify-center text-green-600 mr-3"></i>
                  <p className="text-green-800 text-sm">
                    Connection Status: <span className="font-semibold">Active & Verified</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end space-x-4">
              <button
                onClick={() => setShowApiModal(false)}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium cursor-pointer whitespace-nowrap"
              >
                Close
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold cursor-pointer whitespace-nowrap">
                Test Connection
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold cursor-pointer whitespace-nowrap">
                Update Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
