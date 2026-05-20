import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import ViewTeam from '../ViewTeam'

export default function ViewTeamPage() {
  const { id } = useParams()
  const [selectedTeam] = useState({ id, name: `Team ${id}` })

  const handleBack = () => {
    window.history.back()
  }

  return (
    <div className="p-6">
      <ViewTeam
        departmentId={selectedTeam.id}
        departmentName={selectedTeam.name}
        onBack={handleBack}
      />
    </div>
  )
}
