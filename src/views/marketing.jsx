// Vista Marketing — campañas Google/Meta (gestionables), WhatsApp, leads, reseñas.

import { useState } from 'react';
import { IconPlay, IconPause, IconDots, IconPlus, IconArrowR, IconBot, IconStar, IconTrend, IconCheck, IconWA } from '../icons';
import { useStore } from '../store';
import { CAMPANIAS, LEADS_MARKETING, RESENIAS, FMT_UYU } from '../data';
import { PageHeader } from '../shell';
import { Modal, Field, TextInput, TextArea, SelectInput } from '../ui';

const PLAT = { meta: { label: 'Meta', color: '#0866FF' }, google: { label: 'Google', color: '#34A853' } };
const WA_TEMPLATES = [
  '¡Hola! Tenemos lugar este sábado. ¿Te agendamos tu corte? 💈',
  '🎉 Promo de la semana: 2x1 en cejas los martes. ¡Te esperamos!',
  '¿Hace rato que no pasás? Tenemos un fade premium con tu nombre. Reservá por acá.',
];

function CampaignRow({ c, onToggle }) {
  const ctr = ((c.clicks / c.impresiones) * 100).toFixed(2);
  const conv = ((c.turnos / c.leads) * 100).toFixed(0);
  const plat = PLAT[c.plataforma] || PLAT.google;
  const isActive = c.estado === 'activa';
  return (
    <div className="row mkt-camp-row">
      <div className="flex items-center gap-3" style={{ minWidth: 0 }}>
        <span className="mkt-plat-badge" style={{ background: plat.color }}>{plat.label[0]}</span>
        <div style={{ minWidth: 0 }}>
          <div className="text-sm fw-500 truncate">{c.nombre}</div>
          <div className="text-xxs muted">{plat.label} · {c.desde} → {c.hasta}</div>
        </div>
      </div>
      <div className="text-xs"><span className={'tag ' + (isActive ? 'ok' : '')}><span className="dot" />{c.estado}</span></div>
      <div className="text-right"><div className="text-sm mono fw-500">{FMT_UYU(c.gasto)}</div><div className="text-xxs muted mono">de {FMT_UYU(c.inversion)}</div></div>
      <div className="text-right mono text-sm">{c.impresiones.toLocaleString('es-UY')}</div>
      <div className="text-right"><div className="text-sm mono fw-500">{c.clicks.toLocaleString('es-UY')}</div><div className="text-xxs muted mono">CTR {ctr}%</div></div>
      <div className="text-right"><div className="text-sm mono fw-500">{c.leads}</div><div className="text-xxs muted mono">→ {c.turnos} turnos ({conv}%)</div></div>
      <div className="text-right mono text-sm fw-500">{FMT_UYU(c.cpa)}</div>
      <div className="flex items-center gap-1">
        <button className="icon-btn" title={isActive ? 'Pausar' : 'Activar'} onClick={() => onToggle(c.id)}>
          {isActive ? <IconPause size={13} /> : <IconPlay size={13} />}
        </button>
        <button className="icon-btn"><IconDots size={14} /></button>
      </div>
    </div>
  );
}

function ResenaCard({ r }) {
  return (
    <div className="mkt-resena">
      <div className="mkt-resena-hd">
        <div className="flex items-center gap-2">
          <span className="avatar" style={{ background: '#52525b', width: 26, height: 26, fontSize: 10 }}>{r.autor.split(' ').map((s) => s[0]).slice(0, 2).join('')}</span>
          <div><div className="text-sm fw-500">{r.autor}</div><div className="text-xxs muted">{r.fecha}</div></div>
        </div>
        <div className="mkt-stars">{[1,2,3,4,5].map((n) => <IconStar key={n} size={12} filled={n <= r.estrellas} color={n <= r.estrellas ? '#F59E0B' : 'var(--border-strong)'} />)}</div>
      </div>
      <div className="mkt-resena-body text-sm">"{r.texto}"</div>
      <div className={'mkt-resena-resp ' + (r.respuesta === 'pendiente' ? 'is-pending' : '')}>
        <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
          <span className="ai-badge"><IconBot size={10} /><span>agente IA</span></span>
          {r.respuesta === 'auto' ? <span className="tag ok" style={{ height: 17 }}><IconCheck size={9} sw={2.4} />respondido</span> : <span className="tag warn" style={{ height: 17 }}>requiere revisión</span>}
        </div>
        <div className="text-xs soft">{r.respIA}</div>
      </div>
    </div>
  );
}

