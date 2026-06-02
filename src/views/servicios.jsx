// Vista Servicios y Productos — catálogo, stock automático, promociones, stats.
// El stock de productos baja solo con cada venta cobrada en la Agenda.

import { useState } from 'react';
import { useStore } from '../store';
import { METRICAS, SERVICIOS, FMT_UYU } from '../data';
import { Modal, Field, TextInput, SelectInput } from '../ui';
import { PageHeader } from '../shell';
import { IconScissors, IconCash, IconPlus, IconChart, IconDots, IconClock } from '../icons';

const CAT_PROD = ['Styling', 'Cuidado', 'Barba', 'Accesorio', 'Gift'];
const svById = Object.fromEntries(SERVICIOS.map((s) => [s.id, s.nombre]));

function ServicioModal({ open, onClose }) {
  const { actions } = useStore();
  const [nombre, setNombre] = useState('');
  const [dur, setDur] = useState('30');
  const [precio, setPrecio] = useState('');
  const submit = () => {
    if (!nombre.trim() || !Number(precio)) return;
    actions.createServicio({ nombre: nombre.trim(), dur: Number(dur) || 30, precio: Number(precio) });
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="Nuevo servicio" subtitle="Agregar al catálogo"
      footer={<><button className="btn" onClick={onClose}>Cancelar</button><button className="btn accent" onClick={submit} disabled={!nombre.trim() || !Number(precio)}><IconPlus size={13} /> Crear servicio</button></>}>
      <div className="form-stack">
        <Field label="Nombre" required><TextInput value={nombre} onChange={setNombre} placeholder="Ej: Corte premium" /></Field>
        <div className="form-grid">
          <Field label="Duración (min)"><input className="inp" type="number" min="5" step="5" value={dur} onChange={(e) => setDur(e.target.value)} /></Field>
          <Field label="Precio ($)" required><input className="inp" type="number" min="0" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="0" /></Field>
        </div>
      </div>
    </Modal>
  );
}

function ProductoModal({ open, onClose }) {
  const { actions } = useStore();
  const [f, setF] = useState({ nombre: '', cat: 'Styling', precio: '', costo: '', stock: '', stockMin: '5', sku: '' });
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));
  const submit = () => {
    if (!f.nombre.trim() || !Number(f.precio)) return;
    actions.createProducto({
      nombre: f.nombre.trim(), cat: f.cat, precio: Number(f.precio), costo: Number(f.costo) || 0,
      stock: Number(f.stock) || 0, stockMin: Number(f.stockMin) || 0, sku: f.sku.trim() || 'VU-NEW',
    });
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="Nuevo producto" subtitle="Agregar al inventario"
      footer={<><button className="btn" onClick={onClose}>Cancelar</button><button className="btn accent" onClick={submit} disabled={!f.nombre.trim() || !Number(f.precio)}><IconPlus size={13} /> Crear producto</button></>}>
      <div className="form-stack">
        <Field label="Nombre" required><TextInput value={f.nombre} onChange={set('nombre')} placeholder="Ej: Pomada efecto mate" /></Field>
        <div className="form-grid">
          <Field label="Categoría"><SelectInput value={f.cat} onChange={set('cat')} options={CAT_PROD} /></Field>
          <Field label="SKU"><TextInput value={f.sku} onChange={set('sku')} placeholder="VU-XXX-00" /></Field>
          <Field label="Precio venta ($)" required><input className="inp" type="number" min="0" value={f.precio} onChange={(e) => set('precio')(e.target.value)} /></Field>
          <Field label="Costo ($)"><input className="inp" type="number" min="0" value={f.costo} onChange={(e) => set('costo')(e.target.value)} /></Field>
          <Field label="Stock inicial"><input className="inp" type="number" min="0" value={f.stock} onChange={(e) => set('stock')(e.target.value)} /></Field>
          <Field label="Stock mínimo"><input className="inp" type="number" min="0" value={f.stockMin} onChange={(e) => set('stockMin')(e.target.value)} /></Field>
        </div>
      </div>
    </Modal>
  );
}

