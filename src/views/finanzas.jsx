// Vista Finanzas — facturación, por barbero, gastos, propinas, cuponeras, stats.
// Se alimenta en vivo de las ventas que genera el cobro en la Agenda.

import { useState } from 'react';
import { useStore } from '../store';
import { BARBEROS, METODOS_PAGO, METRICAS, FMT_UYU } from '../data';
import { Modal, Field, TextInput, SelectInput } from '../ui';
import { PageHeader } from '../shell';
import { IconCash, IconTrend, IconTrendD, IconChart, IconPlus, IconPaper, IconTicket } from '../icons';

const barberoById = Object.fromEntries(BARBEROS.map((b) => [b.id, b]));
const metodoNombre = Object.fromEntries(METODOS_PAGO.map((m) => [m.id, m.nombre]));
const CAT_GASTO = ['Insumos', 'Productos', 'Servicios', 'Alquiler', 'Marketing', 'Mantenimiento', 'Sueldos', 'Otros'];

function GastoModal({ open, onClose }) {
  const { actions } = useStore();
  const [categoria, setCategoria] = useState('Insumos');
  const [concepto, setConcepto] = useState('');
  const [monto, setMonto] = useState('');
  const [metodo, setMetodo] = useState('efectivo');
  const submit = () => {
    if (!concepto.trim() || !Number(monto)) return;
    actions.addGasto({ categoria, concepto: concepto.trim(), monto: Number(monto), metodo });
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="Registrar gasto" subtitle="Egreso del salón"
      footer={<><button className="btn" onClick={onClose}>Cancelar</button><button className="btn accent" onClick={submit} disabled={!concepto.trim() || !Number(monto)}><IconPlus size={13} /> Registrar</button></>}>
      <div className="form-stack">
        <div className="form-grid">
          <Field label="Categoría"><SelectInput value={categoria} onChange={setCategoria} options={CAT_GASTO} /></Field>
          <Field label="Método"><SelectInput value={metodo} onChange={setMetodo} options={METODOS_PAGO.map((m) => ({ value: m.id, label: m.nombre }))} /></Field>
        </div>
        <Field label="Concepto" required><TextInput value={concepto} onChange={setConcepto} placeholder="Ej: reposición de toallas" /></Field>
        <Field label="Monto ($)" required><input className="inp" type="number" min="0" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="0" /></Field>
      </div>
    </Modal>
  );
}

function Stat({ label, value, sub, icon, color }) {
  return (
    <div className="card stat">
      <div className="stat-label">{icon}<span>{label}</span></div>
      <div className="stat-value" style={color ? { color } : undefined}>{value}</div>
      {sub && <div className="text-xs muted">{sub}</div>}
    </div>
  );
}

