import { useState } from 'react';
import { IconTrend, IconTrendD, IconArrowR, IconBot, IconSparkle } from '../icons';
import { METRICAS, BARBEROS, SERVICIOS, FMT_UYU } from '../data';
import { Avatar, PageHeader } from '../shell';

// Vista Métricas — dashboard del dueño

function Sparkline({ data, color = 'var(--accent)', height = 40, fill = true }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 200;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y];
  });
  const path = points.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = path + ` L ${w} ${height} L 0 ${height} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} width="100%" height={height} preserveAspectRatio="none">
      {fill && <path d={area} fill={color} opacity=".10" />}
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function BarChart({ data, color = 'var(--accent)', height = 140 }) {
  const max = Math.max(...data.map((d) => d.v));
  return (
    <div className="bar-chart" style={{ height }}>
      {data.map((d, i) => (
        <div className="bar-col" key={i}>
          <div
            className="bar"
            style={{ height: ((d.v / max) * 100) + '%', background: color }}
            title={d.h + ':00 — ' + d.v + '%'}
          />
          <div className="bar-lbl mono">{d.h}</div>
        </div>
      ))}
    </div>
  );
}

function MetricStat({ label, value, prev, formatPct, formatMoney, deltaInvert }) {
  const fmt = (n) => formatMoney ? FMT_UYU(n) : formatPct ? n + '%' : n.toLocaleString('es-UY');
  const diff = prev != null ? ((value - prev) / prev) * 100 : null;
  const up = diff != null && diff >= 0;
  const positive = deltaInvert ? !up : up;
  return (
    <div className="card stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{fmt(value)}</div>
      {diff != null && (
        <div className={'stat-delta ' + (positive ? 'up' : 'down')}>
          {up ? <IconTrend size={12} /> : <IconTrendD size={12} />}
          <span>{(up ? '+' : '') + diff.toFixed(1) + '%'}</span>
          <span className="vs">vs mes anterior</span>
        </div>
      )}
    </div>
  );
}

export function ViewMetricas() {
  const [periodo, setPeriodo] = useState('mes');
  const barberoById = Object.fromEntries(BARBEROS.map((b) => [b.id, b]));
  const servicioById = Object.fromEntries(SERVICIOS.map((s) => [s.id, s]));
  const maxIngBarb = Math.max(...METRICAS.porBarbero.map((b) => b.ingresos));

  return (
    <div className="page">
      <PageHeader
        title="Métricas"
        subtitle="Mayo 2026 · 1 al 16"
        actions={
          <>
            <div className="seg-control">
              <button className={periodo === '7d' ? 'is-active' : ''} onClick={() => setPeriodo('7d')}>7 días</button>
              <button className={periodo === 'mes' ? 'is-active' : ''} onClick={() => setPeriodo('mes')}>Este mes</button>
              <button className={periodo === '90d' ? 'is-active' : ''} onClick={() => setPeriodo('90d')}>90 días</button>
              <button className={periodo === 'año' ? 'is-active' : ''} onClick={() => setPeriodo('año')}>Año</button>
            </div>
            <button className="btn sm">Exportar PDF</button>
          </>
        }
      />

      <div className="grid-4">
        <MetricStat label="Ingresos" value={METRICAS.ingresosMes} prev={METRICAS.ingresosMesPrev} formatMoney />
        <MetricStat label="Turnos atendidos" value={METRICAS.turnosMes} prev={METRICAS.turnosMesPrev} />
        <MetricStat label="Ocupación" value={METRICAS.ocupacion} prev={METRICAS.ocupacionPrev} formatPct />
        <MetricStat label="Ticket medio" value={METRICAS.ticketMedio} prev={METRICAS.ticketMedioPrev} formatMoney />
      </div>

      <div className="grid-2" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="card-hd">
            <div>
              <div>Ingresos diarios</div>
              <div className="text-xxs muted">{FMT_UYU(METRICAS.ingresosMes / 30 * 1000)} promedio diario</div>
            </div>
            <div className="text-xs soft">Últimos 30 días</div>
          </div>
          <div style={{ padding: '20px 16px 12px' }}>
            <Sparkline data={METRICAS.serie} height={140} />
          </div>
        </div>

        <div className="card">
          <div className="card-hd">
            <div>
              <div>Ocupación por franja</div>
              <div className="text-xxs muted">Horarios pico: 15:00 – 18:00</div>
            </div>
            <div className="text-xs soft">Promedio del mes</div>
          </div>
          <div style={{ padding: '16px 16px 12px' }}>
            <BarChart data={METRICAS.horarios} height={140} />
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="card-hd">
            <span>Performance por barbero</span>
            <button className="btn ghost sm">Ver detalle <IconArrowR size={11} /></button>
          </div>
          <div className="row-list">
            {METRICAS.porBarbero.map((b) => {
              const barb = barberoById[b.id];
              return (
                <div className="row" key={b.id} style={{ gridTemplateColumns: '160px 1fr auto auto' }}>
                  <div className="flex items-center gap-3">
                    <Avatar initials={barb.inicial} color={barb.color} />
                    <div>
                      <div className="text-sm fw-500">{barb.apodo}</div>
                      <div className="text-xxs muted">{barb.rol}</div>
                    </div>
                  </div>
                  <div className="metric-bar">
                    <div style={{ width: (b.ingresos / maxIngBarb * 100) + '%', background: barb.color }} />
                  </div>
                  <div className="mono text-sm fw-500">{FMT_UYU(b.ingresos)}</div>
                  <div className="text-xs muted mono">{b.turnos} · {b.ocupacion}%</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-hd">
            <span>Mix de servicios</span>
            <span className="text-xs soft">% de turnos</span>
          </div>
          <div className="row-list">
            {METRICAS.porServicio.map((s) => {
              const sv = servicioById[s.id];
              return (
                <div className="row" key={s.id} style={{ gridTemplateColumns: '1fr 2fr 50px' }}>
                  <div>
                    <div className="text-sm fw-500">{sv.nombre}</div>
                    <div className="text-xxs muted">{FMT_UYU(sv.precio)} · {sv.dur}min</div>
                  </div>
                  <div className="metric-bar">
                    <div style={{ width: (s.pct / 32 * 100) + '%' }} />
                  </div>
                  <div className="mono text-sm fw-600" style={{ textAlign: 'right' }}>{s.pct}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid-3" style={{ marginTop: 16 }}>
        <div className="card stat" style={{ borderColor: 'rgba(124,58,237,.25)' }}>
          <div className="stat-label">
            <IconBot size={13} color="var(--agent)" />
            <span>Impacto del agente IA</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--agent)' }}>{METRICAS.recuperadosMes + 41}</div>
          <div className="text-xs muted">turnos agendados sin intervención del equipo</div>
          <div className="text-xxs soft" style={{ marginTop: 10 }}>
            +{METRICAS.recuperadosMes} clientes inactivos reactivados · 1 escalado
          </div>
        </div>

        <div className="card stat">
          <div className="stat-label">Clientes nuevos</div>
          <div className="stat-value">{METRICAS.nuevosMes}</div>
          <div className="text-xs muted">este mes · 12 vienen de Instagram</div>
          <div className="stat-delta up" style={{ marginTop: 8 }}>
            <IconTrend size={12} />
            <span>+18%</span>
            <span className="vs">vs mes anterior</span>
          </div>
        </div>

        <div className="card stat">
          <div className="stat-label">No-show rate</div>
          <div className="stat-value">{METRICAS.noShow}%</div>
          <div className="text-xs muted">recordatorios automáticos del agente reducen 31%</div>
          <div className="stat-delta up" style={{ marginTop: 8 }}>
            <IconTrendD size={12} />
            <span>-1.9pp</span>
            <span className="vs">vs mes anterior</span>
          </div>
        </div>
      </div>
    </div>
  );
}
