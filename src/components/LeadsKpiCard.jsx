import React from 'react';
import './LeadsKpiCard.css';

export default function LeadsKpiCard({ label, value, icon, trend, trendUp, sparkline }) {
  return (
    <div className="leads-kpi-card">
      <div className="leads-kpi-header">
        <span className="leads-kpi-label">
          {label}
        </span>
        {icon && (
          <span className="material-symbols-outlined leads-kpi-icon select-none">
            {icon}
          </span>
        )}
      </div>

      <div className="leads-kpi-body">
        <span className="leads-kpi-value">
          {value}
        </span>
      </div>

      {(trend || sparkline) && (
        <div className="leads-kpi-footer">
          {trend && (
            <span className={`leads-kpi-trend ${trendUp ? 'trend-up' : 'trend-down'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </span>
          )}
          {sparkline && (
            <div className="leads-kpi-chart">
              {sparkline}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