function WhatsAppModal({ open, onClose }) {
  const { state, actions } = useStore();
  const [destino, setDestino] = useState('todos');
  const [msg, setMsg] = useState('');
  const grupo = state.grupos.find((g) => g.id === destino);
  const n = destino === 'todos' ? state.clientes.length : state.clientes.filter((c) => (c.grupos || []).includes(destino)).length;
  const send = () => { if (!msg.trim()) return; actions.toast(`Mensaje enviado a ${n} cliente${n === 1 ? '' : 's'}${grupo ? ` (${grupo.nombre})` : ''}`); onClose(); setMsg(''); };
  return (
    <Modal open={open} onClose={onClose} title="Enviar WhatsApp" subtitle="Mensaje masivo vía el chatbot" width={480}
      footer={<><button className="btn" onClick={onClose}>Cancelar</button><button className="btn accent" onClick={send} disabled={!msg.trim()}><IconWA size={13} /> Enviar a {n}</button></>}>
      <div className="form-stack">
        <Field label="Destinatarios">
          <SelectInput value={destino} onChange={setDestino} options={[{ value: 'todos', label: `Todos los clientes (${state.clientes.length})` }, ...state.grupos.map((g) => ({ value: g.id, label: g.nombre }))]} />
        </Field>
        <Field label="Mensaje" hint="Se envía desde el número del salón vía el agente IA">
          <TextArea value={msg} onChange={setMsg} rows={4} placeholder="Escribí tu mensaje…" />
        </Field>
        <div>
          <div className="cli-sect-lbl" style={{ marginBottom: 6 }}>Plantillas rápidas</div>
          <div className="flex flex-col gap-2">
            {WA_TEMPLATES.map((t, i) => (
              <button key={i} className="mkt-wa-tpl" onClick={() => setMsg(t)}>{t}</button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function CampanaModal({ open, onClose, onCreate }) {
  const [f, setF] = useState({ nombre: '', plataforma: 'meta', inversion: '', mensaje: '' });
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));
  const submit = () => { if (!f.nombre.trim()) return; onCreate({ nombre: f.nombre.trim(), plataforma: f.plataforma, inversion: Number(f.inversion) || 0 }); onClose(); setF({ nombre: '', plataforma: 'meta', inversion: '', mensaje: '' }); };
  return (
    <Modal open={open} onClose={onClose} title="Nueva campaña" subtitle="Google Ads / Meta + chatbot"
      footer={<><button className="btn" onClick={onClose}>Cancelar</button><button className="btn accent" onClick={submit} disabled={!f.nombre.trim()}><IconPlus size={13} /> Lanzar campaña</button></>}>
      <div className="form-stack">
        <Field label="Nombre" required><TextInput value={f.nombre} onChange={set('nombre')} placeholder="Ej: Fade premium · Pocitos" /></Field>
        <div className="form-grid">
          <Field label="Plataforma"><SelectInput value={f.plataforma} onChange={set('plataforma')} options={[{ value: 'meta', label: 'Meta (IG/FB)' }, { value: 'google', label: 'Google Ads' }]} /></Field>
          <Field label="Inversión ($)"><input className="inp" type="number" min="0" value={f.inversion} onChange={(e) => set('inversion')(e.target.value)} /></Field>
        </div>
        <Field label="Mensaje del chatbot" hint="Lo que responde el agente IA a los leads de esta campaña">
          <TextArea value={f.mensaje} onChange={set('mensaje')} rows={2} placeholder="¡Hola! Vi que te interesó el fade premium…" />
        </Field>
      </div>
    </Modal>
  );
}

export function ViewMarketing() {
  const { actions } = useStore();
  const [campanias, setCampanias] = useState(CAMPANIAS);
  const [filtro, setFiltro] = useState('todas');
  const [waOpen, setWaOpen] = useState(false);
  const [campOpen, setCampOpen] = useState(false);

  const toggle = (id) => setCampanias((cs) => cs.map((c) => (c.id === id ? { ...c, estado: c.estado === 'activa' ? 'pausada' : 'activa' } : c)));
  const createCampania = (data) => {
    setCampanias((cs) => [{ id: 'cmp-' + Date.now(), estado: 'activa', gasto: 0, impresiones: 0, clicks: 0, leads: 0, turnos: 0, cpa: 0, desde: 'hoy', hasta: '—', ...data }, ...cs]);
    actions.toast(`Campaña "${data.nombre}" lanzada en ${PLAT[data.plataforma].label}`);
  };

  const visibles = filtro === 'todas' ? campanias : campanias.filter((c) => c.plataforma === filtro);
  const totalInversion = campanias.reduce((s, c) => s + c.inversion, 0);
  const totalGasto = campanias.reduce((s, c) => s + c.gasto, 0);
  const totalLeads = campanias.reduce((s, c) => s + c.leads, 0);
  const totalTurnos = campanias.reduce((s, c) => s + c.turnos, 0);
  const conv = totalLeads ? ((totalTurnos / totalLeads) * 100).toFixed(0) : 0;
  const ingresoEstimado = totalTurnos * 920;
  const roi = totalGasto ? ((ingresoEstimado - totalGasto) / totalGasto * 100).toFixed(0) : 0;
  const avgStars = (RESENIAS.reduce((s, r) => s + r.estrellas, 0) / RESENIAS.length).toFixed(1);
  const pendientes = RESENIAS.filter((r) => r.respuesta === 'pendiente').length;

  const estadoLeadInfo = { 'agendó': { cls: 'tag ok' }, 'respondió': { cls: 'tag accent' }, 'sin contestar': { cls: 'tag warn' } };

  return (
    <div className="page">
      <PageHeader title="Marketing" subtitle="Campañas en Google y Meta · WhatsApp · reseñas"
        actions={<><button className="btn sm" onClick={() => setWaOpen(true)}><IconWA size={13} /> Enviar WhatsApp</button><button className="btn accent sm" onClick={() => setCampOpen(true)}><IconPlus size={13} /> Nueva campaña</button></>} />

      <div className="grid-4">
        <div className="card stat"><div className="stat-label">Inversión del mes</div><div className="stat-value">{FMT_UYU(totalGasto)}</div><div className="text-xs muted">de {FMT_UYU(totalInversion)} presupuestado</div></div>
        <div className="card stat"><div className="stat-label">Leads generados</div><div className="stat-value">{totalLeads}</div><div className="text-xs muted">{totalTurnos} → turnos · conv. {conv}%</div></div>
        <div className="card stat"><div className="stat-label">Ingresos atribuidos</div><div className="stat-value">{FMT_UYU(ingresoEstimado)}</div><div className="stat-delta up" style={{ marginTop: 4 }}><IconTrend size={12} /><span>ROI +{roi}%</span></div></div>
        <div className="card stat"><div className="stat-label">Reseñas Google</div><div className="stat-value"><span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4 }}>{avgStars}<IconStar size={16} filled color="#F59E0B" /></span></div><div className="text-xs muted">{RESENIAS.length} este mes · {pendientes} sin responder</div></div>
      </div>

      <div className="alert agent" style={{ marginTop: 16 }}>
        <IconBot size={16} color="var(--agent)" />
        <div className="alert-body"><div className="alert-text"><b>Sugerencia:</b> la campaña "Reactivación" tiene el mejor CPA ($66) y conversión (75%). Reasignar $1.500 desde "Lanzamiento cuponeras" (pausada) podría generar +12 turnos.</div></div>
        <button className="btn sm" onClick={() => actions.toast('Presupuesto reasignado a Reactivación')}>Aplicar</button>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-hd">
          <span>Campañas</span>
          <span className="seg-control">
            {[['todas', 'Todas'], ['meta', 'Meta'], ['google', 'Google']].map(([k, l]) => (
              <button key={k} className={filtro === k ? 'is-active' : ''} onClick={() => setFiltro(k)}>{l}</button>
            ))}
          </span>
        </div>
        <div className="mkt-camp-table-hd">
          <span>Campaña</span><span>Estado</span><span style={{ textAlign: 'right' }}>Gasto</span><span style={{ textAlign: 'right' }}>Impr.</span><span style={{ textAlign: 'right' }}>Clicks</span><span style={{ textAlign: 'right' }}>Leads</span><span style={{ textAlign: 'right' }}>CPA</span><span></span>
        </div>
        <div className="row-list">
          {visibles.map((c) => <CampaignRow key={c.id} c={c} onToggle={toggle} />)}
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 16, alignItems: 'start' }}>
        <div className="card">
          <div className="card-hd"><span>Leads recientes</span><button className="btn ghost sm">Ver todos <IconArrowR size={11} /></button></div>
          <div className="row-list">
            {LEADS_MARKETING.map((l, i) => (
              <div className="row" key={i} style={{ gridTemplateColumns: '1fr 1fr 100px 80px' }}>
                <div><div className="text-sm fw-500">{l.nombre}</div><div className="text-xxs muted">{l.hora}</div></div>
                <div className="flex items-center gap-2"><span className="mkt-plat-dot" style={{ background: PLAT[l.fuente]?.color }} /><span className="text-xs truncate">{l.campaign}</span></div>
                <div><span className={estadoLeadInfo[l.estado].cls}>{l.estado}</span></div>
                <div><button className="btn ghost sm">Abrir</button></div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-hd"><div><span>Reseñas de Google Maps</span><div className="text-xxs muted">Respuestas automáticas con IA</div></div><button className="btn ghost sm">Abrir en Google</button></div>
          <div className="mkt-resenas">{RESENIAS.slice(0, 4).map((r) => <ResenaCard key={r.id} r={r} />)}</div>
        </div>
      </div>

      <WhatsAppModal open={waOpen} onClose={() => setWaOpen(false)} />
      <CampanaModal open={campOpen} onClose={() => setCampOpen(false)} onCreate={createCampania} />
    </div>
  );
}
