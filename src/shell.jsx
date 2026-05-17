import { Fragment } from 'react';
import { IconHome, IconInbox, IconCalendar, IconUsers, IconChart, IconCog, IconSearch, IconBell, IconPlus, IconBot } from './icons';

// Shell — Sidebar + Topbar + layout chrome

export function Avatar({ initials, color, size = 'md', src }) {
  const cls = 'avatar' + (size !== 'md' ? ' ' + size : '');
  return (
    <span className={cls} style={{ background: color || '#52525b' }}>
      {initials}
    </span>
  );
}

export function NavItem({ icon: Icon, label, active, count, onClick }) {
  return (
    <button className={'nav-item' + (active ? ' is-active' : '')} onClick={onClick}>
      <Icon size={15} />
      <span>{label}</span>
      {count != null && <span className="count">{count}</span>}
    </button>
  );
}

export function Sidebar({ view, setView, brandFont }) {
  const items = [
    { key: 'hoy',     label: 'Hoy',         icon: IconHome,     count: 19 },
    { key: 'inbox',   label: 'Inbox',       icon: IconInbox,    count: 4 },
    { key: 'agenda',  label: 'Agenda',      icon: IconCalendar },
    { key: 'clientes',label: 'Clientes',    icon: IconUsers },
    { key: 'metricas',label: 'Métricas',    icon: IconChart },
    { key: 'config',  label: 'Configuración', icon: IconCog },
  ];
  return (
    <aside className="sidebar">
      <div className="brand" style={{ fontFamily: brandFont }}>
        <span className="brand-mark">V</span>
        <div>
          <div className="brand-word">Vero Uomo</div>
          <div className="brand-sub">Pocitos · MVD</div>
        </div>
      </div>

      <div className="sb-section-label">Operación</div>
      {items.slice(0, 4).map((it) => (
        <NavItem key={it.key} {...it} active={view === it.key} onClick={() => setView(it.key)} />
      ))}

      <div className="sb-section-label">Negocio</div>
      {items.slice(4).map((it) => (
        <NavItem key={it.key} {...it} active={view === it.key} onClick={() => setView(it.key)} />
      ))}

      <div className="sb-foot">
        <Avatar initials="MR" color="#0EA5E9" />
        <div style={{ minWidth: 0 }}>
          <div className="sb-foot-name truncate">Matías Rodríguez</div>
          <div className="sb-foot-role truncate">Dueño · admin</div>
        </div>
      </div>
    </aside>
  );
}

export function Topbar({ crumbs }) {
  return (
    <header className="topbar">
      <div className="crumbs">
        {crumbs.map((c, i) => (
          <Fragment key={i}>
            {i > 0 && <span className="sep">/</span>}
            <span className={i === crumbs.length - 1 ? 'now' : ''}>{c}</span>
          </Fragment>
        ))}
      </div>

      <div className="topbar-spacer" />

      <div className="search-box">
        <IconSearch size={14} />
        <span>Buscar clientes, turnos…</span>
        <span className="kbd">⌘K</span>
      </div>

      <button className="icon-btn" title="Agente">
        <IconBot size={16} color="var(--agent)" />
      </button>
      <button className="icon-btn" title="Notificaciones">
        <IconBell size={16} />
        <span className="dot" />
      </button>
      <button className="btn accent sm">
        <IconPlus size={13} />
        <span>Nuevo turno</span>
      </button>
    </header>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-hd">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <div className="page-subtitle">{subtitle}</div>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}