export function ViewFinanzas() {
  const { state } = useStore();
  const [tab, setTab] = useState('facturacion');
  const [gastoOpen, setGastoOpen] = useState(false);

  const ventas = state.ventas;
  const facturacion = ventas.reduce((s, v) => s + v.total, 0);
  const propinas = ventas.reduce((s, v) => s + (v.propina || 0), 0);
  const gastosTotal = state.gastos.reduce((s, g) => s + g.monto, 0);
  const neto = facturacion - gastosTotal;

  const porBarbero = BARBEROS.map((b) => {
    const vs = ventas.filter((v) => v.barbero === b.id);
    const base = METRICAS.porBarbero.find((x) => x.id === b.id) || { ingresos: 0 };
    return {
      ...b,
      ingresos: base.ingresos + vs.reduce((s, v) => s + v.total, 0),
      propinas: vs.reduce((s, v) => s + (v.propina || 0), 0),
    };
  }).sort((a, b) => b.ingresos - a.ingresos);
  const maxIng = Math.max(...porBarbero.map((b) => b.ingresos), 1);

  const maxSerie = Math.max(...METRICAS.serie, 1);
  const cupVendidas = state.cuponeras.reduce((s, c) => s + c.vendidas, 0);
  const cupIngreso = state.cuponeras.reduce((s, c) => s + c.vendidas * c.precioPack, 0);

  return (
    <div className="page">
      <PageHeader title="Finanzas" subtitle="Facturación, gastos, propinas y estadísticas · mayo 2026"
        actions={<><button className="btn sm">Exportar</button><button className="btn accent sm" onClick={() => setGastoOpen(true)}><IconPlus size={13} /> Registrar gasto</button></>} />

      <div className="grid-4">
        <Stat label="Facturación del mes" icon={<IconCash size={13} />} value={FMT_UYU(facturacion)} sub={`${ventas.length} ventas`} />
        <Stat label="Propinas" icon={<IconTrend size={13} />} value={FMT_UYU(propinas)} sub="100% al barbero" color="var(--ok)" />
        <Stat label="Gastos" icon={<IconTrendD size={13} />} value={FMT_UYU(gastosTotal)} sub={`${state.gastos.length} registros`} color="var(--danger)" />
        <Stat label="Neto" icon={<IconChart size={13} />} value={FMT_UYU(neto)} sub="facturación − gastos" />
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-hd"><span>Ingresos · últimos 30 días</span><span className="text-xs muted mono">{FMT_UYU(METRICAS.ingresosMes)}</span></div>
        <div className="fin-chart">
          {METRICAS.serie.map((v, i) => (
            <div key={i} className="fin-bar" style={{ height: (v / maxSerie) * 100 + '%' }} title={FMT_UYU(v * 1000)} />
          ))}
        </div>
      </div>

      <div className="seg-control" style={{ margin: '16px 0' }}>
        {[['facturacion', 'Facturación'], ['barbero', 'Por barbero'], ['gastos', 'Gastos'], ['cuponeras', 'Cuponeras']].map(([k, l]) => (
          <button key={k} className={tab === k ? 'is-active' : ''} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === 'facturacion' && (
        <div className="card">
          <div className="cli-table-hd" style={{ gridTemplateColumns: '80px 1.4fr 1fr 1.6fr 1fr 100px' }}>
            <span>Hora</span><span>Cliente</span><span>Barbero</span><span>Detalle</span><span>Pago</span><span style={{ textAlign: 'right' }}>Total</span>
          </div>
          <div className="row-list">
            {ventas.map((v) => (
              <div className="row" key={v.id} style={{ gridTemplateColumns: '80px 1.4fr 1fr 1.6fr 1fr 100px' }}>
                <div className="text-xs mono muted">{v.hora}</div>
                <div className="text-sm fw-500 truncate">{v.clienteNombre}</div>
                <div className="text-xs"><i className="ag-leg-dot" style={{ background: barberoById[v.barbero]?.color, marginRight: 6 }} />{barberoById[v.barbero]?.apodo}</div>
                <div className="text-xs muted truncate">{v.items.map((it) => `${it.qty}× ${it.nombre}`).join(' · ')}{v.propina ? ` · prop. ${FMT_UYU(v.propina)}` : ''}</div>
                <div className="text-xs muted truncate">{v.pagos.map((p) => metodoNombre[p.metodo]).join(', ')}</div>
                <div className="text-sm fw-600 mono" style={{ textAlign: 'right' }}>{FMT_UYU(v.total)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'barbero' && (
        <div className="card" style={{ padding: '8px 0' }}>
          {porBarbero.map((b) => (
            <div className="fin-barb-row" key={b.id}>
              <span className="avatar" style={{ background: b.color }}>{b.inicial}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm fw-600">{b.nombre}</span>
                  <span className="text-sm fw-600 mono">{FMT_UYU(b.ingresos)}</span>
                </div>
                <div className="fin-track"><span style={{ width: (b.ingresos / maxIng) * 100 + '%', background: b.color }} /></div>
                <div className="text-xxs muted" style={{ marginTop: 3 }}>{b.rol} · propinas {FMT_UYU(b.propinas)} · arrendamiento {b.arrend}%</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'gastos' && (
        <div className="card">
          <div className="cli-table-hd" style={{ gridTemplateColumns: '110px 1fr 1.8fr 1fr 110px' }}>
            <span>Fecha</span><span>Categoría</span><span>Concepto</span><span>Método</span><span style={{ textAlign: 'right' }}>Monto</span>
          </div>
          <div className="row-list">
            {state.gastos.map((g) => (
              <div className="row" key={g.id} style={{ gridTemplateColumns: '110px 1fr 1.8fr 1fr 110px' }}>
                <div className="text-xs mono muted">{g.fecha}</div>
                <div><span className="tag">{g.categoria}</span></div>
                <div className="text-sm truncate">{g.concepto}</div>
                <div className="text-xs muted">{metodoNombre[g.metodo] || g.metodo}</div>
                <div className="text-sm fw-600 mono" style={{ textAlign: 'right', color: 'var(--danger)' }}>− {FMT_UYU(g.monto)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'cuponeras' && (
        <>
          <div className="grid-3">
            <Stat label="Cuponeras vendidas" icon={<IconTicket size={13} />} value={cupVendidas} sub="este mes" />
            <Stat label="Ingreso por cuponeras" icon={<IconCash size={13} />} value={FMT_UYU(cupIngreso)} sub="prepago" color="var(--ok)" />
            <Stat label="Activas" icon={<IconPaper size={13} />} value={state.cuponeras.filter((c) => c.activo).length} sub={`de ${state.cuponeras.length}`} />
          </div>
          <div className="card" style={{ marginTop: 16 }}>
            <div className="cli-table-hd" style={{ gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1fr' }}>
              <span>Cuponera</span><span>Vendidas</span><span>Usados</span><span>Restantes</span><span style={{ textAlign: 'right' }}>Ingreso</span>
            </div>
            <div className="row-list">
              {state.cuponeras.map((c) => (
                <div className="row" key={c.id} style={{ gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1fr' }}>
                  <div className="text-sm fw-500">{c.nombre}</div>
                  <div className="text-sm mono">{c.vendidas}</div>
                  <div className="text-sm mono muted">{c.usados}</div>
                  <div className="text-sm mono muted">{c.restantes}</div>
                  <div className="text-sm fw-600 mono" style={{ textAlign: 'right' }}>{FMT_UYU(c.vendidas * c.precioPack)}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <GastoModal open={gastoOpen} onClose={() => setGastoOpen(false)} />
    </div>
  );
}
