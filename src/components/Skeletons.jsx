import React from 'react'

export function DashboardSkeleton() {
  return (
    <div className="skeleton-page">
      <div className="skeleton-header">
        <div>
          <div className="shimmer-block skeleton-title"></div>
          <div className="shimmer-block skeleton-subtitle"></div>
        </div>
        <div className="skeleton-header-actions">
          <div className="shimmer-block skeleton-btn" style={{ width: '130px' }}></div>
          <div className="shimmer-block skeleton-btn"></div>
        </div>
      </div>
      
      <div className="skeleton-stats-grid">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="skeleton-stat-card">
            <div className="shimmer-block skeleton-stat-label"></div>
            <div className="shimmer-block skeleton-stat-val"></div>
          </div>
        ))}
      </div>

      <div className="skeleton-charts-row">
        <div className="shimmer-block skeleton-chart-box"></div>
        <div className="shimmer-block skeleton-chart-box"></div>
      </div>

      <div className="skeleton-table-container" style={{ height: '240px' }}>
        <div className="shimmer-block skeleton-table-header"></div>
        {[1, 2, 3].map(n => (
          <div key={n} className="skeleton-table-row">
            <div className="shimmer-block skeleton-table-cell" style={{ width: '30%' }}></div>
            <div className="shimmer-block skeleton-table-cell"></div>
            <div className="shimmer-block skeleton-table-cell"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LeadsSkeleton() {
  return (
    <div className="skeleton-page">
      <div className="skeleton-header">
        <div>
          <div className="shimmer-block skeleton-title"></div>
          <div className="shimmer-block skeleton-subtitle"></div>
        </div>
        <div className="skeleton-header-actions">
          <div className="shimmer-block skeleton-btn"></div>
          <div className="shimmer-block skeleton-btn"></div>
        </div>
      </div>

      <div className="skeleton-stats-grid">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="skeleton-stat-card">
            <div className="shimmer-block skeleton-stat-label"></div>
            <div className="shimmer-block skeleton-stat-val"></div>
          </div>
        ))}
      </div>

      <div className="shimmer-block skeleton-toolbar"></div>

      <div className="skeleton-table-container">
        <div className="shimmer-block skeleton-table-header"></div>
        {[1, 2, 3, 4, 5].map(n => (
          <div key={n} className="skeleton-table-row">
            <div className="shimmer-block skeleton-table-cell-check"></div>
            <div className="shimmer-block skeleton-table-cell" style={{ flex: 1.5 }}></div>
            <div className="shimmer-block skeleton-table-cell"></div>
            <div className="shimmer-block skeleton-table-cell"></div>
            <div className="shimmer-block skeleton-table-cell"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AnalyticsSkeleton() {
  return (
    <div className="skeleton-page">
      <div className="skeleton-header">
        <div>
          <div className="shimmer-block skeleton-title"></div>
          <div className="shimmer-block skeleton-subtitle"></div>
        </div>
        <div className="skeleton-header-actions">
          <div className="shimmer-block skeleton-btn" style={{ width: '120px' }}></div>
        </div>
      </div>

      <div className="skeleton-stats-grid">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="skeleton-stat-card">
            <div className="shimmer-block skeleton-stat-label"></div>
            <div className="shimmer-block skeleton-stat-val"></div>
          </div>
        ))}
      </div>

      <div className="shimmer-block skeleton-chart-box" style={{ height: '320px' }}></div>
    </div>
  )
}

export function CampaignsSkeleton() {
  return (
    <div className="skeleton-page">
      <div className="skeleton-header">
        <div>
          <div className="shimmer-block skeleton-title" style={{ width: '220px' }}></div>
          <div className="shimmer-block skeleton-subtitle"></div>
        </div>
        <div className="skeleton-header-actions">
          <div className="shimmer-block skeleton-btn" style={{ width: '130px' }}></div>
        </div>
      </div>

      <div className="skeleton-cards-grid">
        {[1, 2, 3].map(n => (
          <div key={n} className="skeleton-card">
            <div className="shimmer-block" style={{ width: '40%', height: '14px' }}></div>
            <div className="shimmer-block" style={{ width: '80%', height: '24px' }}></div>
            <div className="shimmer-block" style={{ width: '60%', height: '12px' }}></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TeamsSkeleton() {
  return (
    <div className="skeleton-page">
      <div className="skeleton-header">
        <div>
          <div className="shimmer-block skeleton-title"></div>
          <div className="shimmer-block skeleton-subtitle"></div>
        </div>
        <div className="skeleton-header-actions">
          <div className="shimmer-block skeleton-btn" style={{ width: '120px' }}></div>
        </div>
      </div>

      <div className="skeleton-cards-grid">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="skeleton-card" style={{ height: '180px' }}>
            <div className="shimmer-block" style={{ width: '50px', height: '50px', borderRadius: '50%' }}></div>
            <div className="shimmer-block" style={{ width: '70%', height: '16px' }}></div>
            <div className="shimmer-block" style={{ width: '50%', height: '12px' }}></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AuditLogsSkeleton() {
  return (
    <div className="skeleton-page">
      <div className="skeleton-header">
        <div>
          <div className="shimmer-block skeleton-title"></div>
          <div className="shimmer-block skeleton-subtitle"></div>
        </div>
      </div>

      <div className="shimmer-block skeleton-toolbar"></div>

      <div className="skeleton-table-container">
        <div className="shimmer-block skeleton-table-header"></div>
        {[1, 2, 3, 4, 5].map(n => (
          <div key={n} className="skeleton-table-row">
            <div className="shimmer-block skeleton-table-cell" style={{ flex: 0.8 }}></div>
            <div className="shimmer-block skeleton-table-cell" style={{ flex: 1.5 }}></div>
            <div className="shimmer-block skeleton-table-cell"></div>
            <div className="shimmer-block skeleton-table-cell"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function RolesSkeleton() {
  return (
    <div className="skeleton-page">
      <div className="skeleton-header">
        <div>
          <div className="shimmer-block skeleton-title" style={{ width: '200px' }}></div>
          <div className="shimmer-block skeleton-subtitle"></div>
        </div>
        <div className="skeleton-header-actions">
          <div className="shimmer-block skeleton-btn" style={{ width: '120px' }}></div>
        </div>
      </div>

      <div className="skeleton-form-layout">
        <div className="skeleton-form-sidebar" style={{ height: '360px' }}>
          {[1, 2, 3].map(n => (
            <div key={n} className="shimmer-block" style={{ height: '40px', marginBottom: '12px', borderRadius: '8px' }}></div>
          ))}
        </div>
        <div className="skeleton-form-body" style={{ height: '360px' }}>
          <div className="shimmer-block" style={{ width: '40%', height: '18px', marginBottom: '16px' }}></div>
          <div className="shimmer-block" style={{ width: '90%', height: '12px', marginBottom: '8px' }}></div>
          <div className="shimmer-block" style={{ width: '80%', height: '12px', marginBottom: '8px' }}></div>
          <div className="shimmer-block" style={{ width: '85%', height: '12px' }}></div>
        </div>
      </div>
    </div>
  )
}

export function FormBuilderSkeleton() {
  return (
    <div className="skeleton-page">
      <div className="skeleton-header">
        <div>
          <div className="shimmer-block skeleton-title" style={{ width: '180px' }}></div>
          <div className="shimmer-block skeleton-subtitle"></div>
        </div>
      </div>

      <div className="skeleton-form-layout">
        <div className="skeleton-form-sidebar">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="shimmer-block" style={{ height: '36px', marginBottom: '12px', borderRadius: '8px' }}></div>
          ))}
        </div>
        <div className="skeleton-form-body">
          <div className="shimmer-block" style={{ width: '30%', height: '16px', marginBottom: '24px' }}></div>
          {[1, 2, 3].map(n => (
            <div key={n} className="shimmer-block" style={{ height: '48px', marginBottom: '16px', borderRadius: '8px' }}></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function FormEmbedSkeleton() {
  return (
    <div className="skeleton-page">
      <div className="skeleton-header">
        <div>
          <div className="shimmer-block skeleton-title" style={{ width: '180px' }}></div>
          <div className="shimmer-block skeleton-subtitle"></div>
        </div>
      </div>

      <div className="skeleton-form-layout">
        <div className="skeleton-form-sidebar" style={{ height: '400px' }}>
          {[1, 2, 3].map(n => (
            <div key={n} className="shimmer-block" style={{ height: '44px', marginBottom: '12px', borderRadius: '8px' }}></div>
          ))}
        </div>
        <div className="skeleton-form-body" style={{ height: '400px' }}>
          <div className="shimmer-block" style={{ width: '40%', height: '16px', marginBottom: '16px' }}></div>
          <div className="shimmer-block" style={{ height: '140px', borderRadius: '8px', marginBottom: '16px' }}></div>
          <div className="shimmer-block" style={{ width: '120px', height: '32px', borderRadius: '8px' }}></div>
        </div>
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="skeleton-page">
      <div className="skeleton-header">
        <div>
          <div className="shimmer-block skeleton-title" style={{ width: '180px' }}></div>
          <div className="shimmer-block skeleton-subtitle"></div>
        </div>
      </div>

      <div className="shimmer-block" style={{ width: '240px', height: '32px', marginBottom: '16px' }}></div>

      <div className="skeleton-form-layout">
        <div className="skeleton-form-sidebar" style={{ height: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <div className="shimmer-block" style={{ width: '80px', height: '80px', borderRadius: '50%' }}></div>
          <div className="shimmer-block" style={{ width: '60%', height: '16px' }}></div>
          <div className="shimmer-block" style={{ width: '40%', height: '12px' }}></div>
        </div>
        <div className="skeleton-form-body" style={{ height: '320px' }}>
          <div className="shimmer-block" style={{ width: '30%', height: '18px', marginBottom: '24px' }}></div>
          <div className="skeleton-stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {[1, 2, 3, 4].map(n => (
              <div key={n} style={{ marginBottom: '16px' }}>
                <div className="shimmer-block" style={{ width: '40%', height: '10px', marginBottom: '6px' }}></div>
                <div className="shimmer-block" style={{ width: '90%', height: '32px', borderRadius: '6px' }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SettingsSkeleton() {
  return (
    <div className="skeleton-page">
      <div className="skeleton-header">
        <div>
          <div className="shimmer-block skeleton-title" style={{ width: '180px' }}></div>
          <div className="shimmer-block skeleton-subtitle"></div>
        </div>
      </div>

      <div className="skeleton-form-layout">
        <div className="skeleton-form-sidebar">
          {[1, 2, 3, 4, 5].map(n => (
            <div key={n} className="shimmer-block" style={{ height: '40px', marginBottom: '12px', borderRadius: '8px' }}></div>
          ))}
        </div>
        <div className="skeleton-form-body">
          <div className="shimmer-block" style={{ width: '30%', height: '16px', marginBottom: '16px' }}></div>
          <div className="shimmer-block" style={{ width: '85%', height: '12px', marginBottom: '24px' }}></div>
          {[1, 2, 3].map(n => (
            <div key={n} className="shimmer-block" style={{ height: '56px', marginBottom: '16px', borderRadius: '8px' }}></div>
          ))}
        </div>
      </div>
    </div>
  )
}
