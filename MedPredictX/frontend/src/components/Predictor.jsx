import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import api from "../utils/api";

export function Predictor() {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptom, setSelectedSymptom] = useState("");
  const [prediction, setPrediction] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const symptomsList = [
    'itching', 'skin_rash', 'shivering', 'chills', 'joint_pain', 'stomach_pain', 'acidity', 'ulcers_on_tongue', 'muscle_wasting', 'vomiting', 'burning_micturition', 'spotting_ urination', 'fatigue', 'weight_gain', 'anxiety', 'cold_hands_and_feets', 'mood_swings', 'weight_loss', 'restlessness', 'lethargy', 'patches_in_throat', 'irregular_sugar_level', 'cough', 'high_fever', 'sunken_eyes', 'breathlessness', 'sweating', 'dehydration', 'indigestion', 'headache', 'yellowish_skin', 'dark_urine', 'nausea', 'loss_of_appetite', 'pain_behind_the_eyes', 'back_pain', 'constipation', 'abdominal_pain', 'diarrhoea', 'mild_fever', 'yellow_urine', 'yellowing_of_eyes', 'acute_liver_failure', 'fluid_overload', 'swelling_of_stomach', 'swelled_lymph_nodes', 'malaise', 'blurred_and_distorted_vision', 'phlegm', 'throat_irritation', 'redness_of_eyes', 'sinus_pressure', 'runny_nose', 'congestion', 'chest_pain', 'weakness_in_limbs', 'fast_heart_rate', 'pain_during_bowel_movements', 'pain_in_anal_region', 'bloody_stool', 'irritation_in_anus', 'neck_pain', 'dizziness', 'cramps', 'bruising', 'obesity', 'swollen_legs', 'swollen_blood_vessels', 'puffy_face_and_eyes', 'enlarged_thyroid', 'brittle_nails', 'swollen_extremeties', 'excessive_hunger', 'extra_marital_contacts', 'drying_and_tingling_lips', 'slurred_speech', 'knee_pain', 'hip_joint_pain', 'muscle_weakness', 'stiff_neck', 'swelling_joints', 'movement_stiffness', 'spinning_movements', 'loss_of_balance', 'unsteadiness', 'weakness_of_one_body_side', 'loss_of_smell', 'bladder_discomfort', 'foul_smell_of _urine', 'continuous_feel_of_urine', 'passage_of_gases', 'internal_itching', 'toxic_look', 'depression', 'irritability', 'muscle_pain', 'altered_sensorium', 'red_spots_over_body', 'belly_pain', 'abnormal_menstruation', 'dischromic _patches', 'watering_from_eyes', 'increased_appetite', 'polyuria', 'family_history', 'mucoid_sputum', 'rusty_sputum', 'lack_of_concentration', 'visual_disturbances', 'receiving_blood_transfusion', 'receiving_unsterile_injections', 'coma', 'stomach_bleeding', 'distention_of_abdomen', 'history_of_alcohol_consumption', 'blood_in_sputum', 'prominent_veins_on_calf', 'palpitations', 'painful_walking', 'pus_filled_pimples', 'blackheads', 'scurring', 'skin_peeling', 'silver_like_dusting', 'small_dents_in_nails', 'inflammatory_nails', 'blister', 'red_sore_around_nose', 'yellow_crust_ooze'
  ];

  const addSymptom = () => {
    if (selectedSymptom && !symptoms.includes(selectedSymptom)) {
      setSymptoms([...symptoms, selectedSymptom]);
      setSelectedSymptom("");
      toast.success(`Added ${selectedSymptom}`);
    }
  };

  const removeSymptom = (symptom) => {
    setSymptoms(symptoms.filter((s) => s !== symptom));
    toast.info(`Removed ${symptom}`);
  };

  const handlePredict = async () => {
    if (symptoms.length > 0) {
      setIsLoading(true);
      try {
        const response = await api.post('/predict/', { symptoms });
        if (response.data && response.data.predicted_disease) {
            setPrediction(response.data.predicted_disease + " - Please consult a doctor for proper diagnosis");
            toast.success("Prediction complete!");
        } else {
            setPrediction("Could not predict disease.");
            toast.error("Prediction failed.");
        }
      } catch (err) {
        console.error(err);
        setPrediction("Error connecting to prediction service.");
        toast.error("Failed to connect to ML model.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClearSymptoms = () => {
    setSymptoms([]);
    setPrediction("");
    toast.info("Symptoms cleared");
  };

  return (
    <div>
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            AI Disease Predictor
          </h1>
          <p style={{ fontSize: '1rem', color: '#6B7280' }}>
            Enter your symptoms to get an AI-powered disease prediction
          </p>
        </div>

        {/* Symptom Input */}
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <Select value={selectedSymptom} onValueChange={setSelectedSymptom}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select a symptom..." />
              </SelectTrigger>
              <SelectContent>
                {symptomsList.map((symptom) => (
                  <SelectItem key={symptom} value={symptom}>
                    {symptom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <button
            onClick={addSymptom}
            disabled={!selectedSymptom}
            style={{
              backgroundColor: selectedSymptom ? '#17A2B8' : '#9CA3AF',
              color: 'white',
              border: 'none',
              padding: '0.625rem 2rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: selectedSymptom ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => selectedSymptom && (e.currentTarget.style.backgroundColor = '#138496')}
            onMouseOut={(e) => selectedSymptom && (e.currentTarget.style.backgroundColor = '#17A2B8')}
          >
            Add Symptom
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Your Symptoms */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="pt-6">
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                  Your Symptoms ({symptoms.length})
                </h2>
                <div style={{
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  minHeight: '300px'
                }}>
                  <AnimatePresence mode="popLayout">
                    {symptoms.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                          textAlign: 'center',
                          marginTop: '5rem',
                          color: '#9CA3AF',
                          fontStyle: 'italic'
                        }}
                      >
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🩺</div>
                        <p>Add your first symptom to begin</p>
                      </motion.div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {symptoms.map((symptom, index) => (
                          <motion.div
                            key={symptom}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              backgroundColor: 'white',
                              borderRadius: '6px',
                              padding: '0.75rem 1rem',
                              border: '1px solid #E5E7EB',
                              transition: 'box-shadow 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                            onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
                          >
                            <span style={{ color: '#111827', fontWeight: '500' }}>{symptom}</span>
                            <button
                              onClick={() => removeSymptom(symptom)}
                              style={{
                                color: '#9CA3AF',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.25rem',
                                transition: 'color 0.2s'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.color = '#EF4444'}
                              onMouseOut={(e) => e.currentTarget.style.color = '#9CA3AF'}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button
                    onClick={handlePredict}
                    disabled={symptoms.length === 0 || isLoading}
                    style={{
                      flex: 1,
                      backgroundColor: (symptoms.length === 0 || isLoading) ? '#9CA3AF' : '#17A2B8',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: (symptoms.length === 0 || isLoading) ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => !isLoading && symptoms.length > 0 && (e.currentTarget.style.backgroundColor = '#138496')}
                    onMouseOut={(e) => !isLoading && symptoms.length > 0 && (e.currentTarget.style.backgroundColor = '#17A2B8')}
                  >
                    {isLoading ? "ANALYZING..." : "PREDICT DISEASE"}
                  </button>
                  <button
                    onClick={handleClearSymptoms}
                    disabled={symptoms.length === 0}
                    style={{
                      flex: 1,
                      backgroundColor: 'white',
                      color: symptoms.length === 0 ? '#9CA3AF' : '#EF4444',
                      border: symptoms.length === 0 ? '1px solid #D1D5DB' : '1px solid #EF4444',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: symptoms.length === 0 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => symptoms.length > 0 && (e.currentTarget.style.backgroundColor = '#FEF2F2')}
                    onMouseOut={(e) => symptoms.length > 0 && (e.currentTarget.style.backgroundColor = 'white')}
                  >
                    CLEAR ALL
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Predicted Result */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent className="pt-6">
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                  AI Prediction
                </h2>
                <div style={{
                  backgroundColor: '#D1ECF1',
                  border: '1px solid #BFDBFE',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  minHeight: '300px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        style={{ textAlign: 'center' }}
                      >
                        <div style={{
                          width: '48px',
                          height: '48px',
                          border: '4px solid #3B82F6',
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                          margin: '0 auto 1rem'
                        }}></div>
                        <p style={{ color: '#6B7280' }}>Analyzing your symptoms...</p>
                      </motion.div>
                    ) : prediction ? (
                      <motion.div
                        key="prediction"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{ textAlign: 'center', width: '100%' }}
                      >
                        <div style={{
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          padding: '1.5rem',
                          border: '2px solid #3B82F6'
                        }}>
                          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏥</div>
                          <p style={{
                            color: '#111827',
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            marginBottom: '0.5rem'
                          }}>
                            {prediction}
                          </p>
                          <p style={{
                            color: '#6B7280',
                            fontSize: '0.875rem',
                            marginTop: '1rem'
                          }}>
                            ⚠️ This is an AI prediction. Please consult a healthcare professional for accurate diagnosis.
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ textAlign: 'center', color: '#9CA3AF', fontStyle: 'italic' }}
                      >
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔮</div>
                        <p>Prediction will appear here</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Add CSS for spin animation */}
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
  );
}
