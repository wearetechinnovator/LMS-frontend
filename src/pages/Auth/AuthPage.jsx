"use client"
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AuthForm from './AuthForm'
import LoginSVG from './LoginSVG'
import RegisterSVG from './RegisterSVG'
import './auth.css'
export default function AuthPage({ onAuthSuccess }) {
  const [mounted, setMounted] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', number: '', username: '',
    password: '', confirmPassword: '', rememberMe: false
  })
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (isLogin) {
      const email = (formData.number || '').trim().toLowerCase()
      const password = formData.password

      if (!email) {
        newErrors.number = 'Email address is required'
      } else if (email !== 'admin@gmail.com' && email !== 'counselor@gmail.com' && email !== 'vendor@gmail.com') {
        newErrors.number = 'Invalid email address'
      }

      if (!password) {
        newErrors.password = 'Password is required'
      } else if (password !== '1234') {
        newErrors.password = 'Incorrect password'
      }
    } else {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
      if (!formData.number.trim()) newErrors.number = 'Number is required'
      else if (!/^\+?[0-9]{7,15}$/.test(formData.number.trim())) newErrors.number = 'Please enter a valid number'
      if (!formData.password.trim()) newErrors.password = 'Password is required'
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const isValid = validateForm()
    if (isValid) {
      setSuccessMessage(isLogin ? 'Login successful!' : 'Account created successfully!')
      setTimeout(() => {
        onAuthSuccess({ username: formData.number, isNewUser: !isLogin })
      }, 1500)
    }
    return isValid
  }

  if (!mounted) {
    return (
      <div className="page-wrapper" />
    )
  }

  return (
    <div className="auth-page-scope w-full min-h-screen">
      <motion.div
        className="page-wrapper"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
      >
        <div className="auth-card-container">
          <motion.div
            className="auth-card"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="auth-sidebar"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <div className="auth-sidebar-pattern" />

              <div className="auth-sidebar-header">
                <div className="auth-badge">
                  <span className="auth-badge-dot" />
                  TIS PLATFORM
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={isLogin ? 'lt' : 'rt'}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28 }}
                  >
                    <h2 className="auth-sidebar-title">
                      {isLogin ? 'Welcome back!' : 'Join our community'}
                    </h2>
                    <p className="auth-sidebar-desc">
                      {isLogin
                        ? 'Log in to continue managing and converting your business leads efficiently.'
                        : 'Create an account and take control of your sales pipeline from one place.'}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="auth-animation-wrapper">
                <motion.div
                  className="auth-animation-inner"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <AnimatePresence mode="wait">
                    {isLogin ? (
                      <motion.div
                        key="login"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.25 }}
                        style={{ width: '480px', height: '400px', position: 'absolute', bottom: '-40%', right: '-11%' }}
                      >
                        <LoginSVG />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="register"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.25 }}
                        style={{ width: '340px', height: '400px' }}
                      >
                        <RegisterSVG />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              <div className="auth-sidebar-footer">
                <p className="auth-footer-title">TIS — Learning Management System</p>
                <p className="auth-footer-copyright">© 2025 TIS. All rights reserved.</p>
              </div>
            </motion.div>

            <div className="auth-form-scope w-full h-full md:w-1/2">
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
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}