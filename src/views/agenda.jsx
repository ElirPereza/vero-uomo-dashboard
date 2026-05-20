// Vista Agenda — vista DIARIA con dos layouts:
//  • Kanban (default): una columna por hora con tarjetas apiladas — pedido por Camilo
//  • Cronograma:      timeline clásico con columna por barbero (la versión anterior)

import { useState, Fragment } from 'react';
import { IconArrowL, IconArrowR, IconPlus, IconSparkle, IconFilter, IconCheck, IconX, IconDots } from '../icons';
import { BARBEROS, TURNOS_HOY, FMT_UYU } from '../data';
import { Avatar } from '../shell';

const HORAS_DIA = ['09','10','11','12','13','14','15','16','17','18','19','20'];
const SLOT_PX = 84; // altura de 1 hora — solo para cronograma

// Estados del turno + estilos
const ESTADO_INFO = {
  'confirmado': { lbl: 'Confirmado', dot: 'var(--fg-muted)' },
  'en-curso':   { lbl: 'En curso',   dot: 'var(--accent)' },
  'completo':   { lbl: 'Completado', dot: 'var(--ok)' },
  'cobrado':    { lbl: 'Cobrado',    dot: 'var(--ok)' },
  'no-show':    { lbl: 'No-show',    dot: 'var(--danger)' },
  'proximo':    { lbl: 'Próximo',    dot: 'var(--fg-muted)' },
};

// Enriquezco TURNOS_HOY con estados más variados para mostrar el sistema completo.
function buildTurnosAgenda() {
  const overrides = {
    t1: { estado: 'cobrado' },
    t2: { estado: 'cobrado' },
    t3: { estado: 'cobrado' },
    t4: { estado: 'en-curso' },
    t5: { estado: 'en-curso' },
    t11: { estado: 'no-show' },
  };
  return TURNOS_HOY.map((t) => ({
    ...t,
    estado: overrides[t.id]?.estado || (t.estado === 'completo' ? 'cobrado' : t.estado),
    confirmado: ['t6','t7','t8','t9','t10','t13','t14','t15','t16'].includes(t.id),
    pagado: ['t1','t2','t3'].includes(t.id),
  }));
}

function timeToMin(h) {
  const [hh, mm] = h.split(':').map(Number);
  return (hh - 9) * 60 + mm;
}

// Calcula la disposición de turnos solapados — asigna lanes (carriles) lado a lado
function layoutOverlaps(turnos) {
  const sorted = [...turnos].sort((a, b) => timeToMin(a.hora) - timeToMin(b.hora));
  const lanes = []; // each: endMin
  const placed = sorted.map((t) => {
    const startMin = timeToMin(t.hora);
    const endMin = startMin + t.dur;
    let lane = lanes.findIndex((e) => e <= startMin);
    if (lane === -1) {
      lane = lanes.length;
      lanes.push(endMin);
    } else {
      lanes[lane] = endMin;
    }
    return { ...t, startMin, endMin, lane };
  });
  return placed.map((e) => {
    let maxLane = e.lane;
    placed.forEach((o) => {
      if (o !== e && o.startMin < e.endMin && o.endMin > e.startMin && o.lane > maxLane) {
        maxLane = o.lane;
      }
    });
    return { ...e, groupSize: maxLane + 1 };
  });
}

// ═══════════════════════════════════════════════════════════════════════
//   KANBAN — columna por hora
// ═══════════════════════════════════════════════════════════════════════

