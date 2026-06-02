// Vista Agenda — vista DIARIA con dos layouts (Kanban / Cronograma).
// Conectada al store: cobros, reservas manuales, bloqueos y notas del equipo.

import { useState, Fragment } from 'react';
import {
  IconArrowL, IconArrowR, IconPlus, IconSparkle, IconFilter, IconCheck, IconX,
  IconDots, IconCash, IconTicket, IconClock,
} from '../icons';
import { BARBEROS, SERVICIOS, FMT_UYU } from '../data';
import { useStore } from '../store';
import { Modal, Field, SelectInput } from '../ui';

const HORAS_DIA = ['09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
const HORAS_SLOT = HORAS_DIA.flatMap((h) => [`${h}:00`, `${h}:30`]);
const SLOT_PX = 84;

const ESTADO_INFO = {
  'confirmado': { lbl: 'Confirmado', dot: 'var(--fg-muted)' },
  'en-curso':   { lbl: 'En curso',   dot: 'var(--accent)' },
  'completo':   { lbl: 'Completado', dot: 'var(--ok)' },
  'cobrado':    { lbl: 'Cobrado',    dot: 'var(--ok)' },
  'no-show':    { lbl: 'No-show',    dot: 'var(--danger)' },
  'proximo':    { lbl: 'Próximo',    dot: 'var(--fg-muted)' },
};

function timeToMin(h) {
  const [hh, mm] = h.split(':').map(Number);
  return (hh - 9) * 60 + mm;
}

function layoutOverlaps(turnos) {
  const sorted = [...turnos].sort((a, b) => timeToMin(a.hora) - timeToMin(b.hora));
  const lanes = [];
  const placed = sorted.map((t) => {
    const startMin = timeToMin(t.hora);
    const endMin = startMin + t.dur;
    let lane = lanes.findIndex((e) => e <= startMin);
    if (lane === -1) { lane = lanes.length; lanes.push(endMin); }
    else { lanes[lane] = endMin; }
    return { ...t, startMin, endMin, lane };
  });
  return placed.map((e) => {
    let maxLane = e.lane;
    placed.forEach((o) => {
      if (o !== e && o.startMin < e.endMin && o.endMin > e.startMin && o.lane > maxLane) maxLane = o.lane;
    });
    return { ...e, groupSize: maxLane + 1 };
  });
}

// Botón Cobrar reutilizable — cambia según estado del turno
function CobrarBtn({ t, full }) {
  const { actions } = useStore();
  const cobrado = t.estado === 'cobrado';
  if (cobrado) {
    return (
      <span className={'ag-cobrado-tag' + (full ? ' full' : '')}><IconCheck size={11} sw={2.6} /> Cobrado</span>
    );
  }
  return (
    <button
      className={'ag-cobrar-btn' + (full ? ' full' : '')}
      onClick={(e) => { e.stopPropagation(); actions.openCobroTurno(t); }}
    >
      <IconCash size={12} /> Cobrar
    </button>
  );
}

// ═══════════════════════ KANBAN ═══════════════════════
function KanbanCard({ t, barbero }) {
  const [hovered, setHovered] = useState(false);
  const isAhora = t.estado === 'en-curso';
  const isCobrado = t.estado === 'cobrado';
  const isNoShow = t.estado === 'no-show';

  return (
    <div
      className={'ag-kcard ag-kcard-' + t.estado + (hovered ? ' is-hovered' : '')}
      style={{ borderLeftColor: isNoShow ? 'var(--danger)' : barbero.color }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
          {t.notaIA && <span className="ag-kcard-ia" title="Agendado por agente IA"><IconSparkle size={9} sw={2.4} /> IA</span>}
          {t.nuevo && <span className="ag-kcard-new">nuevo</span>}
        </div>
      )}
      {!isNoShow && (
        <div className="ag-kcard-action"><CobrarBtn t={t} full /></div>
      )}
    </div>
  );
}

function BloqueoCard({ b, onRemove }) {
  return (
    <div className="ag-blk-card">
      <span className="ag-blk-ic"><IconX size={11} sw={2.6} /></span>
      <div className="ag-blk-main">
        <div className="ag-blk-motivo">{b.motivo}</div>
        <div className="ag-blk-sub">{b.barbero === 'all' ? 'Todo el salón' : (BARBEROS.find((x) => x.id === b.barbero)?.apodo || '')} · {b.hora}h</div>
      </div>
      <button className="ag-blk-x" onClick={() => onRemove(b.id)} aria-label="Quitar bloqueo"><IconX size={12} /></button>
    </div>
  );
}

