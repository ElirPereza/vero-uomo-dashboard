// Vista Marketing — campañas Google/Meta, leads, reseñas

import { IconPlay, IconPause, IconDots, IconPlus, IconArrowR, IconBot, IconSparkle, IconStar, IconTrend, IconCheck } from '../icons';
import { CAMPANIAS, LEADS_MARKETING, RESENIAS, FMT_UYU } from '../data';
import { PageHeader } from '../shell';

function CampaignRow({ c }) {
  const ctr = ((c.clicks / c.impresiones) * 100).toFixed(2);
  const conv = ((c.turnos / c.leads) * 100).toFixed(0);
  const platColor = c.plataforma === 'meta' ? '#0866FF' : '#4285F4';
  const platLabel = c.plataforma === 'meta' ? 'Meta' : 'Google';
  const isActive = c.estado === 'activa';
  return (
    <div className="row mkt-camp-row">
      <div className="flex items-center gap-3" style={{ minWidth: 0 }}>
        <span className="mkt-plat-badge" style={{ background: platColor }}>{platLabel[0]}</span>
        <div style={{ minWidth: 0 }}>
          <div className="text-sm fw-500 truncate">{c.nombre}</div>
          <div className="text-xxs muted">{platLabel} · {c.desde} → {c.hasta}</div>
        </div>
      </div>
      <div className="text-xs">
        <span className={'tag ' + (isActive ? 'ok' : '')}><span className="dot" />{c.estado}</span>
      </div>
      <div className="text-right">
        <div className="text-sm mono fw-500">{FMT_UYU(c.gasto)}</div>
        <div className="text-xxs muted mono">de {FMT_UYU(c.inversion)}</div>
      </div>
      <div className="text-right mono text-sm">{c.impresiones.toLocaleString('es-UY')}</div>
      <div className="text-right">
        <div className="text-sm mono fw-500">{c.clicks.toLocaleString('es-UY')}</div>
        <div className="text-xxs muted mono">CTR {ctr}%</div>
      </div>
      <div className="text-right">
        <div className="text-sm mono fw-500">{c.leads}</div>
        <div className="text-xxs muted mono">→ {c.turnos} turnos ({conv}%)</div>
      </div>
      <div className="text-right mono text-sm fw-500">{FMT_UYU(c.cpa)}</div>
      <div className="flex items-center gap-1">
        <button className="icon-btn" title={isActive ? 'Pausar' : 'Activar'}>
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
          <span className="avatar" style={{ background: '#52525b', width: 26, height: 26, fontSize: 10 }}>
            {r.autor.split(' ').map((s) => s[0]).slice(0, 2).join('')}
          </span>
          <div>
            <div className="text-sm fw-500">{r.autor}</div>
            <div className="text-xxs muted">{r.fecha}</div>
          </div>
        </div>
        <div className="mkt-stars">
          {[1,2,3,4,5].map((n) => (
            <IconStar key={n} size={12} filled={n <= r.estrellas} color={n <= r.estrellas ? '#F59E0B' : 'var(--border-strong)'} />
          ))}
        </div>
      </div>
      <div className="mkt-resena-body text-sm">"{r.texto}"</div>
      <div className={'mkt-resena-resp ' + (r.respuesta === 'pendiente' ? 'is-pending' : '')}>
        <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
          <span className="ai-badge">
            <IconBot size={10} /><span>agente IA</span>
          </span>
          {r.respuesta === 'auto'
            ? <span className="tag ok" style={{ height: 17 }}><IconCheck size={9} sw={2.4} />respondido</span>
            : <span className="tag warn" style={{ height: 17 }}>requiere revisión</span>
          }
        </div>
        <div className="text-xs soft">{r.respIA}</div>
        {r.respuesta === 'pendiente' && (
          <div className="flex items-center gap-2" style={{ marginTop: 8 }}>
            <button className="btn sm">Enviar respuesta</button>
            <button className="btn ghost sm">Editar</button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ViewMarketing() {
  const totalInversion = CAMPANIAS.reduce((s, c) => s + c.inversion, 0);
  const totalGasto = CAMPANIAS.reduce((s, c) => s + c.gasto, 0);
  const totalLeads = CAMPANIAS.reduce((s, c) => s + c.leads, 0);
  const totalTurnos = CAMPANIAS.reduce((s, c) => s + c.turnos, 0);
  const conv = ((totalTurnos / totalLeads) * 100).toFixed(0);
  const ingresoEstimado = totalTurnos * 920;
  const roi = ((ingresoEstimado - totalGasto) / totalGasto * 100).toFixed(0);

  const avgStars = (RESENIAS.reduce((s, r) => s + r.estrellas, 0) / RESENIAS.length).toFixed(1);
  const pendientes = RESENIAS.filter((r) => r.respuesta === 'pendiente').length;

  const estadoLeadInfo = {
    'agendó':         { cls: 'tag ok' },
    'respondió':      { cls: 'tag accent' },
    'sin contestar':  { cls: 'tag warn' },
  };
  const fuenteColor = { meta: '#0866FF', google: '#4285F4' };

  return (
    <div className="page">
      <PageHeader
        title="Marketing"
        subtitle="Campañas en Google y Meta · leads · reseñas de Google Maps"
        actions={
          <>
            <button className="btn ghost sm">Reporte mensual</button>
            <button className="btn accent sm"><IconPlus size={13} /> Nueva campaña</button>
          </>
        }
      />

      {/* KPIs */}
      <div className="grid-4">
        <div className="card stat">
          <div className="stat-label">Inversión del mes</div>
          <div className="stat-value">{FMT_UYU(totalGasto)}</div>
          <div className="text-xs muted">de {FMT_UYU(totalInversion)} presupuestado</div>
        </div>
        <div className="card stat">
          <div className="stat-label">Leads generados</div>
          <div className="stat-value">{totalLeads}</div>
          <div className="text-xs muted">{totalTurnos} → turnos · conv. {conv}%</div>
        </div>
        <div className="card stat">
          <div className="stat-label">Ingresos atribuidos</div>
          <div className="stat-value">{FMT_UYU(ingresoEstimado)}</div>
          <div className="stat-delta up" style={{ marginTop: 4 }}>
            <IconTrend size={12} />
            <span>ROI +{roi}%</span>
          </div>
        </div>
        <div className="card stat">
          <div className="stat-label">Reseñas Google</div>
          <div className="stat-value">
            <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4 }}>
              {avgStars}<IconStar size={16} filled color="#F59E0B" />
            </span>
          </div>
          <div className="text-xs muted">{RESENIAS.length} este mes · {pendientes} sin responder</div>
        </div>
      </div>

      {/* Sugerencia del agente */}
      <div className="alert agent" style={{ marginTop: 16 }}>
        <IconBot size={16} color="var(--agent)" />
        <div className="alert-body">
          <div className="alert-text">
            <b>Sugerencia:</b> la campaña "Reactivación" tiene el mejor CPA ($66) y conversión (75%).
            Reasignar $1.500 desde "Lanzamiento cuponeras" (pausada) podría generar +12 turnos.
          </div>
        </div>
        <button className="btn sm">Aplicar</button>
        <button className="btn ghost sm">Ver detalle</button>
      </div>

      {/* Campañas */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-hd">
          <span>Campañas activas</span>
          <div className="flex items-center gap-2">
            <span className="seg-control">
              <button className="is-active">Mes</button>
              <button>7 días</button>
              <button>90 días</button>
            </span>
          </div>
        </div>
        <div className="mkt-camp-table-hd">
          <span>Campaña</span>
          <span>Estado</span>
          <span style={{ textAlign: 'right' }}>Gasto</span>
          <span style={{ textAlign: 'right' }}>Impresiones</span>
          <span style={{ textAlign: 'right' }}>Clicks</span>
          <span style={{ textAlign: 'right' }}>Leads</span>
          <span style={{ textAlign: 'right' }}>CPA</span>
          <span></span>
        </div>
        <div className="row-list">
          {CAMPANIAS.map((c) => <CampaignRow key={c.id} c={c} />)}
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 16, alignItems: 'start' }}>
        {/* Leads recientes */}
        <div className="card">
          <div className="card-hd">
            <span>Leads recientes</span>
            <button className="btn ghost sm">Ver todos <IconArrowR size={11} /></button>
          </div>
          <div className="row-list">
            {LEADS_MARKETING.map((l, i) => {
              const info = estadoLeadInfo[l.estado];
              return (
                <div className="row" key={i} style={{ gridTemplateColumns: '1fr 1fr 100px 80px' }}>
                  <div>
                    <div className="text-sm fw-500">{l.nombre}</div>
                    <div className="text-xxs muted">{l.hora}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="mkt-plat-dot" style={{ background: fuenteColor[l.fuente] }} />
                    <span className="text-xs truncate">{l.campaign}</span>
                  </div>
                  <div><span className={info.cls}>{l.estado}</span></div>
                  <div><button className="btn ghost sm">Abrir</button></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reseñas Google Maps */}
        <div className="card">
          <div className="card-hd">
            <div>
              <span>Reseñas de Google Maps</span>
              <div className="text-xxs muted">Respuestas automáticas con IA</div>
            </div>
            <button className="btn ghost sm">Abrir en Google</button>
          </div>
          <div className="mkt-resenas">
            {RESENIAS.slice(0, 4).map((r) => <ResenaCard key={r.id} r={r} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
