import { useState, useEffect } from 'react';
import { useTweaks, TweaksPanel, TweakSection, TweakColor, TweakToggle, TweakSelect, TweakRadio } from './tweaks-panel';
import { Sidebar, Topbar } from './shell';
import { CobroDrawer } from './cobro';
import { Toaster } from './ui';
import { ViewHoy } from './views/hoy';
import { ViewInbox } from './views/inbox';
import { ViewAgenda } from './views/agenda';
import { ViewClientes } from './views/clientes';
import { ViewMetricas } from './views/metricas';
import { ViewConfig } from './views/config';
import { ViewCuponeras } from './views/cuponeras';
import { ViewMarketing } from './views/marketing';
import { ViewFinanzas } from './views/finanzas';
import { ViewServicios } from './views/servicios';
import './styles.css';
import './views/hoy.css';
import './views/inbox.css';
import './views/agenda.css';
import './views/clientes.css';
import './views/metricas.css';
import './views/config.css';
import './views/cuponeras.css';
import './views/marketing.css';
import './views/finanzas.css';
import './views/servicios.css';

// App root — router + theme + tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#2563eb",
  "agent": "#7c3aed",
  "font": "inter",
  "density": "balanceada",
  "dark": false,
  "radius": "md",
  "mod_metricas": true,
  "mod_cuponeras": true,
  "mod_marketing": true
}/*EDITMODE-END*/;

