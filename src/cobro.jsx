// CobroDrawer — el carrito "Nuevo Cobro" (slide-over global).
// Se abre desde un turno de la agenda o como venta walk-in (sin reserva).
// Permite: cliente + empleado, agregar servicios/productos, cantidades,
// descuento, propina (con accesos rápidos %), métodos de pago (divisibles)
// y registrar el cobro (muta turno → cobrado, descuenta stock, crea venta).

import { useState } from 'react';
import { useStore, cobroTotals } from './store';
import { BARBEROS, METODOS_PAGO, FMT_UYU } from './data';
import { Drawer, Field, NumberStepper } from './ui';
import {
  IconCash, IconScissors, IconPlus, IconX, IconSearch, IconUsers, IconStar, IconCheck, IconSparkle,
} from './icons';
import './cobro.css';

const AHORA = '10:42';
const barberoById = Object.fromEntries(BARBEROS.map((b) => [b.id, b]));

export function CobroDrawer() {
  const { state, actions } = useStore();
  const c = state.cobro;
  const [picker, setPicker] = useState('servicio'); // 'servicio' | 'producto' | null
  const [q, setQ] = useState('');

  const t = cobroTotals(c);
  const empleado = barberoById[c.empleadoId];
  // Dato del cliente (gusto del café / preferencia) traído de su ficha
  const ficha = c.clienteNombre.trim()
    ? state.clientes.find((cl) => cl.nombre.toLowerCase() === c.clienteNombre.trim().toLowerCase())
    : null;

  const addServicio = (s) => actions.addCobroItem({ tipo: 'servicio', refId: s.id, nombre: s.nombre, precio: s.precio });
  const addProducto = (p) => actions.addCobroItem({ tipo: 'producto', refId: p.id, nombre: p.nombre, precio: p.precio });

  const togglePago = (m) => {
    const has = c.pagos.find((p) => p.metodo === m.id);
    if (has) actions.setCobroPagos(c.pagos.filter((p) => p.metodo !== m.id));
    else actions.setCobroPagos([...c.pagos, { metodo: m.id, monto: Math.max(0, Math.round(t.falta)) }]);
  };
  const setPagoMonto = (id, monto) =>
    actions.setCobroPagos(c.pagos.map((p) => (p.metodo === id ? { ...p, monto } : p)));

  const setPropinaPct = (pct) =>
    actions.patchCobro({ propina: Math.round(t.subtotal * pct / 100) });

  const servFiltered = state.servicios.filter((s) => s.nombre.toLowerCase().includes(q.toLowerCase()));
  const prodFiltered = state.productos.filter((p) => p.nombre.toLowerCase().includes(q.toLowerCase()));

  const footer = (
    <div className="cb-checkout">
      <div className="cb-totrow"><span>Importe</span><span className="mono">{FMT_UYU(t.subtotal)}</span></div>
      {t.descuento > 0 && (
        <div className="cb-totrow cb-totrow-neg"><span>Descuento</span><span className="mono">– {FMT_UYU(t.descuento)}</span></div>
      )}
      {t.propina > 0 && (
        <div className="cb-totrow"><span>Propina</span><span className="mono">{FMT_UYU(t.propina)}</span></div>
      )}
      <div className="cb-totrow cb-impuestos"><span>Impuestos <i>· IVA incluido</i></span><span className="mono">{FMT_UYU(0)}</span></div>
      <div className="cb-totrow cb-total"><span>Total</span><span className="mono">{FMT_UYU(t.total)}</span></div>
      {c.pagos.length > 0 && t.falta !== 0 && (
        <div className={'cb-falta' + (t.falta < 0 ? ' is-vuelto' : '')}>
          {t.falta > 0 ? `Falta ${FMT_UYU(t.falta)}` : `Vuelto ${FMT_UYU(-t.falta)}`}
        </div>
      )}
      <button
        className="btn accent cb-cobrar"
        disabled={c.items.length === 0}
        onClick={() => actions.confirmCobro(AHORA)}
      >
        <IconCash size={15} /> Cobrar {c.items.length > 0 ? FMT_UYU(t.total) : ''}
      </button>
    </div>
  );

  return (
    <Drawer
      open={c.open}
      onClose={actions.closeCobro}
      title="Nuevo Cobro"
      subtitle={c.mode === 'turno' ? 'Turno de la agenda' : 'Venta sin reserva (walk-in)'}
      icon={<IconCash size={16} />}
      width={440}
      footer={footer}
    >
      {/* Cliente + Empleado */}
      <div className="cb-meta">
        <Field label="Cliente">
          <div className="cb-inp-icon">
            <IconUsers size={14} />
            <input
              className="inp" list="cb-clientes" placeholder="Nombre del cliente o walk-in"
              value={c.clienteNombre}
              onChange={(e) => actions.patchCobro({ clienteNombre: e.target.value })}
            />
            <datalist id="cb-clientes">
              {state.clientes.map((cl) => <option key={cl.id} value={cl.nombre} />)}
            </datalist>
          </div>
        </Field>
        <Field label="Empleado">
          <div className="cb-inp-icon">
            <IconStar size={14} />
            <select
              className="inp sel" value={c.empleadoId}
              onChange={(e) => actions.patchCobro({ empleadoId: e.target.value })}
            >
              {BARBEROS.map((b) => <option key={b.id} value={b.id}>{b.nombre} · {b.apodo}</option>)}
            </select>
          </div>
        </Field>
      </div>

      {/* Ficha rápida del cliente — preferencias / gusto del café */}
      {ficha && (ficha.notas || (ficha.pref && ficha.pref !== '—')) && (
        <div className="cb-ficha">
          <IconSparkle size={13} color="var(--agent)" />
          <div style={{ minWidth: 0 }}>
            {ficha.pref && ficha.pref !== '—' && <div className="cb-ficha-pref">Preferencia: {ficha.pref}</div>}
            {ficha.notas && <div className="cb-ficha-nota">{ficha.notas}</div>}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="cb-items">
        {c.items.length === 0 && (
          <div className="cb-empty">Añadí un servicio o producto para empezar.</div>
        )}
        {c.items.map((it) => (
          <div className="cb-item" key={it.key}>
            <span className={'cb-item-ic cb-item-ic-' + it.tipo}>
              {it.tipo === 'servicio' ? <IconScissors size={13} /> : <IconCash size={13} />}
            </span>
            <div className="cb-item-main">
              <div className="cb-item-name">{it.nombre}</div>
              <div className="cb-item-unit mono">{FMT_UYU(it.precio)} c/u</div>
            </div>
            <NumberStepper value={it.qty} min={1} onChange={(v) => actions.setCobroQty(it.key, v)} />
            <span className="cb-item-sub mono">{FMT_UYU(it.precio * it.qty)}</span>
            <button className="cb-item-x" onClick={() => actions.removeCobroItem(it.key)} aria-label="Quitar"><IconX size={13} /></button>
          </div>
        ))}
      </div>

      {/* Add picker */}
      <div className="cb-add">
        <div className="cb-add-tabs">
          <button className={picker === 'servicio' ? 'is-active' : ''} onClick={() => setPicker('servicio')}>
            <IconScissors size={12} /> Servicios
          </button>
          <button className={picker === 'producto' ? 'is-active' : ''} onClick={() => setPicker('producto')}>
            <IconCash size={12} /> Productos
          </button>
        </div>
        <div className="cb-inp-icon cb-search">
          <IconSearch size={13} />
          <input className="inp" placeholder="Buscar para añadir…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="cb-picker scroll">
          {picker === 'servicio'
            ? servFiltered.map((s) => (
                <button className="cb-pick" key={s.id} onClick={() => addServicio(s)}>
                  <span className="cb-pick-name">{s.nombre}</span>
                  <span className="cb-pick-meta mono">{s.dur}m</span>
                  <span className="cb-pick-price mono">{FMT_UYU(s.precio)}</span>
                  <IconPlus size={13} />
                </button>
              ))
            : prodFiltered.map((p) => (
                <button className="cb-pick" key={p.id} onClick={() => addProducto(p)} disabled={p.stock <= 0}>
                  <span className="cb-pick-name">{p.nombre}</span>
                  <span className={'cb-pick-stock' + (p.stock <= p.stockMin ? ' is-low' : '')}>{p.stock > 0 ? `${p.stock} en stock` : 'Sin stock'}</span>
                  <span className="cb-pick-price mono">{FMT_UYU(p.precio)}</span>
                  <IconPlus size={13} />
                </button>
              ))}
        </div>
      </div>

      {/* Descuento + Propina */}
      <div className="cb-adjust">
        <Field label="Descuento ($)">
          <input className="inp" type="number" min="0" value={c.descuento || ''} placeholder="0"
                 onChange={(e) => actions.patchCobro({ descuento: Number(e.target.value) || 0 })} />
        </Field>
        <Field label="Propina">
          <div className="cb-tip">
            <input className="inp" type="number" min="0" value={c.propina || ''} placeholder="0"
                   onChange={(e) => actions.patchCobro({ propina: Number(e.target.value) || 0 })} />
            <div className="cb-tip-pct">
              {[10, 15, 20].map((pct) => (
                <button key={pct} onClick={() => setPropinaPct(pct)}>{pct}%</button>
              ))}
            </div>
          </div>
        </Field>
      </div>

      {/* Métodos de pago */}
      <div className="cb-pagos">
        <div className="field-lbl" style={{ marginBottom: 8 }}>Método de pago</div>
        <div className="cb-pago-chips">
          {METODOS_PAGO.map((m) => {
            const on = !!c.pagos.find((p) => p.metodo === m.id);
            return (
              <button key={m.id} className={'cb-pago-chip' + (on ? ' is-on' : '')} onClick={() => togglePago(m)}>
                {on && <IconCheck size={11} sw={2.6} />} {m.nombre}
              </button>
            );
          })}
        </div>
        {c.pagos.map((p) => {
          const m = METODOS_PAGO.find((x) => x.id === p.metodo);
          return (
            <div className="cb-pago-row" key={p.metodo}>
              <span>{m?.nombre}</span>
              <input className="inp mono" type="number" value={p.monto}
                     onChange={(e) => setPagoMonto(p.metodo, Number(e.target.value) || 0)} />
            </div>
          );
        })}
      </div>
    </Drawer>
  );
}
