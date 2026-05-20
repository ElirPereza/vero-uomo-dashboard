// Vista Cuponeras — paquetes prepagos (ej. 12 cortes precio de 10)

import { IconDots, IconCheck, IconPlus, IconArrowR, IconBot, IconSparkle } from '../icons';
import { CUPONERAS, CUPONERAS_CLIENTES, FMT_UYU } from '../data';
import { PageHeader } from '../shell';

function CuponeraCard({ c }) {
  const ahorroPct = Math.round((c.ahorro / (c.incluye * c.precioUnit)) * 100);
  return (
    <div className={'cup-card' + (c.activo ? '' : ' is-inactive')}>
      <div className="cup-card-hd">
        <div>
          <div className="cup-card-title">{c.nombre}</div>
          <div className="cup-card-sv">{c.servicio}</div>
        </div>
        <button className="icon-btn"><IconDots size={14} /></button>
      </div>

      <div className="cup-card-deal">
        <div className="cup-deal-pill">
          <span className="cup-deal-include mono">{c.incluye}</span>
          <span className="cup-deal-sep">×</span>
          <span className="cup-deal-pay mono">{c.paga}</span>
        </div>
        <div className="cup-deal-pay-info">
          <div className="text-xxs muted">Pagás</div>
          <div className="mono fw-600">{FMT_UYU(c.precioPack)}</div>
        </div>
        <div className="cup-deal-save">
          <div className="text-xxs muted">Ahorro</div>
          <div className="mono fw-600" style={{ color: 'var(--ok)' }}>{FMT_UYU(c.ahorro)} · {ahorroPct}%</div>
        </div>
      </div>

      <div className="cup-card-stats">
        <div>
          <div className="cup-stat-val mono">{c.vendidas}</div>
          <div className="cup-stat-lbl">vendidas</div>
        </div>
        <div>
          <div className="cup-stat-val mono">{c.usados}</div>
          <div className="cup-stat-lbl">usados</div>
        </div>
        <div>
          <div className="cup-stat-val mono">{c.restantes}</div>
          <div className="cup-stat-lbl">restantes</div>
        </div>
      </div>

      <div className="cup-card-foot">
        <span className={'tag ' + (c.activo ? 'ok' : '')}>
          <span className="dot" />{c.activo ? 'activa' : 'pausada'}
        </span>
        <button className="btn ghost sm">Editar</button>
      </div>
    </div>
  );
}

export function ViewCuponeras() {
  const activas = CUPONERAS.filter((c) => c.activo);
  const totalVendidas = CUPONERAS.reduce((s, c) => s + c.vendidas, 0);
  const totalIngreso = CUPONERAS.reduce((s, c) => s + c.vendidas * c.precioPack, 0);
  const totalUsados = CUPONERAS.reduce((s, c) => s + c.usados, 0);
  const totalRest = CUPONERAS.reduce((s, c) => s + c.restantes, 0);

  return (
    <div className="page">
      <PageHeader
        title="Cuponeras"
        subtitle="Paquetes prepagos con descuento por volumen"
        actions={
          <>
            <button className="btn ghost sm">Exportar</button>
            <button className="btn accent sm"><IconPlus size={13} /> Nueva cuponera</button>
          </>
        }
      />

      {/* KPIs */}
      <div className="grid-4">
        <div className="card stat">
          <div className="stat-label">Activas</div>
          <div className="stat-value">{activas.length}<span className="text-xs muted fw-500" style={{ marginLeft: 6 }}>de {CUPONERAS.length}</span></div>
        </div>
        <div className="card stat">
          <div className="stat-label">Vendidas este mes</div>
          <div className="stat-value">{totalVendidas}</div>
          <div className="text-xs muted">{totalUsados} cupones consumidos</div>
        </div>
        <div className="card stat">
          <div className="stat-label">Ingreso por cuponeras</div>
          <div className="stat-value">{FMT_UYU(totalIngreso)}</div>
          <div className="text-xs muted">12% de la facturación del mes</div>
        </div>
        <div className="card stat">
          <div className="stat-label">Cupones disponibles</div>
          <div className="stat-value">{totalRest}</div>
          <div className="text-xs muted">en poder de clientes</div>
        </div>
      </div>

      {/* Sugerencia del agente */}
      <div className="alert agent" style={{ marginTop: 16 }}>
        <IconBot size={16} color="var(--agent)" />
        <div className="alert-body">
          <div className="alert-text">
            <b>Sugerencia del agente IA:</b> hay <b>3 clientes VIP</b> sin cuponera activa
            que vienen 3+ veces por mes. Podrías ofrecerles el Pack 12 cortes por WhatsApp.
          </div>
        </div>
        <button className="btn sm">Ver candidatos</button>
        <button className="btn ghost sm">Descartar</button>
      </div>

      {/* Cards de cuponeras */}
      <div className="cup-grid" style={{ marginTop: 16 }}>
        {CUPONERAS.map((c) => <CuponeraCard key={c.id} c={c} />)}

        {/* Card para crear nueva */}
        <button className="cup-card cup-card-new">
          <div className="cup-new-icon"><IconPlus size={20} /></div>
          <div className="text-sm fw-500">Crear cuponera</div>
          <div className="text-xs muted" style={{ textAlign: 'center', maxWidth: 200 }}>
            Definí cantidad, descuento y a qué servicios aplica.
          </div>
        </button>
      </div>

      {/* Clientes con cuponera activa */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-hd">
          <span>Clientes con cuponera activa</span>
          <button className="btn ghost sm">Ver todos <IconArrowR size={11} /></button>
        </div>
        <div className="cli-table-hd" style={{ gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 90px' }}>
          <span>Cliente</span>
          <span>Pack</span>
          <span>Progreso</span>
          <span>Vence</span>
          <span></span>
        </div>
        <div className="row-list">
          {CUPONERAS_CLIENTES.map((c, i) => {
            const pct = (c.usados / c.total) * 100;
            const venceProx = c.vence.includes('jun');
            return (
              <div className="row" key={i} style={{ gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 90px' }}>
                <div className="text-sm fw-500">{c.cliente}</div>
                <div className="text-sm">{c.pack}</div>
                <div className="flex items-center gap-2">
                  <div className="metric-bar" style={{ flex: 1, height: 6 }}>
                    <div style={{ width: pct + '%', background: pct > 80 ? 'var(--warn)' : 'var(--accent)' }} />
                  </div>
                  <span className="text-xxs mono muted">{c.usados}/{c.total}</span>
                </div>
                <div className="text-xs" style={{ color: venceProx ? 'var(--warn)' : 'var(--fg-soft)' }}>{c.vence}</div>
                <div><button className="btn ghost sm">Ver</button></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
