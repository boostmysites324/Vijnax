
import { useState } from 'react';
import AdminLayout from '../layout/AdminLayout';

interface Payment {
  id: string;
  student: string;
  email: string;
  phone: string;
  amount: number;
  status: 'Success' | 'Pending' | 'Failed' | 'Refunded';
  paymentMethod: string;
  transactionDate: string;
  reportGenerated: boolean;
}

export default function AdminPayments() {
  const [payments] = useState<Payment[]>([
    {
      id: 'VX2024001234',
      student: 'Rahul Sharma',
      email: 'rahul.sharma@email.com',
      phone: '+91 98765 43210',
      amount: 199,
      status: 'Success',
      paymentMethod: 'UPI - GPay',
      transactionDate: '2024-01-15T14:30:00Z',
      reportGenerated: true
    },
    {
      id: 'VX2024001233',
      student: 'Priya Singh',
      email: 'priya.singh@email.com',
      phone: '+91 87654 32109',
      amount: 199,
      status: 'Success',
      paymentMethod: 'UPI - PhonePe',
      transactionDate: '2024-01-15T13:45:00Z',
      reportGenerated: true
    },
    {
      id: 'VX2024001232',
      student: 'Amit Kumar',
      email: 'amit.kumar@email.com',
      phone: '+91 76543 21098',
      amount: 199,
      status: 'Pending',
      paymentMethod: 'UPI - Paytm',
      transactionDate: '2024-01-15T12:20:00Z',
      reportGenerated: false
    },
    {
      id: 'VX2024001231',
      student: 'Sneha Patel',
      email: 'sneha.patel@email.com',
      phone: '+91 65432 10987',
      amount: 199,
      status: 'Success',
      paymentMethod: 'QR Code',
      transactionDate: '2024-01-15T11:15:00Z',
      reportGenerated: true
    },
    {
      id: 'VX2024001230',
      student: 'Vikram Gupta',
      email: 'vikram.gupta@email.com',
      phone: '+91 54321 09876',
      amount: 199,
      status: 'Failed',
      paymentMethod: 'UPI - GPay',
      transactionDate: '2024-01-15T10:30:00Z',
      reportGenerated: false
    },
    {
      id: 'VX2024001229',
      student: 'Anjali Reddy',
      email: 'anjali.reddy@email.com',
      phone: '+91 43210 98765',
      amount: 199,
      status: 'Refunded',
      paymentMethod: 'UPI - PhonePe',
      transactionDate: '2024-01-14T16:45:00Z',
      reportGenerated: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showExportModal, setShowExportModal] = useState(false);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    const matchesDate = dateFilter === 'all' || 
      (dateFilter === 'today' && new Date(payment.transactionDate).toDateString() === new Date().toDateString()) ||
      (dateFilter === 'week' && new Date(payment.transactionDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const totalRevenue = payments
    .filter(p => p.status === 'Success')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleExport = (format: string) => {
    // Simulate export functionality
    console.log(`Exporting ${filteredPayments.length} payments as ${format}`);
    setShowExportModal(false);
  };

  const handleRefund = (paymentId: string) => {
    // Simulate refund process
    console.log(`Processing refund for payment ${paymentId}`);
  };

  const handleResendReport = (paymentId: string) => {
    // Simulate report resend
    console.log(`Resending report for payment ${paymentId}`);
  };

  return (
    <AdminLayout title="Payments">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <i className="ri-money-rupee-circle-fill w-10 h-10 flex items-center justify-center text-green-500 bg-green-100 rounded-xl"></i>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Successful</p>
                <p className="text-2xl font-bold text-blue-600">{payments.filter(p => p.status === 'Success').length}</p>
              </div>
              <i className="ri-check-double-line w-10 h-10 flex items-center justify-center text-blue-500 bg-blue-100 rounded-xl"></i>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{payments.filter(p => p.status === 'Pending').length}</p>
              </div>
              <i className="ri-time-line w-10 h-10 flex items-center justify-center text-yellow-500 bg-yellow-100 rounded-xl"></i>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Failed</p>
                <p className="text-2xl font-bold text-red-600">{payments.filter(p => p.status === 'Failed').length}</p>
              </div>
              <i className="ri-close-circle-line w-10 h-10 flex items-center justify-center text-red-500 bg-red-100 rounded-xl"></i>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Payments</label>
              <div className="relative">
                <i className="ri-search-line w-5 h-5 flex items-center justify-center absolute left-3 top-3 text-gray-400"></i>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by ID, name, email, or phone..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white cursor-pointer pr-8"
              >
                <option value="all">All Status</option>
                <option value="Success">Success</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white cursor-pointer pr-8"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setShowExportModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                <i className="ri-download-line w-5 h-5 flex items-center justify-center mr-2 inline-block"></i>
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Transaction ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Student Details</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Amount</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Method</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Date & Time</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map((payment) => {
                  const { date, time } = formatDate(payment.transactionDate);
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-mono text-sm text-blue-600">{payment.id}</td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-900">{payment.student}</p>
                          <p className="text-sm text-gray-500">{payment.email}</p>
                          <p className="text-sm text-gray-500">{payment.phone}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-gray-900">₹{payment.amount}</td>
                      <td className="py-4 px-6 text-gray-600 text-sm">{payment.paymentMethod}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                        {payment.reportGenerated && (
                          <i className="ri-file-text-line w-4 h-4 flex items-center justify-center text-green-600 ml-2 inline-block" title="Report Generated"></i>
                        )}
                      </td>
                      <td className="py-4 px-6 text-gray-600 text-sm">
                        <div>{date}</div>
                        <div className="text-xs text-gray-500">{time}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          {payment.status === 'Success' && !payment.reportGenerated && (
                            <button
                              onClick={() => handleResendReport(payment.id)}
                              className="text-blue-600 hover:text-blue-800 cursor-pointer"
                              title="Resend Report"
                            >
                              <i className="ri-send-plane-line w-4 h-4 flex items-center justify-center"></i>
                            </button>
                          )}
                          {payment.status === 'Success' && (
                            <button
                              onClick={() => handleRefund(payment.id)}
                              className="text-orange-600 hover:text-orange-800 cursor-pointer"
                              title="Process Refund"
                            >
                              <i className="ri-refund-line w-4 h-4 flex items-center justify-center"></i>
                            </button>
                          )}
                          <button
                            className="text-gray-600 hover:text-gray-800 cursor-pointer"
                            title="View Details"
                          >
                            <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <i className="ri-money-dollar-circle-line w-16 h-16 flex items-center justify-center text-gray-300 mx-auto mb-4 text-5xl"></i>
              <p className="text-gray-500">No payments found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">Export Payments</h3>
              <p className="text-gray-500 text-sm mt-1">Choose export format for {filteredPayments.length} payments</p>
            </div>
            
            <div className="p-6 space-y-4">
              <button
                onClick={() => handleExport('csv')}
                className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
              >
                <i className="ri-file-text-line w-8 h-8 flex items-center justify-center text-green-600 mr-4"></i>
                <div className="text-left">
                  <p className="font-medium text-gray-900">CSV File</p>
                  <p className="text-sm text-gray-500">Comma-separated values for spreadsheet apps</p>
                </div>
              </button>

              <button
                onClick={() => handleExport('excel')}
                className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
              >
                <i className="ri-file-excel-2-line w-8 h-8 flex items-center justify-center text-green-600 mr-4"></i>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Excel File</p>
                  <p className="text-sm text-gray-500">Microsoft Excel format with formatting</p>
                </div>
              </button>

              <button
                onClick={() => handleExport('pdf')}
                className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
              >
                <i className="ri-file-pdf-line w-8 h-8 flex items-center justify-center text-red-600 mr-4"></i>
                <div className="text-left">
                  <p className="font-medium text-gray-900">PDF Report</p>
                  <p className="text-sm text-gray-500">Formatted report suitable for printing</p>
                </div>
              </button>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end space-x-4">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
