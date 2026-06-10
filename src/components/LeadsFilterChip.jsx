import React from 'react';
import './LeadsFilterChip.css';

export default function LeadsFilterChip({ label, icon, count, pct, color, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`leads-chip ${isActive ? `active color-${color}` : ''}`}
    >
      {icon && (
        <span className="material-symbols-outlined leads-chip-icon select-none">
          {icon}
        </span>
      )}
      <span>{label}</span>
      <span className="leads-chip-count">
        {count} ({pct}%)
      </span>
    </button>
  );
}
