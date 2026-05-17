import { IconClock, IconCash, IconSparkle, IconChart, IconBot, IconFilter, IconPlus, IconTrend, IconTrendD, IconCheck, IconArrowR, IconBell } from '../icons';
import { TURNOS_HOY, BARBEROS, HOY_FECHA, FMT_UYU, ACTIVIDAD_AGENTE, ALERTAS_HOY } from '../data';
import { Avatar, PageHeader } from '../shell';

// Vista Hoy — pantalla de arranque del equipo

function HoyStat({ label, value, sublabel, delta, deltaUp, icon, accent }) {
  return (
    <div className="card stat">
      <div className="stat-label">
        {icon}
        <span>{label}</span>
      </div>
      <div className="stat-value">{value}</div>
      {sublabel && <div className="text-xs muted">{sublabel}</div>}
      {delta != null && (
        <div className={'stat-delta ' + (deltaUp ? 'up' : 'down')}>
          {deltaUp ? <IconTrend size={12} /> : <IconTrendD size={12} />}
          <span>{delta}</span>
          <span className="vs">vs ayer</span>
        </div>
      )}
    </div>
  );
}

function TurnoRow({ t, barbero, ahora }) {
  const isAhora = t.estado === 'en-curso';
  const isDone = t.estado === 'completo';
  const ringStyle = {
    background: isDone ? 'var(--ok)' : isAhora ? 'var(--accent)' : 'var(--fg-faint)',
  };
  return (
    <div className="hoy-row" data-state={t.estado}>
      <div className="hoy-row-time">
        <span className="mono">{t.hora}</span>
        <span className="text-xxs muted">{t.dur}m</span>
      </div>
      <div className="hoy-row-rail">
        <span className="hoy-row-dot" style={ringStyle}>
          {isDone && <IconCheck size={10} color="#fff" sw={2.4} />}
        </span>
      </div>
      <div className="hoy-row-main">
        <div className="flex items-center gap-2">
          <span className="fw-500">{t.cliente}</span>
          {t.nuevo && <span className="tag accent" style={{ height: 18 }}>nuevo</span>}
          {t.addon && <span className="tag" style={{ height: 18 }}>+ addon</span>}
          {t.notaIA && (
            <span className="ai-badge">
              <IconSparkle size={10} sw={2.2} />
              <span>agente</span>
            </span>
          )}
        </div>
        <div className="text-xs muted">
          {t.servicio} · <span style={{ color: barbero.color }}>●</span> {barbero.apodo}
        </div>
        {t.notaIA && <div className="hoy-row-ainote">{t.notaIA}</div>}
      </div>
      <div className="hoy-row-price mono soft">{FMT_UYU(t.precio)}</div>
    </div>
  );
}

