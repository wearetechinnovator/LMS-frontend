import React from 'react';
import './LeadsKpiCard.css';
import Icon from './Icon';

export default function LeadsKpiCard({ label, value, icon, trend, trendUp, sparkline }) {
  return (
    <div className="leads-kpi-card">
      <div className="leads-kpi-header">
        {icon && (
          <Icon name={icon} size={18} className="leads-kpi-icon select-none" />
        )}
        <span className="leads-kpi-label">
          {label}
        </span>

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

      <div className="leads-kpi-body">
        <span className="leads-kpi-value">
          {value}
        </span>
      </div>


    </div>
  );
}
