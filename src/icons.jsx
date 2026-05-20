// Minimal icon set — stroke-based, geometric, Linear-ish

const _I = (paths, opts = {}) => (props) => (
  <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24"
       fill={opts.fill || 'none'} stroke={props.color || 'currentColor'}
       strokeWidth={props.sw || 1.6} strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true" {...props}>{paths}</svg>
);

export const IconHome     = _I(<><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /></>);
export const IconInbox    = _I(<><path d="M3 5h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M3 12h5l1.5 2h5L16 12h5" /></>);
export const IconCalendar = _I(<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>);
export const IconUsers    = _I(<><circle cx="9" cy="9" r="3.2" /><path d="M3 19c0-3 2.8-5 6-5s6 2 6 5" /><path d="M16 8a3 3 0 0 1 0 6" /><path d="M21 19c0-2.6-2-4.5-5-5" /></>);
export const IconChart    = _I(<><path d="M4 20V5M4 20h16" /><rect x="7" y="13" width="3" height="5" rx=".5" fill="currentColor" stroke="none" /><rect x="12" y="9"  width="3" height="9" rx=".5" fill="currentColor" stroke="none" /><rect x="17" y="11" width="3" height="7" rx=".5" fill="currentColor" stroke="none" /></>);
export const IconCog      = _I(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>);
export const IconSearch   = _I(<><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>);
export const IconPlus     = _I(<><path d="M12 5v14M5 12h14" /></>);
export const IconBell     = _I(<><path d="M6 9a6 6 0 1 1 12 0v4l1.5 3h-15L6 13z" /><path d="M10 19a2 2 0 0 0 4 0" /></>);
export const IconArrowR   = _I(<><path d="M5 12h14M13 6l6 6-6 6" /></>);
export const IconArrowL   = _I(<><path d="M19 12H5M11 6l-6 6 6 6" /></>);
export const IconChevronR = _I(<><path d="m9 6 6 6-6 6" /></>);
export const IconCheck    = _I(<><path d="m5 12 5 5L20 7" /></>);
export const IconX        = _I(<><path d="M6 6l12 12M18 6 6 18" /></>);
export const IconSparkle  = _I(<><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" /></>);
export const IconBot      = _I(<><rect x="4" y="7" width="16" height="12" rx="3" /><path d="M12 3v4M9 12h.01M15 12h.01M9 16h6" /></>);
export const IconWA       = _I(<><path d="M4 20l1.5-4.5A8 8 0 1 1 8.5 18.5z" /></>);
export const IconIG       = _I(<><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.5" /><circle cx="17" cy="7" r=".8" fill="currentColor" stroke="none" /></>);
export const IconPhone    = _I(<><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" /></>);
export const IconClock    = _I(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>);
export const IconTrend    = _I(<><path d="M3 17l6-6 4 4 8-8" /><path d="M14 7h7v7" /></>);
export const IconTrendD   = _I(<><path d="M3 7l6 6 4-4 8 8" /><path d="M14 17h7v-7" /></>);
export const IconScissors = _I(<><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M8.1 8.1 20 20M14 14l6 6M8.1 15.9 14 10" /></>);
export const IconFilter   = _I(<><path d="M3 5h18l-7 9v6l-4-2v-4z" /></>);
export const IconDots     = _I(<><circle cx="6" cy="12" r="1.2" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" /><circle cx="18" cy="12" r="1.2" fill="currentColor" stroke="none" /></>);
export const IconCommand  = _I(<><rect x="6" y="6" width="12" height="12" rx="1.5" /></>);
export const IconStar     = (props) => (
  <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24"
       fill={props.filled ? (props.color || 'currentColor') : 'none'}
       stroke={props.color || 'currentColor'}
       strokeWidth={props.sw || 1.6} strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">
    <path d="m12 3 2.6 5.8 6.4.7-4.8 4.3 1.4 6.2L12 17l-5.6 3 1.4-6.2L3 9.5l6.4-.7z" />
  </svg>
);
export const IconPlay     = _I(<><path d="M7 4v16l13-8z" /></>);
export const IconPause    = _I(<><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></>);
export const IconTicket   = _I(<><path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z" /><path d="M12 5v3M12 11v2M12 16v3" /></>);
export const IconMegaphone= _I(<><path d="M3 11v2a2 2 0 0 0 2 2h2v-6H5a2 2 0 0 0-2 2z" /><path d="M7 9 19 4v16L7 15" /><path d="M9 15v4a2 2 0 0 0 4 0v-3" /></>);
export const IconFlag     = _I(<><path d="M5 21V4M5 4h11l-2 4 2 4H5" /></>);
export const IconCash     = _I(<><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M7 12h.01M17 12h.01" /></>);
export const IconPaper    = _I(<><path d="M22 12a10 10 0 1 1-3.5-7.6L22 2v6h-6" /></>);
export const IconHash     = _I(<><path d="M5 9h14M5 15h14M10 4l-2 16M16 4l-2 16" /></>);