function KanbanColumn({ hora, turnos, bloqueos, ahoraHora, barberosById, onRemoveBloqueo, onAdd }) {
  const items = turnos.filter((t) => t.hora.startsWith(hora + ':'));
  const blks = bloqueos.filter((b) => b.hora === hora);
  const isNow = hora === ahoraHora;
  const isPast = parseInt(hora, 10) < parseInt(ahoraHora, 10);
  const ocupados = items.reduce((s, t) => s + t.dur, 0);
  const ocupPct = Math.min(100, Math.round((ocupados / (60 * 4)) * 100));

  return (
    <div className={'ag-kcol' + (isNow ? ' is-now' : '') + (isPast ? ' is-past' : '')}>
      <div className="ag-kcol-hd">
        <div className="ag-kcol-hd-top">
          <span className="ag-kcol-hour mono">{hora}:00</span>
          {isNow && <span className="ag-kcol-now-tag">AHORA</span>}
          <span className="ag-kcol-count">{items.length}</span>
        </div>
        <div className="ag-kcol-hd-bar"><div className="ag-kcol-hd-bar-fill" style={{ width: ocupPct + '%' }} /></div>
        <div className="ag-kcol-hd-meta"><span>{ocupPct}% ocup.</span></div>
      </div>
      <div className="ag-kcol-body">
        {blks.map((b) => <BloqueoCard key={b.id} b={b} onRemove={onRemoveBloqueo} />)}
        {items.length === 0 && blks.length === 0 ? (
          <button className="ag-kcol-empty" onClick={() => onAdd(hora)}><IconPlus size={12} /><span>Libre</span></button>
        ) : (
          items.sort((a, b) => timeToMin(a.hora) - timeToMin(b.hora))
            .map((t) => <KanbanCard key={t.id} t={t} barbero={barberosById[t.barbero]} />)
        )}
        {(items.length > 0 || blks.length > 0) && (
          <button className="ag-kcol-add" onClick={() => onAdd(hora)}><IconPlus size={11} /> Agregar</button>
        )}
      </div>
    </div>
  );
}

function KanbanByHour({ turnos, bloqueos, ahoraMin, barberosById, onRemoveBloqueo, onAdd }) {
  const ahoraH = String(9 + Math.floor(ahoraMin / 60)).padStart(2, '0');
  return (
    <div className="ag-kanban">
      {HORAS_DIA.map((h) => (
        <KanbanColumn key={h} hora={h} turnos={turnos} bloqueos={bloqueos} ahoraHora={ahoraH}
          barberosById={barberosById} onRemoveBloqueo={onRemoveBloqueo} onAdd={onAdd} />
      ))}
    </div>
  );
}

// ═══════════════════════ CRONOGRAMA ═══════════════════════
function EventCard({ t, barbero, isHovered, setHovered, heightPx, evStyle }) {
  const initials = t.cliente.split(/\s+/).map((p) => p[0]).slice(0, 2).join('');
  const isAhora = t.estado === 'en-curso';
  const isCobrado = t.estado === 'cobrado';
  const isNoShow = t.estado === 'no-show';
  const tier = isHovered ? 'long' : heightPx >= 56 ? 'long' : heightPx >= 38 ? 'mid' : 'short';

  const stateIcon = (
    isCobrado ? <IconCheck size={11} sw={2.6} color="var(--ok)" /> :
    isAhora ? <span className="ag-pulse" /> :
    isNoShow ? <IconX size={11} sw={2.6} color="var(--danger)" /> : null
  );

  return (
    <div
      className={'ag-ev ag-ev-' + t.estado + ' ag-ev-tier-' + tier + (isHovered ? ' is-hovered' : '') + (t.groupSize > 1 ? ' is-lane' : '')}
      data-lanes={t.groupSize} style={evStyle}
      onMouseEnter={() => setHovered(t.id)} onMouseLeave={() => setHovered(null)}
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
              {t.notaIA && <span className="ag-ev-ia" title="Agendado por IA"><IconSparkle size={9} sw={2.4} /></span>}
              {t.nuevo && <span className="ag-ev-new">nuevo</span>}
            </div>
          </div>
          {isHovered && t.notaIA && (
            <div className="ag-ev-note"><IconSparkle size={10} sw={2.4} /><span>{t.notaIA}</span></div>
          )}
          {isHovered && !isNoShow && (
            <div className="ag-ev-actions"><CobrarBtn t={t} full /></div>
          )}
        </Fragment>
      )}
    </div>
  );
}

