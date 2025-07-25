import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  FileText,
  ExternalLink,
  Edit,
  Plus,
  ShieldCheck,
  ClipboardList,
  HeartPulse,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useTheme } from '../contexts/ThemeContext';

const PatientDetails: React.FC = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // --- Mock Data ---
  const patient = {
    id: patientId || 'P001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    age: 28,
    gender: 'Male',
    relationshipStatus: 'Single',
    education: 'Bachelor\'s Degree',
    guardian: 'Jane Doe',
    occupation: 'Software Engineer',
    address: '123 Main St, New York, NY 10001',
    joinedDate: '2023-11-20',
    status: 'Active',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+1 (555) 987-6543',
      email: 'jane.doe@email.com',
      relationship: 'Mother'
    }
  };

  const medicalDetails = {
    history: 'Diagnosed with Generalized Anxiety Disorder in 2023. No major physical health issues. Previous therapy for mild depression in 2021.',
    goals: 'Reduce anxiety symptoms, improve sleep quality, enhance coping strategies for stress.'
  };

  const [treatmentPlans, setTreatmentPlans] = useState([
    {
      id: 1,
      created: '2025-07-01',
      active: false,
      diagnosis: 'Generalized Anxiety Disorder',
      presentingProblems: 'Persistent anxiety, sleep disturbances, difficulty concentrating.',
      goals: 'Reduce anxiety, improve sleep, enhance focus.',
      modalities: 'CBT, Mindfulness',
      frequency: 'Once a week',
      duration: '6 sessions'
    },
    {
      id: 2,
      created: '2025-08-01',
      active: true,
      diagnosis: 'Generalized Anxiety Disorder',
      presentingProblems: 'Ongoing anxiety, occasional panic attacks.',
      goals: 'Manage panic attacks, maintain daily functioning.',
      modalities: 'CBT, Exposure Therapy',
      frequency: 'Once a week',
      duration: '8 sessions'
    }
  ]);

  const [dischargeNote, setDischargeNote] = useState({
    terminationDate: '2025-09-15',
    reasonForTermination: 'Treatment goals met and therapy concluded successfully.',
    diagnosisCode: 'F41.1 (Generalized Anxiety Disorder)',
    treatmentSummary: [
      '12 sessions of CBT for anxiety management.',
      'Client showed improved emotion regulation and reduced panic attacks.'
    ],
    goalsAchieved: [
      'Reduced daily anxiety levels.',
      'Improved interpersonal relationships.'
    ],
    referralsOrRecommendations: [
      'Continue self-monitoring.',
      'Check in with therapist in 3 months if symptoms recur.'
    ],
    clientResponse: 'Client expressed satisfaction with treatment and readiness to end therapy.'
  });

  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [showDischargeModal, setShowDischargeModal] = useState(false);
  const [showEditDischargeModal, setShowEditDischargeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const [assessmentNotes, setAssessmentNotes] = useState([
    {
      id: 1,
      assessmentType: 'Beck Depression Inventory (BDI-II)',
      dateAdministered: '2025-08-01',
      summary: 'Client scored 27 indicating moderate depression.',
      clinicalObservations: [
        'Client appeared fatigued and withdrawn during assessment.',
        'Reports sleep disturbances and lack of motivation.'
      ],
      diagnosisCode: 'F33.1 (Major Depressive Disorder, moderate)',
      recommendations: [
        'Begin CBT with weekly sessions.',
        'Consider referral for psychiatric medication evaluation.'
      ],
      administeredBy: 'Dr. Jane Doe'
    }
  ]);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [showCreateAssessmentModal, setShowCreateAssessmentModal] = useState(false);

  // --- Sessions ---
  const [sessions, setSessions] = useState([
    {
      id: 'S001',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'Completed',
      progressNotes: {
        subjective: 'Patient showed significant improvement in managing anxiety symptoms.',
        objective: 'Cognitive behavioral techniques were effective.',
        assessment: 'Improved coping skills.',
        plan: 'Continue CBT, monitor progress.'
      }
    },
    {
      id: 'S003',
      date: '2024-01-22',
      time: '2:00 PM',
      status: 'Upcoming',
      progressNotes: null
    }
  ]);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showCreateProgressModal, setShowCreateProgressModal] = useState(false);

  // --- Discharge Note Edit State ---
  const [editDischargeFields, setEditDischargeFields] = useState({
    terminationDate: dischargeNote.terminationDate,
    reasonForTermination: dischargeNote.reasonForTermination,
    diagnosisCode: dischargeNote.diagnosisCode,
    treatmentSummary: [...dischargeNote.treatmentSummary],
    goalsAchieved: [...dischargeNote.goalsAchieved],
    referralsOrRecommendations: [...dischargeNote.referralsOrRecommendations],
    clientResponse: dischargeNote.clientResponse,
  });
  const [isEditingDischarge, setIsEditingDischarge] = useState(false);

  // --- Handlers for dynamic lists ---
  const handleListChange = (field: string, idx: number, value: string) => {
    setEditDischargeFields(prev => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => (i === idx ? value : item))
    }));
  };

  const handleAddListItem = (field: string) => {
    setEditDischargeFields(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const handleRemoveListItem = (field: string, idx: number) => {
    setEditDischargeFields(prev => ({
      ...prev,
      [field]: prev[field].filter((_: string, i: number) => i !== idx)
    }));
  };

  const handleSaveDischargeEdit = () => {
    setDischargeNote({ ...editDischargeFields });
    setIsEditingDischarge(false);
    setShowEditDischargeModal(false);
  };

  // --- Handlers ---
  const handleSessionClick = (sessionId: string) => {
    navigate(`/sessions/${sessionId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  // --- Modals ---
  const Modal: React.FC<{ open: boolean, onClose: () => void, children: React.ReactNode }> = ({ open, onClose, children }) =>
    open ? (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-lg shadow-lg min-w-[320px] max-w-[480px] relative border border-gray-200">
          <button className="absolute top-2 right-2" onClick={onClose}>
            <AlertCircle className="w-5 h-5 text-gray-400" />
          </button>
          {children}
        </div>
      </div>
    ) : null;

  // --- Assessment Edit State ---
  const [isEditingAssessment, setIsEditingAssessment] = useState(false);
  const [editAssessmentFields, setEditAssessmentFields] = useState<any>(null);

  // When opening edit, initialize fields
  const handleEditAssessment = () => {
    setEditAssessmentFields({ ...selectedAssessment });
    setIsEditingAssessment(true);
  };

  // Dynamic list handlers for assessment edit
  const handleAssessmentListChange = (field: string, idx: number, value: string) => {
    setEditAssessmentFields((prev: any) => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => (i === idx ? value : item))
    }));
  };

  const handleAssessmentAddListItem = (field: string) => {
    setEditAssessmentFields((prev: any) => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const handleAssessmentRemoveListItem = (field: string, idx: number) => {
    setEditAssessmentFields((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((_: string, i: number) => i !== idx)
    }));
  };

  const handleSaveAssessmentEdit = () => {
    // You can update the assessmentNotes state here if needed
    console.log('Updated Assessment Note:', editAssessmentFields);
    setIsEditingAssessment(false);
    setShowAssessmentModal(false);
  };

  // --- Render ---
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/patients')}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Patients
          </Button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Patient Details
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Info & Additional Details */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                {patient.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Patient ID: {patient.id}
              </p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                patient.status === 'Active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
              }`}>
                {patient.status}
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-800 dark:text-white text-sm">
                  {patient.email}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-800 dark:text-white text-sm">
                  {patient.phone}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-800 dark:text-white text-sm">
                  Age: {patient.age}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-800 dark:text-white text-sm">
                  Joined: {patient.joinedDate}
                </span>
              </div>
            </div>
          </Card>

          {/* Additional Details */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Additional Details</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Gender: {patient.gender}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Relationship Status: {patient.relationshipStatus}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Education: {patient.education}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Guardian: {patient.guardian}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ClipboardList className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Occupation: {patient.occupation}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ExternalLink className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Address: {patient.address}</span>
              </div>
            </div>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Emergency Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Name: {patient.emergencyContact.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Phone: {patient.emergencyContact.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Email: {patient.emergencyContact.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Relationship: {patient.emergencyContact.relationship}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Medical Details */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Medical Details</h3>
            <div className="mb-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">Medical History:</span>
              <p className="text-sm text-gray-800 dark:text-white mt-1">{medicalDetails.history}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Goals:</span>
              <p className="text-sm text-gray-800 dark:text-white mt-1">{medicalDetails.goals}</p>
            </div>
          </Card>

          {/* Treatment Plans */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Treatment Plans</h3>
              <Button variant="primary" size="sm" onClick={() => { setShowTreatmentModal(true); setSelectedPlan(null); }}>
                <Plus className="w-4 h-4 mr-1" /> Create Treatment Plan
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {treatmentPlans.map(plan => (
                <Button
                  key={plan.id}
                  variant={plan.active ? 'primary' : 'outline'}
                  className={`rounded-full px-4 py-1 font-semibold ${plan.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                  onClick={() => { setSelectedPlan(plan); setShowTreatmentModal(true); }}
                >
                  {plan.created}
                </Button>
              ))}
            </div>
          </Card>

          {/* Assessments Notes */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Assessment Notes</h3>
              <Button variant="primary" size="sm" onClick={() => setShowCreateAssessmentModal(true)}>
                <Plus className="w-4 h-4 mr-1" /> Create Assessment Note
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {assessmentNotes.map(note => (
                <Button
                  key={note.id}
                  variant="outline"
                  className="justify-start text-left"
                  onClick={() => { setSelectedAssessment(note); setShowAssessmentModal(true); }}
                >
                  {note.assessmentType} - {note.dateAdministered}
                </Button>
              ))}
            </div>
          </Card>

          {/* Sessions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
              Sessions
            </h3>
            <div className="space-y-3">
              {sessions.map((session, index) => (
                <div
                  key={session.id}
                  className={`
                    p-2 rounded-lg border cursor-pointer flex items-center justify-between
                    ${isDarkMode
                      ? 'bg-gray-700/30 border-gray-600 hover:bg-gray-600/30'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }
                    transition-all duration-200 animate-slide-up
                  `}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-800 dark:text-white">
                        {session.id}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                    <span className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                      <span>{session.date}</span>
                      <Clock className="h-3 w-3" />
                      <span>{session.time}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"

                      className="px-2"
                      onClick={() => handleSessionClick(session.id)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    {session.progressNotes ? (
                      <Button
                        variant="primary"
                        size="sm"
                        className="px-4"
                        onClick={() => { setSelectedSession(session); setShowProgressModal(true); }}
                      >
                        <FileText className="h-4 w-4 mr-1" /> Progress Notes
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        className="px-4"
                        onClick={() => { setSelectedSession(session); setShowCreateProgressModal(true); }}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Create Progress Notes
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Treatment Plan Modal */}
      <Modal open={showTreatmentModal} onClose={() => setShowTreatmentModal(false)}>
        <h2 className="font-bold mb-2">{selectedPlan ? 'Edit Treatment Plan' : 'Create Treatment Plan'}</h2>
        <div className="space-y-2">
          <label className="block font-medium">Diagnosis</label>
          <input type="text" className="border rounded w-full p-2" defaultValue={selectedPlan?.diagnosis || ''} />
          <label className="block font-medium">Presenting Problems</label>
          <input type="text" className="border rounded w-full p-2" defaultValue={selectedPlan?.presentingProblems || ''} />
          <label className="block font-medium">Goals</label>
          <input type="text" className="border rounded w-full p-2" defaultValue={selectedPlan?.goals || ''} />
          <label className="block font-medium">Therapeutic Modalities</label>
          <input type="text" className="border rounded w-full p-2" defaultValue={selectedPlan?.modalities || ''} />
          <label className="block font-medium">Approximate Frequency</label>
          <input type="text" className="border rounded w-full p-2" defaultValue={selectedPlan?.frequency || ''} />
          <label className="block font-medium">Duration</label>
          <input type="text" className="border rounded w-full p-2" defaultValue={selectedPlan?.duration || ''} />
        </div>
        <div className="flex justify-between mt-4">
          {dischargeNote ? (
            <Button variant="outline" onClick={() => setShowDischargeModal(true)}>
              <ShieldCheck className="w-4 h-4 mr-1" /> Discharge Note
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setShowDischargeModal(true)}>
              <ShieldCheck className="w-4 h-4 mr-1" /> Create Discharge Note
            </Button>
          )}
          <Button variant="primary" onClick={() => setShowTreatmentModal(false)}>
            {selectedPlan ? 'Save Changes' : 'Create Plan'}
          </Button>
        </div>
      </Modal>

      {/* Discharge Note Modal */}
      <Modal open={showDischargeModal} onClose={() => setShowDischargeModal(false)}>
        <h2 className="font-bold mb-2">Discharge Note</h2>
        <div className="space-y-2">
          <div>
            <span className="font-medium">Termination Date:</span> {dischargeNote.terminationDate}
          </div>
          <div>
            <span className="font-medium">Reason for Termination:</span> {dischargeNote.reasonForTermination}
          </div>
          <div>
            <span className="font-medium">Diagnosis Code:</span> {dischargeNote.diagnosisCode}
          </div>
          <div>
            <span className="font-medium">Treatment Summary:</span>
            <ul className="list-disc ml-6">
              {dischargeNote.treatmentSummary.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </div>
          <div>
            <span className="font-medium">Goals Achieved:</span>
            <ul className="list-disc ml-6">
              {dischargeNote.goalsAchieved.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </div>
          <div>
            <span className="font-medium">Referrals/Recommendations:</span>
            <ul className="list-disc ml-6">
              {dischargeNote.referralsOrRecommendations.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </div>
          <div>
            <span className="font-medium">Client Response:</span> {dischargeNote.clientResponse}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => setShowEditDischargeModal(true)}>
            <Edit className="w-4 h-4 mr-1" /> Edit
          </Button>
          <Button variant="primary" onClick={() => setShowDischargeModal(false)}>
            Close
          </Button>
        </div>
      </Modal>

      {/* Edit Discharge Note Modal */}
      <Modal open={showEditDischargeModal} onClose={() => { setShowEditDischargeModal(false); setIsEditingDischarge(false); }}>
        <h2 className="font-bold mb-2">Edit Discharge Note</h2>
        {!isEditingDischarge ? (
          <div>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Termination Date:</span> {editDischargeFields.terminationDate}
              </div>
              <div>
                <span className="font-medium">Reason for Termination:</span> {editDischargeFields.reasonForTermination}
              </div>
              <div>
                <span className="font-medium">Diagnosis Code:</span> {editDischargeFields.diagnosisCode}
              </div>
              <div>
                <span className="font-medium">Treatment Summary:</span>
                <ul className="list-disc ml-6">
                  {editDischargeFields.treatmentSummary.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              </div>
              <div>
                <span className="font-medium">Goals Achieved:</span>
                <ul className="list-disc ml-6">
                  {editDischargeFields.goalsAchieved.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              </div>
              <div>
                <span className="font-medium">Referrals/Recommendations:</span>
                <ul className="list-disc ml-6">
                  {editDischargeFields.referralsOrRecommendations.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              </div>
              <div>
                <span className="font-medium">Client Response:</span> {editDischargeFields.clientResponse}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="primary" onClick={() => setIsEditingDischarge(true)}>
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
              <Button variant="outline" onClick={() => { setShowEditDischargeModal(false); setIsEditingDischarge(false); }}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Termination Date</label>
              <input
                type="date"
                className="border rounded w-full p-2"
                value={editDischargeFields.terminationDate}
                onChange={e => setEditDischargeFields(prev => ({ ...prev, terminationDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Reason for Termination</label>
              <textarea
                className="border rounded w-full p-2"
                rows={2}
                value={editDischargeFields.reasonForTermination}
                onChange={e => setEditDischargeFields(prev => ({ ...prev, reasonForTermination: e.target.value }))}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Diagnosis Code</label>
              <input
                type="text"
                className="border rounded w-full p-2"
                value={editDischargeFields.diagnosisCode}
                onChange={e => setEditDischargeFields(prev => ({ ...prev, diagnosisCode: e.target.value }))}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Treatment Summary</label>
              {editDischargeFields.treatmentSummary.map((item, idx) => (
                <div key={idx} className="flex items-center mb-2">
                  <textarea
                    className="border rounded w-full p-2"
                    rows={2}
                    value={item}
                    onChange={e => handleListChange('treatmentSummary', idx, e.target.value)}
                  />
                  <Button variant="outline" size="icon" className="ml-2" onClick={() => handleRemoveListItem('treatmentSummary', idx)}>
                    -
                  </Button>
                </div>
              ))}
              <Button variant="primary" size="sm" className="mt-1" onClick={() => handleAddListItem('treatmentSummary')}>
                + Add
              </Button>
            </div>
            <div>
              <label className="block font-medium mb-1">Goals Achieved</label>
              {editDischargeFields.goalsAchieved.map((item, idx) => (
                <div key={idx} className="flex items-center mb-2">
                  <input
                    type="text"
                    className="border rounded w-full p-2"
                    value={item}
                    onChange={e => handleListChange('goalsAchieved', idx, e.target.value)}
                  />
                  <Button variant="outline" size="icon" className="ml-2" onClick={() => handleRemoveListItem('goalsAchieved', idx)}>
                    -
                  </Button>
                </div>
              ))}
              <Button variant="primary" size="sm" className="mt-1" onClick={() => handleAddListItem('goalsAchieved')}>
                + Add
              </Button>
            </div>
            <div>
              <label className="block font-medium mb-1">Referrals/Recommendations</label>
              {editDischargeFields.referralsOrRecommendations.map((item, idx) => (
                <div key={idx} className="flex items-center mb-2">
                  <textarea
                    className="border rounded w-full p-2"
                    rows={2}
                    value={item}
                    onChange={e => handleListChange('referralsOrRecommendations', idx, e.target.value)}
                  />
                  <Button variant="outline" size="icon" className="ml-2" onClick={() => handleRemoveListItem('referralsOrRecommendations', idx)}>
                    -
                  </Button>
                </div>
              ))}
              <Button variant="primary" size="sm" className="mt-1" onClick={() => handleAddListItem('referralsOrRecommendations')}>
                + Add
              </Button>
            </div>
            <div>
              <label className="block font-medium mb-1">Client Response</label>
              <textarea
                className="border rounded w-full p-2"
                rows={2}
                value={editDischargeFields.clientResponse}
                onChange={e => setEditDischargeFields(prev => ({ ...prev, clientResponse: e.target.value }))}
              />
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <Button variant="primary" onClick={handleSaveDischargeEdit}>
                Save
              </Button>
              <Button variant="outline" onClick={() => { setIsEditingDischarge(false); }}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Assessment Note Modal */}
      <Modal open={showAssessmentModal} onClose={() => { setShowAssessmentModal(false); setIsEditingAssessment(false); }}>
        <h2 className="font-bold mb-2">{selectedAssessment?.assessmentType}</h2>
        {!isEditingAssessment ? (
          <div>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Date Administered:</span> {selectedAssessment?.dateAdministered}
              </div>
              <div>
                <span className="font-medium">Summary:</span> {selectedAssessment?.summary}
              </div>
              <div>
                <span className="font-medium">Clinical Observations:</span>
                <ul className="list-disc ml-6">
                  {selectedAssessment?.clinicalObservations?.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
                </ul>
              </div>
              <div>
                <span className="font-medium">Diagnosis Code:</span> {selectedAssessment?.diagnosisCode}
              </div>
              <div>
                <span className="font-medium">Recommendations:</span>
                <ul className="list-disc ml-6">
                  {selectedAssessment?.recommendations?.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
                </ul>
              </div>
              <div>
                <span className="font-medium">Administered By:</span> {selectedAssessment?.administeredBy}
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <Button variant="primary" onClick={handleEditAssessment}>
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
              <Button variant="outline" onClick={() => { setShowAssessmentModal(false); setIsEditingAssessment(false); }}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Assessment Type</label>
              <input
                type="text"
                className="border rounded w-full p-2"
                value={editAssessmentFields.assessmentType}
                onChange={e => setEditAssessmentFields((prev: any) => ({ ...prev, assessmentType: e.target.value }))}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Date Administered</label>
              <input
                type="date"
                className="border rounded w-full p-2"
                value={editAssessmentFields.dateAdministered}
                onChange={e => setEditAssessmentFields((prev: any) => ({ ...prev, dateAdministered: e.target.value }))}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Summary</label>
              <textarea
                className="border rounded w-full p-2"
                rows={2}
                value={editAssessmentFields.summary}
                onChange={e => setEditAssessmentFields((prev: any) => ({ ...prev, summary: e.target.value }))}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Clinical Observations</label>
              {editAssessmentFields.clinicalObservations.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center mb-2">
                  <textarea
                    className="border rounded w-full p-2"
                    rows={2}
                    value={item}
                    onChange={e => handleAssessmentListChange('clinicalObservations', idx, e.target.value)}
                  />
                  <Button variant="outline" size="icon" className="ml-2" onClick={() => handleAssessmentRemoveListItem('clinicalObservations', idx)}>
                    -
                  </Button>
                </div>
              ))}
              <Button variant="primary" size="sm" className="mt-1" onClick={() => handleAssessmentAddListItem('clinicalObservations')}>
                + Add
              </Button>
            </div>
            <div>
              <label className="block font-medium mb-1">Diagnosis Code</label>
              <input
                type="text"
                className="border rounded w-full p-2"
                value={editAssessmentFields.diagnosisCode}
                onChange={e => setEditAssessmentFields((prev: any) => ({ ...prev, diagnosisCode: e.target.value }))}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Recommendations</label>
              {editAssessmentFields.recommendations.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center mb-2">
                  <textarea
                    className="border rounded w-full p-2"
                    rows={2}
                    value={item}
                    onChange={e => handleAssessmentListChange('recommendations', idx, e.target.value)}
                  />
                  <Button variant="outline" size="icon" className="ml-2" onClick={() => handleAssessmentRemoveListItem('recommendations', idx)}>
                    -
                  </Button>
                </div>
              ))}
              <Button variant="primary" size="sm" className="mt-1" onClick={() => handleAssessmentAddListItem('recommendations')}>
                + Add
              </Button>
            </div>
            <div>
              <label className="block font-medium mb-1">Administered By</label>
              <input
                type="text"
                className="border rounded w-full p-2"
                value={editAssessmentFields.administeredBy}
                onChange={e => setEditAssessmentFields((prev: any) => ({ ...prev, administeredBy: e.target.value }))}
              />
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <Button variant="primary" onClick={handleSaveAssessmentEdit}>
                Save
              </Button>
              <Button variant="outline" onClick={() => setIsEditingAssessment(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Create Assessment Note Modal */}
      <Modal open={showCreateAssessmentModal} onClose={() => setShowCreateAssessmentModal(false)}>
        <h2 className="font-bold mb-2">Create Assessment Note</h2>
        {/* Add fields for creating assessment note */}
        <Button variant="primary" onClick={() => setShowCreateAssessmentModal(false)}>
          Create
        </Button>
      </Modal>

      {/* Progress Notes Modal */}
      <Modal open={showProgressModal} onClose={() => setShowProgressModal(false)}>
        <h2 className="font-bold mb-2">Progress Notes</h2>
        <div className="space-y-2">
          <div>
            <span className="font-medium">Subjective:</span> {selectedSession?.progressNotes?.subjective}
          </div>
          <div>
            <span className="font-medium">Objective:</span> {selectedSession?.progressNotes?.objective}
          </div>
          <div>
            <span className="font-medium">Assessment:</span> {selectedSession?.progressNotes?.assessment}
          </div>
          <div>
            <span className="font-medium">Plan:</span> {selectedSession?.progressNotes?.plan}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => setShowProgressModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => { /* Add edit logic */ }}>
            <Edit className="w-4 h-4 mr-1" /> Edit
          </Button>
        </div>
      </Modal>

      {/* Create Progress Notes Modal */}
      <Modal open={showCreateProgressModal} onClose={() => setShowCreateProgressModal(false)}>
        <h2 className="font-bold mb-2">Create Progress Notes</h2>
        {/* Add fields for creating progress notes */}
        <Button variant="primary" onClick={() => setShowCreateProgressModal(false)}>
          Create
        </Button>
      </Modal>
    </div>
  );
};

export default PatientDetails;