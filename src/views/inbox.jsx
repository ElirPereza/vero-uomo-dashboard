import { useState } from 'react';
import { IconWA, IconIG, IconSparkle, IconSearch, IconFilter, IconBot, IconDots, IconPaper, IconArrowR, IconCheck, IconX } from '../icons';
import { CONVERSACIONES } from '../data';

// Vista Inbox — conversaciones gestionadas por el agente

function ConversationListItem({ k, active, onClick }) {
  const ChannelIcon = k.canal === 'wa' ? IconWA : IconIG;
  const chColor = k.canal === 'wa' ? '#25D366' : '#E1306C';
  const isAgente = k.estado === 'agente';
  const isEscalado = k.estado === 'escalado';
  return (
    <button className={'conv-item' + (active ? ' is-active' : '')} onClick={onClick}>
      <div className="conv-avatar-wrap">
        <span className="avatar" style={{ background: '#52525b' }}>{k.avatar}</span>
        <span className="conv-channel" style={{ background: chColor }}>
          <ChannelIcon size={9} color="#fff" sw={2.4} />
        </span>
      </div>
      <div className="flex-1" style={{ minWidth: 0 }}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm fw-500 truncate">{k.cliente}</span>
          <span className="text-xxs muted">{k.ult}</span>
        </div>
        <div className="text-xs muted truncate">{k.preview}</div>
        <div className="flex items-center gap-2" style={{ marginTop: 4 }}>
          {isAgente && (
            <span className="ai-badge" style={{ fontSize: 9 }}>
              <IconSparkle size={9} sw={2.2} /><span>agente</span>
            </span>
          )}
          {isEscalado && <span className="tag warn" style={{ height: 17 }}>escalado</span>}
          {k.estado === 'cerrado' && <span className="tag" style={{ height: 17 }}>cerrado</span>}
          <span className="tag outline" style={{ height: 17 }}>{k.tag}</span>
        </div>
      </div>
    </button>
  );
}

