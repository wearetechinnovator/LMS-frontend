const DEFAULT_STATUSES = [
  { value: 'NEW', label: 'NEW', color: '#3b82f6', isSystem: true, description: 'System default for new leads' },
  { value: 'ASSIGNED', label: 'ASSIGNED', color: '#64748b', isSystem: true, description: 'Lead assigned to counselor' },
  { value: 'CONTACTED', label: 'CONTACTED', color: '#f97316', isSystem: true, description: 'Contact established with lead' },
  { value: 'QUALIFIED', label: 'QUALIFIED', color: '#10b981', isSystem: true, description: 'Lead qualified for next steps' },
  { value: 'DEMO', label: 'DEMO SCHEDULED', color: '#a855f7', isSystem: true, description: 'Product demo scheduled' },
  { value: 'PROPOSAL', label: 'PROPOSAL', color: '#14b8a6', isSystem: true, description: 'Proposal sent to lead' },
  { value: 'NEGOTIATION', label: 'NEGOTIATION', color: '#f59e0b', isSystem: true, description: 'Negotiation on pricing or terms' },
  { value: 'WON', label: 'WON', color: '#10b981', isSystem: true, description: 'Lead won / deal closed' },
  { value: 'LOST', label: 'LOST', color: '#ef4444', isSystem: true, description: 'Lead lost / deal closed' }
];

const DEFAULT_JOURNEY = ['NEW', 'ASSIGNED', 'CONTACTED', 'QUALIFIED', 'DEMO', 'PROPOSAL', 'NEGOTIATION', 'WON'];

export function getCustomStatuses() {
  const local = localStorage.getItem('lms_custom_statuses');
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error('Error parsing lms_custom_statuses from localStorage:', e);
    }
  }
  // Initialize if not present
  localStorage.setItem('lms_custom_statuses', JSON.stringify(DEFAULT_STATUSES));
  return DEFAULT_STATUSES;
}

export function saveCustomStatuses(statuses) {
  localStorage.setItem('lms_custom_statuses', JSON.stringify(statuses));
  window.dispatchEvent(new CustomEvent('lms-statuses-updated'));
}

export function getCustomJourneys() {
  const local = localStorage.getItem('lms_custom_journeys');
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error('Error parsing lms_custom_journeys from localStorage:', e);
    }
  }
  const defaultJourneys = [
    {
      id: 'default',
      name: 'Standard CRM Pipeline',
      steps: DEFAULT_JOURNEY,
      isDefault: true
    }
  ];
  localStorage.setItem('lms_custom_journeys', JSON.stringify(defaultJourneys));
  return defaultJourneys;
}

export function saveCustomJourneys(journeys) {
  localStorage.setItem('lms_custom_journeys', JSON.stringify(journeys));
  window.dispatchEvent(new CustomEvent('lms-journeys-updated'));
}

export function getLeadJourney() {
  const journeys = getCustomJourneys();
  const def = journeys.find(j => j.isDefault) || journeys[0];
  return def ? def.steps : DEFAULT_JOURNEY;
}

export function saveLeadJourney(journey) {
  const journeys = getCustomJourneys();
  const updated = journeys.map(j => {
    if (j.isDefault || j.id === 'default') {
      return { ...j, steps: journey };
    }
    return j;
  });
  saveCustomJourneys(updated);
  localStorage.setItem('lms_lead_journey', JSON.stringify(journey));
  window.dispatchEvent(new CustomEvent('lms-journey-updated'));
}

export function parseColorToRgb(colorStr) {
  const defaultRgb = { r: 100, g: 116, b: 139, a: 1 }; // slate-like gray
  if (!colorStr) return defaultRgb;

  colorStr = colorStr.trim().toLowerCase();

  // Hex: #fff, #ffffff, #rrggbbaa, #rgba
  if (colorStr.startsWith('#')) {
    let hex = colorStr.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      hex = hex.split('').map(char => char + char).join('');
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    let a = 1;
    if (hex.length === 8) {
      a = parseFloat((parseInt(hex.slice(6, 8), 16) / 255).toFixed(2));
    }
    if (isNaN(r) || isNaN(g) || isNaN(b)) return defaultRgb;
    return { r, g, b, a };
  }

  // Rgb / Rgba matches
  const rgbMatch = colorStr.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (rgbMatch) {
    return {
      r: Math.min(255, Math.max(0, parseInt(rgbMatch[1], 10))),
      g: Math.min(255, Math.max(0, parseInt(rgbMatch[2], 10))),
      b: Math.min(255, Math.max(0, parseInt(rgbMatch[3], 10))),
      a: rgbMatch[4] !== undefined ? Math.min(1, Math.max(0, parseFloat(rgbMatch[4]))) : 1
    };
  }

  // Fallbacks for standard CSS color names that were used previously
  const nameToHex = {
    blue: '#3b82f6',
    orange: '#f97316',
    green: '#10b981',
    emerald: '#10b981',
    red: '#ef4444',
    rose: '#ef4444',
    purple: '#a855f7',
    teal: '#14b8a6',
    amber: '#f59e0b',
    slate: '#64748b',
    gray: '#64748b'
  };

  if (nameToHex[colorStr]) {
    return parseColorToRgb(nameToHex[colorStr]);
  }

  return defaultRgb;
}

export function getStatusStyle(status, customStatusesList = []) {
  const list = customStatusesList.length > 0 ? customStatusesList : getCustomStatuses();
  const found = list.find(s => s.value === status);
  const colorStr = found ? found.color : '#64748b';
  const rgb = parseColorToRgb(colorStr);

  return {
    backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`,
    color: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
    borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`
  };
}

export function getStatusBadgeStyle(status, customStatusesList = []) {
  const list = customStatusesList.length > 0 ? customStatusesList : getCustomStatuses();
  const found = list.find(s => s.value === status);
  const colorStr = found ? found.color : '#64748b';
  const rgb = parseColorToRgb(colorStr);

  return {
    backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
    color: '#ffffff',
    borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`
  };
}

// Backward compatibility fallbacks to avoid syntax errors if some files call them
export function getStatusColor(status, customStatusesList = []) {
  return '';
}

export function getStatusBadgeStyles(status, customStatusesList = []) {
  return '';
}