function ColumnaBarbero({ barbero, turnos, bloqueos, hoveredEventId, setHoveredEventId, ahoraHora }) {
  const ahoraHoraIdx = parseInt(ahoraHora, 10) - 9;
  const colBlks = bloqueos.filter((b) => b.barbero === 'all' || b.barbero === barbero.id);

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
          <span className="ag-col-stat"><b className="mono">{turnos.length}</b><span>turnos</span></span>
          <span className="ag-col-stat"><b className="mono">{turnos.filter((t) => t.estado === 'cobrado').length}</b><span>cobrados</span></span>
        </div>
      </div>

      <div className="ag-col-body" style={{ height: SLOT_PX * HORAS_DIA.length }}>
        {HORAS_DIA.map((h, i) => {
          const isPast = i < ahoraHoraIdx;
          const isNow = i === ahoraHoraIdx;
          return (
            <div className={'ag-slot' + (isPast ? ' is-past' : '') + (isNow ? ' is-now' : '')} key={h}
              style={{ top: i * SLOT_PX, height: SLOT_PX }}><div className="ag-slot-half" /></div>
          );
        })}

        {colBlks.map((b) => {
          const top = (timeToMin(b.hora + ':00') / 60) * SLOT_PX;
          return (
            <div key={b.id} className="ag-ev-blk" style={{ top, height: SLOT_PX - 4 }} title={b.motivo}>
              <IconX size={11} sw={2.4} /><span>{b.motivo}</span>
            </div>
          );
        })}

        {layoutOverlaps(turnos).map((t) => {
          const topPx = (t.startMin / 60) * SLOT_PX;
          const heightPx = (t.dur / 60) * SLOT_PX - 4;
          const isHovered = hoveredEventId === t.id;
          const isNoShow = t.estado === 'no-show';
          const lanePctW = 100 / t.groupSize;
          const laneLeft = t.lane * lanePctW;
          const evStyle = { top: topPx, borderLeftColor: isNoShow ? 'var(--danger)' : barbero.color, '--ev-tint': barbero.color };
          if (isHovered) {
            evStyle.left = '4px'; evStyle.right = '4px'; evStyle.width = 'auto';
            evStyle.minHeight = Math.max(heightPx, 150); evStyle.height = 'auto'; evStyle.zIndex = 60;
          } else {
            evStyle.left = `calc(${laneLeft}% + 4px)`; evStyle.width = `calc(${lanePctW}% - 7px)`; evStyle.height = heightPx;
          }
          return <EventCard key={t.id} t={t} barbero={barbero} isHovered={isHovered} setHovered={setHoveredEventId} heightPx={heightPx} evStyle={evStyle} />;
        })}
      </div>
    </div>
  );
}

function Cronograma({ allTurnos, bloqueos, ahoraMin }) {
  const [hoveredEventId, setHoveredEventId] = useState(null);
  const turnosByBarbero = {};
  BARBEROS.forEach((b) => { turnosByBarbero[b.id] = allTurnos.filter((t) => t.barbero === b.id); });
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
            <div className={'ag-hour-row' + (isPast ? ' is-past' : '') + (isNow ? ' is-now' : '')} key={h} style={{ height: SLOT_PX }}>
              <span className="ag-hour-lbl mono">{h}:00</span>
              {isNow && <span className="ag-hour-now mono" style={{ top: (ahoraMinDentroDeHora / 60) * SLOT_PX - 9 }}>{ahoraTxt}</span>}
            </div>
          );
        })}
      </div>
      <div className="ag-cols">
        {BARBEROS.map((b) => (
          <ColumnaBarbero key={b.id} barbero={b} turnos={turnosByBarbero[b.id]} bloqueos={bloqueos}
            ahoraHora={ahoraHora} hoveredEventId={hoveredEventId} setHoveredEventId={setHoveredEventId} />
        ))}
        {ahoraMin >= 0 && ahoraMin < HORAS_DIA.length * 60 && <div className="ag-now-line" style={{ top: 84 + nowTopPx }} />}
      </div>
    </div>
  );
}

