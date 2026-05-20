import React from 'react'
import { motion } from 'framer-motion'

export default function CompanyProfile({ data, onChange }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onChange('logoFile', file.name)
    }
  }

  return (
    <motion.div 
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 flex-1 content-start"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo Upload Box */}
      <motion.div 
        className="lg:col-span-12 bg-surface border border-outline-variant rounded p-6 shadow-sm"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center">
          <span className="material-symbols-outlined mr-2 text-primary text-[20px]">cloud_upload</span>
          Organization Logo
        </h2>
        <div className="border border-dashed border-outline-variant rounded p-8 flex flex-col items-center justify-center text-center hover:bg-surface-container transition cursor-pointer group">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-primary" style={{fontSize: '32px'}}>cloud_upload</span>
          </div>
          <span className="font-body-md text-body-md text-primary font-semibold">Click to upload</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-2">or drag and drop SVG, PNG, JPG (max. 2MB)</span>
          <input 
            type="file" 
            onChange={handleFileChange}
            className="hidden"
            accept=".svg,.png,.jpg,.jpeg"
          />
        </div>
      </motion.div>

      {/* Company Name */}
      <motion.div 
        className="lg:col-span-12 bg-surface border border-outline-variant rounded p-6 shadow-sm"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">COMPANY NAME *</label>
        <input
          type="text"
          value={data.companyName}
          onChange={(e) => onChange('companyName', e.target.value)}
          placeholder="e.g. Acme Corp"
          className="w-full h-10 px-3 font-body-md text-body-md border border-outline-variant rounded bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow placeholder:text-on-surface-variant/50"
        />
      </motion.div>

      {/* Industry Dropdown */}
      <motion.div 
        className="lg:col-span-6 bg-surface border border-outline-variant rounded p-6 shadow-sm"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">INDUSTRY *</label>
        <div className="relative">
          <select
            value={data.industry}
            onChange={(e) => onChange('industry', e.target.value)}
            className="w-full h-10 px-3 font-body-md text-body-md border border-outline-variant rounded bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none pr-10 cursor-pointer transition-shadow"
          >
            <option value="">Select industry...</option>
            <option value="tech">Technology / Software</option>
            <option value="health">Healthcare / Medical</option>
            <option value="edu">Education / School</option>
            <option value="sales">Retail / Sales</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none" style={{fontSize: '20px'}}>expand_more</span>
        </div>
      </motion.div>

      {/* Company Size Dropdown */}
      <motion.div 
        className="lg:col-span-6 bg-surface border border-outline-variant rounded p-6 shadow-sm"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">COMPANY SIZE</label>
        <div className="relative">
          <select
            value={data.companySize}
            onChange={(e) => onChange('companySize', e.target.value)}
            className="w-full h-10 px-3 font-body-md text-body-md border border-outline-variant rounded bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none pr-10 cursor-pointer transition-shadow"
          >
            <option value="">Select size...</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201+">201+ employees</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none" style={{fontSize: '20px'}}>expand_more</span>
        </div>
      </motion.div>

      {/* Primary Contact Email */}
      <motion.div 
        className="lg:col-span-6 bg-surface border border-outline-variant rounded p-6 shadow-sm"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">PRIMARY CONTACT EMAIL</label>
        <input
          type="email"
          value={data.primaryEmail}
          onChange={(e) => onChange('primaryEmail', e.target.value)}
          placeholder="admin@company.com"
          className="w-full h-10 px-3 font-body-md text-body-md border border-outline-variant rounded bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow placeholder:text-on-surface-variant/50"
        />
      </motion.div>

      {/* Support Phone */}
      <motion.div 
        className="lg:col-span-6 bg-surface border border-outline-variant rounded p-6 shadow-sm"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">SUPPORT/MAIN PHONE</label>
        <input
          type="tel"
          value={data.supportPhone}
          onChange={(e) => onChange('supportPhone', e.target.value)}
          placeholder="+1 (555) 000-0000"
          className="w-full h-10 px-3 font-body-md text-body-md border border-outline-variant rounded bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow placeholder:text-on-surface-variant/50"
        />
      </motion.div>
    </motion.div>
  )
}