function KanbanCard({ t, barbero, hovered, setHovered }) {
  const isAhora = t.estado === 'en-curso';
  const isCobrado = t.estado === 'cobrado';
  const isNoShow = t.estado === 'no-show';
  const isHovered = hovered === t.id;

  return (
    <div
      className={'ag-kcard ag-kcard-' + t.estado + (isHovered ? ' is-hovered' : '')}
      style={{ borderLeftColor: isNoShow ? 'var(--danger)' : barbero.color }}
      onMouseEnter={() => setHovered(t.id)}
      onMouseLeave={() => setHovered(null)}
    >
      <div className="ag-kcard-r1">
        <span className="ag-kcard-time mono">{t.hora}</span>
        <span className="ag-kcard-dur mono">·&nbsp;{t.dur}m</span>
        <div className="ag-kcard-state-icon" title={ESTADO_INFO[t.estado].lbl}>
          {isCobrado && <IconCheck size={11} sw={2.4} color="var(--ok)" />}
          {isAhora && <span className="ag-pulse" />}
          {isNoShow && <IconX size={11} sw={2.4} color="var(--danger)" />}
        </div>
      </div>
      <div className="ag-kcard-cli">{t.cliente}</div>
      <div className="ag-kcard-sv">{t.servicio}</div>
      <div className="ag-kcard-foot">
        <div className="ag-kcard-barb">
          <span className="ag-kcard-bswatch" style={{ background: barbero.color }} />
          <span className="ag-kcard-barb-name">{barbero.apodo}</span>
        </div>
        <span className="ag-kcard-price mono">{FMT_UYU(t.precio)}</span>
      </div>
      {(t.notaIA || t.nuevo) && (
        <div className="ag-kcard-badges">
          {t.notaIA && (
            <span className="ag-kcard-ia" title="Agendado por agente IA">
              <IconSparkle size={9} sw={2.4} /> IA
            </span>
          )}
          {t.nuevo && <span className="ag-kcard-new">nuevo</span>}
        </div>
      )}
    </div>
  );
}

function KanbanColumn({ hora, turnos, ahoraHora, barberosById, hovered, setHovered }) {
  const items = turnos.filter((t) => t.hora.startsWith(hora + ':'));
  const isNow = hora === ahoraHora;
  const isPast = parseInt(hora, 10) < parseInt(ahoraHora, 10);
  const totalH = items.filter((t) => t.estado !== 'no-show').reduce((s, t) => s + t.precio, 0);
  const ocupados = items.reduce((s, t) => s + t.dur, 0);
  const ocupPct = Math.min(100, Math.round((ocupados / (60 * 4)) * 100)); // 4 barberos = 240 min capacidad

  return (
    <div className={'ag-kcol' + (isNow ? ' is-now' : '') + (isPast ? ' is-past' : '')}>
      <div className="ag-kcol-hd">
        <div className="ag-kcol-hd-top">
          <span className="ag-kcol-hour mono">{hora}:00</span>
          {isNow && <span className="ag-kcol-now-tag">AHORA</span>}
          <span className="ag-kcol-count">{items.length}</span>
        </div>
        <div className="ag-kcol-hd-bar">
          <div className="ag-kcol-hd-bar-fill" style={{ width: ocupPct + '%' }} />
        </div>
        <div className="ag-kcol-hd-meta">
          <span>{ocupPct}% ocup.</span>
          <span className="mono">{items.length ? FMT_UYU(totalH) : '—'}</span>
        </div>
      </div>
      <div className="ag-kcol-body">
        {items.length === 0 ? (
          <button className="ag-kcol-empty">
            <IconPlus size={12} />
            <span>Libre</span>
          </button>
        ) : (
          items
            .sort((a, b) => timeToMin(a.hora) - timeToMin(b.hora))
            .map((t) => (
              <KanbanCard
                key={t.id}
                t={t}
                barbero={barberosById[t.barbero]}
                hovered={hovered}
                setHovered={setHovered}
              />
            ))
        )}
        {items.length > 0 && (
          <button className="ag-kcol-add">
            <IconPlus size={11} /> Agregar
          </button>
        )}
      </div>
    </div>
  );
}