// ═══════════════════════ NOTAS DEL EQUIPO ═══════════════════════
function NotasPanel({ onClose }) {
  const { state, actions } = useStore();
  const [draft, setDraft] = useState('');
  const add = () => { if (draft.trim()) { actions.addNota(draft.trim(), 'Mati', '#7c3aed'); setDraft(''); } };
  return (
    <aside className="ag-notas">
      <div className="ag-notas-hd">
        <span className="ag-notas-title"><IconSparkle size={13} /> Notas del equipo</span>
        <button className="icon-btn" onClick={onClose} aria-label="Cerrar notas"><IconX size={14} /></button>
      </div>
      <div className="ag-notas-add">
        <textarea className="inp txta" rows={2} placeholder="Recordatorio para el equipo…" value={draft}
          onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) add(); }} />
        <button className="btn accent sm" onClick={add} disabled={!draft.trim()}><IconPlus size={12} /> Agregar nota</button>
      </div>
      <div className="ag-notas-list scroll">
        {state.notas.map((n) => (
          <div className="ag-nota" key={n.id} style={{ borderLeftColor: n.color }}>
            <div className="ag-nota-txt">{n.texto}</div>
            <div className="ag-nota-foot">
              <span className="ag-nota-meta">{n.autor} · {n.fecha}</span>
              <button className="ag-nota-x" onClick={() => actions.removeNota(n.id)} aria-label="Eliminar"><IconX size={11} /></button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

// ═══════════════════════ MODALES ═══════════════════════
function BookingModal({ open, onClose, prefillHora }) {
  const { state, actions } = useStore();
  const [cliente, setCliente] = useState('');
  const [servicioId, setServicioId] = useState(SERVICIOS[0].id);
  const [barbero, setBarbero] = useState(BARBEROS[0].id);
  const [hora, setHora] = useState(prefillHora ? `${prefillHora}:00` : '11:00');
  const sv = SERVICIOS.find((s) => s.id === servicioId);

  const submit = () => {
    if (!cliente.trim()) return;
    actions.createTurno({ cliente: cliente.trim(), servicio: sv.nombre, barbero, hora, dur: sv.dur, precio: sv.precio });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Nuevo turno" subtitle="Reserva manual"
      footer={<><button className="btn" onClick={onClose}>Cancelar</button><button className="btn accent" onClick={submit} disabled={!cliente.trim()}><IconPlus size={13} /> Agendar turno</button></>}>
      <div className="form-stack">
        <Field label="Cliente" required>
          <input className="inp" list="bk-clientes" placeholder="Nombre del cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} autoFocus />
          <datalist id="bk-clientes">{state.clientes.map((c) => <option key={c.id} value={c.nombre} />)}</datalist>
        </Field>
        <div className="form-grid">
          <Field label="Servicio"><SelectInput value={servicioId} onChange={setServicioId} options={SERVICIOS.map((s) => ({ value: s.id, label: `${s.nombre} · ${FMT_UYU(s.precio)}` }))} /></Field>
          <Field label="Barbero"><SelectInput value={barbero} onChange={setBarbero} options={BARBEROS.map((b) => ({ value: b.id, label: b.nombre }))} /></Field>
          <Field label="Hora"><SelectInput value={hora} onChange={setHora} options={HORAS_SLOT} /></Field>
          <Field label="Duración"><input className="inp" value={`${sv.dur} min`} disabled /></Field>
        </div>
      </div>
    </Modal>
  );
}

function BloqueoModal({ open, onClose }) {
  const { actions } = useStore();
  const [barbero, setBarbero] = useState('all');
  const [hora, setHora] = useState('13');
  const [motivo, setMotivo] = useState('Descanso');
  const submit = () => { actions.addBloqueo({ barbero, hora, motivo: motivo.trim() || 'Bloqueado' }); onClose(); };
  return (
    <Modal open={open} onClose={onClose} title="Bloquear horario" subtitle="Tachá turnos por descanso o cierre del salón"
      footer={<><button className="btn" onClick={onClose}>Cancelar</button><button className="btn accent" onClick={submit}><IconX size={13} /> Bloquear</button></>}>
      <div className="form-stack">
        <div className="form-grid">
          <Field label="Aplicar a"><SelectInput value={barbero} onChange={setBarbero} options={[{ value: 'all', label: 'Todo el salón' }, ...BARBEROS.map((b) => ({ value: b.id, label: b.nombre }))]} /></Field>
          <Field label="Hora"><SelectInput value={hora} onChange={setHora} options={HORAS_DIA.map((h) => ({ value: h, label: `${h}:00` }))} /></Field>
        </div>
        <Field label="Motivo"><SelectInput value={motivo} onChange={setMotivo} options={['Descanso', 'Almuerzo', 'Salón cerrado', 'Turno médico', 'Reservado']} /></Field>
      </div>
    </Modal>
  );
}

// ═══════════════════════ PAGE ═══════════════════════
export function ViewAgenda() {
  const { state, actions } = useStore();
  const [vista, setVista] = useState('dia');
  const [layout, setLayout] = useState('cronograma');
  const [notasOpen, setNotasOpen] = useState(true);
  const [booking, setBooking] = useState(null);   // null | { hora }
  const [bloqueoOpen, setBloqueoOpen] = useState(false);

  const ahoraMin = 10 * 60 + 42 - (9 * 60);
  const allTurnos = state.turnos;
  const barberosById = Object.fromEntries(BARBEROS.map((b) => [b.id, b]));

  const turnosOK = allTurnos.filter((t) => t.estado !== 'no-show').length;
  const cobrados = allTurnos.filter((t) => t.estado === 'cobrado').length;
  const proximos = allTurnos.filter((t) => t.estado === 'proximo').length;
  const noShows = allTurnos.filter((t) => t.estado === 'no-show').length;

  // Alerta cuponera — clientes con turno hoy a punto de terminar su cuponera
  const clientesHoy = new Set(allTurnos.map((t) => t.cliente));
  const cuponeraPorTerminar = state.cuponerasClientes.find((c) => c.usados >= c.total - 1 && clientesHoy.has(c.cliente));

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
          <button className="btn ghost sm" onClick={() => setBloqueoOpen(true)}><IconX size={13} /> Bloquear</button>
          <button className="btn sm" onClick={actions.openCobroWalkin}><IconCash size={13} /> Cobrar</button>
          <button className="btn accent sm" onClick={() => setBooking({ hora: null })}><IconPlus size={13} /> Nuevo turno</button>
        </div>
      </div>

      {cuponeraPorTerminar && (
        <div className="alert agent ag-cup-alert">
          <IconTicket size={16} color="var(--agent)" />
          <div className="alert-body">
            <div className="alert-text">
              <b>{cuponeraPorTerminar.cliente}</b> está por terminar su cuponera
              (<b>{cuponeraPorTerminar.usados}/{cuponeraPorTerminar.total}</b> · {cuponeraPorTerminar.pack}).
              Buen momento para venderle otra.
            </div>
          </div>
          <button className="btn sm">Ofrecer renovación</button>
        </div>
      )}

      {/* Resumen del día (sin info de facturación — pedido del cliente) */}
      <div className="ag-day-summary">
        <div className="ag-day-summary-item"><span className="ag-day-summary-lbl">Turnos</span><span className="ag-day-summary-val mono">{turnosOK}</span></div>
        <div className="ag-day-summary-item"><span className="ag-day-summary-lbl">Cobrados</span><span className="ag-day-summary-val mono" style={{ color: 'var(--ok)' }}>{cobrados}</span></div>
        <div className="ag-day-summary-item"><span className="ag-day-summary-lbl">Próximos</span><span className="ag-day-summary-val mono">{proximos}</span></div>
        <div className="ag-day-summary-item"><span className="ag-day-summary-lbl">No-show</span><span className="ag-day-summary-val mono" style={{ color: noShows ? 'var(--danger)' : 'var(--fg)' }}>{noShows}</span></div>
        <div className="ag-day-summary-spacer" />
        <div className="ag-day-summary-legend">
          {BARBEROS.map((b) => (<span key={b.id}><i className="ag-leg-dot" style={{ background: b.color }} />{b.apodo}</span>))}
          <span className="ag-leg-divider" />
          <span><span className="ag-leg-ia"><IconSparkle size={8} sw={2.4} /></span>agendado por IA</span>
        </div>
        {!notasOpen && <button className="btn ghost sm" onClick={() => setNotasOpen(true)}><IconSparkle size={12} /> Notas</button>}
        <div className="seg-control ag-layout-toggle">
          <button className={layout === 'cronograma' ? 'is-active' : ''} onClick={() => setLayout('cronograma')}><TimelineIcon /> Cronograma</button>
          <button className={layout === 'kanban' ? 'is-active' : ''} onClick={() => setLayout('kanban')}><KanbanIcon /> Kanban</button>
        </div>
      </div>

      <div className="ag-body">
        <div className="ag-body-main">
          {layout === 'kanban'
            ? <KanbanByHour turnos={allTurnos} bloqueos={state.bloqueos} ahoraMin={ahoraMin} barberosById={barberosById}
                onRemoveBloqueo={actions.removeBloqueo} onAdd={(hora) => setBooking({ hora })} />
            : <Cronograma allTurnos={allTurnos} bloqueos={state.bloqueos} ahoraMin={ahoraMin} />}
        </div>
        {notasOpen && <NotasPanel onClose={() => setNotasOpen(false)} />}
      </div>

      <BookingModal open={!!booking} onClose={() => setBooking(null)} prefillHora={booking?.hora} />
      <BloqueoModal open={bloqueoOpen} onClose={() => setBloqueoOpen(false)} />
    </div>
  );
}

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
