import { useState } from 'react';
import { IconSearch, IconFilter, IconPlus, IconArrowR, IconSparkle, IconBot, IconStar, IconWA, IconIG, IconPhone, IconCalendar } from '../icons';
import { CLIENTES } from '../data';
import { Avatar, PageHeader } from '../shell';

// Vista Clientes

function ClientDetail({ cli, tagInfo }) {
  const ti = tagInfo[cli.tag];
  return (
    <div className="card" style={{ position: 'sticky', top: 16 }}>
      <div className="cli-detail-hero">
        <Avatar
          initials={cli.nombre.split(' ').map((s) => s[0]).slice(0, 2).join('')}
          color="#0EA5E9"
          size="xl"
        />
        <div style={{ marginTop: 12 }}>
          <div className="text-lg fw-600">{cli.nombre}</div>
          <div className="text-xs muted">{cli.tel} · Cliente desde feb 2024</div>
        </div>
        <div style={{ marginTop: 8 }}>
          <span className={ti.cls} style={ti.style}>{ti.label}</span>
        </div>
      </div>

      <div className="grid-3" style={{ padding: '0 16px 14px', gap: 8 }}>
        <button className="btn sm" style={{ width: '100%' }}>
          <IconCalendar size={12} /> Agendar
        </button>
        <button className="btn ghost sm" style={{ width: '100%' }}>
          <IconWA size={12} /> WhatsApp
        </button>
        <button className="btn ghost sm" style={{ width: '100%' }}>
          <IconPhone size={12} /> Llamar
        </button>
      </div>

      <div className="cli-detail-stats">
        <div>
          <div className="text-xxs muted">Visitas totales</div>
          <div className="text-lg fw-600 mono">{cli.visitas}</div>
        </div>
        <div>
          <div className="text-xxs muted">Última</div>
          <div className="text-lg fw-600">{cli.ult}</div>
        </div>
        <div>
          <div className="text-xxs muted">Gasto total</div>
          <div className="text-lg fw-600 mono">${(cli.visitas * 920).toLocaleString('es-UY')}</div>
        </div>
      </div>

      <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)' }}>
        <div className="text-xxs muted" style={{ marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>Preferencias</div>
        <div className="text-sm">{cli.pref !== '—' ? cli.pref : 'Aún sin preferencia definida'}</div>
      </div>

      <div style={{ padding: '0 16px 14px' }}>
        <div className="text-xxs muted" style={{ marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>Notas del agente</div>
        <div className="cli-ainote">
          <IconBot size={12} color="var(--agent)" />
          <span className="text-xs">
            Cliente fiel. Suele agendar martes o sábados. Preguntó dos veces por color en los últimos 3 meses — posible upsell.
          </span>
        </div>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
          <div className="text-xxs muted" style={{ textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>Próximos turnos</div>
          <button className="btn ghost sm">Ver todos <IconArrowR size={11} /></button>
        </div>
        <div className="cli-history">
          <div className="cli-history-item">
            <div className="mono text-xs">Sáb 23 may · 15:00</div>
            <div className="text-xs muted">Fade premium · Mati · $950</div>
            <span className="ai-badge" style={{ fontSize: 9 }}>
              <IconSparkle size={9} sw={2.2} /><span>agente</span>
            </span>
          </div>
          <div className="cli-history-item past">
            <div className="mono text-xs">Sáb 2 may · 14:30</div>
            <div className="text-xs muted">Fade premium · Mati · $950</div>
          </div>
          <div className="cli-history-item past">
            <div className="mono text-xs">Sáb 18 abr · 14:00</div>
            <div className="text-xs muted">Fade + barba · Mati · $1.500</div>
          </div>
          <div className="cli-history-item past">
            <div className="mono text-xs">Sáb 4 abr · 16:00</div>
            <div className="text-xs muted">Fade premium · Mati · $950</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ViewClientes() {
  const [selectedId, setSelected] = useState('c2');
  const [seg, setSeg] = useState('todos');

  const tagInfo = {
    vip: { label: 'VIP', cls: 'tag tag-vip' },
    fiel: { label: 'Fiel', cls: 'tag ok' },
    nuevo: { label: 'Nuevo', cls: 'tag accent' },
    activo: { label: 'Activo', cls: 'tag' },
    riesgo: { label: 'En riesgo', cls: 'tag warn' },
  };

  const segments = [
    { id: 'todos',   label: 'Todos',     count: CLIENTES.length },
    { id: 'vip',     label: 'VIP',       count: CLIENTES.filter((c) => c.tag === 'vip').length },
    { id: 'fiel',    label: 'Fieles',    count: CLIENTES.filter((c) => c.tag === 'fiel').length },
    { id: 'riesgo',  label: 'En riesgo', count: CLIENTES.filter((c) => c.tag === 'riesgo').length },
    { id: 'nuevo',   label: 'Nuevos',    count: CLIENTES.filter((c) => c.tag === 'nuevo').length },
  ];

  const list = seg === 'todos' ? CLIENTES : CLIENTES.filter((c) => c.tag === seg);
  const cli = CLIENTES.find((c) => c.id === selectedId) || CLIENTES[0];

  return (
    <div className="page">
      <PageHeader
        title="Clientes"
        subtitle={CLIENTES.length + ' clientes · 41 nuevos este mes · 18 reactivados por el agente'}
        actions={
          <>
            <button className="btn ghost sm"><IconFilter size={13} /> Filtros</button>
            <button className="btn sm">Exportar</button>
            <button className="btn accent sm"><IconPlus size={13} /> Nuevo cliente</button>
          </>
        }
      />

      <div className="cli-shell">
        <div className="card cli-list-card">
          <div style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
            <div className="search-box" style={{ width: '100%' }}>
              <IconSearch size={14} />
              <span>Buscar cliente, teléfono…</span>
            </div>
            <div className="filter-chips" style={{ marginTop: 10, flexWrap: 'wrap' }}>
              {segments.map((s) => (
                <button
                  key={s.id}
                  className={'chip' + (seg === s.id ? ' is-active' : '')}
                  onClick={() => setSeg(s.id)}
                >
                  {s.label}<span className="chip-count">{s.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="cli-table-hd">
            <span>Cliente</span>
            <span>Visitas</span>
            <span>Última</span>
            <span>Preferencias</span>
            <span>Estado</span>
          </div>

          <div className="cli-table scroll">
            {list.map((c) => {
              const ti = tagInfo[c.tag];
              return (
                <button
                  key={c.id}
                  className={'cli-row' + (c.id === selectedId ? ' is-active' : '')}
                  onClick={() => setSelected(c.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      initials={c.nombre.split(' ').map((s) => s[0]).slice(0, 2).join('')}
                      color={['#0EA5E9', '#F59E0B', '#10B981', '#EF4444', '#8b5cf6'][parseInt(c.id.slice(1)) % 5]}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div className="text-sm fw-500 truncate">{c.nombre}</div>
                      <div className="text-xxs muted">{c.tel}</div>
                    </div>
                  </div>
                  <div className="mono text-sm">{c.visitas}</div>
                  <div className="text-xs muted">{c.ult}</div>
                  <div className="text-xs truncate">{c.pref}</div>
                  <div>
                    <span className={ti.cls} style={ti.style}>{ti.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="cli-side">
          <ClientDetail cli={cli} tagInfo={tagInfo} />
        </div>
      </div>
    </div>
  );
}
