import React from 'react';
import './LeadsFilterChip.css';
import Icon from './Icon';

export default function LeadsFilterChip({ label, icon, count, pct, color, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`leads-chip ${isActive ? `active color-${color}` : ''}`}
    >
      {icon && (
        <Icon name={icon} size={14} className="leads-chip-icon select-none" />
      )}
      <span>{label}</span>
      <span className="leads-chip-count">
        {count} ({pct}%)
      </span>
    </button>
  );
}
