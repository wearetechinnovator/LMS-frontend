import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Teams() {
  const navigate = useNavigate()

  const teams = [
    {
      id: '1',
      name: 'Sales Team A',
      description: 'Primary outreach team for undergraduate and post-graduate admissions.',
      head: 'Michael Chen',
      membersCount: 12,
      status: 'Active',
      color: 'blue'
    },
    {
      id: '2',
      name: 'Sales Team B',
      description: 'Corporate partnerships, executive programs, and sponsorship outreach.',
      head: 'Sarah Johnson',
      membersCount: 8,
      status: 'Active',
      color: 'indigo'
    },
    {
      id: '3',
      name: 'Marketing Team',
      description: 'Lead generation, campaign mapping, SEO, and social ads management.',
      head: 'Alex Turner',
      membersCount: 6,
      status: 'Active',
      color: 'purple'
    },
    {
      id: '4',
      name: 'Support Team',
      description: 'Inbound prospect inquiries, general counseling support, and resolutions.',
      head: 'Emma Davis',
      membersCount: 5,
      status: 'Inactive',
      color: 'slate'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div>
          <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest block mb-0.5">Organization</span>
          <h1 className="text-xl font-extrabold text-slate-800">Teams & Departments</h1>
          <p className="text-[11.5px] text-slate-400 font-medium mt-0.5">
            Manage your organization units, assign role leads, and configure distribution rules.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {teams.map((team) => (
          <div key={team.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-sm transition-shadow">
            <div className="flex-1 min-w-[280px]">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className={`inline-block px-2 py-0.5 rounded text-[9.5px] font-extrabold uppercase border ${
                  team.color === 'blue' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                  team.color === 'indigo' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                  team.color === 'purple' ? 'bg-purple-50 border-purple-200 text-purple-700' :
                  'bg-slate-50 border-slate-200 text-slate-500'
                }`}>
                  {team.name}
                </span>
                <span className={`inline-block px-2 py-0.5 rounded text-[9.5px] font-extrabold border ${
                  team.status === 'Active' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-100 border-slate-200 text-slate-500'
                }`}>
                  {team.status}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-800 mb-1">{team.name}</h3>
              <p className="text-[12px] text-slate-500 leading-relaxed max-w-[550px]">{team.description}</p>
            </div>

            <div className="flex items-center gap-8 md:gap-12 min-w-[220px]">
              <div>
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-0.5">Team Lead</span>
                <span className="text-[12px] font-bold text-slate-700">{team.head}</span>
              </div>
              <div>
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-0.5">Active Members</span>
                <span className="text-[12px] font-bold text-slate-700">{team.membersCount} Members</span>
              </div>
            </div>

            <div className="flex gap-2.5 min-w-[240px] md:min-w-[260px] justify-start md:justify-end">
              <button
                onClick={() => navigate(`${team.id}`)}
                className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all text-center cursor-pointer whitespace-nowrap"
              >
                View Details
              </button>
              <button
                onClick={() => navigate(`${team.id}/manage`)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer whitespace-nowrap"
              >
                Manage Members
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