function PromoModal({ open, onClose }) {
  const { actions } = useStore();
  const [f, setF] = useState({ nombre: '', tipo: 'servicio', desc: '', unidad: '%', vence: '' });
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));
  const submit = () => {
    if (!f.nombre.trim()) return;
    actions.createPromo({ nombre: f.nombre.trim(), tipo: f.tipo, objetivo: '', desc: Number(f.desc) || 0, unidad: f.unidad, vence: f.vence || '—' });
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="Nueva promoción" subtitle="Descuento sobre servicios o productos"
      footer={<><button className="btn" onClick={onClose}>Cancelar</button><button className="btn accent" onClick={submit} disabled={!f.nombre.trim()}><IconPlus size={13} /> Crear promoción</button></>}>
      <div className="form-stack">
        <Field label="Nombre" required><TextInput value={f.nombre} onChange={set('nombre')} placeholder="Ej: 2x1 en cejas" /></Field>
        <div className="form-grid">
          <Field label="Aplica a"><SelectInput value={f.tipo} onChange={set('tipo')} options={[{ value: 'servicio', label: 'Servicio' }, { value: 'producto', label: 'Producto' }, { value: 'combo', label: 'Combo' }]} /></Field>
          <Field label="Vence"><TextInput value={f.vence} onChange={set('vence')} placeholder="30 jun 2026" /></Field>
          <Field label="Descuento"><input className="inp" type="number" min="0" value={f.desc} onChange={(e) => set('desc')(e.target.value)} /></Field>
          <Field label="Unidad"><SelectInput value={f.unidad} onChange={set('unidad')} options={[{ value: '%', label: '% porcentaje' }, { value: '$', label: '$ monto fijo' }]} /></Field>
        </div>
      </div>
    </Modal>
  );
}

