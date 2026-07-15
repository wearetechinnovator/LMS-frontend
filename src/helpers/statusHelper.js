const DEFAULT_STATUSES = [
  {value: 'HOT',label: 'Assigned',color: '#64748b',isSystem: true,description: 'Lead has been assigned to a counselor.'},
  {value: 'COLD',label: 'Contacted',color: '#f97316',isSystem: true,description: 'Initial contact has been established with the lead.'},
  {value: 'WARM',label: 'Qualified',color: '#10b981',isSystem: true,description: 'Lead has been qualified and is ready for the next stage.'},
  {value: 'DEAD',label: 'Demo Scheduled',color: '#a855f7',isSystem: true,description: 'A product demonstration has been scheduled with the lead.'}
];

const DEFAULT_JOURNEY = ['NEW', 'ASSIGNED', 'CONTACTED', 'QUALIFIED', 'DEMO', 'PROPOSAL', 'NEGOTIATION', 'WON'];

function getStatusesKey() {
  const username = localStorage.getItem('username');
  return username ? `lms_custom_statuses_${username}` : 'lms_custom_statuses';
}

function getJourneysKey() {
  const username = localStorage.getItem('username');
  return username ? `lms_custom_journeys_${username}` : 'lms_custom_journeys';
}

export function getCustomStatuses() {
  const key = getStatusesKey();
  const local = localStorage.getItem(key);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      console.error(`Error parsing ${key} from localStorage:`, e);
    }
  }
  // Initialize if not present
  localStorage.setItem(key, JSON.stringify(DEFAULT_STATUSES));
  return DEFAULT_STATUSES;
}

export function saveCustomStatuses(statuses) {
  const key = getStatusesKey();
  localStorage.setItem(key, JSON.stringify(statuses));
  window.dispatchEvent(new CustomEvent('lms-statuses-updated'));
}

export function getCustomJourneys() {
  let journeys = [];
  const key = getJourneysKey();
  const local = localStorage.getItem(key);
  if (local) {
    try {
      journeys = JSON.parse(local);
    } catch (e) {
      console.error(`Error parsing ${key} from localStorage:`, e);
    }
  }

  const customStatuses = getCustomStatuses();
  const customStatusValues = customStatuses.filter(s => s.value !== 'LOST').map(s => s.value);

  let defaultJourney = journeys.find(j => j.id === 'default' || j.isDefault);
  if (!defaultJourney) {
    defaultJourney = {
      id: 'default',
      name: 'Standard CRM Pipeline',
      steps: customStatusValues.length > 0 ? customStatusValues : DEFAULT_JOURNEY,
      isDefault: true
    };
    journeys = [defaultJourney, ...journeys.filter(j => j.id !== 'default')];
    localStorage.setItem(key, JSON.stringify(journeys));
  } else {
    if (customStatusValues.length > 0 &&
      (JSON.stringify(defaultJourney.steps) === JSON.stringify(DEFAULT_JOURNEY) ||
        defaultJourney.steps.some(step => !customStatusValues.includes(step)))) {
      defaultJourney.steps = customStatusValues;
      localStorage.setItem(key, JSON.stringify(journeys));
    }
  }

  return journeys;
}

export function saveCustomJourneys(journeys) {
  const key = getJourneysKey();
  localStorage.setItem(key, JSON.stringify(journeys));
  window.dispatchEvent(new CustomEvent('lms-journeys-updated'));
}

export function getLeadJourney() {
  const journeys = getCustomJourneys();
  const def = journeys.find(j => j.isDefault) || journeys[0];
  return def ? def.steps : DEFAULT_JOURNEY;
}

function getLeadJourneyKey() {
  const username = localStorage.getItem('username');
  return username ? `lms_lead_journey_${username}` : 'lms_lead_journey';
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
  const key = getLeadJourneyKey();
  localStorage.setItem(key, JSON.stringify(journey));
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
