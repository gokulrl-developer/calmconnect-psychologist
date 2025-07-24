import React, { useState } from 'react';
import { Wallet, Download, Eye, Calendar, DollarSign, FileText, Printer } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useTheme } from '../contexts/ThemeContext';

interface WalletTransaction {
  id: string;
  date: string;
  time: string;
  description: string;
  sessionId?: string;
  patientName?: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'failed';
  receiptUrl?: string;
}

const WalletPage: React.FC = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<WalletTransaction | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const { isDarkMode } = useTheme();

  // Mock wallet transactions
  const transactions: WalletTransaction[] = [
    {
      id: 'TXN001',
      date: '2024-01-15',
      time: '10:30 AM',
      description: 'Session Payment - Anxiety Counseling',
      sessionId: 'S001',
      patientName: 'John Doe',
      amount: 2500,
      type: 'credit',
      status: 'completed',
      receiptUrl: '#'
    },
    {
      id: 'TXN002',
      date: '2024-01-14',
      time: '2:15 PM',
      description: 'Session Payment - Depression Therapy',
      sessionId: 'S005',
      patientName: 'Sarah Miller',
      amount: 3000,
      type: 'credit',
      status: 'completed',
      receiptUrl: '#'
    },
    {
      id: 'TXN003',
      date: '2024-01-13',
      time: '11:45 AM',
      description: 'Platform Commission',
      amount: 250,
      type: 'debit',
      status: 'completed',
      receiptUrl: '#'
    },
    {
      id: 'TXN004',
      date: '2024-01-12',
      time: '4:20 PM',
      description: 'Session Payment - Relationship Counseling',
      sessionId: 'S003',
      patientName: 'Mike Rodriguez',
      amount: 2800,
      type: 'credit',
      status: 'pending',
      receiptUrl: '#'
    },
    {
      id: 'TXN005',
      date: '2024-01-11',
      time: '9:30 AM',
      description: 'Withdrawal to Bank Account',
      amount: 15000,
      type: 'debit',
      status: 'completed',
      receiptUrl: '#'
    }
  ];

  const totalBalance = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + (t.type === 'credit' ? t.amount : -t.amount), 0);

  const pendingAmount = transactions
    .filter(t => t.status === 'pending' && t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'credit' 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-red-600 dark:text-red-400';
  };

  const handleViewReceipt = (transaction: WalletTransaction) => {
    setSelectedTransaction(transaction);
    setReceiptModalOpen(true);
  };

  const handlePrintReceipt = (transaction: WalletTransaction) => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt - ${transaction.id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .details { margin-bottom: 20px; }
              .amount { font-size: 24px; font-weight: bold; color: ${transaction.type === 'credit' ? 'green' : 'red'}; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>CalmConnect</h1>
              <h2>Payment Receipt</h2>
            </div>
            <div class="details">
              <p><strong>Transaction ID:</strong> ${transaction.id}</p>
              <p><strong>Date:</strong> ${transaction.date} ${transaction.time}</p>
              <p><strong>Description:</strong> ${transaction.description}</p>
              ${transaction.patientName ? `<p><strong>Patient:</strong> ${transaction.patientName}</p>` : ''}
              ${transaction.sessionId ? `<p><strong>Session ID:</strong> ${transaction.sessionId}</p>` : ''}
              <p><strong>Status:</strong> ${transaction.status}</p>
              <p class="amount"><strong>Amount:</strong> ${transaction.type === 'credit' ? '+' : '-'}₹${transaction.amount}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Wallet
        </h1>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover className="animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Available Balance
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                ₹{totalBalance.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
              <Wallet className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card hover className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Pending Amount
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                ₹{pendingAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card hover className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                This Month
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                ₹{(totalBalance * 0.3).toFixed(0)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
          Transaction History
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">
                  Transaction ID
                </th>
                <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">
                  Date & Time
                </th>
                <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">
                  Description
                </th>
                <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">
                  Amount
                </th>
                <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr
                  key={transaction.id}
                  className={`
                    border-b border-gray-100 dark:border-gray-800 
                    hover:bg-gray-50 dark:hover:bg-gray-700/50 
                    transition-colors animate-slide-up
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="py-4 px-2">
                    <span className="font-medium text-gray-800 dark:text-white">
                      {transaction.id}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="text-sm">
                      <div className="text-gray-800 dark:text-white">{transaction.date}</div>
                      <div className="text-gray-600 dark:text-gray-400">{transaction.time}</div>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="text-sm">
                      <div className="text-gray-800 dark:text-white">{transaction.description}</div>
                      {transaction.patientName && (
                        <div className="text-gray-600 dark:text-gray-400">Patient: {transaction.patientName}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <span className={`font-medium ${getTypeColor(transaction.type)}`}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewReceipt(transaction)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePrintReceipt(transaction)}
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Receipt Modal */}
      {receiptModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`
            w-full max-w-md rounded-2xl border
            ${isDarkMode 
              ? 'bg-gray-800/90 border-gray-700' 
              : 'bg-white/90 border-gray-200'
            } 
            backdrop-blur-xl glassmorphism animate-fade-in
          `}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Receipt Details
              </h3>
              <button
                onClick={() => setReceiptModalOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="text-center mb-6">
                <h4 className="text-xl font-bold text-gray-800 dark:text-white">CalmConnect</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Payment Receipt</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                  <span className="font-medium text-gray-800 dark:text-white">{selectedTransaction.id}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Date & Time:</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {selectedTransaction.date} {selectedTransaction.time}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Description:</span>
                  <span className="font-medium text-gray-800 dark:text-white text-right">
                    {selectedTransaction.description}
                  </span>
                </div>
                
                {selectedTransaction.patientName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Patient:</span>
                    <span className="font-medium text-gray-800 dark:text-white">{selectedTransaction.patientName}</span>
                  </div>
                )}
                
                {selectedTransaction.sessionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Session ID:</span>
                    <span className="font-medium text-gray-800 dark:text-white">{selectedTransaction.sessionId}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTransaction.status)}`}>
                    {selectedTransaction.status}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-lg font-medium text-gray-800 dark:text-white">Amount:</span>
                  <span className={`text-xl font-bold ${getTypeColor(selectedTransaction.type)}`}>
                    {selectedTransaction.type === 'credit' ? '+' : '-'}₹{selectedTransaction.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setReceiptModalOpen(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handlePrintReceipt(selectedTransaction)}
                  className="flex-1"
                >
                  <Printer className="w-4 h-4 mr-1" />
                  Print
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;