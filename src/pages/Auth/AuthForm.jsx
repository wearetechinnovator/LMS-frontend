import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import '../../assets/custom.css'

const inputV = {
  hidden: { y: 10, opacity: 0 },
  visible: (i) => ({ y: 0, opacity: 1, transition: { delay: i * 0.05 } })
}

export default function AuthForm({
  isLogin,
  formData,
  errors,
  successMessage,
  onFormChange,
  onSubmit,
  onToggleMode
}) {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    let selectedRole = 'admin'
    if (isLogin) {
      const email = (formData.number || '').trim().toLowerCase()
      const password = formData.password
      if (email === 'admin@gmail.com' && password === '1234') {
        selectedRole = 'admin'
      } else if (email === 'counselor@gmail.com' && password === '1234') {
        selectedRole = 'counselor'
      } else if (email === 'vendor@gmail.com' && password === '1234') {
        selectedRole = 'vendor'
      } else {
        if (onSubmit) {
          onSubmit(e)
        }
        return
      }
    } else {
      selectedRole = formData.role || 'admin'
    }

    if (onSubmit) {
      const isValid = onSubmit(e)
      if (!isValid) return
    }

    localStorage.setItem('authToken', 'mock-jwt-token')
    localStorage.setItem('userRole', selectedRole)

    setTimeout(() => {
      if (selectedRole === 'admin') {
        navigate('/admin/dashboard')
      } else if (selectedRole === 'counselor') {
        navigate('/counselor/overview')
      } else if (selectedRole === 'vendor') {
        navigate('/vendor/portal')
      }
    }, 1500)
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isLogin ? 'lf' : 'rf'}
        className="auth-container"
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -40, opacity: 0 }}
        transition={{ duration: 0.32 }}
      >
        <h1 className="auth-title">
          {isLogin ? 'Log In' : 'Register'}
        </h1>

        <p className="auth-subtitle">
          {isLogin ? 'Log in to continue managing and converting your business leads efficiently.' : 'Create your account to get started.'}
        </p>

        {successMessage && (
          <motion.div
            className="auth-success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ✓ {successMessage}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <motion.div className="auth-form-grid" custom={0} variants={inputV} initial="hidden" animate="visible">
              <div className="auth-form-group">
                <label className="auth-label">First name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={onFormChange}
                  className={`auth-input ${errors.firstName ? 'error' : ''}`}
                  placeholder="John"
                />
                {errors.firstName && <p className="auth-error-text">{errors.firstName}</p>}
              </div>
              <div className="auth-form-group">
                <label className="auth-label">Last name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={onFormChange}
                  className={`auth-input ${errors.lastName ? 'error' : ''}`}
                  placeholder="Doe"
                />
                {errors.lastName && <p className="auth-error-text">{errors.lastName}</p>}
              </div>
            </motion.div>
          )}

          <motion.div className="auth-form-group" custom={isLogin ? 0 : 1} variants={inputV} initial="hidden" animate="visible">
            <label className="auth-label">{isLogin ? 'EMAIL ADDRESS' : 'NUMBER'}</label>
            <input
              type={isLogin ? 'email' : 'tel'}
              name="number"
              value={formData.number || ''}
              onChange={onFormChange}
              className={`auth-input ${errors.number ? 'error' : ''}`}
              placeholder={isLogin ? 'Email Address' : '9xxxxxxxx'}
            />
            {errors.number && <p className="auth-error-text">{errors.number}</p>}
          </motion.div>

          {!isLogin && (
            <motion.div className="auth-form-group" custom={2} variants={inputV} initial="hidden" animate="visible">
              <label className="auth-label">ROLE</label>
              <select
                name="role"
                value={formData.role || 'admin'}
                onChange={onFormChange}
                className="auth-input"
              >
                <option value="admin">Admin</option>
                <option value="counselor">Counselor</option>
                <option value="vendor">Vendor</option>
              </select>
            </motion.div>
          )}

          <motion.div className="auth-form-group" custom={isLogin ? 1 : 3} variants={inputV} initial="hidden" animate="visible">
            <label className="auth-label">PASSWORD</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onFormChange}
              className={`auth-input ${errors.password ? 'error' : ''}`}
              placeholder="••••••••"
            />
            {errors.password && <p className="auth-error-text">{errors.password}</p>}
          </motion.div>

          {!isLogin && (
            <motion.div className="auth-form-group" custom={4} variants={inputV} initial="hidden" animate="visible">
              <label className="auth-label">CONFIRM PASSWORD</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={onFormChange}
                className={`auth-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="auth-error-text">{errors.confirmPassword}</p>}
            </motion.div>
          )}

          {isLogin && (
            <motion.div className="auth-checkbox-group" custom={2} variants={inputV} initial="hidden" animate="visible">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={onFormChange}
                id="rememberMe"
                className="auth-checkbox"
              />
              <label htmlFor="rememberMe" className="auth-checkbox-label">Remember me</label>
            </motion.div>
          )}

          <motion.button
            type="submit"
            custom={isLogin ? 3 : 5}
            variants={inputV}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="auth-submit-btn"
          >
            {isLogin ? 'Log In' : 'Create my account'}
          </motion.button>

          <motion.div custom={isLogin ? 4 : 6} variants={inputV} initial="hidden" animate="visible" className="auth-divider-container">
            <div className="auth-divider-line-wrapper">
              <div className="auth-divider-line" />
            </div>
            <div className="auth-divider-text-wrapper">
              <span className="auth-divider-text">Or continue with</span>
            </div>
          </motion.div>

          <motion.div custom={isLogin ? 5 : 7} variants={inputV} initial="hidden" animate="visible" className="auth-oauth-group">
            <button
              type="button"
              onClick={() => console.log('Google OAuth')}
              className="auth-oauth-btn"
            >
              <svg className="auth-oauth-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="auth-oauth-text">Google</span>
            </button>
            <button
              type="button"
              onClick={() => console.log('LinkedIn OAuth')}
              className="auth-oauth-btn"
            >
              <svg className="auth-oauth-icon" viewBox="0 0 24 24" fill="#0A66C2" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
              </svg>
              <span className="auth-oauth-text">LinkedIn</span>
            </button>
          </motion.div>
        </form>

        <motion.div className="auth-footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <p className="auth-footer-text">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={onToggleMode}
              className="auth-footer-link"
            >
              {isLogin ? 'Sign up here' : 'Log In'}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}