import { useState } from 'react';
import { IconBot, IconSparkle, IconCheck, IconPlus, IconDots, IconScissors, IconHash, IconClock, IconWA, IconIG } from '../icons';
import { BARBEROS, SERVICIOS, FMT_UYU } from '../data';
import { Avatar, PageHeader } from '../shell';

// Vista Configuración — equipo, servicios, agente

function CfgRow({ label, hint, children }) {
  return (
    <div className="cfg-row">
      <div className="cfg-row-lbl">
        <div className="text-sm fw-500">{label}</div>
        {hint && <div className="text-xs muted">{hint}</div>}
      </div>
      <div className="cfg-row-ctrl">{children}</div>
    </div>
  );
}

function Switch({ on, onChange }) {
  return (
    <button className={'switch' + (on ? ' on' : '')} onClick={() => onChange && onChange(!on)}>
      <i />
    </button>
  );
}

function CfgAgente() {
  const [autoAgendar, setAutoAgendar] = useState(true);
  const [reactivar, setReactivar] = useState(true);
  const [recordatorios, setRecordatorios] = useState(true);
  const [fueraHorario, setFueraHorario] = useState(true);

  return (
    <div className="grid-2" style={{ alignItems: 'start' }}>
      <div className="card">
        <div className="card-hd">
          <div className="flex items-center gap-2">
            <IconBot size={14} color="var(--agent)" />
            <span>Agente IA</span>
            <span className="tag agent" style={{ height: 18 }}>
              <span className="dot" />activo
            </span>
          </div>
          <button className="btn ghost sm">Pausar</button>
        </div>
        <div style={{ padding: '14px 16px 4px' }} className="text-sm soft">
          Tu agente atiende WhatsApp e Instagram 24/7, agenda turnos, recuerda visitas
          y escala al equipo cuando algo no entra en sus reglas.
        </div>

        <div className="cfg-rows">
          <CfgRow label="Agendar turnos automáticamente"
                  hint="El agente crea turnos sin pedir confirmación.">
            <Switch on={autoAgendar} onChange={setAutoAgendar} />
          </CfgRow>
          <CfgRow label="Reactivar clientes inactivos"
                  hint="Después de 60 días sin venir, el agente inicia conversación.">
            <Switch on={reactivar} onChange={setReactivar} />
          </CfgRow>
          <CfgRow label="Enviar recordatorios 24 h antes"
                  hint="Por WhatsApp · reduce no-show en 31%.">
            <Switch on={recordatorios} onChange={setRecordatorios} />
          </CfgRow>
          <CfgRow label="Atender fuera de horario"
                  hint="Responder consultas entre 21:00 y 09:00.">
            <Switch on={fueraHorario} onChange={setFueraHorario} />
          </CfgRow>
        </div>
      </div>

      <div className="flex-col" style={{ gap: 16 }}>
        <div className="card">
          <div className="card-hd"><span>Cuándo escalar al equipo</span></div>
          <div style={{ padding: '12px 16px' }}>
            <div className="cfg-tag-list">
              <span className="tag">Cancelaciones de color/química</span>
              <span className="tag">Quejas o reclamos</span>
              <span className="tag">Pedidos de servicios fuera del menú</span>
              <span className="tag">Más de 3 mensajes sin avanzar</span>
              <button className="chip" style={{ height: 22 }}>+ agregar regla</button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-hd"><span>Tono y estilo</span></div>
          <div className="cfg-rows">
            <CfgRow label="Estilo">
              <select className="select">
                <option>Amigable uruguayo (recomendado)</option>
                <option>Profesional neutro</option>
                <option>Casual joven</option>
              </select>
            </CfgRow>
            <CfgRow label="Voseo">
              <Switch on={true} />
            </CfgRow>
            <CfgRow label="Usar emojis"
                    hint="El agente los usa con moderación.">
              <Switch on={true} />
            </CfgRow>
          </div>
        </div>
      </div>
    </div>
  );
}