function Message({ m }) {
  const isAgent = m.de === 'agente';
  return (
    <div className={'msg-row ' + (isAgent ? 'msg-out' : 'msg-in')}>
      <div className="msg">
        {isAgent && (
          <div className="msg-byline">
            <span className="ai-badge" style={{ fontSize: 9 }}>
              <IconSparkle size={9} sw={2.2} /><span>{m.auto ? 'agente · automático' : 'agente IA'}</span>
            </span>
          </div>
        )}
        <div className="msg-bubble">{m.txt}</div>
        <div className="msg-meta">
          <span className="mono">{m.t}</span>
          {m.accion === 'reserva-creada' && (
            <span className="msg-action">
              <IconCheck size={10} sw={2.4} color="var(--ok)" /> turno creado
            </span>
          )}
          {m.accion === 'escalado' && (
            <span className="msg-action" style={{ color: 'var(--warn)' }}>
              escalado al equipo
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function AgentPanel({ k }) {
  if (!k) return null;
  const acciones = {
    k1: { etapa: 'Reserva confirmada', items: [
      ['Reconocí cliente recurrente', 'ok'],
      ['Detecté preferencia: Mati (3 últimas)', 'ok'],
      ['Ofrecí 3 huecos del sábado', 'ok'],
      ['Creé turno: sáb 23, 15:00', 'ok'],
      ['Reservé recordatorio 24h antes', 'pending'],
    ]},
    k2: { etapa: 'Cliente nuevo agendado', items: [
      ['Atendí fuera de horario (02:14)', 'ok'],
      ['Respondí precio del fade premium', 'ok'],
      ['Creé ficha nueva: Bruno Tabárez', 'ok'],
      ['Creé turno: hoy 14:00 con Nico', 'ok'],
    ]},
    k3: { etapa: 'Cliente reactivado', items: [
      ['Detecté inactividad (4 meses)', 'ok'],
      ['Inicié contacto proactivo', 'ok'],
      ['Re-agendé con mismo barbero anterior', 'ok'],
    ]},
    k4: { etapa: 'Escalado al equipo', items: [
      ['Detecté cancelación de servicio largo (color)', 'ok'],
      ['Política: color requiere coordinación humana', 'ok'],
      ['Notifiqué a Leo (asignado)', 'pending'],
    ]},
  };
  const flow = acciones[k.id] || { etapa: 'Conversación cerrada', items: [['Sin acciones pendientes', 'ok']] };

  return (
    <aside className="conv-side">
      <div className="card">
        <div className="card-hd">
          <div className="flex items-center gap-2">
            <IconBot size={14} color="var(--agent)" />
            <span>Estado del agente</span>
          </div>
          <span className={'tag ' + (k.estado === 'agente' ? 'agent' : k.estado === 'escalado' ? 'warn' : '')} style={{ height: 18 }}>
            <span className="dot" />{k.estado === 'agente' ? 'manejando' : k.estado === 'escalado' ? 'escalado' : 'cerrado'}
          </span>
        </div>
        <div style={{ padding: '12px 16px' }}>
          <div className="text-xs muted">Etapa</div>
          <div className="text-sm fw-500" style={{ marginTop: 2 }}>{flow.etapa}</div>
          <div className="agent-steps">
            {flow.items.map((it, i) => (
              <div className="agent-step" key={i}>
                <span className={'agent-step-dot ' + (it[1] === 'ok' ? 'ok' : 'pending')}>
                  {it[1] === 'ok' && <IconCheck size={9} sw={2.4} color="#fff" />}
                </span>
                <span className={'text-xs ' + (it[1] === 'ok' ? '' : 'muted')}>{it[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-hd"><span>Cliente</span></div>
        <div style={{ padding: '12px 16px' }}>
          <div className="flex items-center gap-3">
            <span className="avatar lg" style={{ background: '#52525b' }}>{k.avatar}</span>
            <div>
              <div className="text-sm fw-500">{k.cliente}</div>
              <div className="text-xs muted">{k.canal === 'wa' ? 'WhatsApp' : 'Instagram'} · +598 99 412 853</div>
            </div>
          </div>
          <div className="grid-2" style={{ gap: 12, marginTop: 14 }}>
            <div>
              <div className="text-xxs muted">Visitas</div>
              <div className="text-sm fw-500">{k.id === 'k2' ? '0 (nuevo)' : '14'}</div>
            </div>
            <div>
              <div className="text-xxs muted">Última visita</div>
              <div className="text-sm fw-500">{k.id === 'k2' ? '—' : '2 sem'}</div>
            </div>
            <div>
              <div className="text-xxs muted">Servicio habitual</div>
              <div className="text-sm fw-500">Fade premium</div>
            </div>
            <div>
              <div className="text-xxs muted">Barbero</div>
              <div className="text-sm fw-500">Mati</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-hd"><span>Acciones rápidas</span></div>
        <div className="quick-actions">
          <button className="btn ghost sm">Ver ficha completa</button>
          <button className="btn ghost sm">Crear turno manual</button>
          <button className="btn ghost sm">Marcar como spam</button>
          {k.estado === 'agente' && <button className="btn ghost sm" style={{ color: 'var(--warn)' }}>Tomar conversación</button>}
        </div>
      </div>
    </aside>
  );
}

export function ViewInbox() {
  const [selectedId, setSelected] = useState('k1');
  const [filter, setFilter] = useState('todos');
  const k = CONVERSACIONES.find((c) => c.id === selectedId) || CONVERSACIONES[0];
  const ChannelIcon = k.canal === 'wa' ? IconWA : IconIG;

  const filters = [
    { id: 'todos',   label: 'Todos',     count: CONVERSACIONES.length },
    { id: 'agente',  label: 'Con agente',count: CONVERSACIONES.filter((c) => c.estado === 'agente').length },
    { id: 'escalado',label: 'Escalados', count: CONVERSACIONES.filter((c) => c.estado === 'escalado').length },
    { id: 'cerrado', label: 'Cerrados',  count: CONVERSACIONES.filter((c) => c.estado === 'cerrado').length },
  ];
  const list = filter === 'todos' ? CONVERSACIONES : CONVERSACIONES.filter((c) => c.estado === filter);

  return (
    <div className="inbox-shell">
      <div className="inbox-list">
        <div className="inbox-list-hd">
          <div className="flex items-center justify-between">
            <h2 className="page-title" style={{ fontSize: 'var(--fs-xl)' }}>Inbox</h2>
            <button className="icon-btn"><IconFilter size={14} /></button>
          </div>
          <div className="search-box" style={{ width: '100%', marginTop: 10 }}>
            <IconSearch size={14} />
            <span>Buscar</span>
          </div>
          <div className="filter-chips" style={{ marginTop: 10, flexWrap: 'wrap' }}>
            {filters.map((f) => (
              <button
                key={f.id}
                className={'chip' + (f.id === filter ? ' is-active' : '')}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
                <span className="chip-count">{f.count}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="conv-list scroll">
          {list.map((c) => (
            <ConversationListItem key={c.id} k={c} active={c.id === selectedId} onClick={() => setSelected(c.id)} />
          ))}
        </div>
      </div>

      <div className="conv-pane">
        <div className="conv-pane-hd">
          <div className="flex items-center gap-3">
            <span className="avatar" style={{ background: '#52525b' }}>{k.avatar}</span>
            <div>
              <div className="text-sm fw-500">{k.cliente}</div>
              <div className="text-xxs muted flex items-center gap-1">
                <ChannelIcon size={10} /> {k.canal === 'wa' ? 'WhatsApp' : 'Instagram'} · activo {k.ult}
              </div>
            </div>
            {k.estado === 'agente' && (
              <span className="ai-badge" style={{ marginLeft: 12 }}>
                <IconBot size={11} /><span>agente manejando</span>
              </span>
            )}
            {k.estado === 'escalado' && (
              <span className="tag warn" style={{ marginLeft: 12 }}>
                <span className="dot" />escalado a ti
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button className="btn ghost sm">Crear turno</button>
            <button className="icon-btn"><IconDots size={14} /></button>
          </div>
        </div>

        <div className="conv-thread scroll">
          <div className="conv-day">— Hoy —</div>
          {k.mensajes.map((m, i) => <Message key={i} m={m} />)}
          {k.estado === 'agente' && (
            <div className="agent-typing">
              <span className="ai-badge" style={{ fontSize: 9 }}>
                <IconSparkle size={9} sw={2.2} /><span>agente</span>
              </span>
              <span className="text-xxs muted">esperando respuesta del cliente</span>
            </div>
          )}
        </div>

        <div className="conv-composer">
          {k.estado === 'agente' && (
            <div className="composer-banner">
              <IconBot size={12} color="var(--agent)" />
              <span>El agente está manejando esta conversación.</span>
              <button className="btn ghost sm" style={{ marginLeft: 'auto' }}>Tomar control</button>
            </div>
          )}
          <div className="composer-box">
            <textarea placeholder={k.estado === 'agente' ? 'Escribí para tomar el control…' : 'Escribí tu respuesta…'} />
            <div className="composer-foot">
              <div className="flex items-center gap-1 muted text-xxs">
                <span className="kbd">⏎</span> enviar
              </div>
              <button className="btn accent sm">Enviar</button>
            </div>
          </div>
        </div>
      </div>

      <AgentPanel k={k} />
    </div>
  );
}