export function ViewServicios() {
  const { state, actions } = useStore();
  const [tab, setTab] = useState('servicios');
  const [modal, setModal] = useState(null); // 'servicio' | 'producto' | 'promo'

  const lowStock = state.productos.filter((p) => p.stock <= p.stockMin).length;
  const valorStock = state.productos.reduce((s, p) => s + p.stock * p.costo, 0);

  const actionBtn = (
    tab === 'servicios' ? <button className="btn accent sm" onClick={() => setModal('servicio')}><IconPlus size={13} /> Nuevo servicio</button>
    : tab === 'productos' ? <button className="btn accent sm" onClick={() => setModal('producto')}><IconPlus size={13} /> Nuevo producto</button>
    : <button className="btn accent sm" onClick={() => setModal('promo')}><IconPlus size={13} /> Nueva promoción</button>
  );

  return (
    <div className="page">
      <PageHeader title="Servicios y productos" subtitle="Catálogo, control de stock y promociones" actions={actionBtn} />

      <div className="grid-4">
        <div className="card stat"><div className="stat-label"><IconScissors size={13} /><span>Servicios</span></div><div className="stat-value">{state.servicios.length}</div></div>
        <div className="card stat"><div className="stat-label"><IconCash size={13} /><span>Productos</span></div><div className="stat-value">{state.productos.length}</div></div>
        <div className="card stat"><div className="stat-label"><IconChart size={13} /><span>Valor de stock</span></div><div className="stat-value">{FMT_UYU(valorStock)}</div><div className="text-xs muted">a costo</div></div>
        <div className="card stat"><div className="stat-label"><span>Stock bajo</span></div><div className="stat-value" style={{ color: lowStock ? 'var(--warn)' : 'var(--fg)' }}>{lowStock}</div><div className="text-xs muted">a reponer</div></div>
      </div>

      <div className="seg-control" style={{ margin: '16px 0' }}>
        {[['servicios', 'Servicios'], ['productos', 'Productos'], ['promos', 'Promociones']].map(([k, l]) => (
          <button key={k} className={tab === k ? 'is-active' : ''} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === 'servicios' && (
        <div className="sv-grid">
          {state.servicios.map((s) => (
            <div className="sv-card" key={s.id}>
              <div className="sv-card-ic"><IconScissors size={16} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="text-sm fw-600 truncate">{s.nombre}</div>
                <div className="text-xxs muted flex items-center gap-1"><IconClock size={11} /> {s.dur} min</div>
              </div>
              <div className="text-sm fw-700 mono">{FMT_UYU(s.precio)}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'productos' && (
        <div className="card">
          <div className="alert" style={{ margin: 12, background: 'var(--bg-soft)' }}>
            <IconCash size={15} color="var(--accent)" />
            <div className="alert-body"><div className="text-xs">El <b>stock se descuenta automáticamente</b> con cada venta cobrada en la Agenda.</div></div>
          </div>
          <div className="cli-table-hd" style={{ gridTemplateColumns: '1.6fr 1fr 1fr 1fr 90px 120px' }}>
            <span>Producto</span><span>Categoría</span><span>Precio</span><span>Costo</span><span style={{ textAlign: 'right' }}>Stock</span><span>Estado</span>
          </div>
          <div className="row-list">
            {state.productos.map((p) => {
              const low = p.stock <= p.stockMin;
              const out = p.stock <= 0;
              return (
                <div className="row" key={p.id} style={{ gridTemplateColumns: '1.6fr 1fr 1fr 1fr 90px 120px' }}>
                  <div><div className="text-sm fw-500 truncate">{p.nombre}</div><div className="text-xxs muted mono">{p.sku}</div></div>
                  <div className="text-xs muted">{p.cat}</div>
                  <div className="text-sm mono">{FMT_UYU(p.precio)}</div>
                  <div className="text-xs muted mono">{FMT_UYU(p.costo)}</div>
                  <div className="text-sm fw-600 mono" style={{ textAlign: 'right', color: low ? 'var(--warn)' : 'var(--fg)' }}>{p.stock}</div>
                  <div>{out ? <span className="tag danger">Sin stock</span> : low ? <span className="tag warn">Stock bajo</span> : <span className="tag ok"><span className="dot" />OK</span>}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'promos' && (
        <div className="sv-grid">
          {state.promos.map((p) => (
            <div className={'sv-promo' + (p.activa ? '' : ' is-off')} key={p.id}>
              <div className="flex items-center justify-between">
                <span className="sv-promo-badge">{p.unidad === '%' ? `${p.desc}%` : `−${FMT_UYU(p.desc)}`}</span>
                <button className="icon-btn"><IconDots size={14} /></button>
              </div>
              <div className="text-sm fw-600" style={{ marginTop: 8 }}>{p.nombre}</div>
              <div className="text-xxs muted">{p.tipo} · vence {p.vence}</div>
              <div className="flex items-center justify-between" style={{ marginTop: 12 }}>
                <span className={'tag ' + (p.activa ? 'ok' : '')}><span className="dot" />{p.activa ? 'activa' : 'pausada'}</span>
                <button className="btn ghost sm" onClick={() => actions.togglePromo(p.id)}>{p.activa ? 'Pausar' : 'Activar'}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Estadísticas: top servicios */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-hd"><span>Servicios más vendidos</span><span className="text-xs muted">este mes</span></div>
        <div style={{ padding: '10px 16px' }}>
          {METRICAS.porServicio.map((s) => (
            <div key={s.id} className="flex items-center gap-3" style={{ marginBottom: 8 }}>
              <span className="text-sm" style={{ width: 150, flexShrink: 0 }}>{svById[s.id] || s.id}</span>
              <div className="fin-track" style={{ flex: 1, marginTop: 0 }}><span style={{ width: s.pct + '%', background: 'var(--accent)' }} /></div>
              <span className="text-xs mono muted" style={{ width: 34, textAlign: 'right' }}>{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <ServicioModal open={modal === 'servicio'} onClose={() => setModal(null)} />
      <ProductoModal open={modal === 'producto'} onClose={() => setModal(null)} />
      <PromoModal open={modal === 'promo'} onClose={() => setModal(null)} />
    </div>
  );
}