const FONT_MAP = {
  inter:     { sans: "'Inter', ui-sans-serif, system-ui, sans-serif",
               display: "'Inter', ui-sans-serif, system-ui, sans-serif" },
  geist:     { sans: "'Geist', ui-sans-serif, system-ui, sans-serif",
               display: "'Geist', ui-sans-serif, system-ui, sans-serif" },
  editorial: { sans: "'Inter', ui-sans-serif, system-ui, sans-serif",
               display: "'Instrument Serif', ui-serif, Georgia, serif" },
  ibm:       { sans: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif",
               display: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif" },
};

const RADIUS_MAP = {
  sq: { xs: '2px', sm: '3px', md: '4px',  lg: '5px' },
  md: { xs: '4px', sm: '6px', md: '8px',  lg: '10px' },
  lg: { xs: '6px', sm: '8px', md: '12px', lg: '16px' },
};

// hex → rgba weak / strong helpers
function hexToRgba(hex, a) {
  const h = hex.replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h;
  const n = parseInt(x, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
function darken(hex, amt) {
  const h = hex.replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h;
  const n = parseInt(x, 16);
  const r = Math.max(0, ((n >> 16) & 255) - amt);
  const g = Math.max(0, ((n >> 8) & 255) - amt);
  const b = Math.max(0, (n & 255) - amt);
  return '#' + [r,g,b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function ThemeBridge({ tweaks }) {
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--accent', tweaks.accent);
    r.style.setProperty('--accent-weak', hexToRgba(tweaks.accent, 0.10));
    r.style.setProperty('--accent-strong', darken(tweaks.accent, 24));
    r.style.setProperty('--agent', tweaks.agent);
    r.style.setProperty('--agent-weak', hexToRgba(tweaks.agent, 0.10));
    const f = FONT_MAP[tweaks.font] || FONT_MAP.inter;
    r.style.setProperty('--font-sans', f.sans);
    r.style.setProperty('--font-display', f.display);
    const rad = RADIUS_MAP[tweaks.radius] || RADIUS_MAP.md;
    r.style.setProperty('--radius-xs', rad.xs);
    r.style.setProperty('--radius-sm', rad.sm);
    r.style.setProperty('--radius-md', rad.md);
    r.style.setProperty('--radius-lg', rad.lg);
    r.setAttribute('data-dark', tweaks.dark ? '1' : '0');
    r.setAttribute('data-density', tweaks.density);
  }, [tweaks]);
  return null;
}

export default function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [view, setView] = useState('hoy');

  const modules = {
    metricas:  t.mod_metricas,
    cuponeras: t.mod_cuponeras,
    marketing: t.mod_marketing,
  };

  // Si el módulo activo se oculta, volver a Hoy
  useEffect(() => {
    if ((view === 'metricas' && !modules.metricas) ||
        (view === 'cuponeras' && !modules.cuponeras) ||
        (view === 'marketing' && !modules.marketing)) {
      setView('hoy');
    }
  }, [t.mod_metricas, t.mod_cuponeras, t.mod_marketing]);

  const titleMap = {
    hoy: 'Hoy', inbox: 'Inbox', agenda: 'Agenda',
    clientes: 'Clientes', metricas: 'Métricas',
    cuponeras: 'Cuponeras', marketing: 'Marketing',
    finanzas: 'Finanzas', servicios: 'Servicios y productos',
    config: 'Configuración',
  };

  const Views = {
    hoy: ViewHoy,
    inbox: ViewInbox,
    agenda: ViewAgenda,
    clientes: ViewClientes,
    metricas: ViewMetricas,
    cuponeras: ViewCuponeras,
    marketing: ViewMarketing,
    finanzas: ViewFinanzas,
    servicios: ViewServicios,
    config: ViewConfig,
  };
  const View = Views[view];
  const brandFont = (FONT_MAP[t.font] || FONT_MAP.inter).display;

  return (
    <>
      <ThemeBridge tweaks={t} />
      <div className="app" data-screen-label={titleMap[view]}>
        <Sidebar view={view} setView={setView} brandFont={brandFont} modules={modules} />
        <main className="main">
          <Topbar crumbs={['Vero Uomo', titleMap[view]]} onNuevoTurno={() => setView('agenda')} />
          <div className="content">
            <View setView={setView} />
          </div>
        </main>
      </div>

      <CobroDrawer />
      <Toaster />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Módulos">
          <TweakToggle
            label="Métricas"
            value={t.mod_metricas}
            onChange={(v) => setTweak('mod_metricas', v)}
          />
          <TweakToggle
            label="Cuponeras"
            value={t.mod_cuponeras}
            onChange={(v) => setTweak('mod_cuponeras', v)}
          />
          <TweakToggle
            label="Marketing"
            value={t.mod_marketing}
            onChange={(v) => setTweak('mod_marketing', v)}
          />
        </TweakSection>

        <TweakSection label="Apariencia">
          <TweakColor
            label="Acento"
            value={t.accent}
            options={['#2563eb', '#18181b', '#0d9488', '#dc2626', '#a16207']}
            onChange={(v) => setTweak('accent', v)}
          />
          <TweakColor
            label="Agente IA"
            value={t.agent}
            options={['#7c3aed', '#10b981', '#0ea5e9', '#f59e0b']}
            onChange={(v) => setTweak('agent', v)}
          />
          <TweakToggle
            label="Modo oscuro"
            value={t.dark}
            onChange={(v) => setTweak('dark', v)}
          />
        </TweakSection>

        <TweakSection label="Tipografía">
          <TweakSelect
            label="Familia"
            value={t.font}
            options={[
              { value: 'inter',     label: 'Inter (default)' },
              { value: 'geist',     label: 'Geist' },
              { value: 'editorial', label: 'Editorial · Instrument Serif' },
              { value: 'ibm',       label: 'IBM Plex Sans' },
            ]}
            onChange={(v) => setTweak('font', v)}
          />
        </TweakSection>

        <TweakSection label="Layout">
          <TweakRadio
            label="Densidad"
            value={t.density}
            options={[
              { value: 'compact',     label: 'Compacta' },
              { value: 'balanceada',  label: 'Balanceada' },
              { value: 'aireada',     label: 'Aireada' },
            ]}
            onChange={(v) => setTweak('density', v)}
          />
          <TweakRadio
            label="Bordes"
            value={t.radius}
            options={[
              { value: 'sq', label: 'Recto' },
              { value: 'md', label: 'Medio' },
              { value: 'lg', label: 'Suave' },
            ]}
            onChange={(v) => setTweak('radius', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}
