import { useState } from 'react';
import Layout from './common/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Predictor } from './Predictor';
import { AIRecommender } from './AIRecommender';

export function TriageHub() {
  const [activeTab, setActiveTab] = useState('recommender'); // 'recommender' or 'predictor'

  return (
    <Layout>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Hub Header & Tabs */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#111827', margin: '0 0 0.5rem 0' }}>
            Medical Triage Hub
          </h1>
          <p style={{ color: '#6B7280', fontSize: '1.125rem', margin: '0 0 2rem 0' }}>
            Select a tool below to analyze your symptoms or medical reports.
          </p>

          <div style={{ 
            display: 'inline-flex', 
            backgroundColor: '#F3F4F6', 
            padding: '0.375rem', 
            borderRadius: '12px',
            gap: '0.375rem'
          }}>
            <button
              onClick={() => setActiveTab('recommender')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.938rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: activeTab === 'recommender' ? 'white' : 'transparent',
                color: activeTab === 'recommender' ? '#111827' : '#6B7280',
                boxShadow: activeTab === 'recommender' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              🤖 AI Specialist Recommender
            </button>
            <button
              onClick={() => setActiveTab('predictor')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.938rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: activeTab === 'predictor' ? 'white' : 'transparent',
                color: activeTab === 'predictor' ? '#111827' : '#6B7280',
                boxShadow: activeTab === 'predictor' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              🔮 Local Disease Predictor
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'recommender' ? (
            <motion.div
              key="recommender"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <AIRecommender />
            </motion.div>
          ) : (
            <motion.div
              key="predictor"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Predictor />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </Layout>
  );
}

export default TriageHub;