function KanbanByHour({ turnos, ahoraMin, barberosById }) {
  const [hovered, setHovered] = useState(null);
  const ahoraH = String(9 + Math.floor(ahoraMin / 60)).padStart(2, '0');

  return (
    <div className="ag-kanban">
      {HORAS_DIA.map((h) => (
        <KanbanColumn
          key={h}
          hora={h}
          turnos={turnos}
          ahoraHora={ahoraH}
          barberosById={barberosById}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//   CRONOGRAMA — vista clásica (preservada como alternativa)
// ═══════════════════════════════════════════════════════════════════════

function EventCard({ t, barbero, isHovered, setHovered, topPx, heightPx, evStyle }) {
  const initials = t.cliente.split(/\s+/).map((p) => p[0]).slice(0, 2).join('');
  const isAhora = t.estado === 'en-curso';
  const isCobrado = t.estado === 'cobrado';
  const isNoShow = t.estado === 'no-show';

  // Tier por duración / altura — sin hover usa la altura real, con hover full
  const tier = isHovered ? 'long' : heightPx >= 56 ? 'long' : heightPx >= 38 ? 'mid' : 'short';

  const stateIcon = (
    isCobrado ? <IconCheck size={11} sw={2.6} color="var(--ok)" /> :
    isAhora ? <span className="ag-pulse" /> :
    isNoShow ? <IconX size={11} sw={2.6} color="var(--danger)" /> :
    null
  );

  return (
    <div
      className={
        'ag-ev ag-ev-' + t.estado +
        ' ag-ev-tier-' + tier +
        (isHovered ? ' is-hovered' : '') +
        (t.groupSize > 1 ? ' is-lane' : '')
      }
      data-lanes={t.groupSize}
      style={evStyle}
      onMouseEnter={() => setHovered(t.id)}
      onMouseLeave={() => setHovered(null)}
    >
      {tier === 'short' && (
        <div className="ag-ev-short">
          <span className="ag-ev-initial" style={{ background: barbero.color }}>{initials}</span>
          <span className="ag-ev-time-mini mono">{t.hora}</span>
          <span className="ag-ev-cli">{t.cliente}</span>
          <span className="ag-ev-price mono">{FMT_UYU(t.precio)}</span>
          {stateIcon && <span className="ag-ev-state-icon">{stateIcon}</span>}
        </div>
      )}

      {tier === 'mid' && (
        <Fragment>
          <div className="ag-ev-cap">
            <span className="ag-ev-time-mini mono">{t.hora}</span>
            <span className="ag-ev-dur mono">·&nbsp;{t.dur}m</span>
            {stateIcon && <span className="ag-ev-state-icon">{stateIcon}</span>}
          </div>
          <div className="ag-ev-main">
            <span className="ag-ev-initial" style={{ background: barbero.color }}>{initials}</span>
            <span className="ag-ev-cli">{t.cliente}</span>
            <span className="ag-ev-price mono">{FMT_UYU(t.precio)}</span>
          </div>
        </Fragment>
      )}

      {tier === 'long' && (
        <Fragment>
          <div className="ag-ev-cap">
            <span className="ag-ev-time-mini mono">{t.hora}</span>
            <span className="ag-ev-dur mono">·&nbsp;{t.dur}m</span>
            {stateIcon && <span className="ag-ev-state-icon">{stateIcon}</span>}
          </div>
          <div className="ag-ev-main">
            <span className="ag-ev-initial" style={{ background: barbero.color }}>{initials}</span>
            <span className="ag-ev-cli">{t.cliente}</span>
            <span className="ag-ev-price mono">{FMT_UYU(t.precio)}</span>
          </div>
          <div className="ag-ev-meta">
            <span className="ag-ev-svtag">{t.servicio}</span>
            <div className="ag-ev-badges">
              {t.notaIA && (
                <span className="ag-ev-ia" title="Agendado por IA">
                  <IconSparkle size={9} sw={2.4} />
                </span>
              )}
              {t.nuevo && <span className="ag-ev-new">nuevo</span>}
            </div>
          </div>
          {isHovered && t.notaIA && (
            <div className="ag-ev-note">
              <IconSparkle size={10} sw={2.4} />
              <span>{t.notaIA}</span>
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
}

function ColumnaBarbero({ barbero, turnos, hoveredEventId, setHoveredEventId, ahoraHora }) {
  const totalDia = turnos.reduce((s, t) => t.estado !== 'no-show' ? s + t.precio : s, 0);
  const ocupacionMin = turnos.filter((t) => t.estado !== 'no-show').reduce((s, t) => s + t.dur, 0);
  const ocupacionPct = Math.round((ocupacionMin / (HORAS_DIA.length * 60)) * 100);

  const ahoraHoraIdx = parseInt(ahoraHora, 10) - 9;

  return (
    <div className="ag-col">
      <div className="ag-col-hd">
        <div className="ag-col-hd-top">
          <span className="ag-col-avatar" style={{ background: barbero.color }}>{barbero.inicial}</span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="ag-col-name">{barbero.apodo}</div>
            <div className="ag-col-role">{barbero.rol}</div>
          </div>
          <button className="icon-btn"><IconDots size={14} /></button>
        </div>
        <div className="ag-col-stats-row">
          <span className="ag-col-stat">
            <b className="mono">{turnos.length}</b>
            <span>turnos</span>
          </span>
          <span className="ag-col-stat">
            <b className="mono">{ocupacionPct}%</b>
            <span>ocup.</span>
          </span>
          <span className="ag-col-stat ag-col-stat-money">
            <b className="mono">{FMT_UYU(totalDia)}</b>
          </span>
        </div>
      </div>

      <div className="ag-col-body" style={{ height: SLOT_PX * HORAS_DIA.length }}>
        {/* Slots de fondo */}
        {HORAS_DIA.map((h, i) => {
          const isPast = i < ahoraHoraIdx;
          const isNow = i === ahoraHoraIdx;
          return (
            <div
              className={'ag-slot' + (isPast ? ' is-past' : '') + (isNow ? ' is-now' : '')}
              key={h}
              style={{ top: i * SLOT_PX, height: SLOT_PX }}
            >
              <div className="ag-slot-half" />
            </div>
          );
        })}

        {/* Turnos — con resolución de superposiciones por lanes */}
        {layoutOverlaps(turnos).map((t) => {
          const topPx = (t.startMin / 60) * SLOT_PX;
          const heightPx = (t.dur / 60) * SLOT_PX - 4;
          const isHovered = hoveredEventId === t.id;
          const isNoShow = t.estado === 'no-show';

          // Lane width / position — al hacer hover se expande a ancho completo
          const lanePctW = 100 / t.groupSize;
          const laneLeft = t.lane * lanePctW;
          const evStyle = {
            top: topPx,
            borderLeftColor: isNoShow ? 'var(--danger)' : barbero.color,
            '--ev-tint': barbero.color,
          };
          if (isHovered) {
            evStyle.left = '4px';
            evStyle.right = '4px';
            evStyle.width = 'auto';
            evStyle.minHeight = Math.max(heightPx, 132);
            evStyle.height = 'auto';
            evStyle.zIndex = 60;
          } else {
            evStyle.left = `calc(${laneLeft}% + 4px)`;
            evStyle.width = `calc(${lanePctW}% - 7px)`;
            evStyle.height = heightPx;
          }

          return (
            <EventCard
              key={t.id}
              t={t}
              barbero={barbero}
              isHovered={isHovered}
              setHovered={setHoveredEventId}
              topPx={topPx}
              heightPx={heightPx}
              evStyle={evStyle}
            />
          );
        })}
      </div>
    </div>
  );
}

function Cronograma({ allTurnos, ahoraMin }) {
  const [hoveredEventId, setHoveredEventId] = useState(null);
  const turnosByBarbero = {};
  BARBEROS.forEach((b) => {
    turnosByBarbero[b.id] = allTurnos.filter((t) => t.barbero === b.id);
  });
  const ahoraHora = String(9 + Math.floor(ahoraMin / 60)).padStart(2, '0');
  const ahoraHoraIdx = parseInt(ahoraHora, 10) - 9;
  const ahoraMinDentroDeHora = ahoraMin % 60;
  const ahoraTxt = ahoraHora + ':' + String(ahoraMinDentroDeHora).padStart(2, '0');
  const nowTopPx = (ahoraMin / 60) * SLOT_PX;

  return (
    <div className="ag-grid">
      <div className="ag-hours">
        <div className="ag-hours-spacer" />
        {HORAS_DIA.map((h, i) => {
          const isPast = i < ahoraHoraIdx;
          const isNow = i === ahoraHoraIdx;
          return (
            <div
              className={'ag-hour-row' + (isPast ? ' is-past' : '') + (isNow ? ' is-now' : '')}
              key={h}
              style={{ height: SLOT_PX }}
            >
              <span className="ag-hour-lbl mono">{h}:00</span>
              {isNow && (
                <span className="ag-hour-now mono" style={{ top: (ahoraMinDentroDeHora / 60) * SLOT_PX - 9 }}>
                  {ahoraTxt}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="ag-cols">
        {BARBEROS.map((b) => (
          <ColumnaBarbero
            key={b.id}
            barbero={b}
            turnos={turnosByBarbero[b.id]}
            ahoraHora={ahoraHora}
            hoveredEventId={hoveredEventId}
            setHoveredEventId={setHoveredEventId}
          />
        ))}
        {/* Línea "ahora" única, fina, sin puntos por columna */}
        {ahoraMin >= 0 && ahoraMin < HORAS_DIA.length * 60 && (
          <div className="ag-now-line" style={{ top: 84 + nowTopPx }} />
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//   PAGE
// ═══════════════════════════════════════════════════════════════════════

export function ViewAgenda() {
  const [vista, setVista] = useState('dia');
  const [layout, setLayout] = useState('cronograma'); // 'cronograma' | 'kanban'

  const ahoraMin = 10 * 60 + 42 - (9 * 60); // 10:42

  const allTurnos = buildTurnosAgenda();
  const barberosById = Object.fromEntries(BARBEROS.map((b) => [b.id, b]));

  const facturadoDia = allTurnos.filter((t) => t.estado !== 'no-show').reduce((s, t) => s + t.precio, 0);
  const cobradoDia = allTurnos.filter((t) => t.estado === 'cobrado').reduce((s, t) => s + t.precio, 0);
  const turnosOK = allTurnos.filter((t) => t.estado !== 'no-show').length;
  const noShows = allTurnos.filter((t) => t.estado === 'no-show').length;

  return (
    <div className="ag-page">
      <div className="ag-page-hd">
        <div className="ag-page-hd-left">
          <div>
            <h1 className="page-title">Agenda</h1>
            <div className="page-subtitle">Sábado 16 de mayo · 2026</div>
          </div>
        </div>
        <div className="ag-page-hd-right">
          <div className="seg-control">
            <button className={vista === 'dia' ? 'is-active' : ''} onClick={() => setVista('dia')}>Día</button>
            <button className={vista === 'semana' ? 'is-active' : ''} onClick={() => setVista('semana')}>Semana</button>
            <button className={vista === 'mes' ? 'is-active' : ''} onClick={() => setVista('mes')}>Mes</button>
          </div>
          <button className="btn ghost sm icon-only" title="Día anterior"><IconArrowL size={14} /></button>
          <button className="btn ghost sm">Hoy</button>
          <button className="btn ghost sm icon-only" title="Día siguiente"><IconArrowR size={14} /></button>
          <span style={{ width: 4 }} />
          <button className="btn ghost sm"><IconFilter size={13} /> Filtros</button>
          <button className="btn accent sm"><IconPlus size={13} /> Nuevo turno</button>
        </div>
      </div>

      {/* Resumen del día + layout toggle */}
      <div className="ag-day-summary">
        <div className="ag-day-summary-item">
          <span className="ag-day-summary-lbl">Facturación día</span>
          <span className="ag-day-summary-val mono">{FMT_UYU(facturadoDia)}</span>
        </div>
        <div className="ag-day-summary-item">
          <span className="ag-day-summary-lbl">Cobrado</span>
          <span className="ag-day-summary-val mono">{FMT_UYU(cobradoDia)}</span>
        </div>
        <div className="ag-day-summary-item">
          <span className="ag-day-summary-lbl">Turnos</span>
          <span className="ag-day-summary-val mono">{turnosOK}</span>
        </div>
        <div className="ag-day-summary-item">
          <span className="ag-day-summary-lbl">No-show</span>
          <span className="ag-day-summary-val mono" style={{ color: noShows ? 'var(--danger)' : 'var(--fg)' }}>{noShows}</span>
        </div>
        <div className="ag-day-summary-spacer" />
        <div className="ag-day-summary-legend">
          {BARBEROS.map((b) => (
            <span key={b.id}><i className="ag-leg-dot" style={{ background: b.color }} />{b.apodo}</span>
          ))}
          <span className="ag-leg-divider" />
          <span><span className="ag-leg-ia"><IconSparkle size={8} sw={2.4} /></span>agendado por IA</span>
        </div>
        <div className="seg-control ag-layout-toggle">
          <button className={layout === 'cronograma' ? 'is-active' : ''} onClick={() => setLayout('cronograma')}>
            <TimelineIcon /> Cronograma
          </button>
          <button className={layout === 'kanban' ? 'is-active' : ''} onClick={() => setLayout('kanban')}>
            <KanbanIcon /> Kanban
          </button>
        </div>
      </div>

      {layout === 'kanban'
        ? <KanbanByHour turnos={allTurnos} ahoraMin={ahoraMin} barberosById={barberosById} />
        : <Cronograma allTurnos={allTurnos} ahoraMin={ahoraMin} />}
    </div>
  );
}

// Pequeños iconos inline para el toggle de layout
function KanbanIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2.5" width="3.2" height="11" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="6.4" y="2.5" width="3.2" height="7" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="10.8" y="2.5" width="3.2" height="9" rx="1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
function TimelineIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <line x1="2" y1="3.5" x2="14" y2="3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="2" y1="8" x2="10" y2="8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="2" y1="12.5" x2="12" y2="12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
