import React from 'react'
import { motion } from 'framer-motion'

export default function CompanyProfile({ data, onChange }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const MAX_SIZE = 2 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      alert('Error: Selected image size exceeds the 2MB limit.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64String = event.target.result
      onChange('logoFile', base64String)
    }
    reader.readAsDataURL(file)
  }

  return (
    <motion.div
      className="profile-container company-profile-scope"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo Upload Box */}
      <motion.div
        className="profile-section-card"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="section-title">
          <span className="material-symbols-outlined mr-2 text-primary text-[20px]">cloud_upload</span>
          Organization Logo
        </h2>
        <div className="upload-zone" onClick={() => document.getElementById('logo-file-input').click()}>
          {data.logoFile ? (
            <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-100 flex items-center justify-center bg-white shadow-xs">
              <img src={data.logoFile} alt="Company logo preview" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="upload-icon-wrapper">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '32px' }}>cloud_upload</span>
            </div>
          )}
          <span className="upload-click-label">
            {data.logoFile ? 'Change logo' : 'Click to upload'}
          </span>
          <span className="upload-hint">or drag and drop SVG, PNG, JPG, GIF (max. 2MB)</span>
          <input
            type="file"
            id="logo-file-input"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept=".svg,.png,.jpg,.jpeg,.gif"
          />
        </div>
      </motion.div>

      {/* Company Name */}
      <motion.div
        className="profile-section-card"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <label className="field-label">COMPANY NAME *</label>
        <input
          type="text"
          value={data.companyName}
          onChange={(e) => onChange('companyName', e.target.value)}
          placeholder="e.g. Acme Corp"
          className="form-input"
        />
      </motion.div>

      {/* Industry Dropdown */}
      <motion.div
        className="profile-section-card-half"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        <label className="field-label">INDUSTRY *</label>
        <div className="select-wrapper">
          <select
            value={data.industry}
            onChange={(e) => onChange('industry', e.target.value)}
            className="form-select"
          >
            <option value="">Select industry...</option>
            <option value="tech">Technology / Software</option>
            <option value="health">Healthcare / Medical</option>
            <option value="edu">Education / School</option>
            <option value="sales">Retail / Sales</option>
          </select>
          <span className="material-symbols-outlined select-arrow" style={{ fontSize: '20px' }}>expand_more</span>
        </div>
      </motion.div>

      {/* Company Size Dropdown */}
      <motion.div
        className="profile-section-card-half"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <label className="field-label">COMPANY SIZE</label>
        <div className="select-wrapper">
          <select
            value={data.companySize}
            onChange={(e) => onChange('companySize', e.target.value)}
            className="form-select"
          >
            <option value="">Select size...</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201+">201+ employees</option>
          </select>
          <span className="material-symbols-outlined select-arrow" style={{ fontSize: '20px' }}>expand_more</span>
        </div>
      </motion.div>

      {/* Primary Contact Email */}
      <motion.div
        className="profile-section-card-half"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        <label className="field-label">PRIMARY CONTACT EMAIL</label>
        <input
          type="email"
          value={data.primaryEmail}
          onChange={(e) => onChange('primaryEmail', e.target.value)}
          placeholder="admin@company.com"
          className="form-input"
        />
      </motion.div>

      {/* Support Phone */}
      <motion.div
        className="profile-section-card-half"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <label className="field-label">SUPPORT/MAIN PHONE</label>
        <input
          type="tel"
          value={data.supportPhone}
          onChange={(e) => onChange('supportPhone', e.target.value)}
          placeholder="+1 (555) 000-0000"
          className="form-input"
        />
      </motion.div>
    </motion.div>
  )
}
