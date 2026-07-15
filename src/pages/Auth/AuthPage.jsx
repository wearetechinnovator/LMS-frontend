"use client"
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AuthForm from './AuthForm'
import LoginSVG from './LoginSVG'
import RegisterSVG from './RegisterSVG'
import { registerUser, verifyOTP, loginUser } from '../../api/auth'
import Toast from '../../components/Toast'
import './auth.css'

export default function AuthPage({ onAuthSuccess }) {
  const location = useLocation()
  const [mounted, setMounted] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [step, setStep] = useState('auth') // 'auth' or 'otp'
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [resendTimer, setResendTimer] = useState(60)
  const [isLoading, setIsLoading] = useState(false)
  
  // Toast notifications state
  const [toastMessage, setToastMessage] = useState('')
  const [isToastVisible, setIsToastVisible] = useState(false)

  const [formData, setFormData] = useState({
    username: '', number: '', password: '', confirmPassword: '', rememberMe: false
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (location.state && location.state.errorMessage) {
      triggerToast(location.state.errorMessage)
      window.history.replaceState({}, document.title)
    }
  }, [location])

  useEffect(() => {
    let interval = null
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [step, resendTimer])

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setIsToastVisible(true)
  }

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
        newErrors.number = 'Mobile number or email is required'
      }

      if (!password) {
        newErrors.password = 'Password is required'
      }
    } else {
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required'
      } else if (formData.username.trim().length < 3) {
        newErrors.username = 'Username must be at least 3 characters'
      }

      const phoneClean = (formData.number || '').trim()
      if (!phoneClean) {
        newErrors.number = 'Mobile number is required'
      } else if (!/^\+?[0-9]{10,15}$/.test(phoneClean)) {
        newErrors.number = 'Please enter a valid 10-15 digit mobile number'
      }

      if (!formData.password.trim()) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const isValid = validateForm()
    if (!isValid) {
      triggerToast('Please correct the validation errors')
      return
    }

    const phoneClean = (formData.number || '').trim()

    if (isLogin) {
      const identifier = phoneClean.toLowerCase()
      const password = formData.password
      
      // Mock login check
      if (['admin@gmail.com', 'counselor@gmail.com', 'vendor@gmail.com'].includes(identifier)) {
        if (password === '1234') {
          let role = 'admin'
          if (identifier === 'counselor@gmail.com') role = 'counselor'
          if (identifier === 'vendor@gmail.com') role = 'vendor'
          
          triggerToast('Mock login successful!')
          localStorage.setItem('authToken', 'mock-jwt-token')
          localStorage.setItem('userRole', role)
          
          setTimeout(() => {
            onAuthSuccess({ username: identifier.split('@')[0], role, isNewUser: false })
          }, 1000)
          return
        } else {
          setErrors({ password: 'Incorrect password' })
          triggerToast('Incorrect password')
          return
        }
      }

      // Backend login
      setIsLoading(true)
      try {
        const response = await loginUser(phoneClean, formData.password)
        triggerToast('Login successful!')
        
        let role = 'admin'
        if (response.user && response.user.role_name) {
          const r = response.user.role_name.toLowerCase()
          if (['admin', 'counselor', 'vendor'].includes(r)) {
            role = r
          }
        }
        
        localStorage.setItem('authToken', response.token)
        localStorage.setItem('userRole', role)
        localStorage.setItem('userPermissions', JSON.stringify(response.user.permissions || {}))
        
        setTimeout(() => {
          onAuthSuccess({ username: response.user.name, role, isNewUser: false })
        }, 1000)
      } catch (err) {
        triggerToast(err.message)
      } finally {
        setIsLoading(false)
      }
    } else {
      // Backend registration (sends OTP)
      setIsLoading(true)
      try {
        await registerUser(phoneClean)
        triggerToast('OTP sent successfully to your number!')
        setResendTimer(60)
        setStep('otp')
      } catch (err) {
        triggerToast(err.message)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    const otpValue = otp.join('')
    if (otpValue.length !== 6 || !/^\d{6}$/.test(otpValue)) {
      triggerToast('Please enter a valid 6-digit OTP')
      return
    }

    setIsLoading(true)
    const phoneClean = (formData.number || '').trim()
    try {
      const response = await verifyOTP({
        user_phone_number: phoneClean,
        otp_origin: 'registration',
        otp: otpValue,
        user_name: formData.username.trim(),
        user_password: formData.password
      })

      triggerToast('OTP verified successfully! Creating account...')
      
      let role = 'admin'
      if (response.user && response.user.role_name) {
        const r = response.user.role_name.toLowerCase()
        if (['admin', 'counselor', 'vendor'].includes(r)) {
          role = r
        }
      }

      localStorage.setItem('authToken', response.token)
      localStorage.setItem('userRole', role)
      localStorage.setItem('userPermissions', JSON.stringify((response.user && response.user.permissions) || {}))

      setTimeout(() => {
        onAuthSuccess({ username: (response.user && response.user.name) || formData.username, role, isNewUser: true })
      }, 1000)
    } catch (err) {
      triggerToast(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendTimer > 0) return
    setIsLoading(true)
    const phoneClean = (formData.number || '').trim()
    try {
      await registerUser(phoneClean)
      triggerToast('OTP resent successfully!')
      setResendTimer(60)
      setOtp(['', '', '', '', '', ''])
    } catch (err) {
      triggerToast(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, '')
    if (!value) {
      const newOtp = [...otp]
      newOtp[index] = ''
      setOtp(newOtp)
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value[0]
    setOtp(newOtp)

    // Move to next input
    if (element.nextSibling && value) {
      element.nextSibling.focus()
    }
  }

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && e.target.previousSibling) {
        e.target.previousSibling.focus()
      }
    }
  }

  if (!mounted) {
    return (
      <div className="page-wrapper" />
    )
  }

  return (
    <div className="auth-page-scope w-full min-h-screen">
      <Toast message={toastMessage} isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} />
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
                <p className="auth-footer-title">TIS — Lead Management System</p>
                <p className="auth-footer-copyright">© 2025 TIS. All rights reserved.</p>
              </div>
            </motion.div>

            <div className="auth-form-scope w-full h-full md:w-1/2">
              <AnimatePresence mode="wait">
                {step === 'auth' ? (
                  <motion.div
                    key="auth-form-container"
                    className="w-full"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <AuthForm
                      isLogin={isLogin}
                      formData={formData}
                      errors={errors}
                      onFormChange={handleChange}
                      onSubmit={handleSubmit}
                      isLoading={isLoading}
                      onToggleMode={() => {
                        setIsLogin(!isLogin)
                        setErrors({})
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="otp-verification-container"
                    className="auth-container"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h1 className="auth-title">Verify Phone</h1>
                    <p className="auth-subtitle">
                      Enter the 6-digit OTP code sent to: <span className="font-semibold text-slate-800">{formData.number}</span>
                    </p>

                    <form onSubmit={handleVerifyOtp} className="auth-form mt-4">
                      <div className="flex justify-between gap-1.5 my-4">
                        {otp.map((digit, idx) => (
                          <input
                            key={idx}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(e.target, idx)}
                            onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                            className="w-10 h-11 border border-slate-300 rounded-lg text-center text-base font-bold focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
                          />
                        ))}
                      </div>

                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="auth-submit-btn flex items-center justify-center gap-2"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          'Verify OTP & Continue'
                        )}
                      </motion.button>

                      <div className="text-center mt-6">
                        <p className="text-xs text-slate-500 font-semibold">
                          {resendTimer > 0 ? (
                            `Resend code in ${resendTimer}s`
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendOtp}
                              className="text-indigo-600 hover:text-indigo-800 font-bold bg-transparent border-none cursor-pointer"
                            >
                              Resend OTP
                            </button>
                          )}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setStep('auth')
                            setOtp(['', '', '', '', '', ''])
                          }}
                          className="text-xs text-slate-400 hover:text-slate-600 font-bold bg-transparent border-none cursor-pointer mt-4"
                        >
                          Change Mobile Number
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}