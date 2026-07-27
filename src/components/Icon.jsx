import React from 'react';
import * as LucideIcons from 'lucide-react';

// Comprehensive mapping from Google Material Symbol names to Lucide Icon components
const ICON_MAP = {
  // Navigation & Core
  'dashboard': LucideIcons.LayoutDashboard,
  'view_quizard': LucideIcons.LayoutDashboard,
  'form_builder': LucideIcons.Wrench,
  'build': LucideIcons.Wrench,
  'all_leads': LucideIcons.Handshake,
  'handshake': LucideIcons.Handshake,
  'people': LucideIcons.Handshake,
  'analytics': LucideIcons.BarChart2,
  'bar_chart': LucideIcons.BarChart2,
  'campaign': LucideIcons.Megaphone,
  'campaigns': LucideIcons.Megaphone,
  'form_embed': LucideIcons.Paperclip,
  'paperclip': LucideIcons.Paperclip,
  'audit_log': LucideIcons.ClipboardClock,
  'audit_logs': LucideIcons.ClipboardClock,
  'clipboard_clock': LucideIcons.ClipboardClock,
  'receipt_long': LucideIcons.ClipboardClock,
  'role': LucideIcons.UserShield,
  'roles': LucideIcons.UserShield,
  'user_shield': LucideIcons.UserShield,
  'perm_identity': LucideIcons.UserShield,
  'clock_fading': LucideIcons.ClockFading,
  'clock-fading': LucideIcons.ClockFading,
  'file_up': LucideIcons.FileUp,
  'file-up': LucideIcons.FileUp,
  'messages_square': LucideIcons.MessagesSquare,
  'messages-square': LucideIcons.MessagesSquare,
  'conversion_rate': LucideIcons.Split,
  'conversion-rate': LucideIcons.Split,
  'conversion': LucideIcons.Split,
  'trending_up': LucideIcons.Split,
  'graph': LucideIcons.ChartSpline,
  'chart_spline': LucideIcons.ChartSpline,
  'chart-spline': LucideIcons.ChartSpline,
  'show_chart': LucideIcons.ChartSpline,
  'insights': LucideIcons.ChartSpline,
  'analytics': LucideIcons.ChartSpline,
  'pie': LucideIcons.ChartPie,
  'pie_chart': LucideIcons.ChartPie,
  'chart_pie': LucideIcons.ChartPie,
  'chart-pie': LucideIcons.ChartPie,
  'counselor': LucideIcons.User,
  'support_agent': LucideIcons.User,
  'daily': LucideIcons.CalendarDays,
  'calendar_today': LucideIcons.CalendarDays,
  'calendar-days': LucideIcons.CalendarDays,
  'channel': LucideIcons.Users,
  'vendor': LucideIcons.Users,
  'attribution': LucideIcons.Users,
  'report': LucideIcons.ClipboardMinus,
  'table_chart': LucideIcons.ClipboardMinus,
  'table_rows': LucideIcons.TableProperties,
  'clipboard_minus': LucideIcons.ClipboardMinus,
  'clipboard-minus': LucideIcons.ClipboardMinus,
  'filter': LucideIcons.Funnel,
  'filter_alt': LucideIcons.Funnel,
  'funnel': LucideIcons.Funnel,
  'download': LucideIcons.Download,
  'search': LucideIcons.Search,
  'add': LucideIcons.Plus,
  'plus': LucideIcons.Plus,
  'check': LucideIcons.Check,
  'check_circle': LucideIcons.CheckCircle,
  'delete': LucideIcons.Trash2,
  'trash': LucideIcons.Trash2,
  'edit': LucideIcons.Pencil,
  'pencil': LucideIcons.Pencil,
  'save': LucideIcons.Save,
  'close': LucideIcons.X,
  'cancel': LucideIcons.X,
  'refresh': LucideIcons.RefreshCw,
  'route': LucideIcons.Route,
  'share': LucideIcons.Share2,
  'settings': LucideIcons.Settings,
  'settings_suggest': LucideIcons.Settings,
  'settings_accessibility': LucideIcons.Workflow,
  'logout': LucideIcons.LogOut,
  'log_out': LucideIcons.LogOut,
  'upload': LucideIcons.Upload,
  'cloud_upload': LucideIcons.Upload,
  'upload_file': LucideIcons.Upload,
  'archive': LucideIcons.Archive,
  'publish': LucideIcons.FileUp,
  'history': LucideIcons.History,
  'copy': LucideIcons.Copy,
  'content_copy': LucideIcons.Copy,
  'external_link': LucideIcons.ExternalLink,
  'open_in_new': LucideIcons.ExternalLink,
  'visibility': LucideIcons.Eye,
  'eye': LucideIcons.Eye,
  'fullscreen': LucideIcons.Maximize2,
  'fullscreen_exit': LucideIcons.Minimize2,
  'more_horiz': LucideIcons.MoreHorizontal,
  'more_vert': LucideIcons.MoreVertical,
  'drag_indicator': LucideIcons.GripVertical,
  'lock': LucideIcons.Lock,
  'unlock': LucideIcons.Unlock,
  
  // Form Fields & Types
  'border_color': LucideIcons.FileEdit,
  'arrow_drop_down_circle': LucideIcons.ChevronDownSquare,
  'check_box': LucideIcons.CheckSquare,
  'text_fields': LucideIcons.Type,
  'mouse': LucideIcons.MousePointer,
  'auto_awesome': LucideIcons.Sparkles,
  'article': LucideIcons.FileText,
  'text': LucideIcons.Type,
  'title': LucideIcons.Type,
  'email': LucideIcons.Mail,
  'mail': LucideIcons.Mail,
  'phone': LucideIcons.Phone,
  'call': LucideIcons.Phone,
  'calendar_today': LucideIcons.Calendar,
  'calendar': LucideIcons.Calendar,
  'date_picker': LucideIcons.Calendar,
  'arrow_drop_down': LucideIcons.ChevronDown,
  'expand_more': LucideIcons.ChevronDown,
  'chevron_down': LucideIcons.ChevronDown,
  'arrow_drop_up': LucideIcons.ChevronUp,
  'expand_less': LucideIcons.ChevronUp,
  'chevron_up': LucideIcons.ChevronUp,
  'chevron_left': LucideIcons.ChevronLeft,
  'chevron_right': LucideIcons.ChevronRight,
  'arrow_back': LucideIcons.ArrowLeft,
  'arrow_forward': LucideIcons.ArrowRight,
  'radio_button_checked': LucideIcons.CircleDot,
  'radio': LucideIcons.CircleDot,
  'location_city': LucideIcons.Building2,
  'city': LucideIcons.Building2,
  'verified_user': LucideIcons.ShieldCheck,
  'security': LucideIcons.ShieldCheck,
  'captcha': LucideIcons.ShieldCheck,
  'tune': LucideIcons.Sliders,
  'custom': LucideIcons.Sliders,
  'edit_note': LucideIcons.SquarePen,
  'grid_view': LucideIcons.LayoutGrid,
  
  // Status, Security & User
  'notifications': LucideIcons.Bell,
  'bell': LucideIcons.Bell,
  'person': LucideIcons.User,
  'user': LucideIcons.User,
  'group': LucideIcons.Users,
  'users': LucideIcons.Users,
  'group_off': LucideIcons.UserX,
  'person_add': LucideIcons.UserPlus,
  'business': LucideIcons.Building,
  'domain': LucideIcons.Building,
  'view_timeline': LucideIcons.GitCommit,
  'timeline': LucideIcons.GitCommit,
  'stars': LucideIcons.Star,
  'star': LucideIcons.Star,
  'warning': LucideIcons.AlertTriangle,
  'error': LucideIcons.AlertCircle,
  'gpp_bad': LucideIcons.ShieldAlert,
  'info': LucideIcons.Info,
  'help': LucideIcons.HelpCircle,
  'code': LucideIcons.Code,
  'devices': LucideIcons.Laptop,
  'smart_toy': LucideIcons.Bot,
  'api': LucideIcons.Code2,
  'timer': LucideIcons.Timer
};

export default function Icon({ name, className = '', size = 18, style = {}, color }) {
  if (!name) return null;

  const rawKey = String(name).toLowerCase().trim();
  const normalized = rawKey.replace(/-/g, '_');
  
  let Component = ICON_MAP[rawKey] || ICON_MAP[normalized];

  // Try direct PascalCase resolution from Lucide (e.g. calendar-days -> CalendarDays)
  if (!Component) {
    const pascalName = rawKey
      .split(/[-_]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
    Component = LucideIcons[pascalName];
  }

  if (!Component) {
    return (
      <span 
        className={`material-symbols-outlined shrink-0 select-none ${className}`}
        style={{ fontSize: size, color, display: 'inline-block', lineHeight: 1, ...style }}
      >
        {name}
      </span>
    );
  }

  return (
    <Component 
      className={`inline-block shrink-0 ${className}`} 
      size={size} 
      style={style}
      color={color}
    />
  );
}

export { ICON_MAP };