function CfgEquipo() {
  return (
    <div className="card">
      <div className="card-hd">
        <span>Barberos ({BARBEROS.length})</span>
        <button className="btn sm"><IconPlus size={12} /> Agregar barbero</button>
      </div>
      <div className="cli-table-hd" style={{ gridTemplateColumns: '2fr 1.2fr 1fr 1fr 60px' }}>
        <span>Barbero</span>
        <span>Rol</span>
        <span>Comisión</span>
        <span>Estado</span>
        <span></span>
      </div>
      <div className="row-list">
        {BARBEROS.map((b, i) => (
          <div className="row" key={b.id} style={{ gridTemplateColumns: '2fr 1.2fr 1fr 1fr 60px' }}>
            <div className="flex items-center gap-3">
              <Avatar initials={b.inicial} color={b.color} />
              <div>
                <div className="text-sm fw-500">{b.nombre}</div>
                <div className="text-xxs muted">{['mati','seba','nico','leo'][i]}@verouomo.uy</div>
              </div>
            </div>
            <div className="text-sm">{b.rol}</div>
            <div className="mono text-sm">{i === 0 ? '—' : '50%'}</div>
            <div><span className="tag ok"><span className="dot" />activo</span></div>
            <div><button className="icon-btn"><IconDots size={14} /></button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CfgServicios() {
  return (
    <div className="card">
      <div className="card-hd">
        <span>Servicios ({SERVICIOS.length})</span>
        <button className="btn sm"><IconPlus size={12} /> Nuevo servicio</button>
      </div>
      <div className="cli-table-hd" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 60px' }}>
        <span>Servicio</span>
        <span>Duración</span>
        <span>Precio</span>
        <span>Visible online</span>
        <span></span>
      </div>
      <div className="row-list">
        {SERVICIOS.map((s) => (
          <div className="row" key={s.id} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 60px' }}>
            <div className="flex items-center gap-3">
              <span className="svc-ic"><IconScissors size={13} /></span>
              <div>
                <div className="text-sm fw-500">{s.nombre}</div>
                <div className="text-xxs muted">slug: {s.id}</div>
              </div>
            </div>
            <div className="text-sm mono">{s.dur} min</div>
            <div className="text-sm mono fw-500">{FMT_UYU(s.precio)}</div>
            <div><Switch on={true} /></div>
            <div><button className="icon-btn"><IconDots size={14} /></button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CfgHorarios() {
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const horarios = ['10:00 – 20:00', '10:00 – 20:00', '10:00 – 20:00', '10:00 – 20:00', '10:00 – 20:00', '09:00 – 20:00', 'Cerrado'];
  return (
    <div className="grid-2" style={{ alignItems: 'start' }}>
      <div className="card">
        <div className="card-hd"><span>Horarios de atención</span></div>
        <div className="row-list">
          {dias.map((d, i) => (
            <div className="row" key={d} style={{ gridTemplateColumns: '1fr 1fr 60px' }}>
              <div className="text-sm fw-500">{d}</div>
              <div className="text-sm mono soft">{horarios[i]}</div>
              <Switch on={i !== 6} />
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-hd"><span>Feriados y excepciones</span></div>
        <div style={{ padding: 16 }}>
          <div className="cfg-tag-list">
            <span className="tag outline">19 jun · Cerrado · Carnaval ext.</span>
            <span className="tag outline">18 jul · Cerrado</span>
            <span className="tag outline">25 ago · 10:00 – 14:00</span>
            <button className="chip" style={{ height: 22 }}>+ agregar excepción</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CfgCanales() {
  return (
    <div className="grid-2" style={{ alignItems: 'start' }}>
      <div className="card">
        <div className="card-hd">
          <div className="flex items-center gap-2">
            <IconWA size={14} color="#25D366" />
            <span>WhatsApp Business</span>
          </div>
          <span className="tag ok"><IconCheck size={10} sw={2.4} />conectado</span>
        </div>
        <div className="cfg-rows">
          <CfgRow label="Número conectado"><span className="text-sm mono">+598 99 412 853</span></CfgRow>
          <CfgRow label="Mensajes este mes"><span className="text-sm mono">1.247</span></CfgRow>
          <CfgRow label="Plantilla de bienvenida" hint="Se envía al primer mensaje.">
            <button className="btn ghost sm">Editar</button>
          </CfgRow>
        </div>
      </div>
      <div className="card">
        <div className="card-hd">
          <div className="flex items-center gap-2">
            <IconIG size={14} color="#E1306C" />
            <span>Instagram</span>
          </div>
          <span className="tag ok"><IconCheck size={10} sw={2.4} />conectado</span>
        </div>
        <div className="cfg-rows">
          <CfgRow label="Cuenta"><span className="text-sm">@verouomo.uy</span></CfgRow>
          <CfgRow label="Mensajes este mes"><span className="text-sm mono">348</span></CfgRow>
          <CfgRow label="Responder DMs automáticamente">
            <Switch on={true} />
          </CfgRow>
        </div>
      </div>
    </div>
  );
}

function CfgNegocio() {
  return (
    <div className="card" style={{ maxWidth: 720 }}>
      <div className="card-hd"><span>Información de la barbería</span></div>
      <div className="cfg-rows">
        <CfgRow label="Nombre"><input className="input" defaultValue="Vero Uomo" /></CfgRow>
        <CfgRow label="Dirección"><input className="input" defaultValue="21 de Setiembre 2840, Pocitos" /></CfgRow>
        <CfgRow label="Teléfono"><input className="input" defaultValue="+598 99 412 853" /></CfgRow>
        <CfgRow label="Moneda"><select className="select"><option>UYU · Peso uruguayo</option></select></CfgRow>
        <CfgRow label="Zona horaria"><select className="select"><option>America/Montevideo (UTC-3)</option></select></CfgRow>
      </div>
    </div>
  );
}

export function ViewConfig() {
  const [tab, setTab] = useState('agente');

  const tabs = [
    { id: 'agente',    label: 'Agente IA' },
    { id: 'equipo',    label: 'Equipo' },
    { id: 'servicios', label: 'Servicios' },
    { id: 'horarios',  label: 'Horarios' },
    { id: 'canales',   label: 'Canales' },
    { id: 'negocio',   label: 'Negocio' },
  ];

  return (
    <div className="page">
      <PageHeader
        title="Configuración"
        subtitle="Ajustes de la barbería, el equipo y el agente IA"
      />

      <div className="cfg-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={'cfg-tab' + (tab === t.id ? ' is-active' : '')}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="cfg-body">
        {tab === 'agente'    && <CfgAgente />}
        {tab === 'equipo'    && <CfgEquipo />}
        {tab === 'servicios' && <CfgServicios />}
        {tab === 'horarios'  && <CfgHorarios />}
        {tab === 'canales'   && <CfgCanales />}
        {tab === 'negocio'   && <CfgNegocio />}
      </div>
    </div>
  );
}
