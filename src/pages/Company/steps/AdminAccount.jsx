import React from 'react'

export default function AdminAccount({ data, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 max-w-md">
      <div className="md:col-span-2">
        <label className="text-xs text-slate-600 mb-1 block font-semibold">Admin Username *</label>
        <input
          type="text"
          value={data.adminUsername}
          onChange={(e) => onChange('adminUsername', e.target.value)}
          placeholder="john.doe"
          className="w-full h-8 px-2 text-sm border border-slate-300 rounded bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-shadow"
        />
      </div>

      <div className="md:col-span-2">
        <label className="text-xs text-slate-600 mb-1 block font-semibold">Admin Email *</label>
        <input
          type="email"
          value={data.adminEmail}
          onChange={(e) => onChange('adminEmail', e.target.value)}
          placeholder="john@acme.com"
          className="w-full h-8 px-2 text-sm border border-slate-300 rounded bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-shadow"
        />
      </div>

      <div className="md:col-span-2">
        <label className="text-xs text-slate-600 mb-1 block font-semibold">Admin Password *</label>
        <input
          type="password"
          value={data.adminPassword}
          onChange={(e) => onChange('adminPassword', e.target.value)}
          placeholder="••••••••"
          className="w-full h-8 px-2 text-sm border border-slate-300 rounded bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-shadow"
        />
      </div>
    </div>
  )
}
