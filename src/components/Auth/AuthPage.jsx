import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LoginSVG from './LoginSVG'
import RegisterSVG from './RegisterSVG'
import AuthForm from './AuthForm'

export default function AuthPage({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', username: '',
    password: '', confirmPassword: '', rememberMe: false
  })
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (isLogin) {
      if (!formData.email.trim()) newErrors.email = 'Email or username is required'
      if (!formData.password.trim()) newErrors.password = 'Password is required'
    } else {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email'
      if (!formData.username.trim()) newErrors.username = 'Username is required'
      else if (formData.username.length < 4) newErrors.username = 'Username must be at least 4 characters'
      if (!formData.password.trim()) newErrors.password = 'Password is required'
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      setSuccessMessage(isLogin ? 'Login successful!' : 'Account created successfully!')
      setTimeout(() => {
        onAuthSuccess({ username: formData.username || formData.email, isNewUser: !isLogin })
      }, 1500)
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-background flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #004ac6 0%, #1e3a8a 100%)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
    >
      <div className="w-full">
        <motion.div
          className="flex rounded-3xl shadow-2xl overflow-hidden bg-surface max-w-4xl mx-auto"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Left Panel */}
          <motion.div
            className="hidden md:flex md:w-1/2 flex-col justify-between text-white relative overflow-hidden"
            style={{ background: 'linear-gradient(145deg, #004ac6 0%, #003a9f 50%, #002d7a 100%)' }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {/* Dot-grid texture */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px)',
              backgroundSize: '20px 20px', pointerEvents: 'none'
            }} />

            {/* Top section */}
            <div className="relative z-10 p-8 pb-4">
              {/* Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                background: 'rgba(255,255,255,0.1)', borderRadius: '20px',
                padding: '5px 13px', fontSize: '8px', letterSpacing: '1.5px',
                marginBottom: '18px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.15)'
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 6px #4ade80' }} />
                TIS PLATFORM
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={isLogin ? 'lt' : 'rt'}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                >
                  <h2 style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.2, marginBottom: '10px' }}>
                    {isLogin ? 'Welcome back!' : 'Join our community'}
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '12px', lineHeight: 1.65 }}>
                    {isLogin
                      ? 'Log in to continue managing and converting your business leads efficiently.'
                      : 'Create an account and take control of your sales pipeline from one place.'}
                  </p>
                </motion.div>
              </AnimatePresence>


            </div>



            {/* Footer */}
            <div className="relative z-10 px-8 py-4">
              <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>TIS — Learning Management System</p>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>© 2025 TIS. All rights reserved.</p>
            </div>
          </motion.div>

          {/* Right Panel - Form */}
          <AuthForm
            isLogin={isLogin}
            formData={formData}
            errors={errors}
            successMessage={successMessage}
            onFormChange={handleChange}
            onSubmit={handleSubmit}
            onToggleMode={() => {
              setIsLogin(!isLogin)
              setErrors({})
              setSuccessMessage('')
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
