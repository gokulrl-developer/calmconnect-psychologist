import React, { useState } from 'react';
import { MessageCircle, FileText, Filter, CalendarDays, Info, X, ShieldAlert } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const wrongActionsData = [
  {
    id: 1,
    date: '2025-07-20',
    time: '14:30',
    status: 'Pending',
    description: 'Patient record was edited without proper authorization. Please review the changes and provide an explanation for the action taken.',
    hasExplanation: true,
    adminNotes: 'Check audit logs for details.',
    actionsTaken: 'Warning issued. Account under review.',
    chat: [
      { sender: 'admin', text: 'Please explain why you edited the record.' },
      { sender: 'user', text: 'It was an urgent correction.' },
      { sender: 'admin', text: 'Please provide supporting documents.' }
    ]
  },
  {
    id: 2,
    date: '2025-07-18',
    time: '09:15',
    status: 'Resolved',
    description: 'Session was started late by 20 minutes. Please ensure timely session starts.',
    hasExplanation: false,
    adminNotes: '',
    actionsTaken: 'Suspended for 2 weeks.',
    chat: [
      { sender: 'admin', text: 'Session started late. Please be punctual.' },
      { sender: 'user', text: 'Sorry, there was a technical issue.' },
      { sender: 'admin', text: 'Noted. Please avoid recurrence.' }
    ]
  },
  {
    id: 3,
    date: '2025-07-10',
    time: '11:00',
    status: 'Explanation Needed',
    description: 'Appointment was cancelled without notifying the patient. Please provide a reason and attach supporting documents if any.',
    hasExplanation: true,
    adminNotes: 'Patient complaint received.',
    actionsTaken: 'Blocked for 1 week.',
    chat: [
      { sender: 'admin', text: 'Why was the appointment cancelled?' },
      { sender: 'user', text: 'Patient requested cancellation.' },
      { sender: 'admin', text: 'Please ensure proper notification next time.' }
    ]
  }
];

const months = [
  { value: 7, label: 'July' },
  { value: 6, label: 'June' },
  { value: 5, label: 'May' }
];

const years = [2025, 2024, 2023];

