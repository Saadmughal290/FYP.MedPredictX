import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const URGENCY_CONFIG = {
  Emergency: { color: '#DC2626', bg: '#FEF2F2', border: '#FCA5A5', icon: '🚨', label: 'EMERGENCY — Go to ER immediately' },
  Urgent:    { color: '#D97706', bg: '#FFFBEB', border: '#FCD34D', icon: '⚠️', label: 'URGENT — See a doctor within 24 hours' },
  Soon:      { color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', icon: '📅', label: 'SOON — Schedule within this week' },
  Routine:   { color: '#059669', bg: '#ECFDF5', border: '#6EE7B7', icon: '✅', label: 'ROUTINE — Schedule a regular appointment' },
};

export function AIRecommender() {
  const { user } = useAuth();
  const [form, setForm] = useState({ symptoms: '', age: '', gender: '', existing_conditions: '' });
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isQuotaError, setIsQuotaError] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef(null);

  // Countdown timer for quota errors
  useEffect(() => {
    if (countdown > 0) {
      countdownRef.current = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (countdown === 0 && isQuotaError) {
      setIsQuotaError(false);
      setError('');
    }
    return () => clearTimeout(countdownRef.current);
  }, [countdown, isQuotaError]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.symptoms.trim() && !file) { setError('Please describe your symptoms or upload a medical report.'); return; }
    setError('');
    setIsQuotaError(false);
    setResult(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('symptoms', form.symptoms);
      formData.append('age', form.age);
      formData.append('gender', form.gender);
      formData.append('existing_conditions', form.existing_conditions);
      if (file) {
        formData.append('report_file', file);
      }

      const response = await api.post('/ai/recommend/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.error || 'Something went wrong. Please try again.';
      // Detect quota / rate-limit errors
      if (status === 429 || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('capacity')) {
        setIsQuotaError(true);
        setCountdown(60);
        setError('The AI service is temporarily at capacity (free quota limit reached). It will reset in a minute.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError('');
    setIsQuotaError(false);
    setCountdown(0);
    setForm({ symptoms: '', age: '', gender: '', existing_conditions: '' });
    setFile(null);
  };

  const urgency = result ? (URGENCY_CONFIG[result.urgency] || URGENCY_CONFIG['Routine']) : null;


  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Page Header */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #17A2B8, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🤖</div>
            <div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', margin: 0 }}>AI Doctor Recommender</h1>
              <p style={{ color: '#6B7280', fontSize: '0.938rem', margin: 0 }}>Powered by Groq Vision & NLP Models — describe your symptoms or upload a report to find the right specialist</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {['Free AI', 'Instant Results', 'Specialist Match', 'Urgency Assessment'].map(tag => (
              <span key={tag} style={{ backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '600', border: '1px solid #BFDBFE' }}>{tag}</span>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {/* Input Form */}
              <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(135deg, #17A2B8 0%, #6366F1 100%)', padding: '1.5rem 2rem' }}>
                  <h2 style={{ color: 'white', fontWeight: '700', fontSize: '1.125rem', margin: 0 }}>📋 Patient Details</h2>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>Provide your medical details using either option below (or both) to get a specialist recommendation.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
                  {/* Quota / rate-limit error */}
                  {isQuotaError && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      style={{ backgroundColor: '#FFFBEB', border: '2px solid #FCD34D', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>⏱️</span>
                        <span style={{ fontWeight: '700', color: '#92400E', fontSize: '1rem' }}>AI Quota Limit Reached</span>
                        <span style={{ marginLeft: 'auto', backgroundColor: '#F59E0B', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '99px', fontWeight: '700', fontSize: '0.875rem', minWidth: '48px', textAlign: 'center' }}>
                          {countdown}s
                        </span>
                      </div>
                      <p style={{ color: '#78350F', fontSize: '0.875rem', margin: 0, lineHeight: '1.5' }}>
                        The free AI quota is temporarily exhausted. The form will unlock automatically in <strong>{countdown} seconds</strong>. This is a Google API limit — it resets every minute.
                      </p>
                    </motion.div>
                  )}

                  {/* Regular error */}
                  {error && !isQuotaError && (
                    <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '0.875rem 1rem', marginBottom: '1.5rem', color: '#DC2626', fontSize: '0.875rem' }}>
                      ⚠️ {error}
                    </div>
                  )}

                  {/* Grid Container for the two cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                    
                    {/* Card 1: Describe Symptoms */}
                    <div style={{ border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.5rem', backgroundColor: '#F9FAFB' }}>
                      <h3 style={{ color: '#111827', fontWeight: '700', fontSize: '1.125rem', margin: '0 0 1.25rem 0' }}>Option 1: Describe Symptoms</h3>
                      
                      {/* Symptoms — main field */}
                      <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontWeight: '600', color: '#374151', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                          🩺 Symptoms
                        </label>
                        <textarea
                          name="symptoms"
                          value={form.symptoms}
                          onChange={handleChange}
                          rows={4}
                          placeholder="e.g. I have been experiencing chest pain..."
                          style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #E5E7EB', borderRadius: '10px', fontSize: '0.938rem', resize: 'vertical', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit', backgroundColor: 'white', boxSizing: 'border-box' }}
                          onFocus={e => { e.target.style.borderColor = '#17A2B8'; }}
                          onBlur={e => { e.target.style.borderColor = '#E5E7EB'; }}
                        />
                      </div>

                      {/* Row: age + gender */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                          <label style={{ display: 'block', fontWeight: '600', color: '#374151', fontSize: '0.875rem', marginBottom: '0.5rem' }}>👤 Age</label>
                          <input
                            type="number" name="age" value={form.age} onChange={handleChange} min="1" max="120"
                            placeholder="e.g. 35"
                            style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid #E5E7EB', borderRadius: '10px', fontSize: '0.938rem', outline: 'none', transition: 'border-color 0.2s', backgroundColor: 'white', boxSizing: 'border-box' }}
                            onFocus={e => { e.target.style.borderColor = '#17A2B8'; }}
                            onBlur={e => { e.target.style.borderColor = '#E5E7EB'; }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontWeight: '600', color: '#374151', fontSize: '0.875rem', marginBottom: '0.5rem' }}>⚧ Gender</label>
                          <select
                            name="gender" value={form.gender} onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid #E5E7EB', borderRadius: '10px', fontSize: '0.938rem', outline: 'none', transition: 'border-color 0.2s', backgroundColor: 'white', cursor: 'pointer', boxSizing: 'border-box' }}
                            onFocus={e => { e.target.style.borderColor = '#17A2B8'; }}
                            onBlur={e => { e.target.style.borderColor = '#E5E7EB'; }}
                          >
                            <option value="">Prefer not to say</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Existing conditions */}
                      <div>
                        <label style={{ display: 'block', fontWeight: '600', color: '#374151', fontSize: '0.875rem', marginBottom: '0.5rem' }}>💊 Existing conditions</label>
                        <input
                          type="text" name="existing_conditions" value={form.existing_conditions} onChange={handleChange}
                          placeholder="e.g. Type 2 diabetes..."
                          style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid #E5E7EB', borderRadius: '10px', fontSize: '0.938rem', outline: 'none', transition: 'border-color 0.2s', backgroundColor: 'white', boxSizing: 'border-box' }}
                          onFocus={e => { e.target.style.borderColor = '#17A2B8'; }}
                          onBlur={e => { e.target.style.borderColor = '#E5E7EB'; }}
                        />
                      </div>
                    </div>

                    {/* Card 2: Upload Report */}
                    <div style={{ border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.5rem', backgroundColor: '#F9FAFB', display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ color: '#111827', fontWeight: '700', fontSize: '1.125rem', margin: '0 0 1.25rem 0' }}>Option 2: Upload Medical Report</h3>
                      
                      <p style={{ color: '#4B5563', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                        If you have a digital medical report, you can upload it here. We will extract the text and analyze it for you.
                      </p>

                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: '600', color: '#374151', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                          Upload PDF Document
                        </label>
                        
                        {!file ? (
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files[0])}
                            style={{ width: '100%', padding: '1rem', border: '2px dashed #CBD5E1', borderRadius: '10px', fontSize: '0.938rem', backgroundColor: 'white', cursor: 'pointer', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
                            onFocus={e => { e.target.style.borderColor = '#17A2B8'; }}
                            onBlur={e => { e.target.style.borderColor = '#CBD5E1'; }}
                          />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '2px solid #17A2B8', borderRadius: '10px', backgroundColor: '#E0F2FE' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                              <span style={{ fontSize: '1.5rem' }}>📄</span>
                              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0369A1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFile(null)}
                              style={{ background: 'white', border: '1px solid #DC2626', color: '#DC2626', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700', padding: '0.375rem 0.75rem', borderRadius: '6px', transition: 'all 0.2s', flexShrink: 0 }}
                              onMouseOver={e => { e.currentTarget.style.backgroundColor = '#FEF2F2'; }}
                              onMouseOut={e => { e.currentTarget.style.backgroundColor = 'white'; }}
                            >
                              ✕ Remove
                            </button>
                          </div>
                        )}
                        
                        <p style={{ color: '#6B7280', fontSize: '0.75rem', margin: '0.75rem 0 0' }}>Supported format: PDF only.</p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit" disabled={loading || isQuotaError}
                    style={{ width: '100%', padding: '1rem', background: (loading || isQuotaError) ? '#9CA3AF' : 'linear-gradient(135deg, #17A2B8, #6366F1)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', cursor: (loading || isQuotaError) ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: (loading || isQuotaError) ? 'none' : '0 4px 15px rgba(23,162,184,0.4)' }}
                  >
                    {loading ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                        <span style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                        Analyzing...
                      </span>
                    ) : isQuotaError ? `⏱️ Retry available in ${countdown}s` : '🤖 Analyze Medical Data'}
                  </button>

                  <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '0.75rem', marginTop: '1rem' }}>
                    🔒 Your data is only used for this analysis and not stored by the AI.
                  </p>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Results Card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Urgency Banner */}
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={{ backgroundColor: urgency.bg, border: `2px solid ${urgency.border}`, borderRadius: '14px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '2rem' }}>{urgency.icon}</span>
                  <div>
                    <div style={{ fontWeight: '800', color: urgency.color, fontSize: '1.125rem' }}>{urgency.label}</div>
                    <div style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '0.15rem' }}>Based on the symptoms you described</div>
                  </div>
                </motion.div>

                {/* Recommended Specialist */}
                <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'linear-gradient(135deg, #17A2B8, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>👨‍⚕️</div>
                    <div>
                      <p style={{ color: '#6B7280', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Recommended Specialist</p>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', margin: '0.15rem 0 0' }}>{result.recommended_specialty}</h2>
                    </div>
                  </div>
                  {result.what_to_expect && (
                    <p style={{ color: '#4B5563', fontSize: '0.938rem', lineHeight: '1.6', backgroundColor: '#F9FAFB', borderRadius: '8px', padding: '0.875rem 1rem', margin: 0 }}>
                      💡 <strong>What to expect:</strong> {result.what_to_expect}
                    </p>
                  )}
                </div>

                {/* Reasons + Actions side by side */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  {/* Reasons */}
                  <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#111827', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      🔍 Why this specialist?
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {(result.reasons || []).map((reason, i) => (
                        <motion.div key={i} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                          <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#EFF6FF', color: '#2563EB', fontWeight: '700', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{i + 1}</span>
                          <p style={{ color: '#374151', fontSize: '0.875rem', lineHeight: '1.5', margin: 0 }}>{reason}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Immediate Actions */}
                  <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#111827', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      ⚡ Immediate actions
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {(result.immediate_actions || []).map((action, i) => (
                        <motion.div key={i} initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', backgroundColor: '#F0FDF4', borderRadius: '8px', padding: '0.625rem 0.875rem' }}>
                          <span style={{ color: '#059669', fontSize: '1rem', flexShrink: 0 }}>✓</span>
                          <p style={{ color: '#065F46', fontSize: '0.875rem', lineHeight: '1.5', margin: 0, fontWeight: '500' }}>{action}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                {result.disclaimer && (
                  <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>⚠️</span>
                    <p style={{ color: '#92400E', fontSize: '0.813rem', lineHeight: '1.5', margin: 0 }}>{result.disclaimer}</p>
                  </div>
                )}

                {/* Try Again and Maps */}
                <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(result.recommended_specialty)}+near+me`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ width: '100%', padding: '1rem', backgroundColor: '#2563EB', color: 'white', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', textAlign: 'center', textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(37,99,235,0.2)', boxSizing: 'border-box' }}
                    onMouseOver={e => { e.target.style.backgroundColor = '#1D4ED8'; }}
                    onMouseOut={e => { e.target.style.backgroundColor = '#2563EB'; }}
                  >
                    📍 Find Nearest {result.recommended_specialty} on Google Maps
                  </a>
                  
                  <button
                    onClick={handleReset}
                    style={{ width: '100%', padding: '0.875rem', backgroundColor: 'white', color: '#17A2B8', border: '2px solid #17A2B8', borderRadius: '10px', fontSize: '0.938rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', boxSizing: 'border-box' }}
                    onMouseOver={e => { e.target.style.backgroundColor = '#EFF6FF'; }}
                    onMouseOut={e => { e.target.style.backgroundColor = 'white'; }}
                  >
                    🔄 Check different symptoms
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
  );
}

export default AIRecommender;
