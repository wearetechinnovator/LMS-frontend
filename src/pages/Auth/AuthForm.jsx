import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isLogin ? 'lf' : 'rf'}
        className="w-full md:w-1/2 p-8 md:p-8 flex flex-col justify-center bg-surface"
        initial={{ x:40, opacity:0 }} animate={{ x:0, opacity:1 }} exit={{ x:-40, opacity:0 }}
        transition={{ duration: 0.32 }}
      >
        <h1 className="text-2xl font-bold text-on-background mb-1">
          {isLogin ? 'Log In' : 'Register'}
        </h1>
        
        <p className="text-[10px] text-on-surface-variant mb-2">
          {isLogin ? 'Log in to continue managing and converting your business leads efficiently.' : 'Create your account to get started.'}
        </p>

        {successMessage && (
          <motion.div className="mb-6 p-4 bg-primary/10 border border-primary rounded-lg text-primary font-body-sm text-body-sm"
            initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
            ✓ {successMessage}
          </motion.div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          {/* First Name - Registration only */}
          {!isLogin && (
            <motion.div className="grid grid-cols-2 gap-4" custom={0} variants={inputV} initial="hidden" animate="visible">
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">First name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={onFormChange}
                  className={`w-full px-3 h-8 border rounded font-body-md text-body-md focus:outline-none focus:ring-1 transition ${errors.firstName?'border-error focus:ring-error focus:border-error':'border-outline-variant focus:ring-primary focus:border-primary'}`}
                  placeholder="John"/>
                {errors.firstName && <p className="text-error text-body-sm mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">Last name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={onFormChange}
                  className={`w-full px-3 h-8 border rounded font-body-md text-body-md focus:outline-none focus:ring-1 transition ${errors.lastName?'border-error focus:ring-error focus:border-error':'border-outline-variant focus:ring-primary focus:border-primary'}`}
                  placeholder="Doe"/>
                {errors.lastName && <p className="text-error text-body-sm mt-1">{errors.lastName}</p>}
              </div>
            </motion.div>
          )}

          {/* Email */}
          <motion.div custom={isLogin?0:1} variants={inputV} initial="hidden" animate="visible">
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">{isLogin?'USERNAME OR EMAIL':'EMAIL ADDRESS'}</label>
            <input type="email" name="email" value={formData.email} onChange={onFormChange}
              className={`w-full px-3 h-8 border rounded font-body-md text-body-md focus:outline-none focus:ring-1 transition ${errors.email?'border-error focus:ring-error focus:border-error':'border-outline-variant focus:ring-primary focus:border-primary'}`}
              placeholder={isLogin?'your@email.com':'john@example.com'}/>
            {errors.email && <p className="text-error text-body-sm mt-1">{errors.email}</p>}
          </motion.div>

          {/* Username - Registration only */}
          {!isLogin && (
            <motion.div custom={2} variants={inputV} initial="hidden" animate="visible">
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">USERNAME (4–20 CHARACTERS)</label>
              <input type="text" name="username" value={formData.username} onChange={onFormChange}
                className={`w-full px-3 h-8 border rounded font-body-md text-body-md focus:outline-none focus:ring-1 transition ${errors.username?'border-error focus:ring-error focus:border-error':'border-outline-variant focus:ring-primary focus:border-primary'}`}
                placeholder="johndoe"/>
              {errors.username && <p className="text-error text-body-sm mt-1">{errors.username}</p>}
            </motion.div>
          )}

          {/* Password */}
          <motion.div custom={isLogin?1:3} variants={inputV} initial="hidden" animate="visible">
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">PASSWORD</label>
            <input type="password" name="password" value={formData.password} onChange={onFormChange}
              className={`w-full px-3 h-8 border rounded font-body-md text-body-md focus:outline-none focus:ring-1 transition ${errors.password?'border-error focus:ring-error focus:border-error':'border-outline-variant focus:ring-primary focus:border-primary'}`}
              placeholder="••••••••"/>
            {errors.password && <p className="text-error text-body-sm mt-1">{errors.password}</p>}
          </motion.div>

          {/* Confirm Password - Registration only */}
          {!isLogin && (
            <motion.div custom={4} variants={inputV} initial="hidden" animate="visible">
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">CONFIRM PASSWORD</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={onFormChange}
                className={`w-full px-3 h-8 border rounded font-body-md text-body-md focus:outline-none focus:ring-1 transition ${errors.confirmPassword?'border-error focus:ring-error focus:border-error':'border-outline-variant focus:ring-primary focus:border-primary'}`}
                placeholder="••••••••"/>
              {errors.confirmPassword && <p className="text-error text-body-sm mt-1">{errors.confirmPassword}</p>}
            </motion.div>
          )}

          {/* Remember Me - Login only */}
          {isLogin && (
            <motion.div className="flex items-center" custom={2} variants={inputV} initial="hidden" animate="visible">
              <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={onFormChange}
                id="rememberMe" className="h-4 w-4 text-primary border-outline-variant rounded focus:ring-primary"/>
              <label htmlFor="rememberMe" className="ml-3 font-body-md text-body-md text-on-surface">Remember me</label>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button type="submit"
            custom={isLogin?3:5} variants={inputV} initial="hidden" animate="visible"
            whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
            className="w-full mt-6 bg-primary hover:bg-primary/90 text-on-primary font-headline-md text-headline-md py-1.5 px-1 rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {isLogin ? 'Log In' : 'Create my account'}
          </motion.button>

          {/* Divider */}
          <motion.div custom={isLogin?4:6} variants={inputV} initial="hidden" animate="visible" className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-on-surface-variant font-body-sm">Or continue with</span>
            </div>
          </motion.div>

          {/* OAuth Buttons */}
          <motion.div custom={isLogin?5:7} variants={inputV} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3">
            <button type="button" 
              onClick={() => console.log('Google OAuth')}
              className="flex items-center justify-center gap-2 h-10 border border-outline-variant rounded bg-surface hover:bg-surface-container transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-body-md text-body-md text-on-surface">Google</span>
            </button>
            <button type="button"
              onClick={() => console.log('LinkedIn OAuth')}
              className="flex items-center justify-center gap-2 h-10 border border-outline-variant rounded bg-surface hover:bg-surface-container transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0A66C2" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
              </svg>
              <span className="font-body-md text-body-md text-on-surface">LinkedIn</span>
            </button>
          </motion.div>
        </form>

        {/* Toggle Link */}
        <motion.div className="mt-6 text-center" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" onClick={onToggleMode}
              className="text-primary hover:text-primary/80 font-bold transition">
              {isLogin ? 'Sign up here' : 'Log In'}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