const WrongActions: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(7);
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  // Modal states
  const [descModal, setDescModal] = useState<{ open: boolean, desc: string }>({ open: false, desc: '' });
  const [chatModal, setChatModal] = useState<{ open: boolean, actionId: number | null }>({ open: false, actionId: null });
  const [explanationModal, setExplanationModal] = useState<{ open: boolean, actionId: number | null }>({ open: false, actionId: null });
  const [actionsModal, setActionsModal] = useState<{ open: boolean, actionId: number | null }>({ open: false, actionId: null });

  // Explanation modal fields
  const [explanationText, setExplanationText] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  // Reset explanation modal fields when modal closes
  React.useEffect(() => {
    if (!explanationModal.open) {
      setExplanationText('');
      setAttachedFile(null);
    }
  }, [explanationModal.open]);

  const filteredActions = wrongActionsData.filter(
    wa => new Date(wa.date).getMonth() + 1 === selectedMonth && new Date(wa.date).getFullYear() === selectedYear
  );

  // Modal close helpers
  const closeDescModal = () => setDescModal({ open: false, desc: '' });
  const closeChatModal = () => setChatModal({ open: false, actionId: null });
  const closeExplanationModal = () => setExplanationModal({ open: false, actionId: null });
  const closeActionsModal = () => setActionsModal({ open: false, actionId: null });

  // Summary calculation
  const summary = {
    warnings: wrongActionsData.filter(a => a.actionsTaken?.toLowerCase().includes('warning')).length,
    suspended: wrongActionsData.filter(a => a.actionsTaken?.toLowerCase().includes('suspended')).length,
    blocked: wrongActionsData.filter(a => a.actionsTaken?.toLowerCase().includes('blocked')).length,
    inactive: wrongActionsData.filter(a => a.status === 'Inactive').length,
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
          <Info className="w-6 h-6 mr-2 text-red-500" />
          Wrong Actions
        </h1>
        {/* Summary Section */}
        <div className="flex items-center space-x-6 mb-6 bg-white rounded-lg shadow border p-4">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-gray-700">Warnings:</span>
            <span className="text-gray-900">{summary.warnings}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <span className="font-semibold text-gray-700">Suspended (2 weeks):</span>
            <span className="text-gray-900">{summary.suspended}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-gray-700">Blocked:</span>
            <span className="text-gray-900">{summary.blocked}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-gray-400" />
            <span className="font-semibold text-gray-700">Inactive:</span>
            <span className="text-gray-900">{summary.inactive}</span>
          </div>
        </div>
        {/* Filters */}
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            className="border rounded px-2 py-1"
            value={selectedMonth}
            onChange={e => setSelectedMonth(Number(e.target.value))}
          >
            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <CalendarDays className="w-5 h-5 text-gray-500" />
          <select
            className="border rounded px-2 py-1"
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        {/* Wrong Actions List */}
        <div className="space-y-4">
          {filteredActions.length === 0 && (
            <div className="text-gray-500 text-center py-8">No wrong actions found for selected month/year.</div>
          )}
          {filteredActions.map(action => (
            <Card key={action.id} className="p-4 rounded-lg shadow border flex flex-col md:flex-row md:items-center justify-between bg-white">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <span className="font-semibold text-gray-700">{action.date} {action.time}</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${action.status === 'Resolved' ? 'bg-green-100 text-green-700' : action.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {action.status}
                  </span>
                </div>
                <div className="text-gray-700">
                  {action.description.length > 50
                    ? <>
                        {action.description.slice(0, 50)}
                        <span
                          className="text-blue-600 cursor-pointer ml-1"
                          onClick={() => setDescModal({ open: true, desc: action.description })}
                        >...more</span>
                      </>
                    : action.description
                  }
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 mt-4 md:mt-0">
                <Button
                  variant="outline"
                  className="flex items-center"
                  onClick={() => setChatModal({ open: true, actionId: action.id })}
                >
                  <MessageCircle className="w-4 h-4 mr-1" /> View Chat
                </Button>
                {action.hasExplanation && (
                  <Button
                    variant="primary"
                    className="flex items-center"
                    onClick={() => setExplanationModal({ open: true, actionId: action.id })}
                  >
                    <FileText className="w-4 h-4 mr-1" /> Explanation
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="flex items-center"
                  onClick={() => setActionsModal({ open: true, actionId: action.id })}
                >
                  <ShieldAlert className="w-4 h-4 mr-1" /> Actions Taken
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
      {/* Description Modal */}
      {descModal.open && (
        <Modal onClose={closeDescModal}>
          <h2 className="font-bold mb-2">Description</h2>
          <div className="text-gray-700 mb-4">{descModal.desc}</div>
          <Button variant="primary" onClick={closeDescModal}>Close</Button>
        </Modal>
      )}
      {/* Chat Modal */}
      {chatModal.open && (
        <Modal onClose={closeChatModal}>
          <h2 className="font-bold mb-2">Chat with Admin</h2>
          <div className="bg-gray-100 rounded p-2 mb-2 text-sm text-gray-700 max-h-48 overflow-y-auto">
            {wrongActionsData.find(a => a.id === chatModal.actionId)?.chat.map((msg, idx) => (
              <div key={idx} className={`mb-2 flex ${msg.sender === 'admin' ? 'justify-start' : 'justify-end'}`}>
                <div className={`px-3 py-2 rounded-lg text-sm ${msg.sender === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                  <span className="font-semibold">{msg.sender === 'admin' ? 'Admin' : 'You'}: </span>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <input type="text" className="border rounded w-full p-2 mb-2" placeholder="Type your message..." />
          <Button variant="primary" onClick={closeChatModal}>Close</Button>
        </Modal>
      )}
      {/* Explanation Modal */}
      {explanationModal.open && (
        <Modal onClose={closeExplanationModal}>
          <h2 className="font-bold mb-2">Explanation</h2>
          <div className="mb-2 text-gray-600">
            Admin Notes: <span className="font-semibold">
              {wrongActionsData.find(a => a.id === explanationModal.actionId)?.adminNotes}
            </span>
          </div>
          <textarea
            className="border rounded w-full p-2 mb-2"
            rows={3}
            placeholder="Type your explanation..."
            value={explanationText}
            onChange={e => setExplanationText(e.target.value)}
          />
          <div className="mb-2">
            <label className="block mb-1 font-medium">Attach File:</label>
            <input
              type="file"
              onChange={e => setAttachedFile(e.target.files?.[0] || null)}
              className="border rounded p-1 w-full"
            />
            {attachedFile && <div className="text-xs mt-1 text-gray-500">Attached: {attachedFile.name}</div>}
          </div>
          <Button
            variant="primary"
            className="mr-2"
            onClick={() => {
              // Submit logic here if needed
              closeExplanationModal();
            }}
          >Submit</Button>
          <Button variant="outline" onClick={closeExplanationModal}>Cancel</Button>
        </Modal>
      )}
      {/* Actions Taken Modal */}
      {actionsModal.open && (
        <Modal onClose={closeActionsModal}>
          <h2 className="font-bold mb-2">Actions Taken</h2>
          <div className="text-gray-700 mb-4">
            {wrongActionsData.find(a => a.id === actionsModal.actionId)?.actionsTaken || 'No actions taken.'}
          </div>
          <Button variant="primary" onClick={closeActionsModal}>Close</Button>
        </Modal>
      )}
    </div>
  );
};

const Modal: React.FC<{ onClose: () => void, children: React.ReactNode }> = ({ onClose, children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded-lg shadow-lg min-w-[320px] max-w-[480px] relative border border-gray-200">
      <button className="absolute top-2 right-2" onClick={onClose}><X /></button>
      {children}
    </div>
  </div>
);

export default WrongActions;