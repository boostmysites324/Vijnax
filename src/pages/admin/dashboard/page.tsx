
import { useState } from 'react';
import AdminLayout from '../layout/AdminLayout';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
  color: string;
}

function StatCard({ title, value, change, trend, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <div className={`flex items-center mt-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <i className={`ri-arrow-${trend === 'up' ? 'up' : 'down'}-line w-4 h-4 flex items-center justify-center mr-1`}></i>
            <span className="text-sm font-semibold">{change}</span>
            <span className="text-gray-500 text-sm ml-1">this month</span>
          </div>
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <i className={`${icon} w-6 h-6 flex items-center justify-center text-white`}></i>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('7d');

  const stats = [
    {
      title: 'Total Tests Taken',
      value: '2,847',
      change: '+12.5%',
      trend: 'up' as const,
      icon: 'ri-file-list-3-line',
      color: 'bg-blue-500'
    },
    {
      title: 'Reports Generated',
      value: '2,234',
      change: '+8.2%',
      trend: 'up' as const,
      icon: 'ri-file-text-line',
      color: 'bg-green-500'
    },
    {
      title: 'Total Revenue',
      value: '₹4,44,866',
      change: '+15.3%',
      trend: 'up' as const,
      icon: 'ri-money-rupee-circle-line',
      color: 'bg-purple-500'
    },
    {
      title: 'Active Users',
      value: '1,429',
      change: '-2.1%',
      trend: 'down' as const,
      icon: 'ri-user-3-line',
      color: 'bg-orange-500'
    }
  ];

  const streamData = [
    { name: 'Science', tests: 1247, percentage: 45 },
    { name: 'Commerce', tests: 892, percentage: 32 },
    { name: 'Arts', tests: 634, percentage: 23 }
  ];

  const recentPayments = [
    {
      id: 'VX2024001234',
      student: 'Rahul Sharma',
      amount: '₹199',
      status: 'Success',
      date: '2024-01-15',
      time: '14:30'
    },
    {
      id: 'VX2024001233',
      student: 'Priya Singh',
      amount: '₹199',
      status: 'Success',
      date: '2024-01-15',
      time: '13:45'
    },
    {
      id: 'VX2024001232',
      student: 'Amit Kumar',
      amount: '₹199',
      status: 'Pending',
      date: '2024-01-15',
      time: '12:20'
    },
    {
      id: 'VX2024001231',
      student: 'Sneha Patel',
      amount: '₹199',
      status: 'Success',
      date: '2024-01-15',
      time: '11:15'
    }
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Time Range Selector */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
            <p className="text-gray-500 text-sm">Platform performance and metrics</p>
          </div>
          <div className="flex bg-gray-100 rounded-xl p-1">
            {['24h', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer whitespace-nowrap ${
                  timeRange === range
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stream Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Stream Distribution</h3>
            <div className="space-y-4">
              {streamData.map((stream, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700">{stream.name}</span>
                    <span className="text-sm text-gray-500">{stream.tests} tests</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${stream.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {stream.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Tests Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Tests</h3>
            <div className="flex items-end justify-between h-48 space-x-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                const heights = [65, 80, 45, 90, 75, 55, 70];
                return (
                  <div key={day} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-blue-500 rounded-t-lg mb-2 hover:bg-blue-600 transition-colors cursor-pointer"
                      style={{ height: `${heights[index]}%` }}
                      title={`${day}: ${Math.round(heights[index] * 3)} tests`}
                    ></div>
                    <span className="text-xs text-gray-500 font-medium">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
              <button
                onClick={() => window.REACT_APP_NAVIGATE('/admin/payments')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer whitespace-nowrap"
              >
                View all
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Transaction ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Student</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Amount</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="py-4 px-6 font-mono text-sm text-blue-600">{payment.id}</td>
                    <td className="py-4 px-6 font-medium text-gray-900">{payment.student}</td>
                    <td className="py-4 px-6 font-semibold text-gray-900">{payment.amount}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.status === 'Success' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm">
                      {payment.date} at {payment.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
