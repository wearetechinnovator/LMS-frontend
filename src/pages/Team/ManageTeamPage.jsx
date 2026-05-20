import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import ManageTeam from '../ManageTeam'

export default function ManageTeamPage() {
  const { id } = useParams()
  const [selectedTeam] = useState({ id, name: `Team ${id}` })

  const handleBack = () => {
    window.history.back()
  }

  return (
    <div className="p-6">
      <ManageTeam
        departmentId={selectedTeam.id}
        departmentName={selectedTeam.name}
        onBack={handleBack}
      />
    </div>
  )
}