function ActivityFeed() {
  const tipoColor = {
    reserva: 'var(--ok)',
    reactivado: 'var(--accent)',
    escalado: 'var(--warn)',
    recordatorio: 'var(--fg-muted)',
    consulta: 'var(--fg-muted)',
  };
  return (
    <div className="card">
      <div className="card-hd">
        <div className="flex items-center gap-2">
          <IconBot size={14} color="var(--agent)" />
          <span>Agente IA</span>
          <span className="tag agent" style={{ height: 18 }}>
            <span className="dot" />activo
          </span>
        </div>
        <button className="btn ghost sm">
          Ver todo <IconArrowR size={12} />
        </button>
      </div>
      <div style={{ padding: '12px 16px 14px' }}>
        <div className="text-xs muted" style={{ marginBottom: 10 }}>
          Hoy gestionó <b style={{ color: 'var(--fg)' }}>14</b> conversaciones,
          agendó <b style={{ color: 'var(--fg)' }}>5</b> turnos y escaló <b style={{ color: 'var(--fg)' }}>1</b>.
        </div>
        <div className="feed">
          {ACTIVIDAD_AGENTE.map((a, i) => (
            <div className="feed-item" key={i}>
              <span className="feed-dot" style={{ background: tipoColor[a.tipo] }} />
              <div className="flex-1" style={{ minWidth: 0 }}>
                <div className="text-sm">{a.txt}</div>
                <div className="text-xxs muted" style={{ marginTop: 2 }}>{a.t}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Alertas() {
  const tipoIcon = {
    hueco: <IconClock size={14} color="var(--warn)" />,
    noshow: <IconBell size={14} color="var(--danger)" />,
  };
  return (
    <div className="card">
      <div className="card-hd">
        <span>Atención</span>
        <span className="text-xxs muted">2</span>
      </div>
      <div style={{ padding: '4px 6px 6px' }}>
        {ALERTAS_HOY.map((a, i) => (
          <div className="alert-row" key={i}>
            <div className="alert-icon">{tipoIcon[a.tipo]}</div>
            <div className="flex-1">
              <div className="text-sm fw-500">{a.texto}</div>
              <div className="text-xs muted">{a.accion}</div>
            </div>
            <button className="btn ghost sm icon-only"><IconArrowR size={13} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function HoyEquipo() {
  return (
    <div className="card">
      <div className="card-hd">
        <span>Equipo hoy</span>
        <span className="text-xxs muted">4 activos</span>
      </div>
      <div style={{ padding: '4px 0 8px' }}>
        {BARBEROS.map((b) => {
          const turnos = TURNOS_HOY.filter((t) => t.barbero === b.id);
          const done = turnos.filter((t) => t.estado === 'completo').length;
          const total = turnos.length;
          const pct = total ? (done / total) * 100 : 0;
          const next = turnos.find((t) => t.estado !== 'completo');
          return (
            <div className="team-row" key={b.id}>
              <Avatar initials={b.inicial} color={b.color} />
              <div className="flex-1" style={{ minWidth: 0 }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm fw-500">{b.apodo}</span>
                  <span className="text-xxs muted mono">{done}/{total}</span>
                </div>
                <div className="team-bar"><span style={{ width: pct + '%', background: b.color }} /></div>
                <div className="text-xxs muted" style={{ marginTop: 4 }}>
                  {next ? <>Próximo: <b style={{ color: 'var(--fg-soft)' }}>{next.hora}</b> · {next.cliente.split(' ')[0]}</>
                        : 'Día completo'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ViewHoy() {
  const ahora = '10:42';
  const barberoById = Object.fromEntries(BARBEROS.map((b) => [b.id, b]));
  const ingresosHoy = TURNOS_HOY.reduce((s, t) => s + t.precio, 0);
  const completos = TURNOS_HOY.filter((t) => t.estado === 'completo').length;
  const enCurso = TURNOS_HOY.filter((t) => t.estado === 'en-curso').length;
  const proximos = TURNOS_HOY.filter((t) => t.estado === 'proximo').length;

  // Group turnos by hour band
  const byHora = {};
  TURNOS_HOY.forEach((t) => {
    const h = t.hora.split(':')[0];
    (byHora[h] = byHora[h] || []).push(t);
  });

  return (
    <div className="page">
      <PageHeader
        title="Hoy"
        subtitle={HOY_FECHA + ' · ' + ahora + ' · Pocitos'}
        actions={
          <>
            <button className="btn ghost sm"><IconFilter size={13} /> Filtrar</button>
            <button className="btn sm">Ver agenda</button>
            <button className="btn accent sm"><IconPlus size={13} /> Nuevo turno</button>
          </>
        }
      />

      <div className="grid-4">
        <HoyStat
          label="Turnos"
          icon={<IconClock size={13} />}
          value={TURNOS_HOY.length}
          sublabel={`${completos} hechos · ${enCurso} en curso · ${proximos} próximos`}
        />
        <HoyStat
          label="Ingresos esperados"
          icon={<IconCash size={13} />}
          value={FMT_UYU(ingresosHoy)}
          delta="+12%"
          deltaUp
        />
        <HoyStat
          label="Ocupación día"
          icon={<IconChart size={13} />}
          value="82%"
          sublabel="3 huecos restantes"
        />
        <HoyStat
          label="Agente IA"
          icon={<IconBot size={13} color="var(--agent)" />}
          value="5 turnos"
          sublabel="agendados solo · sin equipo"
        />
      </div>

      <div className="hoy-split">
        <div className="hoy-main">
          <div className="card">
            <div className="card-hd">
              <div className="flex items-center gap-3">
                <span>Turnos del día</span>
                <div className="legend">
                  <span><i style={{ background: 'var(--ok)' }} />hecho</span>
                  <span><i style={{ background: 'var(--accent)' }} />en curso</span>
                  <span><i style={{ background: 'var(--fg-faint)' }} />próximo</span>
                </div>
              </div>
              <div className="filter-chips">
                <button className="chip is-active">Todos</button>
                {BARBEROS.map((b) => (
                  <button className="chip" key={b.id}>
                    <span className="chip-dot" style={{ background: b.color }} />{b.apodo}
                  </button>
                ))}
              </div>
            </div>
            <div className="hoy-timeline">
              {Object.entries(byHora).map(([h, ts]) => (
                <div className="hoy-hour" key={h}>
                  <div className="hoy-hour-label mono">{h}:00</div>
                  <div className="hoy-hour-body">
                    {ts.map((t) => (
                      <TurnoRow key={t.id} t={t} barbero={barberoById[t.barbero]} ahora={ahora} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hoy-side">
          <Alertas />
          <ActivityFeed />
          <HoyEquipo />
        </div>
      </div>
    </div>
  );
}
