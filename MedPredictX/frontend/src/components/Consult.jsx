import { useState, useEffect } from "react";
import Layout from "./common/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API_URL = 'http://localhost:8000/api';

export function Consult() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showMedicalRecordForm, setShowMedicalRecordForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Booking form state
  const [bookingData, setBookingData] = useState({
    doctor: '',
    appointment_date: '',
    appointment_time: '',
    symptoms: ''
  });

  // Medical record form state
  const [medicalRecordData, setMedicalRecordData] = useState({
    record_type: 'CONSULTATION',
    title: '',
    description: '',
    record_date: new Date().toISOString().split('T')[0],
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    glucose_level: '',
    glucose_measurement_type: 'FASTING'
  });

  const isPatient = user?.profile?.role === 'PATIENT';
  const isDoctor = user?.profile?.role === 'DOCTOR';

  useEffect(() => {
    if (isPatient) {
      fetchDoctors();
    }
    fetchAppointments();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/doctors/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/appointments/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    }
  };

  const handleBookingChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const appointmentDateTime = `${bookingData.appointment_date}T${bookingData.appointment_time}:00`;

      await axios.post(
        `${API_URL}/appointments/`,
        {
          doctor: parseInt(bookingData.doctor),
          appointment_date: appointmentDateTime,
          symptoms: bookingData.symptoms
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Appointment booked successfully!');
      setShowBookingForm(false);
      setBookingData({ doctor: '', appointment_date: '', appointment_time: '', symptoms: '' });
      fetchAppointments();
    } catch (error) {
      console.error('Error booking appointment:', error);
      console.log('Full error response:', JSON.stringify(error.response?.data, null, 2));
      const errorMsg = error.response?.data?.detail ||
        error.response?.data?.error ||
        JSON.stringify(error.response?.data) ||
        'Failed to book appointment';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.patch(
        `${API_URL}/appointments/${appointmentId}/`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success(`Appointment ${newStatus.toLowerCase()}`);
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <AlertCircle className="w-4 h-4" />;
      case 'CONFIRMED': return <CheckCircle className="w-4 h-4" />;
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleMedicalRecordChange = (e) => {
    setMedicalRecordData({
      ...medicalRecordData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateMedicalRecord = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const payload = {
        patient: selectedAppointment.patient,
        record_type: medicalRecordData.record_type,
        title: medicalRecordData.title,
        description: medicalRecordData.description,
        record_date: medicalRecordData.record_date
      };

      // Add vitals if provided
      if (medicalRecordData.blood_pressure_systolic) {
        payload.blood_pressure_systolic = parseInt(medicalRecordData.blood_pressure_systolic);
      }
      if (medicalRecordData.blood_pressure_diastolic) {
        payload.blood_pressure_diastolic = parseInt(medicalRecordData.blood_pressure_diastolic);
      }
      if (medicalRecordData.glucose_level) {
        payload.glucose_level = parseFloat(medicalRecordData.glucose_level);
        payload.glucose_measurement_type = medicalRecordData.glucose_measurement_type;
      }

      await axios.post(
        `${API_URL}/medical-records/`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Medical record created successfully');
      setShowMedicalRecordForm(false);
      setMedicalRecordData({
        record_type: 'CONSULTATION',
        title: '',
        description: '',
        record_date: new Date().toISOString().split('T')[0],
        blood_pressure_systolic: '',
        blood_pressure_diastolic: '',
        glucose_level: '',
        glucose_measurement_type: 'FASTING'
      });
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error creating medical record:', error);
      toast.error('Failed to create medical record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div>
        {/* Page Header */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{
              fontSize: '1.875rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              {isPatient ? 'Book Consultation' : 'My Appointments'}
            </h1>
            <p style={{ fontSize: '1rem', color: '#6B7280' }}>
              {isPatient ? 'Schedule an appointment with our verified doctors' : 'Manage your patient appointments'}
            </p>
          </div>
          {isPatient && !showBookingForm && (
            <button
              onClick={() => setShowBookingForm(true)}
              style={{
                backgroundColor: '#17A2B8',
                color: 'white',
                border: 'none',
                padding: '0.875rem 1.75rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.4)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#1D4ED8';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(37, 99, 235, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#17A2B8';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(37, 99, 235, 0.4)';
              }}
            >
              📅 Book New Appointment
            </button>
          )}
        </div>

        {/* Booking Form (Patient Only) */}
        {isPatient && showBookingForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '2rem' }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Book New Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBookAppointment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor">Select Doctor *</Label>
                    <select
                      id="doctor"
                      name="doctor"
                      value={bookingData.doctor}
                      onChange={handleBookingChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        fontSize: '0.938rem'
                      }}
                    >
                      <option value="">Choose a doctor...</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialization}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="space-y-2">
                      <Label htmlFor="appointment_date">Date *</Label>
                      <Input
                        id="appointment_date"
                        name="appointment_date"
                        type="date"
                        value={bookingData.appointment_date}
                        onChange={handleBookingChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="appointment_time">Time *</Label>
                      <Input
                        id="appointment_time"
                        name="appointment_time"
                        type="time"
                        value={bookingData.appointment_time}
                        onChange={handleBookingChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Symptoms / Reason for Visit</Label>
                    <textarea
                      id="symptoms"
                      name="symptoms"
                      value={bookingData.symptoms}
                      onChange={handleBookingChange}
                      rows={3}
                      placeholder="Describe your symptoms..."
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        fontSize: '0.938rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      style={{
                        backgroundColor: '#F3F4F6',
                        color: '#374151',
                        border: '1px solid #D1D5DB',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '6px',
                        fontSize: '0.938rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#E5E7EB';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#F3F4F6';
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        backgroundColor: loading ? '#93C5FD' : '#17A2B8',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '6px',
                        fontSize: '0.938rem',
                        fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        if (!loading) e.currentTarget.style.backgroundColor = '#1D4ED8';
                      }}
                      onMouseOut={(e) => {
                        if (!loading) e.currentTarget.style.backgroundColor = '#17A2B8';
                      }}
                    >
                      {loading ? 'Booking...' : 'Book Appointment'}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Medical Record Form Modal for Doctors */}
        {showMedicalRecordForm && selectedAppointment && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
            onClick={() => {
              setShowMedicalRecordForm(false);
              setSelectedAppointment(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto'
              }}
            >
              <Card style={{ border: '2px solid #17A2B8' }}>
                <CardHeader>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <CardTitle style={{ color: '#17A2B8' }}>
                      📋 Add Medical Record for {selectedAppointment.patient_name}
                    </CardTitle>
                    <button
                      onClick={() => {
                        setShowMedicalRecordForm(false);
                        setSelectedAppointment(null);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#6B7280',
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                        padding: '0.5rem'
                      }}
                    >
                      ×
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateMedicalRecord}>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                      <div>
                        <Label htmlFor="record_type">Record Type *</Label>
                        <select
                          id="record_type"
                          name="record_type"
                          value={medicalRecordData.record_type}
                          onChange={handleMedicalRecordChange}
                          required
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #D1D5DB',
                            borderRadius: '6px',
                            fontSize: '0.875rem'
                          }}
                        >
                          <option value="CONSULTATION">Consultation Notes</option>
                          <option value="DIAGNOSIS">Diagnosis</option>
                          <option value="PRESCRIPTION">Prescription</option>
                          <option value="LAB_RESULT">Lab Result</option>
                          <option value="IMAGING">Imaging</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          type="text"
                          id="title"
                          name="title"
                          value={medicalRecordData.title}
                          onChange={handleMedicalRecordChange}
                          required
                          placeholder="e.g., Follow-up Consultation"
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Description / Notes *</Label>
                        <textarea
                          id="description"
                          name="description"
                          value={medicalRecordData.description}
                          onChange={handleMedicalRecordChange}
                          required
                          rows={4}
                          placeholder="Enter diagnosis, treatment plan, or notes..."
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #D1D5DB',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            resize: 'vertical'
                          }}
                        />
                      </div>

                      <div>
                        <Label htmlFor="record_date">Record Date *</Label>
                        <Input
                          type="date"
                          id="record_date"
                          name="record_date"
                          value={medicalRecordData.record_date}
                          onChange={handleMedicalRecordChange}
                          required
                        />
                      </div>

                      {/* Vitals Section */}
                      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', marginBottom: '1rem' }}>
                          📊 Vital Signs (Optional)
                        </h4>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <Label htmlFor="blood_pressure_systolic">Systolic BP</Label>
                            <Input
                              type="number"
                              id="blood_pressure_systolic"
                              name="blood_pressure_systolic"
                              value={medicalRecordData.blood_pressure_systolic}
                              onChange={handleMedicalRecordChange}
                              placeholder="120"
                            />
                            <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>mmHg</span>
                          </div>

                          <div>
                            <Label htmlFor="blood_pressure_diastolic">Diastolic BP</Label>
                            <Input
                              type="number"
                              id="blood_pressure_diastolic"
                              name="blood_pressure_diastolic"
                              value={medicalRecordData.blood_pressure_diastolic}
                              onChange={handleMedicalRecordChange}
                              placeholder="80"
                            />
                            <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>mmHg</span>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                          <div>
                            <Label htmlFor="glucose_level">Glucose Level</Label>
                            <Input
                              type="number"
                              id="glucose_level"
                              name="glucose_level"
                              value={medicalRecordData.glucose_level}
                              onChange={handleMedicalRecordChange}
                              placeholder="100"
                              step="0.01"
                            />
                            <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>mg/dL</span>
                          </div>

                          <div>
                            <Label htmlFor="glucose_measurement_type">Measurement Type</Label>
                            <select
                              id="glucose_measurement_type"
                              name="glucose_measurement_type"
                              value={medicalRecordData.glucose_measurement_type}
                              onChange={handleMedicalRecordChange}
                              style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #D1D5DB',
                                borderRadius: '6px',
                                fontSize: '0.875rem'
                              }}
                            >
                              <option value="FASTING">Fasting</option>
                              <option value="RANDOM">Random</option>
                              <option value="POST_MEAL">Post Meal</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button
                          type="submit"
                          disabled={loading}
                          style={{
                            flex: 1,
                            backgroundColor: loading ? '#9CA3AF' : '#17A2B8',
                            color: 'white',
                            border: 'none',
                            padding: '0.875rem 1.75rem',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#138496')}
                          onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#17A2B8')}
                        >
                          {loading ? 'Creating...' : '✅ Create Medical Record'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowMedicalRecordForm(false);
                            setSelectedAppointment(null);
                          }}
                          style={{
                            flex: 1,
                            backgroundColor: 'white',
                            color: '#6B7280',
                            border: '1px solid #D1D5DB',
                            padding: '0.875rem 1.75rem',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Appointments List */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          {appointments.length === 0 ? (
            <Card>
              <CardContent style={{ padding: '3rem', textAlign: 'center' }}>
                <Stethoscope className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p style={{ color: '#6B7280', fontSize: '1.125rem' }}>
                  {isPatient ? 'No appointments yet. Book your first consultation!' : 'No appointments scheduled.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            appointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            backgroundColor: '#D1ECF1',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                              {isPatient ? appointment.doctor_name : appointment.patient_name}
                            </h3>
                            {isPatient && appointment.doctor_specialization && (
                              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                                {appointment.doctor_specialization}
                              </p>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                              {new Date(appointment.appointment_date).toLocaleDateString()}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                              {new Date(appointment.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        {appointment.symptoms && (
                          <div style={{ marginBottom: '1rem' }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                              Symptoms:
                            </p>
                            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                              {appointment.symptoms}
                            </p>
                          </div>
                        )}

                        {isDoctor && appointment.status === 'PENDING' && (
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <button
                              onClick={() => handleUpdateStatus(appointment.id, 'CONFIRMED')}
                              style={{
                                backgroundColor: '#10B981',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10B981'}
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(appointment.id, 'CANCELLED')}
                              style={{
                                backgroundColor: '#EF4444',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
                              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#EF4444'}
                            >
                              Cancel
                            </button>
                          </div>
                        )}

                        {isDoctor && (appointment.status === 'CONFIRMED' || appointment.status === 'COMPLETED') && (
                          <div style={{ marginTop: '1rem' }}>
                            <button
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setShowMedicalRecordForm(true);
                              }}
                              style={{
                                backgroundColor: '#17A2B8',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#138496'}
                              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#17A2B8'}
                            >
                              📋 Add Medical Record
                            </button>
                          </div>
                        )}
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }} className={getStatusColor(appointment.status)}>
                        {getStatusIcon(appointment.status)}
                        {appointment.status}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
