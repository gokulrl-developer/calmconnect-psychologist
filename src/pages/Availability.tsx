import React, { useState } from 'react';
import { Calendar, List, Layers, AlertTriangle, Plus, Trash2, Edit, ChevronLeft, ChevronRight, X, User } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

// Dummy data for demonstration
const dummyConflicts = [
  { date: '2025-07-24', count: 2 },
  { date: '2025-07-26', count: 1 }
];

const dummySlots = [
  { id: 1, from: '09:00', to: '10:00', duration: '30m', referred: false, slots: ['09:00', '09:30'], referredSlots: ['09:30'] },
  { id: 2, from: '10:00', to: '11:00', duration: '30m', referred: true, slots: ['10:00', '10:30'], referredSlots: ['10:00'] }
];

const dummyEmergencySlots = [
  { id: 99, from: '08:00', to: '08:30', duration: '30m', referred: false, emergency: true, slots: ['08:00'], patient: { id: 1, name: 'John Doe' }, openTime: '2025-07-24T07:45' }
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getMonthDays(year: number, month: number) {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

const Availability: React.FC = () => {
  // Navigation state
  const [activeTab, setActiveTab] = useState<'summary' | 'slotwise' | 'referred'>('summary');
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [showOpenAvailModal, setShowOpenAvailModal] = useState(false);
  const [showDeleteAvailModal, setShowDeleteAvailModal] = useState(false);
  const [showConflictsModal, setShowConflictsModal] = useState(false);
  const [showSlotBlockModal, setShowSlotBlockModal] = useState(false);
  const [showBlockConflictsModal, setShowBlockConflictsModal] = useState(false);
  const [showEditBlockModal, setShowEditBlockModal] = useState(false);
  const [showEmergencySlotModal, setShowEmergencySlotModal] = useState(false);
  const [showReferredSlotModal, setShowReferredSlotModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [editBlock, setEditBlock] = useState<any>(null);
  const [deletedSlots, setDeletedSlots] = useState<{ [blockId: number]: string[] }>({});
  const [showSelectDays, setShowSelectDays] = useState(false);
  const [emergencyPatient, setEmergencyPatient] = useState('');
  const [emergencyPatientSuggestions, setEmergencyPatientSuggestions] = useState<{ id: number, name: string }[]>([]);
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  // For slotwise navigation
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7);

  // Helper for conflicts
  const conflictsForMonth = dummyConflicts.filter(
    c => new Date(c.date).getMonth() === month && new Date(c.date).getFullYear() === year
  );

  // --- UI Components ---
  const renderTabs = () => (
    <div className="flex space-x-2 mb-6 border-b pb-3 bg-white sticky top-0 z-10" style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.01)' }}>
      <Button
        variant={activeTab === 'summary' ? 'primary' : 'outline'}
        onClick={() => setActiveTab('summary')}
        className="rounded-t-lg border-b-2"
        style={activeTab === 'summary'
          ? { borderColor: '#22c55e', background: '#f6fef9', color: '#166534' }
          : { borderColor: 'transparent' }
        }
      >
        <List className="w-4 h-4 mr-1" /> Availability Summary
      </Button>
      <Button
        variant={activeTab === 'slotwise' ? 'primary' : 'outline'}
        onClick={() => setActiveTab('slotwise')}
        className="rounded-t-lg border-b-2"
        style={activeTab === 'slotwise'
          ? { borderColor: '#0ea5e9', background: '#f0f9ff', color: '#075985' }
          : { borderColor: 'transparent' }
        }
      >
        <Layers className="w-4 h-4 mr-1" /> Slot Wise Availability
      </Button>
      <Button
        variant={activeTab === 'referred' ? 'primary' : 'outline'}
        onClick={() => setActiveTab('referred')}
        className="rounded-t-lg border-b-2"
        style={activeTab === 'referred'
          ? { borderColor: '#2563eb', background: '#eef2ff', color: '#1e40af' }
          : { borderColor: 'transparent' }
        }
      >
        <AlertTriangle className="w-4 h-4 mr-1" /> Referred Slots
      </Button>
    </div>
  );

  // --- Availability Summary Page ---
  const renderSummary = () => {
    const days = getMonthDays(year, month);
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex space-x-2">
            <Button variant="primary" onClick={() => setShowOpenAvailModal(true)}>
              <Plus className="w-4 h-4 mr-1" /> Open Availability
            </Button>
            <Button variant="outline" onClick={() => setShowDeleteAvailModal(true)}>
              <Trash2 className="w-4 h-4 mr-1" /> Delete Availability
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => {
              if (month === 0) { setMonth(11); setYear(year - 1); }
              else setMonth(month - 1);
            }}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-semibold">{new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
            <Button variant="outline" onClick={() => {
              if (month === 11) { setMonth(0); setYear(year + 1); }
              else setMonth(month + 1);
            }}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="danger" onClick={() => setShowConflictsModal(true)}>
            {conflictsForMonth.length} Conflicts
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-2 mt-4">
          {weekDays.map(day => (
            <div key={day} className="text-center font-bold">{day}</div>
          ))}
          {days.map(date => {
            // Dummy logic for slots/referred
            const dateStr = date.toISOString().slice(0, 10);
            const hasSlots = dateStr === '2025-07-24' || dateStr === '2025-07-26';
            const referredCount = dateStr === '2025-07-24' ? 1 : 0;
            return (
              <button
                key={date.toISOString()}
                className={`
                  flex flex-col items-center justify-center rounded border text-xs p-2 transition
                  ${hasSlots
                    ? 'border-green-500 bg-green-50 hover:bg-green-100'
                    : 'border-gray-200 bg-white hover:bg-gray-50'}
                  shadow-sm
                `}
                style={{
                  minHeight: 60,
                  outline: 'none',
                  marginBottom: 2,
                  marginTop: 2,
                  cursor: hasSlots ? 'pointer' : 'default'
                }}
                onClick={() => hasSlots && (setActiveTab('slotwise'), setSelectedDay(date))}
              >
                <div className="font-semibold">{date.getDate()}</div>
                <div>
                  <span className="text-gray-700">Slots: </span>
                  <span className="font-bold">{hasSlots ? 2 : 0}</span>
                </div>
                <div>
                  <span className="text-gray-700">Referred: </span>
                  <span className="font-bold px-2 py-0.5 rounded"
                    style={{
                      background: referredCount ? '#e0e7ff' : 'transparent',
                      color: referredCount ? '#2563eb' : '#64748b'
                    }}
                  >{referredCount}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // --- Slotwise Availability Page ---
  const renderSlotwise = () => {
    // Calculate week days
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
    const selected = selectedDay || weekDates[0];

    // Emergency slots at top
    const emergencyBlocks = dummyEmergencySlots.filter(b => true); // filter for selected day if needed
    const normalBlocks = dummySlots;

    // Helper for slot deletion
    const isSlotDeleted = (blockId: number, slot: string) =>
      deletedSlots[blockId] && deletedSlots[blockId].includes(slot);

    const handleDeleteSlot = (blockId: number, slot: string) => {
      setDeletedSlots(prev => ({
        ...prev,
        [blockId]: [...(prev[blockId] || []), slot]
      }));
    };

    const handleResetSlots = (blockId: number) => {
      setDeletedSlots(prev => ({ ...prev, [blockId]: [] }));
    };

    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setWeekOffset(weekOffset - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {weekDates.map((d, idx) => (
              <Button
                key={idx}
                variant={d.toDateString() === selected.toDateString() ? 'primary' : 'outline'}
                onClick={() => setSelectedDay(d)}
                size="sm"
              >
                {weekDays[d.getDay()]} {d.getDate()}
              </Button>
            ))}
            <Button variant="outline" onClick={() => setWeekOffset(weekOffset + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="danger" onClick={() => setShowConflictsModal(true)}>
            Show Conflicts
          </Button>
          <Button variant="outline" onClick={() => setShowDeleteAvailModal(true)}>
            <Trash2 className="w-4 h-4 mr-1" /> Delete Day
          </Button>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-lg">
              {selected.toLocaleDateString()}
            </span>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowEmergencySlotModal(true)}>
                <Plus className="w-4 h-4 mr-1" /> Create Emergency Slot
              </Button>
              <Button variant="primary" onClick={() => setShowSlotBlockModal(true)}>
                <Plus className="w-4 h-4 mr-1" /> Create Availability Block
              </Button>
            </div>
          </div>
          {/* Emergency slots */}
          {emergencyBlocks.length > 0 && (
            <div className="space-y-3 mb-4">
              {emergencyBlocks.map(block => (
                <Card key={block.id} className="flex items-center justify-between border-l-4 border-rose-500 bg-rose-50">
                  <div>
                    <div className="font-semibold text-rose-700">{block.from} - {block.to} (Emergency)</div>
                    <div className="text-xs text-gray-500">Duration: {block.duration}</div>
                    <div className="text-xs text-gray-700 flex items-center">
                      <User className="w-3 h-3 mr-1" /> {block.patient?.name} (ID: {block.patient?.id})
                    </div>
                    <div className="text-xs text-gray-700">Open: {block.openTime}</div>
                  </div>
                  <div className="flex space-x-1 ml-4">
                    {block.slots.map(slot => (
                      <Button
                        key={slot}
                        variant="outline"
                        size="xs"
                        className="px-2 border-green-500"
                        style={{ borderWidth: 1, borderColor: '#22c55e', paddingLeft: 4, paddingRight: 4 }}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
          {/* Normal availability blocks */}
          <div className="space-y-3">
            {normalBlocks.map(block => (
              <Card
                key={block.id}
                className="flex items-center justify-between border-l-4 border-green-500 bg-white"
              >
                <div>
                  <div className="font-semibold text-green-700">
                    {block.from} - {block.to}
                  </div>
                  <div className="text-xs text-gray-500">Duration: {block.duration}</div>
                  <div className="flex space-x-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setEditBlock(block); setShowEditBlockModal(true); }}
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {/* delete block logic */}}
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </Button>
                  </div>
                </div>
                <div className="flex space-x-1 ml-4">
                  {block.slots.filter(slot => !isSlotDeleted(block.id, slot)).map(slot => (
                    <Button
                      key={slot}
                      variant="outline"
                      size="xs"
                      className={`px-2 border-green-500 ${block.referredSlots && block.referredSlots.includes(slot) ? 'bg-blue-100 border-blue-500 text-blue-700' : ''}`}
                      style={{
                        borderWidth: 1,
                        borderColor: block.referredSlots && block.referredSlots.includes(slot) ? '#2563eb' : '#22c55e',
                        paddingLeft: 4,
                        paddingRight: 4
                      }}
                    >
                      {slot}
                      <X
                        className="w-3 h-3 ml-1 text-red-500 cursor-pointer"
                        onClick={() => handleDeleteSlot(block.id, slot)}
                      />
                    </Button>
                  ))}
                  {deletedSlots[block.id] && deletedSlots[block.id].length > 0 && (
                    <Button
                      variant="primary"
                      size="xs"
                      className="ml-2"
                      onClick={() => handleResetSlots(block.id)}
                    >
                      Reset Slots
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // --- Referred Slots Page ---
  const renderReferred = () => {
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
    const selected = selectedDay || weekDates[0];

    // Helper for slot deletion
    const isSlotDeleted = (blockId: number, slot: string) =>
      deletedSlots[blockId] && deletedSlots[blockId].includes(slot);

    const handleDeleteSlot = (blockId: number, slot: string) => {
      setDeletedSlots(prev => ({
        ...prev,
        [blockId]: [...(prev[blockId] || []), slot]
      }));
    };

    const handleResetSlots = (blockId: number) => {
      setDeletedSlots(prev => ({ ...prev, [blockId]: [] }));
    };

    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setWeekOffset(weekOffset - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {weekDates.map((d, idx) => (
              <Button
                key={idx}
                variant={d.toDateString() === selected.toDateString() ? 'primary' : 'outline'}
                onClick={() => setSelectedDay(d)}
                size="sm"
              >
                {weekDays[d.getDay()]} {d.getDate()}
              </Button>
            ))}
            <Button variant="outline" onClick={() => setWeekOffset(weekOffset + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="danger" onClick={() => setShowConflictsModal(true)}>
            Show Conflicts
          </Button>
          <Button variant="primary" onClick={() => setShowReferredSlotModal(true)}>
            <Plus className="w-4 h-4 mr-1" /> Create Referred Slot
          </Button>
        </div>
        <div className="mt-4">
          <div className="font-bold text-lg mb-2">{selected.toLocaleDateString()}</div>
          <div className="space-y-3">
            {dummySlots.filter(b => b.referred).map(block => (
              <Card
                key={block.id}
                className="flex items-center justify-between border-l-4 border-blue-500 bg-blue-50"
              >
                <div>
                  <div className="font-semibold text-blue-700">
                    {block.from} - {block.to}
                  </div>
                  <div className="text-xs text-gray-500">Duration: {block.duration}</div>
                  <div className="flex space-x-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setEditBlock(block); setShowEditBlockModal(true); }}
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {/* delete block logic */}}
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </Button>
                  </div>
                </div>
                <div className="flex space-x-1 ml-4">
                  {block.slots.filter(slot => !isSlotDeleted(block.id, slot)).map(slot => (
                    <Button
                      key={slot}
                      variant="outline"
                      size="xs"
                      className="px-2 border-blue-500 bg-blue-100 text-blue-700"
                      style={{
                        borderWidth: 1,
                        borderColor: '#2563eb',
                        paddingLeft: 4,
                        paddingRight: 4
                      }}
                    >
                      {slot}
                      <X
                        className="w-3 h-3 ml-1 text-red-500 cursor-pointer"
                        onClick={() => handleDeleteSlot(block.id, slot)}
                      />
                    </Button>
                  ))}
                  {deletedSlots[block.id] && deletedSlots[block.id].length > 0 && (
                    <Button
                      variant="primary"
                      size="xs"
                      className="ml-2"
                      onClick={() => handleResetSlots(block.id)}
                    >
                      Reset Slots
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
        {/* Refer Slot Modal */}
        <Modal open={showReferredSlotModal} onClose={() => setShowReferredSlotModal(false)}>
          <h2 className="font-bold mb-2">Create Referred Slot</h2>
          <div className="mb-2">
            <label>Start Time:</label>
            <input type="time" className="border p-2 rounded w-full" />
          </div>
          <div className="mb-2">
            <label>End Time:</label>
            <input type="time" className="border p-2 rounded w-full" />
          </div>
          <div className="mb-2">
            <label>Referred Person:</label>
            <input type="text" className="border p-2 rounded w-full" placeholder="Enter name" />
          </div>
          <div className="mb-2">
            <label>Allowed Payment Duration (days):</label>
            <input type="number" min={1} className="border p-2 rounded w-full" placeholder="Number of days" />
          </div>
          <Button variant="primary" onClick={() => setShowReferredSlotModal(false)}>Create Referred Slot</Button>
        </Modal>
      </div>
    );
  };

  // --- Modals (dummy placeholders) ---
  const Modal = ({ open, onClose, children }: any) => open ? (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg min-w-[320px] relative">
        <button className="absolute top-2 right-2" onClick={onClose}><X /></button>
        {children}
      </div>
    </div>
  ) : null;

  // --- Main Render ---
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Availability Management</h1>
      {renderTabs()}
      <div className="mt-4">
        {activeTab === 'summary' && renderSummary()}
        {activeTab === 'slotwise' && renderSlotwise()}
        {activeTab === 'referred' && renderReferred()}
      </div>

      {/* Open Availability Modal */}
      <Modal open={showOpenAvailModal} onClose={() => setShowOpenAvailModal(false)}>
        <h2 className="font-bold mb-2">Open Availability</h2>
        <label className="block mb-2">Open availability until:</label>
        <input type="date" className="border p-2 rounded w-full mb-2" />
        <label className="block mb-2">Allowed payment duration for referred slots (days):</label>
        <input type="number" min={1} className="border p-2 rounded w-full mb-4" placeholder="Number of days" />
        <Button variant="primary" onClick={() => setShowOpenAvailModal(false)}>Confirm</Button>
      </Modal>

      {/* Delete Availability Modal */}
      <Modal open={showDeleteAvailModal} onClose={() => setShowDeleteAvailModal(false)}>
        <h2 className="font-bold mb-2">Delete Availability</h2>
        <label className="block mb-2">From:</label>
        <input type="date" className="border p-2 rounded w-full mb-2" />
        <label className="block mb-2">To:</label>
        <input type="date" className="border p-2 rounded w-full mb-4" />
        <Button variant="danger" onClick={() => setShowDeleteAvailModal(false)}>Delete</Button>
      </Modal>

      {/* Conflicts Modal */}
      <Modal open={showConflictsModal} onClose={() => setShowConflictsModal(false)}>
        <h2 className="font-bold mb-2">Conflicts</h2>
        {dummyConflicts.map((c, i) => (
          <Card
            key={i}
            className="mb-2 cursor-pointer hover:bg-blue-50"
            onClick={() => {
              setShowConflictsModal(false);
              setActiveTab('slotwise');
              setSelectedDay(new Date(c.date));
            }}
          >
            <div>Availability Tried To Set: 09:00 - 10:00 (1h)</div>
            <div>Conflicts:</div>
            <div className="ml-2 text-sm text-blue-700">Referred slot: {c.date} 09:00 - 10:00</div>
          </Card>
        ))}
      </Modal>

      {/* Availability Block Modal */}
      <Modal open={showSlotBlockModal} onClose={() => setShowSlotBlockModal(false)}>
        <h2 className="font-bold mb-2">Create Availability Block</h2>
        <div className="mb-2">
          <label>Time:</label>
          <div className="flex space-x-2">
            <input type="time" className="border p-2 rounded" />
            <span>to</span>
            <input type="time" className="border p-2 rounded" />
          </div>
        </div>
        <div className="mb-2">
          <label>Time Duration:</label>
          <input type="text" className="border p-2 rounded w-full" placeholder="e.g. 30m" />
        </div>
        <div className="mb-2">
          <label>Repeats:</label>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSelectDays(!showSelectDays)}
            >
              Select Days
            </Button>
            <Button variant="outline" size="sm">Repeats Until</Button>
          </div>
          {showSelectDays && (
            <input type="date" className="border p-2 rounded w-full mt-2" />
          )}
          <select className="border p-2 rounded w-full mt-2">
            <option>Daily</option>
            <option>On every week</option>
          </select>
        </div>
        <Button variant="primary" onClick={() => { setShowSlotBlockModal(false); setShowBlockConflictsModal(true); }}>Confirm</Button>
      </Modal>

      {/* Edit Block Modal */}
      <Modal open={showEditBlockModal} onClose={() => setShowEditBlockModal(false)}>
        <h2 className="font-bold mb-2">Edit Availability Block</h2>
        <div className="mb-2">
          <label>Time:</label>
          <div className="flex space-x-2">
            <input type="time" className="border p-2 rounded" defaultValue={editBlock?.from} />
            <span>to</span>
            <input type="time" className="border p-2 rounded" defaultValue={editBlock?.to} />
          </div>
        </div>
        <div className="mb-2">
          <label>Time Duration:</label>
          <input type="text" className="border p-2 rounded w-full" defaultValue={editBlock?.duration} />
        </div>
        <Button variant="primary" onClick={() => setShowEditBlockModal(false)}>Save</Button>
      </Modal>

      {/* Emergency Slot Modal */}
      <Modal open={showEmergencySlotModal} onClose={() => setShowEmergencySlotModal(false)}>
        <h2 className="font-bold mb-2">Create Emergency Slot</h2>
        <div className="mb-2">
          <label>Time:</label>
          <div className="flex space-x-2">
            <input type="time" className="border p-2 rounded" />
            <span>to</span>
            <input type="time" className="border p-2 rounded" />
          </div>
        </div>
        <div className="mb-2">
          <label>Refer:</label>
          <input
            type="text"
            className="border p-2 rounded w-full"
            placeholder="Type patient name"
            value={emergencyPatient}
            onChange={e => {
              setEmergencyPatient(e.target.value);
              // Dummy suggestions
              setEmergencyPatientSuggestions([
                { id: 1, name: 'John Doe' },
                { id: 2, name: 'Jane Smith' }
              ].filter(p => p.name.toLowerCase().includes(e.target.value.toLowerCase())));
            }}
          />
          {emergencyPatient && (
            <div className="border rounded bg-gray-50 mt-1">
              {emergencyPatientSuggestions.map(s => (
                <div
                  key={s.id}
                  className="p-1 hover:bg-blue-100 cursor-pointer"
                  onClick={() => { setEmergencyPatient(s.name); setEmergencyPatientSuggestions([]); }}
                >
                  {s.name} (ID: {s.id})
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mb-2">
          <label>Set Open Time:</label>
          <div className="flex space-x-2">
            <input type="date" className="border p-2 rounded" />
            <input type="time" className="border p-2 rounded" />
          </div>
        </div>
        <div className="mb-2 flex items-center space-x-2">
          <label>Open Emergency Slot:</label>
          <input
            type="checkbox"
            checked={emergencyOpen}
            onChange={e => setEmergencyOpen(e.target.checked)}
            className="accent-blue-500"
          />
        </div>
        <Button variant="primary" onClick={() => setShowEmergencySlotModal(false)}>Create Emergency Slot</Button>
      </Modal>

      {/* Block Conflicts Modal */}
      <Modal open={showBlockConflictsModal} onClose={() => setShowBlockConflictsModal(false)}>
        <h2 className="font-bold mb-2">Possible Conflicts</h2>
        <Card className="mb-2">
          <div>Availability Tried To Set: 09:00 - 10:00 (1h)</div>
          <div>Conflicts:</div>
          <div className="ml-2 text-sm text-blue-700">Referred slot: 2025-07-24 09:00 - 10:00</div>
        </Card>
        <div className="mt-2">Save the rest of the slots?</div>
        <Button variant="primary" onClick={() => setShowBlockConflictsModal(false)}>Yes, Save</Button>
      </Modal>
    </div>
  );
};

export default Availability;
// ...end of file...